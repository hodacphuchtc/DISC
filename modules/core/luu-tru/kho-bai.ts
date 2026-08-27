/**
 * KHO DỮ LIỆU TRÊN MÁY — IndexedDB. Ba bảng từ phiên bản 2 (ADR-007).
 *
 * KHÔNG thuộc tầng lõi (ADR-004): buộc phải đụng `indexedDB`.
 *
 * 🔴 Cạm bẫy đã trả giá ở dự án trước (24/08): nút Sao lưu đọc DANH SÁCH ĐANG LỌC trên
 * màn hình thay vì đọc thẳng kho. Người dùng bấm sao lưu ở một khoang, nhận về một file
 * trông như đủ, yên tâm xoá dữ liệu duyệt web, rồi mất sạch phần kia.
 * ⇒ `docTatCa()` là cửa duy nhất để sao lưu, và nó KHÔNG nhận tham số lọc nào.
 *
 * Trình duyệt chặn IndexedDB (cửa sổ ẩn danh nghiêm ngặt) thì MẤT tính năng lưu, KHÔNG
 * được làm hỏng bài đang làm — mọi hàm trả về giá trị rỗng thay vì ném.
 */

import type { KetQua, MaBoDe } from "@modules/core/bo-de/kieu";
import { chonBaiPhaiXoa, chonThuMucPhaiXoa } from "@modules/core/gia-dinh/han-muc";
import type {
  CheDoXoaThanhVien,
  PhanTichGiaDinh,
  ThanhVien,
} from "@modules/core/gia-dinh/kieu";

export const TEN_KHO = "disc";
export const TEN_BANG = "bai-lam";
export const BANG_THANH_VIEN = "thanh-vien";
export const BANG_PHAN_TICH = "phan-tich-gia-dinh";

/** 🔴 Tăng số này là một cuộc DI TRÚ. Đọc `moKho()` trước khi đụng vào. */
const PHIEN_BAN_KHO = 2;

/** Khoá localStorage đánh dấu đã chạy xong việc nhận nuôi bài cũ. */
const KHOA_DA_NHAN_NUOI = "disc:da-nhan-nuoi-v2";

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

/**
 * Vì sao kho không mở được. Giao diện cần phân biệt để nói đúng câu.
 *
 * 🔴 `chan-boi-tab-khac` là mã quan trọng nhất. Bản v1 trả `null` im lặng cho cả trường
 * hợp này, nên khi người dùng mở DISC ở hai tab, tab cũ chỉ đơn giản là… không lưu gì nữa.
 * Không lỗi, không cảnh báo, và bài vừa làm biến mất. Nay nói thẳng: *đóng tab kia đi*.
 */
export type LyDoKhoHong = "khong-co-indexeddb" | "chan-boi-tab-khac" | "loi-khac";

let lyDoGanNhat: LyDoKhoHong | null = null;

/** Vì sao lần đụng kho gần nhất hỏng. `null` = không hỏng. */
export function lyDoKhoHong(): LyDoKhoHong | null {
  return lyDoGanNhat;
}

function moKho(): Promise<IDBDatabase | null> {
  return new Promise((giaiQuyet) => {
    try {
      if (typeof indexedDB === "undefined") {
        lyDoGanNhat = "khong-co-indexeddb";
        return giaiQuyet(null);
      }
      const yeuCau = indexedDB.open(TEN_KHO, PHIEN_BAN_KHO);

      // 🔴 `onupgradeneeded` CHỈ tạo bảng và index. TUYỆT ĐỐI không đọc–ghi lại bài cũ ở
      // đây: chạy cursor rewrite cả bảng trong transaction `versionchange` là chỗ mất dữ
      // liệu kinh điển — transaction đó abort thì mất trắng, và nó abort vì những lý do
      // nằm ngoài tầm tay (tab khác giữ kho, máy hết pin, người dùng đóng trình duyệt).
      // Việc gán bài cũ về thành viên làm SAU, lười, ở transaction thường — `nhanNuoiBaiCu`.
      yeuCau.onupgradeneeded = () => {
        const db = yeuCau.result;
        if (!db.objectStoreNames.contains(TEN_BANG)) {
          const bang = db.createObjectStore(TEN_BANG, { keyPath: "id" });
          bang.createIndex("maTre", "maTre", { unique: false });
          bang.createIndex("ketThuc", "ketThuc", { unique: false });
        }
        // Index mới trên bảng CŨ: phải lấy store qua transaction của chính yêu cầu nâng cấp.
        const gd = yeuCau.transaction;
        if (gd) {
          const bang = gd.objectStore(TEN_BANG);
          if (!bang.indexNames.contains("maThanhVien")) {
            bang.createIndex("maThanhVien", "maThanhVien", { unique: false });
          }
        }
        if (!db.objectStoreNames.contains(BANG_THANH_VIEN)) {
          const bang = db.createObjectStore(BANG_THANH_VIEN, { keyPath: "id" });
          bang.createIndex("thuTu", "thuTu", { unique: false });
        }
        if (!db.objectStoreNames.contains(BANG_PHAN_TICH)) {
          db.createObjectStore(BANG_PHAN_TICH, { keyPath: "id" });
        }
      };

      yeuCau.onsuccess = () => {
        lyDoGanNhat = null;
        giaiQuyet(yeuCau.result);
      };
      yeuCau.onerror = () => {
        lyDoGanNhat = "loi-khac";
        giaiQuyet(null);
      };
      yeuCau.onblocked = () => {
        lyDoGanNhat = "chan-boi-tab-khac";
        giaiQuyet(null);
      };
    } catch {
      lyDoGanNhat = "loi-khac";
      giaiQuyet(null);
    }
  });
}

// Nhận `IDBRequest` không tham số kiểu: `IDBRequest<A>` không gán được cho
// `IDBRequest<A | null>` vì `onerror` mang `this` nghịch biến.
function chayTren<T>(
  bangCanDung: string,
  cheDo: IDBTransactionMode,
  viec: (bang: IDBObjectStore) => IDBRequest,
  khiHong: T,
): Promise<T> {
  return moKho().then(
    (db) =>
      new Promise<T>((giaiQuyet) => {
        if (!db) return giaiQuyet(khiHong);
        try {
          const gd = db.transaction(bangCanDung, cheDo);
          const yc = viec(gd.objectStore(bangCanDung));
          yc.onsuccess = () => giaiQuyet(yc.result as T);
          yc.onerror = () => giaiQuyet(khiHong);
          gd.oncomplete = () => db.close();
        } catch {
          giaiQuyet(khiHong);
        }
      }),
  );
}

function chay<T>(
  cheDo: IDBTransactionMode,
  viec: (bang: IDBObjectStore) => IDBRequest,
  khiHong: T,
): Promise<T> {
  return chayTren(TEN_BANG, cheDo, viec, khiHong);
}

/* ── Bài làm ─────────────────────────────────────────────────────────────── */

export function luuBai(bai: BaiLamLuu): Promise<boolean> {
  return chay<IDBValidKey | null>("readwrite", (b) => b.put(bai), null).then((k) => k !== null);
}

/**
 * 🔴 CỬA DUY NHẤT ĐỂ SAO LƯU. Cố ý KHÔNG nhận tham số lọc nào — thêm một tham số
 * `boDe?` vào đây là mở lại đúng cái bẫy đã cắn dự án trước.
 */
export function docTatCa(): Promise<BaiLamLuu[]> {
  return chay<BaiLamLuu[]>("readonly", (b) => b.getAll(), []).then(
    (ds) => [...ds].sort((a, b) => b.ketThuc.localeCompare(a.ketThuc)),
  );
}

/**
 * Ghi lại điều phụ huynh đang băn khoăn vào một bài đã lưu.
 *
 * Đọc–sửa–ghi thay vì `put` một bản ghi dựng mới: nơi gọi ở màn kết quả chỉ có `id`, không
 * giữ trọn bản ghi, và dựng lại từ trí nhớ là cách chắc chắn nhất để làm mất `traLoi`.
 *
 * Bài không còn (người dùng vừa bấm "Kết thúc & xoá") thì trả `false` chứ không tạo mới —
 * một bản ghi chỉ có mỗi mã băn khoăn là rác, và nó sẽ hiện ra ở màn *Bài đã làm*.
 */
export function ghiBanKhoan(id: string, banKhoan: string): Promise<boolean> {
  return chay<BaiLamLuu | undefined>("readonly", (b) => b.get(id), undefined).then((bai) => {
    if (!bai) return false;
    return luuBai({ ...bai, banKhoan });
  });
}

export function xoaBai(id: string): Promise<void> {
  return chay<undefined>("readwrite", (b) => b.delete(id), undefined).then(() => undefined);
}

export function xoaSach(): Promise<void> {
  return chay<undefined>("readwrite", (b) => b.clear(), undefined).then(() => undefined);
}

/** Đếm số biệt danh KHÁC NHAU đang có trên máy — phục vụ cảnh báo máy dùng chung (QĐ7). */
export function demBietDanh(ds: readonly BaiLamLuu[]): number {
  return new Set(ds.map((b) => b.maTre)).size;
}

/* ── Thành viên ──────────────────────────────────────────────────────────── */

export function luuThanhVien(tv: ThanhVien): Promise<boolean> {
  return chayTren<IDBValidKey | null>(
    BANG_THANH_VIEN,
    "readwrite",
    (b) => b.put(tv),
    null,
  ).then((k) => k !== null);
}

export function docThanhVien(): Promise<ThanhVien[]> {
  return chayTren<ThanhVien[]>(BANG_THANH_VIEN, "readonly", (b) => b.getAll(), []).then((ds) =>
    [...ds].sort((a, b) => a.thuTu - b.thuTu || a.taoLuc.localeCompare(b.taoLuc)),
  );
}

/**
 * Xoá một thành viên.
 *
 * 🔴 `cheDo` KHÔNG có giá trị mặc định — bắt nơi gọi phải nói ra mình muốn gì. Xoá dây
 * chuyền là đường mất dữ liệu nhanh nhất, và một tham số mặc định là cách nó lẻn vào.
 *
 * `"giu-bai"` gỡ khoá `maThanhVien` khỏi các bài của người đó ⇒ bài rơi về mục *chưa xếp*
 * và xếp lại được. `"xoa-bai"` xoá luôn — chỉ dùng khi người dùng đã xác nhận rõ ràng.
 */
export async function xoaThanhVien(id: string, cheDo: CheDoXoaThanhVien): Promise<void> {
  const bai = await docTatCa();
  const cuaHo = bai.filter((b) => b.maThanhVien === id);

  for (const b of cuaHo) {
    if (cheDo === "xoa-bai") {
      await xoaBai(b.id);
    } else {
      // Gỡ khoá bằng cách DỰNG LẠI bản ghi không có trường đó. Đặt `maThanhVien: undefined`
      // thì IndexedDB vẫn lưu một khoá tồn tại mang giá trị `undefined`, và index
      // `maThanhVien` cư xử khác hẳn so với khi khoá vắng mặt hẳn.
      const conLai: Record<string, unknown> = { ...b };
      delete conLai.maThanhVien;
      await luuBai(conLai as unknown as BaiLamLuu);
    }
  }

  await chayTren<undefined>(BANG_THANH_VIEN, "readwrite", (b) => b.delete(id), undefined);
}

export function xoaSachThanhVien(): Promise<void> {
  return chayTren<undefined>(BANG_THANH_VIEN, "readwrite", (b) => b.clear(), undefined).then(
    () => undefined,
  );
}

/* ── Phân tích cả nhà ────────────────────────────────────────────────────── */

export function luuPhanTich(pt: PhanTichGiaDinh): Promise<boolean> {
  return chayTren<IDBValidKey | null>(BANG_PHAN_TICH, "readwrite", (b) => b.put(pt), null).then(
    (k) => k !== null,
  );
}

export function docPhanTich(): Promise<PhanTichGiaDinh[]> {
  return chayTren<PhanTichGiaDinh[]>(BANG_PHAN_TICH, "readonly", (b) => b.getAll(), []).then(
    (ds) => [...ds].sort((a, b) => b.taoLuc.localeCompare(a.taoLuc)),
  );
}

/* ── Hạn mức: dọn bài của một thành viên ─────────────────────────────────── */

/** Kênh báo cho các tab khác nạp lại sau khi kho đổi. */
export const KENH_KHO = "disc:kho";

function baoTabKhac(): void {
  try {
    if (typeof BroadcastChannel === "undefined") return;
    const kenh = new BroadcastChannel(KENH_KHO);
    kenh.postMessage("doi");
    kenh.close();
  } catch {
    // Trình duyệt cũ không có BroadcastChannel — mất đồng bộ giữa tab, không mất dữ liệu.
  }
}

/**
 * Xoá bớt bài của một thành viên cho đủ hạn mức, rồi báo các tab khác.
 *
 * 🔴 QUYẾT ĐỊNH NẠN NHÂN NẰM BÊN TRONG CHÍNH TRANSACTION XOÁ.
 *
 * Đọc danh sách ở một transaction rồi xoá ở transaction khác là một khe hở thật: giữa hai
 * lượt đó, tab thứ hai có thể vừa lưu xong một bài. Bài mới ấy không có trong danh sách
 * nạn nhân đã tính, nên hạn mức bị vượt; tệ hơn, một bài vừa bị xoá ở tab kia vẫn nằm
 * trong danh sách và ta xoá vào chỗ trống. Gộp vào một transaction thì không có khe đó.
 *
 * 🔴 VÀ HÀM NÀY KHÔNG BAO GIỜ ĐƯỢC GỌI TỪ `luuBai()`. `ghiBanKhoan()` cũng gọi `luuBai()`
 * — đính một mã băn khoăn vào bài cũ mà làm bay mất bài của người khác thì đúng là cạm bẫy
 * cả repo này đang cảnh báo. Chỉ gọi sau khi người dùng đã bấm xác nhận.
 */
export function donBaiThanhVien(
  maThanhVien: string,
  gioiHan: number,
  soBaiSapThem = 1,
): Promise<string[]> {
  return moKho().then(
    (db) =>
      new Promise<string[]>((giaiQuyet) => {
        if (!db) return giaiQuyet([]);
        try {
          const gd = db.transaction(TEN_BANG, "readwrite");
          const bang = gd.objectStore(TEN_BANG);
          const yc = bang.index("maThanhVien").getAll(maThanhVien);
          const daXoa: string[] = [];

          yc.onsuccess = () => {
            const cua = (yc.result as BaiLamLuu[]) ?? [];
            for (const nanNhan of chonBaiPhaiXoa(cua, gioiHan, soBaiSapThem)) {
              bang.delete(nanNhan.id);
              daXoa.push(nanNhan.id);
            }
          };
          yc.onerror = () => giaiQuyet([]);

          gd.oncomplete = () => {
            db.close();
            if (daXoa.length > 0) baoTabKhac();
            giaiQuyet(daXoa);
          };
          gd.onabort = () => giaiQuyet([]);
        } catch {
          giaiQuyet([]);
        }
      }),
  );
}

/** Những bài SẼ MẤT nếu thành viên này làm thêm một bài. Chỉ ĐỌC — để đem đi hỏi. */
export async function baiSapMat(
  maThanhVien: string,
  gioiHan: number,
  soBaiSapThem = 1,
): Promise<BaiLamLuu[]> {
  const ds = await docTatCa();
  return chonBaiPhaiXoa(
    ds.filter((b) => b.maThanhVien === maThanhVien),
    gioiHan,
    soBaiSapThem,
  );
}

/* ── Hạn mức thư mục phân tích (14.5) ────────────────────────────────────── */

/**
 * Xoá bớt thư mục phân tích cho đủ hạn mức, rồi báo các tab khác.
 *
 * Cùng khuôn với `donBaiThanhVien`: quyết định nạn nhân BÊN TRONG transaction xoá, và chỉ
 * chạy khi người dùng đã bấm xác nhận. Không hàm ghi nào được gọi nó.
 */
export function donThuMucPhanTich(gioiHan: number, soSapThem = 1): Promise<string[]> {
  return moKho().then(
    (db) =>
      new Promise<string[]>((giaiQuyet) => {
        if (!db) return giaiQuyet([]);
        try {
          const gd = db.transaction(BANG_PHAN_TICH, "readwrite");
          const bang = gd.objectStore(BANG_PHAN_TICH);
          const yc = bang.getAll();
          const daXoa: string[] = [];

          yc.onsuccess = () => {
            const ds = (yc.result as PhanTichGiaDinh[]) ?? [];
            for (const nanNhan of chonThuMucPhaiXoa(ds, gioiHan, soSapThem)) {
              bang.delete(nanNhan.id);
              daXoa.push(nanNhan.id);
            }
          };
          yc.onerror = () => giaiQuyet([]);

          gd.oncomplete = () => {
            db.close();
            if (daXoa.length > 0) baoTabKhac();
            giaiQuyet(daXoa);
          };
          gd.onabort = () => giaiQuyet([]);
        } catch {
          giaiQuyet([]);
        }
      }),
  );
}

/** Những thư mục SẼ MẤT nếu chạy thêm một lần phân tích. Chỉ ĐỌC — để đem đi hỏi. */
export async function thuMucSapMat(
  gioiHan: number,
  soSapThem = 1,
): Promise<PhanTichGiaDinh[]> {
  return chonThuMucPhaiXoa(await docPhanTich(), gioiHan, soSapThem);
}

/* ── Di trú: nhận nuôi bài cũ ────────────────────────────────────────────── */

/**
 * Gán bài cũ (chưa có `maThanhVien`) về thành viên, gom theo TÊN.
 *
 * 🔴 VÌ SAO KHÔNG LÀM TRONG `onupgradeneeded`. Xem chú thích ở đó. Tóm tắt: viết lại cả
 * bảng trong transaction `versionchange` mà abort là mất trắng, và nó abort vì những lý do
 * nằm ngoài tầm tay.
 *
 * Hàm này **lười** (chạy lần đầu ai đó mở kho sau khi nâng cấp), **một lần** (có mốc trong
 * localStorage), và **chạy lại được không hỏng gì** (idempotent): bài đã có `maThanhVien`
 * thì bỏ qua, tên đã có thành viên thì dùng lại thành viên đó.
 *
 * Mất mốc trong localStorage cũng không sao — chạy lại chỉ tốn một lượt đọc, không đẻ ra
 * thành viên trùng. Đó là điều kiện thiết kế, không phải may mắn.
 */
export async function nhanNuoiBaiCu(bayGio: string): Promise<number> {
  const bai = await docTatCa();
  const chuaXep = bai.filter((b) => !b.maThanhVien && b.maTre?.trim());
  if (chuaXep.length === 0) {
    danhDauDaNhanNuoi();
    return 0;
  }

  const daCo = await docThanhVien();
  const theoTen = new Map(daCo.map((tv) => [tv.ten.trim().toLowerCase(), tv]));
  let themMoi = 0;
  let thuTu = daCo.length;

  for (const b of chuaXep) {
    const khoa = b.maTre.trim().toLowerCase();
    let tv = theoTen.get(khoa);
    if (!tv) {
      tv = {
        id: `tv-${khoa}-${thuTu}`,
        ten: b.maTre.trim(),
        // Không đoán vai: bài cũ không có thông tin đó, và đoán rồi ghi như thể đã hỏi
        // chính là bịa dữ liệu. Người dùng sửa vai ngay trên bảng gia đình.
        vaiTro: "khac",
        ...(b.lop !== undefined ? { lop: b.lop } : {}),
        ...(b.tuoi !== undefined ? { tuoi: b.tuoi } : {}),
        thuTu,
        taoLuc: bayGio,
        suaLuc: bayGio,
      };
      theoTen.set(khoa, tv);
      thuTu += 1;
      themMoi += 1;
      await luuThanhVien(tv);
    }
    await luuBai({ ...b, maThanhVien: tv.id });
  }

  danhDauDaNhanNuoi();
  return themMoi;
}

export function daNhanNuoi(): boolean {
  try {
    return window.localStorage.getItem(KHOA_DA_NHAN_NUOI) === "1";
  } catch {
    return false;
  }
}

function danhDauDaNhanNuoi(): void {
  try {
    window.localStorage.setItem(KHOA_DA_NHAN_NUOI, "1");
  } catch {
    // Không nhớ được thì lần sau chạy lại — hàm idempotent nên chạy lại vô hại.
  }
}

/** Gọi một lần lúc mở app. Đã chạy rồi thì không đụng kho nữa. */
export async function nhanNuoiNeuCan(bayGio: string): Promise<void> {
  if (daNhanNuoi()) return;
  await nhanNuoiBaiCu(bayGio);
}
