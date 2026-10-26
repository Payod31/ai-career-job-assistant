"""Server-side resume text extraction for uploaded files.

Used by POST /api/analyze-resume and POST /api/resume-studio when a raw file is
uploaded instead of plain text. The extraction is deliberately conservative: it
returns either usable text or a clear, machine-readable reason it could not.
We never silently return an empty or wrong document to the model.

Scanned (image-only) PDFs have no text layer. We DETECT that and report it so the
UI can ask the user to paste the text (or use an OCR service). OCR itself is not
bundled here — that would pull in a heavy native dependency and is a deliberate
scope boundary.
"""

import os

# Magic-bytes sniffs so we can reject clearly unsupported binaries even when a
# client lies about the file name / content type.
_PDF_MAGIC = b"%PDF-"
_DOCX_ZIP = b"PK\x03\x04"


class ExtractionError(Exception):
    """Raised when a file cannot be turned into usable resume text."""

    def __init__(self, code, message):
        super().__init__(message)
        self.code = code        # stable, safe-to-surface machine code
        self.message = message  # safe to show to the user (no secrets)


def _is_pdf(buf):
    return buf[:5] == _PDF_MAGIC


def _is_docx(buf):
    # A .docx is a ZIP (PK\x03\x04) containing word/document.xml. We sniff the
    # leading bytes; the actual parse validates the interior.
    return buf[:4] == _DOCX_ZIP


def extract_text(data, filename, content_type):
    """Extract plain text from raw file bytes.

    Returns (text, notes) where `text` is a possibly-empty string and `notes`
    is a short human-safe note. Raises ExtractionError with a stable `.code`
    for the clear cases: unsupported / empty / scanned_pdf / corrupt.
    """
    data = bytes(data or b"")
    if not data:
        raise ExtractionError("empty_file", "The uploaded file is empty (0 bytes).")

    name = os.path.basename(str(filename or "")).lower()
    ext = os.path.splitext(name)[1]
    raw_len = len(data)

    # --- decide the real format (magic bytes beat the extension) ---
    if _is_pdf(data):
        fmt = "pdf"
    elif _is_docx(data):
        fmt = "docx"
    elif ext in (".txt", ".text", ".md", ".markdown", ".rtf") or not ext:
        # Plain-text-ish. RTF is not parsed as text; treat it as unsupported.
        if ext == ".rtf":
            raise ExtractionError("unsupported",
                "RTF is not supported. Export as .txt, .pdf or .docx and upload again.")
        fmt = "txt"
    elif ext in (".doc",):
        raise ExtractionError("unsupported",
            "Legacy .doc is not supported. Save it as .docx, .pdf or .txt and upload again.")
    else:
        # No recognized extension AND no recognized magic bytes -> unsupported.
        raise ExtractionError(
            "unsupported",
            "Unsupported file type. Please upload a .pdf, .docx or .txt resume.")

    # --- extract per format ---
    if fmt == "pdf":
        text = _extract_pdf(data)
    elif fmt == "docx":
        text = _extract_docx(data)
    else:
        text = _extract_txt(data, filename)

    text = _clean(text)

    if not text:
        # A PDF that parsed but yielded no text is almost certainly a scanned,
        # image-only document. Report that specifically.
        if fmt == "pdf":
            raise ExtractionError(
                "scanned_pdf",
                "This PDF has no text layer — it looks like a scanned image. "
                "OCR is not bundled. Either paste the resume text directly, "
                "or re-export the PDF so it contains selectable text.")
        raise ExtractionError(
            "empty_document",
            "The file opened but contains no usable text. Paste your resume text instead.")

    return text, "extracted %d chars from %s" % (len(text), fmt)


def _extract_pdf(data):
    from pypdf import PdfReader  # local import: only needed when a PDF arrives
    import io
    try:
        reader = PdfReader(io.BytesIO(data))
    except Exception:
        raise ExtractionError("corrupt_pdf",
            "This PDF could not be read (it may be damaged or password-protected). "
            "Re-export it, or paste the text directly.")
    pages = []
    for page in reader.pages:
        try:
            pages.append(page.extract_text() or "")
        except Exception:
            pages.append("")
    return "\n".join(pages)


def _extract_docx(data):
    import docx  # python-docx
    import io
    try:
        document = docx.Document(io.BytesIO(data))
    except Exception:
        raise ExtractionError("corrupt_docx",
            "This .docx could not be read (it may be damaged). "
            "Re-save it, or paste the text directly.")
    parts = []
    for para in document.paragraphs:
        if para.text.strip():
            parts.append(para.text)
    # Include table text (common in table-structured resumes).
    try:
        for table in document.tables:
            for row in table.rows:
                cells = [c.text.strip() for c in row.cells if c.text.strip()]
                if cells:
                    parts.append(" ".join(cells))
    except Exception:
        pass
    return "\n".join(parts)


def _extract_txt(data, filename):
    # Try the common text encodings; fall back to utf-8 with replacement so a
    # weird file never crashes the request — it just may extract poorly.
    for enc in ("utf-8", "utf-16", "latin-1"):
        try:
            return data.decode(enc)
        except (UnicodeDecodeError, LookupError):
            continue
    return data.decode("utf-8", errors="replace")


def _clean(text):
    # Normalize line endings and collapse runs of blank lines so the model sees
    # tidy input without changing the candidate's actual words.
    text = str(text or "").replace("\r\n", "\n").replace("\r", "\n")
    lines = [ln.rstrip() for ln in text.split("\n")]
    out, blank = [], 0
    for ln in lines:
        if ln.strip() == "":
            blank += 1
            if blank <= 1:
                out.append("")
        else:
            blank = 0
            out.append(ln)
    return "\n".join(out).strip()
