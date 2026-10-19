# PAT Motion – bộ file PWA

Gồm 6 file đặt ngang hàng ở thư mục gốc repo:
`index.html`, `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`, `icon-512-maskable.png`

## Deploy lên GitHub Pages
1. Tạo repo mới, ví dụ `pat-motion` (mỗi app cài được nên có repo riêng, không đặt trong thư mục con của app/portal khác).
2. Đẩy đủ 6 file lên **thư mục gốc** repo (không lồng thư mục).
3. Settings → Pages → Source: branch `main`, thư mục `/ (root)` → Save.
4. Link dạng `https://<username>.github.io/pat-motion/`. Vì `start_url` và `scope` dùng đường dẫn tương đối nên không cần sửa gì thêm.

## Kiểm tra
- **Android (Chrome):** mở link → menu ⋮ → "Cài đặt ứng dụng" / "Thêm vào Màn hình chính".
- **Windows 11 (Edge/Chrome):** mở link → biểu tượng "Cài đặt" ở thanh địa chỉ (hoặc menu → Ứng dụng → Cài đặt trang này như một ứng dụng).
- **Lighthouse:** DevTools → tab Lighthouse → chọn "Progressive Web App" → Analyze.
- Vẫn có thể double-click `index.html` để mở qua `file://` như trước (service worker tự bỏ qua, không báo lỗi).

## Cập nhật phiên bản sau này
Chỉ thay nội dung `index.html` và đổi `v1` → `v2` trong `CACHE_NAME` của `sw.js`. Giữ nguyên `id`, `name`, `start_url`, `scope` và tên file icon.

## Nếu Chrome Android báo "Ứng dụng này đã được cài đặt rồi" nhưng không mở được
1. **Sao lưu/xuất dữ liệu trong app trước**, không bấm các nút đặt lại (Reset).
2. Vào Cài đặt → Ứng dụng, gỡ mục "PAT Motion" (và portal nếu có).
3. Đóng hẳn Chrome rồi mở lại link.
4. Nếu Chrome vẫn không hiện "Cài đặt ứng dụng": kiểm tra `id`/`scope` không trùng hoặc lồng với app khác cùng domain.
5. Chỉ khi vẫn kẹt mới xoá dữ liệu Chrome hoặc cài lại Chrome — cách này xoá luôn dữ liệu localStorage/IndexedDB của mọi app trên domain, nên bắt buộc sao lưu trước.
