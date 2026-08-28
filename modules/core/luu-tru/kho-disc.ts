/**
 * KHO DISC — GIAO DIỆN của tầng lưu trữ (ADR-004, hạng mục 16.4).
 *
 * 🔴 VÌ SAO FILE NÀY TỒN TẠI. ADR-004 hứa tách hai tầng vì *"đội dev app chủ nhiều khả
 * năng viết lại giao diện"*. Nhưng lời hứa đó mới được giữ cho tầng NỘI DUNG (chấm điểm,
 * diễn giải) — còn tầng LƯU TRỮ thì mọi component vẫn gọi thẳng IndexedDB. Mà lưu trữ
 * mới đúng là chỗ máy chủ của họ sẽ cắm vào: họ đã có backend, có đăng nhập, có bảng
 * người dùng. Không có đường cắm thì họ phải sửa từng component — và lúc đó bản giao diện
 * tham chiếu này thành thứ bỏ đi.
 *
 * 🔴 FILE NÀY PHẢI SẠCH DOM. Không `indexedDB`, không `localStorage`, không `window`.
 * Nó là bản hợp đồng, và một bản hợp đồng dính API trình duyệt thì bản dựng gọi server
 * không thể ký. `tests/ranh-gioi-hai-tang.test.ts` canh điều đó — file này nằm trong
 * danh sách tầng lõi, cố ý.
 *
 * Bản dựng mặc định (IndexedDB) nằm ở `kho-bai.ts` và tự đăng ký lúc nạp.
 */

import type { KetQua, MaBoDe } from "@modules/core/bo-de/kieu";
import type {
  CheDoXoaThanhVien,
  PhanTichGiaDinh,
  ThanhVien,
} from "@modules/core/gia-dinh/kieu";

/** Một bài đã làm, như nó nằm trong kho. */
export type BaiLamLuu = {
  readonly id: string;
  readonly boDe: MaBoDe;
  /** TÊN người làm — tên thật được phép từ ADR-005. Vẫn giữ tên trường cũ. */
  readonly maTre: string;
  /** Chỉ để định tuyến lúc làm bài. Không đưa vào báo cáo. */
  readonly lop?: string;
  /**
   * Tuổi người được đánh giá, 3–15. Màn 1 đã hỏi sẵn rồi vứt đi — giữ lại vì bộ QS trải
   * từ 8 đến 15 tuổi, tức là bắc qua HAI lứa nội dung (tiểu học và THCS), và chỉ con số
   * này phân định được. Bộ khác suy ra lứa từ chính mã bộ đề.
   *
   * 🔴 Là dữ liệu cá nhân của trẻ ⇒ đã nằm trong `KHOA_CAM` của phiếu liên hệ.
   */
  readonly tuoi?: number;
  /** Mã điều phụ huynh đang băn khoăn (chọn 1 chạm ở màn kết quả). 🔴 Cũng thuộc `KHOA_CAM`. */
  readonly banKhoan?: string;
  /** 🆕 v2 — khoá tới thành viên trong sổ. Thiếu ⇒ bài "chưa xếp". 🔴 Thuộc `KHOA_CAM`. */
  readonly maThanhVien?: string;
  readonly nguoiTraLoi: "tre" | "nguoi-lon";
  /** ISO 8601. Hiển thị mới dùng dd/mm/yyyy. */
  readonly batDau: string;
  readonly ketThuc: string;
  readonly traLoi: Readonly<Record<string, number>>;
  readonly ketQua: KetQua;
  readonly phienBanBoDe: string;
};

/** Hàm được gọi mỗi khi kho đổi — dù đổi ở tab này hay tab khác. */
export type NgheKhoDoi = () => void;

/**
 * 🔴 MỌI LỐI VÀO KHO, GOM VỀ MỘT CHỖ.
 *
 * Luật đặt ra cho bất kỳ bản dựng nào (IndexedDB hôm nay, server ngày mai):
 *
 *  1. **Không bao giờ ném.** Kho hỏng (cửa sổ ẩn danh nghiêm ngặt, mất mạng) thì trả giá
 *     trị rỗng. Mất khả năng LƯU không được kéo theo mất bài đang làm dở.
 *  2. **Mỗi lệnh ghi báo đúng MỘT lần** cho người đã `dangKyDoiKho`. Lệnh ghi đụng nhiều
 *     bảng vẫn chỉ một lần — người dùng chỉ bấm một nút.
 *  3. **`docBai()` không nhận tham số lọc.** Đó là cửa duy nhất để sao lưu; thêm một
 *     tham số `boDe?` vào đây là mở lại đúng cái bẫy đã cắn dự án trước (sao lưu ra một
 *     file trông như đủ, người dùng yên tâm xoá, rồi mất phần kia).
 *  4. **Dọn hạn mức phải NGUYÊN TỬ.** Đọc danh sách nạn nhân ở một lượt rồi xoá ở lượt
 *     khác là một khe hở thật khi có hai tab.
 */
export type KhoDisc = {
  /* ── Bài làm ── */
  /** 🔴 Cửa DUY NHẤT để sao lưu. Cố ý không có tham số lọc. Mới nhất đứng đầu. */
  readonly docBai: () => Promise<BaiLamLuu[]>;
  readonly luuBai: (bai: BaiLamLuu) => Promise<boolean>;
  /** Đính điều phụ huynh băn khoăn vào bài đã lưu. Bài không còn ⇒ `false`, KHÔNG tạo mới. */
  readonly ghiBanKhoan: (id: string, banKhoan: string) => Promise<boolean>;
  readonly xoaBai: (id: string) => Promise<void>;
  readonly xoaSachBai: () => Promise<void>;

  /* ── Thành viên ── */
  readonly docThanhVien: () => Promise<ThanhVien[]>;
  readonly luuThanhVien: (tv: ThanhVien) => Promise<boolean>;
  /** 🔴 `cheDo` KHÔNG có mặc định — xoá dây chuyền phải do nơi gọi nói ra. */
  readonly xoaThanhVien: (id: string, cheDo: CheDoXoaThanhVien) => Promise<void>;
  readonly xoaSachThanhVien: () => Promise<void>;

  /* ── Phân tích cả nhà ── */
  readonly docPhanTich: () => Promise<PhanTichGiaDinh[]>;
  readonly luuPhanTich: (pt: PhanTichGiaDinh) => Promise<boolean>;
  readonly xoaSachPhanTich: () => Promise<void>;

  /** 🔴 Dọn TRỌN máy — cả ba bảng. Nút *Xoá sạch* của người dùng đi qua đây. */
  readonly xoaSachTatCa: () => Promise<void>;

  /* ── Hạn mức ── */
  /** Xoá bớt bài của một người cho đủ hạn mức. Trả về id những bài đã mất. */
  readonly donBaiThanhVien: (
    maThanhVien: string,
    gioiHan: number,
    soBaiSapThem?: number,
  ) => Promise<string[]>;
  /** Chỉ ĐỌC: những bài SẼ mất nếu người này làm thêm một bài — để đem đi hỏi. */
  readonly baiSapMat: (
    maThanhVien: string,
    gioiHan: number,
    soBaiSapThem?: number,
  ) => Promise<BaiLamLuu[]>;
  readonly donThuMucPhanTich: (gioiHan: number, soSapThem?: number) => Promise<string[]>;
  /** Chỉ ĐỌC: những thư mục SẼ mất nếu chạy thêm một lần phân tích. */
  readonly thuMucSapMat: (
    gioiHan: number,
    soSapThem?: number,
  ) => Promise<PhanTichGiaDinh[]>;

  /* ── Báo đổi ── */
  /**
   * Đăng ký nghe kho đổi; trả về hàm huỷ đăng ký.
   *
   * 🔴 Phải báo cho cả người đăng ký TRONG CÙNG ngữ cảnh vừa ghi. Bản dựng cũ chỉ
   * `postMessage` qua `BroadcastChannel` — thứ không bao giờ gửi về chính tab đã đăng
   * tin — nên tab người dùng đang nhìn là tab duy nhất không được báo.
   */
  readonly dangKyDoiKho: (nghe: NgheKhoDoi) => () => void;
};

/* ── Sổ đăng ký bản dựng ──────────────────────────────────────────────────── */

let dangDung: KhoDisc | null = null;

/**
 * Cắm một bản dựng vào. Trả về hàm trả lại bản cũ — test dùng nó để dọn sau mình.
 *
 * 🔴 Đây là TOÀN BỘ thứ đội dev app chủ cần đụng tới: viết một object thoả `KhoDisc` gọi
 * server của họ, gọi `datKho()` một lần lúc khởi động, và không sửa một dòng giao diện nào.
 */
export function datKho(kho: KhoDisc): () => void {
  const cu = dangDung;
  dangDung = kho;
  return () => {
    dangDung = cu;
  };
}

/**
 * Bản dựng đang dùng.
 *
 * 🔴 Ném khi chưa có ai đăng ký — cố ý. Trả một bản giả im lặng thì sản phẩm chạy tiếp
 * và mất trắng dữ liệu mà không ai biết; ném thì hỏng ngay ở dòng đầu tiên, lúc còn dễ
 * tìm nhất.
 */
export function khoDangDung(): KhoDisc {
  if (!dangDung) {
    throw new Error("Chưa có bản dựng kho nào được đăng ký. Gọi datKho() lúc khởi động.");
  }
  return dangDung;
}

/** Đã có bản dựng nào chưa — để nơi gọi tự quyết, thay vì bắt nó bọc try/catch. */
export function daCoKho(): boolean {
  return dangDung !== null;
}
