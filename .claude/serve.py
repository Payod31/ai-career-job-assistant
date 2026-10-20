"""Static file server honoring PORT (for preview_start). Threading so one
stalled connection can't block the rest; no-store hints so the browser never
serves stale app code during dev."""
import http.server
import os

port = int(os.environ.get('PORT', '8000'))


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()


httpd = http.server.ThreadingHTTPServer(('127.0.0.1', port), Handler)
print('Serving on 127.0.0.1:%d (threading, no-store)' % port, flush=True)
httpd.serve_forever()
