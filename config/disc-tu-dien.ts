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
  readonly nhanVat: string;
  readonly mau: string;
  readonly dauHieuOTre: string;
};

/** Thứ tự D-I-S-C là thứ tự cố định dùng ở mọi nơi (DISC_BA.md §7.4). */
export const TRUC: Record<MaTruc, MoTaTruc> = {
  D: {
    ten: "Chủ động",
    nhanVat: "Rô Xung Phong",
    mau: "#FF6F00",
    dauHieuOTre: "Bày cách chơi, đòi tự làm, thích thắng",
  },
  I: {
    ten: "Ảnh hưởng",
    nhanVat: "Rô Kể Chuyện",
    mau: "#FFB300",
    dauHieuOTre: "Kể chuyện, kết bạn nhanh, thích được chú ý",
  },
  S: {
    ten: "Ổn định",
    nhanVat: "Rô Giữ Nhịp",
    mau: "#2E9E6B",
    dauHieuOTre: "Nhường bạn, thích nếp quen, chờ được lâu",
  },
  C: {
    ten: "Cẩn trọng",
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
