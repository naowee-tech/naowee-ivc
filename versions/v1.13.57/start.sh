#!/usr/bin/env bash
# Naowee IVC · servidor local
# ─────────────────────────────────────────────────────────────────
# Uso:   ./start.sh
# Sirve el prototype/ en http://localhost:4910 y abre el browser.
#
# IMPORTANTE: NO abras los HTML via file://. Chrome bloquea cosas
# por seguridad (cada file:// es un origin único → localStorage no
# se comparte, navegación cross-página falla, etc). Siempre usa
# este script.
# ─────────────────────────────────────────────────────────────────

set -e
cd "$(dirname "$0")"

PORT=4910
URL="http://localhost:${PORT}/prototype/coordinador/bandeja.html"

# Liberar puerto si quedó algo colgado
if lsof -ti:${PORT} > /dev/null 2>&1; then
  echo "→ Puerto ${PORT} ocupado, liberándolo..."
  lsof -ti:${PORT} | xargs kill -9 2>/dev/null || true
  sleep 1
fi

echo "→ Arrancando servidor en http://localhost:${PORT}"
echo "→ Bandeja del Coordinador: ${URL}"
echo "→ Ctrl+C para detener"
echo ""

# Abre el browser después de 1.5s (da tiempo a que arranque python)
( sleep 1.5 && open "${URL}" ) &

# Python http server, sin cache, sirve desde la raíz del proyecto
exec /usr/bin/python3 -c "
import http.server, socketserver, sys
PORT = ${PORT}
class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    def log_message(self, fmt, *args):
        pass  # silencia logs ruidosos
with socketserver.TCPServer(('', PORT), NoCacheHandler) as httpd:
    print(f'→ Listening on http://localhost:{PORT}')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\n→ Detenido.')
        sys.exit(0)
"
