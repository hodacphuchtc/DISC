/**
 * PHÂN TÍCH ITEM — sàng bộ câu hỏi bằng dữ liệu thật.
 *
 * Chạy:  node scripts/phan-tich-item.mjs <duong-dan.csv>
 *
 * Định dạng CSV: dòng đầu là MÃ CÂU (vd `THCS-D1,THCS-I6,...`), mỗi dòng sau là một
 * người trả lời, giá trị THÔ 1..mucToiDa. Cột lạ bị bỏ qua và báo rõ.
 *
 * 🔴 Bộ 104 câu hiện chưa ai kiểm. Script này là thứ DUY NHẤT biến nó từ "do BA soạn"
 * thành "đã sàng trên người Việt". Chạy TRƯỚC khi bật quảng cáo.
 *
 * 🔴 KHÔNG đưa bài làm thật của trẻ vào `docs/`. Để ở `/du-lieu-thu/` (đã gitignore).
 */

import { readFileSync } from "node:fs";

import { NGAN_HANG } from "../config/disc-cau-hoi.ts";
import {
  NGUONG_TUONG_QUAN_TOI_THIEU,
  phanTichTruc,
} from "../modules/report/thong-ke.ts";

const duongDan = process.argv[2];
if (!duongDan) {
  console.error("Thiếu đường dẫn CSV.\n  node scripts/phan-tich-item.mjs <duong-dan.csv>");
  process.exit(1);
}

const dong = readFileSync(duongDan, "utf8")
  .split(/\r?\n/u)
  .map((d) => d.trim())
  .filter((d) => d !== "");

if (dong.length < 3) {
  console.error("File cần ít nhất 1 dòng tiêu đề + 2 dòng trả lời.");
  process.exit(1);
}

const tieuDe = dong[0].split(",").map((x) => x.trim());
const soNguoi = dong.length - 1;

// Tra từng mã câu về đúng bộ đề của nó.
const traMa = new Map();
for (const bo of Object.values(NGAN_HANG)) {
  for (const c of bo.cau) traMa.set(c.ma, { bo, cau: c });
}

const laLa = tieuDe.filter((m) => !traMa.has(m));
if (laLa.length > 0) console.warn(`⚠️  Bỏ qua ${laLa.length} cột không khớp mã câu: ${laLa.join(", ")}`);

const cot = new Map(); // mã câu -> mảng điểm ĐÃ đảo chiều
for (const m of tieuDe) if (traMa.has(m)) cot.set(m, []);

let soDongHong = 0;
for (let i = 1; i < dong.length; i += 1) {
  const o = dong[i].split(",").map((x) => x.trim());
  let hong = false;
  for (let j = 0; j < tieuDe.length; j += 1) {
    const m = tieuDe[j];
    if (!cot.has(m)) continue;
    const { bo, cau } = traMa.get(m);
    const raw = Number(o[j]);
    if (!Number.isFinite(raw) || raw < 1 || raw > bo.mucToiDa) {
      hong = true;
      break;
    }
    cot.get(m).push(cau.dao ? bo.mucToiDa + 1 - raw : raw);
  }
  if (hong) {
    soDongHong += 1;
    for (const m of cot.keys()) if (cot.get(m).length > i - 1 - soDongHong) cot.get(m).pop();
  }
}
if (soDongHong > 0) console.warn(`⚠️  Bỏ ${soDongHong} dòng có giá trị ngoài thang.`);

// Nhóm theo bộ đề rồi theo trục.
const theoBo = new Map();
for (const m of cot.keys()) {
  const { bo, cau } = traMa.get(m);
  if (!theoBo.has(bo.ma)) theoBo.set(bo.ma, new Map());
  const t = theoBo.get(bo.ma);
  if (!t.has(cau.truc)) t.set(cau.truc, []);
  t.get(cau.truc).push(m);
}

const so = (x, n = 2) => (x < 0 ? "" : " ") + x.toFixed(n);

console.log(`\nNguồn: ${duongDan}`);
console.log(`Số người trả lời hợp lệ: ${soNguoi - soDongHong}\n`);

let tongNenVut = 0;
for (const [maBo, theoTruc] of theoBo) {
  console.log(`━━━ BỘ ${maBo} ━━━`);
  for (const truc of ["D", "I", "S", "C"]) {
    const ma = theoTruc.get(truc);
    if (!ma || ma.length === 0) continue;
    try {
      const kq = phanTichTruc(truc, ma, ma.map((m) => cot.get(m)));
      const canhBaoAlpha =
        kq.alpha < 0 ? "  ← ÂM: nhiều khả năng quên đảo chiều một câu"
        : kq.alpha < 0.6 ? "  ← thấp"
        : "";
      console.log(`\n  Trục ${truc} · alpha = ${so(kq.alpha)}${canhBaoAlpha}`);
      for (const c of kq.cau) {
        const nhan = c.nenVut ? "  ⚠ NÊN VỨT" : "";
        console.log(`    ${c.ma.padEnd(10)} r = ${so(c.r)}${nhan}`);
        if (c.nenVut) tongNenVut += 1;
      }
    } catch (e) {
      console.log(`\n  Trục ${truc} · KHÔNG TÍNH ĐƯỢC: ${e.message}`);
    }
  }
  console.log("");
}

console.log(`Ngưỡng tương quan tối thiểu: ${NGUONG_TUONG_QUAN_TOI_THIEU}`);
console.log(`Tổng số câu đề nghị vứt: ${tongNenVut}\n`);
console.log("Đọc bảng này thế nào:");
console.log("  · alpha ≥ 0,70 là khá. Dưới 0,60 thì trục đó đang đo lẫn nhiều thứ.");
console.log("  · r là tương quan của câu với TỔNG CÁC CÂU CÒN LẠI cùng trục (đã trừ chính nó).");
console.log("  · r âm hoặc gần 0 ⇒ câu đó đang đo thứ khác. Vứt hoặc viết lại.");
console.log("  · Vứt câu xong nhớ TĂNG PHIEN_BAN_BO_DE rồi chạy scripts/sinh-checksum.mjs.\n");
