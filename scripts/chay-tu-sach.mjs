// Chạy máy chủ thử của KHO_SACH (cổng 4310) cho phép DISC nhúng — để tab "Tủ sách gia đình" dùng được cả nút Tải PDF.
// Dùng: npm run tu-sach  (song song với `npm run dev`). Cần đã dựng KHO_SACH: `npm run dung` bên đó.
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const KHO = resolve(process.argv[2] ?? "../KHO_SACH");
if (!existsSync(resolve(KHO, "dist/phien-ban.txt"))) {
  console.error(`❌ Chưa dựng KHO_SACH ở ${KHO}. Chạy "npm run dung" trong thư mục đó trước.`);
  process.exit(1);
}
const goc = process.env.NHUNG ?? "http://localhost:3000";
spawn("node", [resolve(KHO, "scripts/xem.mjs")], {
  stdio: "inherit",
  env: { ...process.env, NHUNG: goc },
});
