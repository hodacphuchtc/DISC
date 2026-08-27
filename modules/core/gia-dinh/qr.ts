/**
 * MÃ QR — dựng lưới ô đen/trắng từ một chuỗi. KHÔNG dùng thư viện ngoài.
 *
 * VÌ SAO TỰ VIẾT. Ràng buộc kỹ thuật của dự án cho đúng MỘT thư viện ngoài (`jszip`), và
 * thêm một thư viện QR chỉ để vẽ 21×21 ô là đổi một phụ thuộc bảo trì vĩnh viễn lấy hai
 * trăm dòng số học. Đội dev bê khoang này đi cũng đỡ phải cài thêm gì.
 *
 * PHẠM VI CỐ Ý HẸP — chỉ đủ cho mã mời, không phải bộ mã hoá QR đa dụng:
 * - **chế độ chữ-số** (0–9, A–Z và vài dấu) chứ không phải byte tuỳ ý. Mã mời viết bằng
 *   Base32 chữ hoa nên vừa khít, và chế độ này nhét 2 ký tự vào 11 bit thay vì 16.
 * - **phiên bản 1–3** (21×21 → 29×29), mức sửa lỗi **M** (chịu được ~15% hỏng), một khối
 *   dữ liệu. Đủ tới 61 ký tự — mã mời hiện dài 16 ký tự kể cả gạch nối.
 * Chuỗi vượt tầm đó thì `veLuoiQr()` NÉM LỖI chứ không cắt bớt: một mã QR quét ra nửa
 * hồ sơ còn tệ hơn một mã QR không hiện ra.
 *
 * THUỘC TẦNG LÕI (ADR-004): hàm thuần, trả về mảng boolean. Việc vẽ lên Canvas là của
 * tầng giao diện — lõi không được biết `document` là gì.
 *
 * Tham chiếu: ISO/IEC 18004. Cách bố trí ô và bảng phạt theo đúng chuẩn đó.
 */

/** Bảng ký tự của chế độ chữ-số. Vị trí trong chuỗi này CHÍNH LÀ giá trị mã hoá. */
const BANG_CHU_SO = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:";

/** Mức sửa lỗi M: 2 bit định dạng là `00`. */
const BIT_MUC_SUA_LOI = 0;

type ThongSo = {
  readonly canh: number;
  readonly oDuLieu: number;
  readonly oSuaLoi: number;
  readonly tamCanChinh: readonly number[];
};

/** Thông số từng phiên bản ở mức sửa lỗi M. Một khối dữ liệu duy nhất — nên không phải đan xen. */
const THONG_SO: Readonly<Record<number, ThongSo>> = {
  1: { canh: 21, oDuLieu: 16, oSuaLoi: 10, tamCanChinh: [] },
  2: { canh: 25, oDuLieu: 28, oSuaLoi: 16, tamCanChinh: [6, 18] },
  3: { canh: 29, oDuLieu: 44, oSuaLoi: 26, tamCanChinh: [6, 22] },
};

const PHIEN_BAN_LON_NHAT = 3;

/* ── Trường Galois GF(256) cho Reed–Solomon ──────────────────────────────── */

const MU: number[] = new Array(256).fill(0);
const LOG: number[] = new Array(256).fill(0);
{
  let x = 1;
  for (let i = 0; i < 255; i += 1) {
    MU[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d; // đa thức nguyên thuỷ của QR
  }
  MU[255] = MU[0];
}

function nhanGf(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return MU[(LOG[a] + LOG[b]) % 255];
}

/**
 * Đa thức sinh bậc `bac`: tích của (x − 2^i), hệ số BẬC CAO ĐỨNG TRƯỚC (`da[0]` = 1).
 *
 * 🔴 Thứ tự hệ số ở đây là chỗ dễ sai nhất cả file, và cái sai đó KHÔNG LỘ RA khi thử
 * khứ hồi: viết ngược lại thì mã QR vẫn vẽ ra, vẫn đọc lại được bằng bộ giải mã của mình
 * (vì bộ giải mã có sửa lỗi đâu mà biết), chỉ có điện thoại thật là chịu. Cửa kiểm duy
 * nhất bắt được là phép thử hội chứng ở `tests/qr.test.ts`.
 *
 * Nhân `da` với (x + alpha^i): số hạng x làm dịch bậc lên một nấc ⇒ rơi vào `moi[j]`;
 * số hạng alpha^i giữ nguyên bậc ⇒ rơi vào `moi[j + 1]`.
 */
function daThucSinh(bac: number): number[] {
  let da = [1];
  for (let i = 0; i < bac; i += 1) {
    const moi = new Array<number>(da.length + 1).fill(0);
    for (let j = 0; j < da.length; j += 1) {
      moi[j] ^= da[j];
      moi[j + 1] ^= nhanGf(da[j], MU[i]);
    }
    da = moi;
  }
  return da;
}

/** Chia đa thức trên GF(256) — phần dư chính là các ô sửa lỗi. */
function oSuaLoi(duLieu: readonly number[], soO: number): number[] {
  const sinh = daThucSinh(soO);
  const du = new Array<number>(soO).fill(0);
  for (const o of duLieu) {
    const heSo = o ^ du[0];
    du.shift();
    du.push(0);
    if (heSo !== 0) for (let i = 0; i < soO; i += 1) du[i] ^= nhanGf(sinh[i + 1], heSo);
  }
  return du;
}

/* ── Đóng gói dữ liệu ────────────────────────────────────────────────────── */

function chonPhienBan(soKyTu: number): number {
  const soBit = 4 + 9 + 11 * Math.floor(soKyTu / 2) + (soKyTu % 2 ? 6 : 0);
  for (let v = 1; v <= PHIEN_BAN_LON_NHAT; v += 1) {
    if (soBit <= THONG_SO[v].oDuLieu * 8) return v;
  }
  throw new Error(
    `veLuoiQr: chuỗi ${soKyTu} ký tự vượt tầm mã QR phiên bản ${PHIEN_BAN_LON_NHAT} ` +
      `(tối đa 61 ký tự chữ-số). Không cắt bớt — nới phạm vi ở đây trước.`,
  );
}

function goiDuLieu(chuoi: string, phienBan: number): number[] {
  const bit: number[] = [];
  const them = (giaTri: number, soBit: number) => {
    for (let i = soBit - 1; i >= 0; i -= 1) bit.push((giaTri >>> i) & 1);
  };

  them(0b0010, 4); // chỉ báo chế độ chữ-số
  them(chuoi.length, 9); // số ký tự — phiên bản 1–9 dùng 9 bit

  for (let i = 0; i < chuoi.length; i += 2) {
    const a = BANG_CHU_SO.indexOf(chuoi[i]);
    if (a < 0) throw new Error(`veLuoiQr: ký tự "${chuoi[i]}" không nằm trong chế độ chữ-số`);
    if (i + 1 < chuoi.length) {
      const b = BANG_CHU_SO.indexOf(chuoi[i + 1]);
      if (b < 0) throw new Error(`veLuoiQr: ký tự "${chuoi[i + 1]}" không nằm trong chế độ chữ-số`);
      them(a * 45 + b, 11);
    } else {
      them(a, 6);
    }
  }

  const sucChua = THONG_SO[phienBan].oDuLieu * 8;
  for (let i = 0; i < 4 && bit.length < sucChua; i += 1) bit.push(0); // dấu kết thúc
  while (bit.length % 8 !== 0) bit.push(0);

  const o: number[] = [];
  for (let i = 0; i < bit.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j += 1) byte = (byte << 1) | bit[i + j];
    o.push(byte);
  }
  // Ô đệm luân phiên theo chuẩn, cho tới khi đầy phần dữ liệu.
  const DEM = [0xec, 0x11];
  for (let i = 0; o.length < THONG_SO[phienBan].oDuLieu; i += 1) o.push(DEM[i % 2]);

  return [...o, ...oSuaLoi(o, THONG_SO[phienBan].oSuaLoi)];
}

/* ── Dựng lưới ───────────────────────────────────────────────────────────── */

type Luoi = { o: boolean[][]; chucNang: boolean[][]; canh: number };

function luoiTrong(canh: number): Luoi {
  return {
    o: Array.from({ length: canh }, () => new Array<boolean>(canh).fill(false)),
    chucNang: Array.from({ length: canh }, () => new Array<boolean>(canh).fill(false)),
    canh,
  };
}

/** Đặt một ô CHỨC NĂNG (hoa tiêu, nhịp, định dạng…) — những ô này không bị mặt nạ đụng tới. */
function datChucNang(l: Luoi, cot: number, hang: number, den: boolean): void {
  if (hang < 0 || hang >= l.canh || cot < 0 || cot >= l.canh) return;
  l.o[hang][cot] = den;
  l.chucNang[hang][cot] = true;
}

function veHoaTieu(l: Luoi, cotTam: number, hangTam: number): void {
  for (let dy = -4; dy <= 4; dy += 1) {
    for (let dx = -4; dx <= 4; dx += 1) {
      const xa = Math.max(Math.abs(dx), Math.abs(dy));
      datChucNang(l, cotTam + dx, hangTam + dy, xa !== 2 && xa !== 4);
    }
  }
}

function veCanChinh(l: Luoi, cotTam: number, hangTam: number): void {
  for (let dy = -2; dy <= 2; dy += 1) {
    for (let dx = -2; dx <= 2; dx += 1) {
      datChucNang(l, cotTam + dx, hangTam + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }
  }
}

function veOChucNang(l: Luoi, phienBan: number): void {
  const n = l.canh;

  // Nhịp: một hàng và một cột kẻ sọc, để máy quét dò được kích thước ô.
  for (let i = 0; i < n; i += 1) {
    datChucNang(l, 6, i, i % 2 === 0);
    datChucNang(l, i, 6, i % 2 === 0);
  }

  veHoaTieu(l, 3, 3);
  veHoaTieu(l, n - 4, 3);
  veHoaTieu(l, 3, n - 4);

  const tam = THONG_SO[phienBan].tamCanChinh;
  for (let i = 0; i < tam.length; i += 1) {
    for (let j = 0; j < tam.length; j += 1) {
      const oGocHoaTieu =
        (i === 0 && j === 0) ||
        (i === 0 && j === tam.length - 1) ||
        (i === tam.length - 1 && j === 0);
      if (!oGocHoaTieu) veCanChinh(l, tam[i], tam[j]);
    }
  }

  // Giữ chỗ cho 15 bit định dạng — ghi giá trị thật ở `veBitDinhDang()`.
  // 🔴 BỎ QUA i = 6: ô (cột 8, hàng 6) và (cột 6, hàng 8) nằm trên HÀNG/CỘT NHỊP, không
  // thuộc vùng định dạng. Giữ chỗ cả chúng là xoá trắng hai ô nhịp mà `veBitDinhDang()`
  // không bao giờ ghi đè lại — mã vẫn vẽ ra đẹp đẽ và máy quét thì chịu.
  for (let i = 0; i <= 8; i += 1) {
    if (i === 6) continue;
    datChucNang(l, 8, i, false);
    datChucNang(l, i, 8, false);
  }
  for (let i = 0; i < 8; i += 1) {
    datChucNang(l, 8, n - 1 - i, false);
    datChucNang(l, n - 1 - i, 8, false);
  }
}

/** 15 bit định dạng = 5 bit dữ liệu + 10 bit BCH, rồi XOR với mặt nạ cố định của chuẩn. */
function veBitDinhDang(l: Luoi, matNa: number): void {
  const n = l.canh;
  const duLieu = (BIT_MUC_SUA_LOI << 3) | matNa;
  let du = duLieu;
  for (let i = 0; i < 10; i += 1) du = (du << 1) ^ ((du >>> 9) * 0x537);
  const bit = ((duLieu << 10) | du) ^ 0x5412;
  const lay = (i: number) => ((bit >>> i) & 1) !== 0;

  for (let i = 0; i <= 5; i += 1) datChucNang(l, 8, i, lay(i));
  datChucNang(l, 8, 7, lay(6));
  datChucNang(l, 8, 8, lay(7));
  datChucNang(l, 7, 8, lay(8));
  for (let i = 9; i <= 14; i += 1) datChucNang(l, 14 - i, 8, lay(i));

  for (let i = 0; i <= 7; i += 1) datChucNang(l, n - 1 - i, 8, lay(i));
  for (let i = 8; i <= 14; i += 1) datChucNang(l, 8, n - 15 + i, lay(i));

  datChucNang(l, 8, n - 8, true); // ô luôn đen, theo chuẩn
}

/** Rải các ô dữ liệu theo đường ngoằn ngoèo hai cột một, từ góc dưới phải đi lên. */
function raiDuLieu(l: Luoi, o: readonly number[]): void {
  const n = l.canh;
  let i = 0;
  for (let phai = n - 1; phai >= 1; phai -= 2) {
    if (phai === 6) phai = 5; // cột 6 là nhịp, nhảy qua
    for (let doc = 0; doc < n; doc += 1) {
      for (let j = 0; j < 2; j += 1) {
        const cot = phai - j;
        const diLen = ((phai + 1) & 2) === 0;
        const hang = diLen ? n - 1 - doc : doc;
        if (!l.chucNang[hang][cot] && i < o.length * 8) {
          l.o[hang][cot] = ((o[i >>> 3] >>> (7 - (i & 7))) & 1) !== 0;
          i += 1;
        }
      }
    }
  }
}

function apMatNa(l: Luoi, matNa: number): void {
  for (let hang = 0; hang < l.canh; hang += 1) {
    for (let cot = 0; cot < l.canh; cot += 1) {
      if (l.chucNang[hang][cot]) continue;
      let dao = false;
      switch (matNa) {
        case 0: dao = (cot + hang) % 2 === 0; break;
        case 1: dao = hang % 2 === 0; break;
        case 2: dao = cot % 3 === 0; break;
        case 3: dao = (cot + hang) % 3 === 0; break;
        case 4: dao = (Math.floor(cot / 3) + Math.floor(hang / 2)) % 2 === 0; break;
        case 5: dao = ((cot * hang) % 2) + ((cot * hang) % 3) === 0; break;
        case 6: dao = (((cot * hang) % 2) + ((cot * hang) % 3)) % 2 === 0; break;
        default: dao = (((cot + hang) % 2) + ((cot * hang) % 3)) % 2 === 0; break;
      }
      if (dao) l.o[hang][cot] = !l.o[hang][cot];
    }
  }
}

const MAU_HOA_TIEU_GIA = [true, false, true, true, true, false, true];

function phatMotDay(day: readonly boolean[]): number {
  let phat = 0;

  // Luật 1: chuỗi 5 ô cùng màu trở lên.
  let dem = 1;
  for (let i = 1; i < day.length; i += 1) {
    if (day[i] === day[i - 1]) {
      dem += 1;
      if (dem === 5) phat += 3;
      else if (dem > 5) phat += 1;
    } else dem = 1;
  }

  // Luật 3: hình giống hoa tiêu kèm bốn ô trắng một bên — dễ làm máy quét nhận nhầm mốc.
  for (let i = 0; i + 10 < day.length; i += 1) {
    const hoaTieu = (tu: number) => MAU_HOA_TIEU_GIA.every((v, k) => day[tu + k] === v);
    const trang = (tu: number) => [0, 1, 2, 3].every((k) => !day[tu + k]);
    if (hoaTieu(i) && trang(i + 7)) phat += 40;
    if (trang(i) && hoaTieu(i + 4)) phat += 40;
  }

  return phat;
}

function diemPhat(l: Luoi): number {
  const n = l.canh;
  let phat = 0;

  for (let hang = 0; hang < n; hang += 1) phat += phatMotDay(l.o[hang]);
  for (let cot = 0; cot < n; cot += 1) phat += phatMotDay(l.o.map((h) => h[cot]));

  // Luật 2: mảng 2×2 cùng màu.
  for (let hang = 0; hang + 1 < n; hang += 1) {
    for (let cot = 0; cot + 1 < n; cot += 1) {
      const v = l.o[hang][cot];
      if (v === l.o[hang][cot + 1] && v === l.o[hang + 1][cot] && v === l.o[hang + 1][cot + 1]) {
        phat += 3;
      }
    }
  }

  // Luật 4: lệch khỏi tỉ lệ đen 50%.
  let den = 0;
  for (const hang of l.o) for (const o of hang) if (o) den += 1;
  const lech = Math.abs(den * 100 - n * n * 50);
  phat += Math.floor(lech / (n * n * 5)) * 10;

  return phat;
}

/**
 * Dựng lưới QR cho một chuỗi. `true` = ô đen.
 *
 * Thử cả 8 mặt nạ rồi giữ cái ít điểm phạt nhất — đúng như chuẩn đòi. Mặt nạ nào cũng
 * quét được (số hiệu của nó nằm trong bit định dạng), nhưng chọn đúng thì mã ít mảng
 * đồng màu lớn hơn, và máy quét bắt nhanh hơn trong ánh sáng xấu.
 */
export function veLuoiQr(chuoi: string): boolean[][] {
  const chu = chuoi.toUpperCase();
  const phienBan = chonPhienBan(chu.length);
  const o = goiDuLieu(chu, phienBan);

  let totNhat: Luoi | null = null;
  let phatTotNhat = Infinity;

  for (let matNa = 0; matNa < 8; matNa += 1) {
    const l = luoiTrong(THONG_SO[phienBan].canh);
    veOChucNang(l, phienBan);
    raiDuLieu(l, o);
    apMatNa(l, matNa);
    veBitDinhDang(l, matNa);

    const phat = diemPhat(l);
    if (phat < phatTotNhat) {
      phatTotNhat = phat;
      totNhat = l;
    }
  }

  return totNhat!.o;
}
