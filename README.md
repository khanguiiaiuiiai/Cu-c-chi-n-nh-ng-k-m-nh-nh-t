# Multiversal War – chạy online bằng Render

## Cách 1 (dễ nhất): Render chạy luôn cả game + server
1. Tạo repo GitHub, đưa **cả thư mục này** lên (có `server.js`, `package.json`, `render.yaml`, `public/index.html`).
2. Vào https://render.com → **New → Web Service** → chọn repo.
   - Runtime: Node · Build: `npm install` · Start: `node server.js` (hoặc dùng `render.yaml`, chọn Blueprint).
3. Deploy xong có link dạng `https://ten-app.onrender.com` → mở link đó trên điện thoại, chọn
   **Tạo server online** → để trống ô server → **Ghép ngẫu nhiên** hoặc nhập mã 6 số.
   Bạn bè mở cùng link, nhập cùng mã 6 số là vào cùng phòng (tối đa 6 người).

## Cách 2: giữ file `index.html` ở chỗ khác
Mở game, vào **Tạo server online**, nhập địa chỉ Render vào ô đầu tiên (vd `ten-app.onrender.com`) rồi vào phòng.
Địa chỉ được lưu lại cho lần sau.

## Lưu ý
- Gói free của Render sẽ "ngủ" khi không ai dùng; lần đầu kết nối có thể mất ~50 giây, game tự thử lại tối đa 12 lần.
- Mã 6 số = phòng riêng. "Ghép ngẫu nhiên" = vào phòng công khai còn chỗ, không có thì tạo mới.
- Có người chơi thật trong phòng thì bot tự tắt; còn một mình thì vẫn có bot để luyện tập.
