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

import { chonBaiPhaiXoa, chonThuMucPhaiXoa } from "@modules/core/gia-dinh/han-muc";
import type {
  CheDoXoaThanhVien,
  PhanTichGiaDinh,
  ThanhVien,
} from "@modules/core/gia-dinh/kieu";
import {
  datKho,
  khoDangDung,
  type BaiLamLuu,
  type KhoDisc,
  type NgheKhoDoi,
} from "./kho-disc";

export const TEN_KHO = "disc";
export const TEN_BANG = "bai-lam";
export const BANG_THANH_VIEN = "thanh-vien";
export const BANG_PHAN_TICH = "phan-tich-gia-dinh";

/**
 * 🔴 Tăng số này là một cuộc DI TRÚ. Đọc `moKho()` trước khi đụng vào.
 *
 * 🔴 XUẤT RA CÓ CHỦ ĐÍCH (V0.3). Bộ sinh dữ liệu mẫu phải mở kho bằng ĐÚNG số này. Trước
 * đó nó gõ cứng `open(TEN_KHO, 1)` — và khi kho lên v2, bộ nạp mẫu chết lặng: mở kho v1
 * trên một kho đã v2 thì `VersionError`, lời hứa văng, và người dán nó vào Console chỉ
 * thấy một lỗi đỏ lạ. Một script hỏng mà không ai gọi thì im lặng y như một tính năng
 * hỏng mà không ai mở.
 */
export const PHIEN_BAN_KHO = 2;

/** Khoá localStorage đánh dấu đã chạy xong việc nhận nuôi bài cũ. */
const KHOA_DA_NHAN_NUOI = "disc:da-nhan-nuoi-v2";

/**
 * 🔴 Kiểu ở đây chỉ là CHUYỂN TIẾP. Bản khai gốc nằm ở `kho-disc.ts` cùng bản hợp đồng
 * mà nó phục vụ — hai bản khai của cùng một hình dạng dữ liệu là hai chỗ để lệch nhau.
 */
export type { BaiLamLuu };

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

/* ── Báo kho đổi ─────────────────────────────────────────────────────────── */

/** Kênh báo cho các tab khác nạp lại sau khi kho đổi. */
export const KENH_KHO = "disc:kho";

/**
 * 🔴 VÌ SAO CÓ BỘ ĐĂNG KÝ NÀY, THAY VÌ CHỈ `postMessage`.
 *
 * `BroadcastChannel` **không bao giờ gửi về chính ngữ cảnh đã đăng tin**. Nên bản cũ —
 * ghi kho xong rồi `postMessage` — báo được cho MỌI tab trừ đúng cái tab người dùng đang
 * nhìn. Mà người dùng chỉ có một tab: làm xong bài, bấm quay lại, thẻ vẫn hiện số cũ cho
 * tới khi bấm F5. Vá thêm `postMessage` ở các lệnh ghi còn thiếu KHÔNG cứu được lỗi đó.
 *
 * Vậy `baoDoi()` làm HAI việc, đúng thứ tự: gọi người đăng ký **trong tab này** trước,
 * rồi mới đăng tin cho tab khác.
 */
const nguoiNghe = new Set<NgheKhoDoi>();

/**
 * Một kênh DÙNG CHUNG cho cả nhận lẫn gửi.
 *
 * 🔴 Cố ý không mở kênh riêng để gửi. Spec loại trừ đúng *đối tượng kênh đã gửi*, chứ
 * không loại trừ cả tab — mở một kênh thứ hai trong cùng tab để gửi thì kênh nhận ở đây
 * VẪN nghe thấy, và người đăng ký bị gọi hai lần cho một lần ghi.
 */
let kenhChung: BroadcastChannel | null = null;

function moKenhNeuCan(): void {
  if (kenhChung || typeof BroadcastChannel === "undefined") return;
  try {
    kenhChung = new BroadcastChannel(KENH_KHO);
    kenhChung.onmessage = () => goiNguoiNghe();
  } catch {
    kenhChung = null;
  }
}

function dongKenhNeuHet(): void {
  if (nguoiNghe.size > 0 || !kenhChung) return;
  try {
    kenhChung.close();
  } catch {
    // Kênh đã đóng sẵn — không có gì để dọn thêm.
  }
  kenhChung = null;
}

function goiNguoiNghe(): void {
  // Chụp lại danh sách: một người nghe có quyền tự huỷ đăng ký ngay trong lúc chạy.
  for (const nghe of [...nguoiNghe]) {
    try {
      nghe();
    } catch {
      // Một người nghe hỏng không được kéo theo những người còn lại.
    }
  }
}

/**
 * Đăng ký nghe kho đổi. Trả về hàm HUỶ đăng ký — gọi nó trong `useEffect` cleanup.
 *
 * Nghe được cả hai nguồn: thay đổi trong CHÍNH tab này, và thay đổi từ tab khác.
 */
export function dangKyDoiKho(nghe: NgheKhoDoi): () => void {
  nguoiNghe.add(nghe);
  moKenhNeuCan();
  return () => {
    nguoiNghe.delete(nghe);
    dongKenhNeuHet();
  };
}

/**
 * Gom nhiều lệnh ghi thành MỘT lần báo.
 *
 * `xoaSachTatCa()` đụng ba bảng và `xoaThanhVien()` chạy một vòng lặp ghi. Báo theo từng
 * lệnh con là bắt giao diện nạp lại N lần cho một hành động — mỗi lần một lượt đọc kho, và
 * các lượt đó đua nhau ghi vào cùng một state.
 */
let doSauGom = 0;
let coDoiTrongGom = false;

function gomBao<T>(viec: () => Promise<T>): Promise<T> {
  doSauGom += 1;
  return viec().then(
    (kq) => {
      xaGom();
      return kq;
    },
    (loi) => {
      xaGom();
      throw loi;
    },
  );
}

function xaGom(): void {
  doSauGom -= 1;
  if (doSauGom > 0 || !coDoiTrongGom) return;
  coDoiTrongGom = false;
  baoDoiNgay();
}

/** Kho vừa đổi: báo người đăng ký trong tab này, rồi báo các tab khác. */
export function baoDoi(): void {
  if (doSauGom > 0) {
    coDoiTrongGom = true;
    return;
  }
  baoDoiNgay();
}

function baoDoiNgay(): void {
  goiNguoiNghe();
  try {
    if (typeof BroadcastChannel === "undefined") return;
    if (kenhChung) {
      kenhChung.postMessage("doi");
      return;
    }
    // Không ai nghe trong tab này ⇒ chưa mở kênh chung. Vẫn phải báo cho tab khác.
    const kenh = new BroadcastChannel(KENH_KHO);
    kenh.postMessage("doi");
    kenh.close();
  } catch {
    // Trình duyệt cũ không có BroadcastChannel — mất đồng bộ GIỮA CÁC TAB, không mất dữ
    // liệu, và người đăng ký trong tab này thì đã được gọi ở trên rồi.
  }
}

/* ── Bài làm ─────────────────────────────────────────────────────────────── */

function luuBaiIdb(bai: BaiLamLuu): Promise<boolean> {
  return chay<IDBValidKey | null>("readwrite", (b) => b.put(bai), null).then((k) => {
    if (k !== null) baoDoi();
    return k !== null;
  });
}

/**
 * 🔴 CỬA DUY NHẤT ĐỂ SAO LƯU. Cố ý KHÔNG nhận tham số lọc nào — thêm một tham số
 * `boDe?` vào đây là mở lại đúng cái bẫy đã cắn dự án trước.
 */
function docTatCaIdb(): Promise<BaiLamLuu[]> {
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
function ghiBanKhoanIdb(id: string, banKhoan: string): Promise<boolean> {
  return chay<BaiLamLuu | undefined>("readonly", (b) => b.get(id), undefined).then((bai) => {
    if (!bai) return false;
    return luuBaiIdb({ ...bai, banKhoan });
  });
}

function xoaBaiIdb(id: string): Promise<void> {
  return chay<undefined>("readwrite", (b) => b.delete(id), undefined).then(() => {
    baoDoi();
  });
}

function xoaSachIdb(): Promise<void> {
  return chay<undefined>("readwrite", (b) => b.clear(), undefined).then(() => {
    baoDoi();
  });
}

/** Đếm số biệt danh KHÁC NHAU đang có trên máy — phục vụ cảnh báo máy dùng chung (QĐ7). */
export function demBietDanh(ds: readonly BaiLamLuu[]): number {
  return new Set(ds.map((b) => b.maTre)).size;
}

/* ── Thành viên ──────────────────────────────────────────────────────────── */

function luuThanhVienIdb(tv: ThanhVien): Promise<boolean> {
  return chayTren<IDBValidKey | null>(
    BANG_THANH_VIEN,
    "readwrite",
    (b) => b.put(tv),
    null,
  ).then((k) => {
    if (k !== null) baoDoi();
    return k !== null;
  });
}

function docThanhVienIdb(): Promise<ThanhVien[]> {
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
async function xoaThanhVienIdb(id: string, cheDo: CheDoXoaThanhVien): Promise<void> {
  return gomBao(() => xoaThanhVienGom(id, cheDo));
}

async function xoaThanhVienGom(id: string, cheDo: CheDoXoaThanhVien): Promise<void> {
  const bai = await docTatCaIdb();
  const cuaHo = bai.filter((b) => b.maThanhVien === id);

  for (const b of cuaHo) {
    if (cheDo === "xoa-bai") {
      await xoaBaiIdb(b.id);
    } else {
      // Gỡ khoá bằng cách DỰNG LẠI bản ghi không có trường đó. Đặt `maThanhVien: undefined`
      // thì IndexedDB vẫn lưu một khoá tồn tại mang giá trị `undefined`, và index
      // `maThanhVien` cư xử khác hẳn so với khi khoá vắng mặt hẳn.
      const conLai: Record<string, unknown> = { ...b };
      delete conLai.maThanhVien;
      await luuBaiIdb(conLai as unknown as BaiLamLuu);
    }
  }

  await chayTren<undefined>(BANG_THANH_VIEN, "readwrite", (b) => b.delete(id), undefined);
  baoDoi();
}

function xoaSachThanhVienIdb(): Promise<void> {
  return chayTren<undefined>(BANG_THANH_VIEN, "readwrite", (b) => b.clear(), undefined).then(
    () => {
      baoDoi();
    },
  );
}

function xoaSachPhanTichIdb(): Promise<void> {
  return chayTren<undefined>(BANG_PHAN_TICH, "readwrite", (b) => b.clear(), undefined).then(
    () => {
      baoDoi();
    },
  );
}

/**
 * 🔴 DỌN TRỌN MÁY — cả BA bảng.
 *
 * Vì sao phải có hàm này. Nút *Xoá sạch* trước đây chỉ gọi `xoaSach()`, tức là chỉ dọn
 * bảng BÀI. Tên từng người trong nhà (bảng `thanh-vien`) và các bản phân tích đã chạy
 * (bảng `phan-tich-gia-dinh`) vẫn nằm nguyên trong máy — trong khi người bấm tin rằng
 * mình vừa xoá sạch.
 *
 * Đó không phải chuyện dọn dẹp, đó là chuyện RIÊNG TƯ: kho v2 nay giữ TÊN THẬT (ADR-005),
 * và luật máy demo của giáo viên/sale dựa thẳng vào nút này — "bấm Xoá sạch sau mỗi lần
 * demo". Một nút xoá dọn thiếu hai phần ba dữ liệu thì lời hứa đó là lời hứa suông.
 */
async function xoaSachTatCaIdb(): Promise<void> {
  return gomBao(async () => {
    await xoaSachIdb();
    await xoaSachThanhVienIdb();
    await xoaSachPhanTichIdb();
  });
}

/* ── Phân tích cả nhà ────────────────────────────────────────────────────── */

function luuPhanTichIdb(pt: PhanTichGiaDinh): Promise<boolean> {
  return chayTren<IDBValidKey | null>(BANG_PHAN_TICH, "readwrite", (b) => b.put(pt), null).then(
    (k) => {
      if (k !== null) baoDoi();
      return k !== null;
    },
  );
}

function docPhanTichIdb(): Promise<PhanTichGiaDinh[]> {
  return chayTren<PhanTichGiaDinh[]>(BANG_PHAN_TICH, "readonly", (b) => b.getAll(), []).then(
    (ds) => [...ds].sort((a, b) => b.taoLuc.localeCompare(a.taoLuc)),
  );
}

/* ── Hạn mức: dọn bài của một thành viên ─────────────────────────────────── */

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
function donBaiThanhVienIdb(
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
            if (daXoa.length > 0) baoDoi();
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
async function baiSapMatIdb(
  maThanhVien: string,
  gioiHan: number,
  soBaiSapThem = 1,
): Promise<BaiLamLuu[]> {
  const ds = await docTatCaIdb();
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
function donThuMucPhanTichIdb(gioiHan: number, soSapThem = 1): Promise<string[]> {
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
            if (daXoa.length > 0) baoDoi();
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
async function thuMucSapMatIdb(
  gioiHan: number,
  soSapThem = 1,
): Promise<PhanTichGiaDinh[]> {
  return chonThuMucPhaiXoa(await docPhanTichIdb(), gioiHan, soSapThem);
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
  return gomBao(() => nhanNuoiBaiCuGom(bayGio));
}

async function nhanNuoiBaiCuGom(bayGio: string): Promise<number> {
  const bai = await docTatCaIdb();
  const chuaXep = bai.filter((b) => !b.maThanhVien && b.maTre?.trim());
  if (chuaXep.length === 0) {
    danhDauDaNhanNuoi();
    return 0;
  }

  const daCo = await docThanhVienIdb();
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
      await luuThanhVienIdb(tv);
    }
    await luuBaiIdb({ ...b, maThanhVien: tv.id });
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

/* ── Bản dựng IndexedDB, và mặt tiền cắm được (16.4) ──────────────────────── */

/**
 * Bản dựng IndexedDB — gói mọi hàm phía trên lại thành một object thoả `KhoDisc`.
 *
 * 🔴 Vì sao gói lại chứ không để component gọi thẳng như trước: gọi thẳng thì cái "giao
 * diện kho" chỉ là một tờ giấy. Đội dev app chủ viết xong bản dựng gọi server của họ mà
 * không có chỗ cắm vào thì họ vẫn phải sửa từng component — đúng cái ADR-004 hứa sẽ
 * tránh. Mặt tiền bên dưới mới là thứ biến bản hợp đồng thành một cái ổ cắm thật.
 */
export const khoIndexedDB: KhoDisc = {
  docBai: docTatCaIdb,
  luuBai: luuBaiIdb,
  ghiBanKhoan: ghiBanKhoanIdb,
  xoaBai: xoaBaiIdb,
  xoaSachBai: xoaSachIdb,

  docThanhVien: docThanhVienIdb,
  luuThanhVien: luuThanhVienIdb,
  xoaThanhVien: xoaThanhVienIdb,
  xoaSachThanhVien: xoaSachThanhVienIdb,

  docPhanTich: docPhanTichIdb,
  luuPhanTich: luuPhanTichIdb,
  xoaSachPhanTich: xoaSachPhanTichIdb,

  xoaSachTatCa: xoaSachTatCaIdb,

  donBaiThanhVien: donBaiThanhVienIdb,
  baiSapMat: baiSapMatIdb,
  donThuMucPhanTich: donThuMucPhanTichIdb,
  thuMucSapMat: thuMucSapMatIdb,

  dangKyDoiKho,
};

// Bản dựng mặc định. Đội dev app chủ gọi `datKho()` một lần lúc khởi động là thay được
// toàn bộ, KHÔNG sửa một dòng giao diện nào.
datKho(khoIndexedDB);

/**
 * MẶT TIỀN — mọi component vẫn gọi đúng những cái tên cũ, nhưng lời gọi nay đi qua bản
 * dựng đang đăng ký.
 *
 * 🔴 Đây là chỗ khiến việc cắm bản dựng khác có TÁC DỤNG THẬT. Giữ tên cũ có chủ đích:
 * đổi 13 file giao diện sang `kho().luuBai(...)` là hàng trăm dòng đổi, một đợt test đỏ,
 * và không thêm một giá trị nào cho người dùng trước ngày phát.
 */
export const docTatCa = (): Promise<BaiLamLuu[]> => khoDangDung().docBai();
export const luuBai = (bai: BaiLamLuu): Promise<boolean> => khoDangDung().luuBai(bai);
export const ghiBanKhoan = (id: string, banKhoan: string): Promise<boolean> =>
  khoDangDung().ghiBanKhoan(id, banKhoan);
export const xoaBai = (id: string): Promise<void> => khoDangDung().xoaBai(id);
export const xoaSach = (): Promise<void> => khoDangDung().xoaSachBai();

export const docThanhVien = (): Promise<ThanhVien[]> => khoDangDung().docThanhVien();
export const luuThanhVien = (tv: ThanhVien): Promise<boolean> =>
  khoDangDung().luuThanhVien(tv);
export const xoaThanhVien = (id: string, cheDo: CheDoXoaThanhVien): Promise<void> =>
  khoDangDung().xoaThanhVien(id, cheDo);
export const xoaSachThanhVien = (): Promise<void> => khoDangDung().xoaSachThanhVien();

export const docPhanTich = (): Promise<PhanTichGiaDinh[]> => khoDangDung().docPhanTich();
export const luuPhanTich = (pt: PhanTichGiaDinh): Promise<boolean> =>
  khoDangDung().luuPhanTich(pt);
export const xoaSachPhanTich = (): Promise<void> => khoDangDung().xoaSachPhanTich();

export const xoaSachTatCa = (): Promise<void> => khoDangDung().xoaSachTatCa();

export const donBaiThanhVien = (
  maThanhVien: string,
  gioiHan: number,
  soBaiSapThem = 1,
): Promise<string[]> => khoDangDung().donBaiThanhVien(maThanhVien, gioiHan, soBaiSapThem);
export const baiSapMat = (
  maThanhVien: string,
  gioiHan: number,
  soBaiSapThem = 1,
): Promise<BaiLamLuu[]> => khoDangDung().baiSapMat(maThanhVien, gioiHan, soBaiSapThem);
export const donThuMucPhanTich = (gioiHan: number, soSapThem = 1): Promise<string[]> =>
  khoDangDung().donThuMucPhanTich(gioiHan, soSapThem);
export const thuMucSapMat = (
  gioiHan: number,
  soSapThem = 1,
): Promise<PhanTichGiaDinh[]> => khoDangDung().thuMucSapMat(gioiHan, soSapThem);
