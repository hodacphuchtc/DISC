// Gắn bản dựng của KHO_SACH vào tab "Tủ sách gia đình": chép ../KHO_SACH/dist -> public/tu-sach.
// Chạy sau `npm run dung` ở KHO_SACH. Thư mục đích bị gitignore (ảnh bìa có bản quyền NXB).
import { cpSync, existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const NGUON = resolve(process.argv[2] ?? "../KHO_SACH/dist");
const DICH = resolve("public/tu-sach");

if (!existsSync(resolve(NGUON, "phien-ban.txt"))) {
  console.error(`❌ Không thấy bản dựng KHO_SACH ở ${NGUON}. Chạy "npm run dung" bên KHO_SACH trước.`);
  process.exit(1);
}
rmSync(DICH, { recursive: true, force: true });
cpSync(NGUON, DICH, { recursive: true });
console.log(`✔ Đã gắn Tủ sách: ${NGUON} → ${DICH}`);
