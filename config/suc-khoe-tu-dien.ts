/**
 * TỪ ĐIỂN CHỮ HIỂN THỊ CỦA THẺ "SỨC KHOẺ GIA ĐÌNH" (ADR-010) — tiếng Việt 100%, một nơi.
 * Không gõ thẳng chữ vào component (`.claude/rules/ngon-ngu-ui.md`).
 *
 * Giọng văn: Sata Robo xưng "Sata Robo", gọi người dùng là "anh chị", gọi trẻ là "bé".
 * 🔴 Lời miễn trừ do chủ dự án duyệt 03/11/2026; nên nhờ luật sư/chuyên gia y tế đọc lại
 * trước khi bật cho người dùng thật. `{ten}` `{ngay}` `{so}` là chỗ thay.
 *
 * Thuộc TẦNG LÕI: chỉ dữ liệu, không React.
 */

import type {
  CanhBao,
  LyDoTuChoi,
  PhanLoaiBmi,
  PhanLoaiZ,
} from "@modules/core/suc-khoe/kieu";

export const CHU_SK = {
  tieuDeThe: "Sức khoẻ gia đình",
  huyHieu: "🌟 Cùng Sata Robo",
  hero: {
    phan1: "Cả nhà ",
    nhan: "khoẻ mỗi ngày",
    phan2: ", vui mỗi ngày!",
    moTa: "Sata Robo giúp ba mẹ và các bé hiểu hơn về cơ thể, ăn uống, vận động và giấc ngủ — nhẹ nhàng, dễ hiểu, dành riêng cho từng người trong nhà.",
    nut: "Thêm số đo mới →",
    thoiLinhVat: ["💪 Khoẻ mạnh", "🥦 Ăn đủ chất", "😴 Ngủ ngon"],
    altLinhVat: "Sata Robo, linh vật của SATA ROBO, đang giơ cúp chào mừng",
    altLogo: "SATA ROBO",
  },

  form: {
    tieuDe: "Thêm số đo mới",
    goiY: "Mỗi người giữ 3 bản mới nhất — lưu bản mới thì bản cũ nhất được thay.",
    ten: "Tên hoặc biệt danh",
    ngaySinh: "Ngày sinh",
    gioiTinh: "Giới tính",
    gioiTinhGoiY: "(để so đúng bảng chuẩn)",
    nu: "Nữ",
    nam: "Nam",
    ngayDo: "Ngày đo",
    canNang: "Cân nặng",
    chieuCao: "Chiều cao",
    donViKg: "(kg)",
    donViCm: "(cm)",
    themThongTin: "Thêm thông tin cho chính xác hơn (không bắt buộc)",
    vongEo: "Vòng eo",
    vongEoGoiY: "(cm, từ người lớn)",
    mucVanDong: "Mức vận động",
    vanDong: { it: "Ít vận động", vua: "Vừa phải", nhieu: "Nhiều" },
    mangThai: "Đang mang thai hoặc cho con bú",
    benhNen: "Có bệnh nền hoặc đang dùng thuốc theo chỉ định",
    luu: "Lưu và xem cùng Sata Robo",
    riengTu: "Chỉ lưu trên máy của anh chị, không gửi đi đâu.",
  },
  loiForm: {
    tenRong: "Anh chị nhập tên hoặc biệt danh nhé.",
    ngayThieu: "Anh chị nhập ngày sinh và ngày đo nhé.",
    canNangThieu: "Anh chị nhập cân nặng và chiều cao nhé.",
    luuKhongDuoc:
      "Rất tiếc, máy chưa lưu được số đo này. Anh chị thử lại giúp Sata Robo nhé.",
  } as const,
  lyDoTuChoi: {
    "ngay-sinh-hong": "Ngày sinh chưa hợp lệ.",
    "ngay-do-hong": "Ngày đo chưa hợp lệ.",
    "do-truoc-khi-sinh": "Ngày đo phải sau ngày sinh.",
    "tuoi-ngoai-khoang": "Tuổi nằm ngoài khoảng Sata Robo hỗ trợ.",
    "can-nang-ngoai-khoang": "Cân nặng nên trong khoảng 2–300 kg.",
    "chieu-cao-ngoai-khoang": "Chiều cao nên trong khoảng 40–250 cm.",
    "vong-eo-ngoai-khoang": "Vòng eo nên trong khoảng 30–250 cm.",
  } satisfies Record<LyDoTuChoi, string>,

  bang: {
    tieuDe: "Bảng sức khoẻ cả nhà",
    soNguoi: "Số người",
    soBan: "Số bản đã lưu",
    moiNguoiToiDa: "Mỗi người tối đa",
    banUnit: "bản",
    moi: "Mới",
    ban: "bản",
    xem: "Bấm để xem chi tiết ▾",
    dangXem: "Đang xem ▴ (bấm để đóng)",
    them: "＋ Thêm người",
    conCho: "còn {so} chỗ",
    trong: "Chưa có ai trong sổ. Anh chị thêm số đo đầu tiên ở trên nhé!",
    bmi: "BMI",
    xuHuong: "Xu hướng BMI",
  },

  ct: {
    tieuDe: "Chi tiết: {ten}",
    soBanDaLuu: "{so}/{toiDa} bản đã lưu",
    moiNhat: "Mới nhất",
    doNgay: "Đo ngày {ngay}",
    chieuCao: "Chiều cao",
    canNang: "Cân nặng",
    bmi: "BMI",
    nangLuong: "Năng lượng ≈",
    nangLuongNghi: "Năng lượng nghỉ ≈",
    kcalNgay: "kcal/ngày",
    soVoi: "So với {ngay}:",
    canNangLabel: "cân nặng",
    chieuCaoLabel: "chiều cao",
    tang: "tăng",
    giam: "giảm",
    khongDoi: "không đổi",
    banCuTieuDe: "Các bản cũ hơn (bấm để xem, bấm lại để đóng)",
    banNgay: "Bản ngày {ngay}",
    tuan: "Gợi ý một tuần",
    thuThach: "Thử thách tuần này",
    thuThachTomTat: "3 mục nhỏ, tick để Sata Robo cổ vũ",
    taiPdf: "Tải bản PDF của {ten}",
    daTaiPdf: "Đã tải bản PDF về máy.",
    loiTaiPdf: "Chưa tạo được bản PDF. Anh chị thử lại giúp Sata Robo nhé.",
    xoaNguoi: "Xoá người này",
    xoaBan: "Xoá bản này",
    khongApBmi: "Không áp dụng BMI",
    khongApBmiMoTa:
      "Với người đang mang thai hoặc cho con bú, BMI không phản ánh đúng. Anh chị trao đổi với bác sĩ nhé.",
    chuaCoBang: "Chưa so được với bảng chuẩn tăng trưởng",
    chuaCoBangMoTa:
      "Sata Robo đang chờ bảng chuẩn tăng trưởng của WHO nên hiện chỉ hiện BMI thô. Anh chị nhờ bác sĩ nhi đánh giá tăng trưởng của bé nhé.",
  },

  phanLoaiBmi: {
    "thieu-can": "Nhẹ cân (châu Á)",
    "binh-thuong": "Bình thường (châu Á)",
    "thua-can": "Thừa cân (châu Á)",
    "beo-phi": "Béo phì độ I (châu Á)",
    "beo-phi-nang": "Béo phì độ II (châu Á)",
  } satisfies Record<PhanLoaiBmi, string>,
  /** Trẻ em: ngôn từ NHẸ, không dùng "béo phì/thừa cân" gắn nhãn cho bé. */
  phanLoaiZ: {
    "thap-nang": "Cách xa vùng thông thường",
    thap: "Thấp hơn vùng thông thường",
    "binh-thuong": "Trong vùng tham khảo thông thường",
    cao: "Cao hơn vùng thông thường",
    "cao-nang": "Cách xa vùng thông thường",
  } satisfies Record<PhanLoaiZ, string>,
  canhBao: {
    "khong-thay-bac-si":
      "Thông tin chỉ để tham khảo, không thay thế ý kiến của bác sĩ.",
    "nen-gap-chuyen-gia":
      "Nên gặp bác sĩ hoặc chuyên gia dinh dưỡng để được tư vấn riêng.",
    "mang-thai-khong-ap-bmi":
      "Không áp dụng BMI khi đang mang thai hoặc cho con bú.",
    "benh-nen-hoi-bac-si":
      "Có bệnh nền: hãy hỏi bác sĩ trước khi thay đổi ăn uống hoặc tập luyện.",
    "chua-co-bang-tang-truong": "Chưa so được với bảng chuẩn tăng trưởng.",
  } satisfies Record<CanhBao, string>,
  nhomLoiKhuyen: { an: "🥦", vd: "🏃", ng: "😴", thu: "⭐" },

  thongBao: {
    daLuu: "Đã lưu số đo mới cho {ten}.",
    banCuThay: " Bản cũ nhất ({ngay}) đã được thay để giữ tối đa {toiDa} bản.",
    daXoaNguoi: "Đã xoá {ten} khỏi sổ.",
    daXoaBan: "Đã xoá bản ngày {ngay}.",
  },

  hop: {
    nguoiTieuDe: "Cả nhà đã đủ {toiDa} người",
    nguoiMoTa:
      "Sổ chứa tối đa {toiDa} người. Để thêm {ten}, anh chị chọn một người để xoá bớt (toàn bộ các bản của người đó sẽ bị xoá khỏi máy):",
    nguoiDong: "{ten} · {tuoi} · {so} bản",
    xoaNguoiTieuDe: "Xoá {ten}?",
    xoaNguoiMoTa: "Toàn bộ các bản đo của người này sẽ bị xoá khỏi máy.",
    xoaBanTieuDe: "Xoá bản ngày {ngay}?",
    xoaBanMoTa: "Bản đo này sẽ bị xoá khỏi máy.",
    nenSaoLuu: "Anh chị nên tải bản sao lưu trước để giữ lại số đo cũ.",
    taiSaoLuu: "Tải bản sao lưu trước",
    daTai: "Đã tải bản sao lưu về máy.",
    loiTai: "Chưa tải được bản sao lưu. Anh chị thử lại nhé.",
    xoaVaLuu: "Xoá người đã chọn và lưu",
    xoa: "Xoá",
    huy: "Huỷ",
    nhanDanhSach: "Chọn người cần xoá",
  },

  /** 🔴 LỜI MIỄN TRỪ — nằm DƯỚI kết quả, trong một khung riêng. */
  mienTru: {
    tieuDe: "Lời nhắn quan trọng từ Sata Robo",
    moDau:
      "Thẻ này được tạo ra để các gia đình có thêm kiến thức tham khảo, cùng nhau chăm sóc sức khoẻ mỗi ngày. Những gì anh chị đọc ở đây là **thông tin tham khảo**, không phải chẩn đoán hay chỉ định của bác sĩ. Khi có điều băn khoăn, hỏi ý kiến bác sĩ luôn là lựa chọn an toàn và chắc chắn nhất.",
    nenGap:
      "**Hãy gặp bác sĩ** khi bé tăng/giảm cân bất thường, chậm lớn, sụt cân không rõ lý do; khi có bệnh nền, đang dùng thuốc, mang thai hoặc cho con bú; hoặc bất cứ khi nào anh chị thấy lo. Trường hợp khẩn cấp, gọi **115** hoặc đến cơ sở y tế gần nhất.",
    dieu: [
      "**Để tham khảo và học hỏi.** Nội dung hỗ trợ phụ huynh, học sinh và gia đình có thêm kiến thức chăm sóc sức khoẻ. Đây không phải dịch vụ y tế.",
      "**Không thay thế bác sĩ.** Ứng dụng không chẩn đoán, không điều trị, không kê đơn, không đưa ra chỉ định y khoa. Quyết định về sức khoẻ vẫn thuộc về anh chị cùng bác sĩ của mình.",
      "**Kết quả là ước tính.** Chỉ số tính từ số đo anh chị nhập và các mốc tham chiếu chung (như của Tổ chức Y tế Thế giới). Mỗi người một thể trạng; con số chỉ là một góc nhìn, không phải “điểm số” của ai.",
      "**Với trẻ em.** Xin đừng tự áp dụng ăn kiêng hay giảm cân cho trẻ. Mọi thay đổi lớn về dinh dưỡng và vận động của bé nên có ý kiến bác sĩ nhi hoặc chuyên gia dinh dưỡng.",
      "**Thông tin thuộc về gia đình.** Số đo được lưu ngay trên thiết bị, không gửi đi đâu. Sổ lưu tối đa 6 người, mỗi người 3 bản; anh chị nên tải bản sao lưu để không mất khi đổi máy hoặc khi phải xoá bớt.",
      "**Trách nhiệm sử dụng.** Anh chị tự cân nhắc khi áp dụng thông tin tham khảo. Trong phạm vi pháp luật cho phép, SATA ROBO không chịu trách nhiệm đối với các quyết định chỉ dựa trên thông tin trong thẻ này.",
    ],
    chuc: "Sata Robo chúc mỗi gia đình luôn khoẻ mạnh và hạnh phúc! 🌱",
  },
} as const;
