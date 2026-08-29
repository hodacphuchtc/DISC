/**
 * ĐO PHỄU — ba mốc, không hơn (QĐ9, rút từ bốn xuống ba ở 11.2).
 *
 * KHÔNG thuộc tầng lõi: đọc `location` và ghi `localStorage`.
 *
 * 🔴 Đếm ĐÚNG BỐN MỐC và KHÔNG BAO GIỜ kèm câu trả lời hay điểm số. Nhờ vậy nó không đụng
 * ràng buộc "dữ liệu không rời máy" — nó không biết gì về nội dung bài làm.
 *
 * Vì sao cần: không có nó thì sau ba tháng, câu hỏi "cái này có đáng làm không" KHÔNG CÓ
 * câu trả lời — chỉ có cảm giác. Phễu này dài bất thường (mở → làm 24 câu → đưa máy cho
 * người khác làm tiếp), nên phải biết người ta rơi ở đâu.
 *
 * 🔴 Mốc `deLaiSo` đã BỎ ở 11.2 cùng ô thu liên hệ: mục tiêu kinh doanh đổi từ *mồi thu
 * khách* sang *giữ chân hơn 1.000 gia đình đang học*, nên cái phễu thu số điện thoại
 * thành thừa. Đếm một mốc không đời nào tăng chỉ tổ làm bảng số liệu đọc lên như hỏng.
 */

export const MOC = [
  "mo",
  "batDau",
  "xong",
  "themThanhVien",
  "baiThuHai",
  "phanTichGiaDinh",
  /**
   * 🔴 THÊM VÀO CUỐI, KHÔNG CHÈN GIỮA. Thứ tự mảng này là thứ tự hiện trên màn số liệu;
   * chèn giữa thì các con số cũ đọc lên vẫn đúng nhưng đứng nhầm hàng.
   *
   * 🔴 VÌ SAO TÁCH KHỎI `baiThuHai`. `baiThuHai` chỉ có 0 hoặc 1, nên khi nó bằng 0
   * thì KHÔNG AI BIẾT là **chưa ai bấm mời** hay **bấm rồi mà người kia không làm** — hai
   * chẩn đoán ngược hẳn nhau: một cái là lỗi sản phẩm (lời mời tới nơi mà người kia không
   * làm được ⇒ sửa tiếp), một cái là lỗi GIẢ ĐỊNH (không ai muốn rủ ⇒ dừng, đừng tiêu
   * thêm ngày nào). Không có cặp số này thì kết quả nào cũng đọc ra được thành "cần làm
   * đẹp thêm chút nữa".
   *
   * Khác `baiThuHai` ở chỗ: mốc này đếm SỐ LẦN bấm, không phải "đã từng đạt".
   */
  "bamMoi",
] as const;
export type MaMoc = (typeof MOC)[number];

/**
 * 🔴 `baiThuHai` LÀ CON SỐ QUAN TRỌNG NHẤT CỦA CẢ GÓI GĐ11–GĐ14.
 *
 * Toàn bộ GĐ14 (9,5 ngày) đứng trên MỘT giả định: *một phụ huynh sẽ triệu tập được từ
 * hai thành viên trở lên cùng làm bài.* Giả định đó hiện có **0 quan sát ủng hộ và 1
 * quan sát phản bác** — tính năng ghép hai người đã có từ GĐ5 và chưa lần nào tự kích
 * hoạt ngoài đời.
 *
 * Nên mốc này được làm SỚM, ở GĐ11, chứ không đợi tới GĐ14: nó là thứ duy nhất biến giả
 * định thành một con số đo được, và biết mình sai ở ngày 5 rẻ hơn nhiều so với ngày 28.
 *
 * Định nghĩa ở GĐ11: *máy này đã lưu từ hai bài trở lên với biệt danh KHÁC NHAU.* Đo
 * được ngay mà chưa cần sổ gia đình. GĐ12 có sổ rồi thì định nghĩa siết lại theo thành
 * viên, còn con số cũ vẫn so sánh được vì cùng đo một hành vi.
 */
export function datDuocBaiThuHai(bietDanhDaLuu: readonly string[]): boolean {
  return demBietDanhKhacNhau(bietDanhDaLuu) >= 2;
}

/**
 * Đếm số biệt danh KHÁC NHAU, bỏ qua hoa thường và khoảng trắng thừa.
 *
 * "Bin" và "bin " là một đứa trẻ, không phải hai. Đếm chúng thành hai là tự tay làm con
 * số quan trọng nhất của gói này đẹp lên — đúng thứ không được phép làm.
 */
export function demBietDanhKhacNhau(bietDanh: readonly string[]): number {
  const tap = new Set<string>();
  for (const b of bietDanh) {
    const sach = String(b ?? "").trim().toLowerCase();
    if (sach.length > 0) tap.add(sach);
  }
  return tap.size;
}

export const NGUON_MAC_DINH = "truc-tiep";
const KHOA = "disc:phieu";
const THAM_SO_NGUON = "nguon";

/** Nguồn chỉ chứa chữ, số và gạch — chặn cả rác lẫn thứ trông như định danh cá nhân. */
export function chuanHoaNguon(tho: unknown): string {
  if (typeof tho !== "string") return NGUON_MAC_DINH;
  const sach = tho.trim().toLowerCase().replace(/[^a-z0-9-]/gu, "");
  return sach.length > 0 && sach.length <= 32 ? sach : NGUON_MAC_DINH;
}

export function docNguonTuUrl(timKiem?: string): string {
  try {
    const chuoi = timKiem ?? (typeof window !== "undefined" ? window.location.search : "");
    return chuanHoaNguon(new URLSearchParams(chuoi).get(THAM_SO_NGUON));
  } catch {
    return NGUON_MAC_DINH;
  }
}

export type BanGhiMoc = {
  readonly moc: MaMoc;
  readonly nguon: string;
  /** ISO 8601. */
  readonly luc: string;
};

/** Điểm cắm cho đội dev: nối vào hệ thống đo của họ. Mặc định chỉ ghi trên máy. */
type GhiMoc = (ban: BanGhiMoc) => void;

function docKho(): BanGhiMoc[] {
  try {
    const tho = window.localStorage.getItem(KHOA);
    const doc: unknown = tho ? JSON.parse(tho) : [];
    return Array.isArray(doc) ? (doc as BanGhiMoc[]) : [];
  } catch {
    return [];
  }
}

/** Mặc định: ghi vào localStorage, giữ tối đa 500 bản ghi gần nhất. */
export const ghiMocTrenMay: GhiMoc = (ban) => {
  try {
    const ds = [...docKho(), ban].slice(-500);
    window.localStorage.setItem(KHOA, JSON.stringify(ds));
  } catch {
    // Bị chặn thì mất khả năng ĐO, không mất khả năng DÙNG.
  }
};

let ghiHienTai: GhiMoc = ghiMocTrenMay;

/** Đội dev gọi hàm này một lần lúc khởi động để nối vào backend của họ. */
export function datCachGhiMoc(ham: GhiMoc): void {
  ghiHienTai = ham;
}

export function ghiMoc(moc: MaMoc, nguon: string, luc: string): void {
  ghiHienTai({ moc, nguon, luc });
}

export function docPhieu(): BanGhiMoc[] {
  return docKho();
}

export function xoaPhieu(): void {
  try {
    window.localStorage.removeItem(KHOA);
  } catch {
    /* không sao */
  }
}

/** Đếm số lượt mỗi mốc — để xem phễu rơi ở đâu. */
export function demTheoMoc(ds: readonly BanGhiMoc[]): Record<MaMoc, number> {
  // Dựng từ chính `MOC` chứ không gõ tay bảng khoá: thêm mốc mà quên thêm vào đây thì
  // mốc mới im lặng đếm ra `undefined`, và bảng số liệu vẫn hiện ra đầy tự tin.
  const dem = Object.fromEntries(MOC.map((m) => [m, 0])) as Record<MaMoc, number>;
  for (const b of ds) if (b.moc in dem) dem[b.moc] += 1;
  return dem;
}

/** Mốc này đã từng được ghi trên máy chưa — dùng để không đếm trùng mốc chỉ-một-lần. */
export function daGhiMoc(moc: MaMoc): boolean {
  return docPhieu().some((b) => b.moc === moc);
}
