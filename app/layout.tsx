import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { DangKySW } from "./dang-ky-sw";
import "./globals.css";

// ADR-004 (tech-defaults): Be Vietnam Pro — chữ Việt có dấu hiển thị cân, đủ nét đậm
// cho logo. Nạp qua next/font để dấu không rơi về font hệ thống lúc vẽ Canvas (KQ.3).
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DISC — SATA ROBO",
  description: "Trắc nghiệm hành vi DISC cho học sinh và phụ huynh.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className="font-sans antialiased">
        {children}
        <DangKySW />
      </body>
    </html>
  );
}
