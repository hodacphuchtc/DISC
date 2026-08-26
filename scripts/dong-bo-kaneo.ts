/**
 * dong-bo:kaneo — đẩy MỘT CHIỀU tiến độ Plan/*.md → bảng nhìn Kaneo (localhost:5173).
 *
 * VAI TRÒ (ADR 11/08/2026): Kaneo là BẢNG NHÌN cho người — KHÔNG phải nguồn sự thật.
 * Plan/*.md (máy sinh) vẫn là sổ gốc duy nhất; script này chỉ chiếu gương, KHÔNG BAO GIỜ
 * đọc ngược từ Kaneo về sổ. Thẻ chỉ mang MÃ VIỆC + TIÊU ĐỀ + nhãn MÁY/NGƯỜI/NGOÀI —
 * TUYỆT ĐỐI không tên học viên/SĐT (NĐ 13).
 *
 * BEST-EFFORT: Kaneo tắt (colima stop) → in một dòng rồi exit 0 — KHÔNG lỗi, không chặn
 * đóng phiên. Tiến độ vẫn nằm đủ trong Plan/TIEN_DO.md.
 *
 * ⏳ PHẦN GHI (đẩy thẻ qua API) MỞ SAU KHI CÓ TÀI KHOẢN: cần anh Phúc đăng ký tài khoản
 * Kaneo lần đầu (mở http://localhost:5173 → Đăng ký) rồi tạo API key, lưu vào
 * ~/.config/kaneo/config.json — KHÔNG để trong repo. Chưa có key thì script chạy
 * chế độ XEM TRƯỚC (in danh sách thẻ SẼ đẩy) — đúng luật "không ship cửa ghi chưa từng
 * chạy" (bài học dongBoLich 11/08).
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const KANEO_URL = process.env.KANEO_URL ?? "http://localhost:5173";
const GOC = join(import.meta.dirname ?? __dirname, "..");

async function kaneoSong(): Promise<boolean> {
  try {
    const r = await fetch(`${KANEO_URL}/api/health`, {
      signal: AbortSignal.timeout(3000),
    });
    return r.ok;
  } catch {
    return false;
  }
}

function docTheCanDay(): { ma: string; tieuDe: string; nhan: string }[] {
  // Nguồn: Plan/VIEC_CON_LAI.md (máy sinh, nhóm theo NGƯỜI/NGOÀI/MÁY).
  // Chỉ lấy MÃ + TIÊU ĐỀ — cắt mọi phần mô tả sau dấu — để không kéo PII/chi tiết theo.
  const duongDan = join(GOC, "Plan/VIEC_CON_LAI.md");
  if (!existsSync(duongDan)) return [];
  const noiDung = readFileSync(duongDan, "utf8");
  const the: { ma: string; tieuDe: string; nhan: string }[] = [];
  let nhanHienTai = "";
  for (const dong of noiDung.split("\n")) {
    const nhomMatch = dong.match(/^#{2,3}\s.*\b(NGƯỜI|NGOÀI|MÁY)\b/u);
    if (nhomMatch) nhanHienTai = nhomMatch[1];
    const mucMatch = dong.match(
      /^-\s+\*{0,2}[`]?([A-Z0-9._-]+)[`]?\*{0,2}\s*[—–-]\s*(.+)$/u,
    );
    if (mucMatch && nhanHienTai) {
      the.push({
        ma: mucMatch[1],
        tieuDe: mucMatch[2]
          .split(/[—–.(]/)[0]
          .trim()
          .slice(0, 80),
        nhan: nhanHienTai,
      });
    }
  }
  return the;
}

async function chinh() {
  if (!(await kaneoSong())) {
    console.log(
      "⏭️  Kaneo không chạy (colima/container tắt) — bỏ qua đồng bộ, tiến độ vẫn đủ trong Plan/TIEN_DO.md.",
    );
    return; // exit 0 — best-effort, không chặn đóng phiên
  }

  const the = docTheCanDay();
  console.log(`🔎 Kaneo sống tại ${KANEO_URL} — ${the.length} thẻ sẽ đồng bộ:`);
  const demNhan: Record<string, number> = {};
  for (const t of the) demNhan[t.nhan] = (demNhan[t.nhan] ?? 0) + 1;
  console.log(
    `   Phân loại: ${Object.entries(demNhan)
      .map(([k, v]) => `${k} ${v}`)
      .join(" · ")}`,
  );
  for (const t of the.slice(0, 8))
    console.log(`   [${t.nhan}] ${t.ma} — ${t.tieuDe}`);
  if (the.length > 8) console.log(`   … và ${the.length - 8} thẻ nữa`);

  const cauHinh = join(homedir(), ".config/kaneo/config.json");
  if (!existsSync(cauHinh)) {
    console.log(
      "\n⏳ CHẾ ĐỘ XEM TRƯỚC — phần đẩy thẻ thật chưa mở vì chưa có API key.\n" +
        "   Mở khóa (một lần): ① mở http://localhost:5173 → Đăng ký tài khoản đầu tiên\n" +
        '   ② Settings → API key ③ lưu {"apiKey":"…"} vào ~/.config/kaneo/config.json\n' +
        "   (ngoài repo, không .env) rồi chạy lại. Máy sẽ xác minh endpoint bằng tài liệu\n" +
        "   Kaneo trước khi ghi thẻ đầu tiên — không đoán API.",
    );
    return;
  }

  // TODO(mở sau khi có tài khoản — xem đầu file): xác minh endpoint từ tài liệu Kaneo
  // rồi mới viết phần POST. KHÔNG đoán tên trường (bài học "chỗ gọi tự gõ tên ô/khóa").
  console.log(
    "\n🔴 Có config nhưng phần ghi CHƯA được xác minh endpoint — xem TODO đầu file.",
  );
}

chinh().catch((e) => {
  console.log(
    "⏭️  dong-bo:kaneo lỗi không nghiêm trọng (best-effort):",
    e?.message ?? e,
  );
});
