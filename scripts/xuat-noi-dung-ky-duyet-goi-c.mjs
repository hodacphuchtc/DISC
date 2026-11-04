/**
 * Sinh `docs/noi-dung-cho-ky-duyet-goi-c.md` — hồ sơ GÓI C (nội dung SỨC KHOẺ) để bác sĩ nhi /
 * chuyên gia dinh dưỡng đọc và ký (ADR-010).
 *
 * 🔴 TỆP .md LÀ BẢN SINH RA — đừng sửa tay. Sửa `config/suc-khoe-noi-dung.ts` hoặc
 * `config/suc-khoe-tu-dien.ts` rồi chạy lại:  node scripts/xuat-noi-dung-ky-duyet-goi-c.mjs
 * `tests/so-suc-khoe.test.ts` kiểm hồ sơ phủ ĐỦ mọi câu, nên quên chạy lại là test đỏ.
 *
 * Vì sao có hồ sơ riêng: người ký Gói A/B là chuyên gia TÂM LÝ; lời khuyên ăn uống, vận động,
 * giấc ngủ là nội dung Y TẾ/DINH DƯỠNG — cần người ký khác.
 */

import { writeFileSync } from "node:fs";

const GOC = new URL("../", import.meta.url);
const { KHUON_LOI_KHUYEN } = await import(
  new URL("config/suc-khoe-noi-dung.ts", GOC).href
);
const { CHU_SK } = await import(
  new URL("config/suc-khoe-tu-dien.ts", GOC).href
);

const TEN_KHUON = {
  "tre-nho": "Trẻ dưới 5 tuổi",
  tre: "Trẻ 5–18 tuổi (tiểu học, THCS, THPT)",
  "nl-binh-thuong": "Người lớn (≥ 19 tuổi) — BMI bình thường",
  "nl-nhe-can": "Người lớn — nhẹ cân (BMI < 18,5)",
  "nl-can-chu-y":
    "Người lớn — thừa cân / béo phì (BMI ≥ 23, theo ngưỡng châu Á)",
  "dac-biet":
    "Mang thai / cho con bú / có bệnh nền (khuôn thận trọng, không điều chỉnh cân nặng)",
};

const dong = (s) => String(s).replace(/\s+/gu, " ").trim();
const out = [];
const p = (s = "") => out.push(s);

p("# Hồ sơ ký duyệt GÓI C — nội dung SỨC KHOẺ (bản nháp)");
p();
p(
  "> 🔴 Tệp này do máy sinh từ `config/suc-khoe-noi-dung.ts` và `config/suc-khoe-tu-dien.ts`.",
);
p("> Đừng sửa tay. Sinh lại: `node scripts/xuat-noi-dung-ky-duyet-goi-c.mjs`.");
p();
p("## Anh/chị được nhờ làm gì");
p();
p(
  "Đọc từng câu dưới đây — là chữ sẽ hiện trên ứng dụng cho **phụ huynh và học sinh** — rồi đánh dấu",
);
p(
  "từng mục: ✅ đồng ý · ✏️ sửa thành … · ❌ bỏ. Ứng dụng **chưa được mở cho người dùng thật** cho tới khi",
);
p("hồ sơ này có chữ ký.");
p();
p(
  "**Phạm vi:** chỉ là thông tin tham khảo chung theo nhóm tuổi; ứng dụng không chẩn đoán, không kê đơn.",
);
p();
p("## Những chỗ cần đối chiếu số liệu với nguồn hiện hành");
p();
p("- Vận động trẻ 5–17 tuổi: ≈ 60 phút/ngày vận động từ vừa đến mạnh (WHO).");
p(
  "- Vận động trẻ 3–4 tuổi: ≈ 180 phút/ngày hoạt động thể chất; màn hình ≤ 1 giờ/ngày (2–4 tuổi) (WHO 2019).",
);
p("- Vận động người lớn: 150–300 phút/tuần vừa phải + 2 buổi sức mạnh (WHO).");
p(
  "- Giấc ngủ: 1–2 tuổi 11–14 giờ · 3–4 tuổi 10–13 giờ · 6–12 tuổi 9–12 giờ · thiếu niên 8–10 giờ · người lớn 7–9 giờ.",
);
p("- BMI người lớn theo ngưỡng châu Á – Thái Bình Dương: 18,5 / 23 / 25 / 30.");
p("- Tốc độ giảm cân an toàn cho người lớn: ≈ 0,5 kg/tuần.");
p(
  "- Nước uống người lớn ≈ 1,5–2 lít/ngày; sữa/chế phẩm từ sữa 2–3 phần/ngày cho trẻ.",
);
p(
  "- Nhu cầu năng lượng người lớn tính bằng công thức Mifflin–St Jeor × hệ số vận động (1,2 / 1,55 / 1,725).",
);
p(
  '- Bảng chuẩn tăng trưởng trẻ em (WHO 2006 / 2007): **chưa nhúng** — ứng dụng hiện chỉ hiện BMI thô cho trẻ và nói rõ "chưa so được với bảng chuẩn".',
);
p();
p("## Hàng rào an toàn đã có test (mong anh/chị góp ý thêm)");
p();
p(
  '- Người dưới 19 tuổi: **không bao giờ** có lời khuyên giảm cân/ăn kiêng; không gắn nhãn "béo phì/thừa cân" cho trẻ.',
);
p(
  "- Đang mang thai/cho con bú: không tính BMI, không lời khuyên điều chỉnh cân nặng.",
);
p("- Có bệnh nền: chỉ nhắc hỏi bác sĩ.");
p("- Số đo ngoài khoảng hợp lý bị từ chối thay vì tính bừa.");
p();

for (const [ma, k] of Object.entries(KHUON_LOI_KHUYEN)) {
  p(`## ${TEN_KHUON[ma] ?? ma}`);
  p();
  p(`**Mô tả chỉ số:** ${dong(k.giaiThich)}`);
  p();
  for (const [ten, g] of [
    ["Ăn uống", k.anUong],
    ["Vận động", k.vanDong],
    ["Nghỉ ngơi", k.nghiNgoi],
  ]) {
    p(`### ${ten} — ${dong(g.tieuDe)}`);
    p();
    p(`*Tóm tắt:* ${dong(g.tomTat)}`);
    p();
    for (const [bt, nd] of g.muc) p(`- ☐ ${bt} ${dong(nd)}`);
    if (g.luuY) p(`- ☐ 💡 ${dong(g.luuY)}`);
    if (g.tuan) {
      p();
      p(
        "*Gợi ý một tuần:* " + g.tuan.map(([t, v]) => `${t}: ${v}`).join(" · "),
      );
    }
    p();
  }
  p("### Thử thách tuần");
  p();
  for (const t of k.thuThach) p(`- ☐ ${dong(t)}`);
  p();
}

p("## Lời nhắn quan trọng (khung lưu ý hiện cuối trang)");
p();
const M = CHU_SK.mienTru;
p(`☐ ${dong(M.moDau)}`);
p();
p(`☐ ${dong(M.nenGap)}`);
p();
for (const d of M.dieu) p(`- ☐ ${dong(d)}`);
p();
p(`☐ ${dong(M.chuc)}`);
p();
p(
  "> Câu chữ miễn trừ trách nhiệm nên được **luật sư** đọc lại riêng (đây không phải ý kiến pháp lý).",
);
p();
p("## Xác nhận");
p();
p(
  "Tôi đã đọc các nội dung trên và đồng ý để ứng dụng hiển thị (kèm các chỉnh sửa đã ghi).",
);
p();
p("Họ tên · chức danh / nơi công tác: ______________________________");
p();
p("Chữ ký: ______________________   Ngày: ____ / ____ / ________");
p();

writeFileSync(
  new URL("docs/noi-dung-cho-ky-duyet-goi-c.md", GOC),
  out.join("\n"),
);
console.log(`✅ docs/noi-dung-cho-ky-duyet-goi-c.md — ${out.length} dòng`);
