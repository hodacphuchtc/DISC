/**
 * VẼ TẤM ẢNH KẾT QUẢ BẰNG CANVAS 2D.
 *
 * KHÔNG thuộc tầng lõi (ADR-004) — buộc phải đụng `document` và `HTMLCanvasElement`.
 * Toàn bộ phần TÍNH TOÁN nằm ở `./do-chu.ts`, thuần và test được không cần trình duyệt.
 *
 * 🔴 BỐ CỤC ĐẢO SO VỚI BA DOC §9.1 — theo QĐ10:
 *   trên cùng là BA CÂU ĐỂ HỎI CON TỐI NAY, biểu đồ và nhân vật xuống dưới.
 *   Phụ huynh không chia sẻ thứ dán nhãn con mình; họ chia sẻ thứ khiến họ trông như
 *   một người cha mẹ tinh tế. Cách đặt này cũng hạ rủi ro dán nhãn xuống cùng lúc.
 *
 * Hai cái bẫy đã trả giá, cả hai đều IM LẶNG:
 *  1. Canvas không báo lỗi khi chữ tràn khung — vẽ tiếp ra ngoài mép, ảnh vẫn xuất ra.
 *  2. Vẽ trước khi font nạp xong thì dấu tiếng Việt rơi về font hệ thống.
 */

import { TRUC } from "@config/disc-tu-dien";
import { MAU, MAU_LOGO } from "@config/thuong-hieu";
import { MA_TRUC, type MaTruc } from "@modules/core/bo-de/kieu";

import { ngatDongCoHan, thuCoChuVuaMotDong, type DoRong } from "./do-chu";
import { KHUNG_NHAN_VAT, chuoiSvgNhanVat } from "./hinh-nhan-vat";

/** Khổ 4:5 — vừa khung Facebook và Zalo mà không bị cắt. */
export const KHO_ANH = { rong: 1080, cao: 1350 } as const;

const LE = 84;
const RONG_TRONG = KHO_ANH.rong - LE * 2;

export type NoiDungAnhKetQua = {
  readonly tieuDeCauHoi: string;
  readonly cauHoi: readonly string[];
  readonly tieuDe: string;
  readonly diem: Readonly<Record<MaTruc, number>>;
  /** Một trục (kiểu đơn), hai trục (kiểu pha), rỗng (phổ đều). */
  readonly trucNhanVat: readonly MaTruc[];
  readonly chanTrang: string;
};

export type KetQuaVe = { readonly biCat: boolean };

function doRongVoi(ctx: CanvasRenderingContext2D, font: string): DoRong {
  return (chuoi) => {
    ctx.font = font;
    return ctx.measureText(chuoi).width;
  };
}

/** Chờ font nạp xong TRƯỚC khi vẽ dòng đầu tiên. */
async function choFont(): Promise<void> {
  if (typeof document !== "undefined" && "fonts" in document) {
    await document.fonts.ready;
  }
}

/** Nạp một chuỗi SVG thành ảnh vẽ được lên Canvas. */
function napSvg(svg: string): Promise<HTMLImageElement> {
  return new Promise((giaiQuyet, tuChoi) => {
    const anh = new Image();
    anh.onload = () => giaiQuyet(anh);
    anh.onerror = () => tuChoi(new Error("Không nạp được hình nhân vật."));
    anh.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });
}

/** Lấy chuỗi font-family THẬT đang áp dụng — next/font sinh tên họ ngẫu nhiên lúc dựng. */
export function hoFontDangDung(): string {
  return getComputedStyle(document.body).fontFamily || "sans-serif";
}

export async function veAnhKetQua(
  canvas: HTMLCanvasElement,
  noiDung: NoiDungAnhKetQua,
  hoFont: string,
): Promise<{ anh: Blob; ketQua: KetQuaVe }> {
  await choFont();

  canvas.width = KHO_ANH.rong;
  canvas.height = KHO_ANH.cao;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Trình duyệt không cấp được ngữ cảnh vẽ 2D.");

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, KHO_ANH.rong, KHO_ANH.cao);
  ctx.textBaseline = "alphabetic";

  let biCat = false;
  let y = 128;

  // ── 1. Nhãn: 3 CÂU ĐỂ HỎI CON TỐI NAY ──
  ctx.font = `700 26px ${hoFont}`;
  ctx.fillStyle = MAU.camDamChoChu;
  ctx.letterSpacing = "3.5px";
  ctx.fillText(noiDung.tieuDeCauHoi.toLocaleUpperCase("vi-VN"), LE, y);
  ctx.letterSpacing = "0px";
  y += 62;

  // ── 2. Ba câu hỏi — phần được đọc nhiều nhất, nên to nhất ──
  const fontCauHoi = `600 40px ${hoFont}`;
  const fontSo = `800 34px ${hoFont}`;
  const LE_SO = 46;
  for (const [i, cau] of noiDung.cauHoi.entries()) {
    const dong = ngatDongCoHan(cau, RONG_TRONG - LE_SO, 3, doRongVoi(ctx, fontCauHoi));
    biCat ||= dong.biCat;

    ctx.font = fontSo;
    ctx.fillStyle = MAU.camDamChoChu;
    ctx.fillText(String(i + 1), LE, y);

    ctx.font = fontCauHoi;
    ctx.fillStyle = "#171717";
    for (const d of dong.dong) {
      ctx.fillText(d, LE + LE_SO, y);
      y += 50;
    }
    y += 26;
  }

  // ── 4. Nhân vật + tiêu đề kết quả ──
  // Neo khối này theo ĐÁY ảnh, không để nó trôi theo độ dài phần câu hỏi. Kiểu "phổ đều"
  // không có nhân vật; nếu để trôi thì chỗ dành cho nhân vật thành một mảng trắng chết
  // giữa ảnh, và tấm ảnh trông như bị thiếu mất thứ gì.
  const CAO_KHOI_KET_QUA = 640;
  y = Math.max(y + 40, KHO_ANH.cao - CAO_KHOI_KET_QUA);

  // Đường chia đặt NGAY TRÊN khối kết quả, không đặt ngay dưới phần câu hỏi: câu hỏi
  // ngắn hay dài thì ảnh vẫn chia làm hai nửa gọn gàng, khoảng trắng dồn vào một chỗ.
  ctx.strokeStyle = MAU.vienMo;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(LE, y - 62);
  ctx.lineTo(KHO_ANH.rong - LE, y - 62);
  ctx.stroke();

  const CO_NHAN_VAT = 150;
  let xChu = LE;
  if (noiDung.trucNhanVat.length > 0) {
    const anhNv = await Promise.all(
      noiDung.trucNhanVat.map((t) => napSvg(chuoiSvgNhanVat(t, TRUC[t].mau))),
    );
    const caoNv = (CO_NHAN_VAT / KHUNG_NHAN_VAT.rong) * KHUNG_NHAN_VAT.cao;
    anhNv.forEach((a, i) => {
      ctx.drawImage(a, LE + i * (CO_NHAN_VAT - 26), y - 18, CO_NHAN_VAT, caoNv);
    });
    xChu = LE + (anhNv.length === 1 ? CO_NHAN_VAT : CO_NHAN_VAT * 2 - 26) + 26;
  }

  const rongTieuDe = KHO_ANH.rong - LE - xChu;
  const doTheoCo = (chuoi: string, co: number) => {
    ctx.font = `800 ${co}px ${hoFont}`;
    return ctx.measureText(chuoi).width;
  };
  const co = thuCoChuVuaMotDong(noiDung.tieuDe, rongTieuDe, 46, 30, doTheoCo);
  const fontTieuDe = `800 ${co.co}px ${hoFont}`;
  const tieuDe = ngatDongCoHan(noiDung.tieuDe, rongTieuDe, 3, doRongVoi(ctx, fontTieuDe));
  biCat ||= tieuDe.biCat;

  ctx.font = fontTieuDe;
  ctx.fillStyle = "#171717";
  let yTieuDe = y + 42;
  for (const d of tieuDe.dong) {
    ctx.fillText(d, xChu, yTieuDe);
    yTieuDe += Math.round(co.co * 1.24);
  }
  y += noiDung.trucNhanVat.length > 0 ? 200 : 150;

  // ── 5. Biểu đồ bốn cột, luôn có nhãn số ──
  const fontNhan = `600 28px ${hoFont}`;
  const fontDiem = `700 28px ${hoFont}`;
  const RONG_NHAN = 190;
  const RONG_DIEM = 84;
  const RONG_THANH = RONG_TRONG - RONG_NHAN - RONG_DIEM;
  const CAO_THANH = 22;
  for (const t of MA_TRUC) {
    ctx.font = fontNhan;
    ctx.fillStyle = "#525252";
    ctx.fillText(TRUC[t].ten, LE, y + CAO_THANH - 3);

    const x = LE + RONG_NHAN;
    ctx.fillStyle = "#F0F0F0";
    ctx.beginPath();
    ctx.roundRect(x, y, RONG_THANH, CAO_THANH, CAO_THANH / 2);
    ctx.fill();

    ctx.fillStyle = TRUC[t].mau;
    ctx.beginPath();
    ctx.roundRect(
      x,
      y,
      Math.max((noiDung.diem[t] / 100) * RONG_THANH, CAO_THANH),
      CAO_THANH,
      CAO_THANH / 2,
    );
    ctx.fill();

    ctx.font = fontDiem;
    ctx.fillStyle = "#171717";
    const so = noiDung.diem[t].toFixed(0);
    const rongSo = ctx.measureText(so).width;
    ctx.fillText(so, KHO_ANH.rong - LE - rongSo, y + CAO_THANH - 3);
    y += 56;
  }

  // ── 6. Chân trang: logo + một dòng ──
  const yChan = KHO_ANH.cao - 96;
  ctx.strokeStyle = MAU.vienMo;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(LE, yChan - 56);
  ctx.lineTo(KHO_ANH.rong - LE, yChan - 56);
  ctx.stroke();

  ctx.font = `800 34px ${hoFont}`;
  ctx.fillStyle = MAU_LOGO.sata;
  ctx.fillText("SATA", LE, yChan);
  const rongSata = ctx.measureText("SATA").width;
  ctx.fillStyle = MAU_LOGO.robo;
  ctx.fillText("ROBO", LE + rongSata, yChan);

  const fontChan = `400 24px ${hoFont}`;
  const chan = ngatDongCoHan(noiDung.chanTrang, RONG_TRONG, 1, doRongVoi(ctx, fontChan));
  biCat ||= chan.biCat;
  ctx.font = fontChan;
  ctx.fillStyle = "#737373";
  if (chan.dong[0]) {
    const rongChan = ctx.measureText(chan.dong[0]).width;
    ctx.fillText(chan.dong[0], KHO_ANH.rong - LE - rongChan, yChan);
  }

  const anh = await new Promise<Blob>((giaiQuyet, tuChoi) => {
    canvas.toBlob(
      (b) => (b ? giaiQuyet(b) : tuChoi(new Error("Không dựng được ảnh PNG."))),
      "image/png",
    );
  });

  return { anh, ketQua: { biCat } };
}
