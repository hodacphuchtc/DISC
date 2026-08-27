/**
 * MÃ MỜI — gói một hồ sơ DISC thành một chuỗi ngắn gõ tay được.
 *
 * VÌ SAO CÓ FILE NÀY. ADR-001 cấm backend, nên mặc định cả nhà phải xếp hàng trên MỘT
 * điện thoại: bố, mẹ và hai đứa con, mỗi người vài chục câu. Ma sát đó lớn hơn nhiều so
 * với hình dung, và nó đúng kể cả khi phần mềm hoàn hảo. Một hồ sơ DISC lại chỉ là BỐN
 * CON SỐ cộng vài mẩu siêu dữ liệu — đủ nhỏ để nhét vào một chuỗi mà người ta đọc cho
 * nhau nghe qua điện thoại. Đó là cách gỡ trần "cả nhà một máy" mà KHÔNG dựng backend.
 *
 * 🔴 MÃ CHỈ CHỨA ĐIỂM ĐÃ CHẤM — tuyệt đối không chứa câu trả lời nào. Câu trả lời của
 * trẻ không bao giờ rời máy; đó là lời hứa của ADR-001 và mã mời không được phép biến
 * nó thành lời nói dối. `tests/ma-moi.test.ts` canh điều này bằng một cửa kiểm riêng.
 *
 * 🔴 MÃ KHÔNG CHỨA BIỆT DANH. Đây là chỗ khác với bản phác đầu tiên, và cố ý:
 * mã mời ĐI RA KHỎI MÁY (tin nhắn, ảnh chụp màn hình, nhóm Zalo), nên nhét tên vào là
 * phá thẳng hai trong bốn hàng rào của quyết định "cho nhập tên thật" — *tên không vào
 * tệp xuất* và *tên không vào ảnh chia sẻ*. Máy nhận mã tự hỏi "đây là ai trong nhà?"
 * và người dùng tự gõ tên NGAY TRÊN MÁY MÌNH. Đổi lại còn được một chỗ rẻ hơn: bỏ tên
 * ra thì cả hồ sơ vừa đúng 12 ký tự.
 *
 * THUỘC TẦNG LÕI (ADR-004): hàm thuần, không React, không DOM, và **không đọc đồng hồ**
 * — `moHoSo()` nhận ngày hôm nay qua tham số. Hàm nào tự gọi `Date.now()` thì không test
 * được cái hạn 7 ngày mà không giả lập thời gian.
 *
 * ── HÌNH DẠNG MÃ ────────────────────────────────────────────────────────────
 *
 * 12 ký tự dữ liệu + 2 ký tự kiểm tổng = **14 ký tự**, hiện theo nhóm 5:
 *
 *     M2P4K-8TQ7B-3XJ9
 *
 * 60 bit dữ liệu, đóng gói theo thứ tự (bit cao trước):
 *
 * | Trường     | Bit | Ý nghĩa                                             |
 * | ---------- | --- | --------------------------------------------------- |
 * | phiên bản  |   2 | `PHIEN_BAN_MA`, để sau này còn đổi được hình dạng   |
 * | bộ đề      |   3 | chỉ số trong `MA_BO_DE`                             |
 * | vai        |   3 | chỉ số trong `VAI_GIA_DINH`                         |
 * | ngày phát  |  12 | số ngày kể từ `MOC_NGAY_MA`                         |
 * | điểm D     |  10 | điểm × 10, tức 0–1000                               |
 * | điểm I     |  10 |                                                     |
 * | điểm S     |  10 |                                                     |
 * | điểm C     |  10 |                                                     |
 *
 * Điểm giữ NGUYÊN một chữ số thập phân chứ không làm tròn về số nguyên, và đó là chủ ý:
 * `xepHangTruc()` xếp bốn trục theo điểm, nên làm tròn D 62,4 và I 62,5 thành 62 và 63
 * là ĐẢO NGƯỢC thứ hạng — mà toàn bộ nội dung báo cáo khoá theo thứ hạng.
 */

import { MA_BO_DE, MA_TRUC, type MaBoDe, type MaTruc } from "@modules/core/bo-de/kieu";
import {
  BANG_CHU_MA,
  CO_NHOM_MA,
  HAN_MA_MOI_NGAY,
  MOC_NGAY_MA,
  VAI_GIA_DINH,
  type VaiGiaDinh,
} from "@config/disc-gia-dinh";

/** Phiên bản hình dạng mã. Đổi bố cục bit thì tăng số này. */
export const PHIEN_BAN_MA = 1;

const SO_KY_TU_DU_LIEU = 12;
const SO_KY_TU_KIEM = 2;
export const DO_DAI_MA = SO_KY_TU_DU_LIEU + SO_KY_TU_KIEM;

/** Số nguyên tố dưới 1024 — xem `kiemTong()` để biết vì sao phải là số nguyên tố. */
const MODUL_KIEM = 1021;

const BIT = { phienBan: 2, boDe: 3, vai: 3, ngay: 12, diem: 10 } as const;

/** Điểm nhân 10 rồi làm tròn ⇒ giá trị lớn nhất là 100,0 × 10. */
const DIEM_TOI_DA_GOI = 1000;

export type HoSoMoi = {
  readonly boDe: MaBoDe;
  readonly vai: VaiGiaDinh;
  /** 0–100, đúng một chữ số thập phân — hình dạng mà `chuanHoa()` sinh ra. */
  readonly diem: Readonly<Record<MaTruc, number>>;
  /** Ngày phát mã, dạng `yyyy-mm-dd`. */
  readonly ngayPhat: string;
};

export type LyDoMaHong =
  | "RONG"
  | "SAI_DO_DAI"
  | "KY_TU_LA"
  | "SAI_KIEM_TONG"
  | "SAI_PHIEN_BAN"
  | "SO_LIEU_LA"
  | "QUA_HAN"
  | "NGAY_TUONG_LAI";

export type KetQuaMoMa =
  | { readonly ok: true; readonly hoSo: HoSoMoi }
  | { readonly ok: false; readonly lyDo: LyDoMaHong };

/* ── Ngày: số học thuần trên chuỗi yyyy-mm-dd ─────────────────────────────── */

/**
 * `yyyy-mm-dd` ⇒ số ngày kể từ mốc 1970 (theo UTC). Chuỗi hỏng hoặc ngày không có thật
 * (`2026-02-31`) ⇒ `null`.
 *
 * 🔴 CỐ Ý dựng bằng `Date.UTC` chứ không `new Date(chuoi)`: cùng một chuỗi chạy trên máy
 * ở +07 và trên CI ở UTC phải ra CÙNG một con số. Dự án này đã trả giá đúng chỗ đó một
 * lần rồi — test ngày xanh trên máy, đỏ trên GitHub.
 */
function soNgayTuChuoi(chuoi: unknown): number | null {
  if (typeof chuoi !== "string") return null;
  const khop = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(chuoi);
  if (!khop) return null;
  const nam = Number(khop[1]);
  const thang = Number(khop[2]);
  const ngay = Number(khop[3]);
  const moc = Date.UTC(nam, thang - 1, ngay);
  const d = new Date(moc);
  // Bắt ngày không có thật: 31/02 bị Date cuộn sang tháng sau mà không kêu tiếng nào.
  if (d.getUTCFullYear() !== nam || d.getUTCMonth() !== thang - 1 || d.getUTCDate() !== ngay) {
    return null;
  }
  return Math.floor(moc / 86_400_000);
}

/* ── Bit ─────────────────────────────────────────────────────────────────── */

function vietBit(vao: number[], giaTri: number, soBit: number): void {
  for (let i = soBit - 1; i >= 0; i -= 1) vao.push((giaTri >>> i) & 1);
}

function docBit(bit: readonly number[], tu: number, soBit: number): number {
  let giaTri = 0;
  for (let i = 0; i < soBit; i += 1) giaTri = giaTri * 2 + bit[tu + i];
  return giaTri;
}

/* ── Kiểm tổng ───────────────────────────────────────────────────────────── */

/**
 * Tổng có trọng số theo vị trí, lấy dư cho một SỐ NGUYÊN TỐ.
 *
 * Số nguyên tố và trọng số theo vị trí là hai thứ làm nên tính chất muốn có:
 * - **sai một ký tự** đổi tổng đi `(vị trí) × (chênh lệch)`, lớn nhất 12 × 31 = 372,
 *   luôn nhỏ hơn 1021 và khác 0 ⇒ **bắt được 100%**;
 * - **đảo hai ký tự liền nhau** đổi tổng đi đúng chênh lệch giữa hai ký tự đó, cũng
 *   nhỏ hơn 1021 ⇒ **bắt được 100%** (trừ khi hai ký tự bằng nhau, mà thế thì đảo cũng
 *   chẳng đổi gì).
 *
 * Đây là hai kiểu sai người ta thật sự gây ra khi gõ lại một mã đọc qua điện thoại.
 */
function kiemTong(giaTri: readonly number[]): number {
  let tong = 0;
  for (let i = 0; i < giaTri.length; i += 1) tong = (tong + (i + 1) * giaTri[i]) % MODUL_KIEM;
  return tong;
}

/* ── Gói ─────────────────────────────────────────────────────────────────── */

/**
 * Gói một hồ sơ thành chuỗi mã mời (đã chia nhóm bằng dấu gạch nối).
 *
 * Ném lỗi khi dữ liệu vào không hợp lệ — đây là lỗi lập trình ở nơi gọi, không phải
 * đầu vào của người dùng, nên im lặng trả về chuỗi rác sẽ tệ hơn nhiều.
 */
export function goiHoSo(hoSo: HoSoMoi): string {
  const viBoDe = MA_BO_DE.indexOf(hoSo.boDe);
  if (viBoDe < 0) throw new Error(`goiHoSo: mã bộ đề lạ "${hoSo.boDe}"`);

  const viVai = VAI_GIA_DINH.indexOf(hoSo.vai);
  if (viVai < 0) throw new Error(`goiHoSo: vai lạ "${hoSo.vai}"`);

  const soNgayPhat = soNgayTuChuoi(hoSo.ngayPhat);
  const soNgayMoc = soNgayTuChuoi(MOC_NGAY_MA);
  if (soNgayPhat === null || soNgayMoc === null) {
    throw new Error(`goiHoSo: ngày phát không đọc được "${hoSo.ngayPhat}"`);
  }
  const ngay = soNgayPhat - soNgayMoc;
  if (ngay < 0 || ngay >= 2 ** BIT.ngay) {
    throw new Error(`goiHoSo: ngày phát "${hoSo.ngayPhat}" nằm ngoài tầm mã (mốc ${MOC_NGAY_MA})`);
  }

  const bit: number[] = [];
  vietBit(bit, PHIEN_BAN_MA, BIT.phienBan);
  vietBit(bit, viBoDe, BIT.boDe);
  vietBit(bit, viVai, BIT.vai);
  vietBit(bit, ngay, BIT.ngay);
  for (const truc of MA_TRUC) {
    const diem = hoSo.diem[truc];
    if (typeof diem !== "number" || !Number.isFinite(diem) || diem < 0 || diem > 100) {
      throw new Error(`goiHoSo: điểm trục ${truc} ngoài thang 0–100 ("${String(diem)}")`);
    }
    vietBit(bit, Math.min(Math.round(diem * 10), DIEM_TOI_DA_GOI), BIT.diem);
  }

  const giaTri: number[] = [];
  for (let i = 0; i < bit.length; i += 5) giaTri.push(docBit(bit, i, 5));

  const tong = kiemTong(giaTri);
  giaTri.push(Math.floor(tong / 32), tong % 32);

  const chu = giaTri.map((v) => BANG_CHU_MA[v]).join("");
  return chiaNhom(chu);
}

/** `M2P4K8TQ7B3XJ9` ⇒ `M2P4K-8TQ7B-3XJ9`. Chỉ để mắt người đọc, không vào phép tính. */
export function chiaNhom(chu: string): string {
  const nhom: string[] = [];
  for (let i = 0; i < chu.length; i += CO_NHOM_MA) nhom.push(chu.slice(i, i + CO_NHOM_MA));
  return nhom.join("-");
}

/* ── Mở ──────────────────────────────────────────────────────────────────── */

/**
 * Chuẩn hoá chuỗi người dùng gõ vào: bỏ khoảng trắng và gạch nối, viết hoa, rồi kéo
 * những ký tự hay nhầm về đúng chỗ theo lối Crockford (`I`/`L` ⇒ `1`, `O` ⇒ `0`).
 *
 * Kéo về như thế KHÔNG làm yếu kiểm tổng: nếu người ta gõ `O` mà mã thật là `Q` thì đó
 * vẫn là một ký tự sai và kiểm tổng vẫn bắt. Nó chỉ cứu đúng cái nhầm hình dạng chữ.
 */
export function chuanHoaMa(chuoi: string): string {
  return chuoi
    .toUpperCase()
    .replace(/[\s-]/gu, "")
    .replace(/[IL]/gu, "1")
    .replace(/O/gu, "0");
}

/**
 * Mở mã mời. Hàm THUẦN — `homNay` (`yyyy-mm-dd`) do nơi gọi đưa vào, hàm không đọc đồng hồ.
 *
 * Trả về lý do hỏng cụ thể chứ không chỉ `null`: màn nhập mã cần nói được với người dùng
 * là *gõ sai* hay *mã đã hết hạn* — hai chuyện đó đòi hai câu trả lời khác hẳn nhau.
 */
export function moHoSo(chuoi: string, homNay: string): KetQuaMoMa {
  const chu = chuanHoaMa(chuoi ?? "");
  if (chu.length === 0) return { ok: false, lyDo: "RONG" };
  if (chu.length !== DO_DAI_MA) return { ok: false, lyDo: "SAI_DO_DAI" };

  const giaTri: number[] = [];
  for (const kyTu of chu) {
    const v = BANG_CHU_MA.indexOf(kyTu);
    if (v < 0) return { ok: false, lyDo: "KY_TU_LA" };
    giaTri.push(v);
  }

  const phanDuLieu = giaTri.slice(0, SO_KY_TU_DU_LIEU);
  const tongDoc = giaTri[SO_KY_TU_DU_LIEU] * 32 + giaTri[SO_KY_TU_DU_LIEU + 1];
  if (tongDoc !== kiemTong(phanDuLieu)) return { ok: false, lyDo: "SAI_KIEM_TONG" };

  const bit: number[] = [];
  for (const v of phanDuLieu) vietBit(bit, v, 5);

  let tu = 0;
  const doc = (soBit: number): number => {
    const v = docBit(bit, tu, soBit);
    tu += soBit;
    return v;
  };

  if (doc(BIT.phienBan) !== PHIEN_BAN_MA) return { ok: false, lyDo: "SAI_PHIEN_BAN" };

  const boDe = MA_BO_DE[doc(BIT.boDe)];
  const vai = VAI_GIA_DINH[doc(BIT.vai)];
  if (!boDe || !vai) return { ok: false, lyDo: "SO_LIEU_LA" };

  const soNgayMoc = soNgayTuChuoi(MOC_NGAY_MA);
  const soHomNay = soNgayTuChuoi(homNay);
  if (soNgayMoc === null || soHomNay === null) return { ok: false, lyDo: "SO_LIEU_LA" };
  const soNgayPhat = soNgayMoc + doc(BIT.ngay);

  const diem: Record<MaTruc, number> = { D: 0, I: 0, S: 0, C: 0 };
  for (const truc of MA_TRUC) {
    const thoDiem = doc(BIT.diem);
    if (thoDiem > DIEM_TOI_DA_GOI) return { ok: false, lyDo: "SO_LIEU_LA" };
    diem[truc] = thoDiem / 10;
  }

  const tuoiMa = soHomNay - soNgayPhat;
  // Cho phép lệch một ngày về phía tương lai: hai máy có thể ở hai múi giờ khác nhau,
  // và cả hai đều lấy ngày theo giờ MÁY MÌNH. Quá một ngày thì đồng hồ sai thật.
  if (tuoiMa < -1) return { ok: false, lyDo: "NGAY_TUONG_LAI" };
  if (tuoiMa > HAN_MA_MOI_NGAY) return { ok: false, lyDo: "QUA_HAN" };

  return {
    ok: true,
    hoSo: { boDe, vai, diem, ngayPhat: chuoiTuSoNgay(soNgayPhat) },
  };
}

/** Số ngày kể từ 1970 (UTC) ⇒ `yyyy-mm-dd`. */
function chuoiTuSoNgay(soNgay: number): string {
  const d = new Date(soNgay * 86_400_000);
  const hai = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${hai(d.getUTCMonth() + 1)}-${hai(d.getUTCDate())}`;
}
