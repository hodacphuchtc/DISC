/** @type {import('next').NextConfig} */
const nextConfig = {
  // Xuất trang tĩnh — không SSR, không API route, không middleware (ADR-001).
  output: "export",
  // Bắt buộc khi output:'export' — không có máy chủ để tối ưu ảnh lúc chạy.
  images: { unoptimized: true },
  trailingSlash: true,
  // 🔴 Next 16 mặc định TỰ GHI một khối vào CLAUDE.md sau mỗi lần `next dev`.
  // CLAUDE.md là hiến pháp dự án, do người viết — không để công cụ build sửa.
  // Tài liệu Next 16 vẫn đọc được tại `node_modules/next/dist/docs/`.
  agentRules: false,
  // Huy hiệu dev của Next che mất thẻ cam kết ở đáy thanh bên khi chụp màn hình.
  devIndicators: false,
};

export default nextConfig;
