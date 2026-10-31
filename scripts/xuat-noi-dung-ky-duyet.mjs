/**
 * XUẤT TOÀN BỘ VĂN BẢN BÁO CÁO ra một file để người chuyên môn tâm lý/giáo dục ĐỌC VÀ KÝ.
 *
 * Chạy:  node scripts/xuat-noi-dung-ky-duyet.mjs
 * Ra:    docs/noi-dung-cho-ky-duyet.md
 *
 * 🔴 VÌ SAO CẦN FILE NÀY. Mục CHỜ NGOÀI của `CLAUDE.md` chốt: ngày bấm nút chạy quảng cáo
 * là ngày nói với người lạ về con của họ, và trước ngày đó phải có một người chịu trách
 * nhiệm ký vào nội dung. Nhưng nội dung đang nằm rải trong ba file `.ts` với đầy chỗ giữ
 * chỗ `{chuThe}` — đưa nguyên cho một nhà tâm lý học đọc là bắt họ đọc mã nguồn.
 *
 * Script này gom trọn, THAY SẴN đại từ theo từng bộ đề, và xếp theo thứ tự người đọc gặp
 * trên màn hình. Không có nó thì "chờ một chữ ký" rất dễ thành "không bao giờ ký nổi".
 */

import { writeFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";

const GOC = pathToFileURL(process.cwd() + "/");

registerHooks({
  resolve(spec, ctx, next) {
    if (spec.startsWith("@config/") || spec.startsWith("@modules/")) {
      return { url: new URL(spec.slice(1) + ".ts", GOC).href, shortCircuit: true };
    }
    if ((spec.startsWith("./") || spec.startsWith("../")) && !/\.[a-z]+$/u.test(spec)) {
      return next(spec + ".ts", ctx);
    }
    return next(spec, ctx);
  },
});

const { BIEU_HIEN, DAC_DIEM_TRUC, MUC_DO_RO, THU_TU_PHA, LUA_TUOI } = await import(
  new URL("config/disc-bieu-hien.ts", GOC).href
);
const { LOI_KHUYEN, TU_MINH, BAN_KHOAN, MA_BAN_KHOAN, LECH_PHONG_CACH, GOI_KY_DUYET } = await import(
  new URL("config/disc-loi-khuyen.ts", GOC).href
);
const { DIEN_GIAI, CHU_THE, TIEU_DE_KHOI } = await import(
  new URL("config/disc-dien-giai.ts", GOC).href
);
const { MO_TA_LECH, THOA_THUAN, VIEC_CUA_TOI, TRUNG_KHOP } = await import(
  new URL("config/disc-noi-dung-cap.ts", GOC).href
);
const { TINH_HUONG_DOI, KE_HOACH_BAY_NGAY, MOI_QUAN_HE } = await import(
  new URL("config/disc-noi-dung-doi.ts", GOC).href
);
const { DONG_HANH_CHUNG, DONG_HANH_THEO_BAC, DONG_HANH_TRUNG_KHOP } = await import(
  new URL("config/disc-dong-hanh.ts", GOC).href
);
const { TINH_HUONG_VOI_TRE, KE_HOACH_VOI_TRE } = await import(
  new URL("config/disc-noi-dung-voi-tre.ts", GOC).href
);
const { TINH_HUONG_TRE_VOI_NL, KE_HOACH_TRE_VOI_NL, CHU_AN_TOAN_TRE } = await import(
  new URL("config/disc-noi-dung-tre-voi-nl.ts", GOC).href
);
const { CUNG_NHIP } = await import(new URL("config/disc-noi-dung-cung-nhip.ts", GOC).href);
const { thayXungHo } = await import(new URL("config/disc-xung-ho.ts", GOC).href);
const { thayDaiTuCap } = await import(new URL("config/disc-lech-cap.ts", GOC).href);
const { TRUC } = await import(new URL("config/disc-tu-dien.ts", GOC).href);
const { thayChuThe } = await import(new URL("modules/report/dien-giai.ts", GOC).href);

const TRUC_MA = ["D", "I", "S", "C"];
const TEN_LUA = { MN: "Mầm non (3–7)", TH: "Tiểu học (8–11)", THCS: "THCS (12–15)", NGUOI_LON: "Người lớn" };
const TEN_BO = {
  MN: "Mầm non", TH: "Tiểu học", THCS: "Trung học cơ sở", PH: "Phụ huynh", QS: "Bố mẹ nhìn con",
};

const d = [];
const p = (...x) => d.push(...x);

/** Bộ đệm riêng cho HỒ SƠ GÓI B — xem khối GOI_KY_DUYET ở config/disc-loi-khuyen.ts. */
const dB = [];
const pB = (...x) => dB.push(...x);

p(
  "# Nội dung báo cáo DISC — bản để ký duyệt",
  "",
  "> ⚠️ **FILE NÀY DO MÁY SINH.** Đừng sửa tay — sửa ở `config/disc-*.ts` rồi chạy lại:",
  "> `node scripts/xuat-noi-dung-ky-duyet.mjs`",
  "",
  "## Người ký duyệt cần xác nhận điều gì",
  "",
  "Toàn bộ chữ mà một phụ huynh hoặc một học sinh sẽ đọc đều nằm dưới đây. Xin xác nhận:",
  "",
  "1. Không câu nào **dán nhãn** hay mô tả một đứa trẻ như một loại người cố định.",
  "2. Không câu nào **tiên đoán nghề nghiệp**, **so sánh với trẻ khác**, hay **gắn với học lực**.",
  "3. Phần nói về nhóm **nhẹ nhất** không đọc ra thành khuyết thiếu cần vá.",
  "4. Lời khuyên **an toàn về mặt tâm lý** với trẻ mầm non, tiểu học và THCS.",
  "5. Giọng văn đúng với người đọc: bộ *Mầm non* và *Bố mẹ nhìn con* là người lớn đọc về trẻ;",
  "   bộ *Tiểu học*, *THCS*, *Phụ huynh* là chính người làm bài đọc về mình.",
  "",
  "**Bộ câu hỏi 104 câu nằm ở `docs/BA/DISC_BA.md` §6 — cần ký riêng, không nằm trong file này.**",
  "",
  "---",
  "",
  "## 1. Bốn khối mặc định (hiện ngay trên màn kết quả)",
  "",
);

for (const [ma, khoi] of Object.entries(DIEN_GIAI)) {
  p(`### Kiểu \`${ma}\``, "");
  for (const bo of ["MN", "QS", "THCS"]) {
    p(`**Bộ ${TEN_BO[bo]}** (gọi người làm bài là “${CHU_THE[bo].con.thuong}”)`, "");
    p(`- *${TIEU_DE_KHOI.trongNhuTheNao}:* ${thayChuThe(khoi.trongNhuTheNao, bo)}`);
    p(`- *${TIEU_DE_KHOI.diemManh}:* ${thayChuThe(khoi.diemManh, bo)}`);
    p(`- *${TIEU_DE_KHOI.choCanDeY}:* ${thayChuThe(khoi.choCanDeY, bo)}`);
    p(`- *${TIEU_DE_KHOI.cauHoiToiNay}:*`);
    for (const c of khoi.cauHoiToiNay) p(`  1. ${thayChuThe(c, bo)}`);
    p("");
  }
}

p("---", "", "## 2. Biểu hiện quan sát được, theo lứa tuổi", "",
  "Bốn trục × bốn lứa. Đây là phần phụ huynh dùng để nhận ra con mình.", "");

for (const t of TRUC_MA) {
  p(`### Nhóm ${TRUC[t].ten} (${t})`, "");
  for (const l of LUA_TUOI) {
    p(`- **${TEN_LUA[l]}:** ${thayChuThe(BIEU_HIEN[t][l], l === "NGUOI_LON" ? "PH" : "QS")}`);
  }
  p("");
}

p("---", "", "## 3. Mạnh / cần để ý / khi nhẹ — cho TỪNG trục", "",
  "🔴 Mục *khi nhẹ* là chỗ dễ trượt sang giọng khuyết thiếu nhất. Xin đọc kỹ phần này.", "");

for (const t of TRUC_MA) {
  p(`### Nhóm ${TRUC[t].ten} (${t})`, "");
  p(`- **Điểm mạnh khi nổi:** ${thayChuThe(DAC_DIEM_TRUC[t].diemManh, "QS")}`);
  p(`- **Chỗ cần để ý:** ${thayChuThe(DAC_DIEM_TRUC[t].choCanDeY, "QS")}`);
  p(`- **Khi nhóm này NHẸ:** ${thayChuThe(DAC_DIEM_TRUC[t].khiNhe, "QS")}`);
  p(`- **Mệnh đề cường độ** (chỉ thêm khi nổi rất rõ): ${thayChuThe(MUC_DO_RO[t], "QS")}`);
  p("");
}

p("---", "", "## 4. Cặp pha có thứ tự (12 cặp)", "");
for (const [ma, k] of Object.entries(THU_TU_PHA)) {
  p(`- **${ma}** — ${thayChuThe(k.tieuDe, "QS")} · *(ảnh chia sẻ: ${k.tieuDeNgan})*`);
  p(`  ${thayChuThe(k.than, "QS")}`);
}
p("");

p("---", "", "## 5. Lời khuyên cho NGƯỜI LỚN đọc về trẻ", "",
  "Chỉ hiện ở bộ *Mầm non* và *Bố mẹ nhìn con*. Dưới đây thay đại từ theo bộ *Bố mẹ nhìn con*.", "");

for (const t of TRUC_MA) {
  const k = LOI_KHUYEN[t];
  const s = (c) => thayChuThe(c, "QS");
  p(`### Khi nhóm ${TRUC[t].ten} (${t}) nổi nhất`, "");
  p(`- **Nói thế nào:** ${s(k.noiTheNao)}`);
  p(`- **Câu nên nói:**`);
  for (const c of k.cauNenNoi) p(`  - ${s(c)}`);
  p(`- **Câu nên tránh:**`);
  for (const c of k.cauNenTranh) p(`  - ${s(c)}`);
  p(`- **Khi con căng thẳng:** ${s(k.khiCangThang)}`);
  p(`- **Kỹ năng dạy con dùng thêm:** ${s(k.kyNangThem)}`);
  p(`- **Điều bố mẹ tự chỉnh:** ${s(k.boMeChinh)}`);
  p(`- **Cùng học thế nào:** ${s(k.cungHocTheNao)}`);
  p(`- **Một việc tối nay:** ${s(k.motViecToiNay)}`);
  p("");
}

p("---", "", "## 6. Bản tự đọc (bộ Tiểu học, THCS, Phụ huynh)", "",
  "Người đọc là chính người vừa làm bài. Dưới đây thay đại từ theo bộ *THCS*.", "");

for (const t of TRUC_MA) {
  const k = TU_MINH[t];
  const s = (c) => thayChuThe(c, "THCS");
  p(`### Khi nhóm ${TRUC[t].ten} (${t}) nổi nhất`, "");
  p(`- **Khi căng thẳng:** ${s(k.khiCangThang)}`);
  p(`- **Tập thêm:** ${s(k.tapThem)}`);
  p(`- **Một việc hôm nay:** ${s(k.motViecToiNay)}`);
  p("");
}

p("---", "", "## 7. Điều đang băn khoăn", "",
  "🔴 Đây là chỗ phụ huynh đang lo dễ đọc bất kỳ câu nào thành CHẨN ĐOÁN. Xin soi kỹ giọng.", "");
for (const m of MA_BAN_KHOAN) {
  p(`- **${BAN_KHOAN[m].nhan}** → ${thayChuThe(BAN_KHOAN[m].loiMoDau, "QS")}`);
}
p("");

p("---", "", "## 8. Lệch phong cách bố mẹ ↔ con", "",
  "Chỉ hiện khi phụ huynh đã tự làm bộ *Phụ huynh*. “bạn” = bố mẹ đang đọc, “con” = đứa trẻ.",
  "",
  "🔴 Mỗi chỗ vênh được kể BA lần cho ba người đọc khác nhau. Cách kể thứ tư — *nhìn về phía",
  "bố mẹ* — nằm ở **hồ sơ Gói B** riêng, vì nó là phản hồi tính cách cho người lớn về chính họ.",
  "");
for (const t of TRUC_MA) {
  for (const [h, nhan] of [
    ["bo-me-cao-hon", "Bố mẹ cao hơn con"],
    ["bo-me-thap-hon", "Bố mẹ thấp hơn con"],
  ]) {
    const k = LECH_PHONG_CACH[t][h];
    p(`### Nhóm ${TRUC[t].ten} (${t}) — ${nhan}`, "");
    p(`- **Bố mẹ đọc về con:** ${k.choBoMe}`);
    p(`- **Chính đứa trẻ đọc** (thay đại từ theo bộ *Tiểu học*)**:** ${thayChuThe(k.choCon, "TH", "con")}`);
    p(`- **Thoả thuận hai chiều** (cả hai cùng đọc)**:** ${k.thoaThuan}`);
    p("");
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   GÓI A, PHẦN CẶP — "việc của tôi" khi một bên là TRẺ (27.4).

   🔴 56 đoạn của `config/disc-noi-dung-cap.ts` từng KHÔNG nằm trong hồ sơ ký nào, vì script
   này không import file đó. Cách chia: câu nói VỚI/VỀ TRẺ → gói A (ở đây); câu giữa hai người
   LỚN ngang vai + các khối dùng chung (mô tả chỗ vênh, thoả thuận, trùng khớp) → gói B.
   ══════════════════════════════════════════════════════════════════════════ */

const TEN_KIA = "[tên người kia]";
const HUONG_NHAN = { "toi-cao-hon": "khi nhóm này của bạn cao hơn người kia", "toi-thap-hon": "khi nhóm này của bạn thấp hơn người kia" };
const TEN_THE_QUYEN = { "nguoi-lon-voi-tre": "Người lớn nói với trẻ", "tre-voi-nguoi-lon": "Trẻ nói với người lớn" };

p("---", "");
p("## A-CẶP. Một việc thử ngay khi hai người lệch phong cách — phía có TRẺ", "");
p("Hiện ở bản tổng hợp cả nhà. “bạn” = người đang đọc; người kia ghi là " + TEN_KIA + ".");
p("🔴 Thế quyền **Trẻ nói với người lớn** không giao trẻ việc điều chỉnh người lớn — người ký xem có đúng vậy không.", "");
for (const t of TRUC_MA) {
  p(`### Nhóm ${TRUC[t].ten} (${t})`, "");
  for (const h of ["toi-cao-hon", "toi-thap-hon"]) {
    for (const q of ["nguoi-lon-voi-tre", "tre-voi-nguoi-lon"]) {
      p(`- **${TEN_THE_QUYEN[q]}, ${HUONG_NHAN[h]}:** ${thayDaiTuCap(VIEC_CUA_TOI[t][h][q], q, TEN_KIA)}`);
    }
  }
  p("");
}

/* ══════════════════════════════════════════════════════════════════════════
   GÓI A, PHẦN ĐỒNG HÀNH — khi hai góc nhìn về CON lệch nhau, bố mẹ làm gì mỗi ngày (28.5).
   ══════════════════════════════════════════════════════════════════════════ */

const TEN_CON = "[tên con]";
const dienCon = (c) => c.split("{ten}").join(TEN_CON);
const TEN_HUONG_DH = {
  "con-cao-hon": "con tự thấy mình CAO hơn bố mẹ thấy",
  "con-thap-hon": "con tự thấy mình THẤP hơn bố mẹ thấy",
};

p("---", "");
p("## A-ĐỒNG-HÀNH. Khi hai góc nhìn về con lệch: bố mẹ làm gì mỗi ngày (BẢN NHÁP, 28.5)", "");
p("Nguồn: `config/disc-dong-hanh.ts`. Hiện ở màn *Hai góc nhìn về con*, dưới phần mô tả chỗ lệch.");
p("Người đọc là BỐ MẸ. Mọi việc là việc bố mẹ làm trước, không giao con tự sửa. Năm điều người ký xác nhận:", "");
p("1. Mỗi ô có tả **cả hai phía bằng một lý do có lý**, không đổ lỗi cho con hay cho bố mẹ không?");
p("2. Có chỗ nào đọc thành **chẩn đoán, gắn nhãn hoặc nói bản chất** của con không?");
p("3. Câu “Nên tránh” có đọc thành **trách bố mẹ** thay vì giúp bố mẹ nhận ra không?");
p("4. Việc ở bậc Tiểu học và bậc THCS có **hợp lứa tuổi** và an toàn không?");
p("5. Với bố mẹ đang căng thẳng, nội dung này có **an toàn** và không làm họ thấy mình là lỗi không?", "");
for (const t of TRUC_MA) {
  p(`### Nhóm ${TRUC[t].ten} (${t})`, "");
  for (const h of ["con-cao-hon", "con-thap-hon"]) {
    const c = DONG_HANH_CHUNG[t][h];
    p(`#### Khi ${TEN_HUONG_DH[h]}`, "");
    p(`- **Bố mẹ có thể đang thấy:** ${dienCon(c.boMeThay)}`);
    p(`- **Con có thể đang trải qua:** ${dienCon(c.conThay)}`);
    p(`- **Dấu hiệu việc này có tác dụng:** ${dienCon(c.dauHieu)}`);
    for (const b of ["TH", "THCS"]) {
      const o = DONG_HANH_THEO_BAC[t][h][b];
      p(`  - *Bậc ${b === "TH" ? "Tiểu học" : "THCS"}*`);
      p(`    - Buổi sáng: ${dienCon(o.sang)}`);
      p(`    - Sau giờ học: ${dienCon(o.sauGioHoc)}`);
      p(`    - Trước khi ngủ: ${dienCon(o.truocKhiNgu)}`);
      p(`    - Nên nói: ${dienCon(o.nenNoi)}`);
      p(`    - Nên tránh: ${dienCon(o.nenTranh)}`);
      p(`    - Câu hỏi để hỏi con: ${dienCon(o.cauHoi)}`);
    }
    p("");
  }
  p(`#### Khi hai góc nhìn khớp nhau`, "");
  p(`- **Điều đang tốt đẹp:** ${DONG_HANH_TRUNG_KHOP[t].giu}`);
  p(`- **Nuôi tiếp:** ${DONG_HANH_TRUNG_KHOP[t].nuoiTiep}`);
  p("");
}

/* ══════════════════════════════════════════════════════════════════════════
   GÓI A — NỘI DUNG THEO MỐI QUAN HỆ CÓ TRẺ (29.3, 29.4, 29.5).
   ══════════════════════════════════════════════════════════════════════════ */

const TEN_BAC = { nho: "Mầm non – lớp 2", "tieu-hoc": "Lớp 3–5", lon: "Lớp 6 trở lên" };
const HUONG_NGUOI_LON = { "toi-cao-hon": "người lớn NỔI hơn bé ở nhóm này", "toi-thap-hon": "người lớn NHẸ hơn bé ở nhóm này" };
const HUONG_TRE = { "toi-cao-hon": "bé NỔI hơn người lớn ở nhóm này", "toi-thap-hon": "bé NHẸ hơn người lớn ở nhóm này" };
const TEN_BE = "[tên bé]";
const TEN_NL = "[tên người lớn]";
// Người lớn nói bằng "mình" và gọi bé bằng tên nên dùng chung cho bố mẹ lẫn ông bà.
const veTre = (c) => thayXungHo(c, "nguoi-lon-voi-tre", TEN_BE, { vaiNguoiKia: "con" });
// Bé xưng/gọi theo vai người lớn: in theo bố/mẹ ("con", "Mẹ"); với ông/bà tự thành "cháu", "Ông/Bà".
const veNl = (c) => thayXungHo(c.split("{tenToi}").join(TEN_BE), "tre-voi-nguoi-lon", TEN_NL, { vaiNguoiKia: "me" });

p("---", "");
p("## A-NL→TRẺ. Người lớn ở cạnh một đứa trẻ: tình huống hằng ngày (BẢN NHÁP, 29.3)", "");
p("Nguồn: `config/disc-noi-dung-voi-tre.ts`. Người đọc là BỐ MẸ / ÔNG BÀ đọc về một bé. “bạn” = người lớn đang đọc;");
p("bé ghi là " + TEN_BE + ". Dùng chung cho bố mẹ ↔ con và ông bà ↔ cháu (người lớn nói “mình”, gọi bé bằng tên).");
p("Năm điều người ký xác nhận: (1) bên nào cũng có lý do chính đáng, không đổ lỗi; (2) chỉ mô tả vòng phản ứng");
p("nhìn thấy được; (3) việc là của NGƯỜI LỚN làm trước, không giao bé tự sửa mình; (4) việc hợp tuổi từng bậc;");
p("(5) câu “Nên tránh” để nhận ra lúc căng thẳng, không để trách bố mẹ.", "");
for (const b of ["nho", "tieu-hoc", "lon"]) {
  p(`### Bậc ${TEN_BAC[b]}`, "");
  for (const t of TRUC_MA) {
    p(`#### Nhóm ${TRUC[t].ten} (${t})`, "");
    for (const h of ["toi-cao-hon", "toi-thap-hon"]) {
      const o = TINH_HUONG_VOI_TRE[t][h][b];
      p(`- **Khi ${HUONG_NGUOI_LON[h]}** — ${veTre(o.tinhHuong)}`);
      p(`  - *Nên nói:* ${veTre(o.nenNoi)}`);
      p(`  - *Nên tránh:* ${veTre(o.nenTranh)}`);
    }
    p("");
  }
  p(`**Bảy ngày thử — bậc ${TEN_BAC[b]}**`, "");
  for (const ngay of KE_HOACH_VOI_TRE[b]) p(`- ${veTre(ngay)}`);
  p("");
}

p("---", "");
p("## A-TRẺ→NL. Bé ở cạnh người lớn: cách bé NÓI RA điều mình cần (BẢN NHÁP, 29.4)", "");
p("Nguồn: `config/disc-noi-dung-tre-voi-nl.ts`. 🔴 LUẬT HẸP NHẤT: chỉ nói cách bé NÓI RA điều mình cần và một");
p("lý do có lý của người lớn. **Tuyệt đối không giao bé việc điều chỉnh, làm vui hay chăm sóc người lớn.**");
p("Với bố/mẹ in dưới đây bé xưng “con”, gọi “Mẹ”; với ông/bà tự thành “cháu”, “Ông/Bà”. Bậc nhỏ: bố mẹ đọc cùng bé.", "");
p("🔴 Dòng an toàn cố định cuối mỗi kế hoạch của bé: “" + veNl(CHU_AN_TOAN_TRE) + "”", "");
p("Hai câu người ký xác nhận thêm: (1) có chỗ nào **giao bé trách nhiệm điều chỉnh người lớn** không?");
p("(2) vế “thật ra…” có tả người lớn bằng một lý do **có lý, không biện hộ cho hành vi làm bé tổn thương** không?", "");
for (const b of ["nho", "tieu-hoc", "lon"]) {
  p(`### Bậc ${TEN_BAC[b]}`, "");
  for (const t of TRUC_MA) {
    p(`#### Nhóm ${TRUC[t].ten} (${t})`, "");
    for (const h of ["toi-cao-hon", "toi-thap-hon"]) {
      const o = TINH_HUONG_TRE_VOI_NL[t][h][b];
      p(`- **Khi ${HUONG_TRE[h]}** — ${veNl(o.tinhHuong)}`);
      p(`  - *Nên nói:* ${veNl(o.nenNoi)}`);
      p(`  - *Nên tránh:* ${veNl(o.nenTranh)}`);
    }
    p("");
  }
  p(`**Bảy ngày thử — bậc ${TEN_BAC[b]}**`, "");
  for (const ngay of KE_HOACH_TRE_VOI_NL[b]) p(`- ${veNl(ngay)}`);
  p("");
}

p("---", "");
p("## A-CÙNG-NHỊP. Khi hai người cùng nhịp — phía có trẻ (BẢN NHÁP, 29.5)", "");
p("Nguồn: `config/disc-noi-dung-cung-nhip.ts`. Hiện ở lát cắt mà hai người KHÔNG lệch nhau rõ ở nhóm nào.");
p("Mỗi ô: điểm mạnh chung + chỗ cùng dễ trượt + một việc nuôi tiếp. Phía người lớn với nhau nằm ở Gói B (mục B6).", "");
const TEN_CAP_A = { "nguoi-lon-voi-tre": "Người lớn → trẻ", "tre-voi-nguoi-lon": "Trẻ → người lớn", "anh-chi-em": "Anh/chị ↔ em" };
const veCap = (q, c) =>
  q === "tre-voi-nguoi-lon"
    ? veNl(c)
    : thayDaiTuCap(c, q === "nguoi-lon-voi-tre" ? "nguoi-lon-voi-tre" : "ngang-vai", q === "nguoi-lon-voi-tre" ? TEN_BE : TEN_KIA);
for (const q of ["nguoi-lon-voi-tre", "tre-voi-nguoi-lon", "anh-chi-em"]) {
  p(`### ${TEN_CAP_A[q]}`, "");
  for (const t of TRUC_MA) {
    p(`#### Nhóm ${TRUC[t].ten} (${t})`, "");
    for (const k of ["cung-noi", "cung-nhe"]) {
      const o = CUNG_NHIP[q][t][k];
      p(`- **${k === "cung-noi" ? "Cùng NỔI" : "Cùng NHẸ"}** — ${veCap(q, o.tinhHuong)}`);
      p(`  - *Nuôi tiếp:* ${veCap(q, o.nuoiTiep)}`);
    }
    p("");
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   HỒ SƠ GÓI B — phản hồi tính cách cho NGƯỜI LỚN về chính họ.
   ══════════════════════════════════════════════════════════════════════════ */

pB(`# ${GOI_KY_DUYET.B.ten}`, "");
pB("> Hồ sơ ký duyệt **thứ hai**, tách khỏi gói A có chủ đích.", "");
pB(GOI_KY_DUYET.B.moTa, "");
pB("🔴 **Vì sao tách.** Gói A mô tả hành vi một đứa trẻ và đưa lời khuyên nuôi dạy. Gói B đưa");
pB("phản hồi tính cách cho một **người lớn về chính họ** — việc này gần tham vấn hơn hẳn, và");
pB("người ký chịu trách nhiệm ở một mức khác. Gộp chung một tệp thì người ký hoặc phải nhận cả");
pB("hai mức, hoặc từ chối cả hai — và thường họ sẽ từ chối cả hai.", "");
pB("**Gói A chặn ngày ra người dùng thật. Gói B chỉ chặn phần nội dung của chính nó:** chưa ký");
pB("được gói B thì vẫn phát hành được sản phẩm, chỉ cần tắt hai khối dưới đây đi.", "");
pB("---", "");

pB("## B1. Bản tự đọc của người lớn (bộ Phụ huynh)", "");
pB("Người đọc là một phụ huynh vừa tự đánh giá **chính mình**. Không có đứa trẻ nào trong khối này.", "");
for (const t of TRUC_MA) {
  const k = TU_MINH[t];
  const s = (c) => thayChuThe(c, "PH", "boMe");
  pB(`### Khi nhóm ${TRUC[t].ten} (${t}) nổi nhất`, "");
  pB(`- **Khi căng thẳng:** ${s(k.khiCangThang)}`);
  pB(`- **Tập thêm:** ${s(k.tapThem)}`);
  pB(`- **Một việc hôm nay:** ${s(k.motViecToiNay)}`);
  pB("");
}

pB("---", "");
pB("## B2. Nhìn về phía bố mẹ — soi phong cách của chính người đọc", "");
pB("Hiện cùng khối lệch phong cách, nhưng **không nhận xét đứa trẻ một chữ nào**.", "");
pB("“bạn” = phụ huynh đang đọc.", "");
for (const t of TRUC_MA) {
  pB(`### Nhóm ${TRUC[t].ten} (${t})`, "");
  pB(`- **Khi bố mẹ cao hơn con:** ${LECH_PHONG_CACH[t]["bo-me-cao-hon"].boMeTuNhin}`);
  pB(`- **Khi bố mẹ thấp hơn con:** ${LECH_PHONG_CACH[t]["bo-me-thap-hon"].boMeTuNhin}`);
  pB("");
}

pB("---", "");
pB("## B3. Năm câu người ký gói B cần xác nhận", "");
pB("1. Những đoạn này có **vượt quá mô tả phong cách** để thành nhận định về sức khoẻ tâm thần không?");
pB("2. Có đoạn nào khiến người đọc thấy **bị phán xét về cách làm cha mẹ** không?");
pB("3. Vế “cái giá đi kèm” có luôn đi sau một vế ghi nhận điểm mạnh không?");
pB("4. Có chỗ nào một phụ huynh đang căng thẳng đọc thành **lỗi tại mình** không?");
pB("5. Với người đọc không có ai hỗ trợ chuyên môn bên cạnh, nội dung này có **an toàn** không?");
pB("");

pB("---", "");
pB("## B4. Nhìn về PHÍA NGƯỜI KIA — bạn đời, anh chị em, mọi cặp (27.4)", "");
pB("Nguồn: `config/disc-noi-dung-cap.ts`. 🔴 Trước 27/10/2026 phần này **chưa nằm trong hồ sơ ký nào**.");
pB("Năm câu ở B3 áp dụng cho cả B4. Thêm hai câu riêng:", "");
pB("6. Đoạn nói về **người kia** (“veNguoiKia”) có luôn **lật khung** thành điểm mạnh, không đọc thành lời chê người vắng mặt không?");
pB("7. Các đoạn dùng chung cho cả cặp có trẻ lẫn cặp người lớn (B4.1, B4.3, B4.4) có **an toàn với cả hai** không? Người ký gói A cũng cần xem chúng.", "");
pB("“bạn” = người đang đọc; người kia ghi là " + TEN_KIA + ".", "");

pB("### B4.1 Mô tả chỗ vênh (16 đoạn — dùng chung mọi cặp)", "");
for (const t of TRUC_MA) {
  pB(`#### Nhóm ${TRUC[t].ten} (${t})`, "");
  for (const h of ["toi-cao-hon", "toi-thap-hon"]) {
    const k = MO_TA_LECH[t][h];
    pB(`- **${HUONG_NHAN[h]} — về bạn:** ${thayDaiTuCap(k.veToi, "ngang-vai", TEN_KIA)}`);
    pB(`- **${HUONG_NHAN[h]} — về người kia:** ${thayDaiTuCap(k.veNguoiKia, "ngang-vai", TEN_KIA)}`);
  }
  pB("");
}

pB("### B4.2 Một việc thử ngay — giữa hai người lớn NGANG VAI (8 đoạn)", "");
for (const t of TRUC_MA) {
  pB(`#### Nhóm ${TRUC[t].ten} (${t})`, "");
  for (const h of ["toi-cao-hon", "toi-thap-hon"]) {
    pB(`- **${HUONG_NHAN[h]}:** ${thayDaiTuCap(VIEC_CUA_TOI[t][h]["ngang-vai"], "ngang-vai", TEN_KIA)}`);
  }
  pB("");
}

pB("### B4.3 Thoả thuận hai tuần (8 đoạn — dùng chung mọi cặp)", "");
for (const t of TRUC_MA) {
  pB(`#### Nhóm ${TRUC[t].ten} (${t})`, "");
  for (const h of ["toi-cao-hon", "toi-thap-hon"]) {
    pB(`- **${HUONG_NHAN[h]}:** ${thayDaiTuCap(THOA_THUAN[t][h], "ngang-vai", TEN_KIA)}`);
  }
  pB("");
}

pB("### B4.4 Khi hai người cùng nhóm nổi hoặc cùng nhóm nhẹ (8 đoạn — dùng chung mọi cặp)", "");
for (const t of TRUC_MA) {
  pB(`#### Nhóm ${TRUC[t].ten} (${t})`, "");
  pB(`- **Cùng nổi:** ${thayDaiTuCap(TRUNG_KHOP[t]["cung-noi"], "ngang-vai", TEN_KIA)}`);
  pB(`- **Cùng nhẹ:** ${thayDaiTuCap(TRUNG_KHOP[t]["cung-nhe"], "ngang-vai", TEN_KIA)}`);
  pB("");
}


pB("---", "");
pB("## B5. Nội dung theo MỐI QUAN HỆ — vợ ↔ chồng và anh/chị ↔ em (27.5, BẢN NHÁP)", "");
pB("Nguồn: `config/disc-noi-dung-doi.ts`. Tắt được cả khối bằng cờ `MO_NOI_DUNG_DOI`.");
pB("Khác B4: B4 dùng chung một khoá cho mọi cặp ngang vai nên câu phải đủ chung; B5 có tình huống");
pB("riêng cho từng mối quan hệ. Năm câu ở B3 và hai câu ở B4 áp dụng cho cả B5. Thêm ba câu riêng:", "");
pB("8. Mỗi tình huống chỉ mô tả **vòng phản ứng nhìn thấy được**, không đoán nguyên nhân bên trong ai — đúng chưa?");
pB("9. Câu “Nên tránh” là để **nhận ra** lúc căng thẳng, không phải để trách ai — người đọc có hiểu như vậy không?");
pB("10. Kế hoạch bảy ngày có việc nào **đòi một bên đổi nhiều hơn bên kia** không?", "");
pB("“bạn” = người đang đọc; người kia ghi là " + TEN_KIA + ".", "");
const TEN_QH = { "vo-chong": "Vợ ↔ chồng", "anh-chi-em": "Anh/chị ↔ em", "nguoi-lon-khac": "Người lớn khác ↔ người lớn" };
for (const q of MOI_QUAN_HE) {
  pB(`### B5 · ${TEN_QH[q]} — tình huống hằng ngày (8 ô)`, "");
  for (const tr of TRUC_MA) {
    pB(`#### Nhóm ${TRUC[tr].ten} (${tr})`, "");
    for (const h of ["toi-cao-hon", "toi-thap-hon"]) {
      const o = TINH_HUONG_DOI[tr][h][q];
      pB(`- **${HUONG_NHAN[h]}** — ${thayDaiTuCap(o.tinhHuong, "ngang-vai", TEN_KIA)}`);
      pB(`  - *Nên nói:* ${thayDaiTuCap(o.nenNoi, "ngang-vai", TEN_KIA)}`);
      pB(`  - *Nên tránh:* ${thayDaiTuCap(o.nenTranh, "ngang-vai", TEN_KIA)}`);
    }
    pB("");
  }
  pB(`### B5 · ${TEN_QH[q]} — bảy ngày thử`, "");
  for (const ngay of KE_HOACH_BAY_NGAY[q]) pB(`- ${thayDaiTuCap(ngay, "ngang-vai", TEN_KIA)}`);
  pB("");
}

pB("---", "");
pB("## B6. Khi hai NGƯỜI LỚN cùng nhịp (29.5, BẢN NHÁP)", "");
pB("Nguồn: `config/disc-noi-dung-cung-nhip.ts`. Vợ ↔ chồng và người lớn khác ↔ người lớn. “bạn” = người đang đọc;");
pB("người kia ghi là " + TEN_KIA + ". Phía có trẻ nằm ở Gói A.", "");
for (const q of ["vo-chong", "nguoi-lon-khac"]) {
  pB(`### ${TEN_QH[q]}`, "");
  for (const t of TRUC_MA) {
    pB(`#### Nhóm ${TRUC[t].ten} (${t})`, "");
    for (const k of ["cung-noi", "cung-nhe"]) {
      const o = CUNG_NHIP[q][t][k];
      pB(`- **${k === "cung-noi" ? "Cùng NỔI" : "Cùng NHẸ"}** — ${thayDaiTuCap(o.tinhHuong, "ngang-vai", TEN_KIA)}`);
      pB(`  - *Nuôi tiếp:* ${thayDaiTuCap(o.nuoiTiep, "ngang-vai", TEN_KIA)}`);
    }
    pB("");
  }
}

/**
 * 🔴 HAI TỆP, KHÔNG PHẢI MỘT.
 *
 * Tách không phải cho gọn. Hai gói đòi hai mức trách nhiệm khác nhau ở người ký: mô tả một
 * đứa trẻ là một việc, đưa phản hồi tính cách cho một người lớn về chính họ là việc khác.
 * Gộp chung thì người ký hoặc nhận cả hai mức, hoặc từ chối cả hai.
 */
const gon = (ds) => ds.join("\n").replace(/\n{3,}/gu, "\n\n") + "\n";
const demTu = (c) => c.split(/\s+/u).filter(Boolean).length;

const raA = "docs/noi-dung-cho-ky-duyet.md";
const raB = "docs/noi-dung-cho-ky-duyet-goi-b.md";

const chuA = gon(d);
const chuB = gon(dB);
writeFileSync(new URL(raA, GOC), chuA, "utf8");
writeFileSync(new URL(raB, GOC), chuB, "utf8");

console.log(`Đã xuất HAI hồ sơ ký duyệt:`);
console.log(`  A · ${raA}`);
console.log(`      ${GOI_KY_DUYET.A.ten} — ${demTu(chuA)} từ, ${chuA.split("\n").length} dòng.`);
console.log(`  B · ${raB}`);
console.log(`      ${GOI_KY_DUYET.B.ten} — ${demTu(chuB)} từ, ${chuB.split("\n").length} dòng.`);
console.log("");
console.log("Gói A chặn ngày ra người dùng thật.");
console.log("Gói B chỉ chặn phần nội dung của chính nó — chưa ký được thì vẫn phát hành,");
console.log("chỉ cần tắt khối 'Nhìn về phía bố mẹ' và bản tự đọc của bộ Phụ huynh.");
