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
    p(`**Bộ ${TEN_BO[bo]}** (gọi người làm bài là “${CHU_THE[bo].thuong}”)`, "");
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
