import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const goc = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@modules": `${goc}modules`,
      "@config": `${goc}config`,
      "@": goc,
    },
  },
  test: {
    /**
     * 🔴 GHIM MÚI GIỜ. `hienNgay()` đọc ngày theo múi giờ MÁY ĐANG CHẠY — đúng cho người
     * dùng (họ thấy ngày của chính họ), nhưng làm test có ngày gõ cứng thành trò may rủi:
     * máy dev ở +07 thì xanh, GitHub Actions chạy ở UTC thì đỏ. Đã trả giá 27/08/2026 —
     * CI đỏ ngay lần chạy đầu tiên vì đúng chuyện này.
     * Ghim vào +07 vì người dùng của sản phẩm đều ở Việt Nam.
     */
    env: { TZ: "Asia/Ho_Chi_Minh" },
    /**
     * 🔴 Node ≥ 25 có `localStorage` thử nghiệm gắn sẵn vào global; không có
     * `--localstorage-file` nó nổ, và nó che mất `localStorage` của jsdom ⇒ ~180 test lưu trữ
     * đỏ giả (đo 30/10/2026 trên Node v26). Tắt nó đi. Chỉ thêm cờ khi Node biết cờ này —
     * Node cũ gặp cờ lạ sẽ không khởi động được.
     */
    execArgv: process.allowedNodeEnvironmentFlags.has("--no-experimental-webstorage")
      ? ["--no-experimental-webstorage"]
      : [],
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
  },
});
