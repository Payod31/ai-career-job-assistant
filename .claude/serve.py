"""Static file server that honors the PORT env var (for preview_start)."""
import http.server
import os

port = int(os.environ.get('PORT', '8000'))
httpd = http.server.HTTPServer(('127.0.0.1', port), http.server.SimpleHTTPRequestHandler)
print('Serving on 127.0.0.1:%d' % port, flush=True)
httpd.serve_forever()
