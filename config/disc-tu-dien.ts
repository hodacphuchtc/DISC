/**
 * TỪ ĐIỂN DUY NHẤT của khoang DISC — mọi chữ hiện trên màn hình lấy từ đây.
 *
 * Luật `.claude/rules/ngon-ngu-ui.md`: không gõ chữ thẳng vào component. Thêm từ mới
 * thì thêm vào đây trước, để không mỗi nơi dịch một kiểu.
 *
 * File này thuộc TẦNG LÕI (ADR-004): không React, không DOM.
 */

import { LOP_MAM_NON, LOP_TREN_12 } from "./disc-nguong";
import { MAU } from "./thuong-hieu";

/* ── Khoang (mục trên thanh bên) ─────────────────────────────────────────── */

/**
 * 🔴 CÒN ĐÚNG MỘT KHOANG (V2.1).
 *
 * Trước đó có ba: `disc` · `lich-su` (Nhà mình) · `so-lieu`. *Nhà mình* nay là BƯỚC 1 nằm
 * bên trong DISC; *Số liệu* ẩn sau `?so-lieu=1`. Nên bộ mã khoang, hàm chuẩn hoá và khoá
 * `localStorage` nhớ-khoang-đang-mở đều đã **bị gỡ, không phải bị bỏ quên**: chúng không
 * còn ai gọi, và một hàm canh cửa không ai gọi thì im lặng y như một cửa canh hỏng.
 *
 * Giá trị `"lich-su"` còn sót trong `localStorage` của máy người dùng cũ **không gây hại**
 * — nay không ai đọc khoá đó nữa, trang luôn mở vào khung ba bước.
 */
export const TEN_KHOANG = { disc: "DISC" } as const;

export const MO_TA_KHOANG = {
  disc: "Cả nhà hiểu nhau hơn qua bốn nhóm hành vi",
} as const;

/**
 * Cửa sau vào màn *Số liệu máy này*: `?so-lieu=1` (V2.1).
 *
 * 🔴 Không phải bảo mật — ai đọc mã nguồn cũng thấy, và repo thì công khai. Đây chỉ là
 * cách giấu một màn KHÔNG DÀNH CHO PHỤ HUYNH khỏi đường đi của họ, mà vẫn giữ được chỗ
 * đọc `baiThuHai`. Màn đó chỉ ĐỌC và không gửi gì đi đâu, nên lộ đường vào không hại ai.
 */
export const THAM_SO_SO_LIEU = "so-lieu";

/* ── BA BƯỚC trong khoang DISC (V2.1) ────────────────────────────────────── */

/**
 * 🔴 THỨ TỰ NÀY LÀ NỘI DUNG, KHÔNG PHẢI TRÌNH BÀY. Khai người → làm bài → đọc về nhau.
 * Không có bước 1 thì bước 2 không có ai để chọn; không có bước 2 thì bước 3 không có gì
 * để so. Đảo thứ tự là làm hỏng chính câu chuyện mà sản phẩm kể.
 */
export const MA_BUOC = ["nha-minh", "lam-bai", "phan-tich"] as const;
export type MaBuoc = (typeof MA_BUOC)[number];

/**
 * Chữ của khung ba bước.
 *
 * 🔴 KHOÁ MỀM, KHÔNG GIẤU. Bước chưa mở được vẫn HIỆN RA, chỉ mờ đi kèm một câu nói rõ
 * còn thiếu gì. Giấu hẳn thì người dùng không biết phía trước còn gì — mà chính cái "phía
 * trước còn gì" mới là thứ khiến họ đi thêm một bước nữa.
 */
export const CHU_BUOC = {
  nhanTren: "Cho cả nhà · mỗi người 5–8 phút",
  tieuDe: "DISC gia đình",
  moTa: "Ba bước. Xong bước nào thì bước sau tự mở.",

  ten: {
    "nha-minh": "Nhà mình",
    "lam-bai": "Làm bài test",
    "phan-tich": "Phân tích cả nhà",
  },
  moTaBuoc: {
    "nha-minh": "Khai tên từng người trong nhà",
    "lam-bai": "Mỗi người tự làm bài của mình",
    "phan-tich": "Ai nên nói với ai thế nào cho thuận",
  },

  /* Dòng trạng thái SỐNG dưới mỗi tên bước — nhìn lướt là biết còn thiếu gì. */
  chuaCoAi: "Chưa có ai trong sổ",
  demNguoi: "{so} người trong sổ",
  taCaDaLam: "Cả nhà đã làm xong",
  conChuaLam: "Còn {so} người chưa làm",
  chuaAiLam: "Chưa ai làm bài",
  sanSangPhanTich: "{so} người đã xong — đọc được rồi",

  /* Lý do một bước chưa mở. Luôn nói CÒN THIẾU GÌ, không nói "chưa đủ điều kiện". */
  khoaChuaCoAi: "Thêm người ở bước 1 trước đã.",
  khoaChuaDuHaiNguoi:
    "Cần ít nhất 2 người làm xong bài thì mới có gì để so với nhau.",

  nutMo: "Mở",
  nutDong: "Thu lại",
} as const;

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

/* ── Chú giải bốn nhóm + khối dẫn nguồn (12.5) ───────────────────────────── */

export const CHU_CHU_GIAI = {
  tieuDe: "Đọc kỹ hơn về bốn nhóm",
  moTa:
    "Mỗi nhóm có bốn phần: khi nhóm đó nổi rõ, cái giá đi kèm, khi nhóm đó nhẹ, " +
    "và lúc nào thì mượn cách của nhóm khác.",
  nhanDam: "Khi nhóm này nổi rõ",
  nhanGia: "Cái giá đi kèm",
  nhanNhat: "Khi nhóm này nhẹ",
  nhanMuon: "Khi nào mượn cách của nhóm khác",
} as const;

/**
 * 🔴 KHỐI DẪN NGUỒN — VIẾT ĐỂ CHỊU ĐƯỢC MỘT CÂU HỎI KHÓ.
 *
 * Đây là chỗ một sản phẩm DISC cho trẻ em hoặc đứng vững, hoặc bịa. Ba sự thật khó chịu
 * mà bản này chọn nói thẳng thay vì lấp liếm:
 *
 *  1. **Marston không tạo bài trắc nghiệm nào.** Ông mô tả mô hình năm 1928; bộ công cụ
 *     đầu tiên là của Walter Clarke, 1956. Rất nhiều tài liệu bán hàng gộp hai chuyện đó
 *     lại để mượn uy tín của một cái tên cũ hơn.
 *  2. **Bộ câu hỏi này CHƯA chuẩn hoá trên dữ liệu người Việt.** Nó do BA soạn. Nó sẽ
 *     thành *"đã sàng trên người Việt"* vào ngày có 30–50 phản hồi thật chạy qua
 *     `scripts/phan-tich-item.mjs` — và chỉ ngày đó mới được phép nói về độ tin cậy, bằng
 *     con số của chính mình.
 *  3. **Nó để mở một cuộc trò chuyện, không phải để kết luận về một đứa trẻ.**
 *
 * 🔴 CẤM TUYỆT ĐỐI trong khối này và mọi nơi khác:
 *  · bất kỳ con số tin cậy hay hiệu lực nào (α, r, %…)
 *  · cụm "đã được khoa học chứng minh" và họ hàng của nó
 *  · trích dẫn một nghiên cứu mà người đọc không tự kiểm được
 * `tests/noi-dung-moi.test.ts` canh cả ba.
 */
export const KHOI_DAN_NGUON = {
  tieuDe: "Bản này dựa trên cái gì",
  doan: [
    "Mô hình bốn nhóm hành vi do nhà tâm lý học W.M. Marston mô tả lần đầu năm 1928. " +
      "Bản thân Marston không tạo ra bài trắc nghiệm nào — bộ công cụ đầu tiên theo mô hình " +
      "này là của Walter Clarke, năm 1956.",
    "Bộ câu hỏi bạn vừa làm do đội ngũ của chương trình soạn riêng cho gia đình Việt, và " +
      "chưa được chuẩn hoá trên dữ liệu người Việt. Nghĩa là: nó chưa qua bước kiểm bằng số " +
      "trên một mẫu đủ lớn.",
    "Vì vậy hãy đọc kết quả này như một cách để bắt đầu một cuộc trò chuyện trong nhà, " +
      "không phải như một kết luận về ai đó. Nếu có chỗ nào bạn thấy không đúng với con " +
      "mình, thì bạn đúng — bạn biết con mình hơn một bảng câu hỏi.",
  ],
} as const;

/* ── Chọn đối tượng & định tuyến ─────────────────────────────────────────── */

export const MA_DOI_TUONG = ["mam-non", "tieu-hoc", "thcs", "phu-huynh"] as const;
export type MaDoiTuong = (typeof MA_DOI_TUONG)[number];

export const DOI_TUONG: Record<MaDoiTuong, { ten: string; moTa: string }> = {
  // 🔴 "3–7", KHÔNG phải "3–5". Metadata bộ đề (`config/disc-cau-hoi.ts` → MN.veAi) ghi
  // "Bé 3–7 tuổi", và trên thực tế bộ này còn nhận cả lớp 1–2 lẫn mọi bé dưới 8 tuổi được
  // chuyển sang. Nhãn "3–5" ở đây làm phụ huynh bé 6 tuổi tưởng sản phẩm không có phần của
  // mình. Hai chỗ nói hai con số thì chỗ người dùng đọc được là chỗ sai đắt hơn.
  "mam-non": { ten: "Mầm non", moTa: "Bé 3–7 tuổi · bố mẹ hoặc thầy cô trả lời giúp" },
  "tieu-hoc": { ten: "Tiểu học", moTa: "Lớp 1–5" },
  thcs: { ten: "Trung học cơ sở", moTa: "Lớp 6–9 · các em tự làm" },
  "phu-huynh": { ten: "Phụ huynh", moTa: "Tìm hiểu về chính mình, hoặc trả lời về con" },
};

/**
 * 🔴 GĐ10 hạng mục 10.6 — MÀN 1 HỎI "AI ĐANG CẦM MÁY", KHÔNG HỎI "BÀI NÀY VỀ AI".
 *
 * Bốn thẻ cũ (Mầm non · Tiểu học · THCS · Phụ huynh) trộn hai câu hỏi khác nhau vào một
 * hàng: ba thẻ đầu nói về NGƯỜI ĐƯỢC ĐÁNH GIÁ, thẻ thứ tư nói về NGƯỜI TRẢ LỜI. Hậu quả
 * đo được: bố mẹ của một bé lớp 1 có HAI cửa cùng dẫn tới bộ Mầm non — bấm "Tiểu học →
 * Lớp 1", hoặc bấm "Phụ huynh → về con → 6 tuổi. Cửa nào cũng đúng, nên chẳng cửa nào
 * hiển nhiên, và người dùng phải đoán.
 *
 * Tách theo NGƯỜI CẦM MÁY thì mỗi bộ đề còn đúng một cửa, và tuổi/lớp chỉ hỏi MỘT lần.
 */
export const MA_NHANH = ["hoc-sinh", "nguoi-lon"] as const;
export type MaNhanh = (typeof MA_NHANH)[number];

export const NHANH_CAM_MAY: Record<MaNhanh, { ten: string; moTa: string }> = {
  "hoc-sinh": {
    ten: "Em học sinh, tự làm bài",
    moTa: "Lớp 1–9 · em tự đọc và tự trả lời",
  },
  "nguoi-lon": {
    ten: "Bố mẹ hoặc thầy cô",
    moTa: "Trả lời về một bạn nhỏ, hoặc tìm hiểu về chính mình",
  },
};

/**
 * 🔴 KHỐI NÀY ĐÃ CO LẠI CÒN HAI KHOÁ (V2.2).
 *
 * Trước đó nó là chữ của màn *"Ai đang cầm máy?"* — hỏi lớp, hỏi mục tiêu, hỏi tuổi con.
 * Màn đó bị xoá khi mọi bài phải thuộc một người trong sổ, nên phần lớn khoá ở đây thành
 * chữ không ai đọc. **Giữ lại chữ chết trong từ điển là mời người sau dùng nhầm nó** — vd
 * gắn "Bạn đang học lớp mấy?" vào một màn khác rồi tưởng đó là câu đã được duyệt.
 *
 * Hai khoá còn lại vẫn có người dùng thật: nút quay lại của màn dặn dò, và hộp giải thích
 * bắt buộc khi lớp 1–2 bị chuyển sang bản quan sát.
 */
export const CHU_CHON = {
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
  /**
   * 🔴 Cửa DUY NHẤT còn dùng khối này là nút phụ *Bố mẹ trả lời về {tên}* trên thẻ trẻ
   * chưa đủ 8 tuổi. Giữ nguyên câu chữ đã qua rà soát, đừng viết lại cho gọn.
   */
  giaiThichConDuoi8: {
    tieuDe: "Con dưới 8 tuổi dùng bản quan sát.",
    than:
      "Trẻ dưới 8 tuổi chưa tự nhìn lại được tính cách của mình, nên phần này bạn trả lời — dựa trên những gì thật sự nhìn thấy trong khoảng hai tuần gần đây. Khi con đủ 8 tuổi, hai người làm hai bài riêng rồi đối chiếu được với nhau.",
  },
} as const;

/* ── Nhắc sao lưu sau bài của người thứ hai (V4.2) ────────────────────────── */

/**
 * 🔴 NHẮC ĐÚNG MỘT LẦN, ĐÚNG KHOẢNH KHẮC.
 *
 * Mọi thứ nằm trong IndexedDB của một trình duyệt: xoá dữ liệu duyệt web, đổi điện thoại,
 * chế độ ẩn danh — mất sạch, không khôi phục được. Nút sao lưu `.zip` có sẵn từ GĐ8 nhưng
 * nằm im ở cuối màn, và chưa bao giờ chủ động nhắc.
 *
 * Nhắc khi người THỨ HAI làm xong, vì đó là khoảnh khắc ĐẦU TIÊN gia đình có thứ đáng để
 * mất: một bài lẻ thì làm lại mất tám phút, hai bài trở lên là một bức tranh không dựng
 * lại được. Nhắc sớm hơn thì phiền và bị bỏ qua; muộn hơn thì đã có người mất.
 *
 * Nhắc MỘT lần rồi thôi — nhắc mãi thì nó thành nền, và cái gì thành nền thì không ai đọc.
 */
export const CHU_NHAC_SAO_LUU = {
  tieuDe: "Giữ lại bức tranh của cả nhà",
  than:
    "Nhà mình đã có hai người làm xong. Toàn bộ nằm trong trình duyệt máy này — xoá dữ " +
    "duyệt web hay đổi máy là mất, không lấy lại được. Tải một bản về máy cho chắc nhé.",
  nut: "Tải bản sao lưu về máy",
  nutBoQua: "Để sau",
  daTai: "Đã tải về máy.",
  loiTai: "Chưa tải về được. Bạn thử lại bằng nút Sao lưu ở bước 1 nhé.",
} as const;

/** Khoá localStorage đánh dấu đã nhắc rồi — nhắc lại là thành nền, và nền thì không ai đọc. */
export const KHOA_DA_NHAC_SAO_LUU = "disc:da-nhac-sao-luu";

/* ── Nội dung về trẻ đang tạm đóng (V4.1) ────────────────────────────────── */

/**
 * 🔴 NÓI THẬT VÌ SAO, và nói theo hướng KHÔNG hạ thấp đứa trẻ.
 *
 * Câu này hiện trên thẻ của một đứa trẻ khi cờ `MO_NOI_DUNG_TRE` tắt. Người đọc là bố mẹ
 * của em ấy, nên không được viết kiểu "chưa hỗ trợ đối tượng này" — nghe như em ấy nằm
 * ngoài lề. Viết đúng sự thật: phần nội dung đang chờ người chuyên môn xem lại.
 */
export const CHU_TRE_TAM_DONG = {
  nhan: "Phần dành cho trẻ đang tạm đóng",
  than:
    "Nội dung nói về trẻ đang chờ một người có chuyên môn xem lại trước khi đưa ra. " +
    "Phần dành cho người lớn trong nhà vẫn dùng bình thường.",
} as const;

/* ── CÒN THIẾU AI (V3.2) — đòn bẩy của con số `baiThuHai` ────────────────── */

/**
 * 🔴 ĐÂY LÀ PHẦN "LÀM ĐẸP" DUY NHẤT DÁM KHẲNG ĐỊNH LÀ CÓ TÁC DỤNG.
 *
 * Đích của bước 3 đã chốt: **rủ thêm người trong nhà cùng làm**. Nên thứ phải sửa không
 * phải màu sắc hay bố cục, mà là CÂU NÓI: đổi *"cần ít nhất 2 người"* (một điều kiện kỹ
 * thuật, chẳng gợi ai làm gì) thành một câu nêu ĐÍCH DANH người còn thiếu, kèm nút mời
 * đúng người đó.
 *
 * 🔴 KHÔNG bê `CHU_THONG_DIEP` sang đây. Khối đó có luật "chỉ xuất hiện ở bảng gia đình"
 * và `tests/thong-diep.test.tsx` canh — rải ra khắp nơi thì lần đọc thứ tư nó thành khẩu
 * hiệu quảng cáo.
 */
export const CHU_MOI = {
  /** Hiện khi CHƯA đủ người: nói còn thiếu ai, không nói "chưa đủ điều kiện". */
  conThieuMot: "Còn {ten} chưa làm — bức tranh cả nhà đang thiếu một người.",
  conThieuNhieu: "Còn {ds} chưa làm — bức tranh cả nhà đang thiếu {so} người.",
  /** Hiện khi ĐÃ đủ, trên đầu bản phân tích: mời nốt người còn lại cho đủ nhà. */
  themNguaCon: "Thêm {ds} nữa thì bức tranh đủ cả nhà.",
  /** Nối danh sách tên: "A, B và C". */
  noiCuoi: " và ",
  noiGiua: ", ",

  nutMoi: "Mời {ten}",
  nutLamHo: "{ten} làm ngay trên máy này",

  /**
   * 🔴 NÓI RÕ HAI ĐƯỜNG, vì người dùng đang đứng trước một lựa chọn thật: người kia làm
   * trên máy của họ (gửi link, rồi họ gửi mã về), hay làm luôn trên máy này.
   */
  hopTieuDe: "Mời {ten} cùng làm",
  hopThan:
    "Gửi đường dẫn này cho {ten}. Làm xong, {ten} bấm nút chia sẻ kết quả và gửi lại cho " +
    "bạn một mã ngắn — bạn nhập mã đó ở bước 1 là xong.",
  nutChepLink: "Chép đường dẫn",
  daChepLink: "Đã chép. Dán vào tin nhắn gửi cho {ten} nhé.",
  loiChepLink: "Máy không cho chép tự động. Bạn chép thủ công đường dẫn trên thanh địa chỉ nhé.",
  nutDongHop: "Đóng",
} as const;

/* ── Thiếu bậc học ⇒ chưa làm bài được (V2.2) ────────────────────────────── */

/**
 * 🔴 Chỉ xảy ra với người ĐANG ĐI HỌC mà hồ sơ chưa có bậc. Trước V2.2, ca này rơi về màn
 * *"Ai đang cầm máy?"* và người dùng bị hỏi lại vai + lớp — thứ sổ lẽ ra đã biết. Nay màn
 * đó không còn, nên phải nói ra và chỉ đúng chỗ sửa.
 */
export const CHU_THIEU_BAC = {
  tieuDe: "Chưa biết {ten} đang học lớp mấy",
  than:
    "Lớp quyết định bộ câu hỏi nào hợp với {ten}, nên chưa có lớp thì chưa bắt đầu được. " +
    "Quay lại bước 1, bấm Sửa trên thẻ của {ten} rồi chọn lớp — mất vài giây thôi.",
  nut: "Về bước 1 để chọn lớp",
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
  /**
   * 🔴 ADR-005 (27/08/2026) — CHO NHẬP TÊN THẬT, và câu nhắc "đừng ghi họ tên" đã GỠ.
   *
   * Người dùng nay là phụ huynh đã ký hợp đồng, đang ngồi trong app của chính trung tâm.
   * Với họ, câu nhắc cũ tạo ra một câu đố (nhà hai con thì đặt biệt danh gì cho khỏi lẫn?)
   * và một lời cảnh báo lạc chỗ — nó đọc lên như thể sản phẩm sắp gửi tên con họ đi đâu
   * đó, trong khi ADR-001 cấm backend.
   *
   * Bốn hàng rào thật sự vẫn nguyên và đều là cửa kiểm chạy trong CI, không phải lời hứa:
   * tên không rời máy · không vào tệp xuất · không vào ảnh chia sẻ · không vào mã mời.
   */
  nhanO: "Tên của người làm bài này",
  nhacO: "Tên gì cũng được, miễn là bạn nhận ra. Tên này chỉ nằm trên máy của bạn.",
  oTrong: "Nhập một tên rồi mới bắt đầu được.",
  nutBatDau: "Bắt đầu",
  demKyTu: "{da}/{toiDa}",
  /** Vào bài từ thẻ thành viên (12.4) — tên đã có trong sổ, không hỏi lại. */
  lamBaiCho: "Đang làm bài cho {ten}",
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
  /** Nhãn đọc màn hình cho số thứ tự câu. Người sáng mắt thấy con số trong vòng tròn. */
  nhanSoCau: "Câu",
  /**
   * 🔴 Bộ câu hỏi đổi ⇒ nháp cũ hết nghĩa. Phải NÓI RA, không được im lặng vứt:
   * người dùng nhớ mình đang làm dở, mở lại thấy trắng tinh, và kết luận là phần mềm
   * ăn mất bài. Nói thẳng thì họ mất 2 phút; im lặng thì họ mất niềm tin.
   */
  nhapCuKhongDung:
    "Bộ câu hỏi vừa được cập nhật nên bài làm dở lần trước không dùng lại được. " +
    "Xin lỗi bạn — lần này làm từ đầu nhé, bài sẽ được nhớ lại nếu bạn dừng giữa chừng.",
} as const;

/* ── Lệch phong cách bố mẹ ↔ con ───────────────────────────────────────── */

export const CHU_PHONG_CACH = {
  tieuDe: "Phong cách của bạn và của con",
  moTa: "So hồ sơ bạn tự làm ở bộ Phụ huynh với hồ sơ đang xem. Chỗ vênh nhau nhiều nhất thường là chỗ hai bên hay va nhau.",
  nhanBoMe: "bạn",
  nhanCon: "con",
  /* ── GĐ10 chặng 2: một chỗ vênh, ba khối, ba người đọc ─────────────────── */
  /** Dải CON. Dùng {chuThe} vì người đọc là chính em học sinh. */
  tieuDeChoCon: "Chỗ {chuThe} và bố mẹ hay va nhau",
  moTaChoCon:
    "Đây không phải lỗi của ai. Hai người thiên về hai nhóm khác nhau thì va nhau ở đúng những chỗ này.",
  /** Dải BỐ MẸ. 🔴 GÓI KÝ DUYỆT B — phản hồi tính cách cho người lớn về chính họ. */
  tieuDeTuNhin: "Nhìn về phía bố mẹ",
  moTaTuNhin:
    "Phần này nói về phong cách của chính bạn, không nhận xét gì về con. Bạn đọc để biết chỗ mạnh của mình đang trả giá bằng gì.",
  /** Dải CHUNG — cả hai cùng đọc, nên nó là chỗ duy nhất câu chữ được dùng cho cả hai. */
  tieuDeThoaThuan: "Thử một thoả thuận hai chiều",
  moTaThoaThuan:
    "Mỗi bên nhường một việc, có thời hạn, và có lúc ngồi lại xem đã đi tới đâu. Một chiều thì không gọi là thoả thuận.",
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

/* ── GĐ10 — ba dải, mỗi dải một NGƯỜI ĐỌC ────────────────────────────────── */

/**
 * 🔴 Một trang, nhưng KHÔNG phải một người đọc.
 *
 * Bộ TH/THCS là em học sinh tự cầm máy làm bài, mà bản báo cáo lại có cả phần viết cho bố
 * mẹ. Để hai phần đó chảy liền nhau nghĩa là đứa trẻ cuộn xuống là đọc được đoạn người lớn
 * bàn về mình — thứ không viết cho nó đọc.
 *
 * Nên: dải của bố mẹ ĐÓNG SẴN, và có một dải chắn phải bấm qua. Dải chắn không phải cái
 * khoá — nó là gờ giảm tốc, đủ để việc đọc nhầm thành cố ý chứ không còn là tình cờ.
 */
export const CHU_BA_BAN = {
  /**
   * 🔴 TIÊU ĐỀ DẢI PHẢI KHÁC NHAU NGAY TỪ CHỮ ĐẦU (11.4).
   *
   * Chủ dự án chạy thử GĐ10 và nói "hai bản in thấy thông tin giống nhau". Đo lại thì hai
   * tờ KHÔNG dùng chung một câu nào — `ba-ban-noi-dung.test.ts` canh việc đó và nó xanh.
   * Cái giống nhau là DÁNG: cùng mở bằng biểu đồ, cùng bốn khối trục, và cùng một nhãn
   * nhỏ xám nhạt ở đầu mà không ai buồn đọc.
   *
   * Sửa bằng cách rẻ nhất và đúng chỗ nhất: cho tiêu đề mang TÊN người và nói thẳng tờ
   * này viết cho ai — "Bin — bản của em" so với "Bin — phần dành cho bố mẹ". Đưa tờ giấy
   * cho một người lạ, họ phải nói được ngay nó viết cho ai mà chưa cần đọc hết.
   *
   * `{ten}` là biệt danh do người dùng tự đặt; `{chuThe}` là đại từ theo bộ đề.
   */
  tenChung: "{ten} — phần đọc chung",
  tenCon: "{ten} — bản của {chuThe}",
  tenBoMe: "{ten} — phần dành cho bố mẹ",
  /** Bộ PH: người lớn tự đánh giá chính mình. "bản của bạn" đọc lên rất kỳ. */
  tenTuMinh: "{ten} — bản tự đọc",

  /** Dải chắn — CHỈ dựng khi chính người được đánh giá đang cầm máy. */
  chanTieuDe: "Phần dưới đây viết cho bố mẹ",
  chanMoTa:
    "Đoạn này nói chuyện với người lớn về cách đồng hành, không phải viết cho {chuThe} đọc. Đưa máy cho bố mẹ rồi bấm mở giúp mình nhé.",
  chanNut: "Bố mẹ đã cầm máy — mở phần này",
  chanDong: "Đóng phần của bố mẹ lại",

  /** Nút in tách bản. CHỈ hiện khi trang có từ HAI dải nội dung trở lên. */
  nhomNutIn: "In riêng từng phần",
  nutInCon: "In phần của {chuThe}",
  nutInBoMe: "In phần của bố mẹ",
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
  /**
   * 🔴 NÓI ĐÚNG THỨ SẮP MẤT. Câu cũ ghi "tất cả BÀI", mà nút thì (nay) dọn cả tên từng
   * người lẫn các bản phân tích. Nói thiếu là để người ta đồng ý với một việc khác việc
   * thật sự sắp xảy ra.
   */
  hoiXoaSach:
    "Xoá TẤT CẢ trên máy này — tên từng người, bài đã làm, và các bản phân tích? " +
    "Không lấy lại được.",
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

/* ── Mã mời không mở được ────────────────────────────────────────────────── */

/** Vì sao một mã không mở được — nói rõ để người dùng biết phải làm gì tiếp. */
export const CHU_MA_HONG: Readonly<Record<string, string>> = {
  RONG: "Chưa có mã nào để mở.",
  SAI_DO_DAI: "Mã phải có đúng 14 ký tự. Đếm lại giúp nhé.",
  KY_TU_LA: "Trong mã có ký tự không thuộc bảng mã. Kiểm tra lại từng chữ.",
  SAI_KIEM_TONG: "Mã sai ở đâu đó — gõ nhầm một chữ là đủ. Đọc lại rồi thử lần nữa.",
  SAI_PHIEN_BAN: "Mã này thuộc phiên bản khác. Người gửi cần phát lại mã mới.",
  SO_LIEU_LA: "Mã đọc được nhưng bên trong không hợp lệ.",
  QUA_HAN: "Mã đã quá 7 ngày. Nhờ người gửi phát lại mã mới.",
  NGAY_TUONG_LAI: "Mã ghi ngày phát ở tương lai. Kiểm tra lại đồng hồ của máy.",
};

/* ── Màn số liệu máy này (11.6) ──────────────────────────────────────────── */

/**
 * 🔴 VÌ SAO CÓ MÀN NÀY, VÀ VÌ SAO NÓ Ở NGAY TRONG SẢN PHẨM.
 *
 * Bộ đếm phễu đã có từ GĐ6 nhưng KHÔNG MÀN NÀO đọc nó — chỉ test dùng. Nghĩa là phát hành
 * xong vẫn mù đúng như trước khi có nó. Một cửa đo mà không ai mở thì im lặng y hệt một
 * cửa đo hỏng.
 *
 * Và nó phải nằm trong sản phẩm chứ không phải trong bảng điều khiển ở đâu đó, vì ADR-001
 * cấm backend: số liệu KHÔNG rời máy người dùng. Muốn biết thì mở máy đó ra mà xem.
 */
export const CHU_SO_LIEU = {
  tieuDe: "Số liệu trên máy này",
  moTa:
    "Vài con số đếm ngay trên máy bạn. Không có con số nào được gửi đi đâu, và không có " +
    "câu trả lời hay kết quả nào nằm trong đây.",
  soBai: "Bài đã lưu",
  soBietDanh: "Biệt danh khác nhau",
  datBaiThuHai: "Đã có từ 2 người trở lên cùng làm",
  chuaDat: "Chưa",
  daDat: "Rồi",
  tieuDePheu: "Phễu",
  trong: "Máy này chưa có bài nào.",
  /** 🔴 Nhắc lại lời hứa ngay tại chỗ dễ bị phá nhất. */
  nhacRiengTu: "Màn này chỉ ĐỌC. Không gửi, không đồng bộ, không phân tích ở đâu khác.",
} as const;

/** Chữ hiển thị cho từng mốc phễu. Thiếu mốc nào thì hiện thẳng mã, không im lặng bỏ qua. */
export const CHU_MOC: Readonly<Record<string, string>> = {
  mo: "Mở khoang",
  batDau: "Bắt đầu làm bài",
  xong: "Làm xong bài",
  themThanhVien: "Thêm thành viên vào sổ",
  baiThuHai: "Người thứ hai cùng làm",
  phanTichGiaDinh: "Xem phân tích cả nhà",
  bamMoi: "Bấm mời người trong nhà",
};

/**
 * 🔴 DÒNG ĐỌC HỘ CẶP SỐ CHẨN ĐOÁN (V3.3).
 *
 * Hai con số `bamMoi` và `baiThuHai` chỉ có nghĩa khi ĐẶT CẠNH NHAU, và cái nghĩa đó
 * phải viết ra — nếu không thì sáu tháng sau người đọc bảng số liệu sẽ tự bịa ra một cách
 * hiểu, và cách hiểu tự bịa bao giờ cũng nghiêng về phía "làm đẹp thêm chút nữa".
 */
export const CHU_PHEU_MOI = {
  tieuDe: "Đọc hai con số này cùng nhau",
  dong: "{soMoi} lần bấm mời → {soLam} lần có người thứ hai làm xong.",
  chuaAiMoi:
    "Chưa ai bấm mời. Nếu vẫn vậy sau 30 máy thật thì thứ cần xem lại là GIẢ ĐỊNH " +
    "(phụ huynh có muốn rủ người nhà không), không phải phần mềm.",
  moiMaKhongLam:
    "Có người bấm mời mà chưa ai làm xong. Lời mời tới nơi rồi — chỗ hỏng nằm ở quãng " +
    "sau đó, và đó là việc sửa được.",
  daChay: "Đã có người thứ hai cùng làm. Giả định đỡ GĐ14 có quan sát ủng hộ đầu tiên.",
} as const;

/* ── Kho dữ liệu hỏng (12.1) ─────────────────────────────────────────────── */

/**
 * 🔴 Bản v1 trả `null` IM LẶNG cho cả trường hợp kho bị tab khác giữ. Nghĩa là người dùng
 * mở DISC ở hai tab thì tab cũ đơn giản là… thôi lưu. Không lỗi, không cảnh báo, và bài
 * vừa làm biến mất. Đây là câu nói ra điều đó.
 */
export const CHU_KHO_HONG: Readonly<Record<string, string>> = {
  "chan-boi-tab-khac":
    "Bạn đang mở DISC ở một cửa sổ khác. Đóng cửa sổ đó rồi tải lại trang này — " +
    "nếu không, bài làm ở đây sẽ không được lưu.",
  "khong-co-indexeddb":
    "Trình duyệt đang chặn lưu dữ liệu (thường gặp ở cửa sổ ẩn danh). Bạn vẫn làm bài và " +
    "xem kết quả được, nhưng bài sẽ không được nhớ lại.",
  "loi-khac": "Không mở được kho dữ liệu trên máy này. Bài vẫn làm được, nhưng chưa lưu lại được.",
};

/* ── Hộp thoại hạn mức (12.2) ────────────────────────────────────────────── */

/**
 * 🔴 CÂU CHỮ Ở ĐÂY LÀ PHẦN QUAN TRỌNG NHẤT CỦA HẠN MỨC.
 *
 * Hạn mức mà xoá im lặng thì đó là mất dữ liệu, dù có ghi trong tài liệu hay không. Thứ
 * biến nó thành một lựa chọn tử tế là: **nêu đích danh bài nào sắp mất** (ngày nào, bộ
 * nào), **cho tải về trước**, và **cho huỷ**. Thiếu một trong ba là quay về xoá im lặng.
 */
export const CHU_HAN_MUC = {
  tieuDe: "Bài cũ nhất sẽ được thay bằng bài mới",
  moTa:
    "Mỗi người giữ tối đa {gioiHan} bài trên máy này. Bắt đầu bài mới thì bài dưới đây " +
    "sẽ bị xoá khỏi máy — tải về giữ lại trước nếu bạn cần.",
  nhanDanhSach: "Bài sẽ bị xoá",
  mauDong: "Bài {boDe} · làm ngày {ngay}",
  nutTaiVe: "Tải về giữ lại",
  daTaiVe: "Đã tải về máy.",
  loiTaiVe: "Chưa tải về được. Bạn thử lại hoặc dùng nút Sao lưu ở màn Bài đã làm nhé.",
  oXacNhan: "Tôi hiểu là bài trên sẽ bị xoá khỏi máy này.",
  nutTiepTuc: "Xoá và bắt đầu bài mới",
  nutHuy: "Huỷ",
  chuaTick: "Cần tick ô xác nhận trước đã.",
} as const;

/* ── Bảng gia đình (12.3) + thông điệp nhân văn (12.6) ───────────────────── */

/**
 * 🔴 THÔNG ĐIỆP NHÂN VĂN — CHỈ XUẤT HIỆN Ở BẢNG GIA ĐÌNH.
 *
 * Rải nó vào màn kết quả và bản in là biến sự chân thành thành khẩu hiệu: đọc lần đầu
 * thấy tử tế, đọc lần thứ tư thấy như quảng cáo. Một lần, đúng chỗ, rồi im.
 *
 * 🔴 CẤM chữ "phi lợi nhuận". Mục tiêu của khoang này là giữ chân hơn 1.000 gia đình
 * đang trả học phí. Đó là một tiện ích miễn phí hoàn toàn chính đáng — nhưng gọi nó là
 * phi lợi nhuận là một tuyên bố SAI, và sai theo hướng có lợi cho mình thì càng không nên.
 * `tests/thong-diep.test.tsx` canh chuỗi này trong toàn bộ `config/`.
 */
export const CHU_THONG_DIEP = {
  chinh: "Không ai trong nhà sai. Chỉ là mỗi người quen một nhịp.",
  phu: "Làm cùng nhau, mỗi người mười phút.",
  chan:
    "Phần này miễn phí cho gia đình đang học và không bán gì cả. " +
    "Câu trả lời của cả nhà không rời khỏi máy này.",
} as const;

export const CHU_BANG_GIA_DINH = {
  tieuDe: "Nhà mình",
  moTa: "Mỗi người một thẻ. Nhìn một cái là biết ai đã làm, ai chưa.",
  trong: "Chưa có ai trong sổ. Thêm người đầu tiên để bắt đầu.",

  nutThem: "Thêm người",
  nutSua: "Sửa",
  nutXoa: "Xoá",
  nutLamBai: "Làm bài",
  /**
   * 🔴 MỘT hằng dùng cho CẢ nút chính lẫn nút phụ (V1.4), vì hai chỗ đó nói đúng một việc:
   * người lớn ngồi trả lời về đứa trẻ này.
   *
   *  - Mầm non và lớp 1–2: đây là nút CHÍNH và là nút DUY NHẤT — các em chưa tự đánh giá
   *    được (ADR-002), nên bài chính của các em vốn đã là bản quan sát.
   *  - Lớp 3 trở lên: đây là nút PHỤ, đứng cạnh nút *Làm bài* của chính em — hai bài đó
   *    ghép lại thành màn Vùng lệch.
   *
   * Viết hai chuỗi gần giống nhau cho hai vị trí là cách chúng lệch nhau vào ngày ai đó
   * sửa một bên.
   */
  nutTraLoiHo: "Bố mẹ trả lời về {ten}",
  nutXemKetQua: "Xem kết quả",

  nhanTen: "Tên gọi trong nhà",
  nhanVai: "Vai",
  /**
   * 🔴 Bỏ đuôi "(nếu đang đi học)" từ V1.2: ô lớp nay CHỈ hiện với người đang đi học,
   * nên câu điều kiện đó thành thừa — và một nhãn nói về trường hợp không thể xảy ra
   * chỉ làm người đọc dừng lại tự hỏi mình có thuộc trường hợp đó không.
   */
  nhanLop: "Lớp",
  nhanGhiChu: "Ghi chú của bạn (không bắt buộc)",
  chuaChonLop: "Chưa chọn",
  nutLuu: "Lưu",
  nutHuy: "Huỷ",
  loiThieuTen: "Cần một tên gọi để nhận ra người này.",
  loiTrungTen: "Trong nhà đã có người tên này rồi.",

  demBai: "{so}/{gioiHan} bài",
  chuaLamBai: "Chưa làm bài",

  /** 🔴 Xoá người là chỗ mất dữ liệu nhanh nhất — phải hỏi, và mặc định là GIỮ bài. */
  hoiXoaTieuDe: "Xoá {ten} khỏi sổ?",
  hoiXoaMoTa:
    "{ten} có {so} bài trên máy này. Bạn muốn giữ lại số bài đó hay xoá luôn?",
  hoiXoaGiuBai: "Giữ bài lại (bài về mục chưa xếp)",
  hoiXoaXoaBai: "Xoá luôn cả bài",
  hoiXoaKhongCoBai: "{ten} chưa có bài nào. Xoá khỏi sổ nhé?",

  nhomChuaXep: "Bài chưa xếp cho ai",
  moTaChuaXep: "Những bài này còn nguyên. Thêm người rồi xếp về đúng chỗ.",
  nutXepVe: "Xếp về",

  nhomPhanTich: "Phân tích cả nhà",
  phanTichChuaMo: "Phần này mở khi cả nhà có từ hai người làm xong bài.",

  /* ── Nhãn 14 bậc học (V1.1) ─────────────────────────────────────────── */
  nhanMamNon: "Mầm non",
  nhanLopSo: "Lớp {so}",
  /**
   * 🔴 Không viết "Đã đi làm": nhánh này còn có sinh viên, người đang ôn thi lại, người
   * ở nhà. Hỏi thẳng cái mình cần biết — đã qua lớp 12 hay chưa — thì không loại ai ra.
   */
  nhanTren12: "Trên lớp 12",
} as const;

/**
 * Nhãn hiển thị của một giá trị bậc học lấy từ `tuyChonLop()`.
 *
 * Tách thành hàm vì cả form thêm người, thẻ thành viên và màn chọn người làm bài đều cần
 * đúng một cách gọi tên — ba nơi tự dựng chuỗi là ba nơi lệch nhau vào ngày ai đó sửa một.
 */
export function nhanLopCua(lop: string | undefined): string {
  if (!lop) return CHU_BANG_GIA_DINH.chuaChonLop;
  if (lop === LOP_MAM_NON) return CHU_BANG_GIA_DINH.nhanMamNon;
  if (lop === LOP_TREN_12) return CHU_BANG_GIA_DINH.nhanTren12;
  return CHU_BANG_GIA_DINH.nhanLopSo.replace("{so}", lop);
}

/* ── Mã mời hoàn chỉnh (13.1) ────────────────────────────────────────────── */

/**
 * 🔴 CÂU CHỮ Ở ĐÂY PHẢI GIỮ ĐƯỢC MỘT LỜI HỨA.
 *
 * ADR-001 hứa câu trả lời của trẻ không rời máy. Mã mời là thứ DUY NHẤT trong sản phẩm
 * đi ra khỏi máy, nên nó cũng là chỗ duy nhất lời hứa đó có thể thành lời nói dối. Người
 * dùng cần biết chính xác cái gì đang đi: **bốn con số, một cái vai, một ngày phát**.
 * Không có tên. Không có câu trả lời. Nói ra được thì mới đáng tin.
 */
export const CHU_MA_MOI = {
  tieuDe: "Gửi kết quả này sang máy khác",
  moTa:
    "Người kia quét mã hoặc gõ lại chuỗi bên dưới. Máy của họ sẽ có thêm hồ sơ này " +
    "trong sổ gia đình, và cả nhà xem chung được.",
  nhacQuet: "Quét bằng camera điện thoại, hoặc gõ lại chuỗi này:",
  nhacHan: "Mã dùng được trong {so} ngày.",
  /** 🔴 Nói THẲNG cái gì đang đi ra khỏi máy. Đây là chỗ giữ lời hứa của ADR-001. */
  nhacRiengTu:
    "Mã chỉ chứa bốn con số của bài này, vai trong nhà và ngày phát. " +
    "Không có tên, không có câu trả lời nào.",

  nhanNhap: "Nhận một mã mời",
  moTaNhap: "Ai đó gửi bạn một chuỗi mã? Gõ vào đây để thêm họ vào sổ nhà mình.",
  oNhap: "Gõ hoặc dán chuỗi mã",
  nutMo: "Thêm vào sổ",
  hoiTen: "Đây là ai trong nhà?",
  /** 🔴 Máy nhận PHẢI hỏi tên tại chỗ — mã không mang tên đi, và đó là chủ ý. */
  nhacHoiTen:
    "Mã không mang tên theo, nên bạn tự đặt tên trên máy mình. Tên này chỉ nằm ở đây.",
  nutLuu: "Lưu vào sổ",
  daThem: "Đã thêm {ten} vào sổ nhà mình.",
  daCo: "Sổ nhà mình đã có hồ sơ này rồi — không thêm lần nữa.",
  nhanNhanQuaMa: "Nhận qua mã mời",
} as const;

/* ── So sánh theo thời gian (13.2) ───────────────────────────────────────── */

/**
 * 🔴 LUẬT GIỌNG VĂN CỦA KHỐI NÀY — CẤM "TIẾN BỘ", CẤM "CẢI THIỆN".
 *
 * DISC không có chiều tốt/xấu, nên **không có gì để tiến bộ**. Nói *"con đã tiến bộ ở
 * nhóm Chủ động"* là ngầm khẳng định Chủ động cao thì tốt hơn — sai về mô hình, và tệ hơn,
 * nó biến một bản mô tả hành vi thành một bảng điểm mà đứa trẻ phải leo. Một phụ huynh đọc
 * xong câu đó sẽ đi khen hoặc đi thúc, và cả hai đều là hệ quả không ai muốn.
 *
 * Khối này MỞ MỘT CÂU HỎI thay vì PHÁT MỘT BẰNG KHEN. `tests/so-sanh-thoi-gian.test.ts`
 * quét mọi chuỗi ở đây tìm từ đánh giá.
 */
export const CHU_SO_SANH = {
  tieuDe: "{ten} hồi đó và bây giờ",
  nutXem: "Xem thay đổi",
  nhanTruoc: "Hồi {ngay}",
  nhanSau: "Bây giờ",
  cachNhau: "Hai bài cách nhau {so} ngày.",

  /** Câu mở — nói THAY ĐỔI, không nói HƯỚNG. */
  moDau:
    "Dưới đây là hai lần {ten} làm bài, đặt cạnh nhau. Không có lần nào đúng hơn lần nào — " +
    "cách một người trả lời đổi theo lớp học, theo bạn bè, theo cả những chuyện ở nhà.",

  /** Có trục đổi rõ. `{truc}` là tên nhóm, `{huong}` là "lên"/"xuống". */
  coDoi:
    "Nhóm {truc} lần này {huong} so với lần trước. Đó là một chỗ đáng hỏi hơn là đáng lo: " +
    "điều gì đã đổi ở lớp hay ở nhà trong khoảng thời gian đó?",
  huongLen: "hiện rõ hơn",
  huongXuong: "nhẹ đi",

  /** Không trục nào đổi rõ. */
  khongDoi:
    "Bốn nhóm gần như giữ nguyên. Với khoảng thời gian này thì đó là chuyện bình thường — " +
    "cách hành xử của một người thường ổn định hơn ta tưởng.",

  chuaDuBai: "Cần hai bài của cùng một người mới so được.",
  /** 🔴 Nói rõ VÌ SAO chưa so, đừng để người dùng tưởng phần mềm hỏng. */
  quaGan:
    "Hai bài mới cách nhau {so} ngày. Gần quá thì chênh lệch đọc được phần lớn là sai số " +
    "của phép đo, không phải thay đổi thật. Quay lại sau khoảng {toiThieu} ngày nhé.",
  /** Lý do quay lại — đặt ngay trên bảng gia đình. */
  nhacLamLai: "Làm lại sau khoảng 6 tháng để xem có gì đổi.",
} as const;

/* ── Bản tổng hợp cả nhà (14.4) ──────────────────────────────────────────── */

export const CHU_TONG_HOP = {
  /**
   * Dòng mở đầu bước 3.
   *
   * 🔴 Nói về VIỆC LÀM ĐƯỢC, không dán nhãn ai. Luật §9.2 và ADR-002 chạy suốt sản phẩm:
   * DISC không phải mô hình khuyết thiếu, và bản phân tích cả nhà là chỗ dễ trượt sang
   * giọng "người này thiếu cái kia" nhất, vì nó đặt hai người cạnh nhau.
   */
  moTa:
    "Mỗi người một tờ riêng: người kia quen nhịp nào, và mình đổi một chút ở đâu thì " +
    "nhà đỡ va nhau.",
  nutPhanTich: "Phân tích cả nhà",
  tieuDeChon: "Chọn bài cho mỗi người",
  moTaChon:
    "Mỗi người một bài. Mặc định là bài mới nhất — đổi được nếu bạn muốn so một mốc khác.",
  nutChay: "Phân tích",
  nutHuy: "Huỷ",
  nutDong: "Đóng",

  tieuDeBan: "{ten} đọc về cả nhà",
  nhanLatCat: "{ten} và {nguoiKia}",
  nhanViecCuaToi: "Một việc {ten} làm được",
  nhanThoaThuan: "Thử cùng nhau",
  nhanTrungKhop: "Chỗ hai người cùng nhịp",

  nutInBan: "In phần của {ten}",
  nhomNutIn: "In riêng từng người",

  chuaDuHaiNguoi:
    "Cần ít nhất hai người đã có hồ sơ thì mới so được. Thêm người vào sổ, hoặc mời họ " +
    "làm bài trên máy này — hoặc gửi mã mời để họ làm ở máy của họ.",
  quaNhieuNguoi:
    "Một lần phân tích nhận tối đa {so} người. Bỏ bớt vài người rồi chạy lại nhé.",

  /** Danh sách thư mục đã chạy. */
  nhomThuMuc: "Các lần đã phân tích",
  moTaThuMuc: "Giữ {so} lần gần nhất trên máy này.",
  nutMoThuMuc: "Mở",
  /**
   * 🔴 Bản ghi cũ có thể thiếu trường (nội dung đổi hình dạng giữa hai phiên bản). Nói ra
   * thay vì trả về một trang trắng — trang trắng thì người dùng chỉ thấy sản phẩm hỏng mà
   * không biết vì sao, và cũng không biết là mình còn chạy lại được.
   */
  thuMucHong:
    "Bản này lưu từ một phiên bản cũ nên máy không đọc lại được. Chạy phân tích mới nhé — " +
    "dữ liệu bài làm của cả nhà vẫn còn nguyên.",
} as const;

/* ── Hạn mức thư mục phân tích (14.5) ────────────────────────────────────── */

export const CHU_HAN_MUC_THU_MUC = {
  tieuDe: "Lần phân tích cũ nhất sẽ được thay",
  moTa:
    "Máy này giữ {gioiHan} lần phân tích gần nhất. Chạy lần mới thì lần dưới đây bị xoá — " +
    "tải về giữ lại trước nếu bạn cần.",
  mauDong: "Lần chạy ngày {ngay} · {so} người",
  /** 🔴 Kho đầy là chuyện của MÁY, nhưng hậu quả là người dùng mất bản vừa chạy. Nói ra. */
  hetChoLuu:
    "Máy đã hết chỗ lưu nên bản phân tích này chưa được giữ lại. Tải về máy trước, rồi " +
    "xoá bớt vài lần chạy cũ ở danh sách bên dưới.",
} as const;
