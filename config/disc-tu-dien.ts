/**
 * TỪ ĐIỂN DUY NHẤT của khoang DISC — mọi chữ hiện trên màn hình lấy từ đây.
 *
 * Luật `.claude/rules/ngon-ngu-ui.md`: không gõ chữ thẳng vào component. Thêm từ mới
 * thì thêm vào đây trước, để không mỗi nơi dịch một kiểu.
 *
 * File này thuộc TẦNG LÕI (ADR-004): không React, không DOM.
 */

import { MAU } from "./thuong-hieu";

/* ── Khoang (mục trên thanh bên) ─────────────────────────────────────────── */

export const MA_KHOANG = ["disc", "lich-su"] as const;
export type MaKhoang = (typeof MA_KHOANG)[number];

export const KHOANG_MAC_DINH: MaKhoang = "disc";

export const TEN_KHOANG: Record<MaKhoang, string> = {
  disc: "DISC",
  "lich-su": "Bài đã làm",
};

export const MO_TA_KHOANG: Record<MaKhoang, string> = {
  disc: "Trắc nghiệm hành vi cho học sinh và phụ huynh",
  "lich-su": "Kết quả đã lưu trên máy này",
};

/** Khoang chưa dựng xong — hiện nhãn "đang dựng" để đừng ai bấm vào rồi ngã ngửa. */
export const KHOANG_DANG_DUNG: readonly MaKhoang[] = [];

/**
 * Trả về một mã khoang LUÔN hợp lệ.
 *
 * localStorage là thứ người dùng (và tiện ích trình duyệt) sửa được tuỳ ý. Một mã lạ
 * nằm trong đó không được phép làm trắng trang — nó rơi về mặc định, im lặng và đúng.
 */
export function chuanHoaMaKhoang(giaTri: unknown): MaKhoang {
  return typeof giaTri === "string" && (MA_KHOANG as readonly string[]).includes(giaTri)
    ? (giaTri as MaKhoang)
    : KHOANG_MAC_DINH;
}

/** Khoá localStorage nhớ khoang đang mở. */
export const KHOA_KHOANG_DANG_MO = "disc:khoang-dang-mo";

/* ── Bốn trục hành vi ────────────────────────────────────────────────────── */

export const MA_TRUC = ["D", "I", "S", "C"] as const;
export type MaTruc = (typeof MA_TRUC)[number];

export type MoTaTruc = {
  readonly ten: string;
  /** Tên trục trong mô hình DISC. Chỉ hiện ở khối tra cứu, KHÔNG hiện ở nhãn biểu đồ. */
  readonly tenTiengAnh: string;
  /** Nghĩa gọn của chữ tiếng Anh đó — viết bằng hành vi, không bằng nhãn con người. */
  readonly nghia: string;
  /** Một dòng ≤12 từ cho khối tóm tắt 30 giây. Dài hơn là không còn 30 giây nữa. */
  readonly motDong: string;
  readonly nhanVat: string;
  readonly mau: string;
  readonly dauHieuOTre: string;
};

/** Thứ tự D-I-S-C là thứ tự cố định dùng ở mọi nơi (DISC_BA.md §7.4). */
export const TRUC: Record<MaTruc, MoTaTruc> = {
  D: {
    ten: "Chủ động",
    tenTiengAnh: "Dominance",
    nghia: "Chủ động, quyết đoán, hướng tới kết quả",
    motDong: "Quyết nhanh, nói thẳng, thích tự làm",
    nhanVat: "Rô Xung Phong",
    mau: "#FF6F00",
    dauHieuOTre: "Bày cách chơi, đòi tự làm, thích thắng",
  },
  I: {
    ten: "Ảnh hưởng",
    tenTiengAnh: "Influence",
    nghia: "Ảnh hưởng, kết nối, truyền cảm hứng",
    motDong: "Kết nối nhanh, thích kể và được nghe",
    nhanVat: "Rô Kể Chuyện",
    mau: "#FFB300",
    dauHieuOTre: "Kể chuyện, kết bạn nhanh, thích được chú ý",
  },
  S: {
    ten: "Ổn định",
    tenTiengAnh: "Steadiness",
    nghia: "Kiên định, bền bỉ, giữ nhịp ổn định",
    motDong: "Kiên nhẫn, giữ nếp, cần được báo trước",
    nhanVat: "Rô Giữ Nhịp",
    mau: "#2E9E6B",
    dauHieuOTre: "Nhường bạn, thích nếp quen, chờ được lâu",
  },
  C: {
    ten: "Cẩn trọng",
    tenTiengAnh: "Conscientiousness",
    nghia: "Cẩn trọng, theo nguyên tắc, chú ý chi tiết",
    motDong: "Cần lý do rõ, soát kỹ, ngại làm qua loa",
    nhanVat: "Rô Tỉ Mỉ",
    mau: MAU.timCongNghe,
    dauHieuOTre: "Làm theo hướng dẫn, soát lại, hỏi vì sao",
  },
};

/* ── Chữ dùng chung trên khung ngoài ─────────────────────────────────────── */

export const CHU = {
  tenThuongHieu: { truoc: "SATA", sau: "ROBO" },
  dongPhuLogo: "Xưởng khám phá",
  camKetDuLieu: "Câu trả lời không rời máy bạn",
  camKetDuLieuPhu: "Xoá dữ liệu duyệt web là mất. Sao lưu trước khi dọn máy.",
  nhanDangDung: "đang dựng",
  dieuHuongChinh: "Khoang chính",
} as const;

/* ── Chữ trong từng khoang ───────────────────────────────────────────────── */

export const CHU_DISC = {
  nhanTren: "Bốn nhóm hành vi",
  tieuDe: "DISC đo thiên hướng hành vi, không đo giỏi hay dốt.",
  moTa: "Không có nhóm nào tốt hơn nhóm nào. Mỗi người là một pha trộn của cả bốn, chỉ khác nhau ở chỗ nhóm nào đậm hơn.",
  ghiChuDangDung: "Phần chọn đối tượng và bộ câu hỏi chưa dựng xong.",
} as const;

export const CHU_LICH_SU = {
  nhanTren: "Trên máy này",
  tieuDe: "Bài đã làm",
  moTa: "Kết quả lưu ngay trong trình duyệt của bạn, không gửi đi đâu. Danh sách bài, mở lại, xoá và sao lưu sẽ nằm ở đây.",
  ghiChuDangDung: "Phần lưu trữ chưa dựng xong.",
} as const;

/* ── Chữ của màn kết quả ─────────────────────────────────────────────────── */

export const CHU_KET_QUA = {
  /** HL-1 — trả lời phẳng. 🔴 Không được nới thành "vẫn xem kết quả tạm". */
  phang:
    "Bài này chưa đủ để kết luận — hầu hết câu đều ở mức giữa. Làm lại và chọn ngả về một bên nhé.",
  thieuCau: "Còn câu chưa trả lời. Quay lại trả lời nốt rồi mới xem được kết quả.",
  /** Dùng ở chỗ CHƯA biết bộ đề (trang thử). Màn kết quả thật dùng DIEN_GIAI.DEU. */
  phoDeu:
    "Bốn nhóm hành vi khá cân bằng — chưa có nhóm nào nổi rõ. Điều này bình thường, nhất là với trẻ đang lớn.",
  canhBao: {
    MOT_COT: "Có một đoạn dài bạn chọn cùng một mức. Kết quả có thể chưa phản ánh đúng.",
    MAU_THUAN: "Có vài câu bạn trả lời ngược nhau.",
    BAM_BUA: "Bài làm khá nhanh. Đọc kỹ hơn thì kết quả sát hơn.",
  } as const,
  /** Câu rào bắt buộc mở đầu báo cáo của bộ MN và TH (DISC_BA.md §9.2). */
  cauRaoTre: "Đây là gợi ý để trò chuyện với con, không phải kết luận về con.",
  /**
   * Câu rào bản TỰ ĐỌC — bộ Tiểu học, nơi chính em học sinh cầm máy.
   *
   * 🔴 §9.2 luật 6 đòi bộ MN và TH đều mở đầu bằng câu rào, và bản dựng cũ dùng chung
   * `cauRaoTre` cho cả hai. Nhưng `cauRaoTre` nói với PHỤ HUYNH ("trò chuyện với con") —
   * một em lớp 4 đang đọc kết quả của chính mình bị gọi là "con". Giữ đủ hai câu rào theo
   * đúng đặc tả, nhưng mỗi câu nói với đúng người đang đọc.
   */
  cauRaoTuMinh: "Đây là gợi ý để em hiểu mình hơn, không phải kết luận về em.",

} as const;

/* ── Đoạn mở đầu + bảng tra D-I-S-C (GĐ10) ───────────────────────────────── */

/**
 * ĐOẠN MỞ ĐẦU đặt trên biểu đồ.
 *
 * 🔴 VÌ SAO GIỌNG NÀY. Chủ dự án muốn đoạn này "tạo niềm tin, thấy nó đúng khoa học".
 * Nhưng đặc tả CẤM tuyên bố "chuẩn quốc tế" (`DISC_BA.md:157-160`), và tới hôm nay bộ 104
 * câu vẫn CHƯA ai ký duyệt, CHƯA sàng trên dữ liệu Việt. Nói quá lên là thứ sẽ vỡ đúng vào
 * ngày một phụ huynh có chuyên môn đọc nó.
 *
 * Nên niềm tin ở đây đến từ chỗ khác: nói rõ mình đo gì, KHÔNG đo gì, con số nghĩa là gì,
 * và mình sai được ở đâu. Với phụ huynh có học, đó là thứ duy nhất đứng vững — và nó cũng
 * là thứ duy nhất đúng.
 *
 * ⚠️ Sửa đoạn này thì phải đọc lại `DISC_BA.md:150-160`: viết `DISC` in hoa (không `DiSC` —
 * nhãn hiệu của Wiley), không mượn tên báo cáo của họ, không tuyên bố chuẩn hoá.
 */
export const CHU_MO_DAU = {
  nhan: "Đọc bốn con số này thế nào",
  doanVan: [
    "DISC đo THIÊN HƯỚNG HÀNH VI — nghiêng về cách làm nào — chứ không đo giỏi hay dốt, và cũng không mô tả trọn vẹn một con người.",
    "Không có nhóm nào tốt hơn nhóm nào. Mỗi người là pha trộn của cả bốn nhóm, chỉ khác nhau ở chỗ nhóm nào đậm hơn.",
    "Bốn con số ở trên so với NHAU trong chính hồ sơ này. Chúng không phải phần trăm, và không so với bất kỳ ai khác.",
    "Đây là ảnh chụp của khoảng hai tuần gần đây, không phải một kết luận. Trẻ đang lớn thì hồ sơ còn đổi — làm lại sau vài tháng thường cho hình ảnh rõ hơn.",
    "Dùng đúng: để mở một cuộc trò chuyện. Dùng sai: để dán một cái nhãn.",
  ],
  nguonGoc: "Bộ câu hỏi do SATA ROBO biên soạn theo mô hình DISC.",
  /**
   * Nhãn cho khối tóm tắt 30 giây.
   *
   * 🔴 Khối tóm tắt là chỗ DUY NHẤT được phép nói lại điều đã nói ở dưới — và nó phải là
   * CON TRỎ (mỗi ý một dòng), không phải một đoạn văn thứ hai. Viết thành đoạn văn là biến
   * "ngắn gọn mà đầy đủ" thành "dài thêm một lần nữa".
   */
  tomTat: {
    nhan: "Đọc trong 30 giây",
    manhNhat: "Nổi nhất",
    nheNhat: "Nhẹ nhất",
    lamNgay: "Làm ngay",
  },
} as const;

/**
 * Bảng tra bốn chữ cái.
 *
 * 🔴 ĐẶT TRONG MỘT KHỐI GẬP RIÊNG, KHÔNG chèn vào nhãn biểu đồ. Đặc tả chốt: *"Trẻ dưới 12
 * tuổi không đọc nổi Dominance"* (`DISC_BA.md:84`) — đó chính là lý do sản phẩm có bốn nhân
 * vật robot. Nhét chữ tiếng Anh vào nhãn biểu đồ là đưa nó ra trước mắt một bé năm tuổi,
 * và còn làm nhãn dài ra đủ để tràn khung ảnh PNG.
 *
 * Dùng bộ tên HIỆN HÀNH. Bản gốc 1928 của Marston dùng bộ từ khác (Inducement / Submission /
 * Compliance) — đúng về lịch sử nhưng chỉ làm phụ huynh rối, nên không liệt kê ra.
 */
export const CHU_BANG_TRA = {
  tieuDe: "Bốn chữ D-I-S-C nghĩa là gì",
  ghiChu:
    "Bốn nhóm này mô tả cách hành xử, không xếp hạng con người. Mô hình do nhà tâm lý học W.M. Marston mô tả lần đầu năm 1928.",
} as const;

/* ── Chọn đối tượng & định tuyến ─────────────────────────────────────────── */

export const MA_DOI_TUONG = ["mam-non", "tieu-hoc", "thcs", "phu-huynh"] as const;
export type MaDoiTuong = (typeof MA_DOI_TUONG)[number];

export const DOI_TUONG: Record<MaDoiTuong, { ten: string; moTa: string }> = {
  "mam-non": { ten: "Mầm non", moTa: "Bé 3–5 tuổi · bố mẹ hoặc thầy cô trả lời giúp" },
  "tieu-hoc": { ten: "Tiểu học", moTa: "Lớp 1–5" },
  thcs: { ten: "Trung học cơ sở", moTa: "Lớp 6–9 · các em tự làm" },
  "phu-huynh": { ten: "Phụ huynh", moTa: "Tìm hiểu về chính mình, hoặc trả lời về con" },
};

export const CHU_CHON = {
  nhanTren: "5–8 phút · không có câu nào đúng hay sai",
  tieuDe: "Ai sẽ làm bài này?",
  hoiLop: "Bé đang học lớp mấy?",
  hoiMucTieu: "Bạn muốn làm gì?",
  mucTieuToi: "Tìm hiểu về chính tôi",
  mucTieuCon: "Trả lời về con tôi",
  hoiTuoiCon: "Con bạn bao nhiêu tuổi?",
  nutTiepTuc: "Tiếp tục",
  nutQuayLai: "Quay lại",
  /**
   * 🔴 VĂN BẢN BẮT BUỘC HIỆN khi chuyển lớp 1–2 sang bản quan sát (DISC_BA.md §4.2).
   * Chuyển im lặng là lừa người dùng; không chuyển là bịa số. Không được rút gọn.
   */
  giaiThichLop12: {
    tieuDe: "Lớp 1–2 dùng bản dành cho người lớn trả lời.",
    than:
      "Trẻ dưới 8 tuổi chưa tự nhìn lại được tính cách của mình, nên kết quả bé tự tick sẽ không đáng tin. Bố mẹ hoặc thầy cô trả lời giúp — dựa trên những gì thật sự nhìn thấy trong khoảng hai tuần gần đây.",
  },
  giaiThichConDuoi8: {
    tieuDe: "Con dưới 8 tuổi dùng bản quan sát.",
    than:
      "Bản đối chiếu hai góc nhìn cần con tự làm bài, mà trẻ dưới 8 tuổi chưa tự đánh giá được. Bạn trả lời bản quan sát — dựa trên những gì thật sự nhìn thấy trong khoảng hai tuần gần đây.",
  },
} as const;

/* ── M2 — trước khi bắt đầu ──────────────────────────────────────────────── */

export const CHU_TRUOC_KHI_BAT_DAU = {
  tieuDe: "Trước khi bắt đầu",
  danDo: [
    { nhan: "Mất bao lâu", than: "Khoảng {phut} phút. Không có đồng hồ đếm ngược." },
    { nhan: "Không có đúng sai", than: "Không có câu trả lời nào tốt hơn câu nào." },
    {
      nhan: "Dữ liệu không rời máy",
      than: "Câu trả lời lưu ngay trong trình duyệt này. Không gửi đi đâu cả.",
    },
    {
      nhan: "Trả lời theo phản xạ đầu tiên",
      than: "Đừng cân nhắc lâu. Cảm giác đầu tiên thường đúng hơn.",
    },
  ],
  nhanO: "Đặt một tên gọi để nhận ra bài này",
  nhacO: "Biệt danh cũng được. Đừng ghi họ tên đầy đủ.",
  nhacNghiHoTen: "Nghe như họ tên đầy đủ. Dùng biệt danh thì an toàn hơn cho con.",
  oTrong: "Nhập một tên gọi rồi mới bắt đầu được.",
  nutBatDau: "Bắt đầu",
  demKyTu: "{da}/{toiDa}",
} as const;

/**
 * Thời gian ước lượng từng bộ (DISC_BA.md §4.1).
 * Để RIÊNG khỏi ngân hàng câu: sửa con số này không được làm đổi checksum nội dung câu.
 */
export const PHUT_UOC_LUONG: Record<string, string> = {
  MN: "5–6",
  TH: "5–7",
  THCS: "6–8",
  PH: "6–8",
  QS: "4–5",
};

/* ── M3 — làm bài ────────────────────────────────────────────────────────── */

export const CHU_LAM_BAI = {
  nutTiep: "Tiếp",
  nutQuayLai: "Quay lại",
  nutXemKetQua: "Xem kết quả",
  conThieu: "Còn câu chưa chọn ở màn này.",
  /** Dòng động viên nhẹ sau mỗi 5 câu. Xoay vòng để không lặp một câu suốt bài. */
  dongVien: [
    "Xong 5 câu rồi, giỏi lắm!",
    "Đang tốt lắm, cứ theo cảm giác đầu tiên nhé.",
    "Nửa chặng rồi!",
    "Sắp xong rồi, cố lên!",
    "Chỉ còn vài câu nữa thôi.",
  ],
  tiepTucNhap: "Bài đang làm dở đã được mở lại từ chỗ bạn dừng.",
} as const;

/* ── Lệch phong cách bố mẹ ↔ con ───────────────────────────────────────── */

export const CHU_PHONG_CACH = {
  tieuDe: "Phong cách của bạn và của con",
  moTa: "So hồ sơ bạn tự làm ở bộ Phụ huynh với hồ sơ đang xem. Chỗ vênh nhau nhiều nhất thường là chỗ hai bên hay va nhau.",
  nhanBoMe: "bạn",
  nhanCon: "con",
  ratGiongNhau:
    "Bốn nhóm của hai người khá gần nhau. Điều đó thường làm việc hiểu nhau dễ hơn — nhưng cũng có nghĩa là điểm cần để ý của bạn và của con nhiều khả năng trùng nhau.",
  moiTieuDe: "Muốn biết bạn và con khác nhau ở đâu?",
  moiMoTa:
    "Làm thêm bộ Phụ huynh cho chính bạn (5–8 phút). Máy sẽ so hai hồ sơ và chỉ ra chỗ hai bên dễ va nhau nhất.",
  moiNut: "Làm bộ Phụ huynh",
} as const;

/* ── Ô chọn điều đang băn khoăn (màn kết quả) ───────────────────────────── */

export const CHU_BAN_KHOAN = {
  tieuDe: "Bạn đang băn khoăn điều gì?",
  moTa: "Chọn một điều để phần đọc sâu mở đúng chỗ bạn quan tâm. Không chọn cũng không sao.",
} as const;

/* ── M4 — kết quả ────────────────────────────────────────────────────────── */

export const CHU_M4 = {
  nghiengVe: "{ChuThe} nghiêng về nhóm {ten}",
  phaGiua: "Pha giữa {a} và {b}",
  phoDeu: "Bốn nhóm khá cân bằng",
  nutLamLai: "Làm bài khác",
  nutTaiAnh: "Tải ảnh kết quả",
  nutTaiPdf: "In / Tải PDF",
  dangVeAnh: "Đang vẽ ảnh…",
  loiVeAnh: "Không vẽ được ảnh. Thử lại giúp mình nhé.",
  anhBiCat: "Có câu hơi dài nên ảnh phải rút gọn bớt. Bản đầy đủ vẫn ở trên màn hình.",
  chanTrangAnh: "Câu trả lời không rời máy bạn",
  nhanBieuDo: "Điểm bốn nhóm, thang 0–100",
} as const;

/* ── M6 — bài đã làm ─────────────────────────────────────────────────────── */

export const CHU_M6 = {
  tieuDe: "Bài đã làm",
  moTa: "Kết quả lưu ngay trong trình duyệt này, không gửi đi đâu cả.",
  trong: "Chưa có bài nào trên máy này.",
  trongMoi: "Làm một bài ở mục DISC, kết quả sẽ hiện ở đây.",
  nutMoLai: "Mở lại",
  nutXoa: "Xoá",
  nutXoaSach: "Xoá sạch dữ liệu trên máy này",
  nutSaoLuu: "Sao lưu ra .zip",
  dangSaoLuu: "Đang nén…",
  loiSaoLuu: "Không tạo được file sao lưu. Thử lại giúp mình nhé.",
  hoiXoaBai: "Xoá bài này khỏi máy? Không lấy lại được.",
  hoiXoaSach: "Xoá TẤT CẢ bài trên máy này? Không lấy lại được.",
  nutDong: "Đóng",
  demBai: "{so} bài trên máy này",
  /** 🔴 QĐ7 — máy giáo viên đi qua nhiều gia đình. */
  canhBaoNhieuBietDanh:
    "Máy này đang giữ bài của {so} người khác nhau. Nếu là máy dùng chung, nên xoá sau mỗi lượt.",
  nhacMatDuLieu: "Xoá dữ liệu duyệt web là mất. Sao lưu ra .zip trước khi dọn máy.",
  /** Nút ở cuối màn kết quả — QĐ7. */
  nutKetThucVaXoa: "Kết thúc & xoá bài này khỏi máy",
  daXoaBai: "Đã xoá bài khỏi máy này.",
} as const;

/* ── Thu liên hệ (GĐ6) ───────────────────────────────────────────────────── */

/** 🔴 Số hotline/Zalo THẬT phải do chủ dự án điền — xem mục "CHỜ NGOÀI" trong CLAUDE.md. */
export const LIEN_HE_SATA = {
  soZalo: "0900000000",
  hienThi: "0900 000 000",
} as const;

export const CHU_LIEN_HE = {
  tieuDe: "Muốn nghe kỹ hơn về kết quả này?",
  moTa: "Để lại số, SATA ROBO gọi hoặc nhắn Zalo trong giờ hành chính. Không bắt buộc — bạn vẫn xem và tải được trọn kết quả.",
  nhanSo: "Số điện thoại",
  nhanTen: "Gọi bạn là gì (không bắt buộc)",
  nhanKenh: "Bạn muốn nhận qua",
  kenhZalo: "Zalo",
  kenhGoi: "Gọi điện",
  nutGui: "Gửi số cho SATA ROBO",
  dangGui: "Đang gửi…",
  soSai: "Số điện thoại chưa đúng. Nhập 10 số bắt đầu bằng 0.",
  chuaDongY: "Cần tick ô đồng ý trước khi gửi.",
  oDongY:
    "Tôi đồng ý để SATA ROBO liên hệ lại. Chỉ số điện thoại được gửi đi — câu trả lời và kết quả của con KHÔNG được gửi kèm.",
  daGui: "Đã nhận số. SATA ROBO sẽ liên hệ lại.",
  nutMoZalo: "Nhắn Zalo cho SATA ROBO",
  loiGui: "Chưa gửi được. Bạn nhắn Zalo giúp mình nhé.",
} as const;
