// Server online cho Multiversal War: phòng tối đa 6 người, chuyển tiếp tin nhắn giữa các client.
const http = require('http'), fs = require('fs'), path = require('path');
const { WebSocketServer } = require('ws');
const PORT = process.env.PORT || 3000, MAX = 6;
const RELAY = new Set(['st', 'sk', 'm1', 'hitc', 'ctr', 'fdrop', 'vz', 'kill']);

const server = http.createServer((req, res) => {
  if (req.url === '/health') { res.writeHead(200); return res.end('ok'); }
  const f = path.join(__dirname, 'public', 'index.html');
  fs.readFile(f, (e, d) => {
    if (e) { res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('Multiversal War server đang chạy.'); }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(d);
  });
});
const wss = new WebSocketServer({ server, maxPayload: 4096 });
const rooms = new Map();           // code -> { code, priv, players: Map(id -> ws) }
let seq = 1;

const send = (ws, o) => { if (ws.readyState === 1) ws.send(JSON.stringify(o)); };
const bcast = (room, o, except) => { for (const w of room.players.values()) if (w !== except) send(w, o); };
function newCode() { let c; do c = String(100000 + Math.floor(Math.random() * 900000)); while (rooms.has(c)); return c; }
function getRoom(req) {
  if (/^\d{6}$/.test(req)) {       // vào đúng server bằng mã 6 số (tạo mới nếu chưa có)
    if (!rooms.has(req)) rooms.set(req, { code: req, priv: true, players: new Map() });
    return rooms.get(req);
  }
  for (const r of rooms.values()) if (!r.priv && r.players.size > 0 && r.players.size < MAX) return r;   // ghép ngẫu nhiên
  const code = newCode(); const r = { code, priv: false, players: new Map() }; rooms.set(code, r); return r;
}

wss.on('connection', ws => {
  ws.alive = true; ws.on('pong', () => ws.alive = true);
  ws.on('message', raw => {
    let m; try { m = JSON.parse(raw); } catch (e) { return; }
    if (!m || typeof m.t !== 'string') return;
    if (m.t === 'info') {
      const name = String(m.name || 'Player').slice(0, 14), h = m.h | 0;
      if (!ws.room) {
        const room = getRoom(String(m.room || 'random'));
        if (room.players.size >= MAX) { send(ws, { t: 'full' }); return; }
        ws.id = 'p' + (seq++); ws.room = room; ws.name = name; ws.h = h;
        send(ws, { t: 'welcome', id: ws.id, room: room.code, players: [...room.players.values()].map(w => ({ id: w.id, name: w.name, h: w.h })) });
        room.players.set(ws.id, ws);
        bcast(room, { t: 'join', p: { id: ws.id, name, h } }, ws);
      } else {
        ws.name = name; ws.h = h;
        bcast(ws.room, { t: 'join', p: { id: ws.id, name, h } }, ws);
      }
      return;
    }
    if (!ws.room || !RELAY.has(m.t)) return;      // 'ping' và loại khác bị bỏ qua
    m.id = ws.id;
    if (m.to) { const w = ws.room.players.get(m.to); if (w) send(w, m); }
    else bcast(ws.room, m, ws);
  });
  ws.on('close', () => {
    const room = ws.room; if (!room) return;
    room.players.delete(ws.id);
    bcast(room, { t: 'leave', id: ws.id });
    if (room.players.size === 0) rooms.delete(room.code);
  });
  ws.on('error', () => {});
});
// dọn kết nối chết
setInterval(() => { for (const ws of wss.clients) { if (!ws.alive) { ws.terminate(); continue; } ws.alive = false; ws.ping(); } }, 30000);
server.listen(PORT, () => console.log('Multiversal War server chạy ở cổng ' + PORT));
