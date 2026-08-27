/**
 * Sinh THỨ TỰ HIỂN THỊ của từng bộ đề theo luật DISC_BA.md §6.6, rồi CHỐT CỨNG kết quả
 * vào `config/disc-thu-tu.ts`.
 *
 * 🔴 Vì sao chốt cứng thay vì trộn lúc chạy: trộn lúc chạy thì hai lần làm bài ra hai
 * thứ tự khác nhau ⇒ không đối chiếu được bài của con với bài của bố mẹ, và không tái
 * hiện được lỗi khi người dùng báo.
 *
 * Bốn luật:
 *  1. Chia thành các vòng 4 câu, mỗi vòng đủ D–I–S–C.
 *  2. Thứ tự trục trong vòng XOAY qua từng vòng.
 *  3. Hai câu đảo không đứng cạnh nhau, và mỗi câu đảo nằm ở một vòng khác nhau.
 *  4. Câu đầu tiên của bài luôn là câu THUẬN.
 *
 * Chạy: node scripts/sinh-thu-tu.mjs
 */

import { writeFileSync } from "node:fs";

import { NGAN_HANG } from "../config/disc-cau-hoi.ts";

const XOAY = [
  ["D", "I", "S", "C"],
  ["I", "S", "C", "D"],
  ["S", "C", "D", "I"],
  ["C", "D", "I", "S"],
  ["D", "S", "I", "C"],
  ["S", "I", "C", "D"],
];

/** Sinh một phương án thứ tự cho `vongDao` đã chọn; trả null nếu không dựng được. */
function dungThuTu(theoTruc, soVong, vongDao) {
  const conLai = {};
  for (const t of ["D", "I", "S", "C"]) conLai[t] = theoTruc[t].filter((c) => !c.dao);

  const ra = [];
  for (let v = 0; v < soVong; v += 1) {
    for (const t of XOAY[v % XOAY.length]) {
      if (v === vongDao[t]) {
        ra.push(theoTruc[t].find((c) => c.dao));
      } else {
        const c = conLai[t].shift();
        if (!c) return null;
        ra.push(c);
      }
    }
  }
  return ra;
}

function hopLe(thuTu) {
  if (thuTu[0].dao) return false; // luật 4
  for (let i = 1; i < thuTu.length; i += 1) {
    if (thuTu[i].dao && thuTu[i - 1].dao) return false; // luật 3
  }
  return true;
}

function sinhChoBo(boDe) {
  const theoTruc = { D: [], I: [], S: [], C: [] };
  for (const c of boDe.cau) theoTruc[c.truc].push(c);

  const soVong = theoTruc.D.length;
  for (const t of ["I", "S", "C"]) {
    if (theoTruc[t].length !== soVong) {
      throw new Error(`Bộ ${boDe.ma}: trục ${t} có ${theoTruc[t].length} câu, trục D có ${soVong}.`);
    }
  }

  // Duyệt mọi cách đặt câu đảo vào các vòng, lấy phương án hợp lệ ĐẦU TIÊN.
  // Duyệt theo thứ tự cố định nên kết quả tái hiện được y hệt mỗi lần chạy.
  for (let d = 0; d < soVong; d += 1)
    for (let i = 0; i < soVong; i += 1)
      for (let s = 0; s < soVong; s += 1)
        for (let c = 0; c < soVong; c += 1) {
          const vongDao = { D: d, I: i, S: s, C: c };
          if (new Set([d, i, s, c]).size !== 4) continue; // luật 3: mỗi đảo một vòng
          const thu = dungThuTu(theoTruc, soVong, vongDao);
          if (thu && hopLe(thu)) return thu.map((x) => x.ma);
        }

  throw new Error(`Bộ ${boDe.ma}: không dựng được thứ tự thoả cả bốn luật.`);
}

const ketQua = {};
for (const [ma, boDe] of Object.entries(NGAN_HANG)) {
  ketQua[ma] = sinhChoBo(boDe);
  const soDao = boDe.cau.filter((c) => c.dao).length;
  console.log(`  ${ma.padEnd(5)} ${String(ketQua[ma].length).padStart(2)} câu · ${soDao} câu đảo · câu đầu: ${ketQua[ma][0]}`);
}

const noiDung = `/**
 * THỨ TỰ HIỂN THỊ CÂU HỎI — sinh bởi \`scripts/sinh-thu-tu.mjs\`, ĐỪNG SỬA TAY.
 *
 * Sinh lại sau mỗi lần đổi ngân hàng câu: \`node scripts/sinh-thu-tu.mjs\`
 *
 * 🔴 Thứ tự này CHỐT CỨNG có chủ đích. Trộn lúc chạy thì hai lần làm bài ra hai thứ tự
 * khác nhau ⇒ mất khả năng đối chiếu con ↔ cha mẹ, và mất khả năng tái hiện lỗi.
 *
 * Luật sinh (DISC_BA.md §6.6): vòng 4 câu đủ D–I–S–C · thứ tự trục xoay qua từng vòng ·
 * hai câu đảo không đứng cạnh nhau, mỗi câu đảo một vòng · câu đầu bài luôn là câu thuận.
 */

import type { MaBoDe } from "@modules/core/bo-de/kieu";

export const THU_TU: Readonly<Record<MaBoDe, readonly string[]>> = {
${Object.entries(ketQua)
  .map(([ma, ds]) => `  ${ma}: [\n${ds.map((m) => `    "${m}",`).join("\n")}\n  ],`)
  .join("\n")}
};
`;

writeFileSync("config/disc-thu-tu.ts", noiDung);
console.log("✅ Đã ghi config/disc-thu-tu.ts");
