/**
 * Sinh `config/disc-checksum.json` — khoá nội dung ngân hàng câu vào PHIEN_BAN_BO_DE.
 *
 * Chạy lại MỖI KHI đổi nội dung câu, và nhớ TĂNG `PHIEN_BAN_BO_DE` trước:
 *   node scripts/sinh-checksum.mjs
 */

import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";

import { NGAN_HANG, PHIEN_BAN_BO_DE } from "../config/disc-cau-hoi.ts";
import { bamNganHang } from "../modules/core/bo-de/bam.ts";

const bam = bamNganHang(NGAN_HANG, (s) => createHash("sha256").update(s, "utf8").digest("hex"));

writeFileSync(
  "config/disc-checksum.json",
  `${JSON.stringify({ phienBanBoDe: PHIEN_BAN_BO_DE, bam }, null, 2)}\n`,
);

console.log(`✅ config/disc-checksum.json`);
console.log(`   phiên bản: ${PHIEN_BAN_BO_DE}`);
console.log(`   băm      : ${bam.slice(0, 16)}…`);
