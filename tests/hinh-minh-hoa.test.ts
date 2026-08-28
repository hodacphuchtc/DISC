/**
 * CỬA KIỂM CỦA `16.7` — hình phải có nét, và phải NẰM TRỌN TRONG KHUNG.
 *
 * 🔴 Vì sao cửa "nằm trong khung" đáng công viết. Tràn `viewBox` là lỗi chỉ lộ ra khi
 * NHÌN: SVG không báo lỗi, React không báo lỗi, test thường không báo lỗi — hình chỉ đơn
 * giản bị cắt cụt một cái tay, và nó đi thẳng ra người dùng. Dự án này đã trả giá đúng
 * kiểu đó ở GĐ9 (ảnh PNG có mảng trắng chết) và ở GĐ10 (bốn câu giống hệt nhau nối đuôi):
 * cả hai đều xanh mọi cửa cho tới lúc có người mở ảnh ra xem.
 *
 * Cửa này đo THẬT: tự tính khung bao từ nét vẽ, có tính nửa độ dày nét — vì nét được vẽ
 * lấn ra hai bên đường tâm, và một hình chạm sát mép vẫn bị xén mất một nửa nét.
 */

import { describe, expect, it } from "vitest";

import { MA_TRUC } from "../modules/core/bo-de/kieu";
import {
  KHUNG_MINH_HOA,
  KHUNG_NHAN_VAT,
  MA_MINH_HOA,
  chuoiSvgMinhHoa,
  netMinhHoa,
  netNhanVat,
  type Net,
} from "../modules/report/hinh-nhan-vat";

type Khung = { tX: number; pX: number; tY: number; pY: number };

/**
 * Đọc thuộc tính `d` của một `path` thành những điểm quyết định khung bao.
 *
 * 🔴 ĐO CHÍNH XÁC, KHÔNG LẤY MẪU. Với đường cong bậc hai (`q`/`Q`/`t`/`T` — bốn robot có
 * sẵn dùng chúng cho miệng và tay), khung bao KHÔNG phải là khung bao của ba điểm điều
 * khiển: đường cong phình ra giữa chừng. Nghiệm cực trị của một đa thức bậc hai giải được
 * bằng công thức, nên ở đây giải thẳng thay vì lấy mẫu 20 điểm rồi hy vọng.
 *
 * 🔴 Và CỐ Ý NÉM khi gặp lệnh chưa hỗ trợ (`C`, `S`, `A`). Đoán bừa khung bao là biến cửa
 * kiểm này thành một lời trấn an: nó sẽ xanh cho cả những hình nó không thật sự đo được.
 * Thà đỏ ngay hôm ai đó thêm một lệnh mới, kèm một câu nói rõ phải làm gì.
 */
const LENH_HIEU = "MmLlHhVvQqTtZz";

function cucTriBacHai(p0: number, p1: number, p2: number): number[] {
  const mau = p0 - 2 * p1 + p2;
  if (Math.abs(mau) < 1e-9) return [];
  const t = (p0 - p1) / mau;
  return t > 0 && t < 1 ? [t] : [];
}

function diemTren(p0: number, p1: number, p2: number, t: number): number {
  const m = 1 - t;
  return m * m * p0 + 2 * m * t * p1 + t * t * p2;
}

function diemCuaPath(d: string): Array<[number, number]> {
  const diem: Array<[number, number]> = [];
  let x = 0;
  let y = 0;
  let batDauX = 0;
  let batDauY = 0;
  /** Điểm điều khiển của lệnh cong trước — `t`/`T` soi gương nó. */
  let dkX = 0;
  let dkY = 0;
  let congTruoc = false;

  const khungLenh = new RegExp(`([${LENH_HIEU}])([^${LENH_HIEU}]*)`, "gu");
  // 🔴 Soi CHỮ CÁI LẠ, không soi "phần thừa sau khi cắt". Lớp ký tự phủ định
  // `[^MmLlHhVvQqTtZz]*` nuốt luôn chữ `C` của một lệnh cong bậc ba — nên cách cắt đó
  // KHÔNG bao giờ còn dư gì, và cửa kiểm im lặng đúng lúc cần nó kêu nhất.
  const laLenh = [...d].filter((c) => /[A-Za-z]/u.test(c) && !LENH_HIEU.includes(c));
  if (laLenh.length > 0) {
    throw new Error(`Lệnh path chưa hỗ trợ trong "${d}": "${[...new Set(laLenh)].join("")}".`);
  }

  const them = (nx: number, ny: number) => {
    x = nx;
    y = ny;
    diem.push([x, y]);
  };

  for (const [, lenh, thoSo] of d.matchAll(khungLenh)) {
    const so = [...thoSo.matchAll(/-?\d*\.?\d+/gu)].map((m) => Number(m[0]));
    const hoa = lenh === lenh.toUpperCase();

    if (lenh === "Z" || lenh === "z") {
      congTruoc = false;
      them(batDauX, batDauY);
      continue;
    }
    if (lenh === "H" || lenh === "h") {
      congTruoc = false;
      for (const n of so) them(hoa ? n : x + n, y);
      continue;
    }
    if (lenh === "V" || lenh === "v") {
      congTruoc = false;
      for (const n of so) them(x, hoa ? n : y + n);
      continue;
    }
    if (lenh === "Q" || lenh === "q") {
      for (let i = 0; i + 3 < so.length; i += 4) {
        const cx = hoa ? so[i] : x + so[i];
        const cy = hoa ? so[i + 1] : y + so[i + 1];
        const ex = hoa ? so[i + 2] : x + so[i + 2];
        const ey = hoa ? so[i + 3] : y + so[i + 3];
        for (const t of cucTriBacHai(x, cx, ex)) diem.push([diemTren(x, cx, ex, t), y]);
        for (const t of cucTriBacHai(y, cy, ey)) diem.push([x, diemTren(y, cy, ey, t)]);
        dkX = cx;
        dkY = cy;
        congTruoc = true;
        them(ex, ey);
      }
      continue;
    }
    if (lenh === "T" || lenh === "t") {
      for (let i = 0; i + 1 < so.length; i += 2) {
        const cx = congTruoc ? 2 * x - dkX : x;
        const cy = congTruoc ? 2 * y - dkY : y;
        const ex = hoa ? so[i] : x + so[i];
        const ey = hoa ? so[i + 1] : y + so[i + 1];
        for (const t of cucTriBacHai(x, cx, ex)) diem.push([diemTren(x, cx, ex, t), y]);
        for (const t of cucTriBacHai(y, cy, ey)) diem.push([x, diemTren(y, cy, ey, t)]);
        dkX = cx;
        dkY = cy;
        congTruoc = true;
        them(ex, ey);
      }
      continue;
    }

    // M / L và biến thể tương đối.
    congTruoc = false;
    for (let i = 0; i + 1 < so.length; i += 2) {
      const nx = hoa ? so[i] : x + so[i];
      const ny = hoa ? so[i + 1] : y + so[i + 1];
      if ((lenh === "M" || lenh === "m") && i === 0) {
        batDauX = nx;
        batDauY = ny;
      }
      them(nx, ny);
    }
  }
  return diem;
}

function khungBao(net: readonly Net[], nuaNet: number): Khung {
  let tX = Infinity;
  let pX = -Infinity;
  let tY = Infinity;
  let pY = -Infinity;
  const gom = (x: number, y: number, dem = 0) => {
    tX = Math.min(tX, x - dem - nuaNet);
    pX = Math.max(pX, x + dem + nuaNet);
    tY = Math.min(tY, y - dem - nuaNet);
    pY = Math.max(pY, y + dem + nuaNet);
  };

  for (const n of net) {
    if (n.loai === "circle") gom(n.cx, n.cy, n.r);
    else if (n.loai === "rect") {
      gom(n.x, n.y);
      gom(n.x + n.rong, n.y + n.cao);
    } else for (const [x, y] of diemCuaPath(n.d)) gom(x, y);
  }
  return { tX, pX, tY, pY };
}

describe("bộ minh hoạ mới (16.7)", () => {
  it("có đủ bốn cảnh mà bản đặc tả đòi", () => {
    expect([...MA_MINH_HOA]).toEqual([
      "moi-them-nguoi",
      "cho-nguoi-thu-hai",
      "chuc-mung",
      "huy-hieu",
    ]);
  });

  for (const ma of MA_MINH_HOA) {
    it(`"${ma}" — có nét vẽ, KHÔNG rỗng`, () => {
      const net = netMinhHoa(ma);
      expect(net.length).toBeGreaterThan(1);
      // Một hình toàn nét dài 0 vẫn "có phần tử" mà nhìn vào thì trắng trơn.
      const k = khungBao(net, 0);
      expect(k.pX - k.tX).toBeGreaterThan(20);
      expect(k.pY - k.tY).toBeGreaterThan(20);
    });

    it(`"${ma}" — nằm TRỌN trong khung khai báo, tính cả độ dày nét`, () => {
      const k = khungBao(netMinhHoa(ma), KHUNG_MINH_HOA.doDamNet / 2);
      expect(k.tX, `${ma} tràn mép trái`).toBeGreaterThanOrEqual(0);
      expect(k.tY, `${ma} tràn mép trên`).toBeGreaterThanOrEqual(0);
      expect(k.pX, `${ma} tràn mép phải`).toBeLessThanOrEqual(KHUNG_MINH_HOA.rong);
      expect(k.pY, `${ma} tràn mép dưới`).toBeLessThanOrEqual(KHUNG_MINH_HOA.cao);
    });

    it(`"${ma}" — dựng ra chuỗi SVG hợp lệ`, () => {
      const svg = chuoiSvgMinhHoa(ma, "#5B3FD6");
      expect(svg.startsWith("<svg")).toBe(true);
      expect(svg).toContain(`viewBox="0 0 ${KHUNG_MINH_HOA.rong} ${KHUNG_MINH_HOA.cao}"`);
      expect(svg).toContain("#5B3FD6");
      expect(svg.endsWith("</svg>")).toBe(true);
    });
  }
});

describe("🔴 bốn robot có sẵn cũng phải nằm trong khung của chúng", () => {
  // Cửa này chưa từng có. Bốn robot đã chạy đúng từ GĐ9, nhưng "chạy đúng" ở đây nghĩa là
  // "chưa ai thấy nó sai" — không ai từng đo. Nay đo được thì đo luôn.
  for (const truc of MA_TRUC) {
    it(`robot ${truc} nằm trọn trong khung, tính cả độ dày nét`, () => {
      const k = khungBao(netNhanVat(truc), KHUNG_NHAN_VAT.doDamNet / 2);
      expect(k.tX).toBeGreaterThanOrEqual(0);
      expect(k.tY).toBeGreaterThanOrEqual(0);
      expect(k.pX).toBeLessThanOrEqual(KHUNG_NHAN_VAT.rong);
      expect(k.pY).toBeLessThanOrEqual(KHUNG_NHAN_VAT.cao);
    });
  }
});

describe("bộ đọc path của chính cửa kiểm này", () => {
  it("đo đúng một hình vuông vẽ bằng nét thẳng", () => {
    const k = khungBao([{ loai: "path", d: "M10 10h20v20h-20z" }], 0);
    expect(k).toEqual({ tX: 10, pX: 30, tY: 10, pY: 30 });
  });

  it("🔴 đo ĐÚNG đỉnh phình của đường cong bậc hai, không lấy khung ba điểm", () => {
    // Cong từ (0,0) qua điều khiển (10,20) tới (20,0). Đỉnh thật ở y = 10, KHÔNG phải 20.
    const k = khungBao([{ loai: "path", d: "M0 0Q10 20 20 0" }], 0);
    expect(k.tX).toBe(0);
    expect(k.pX).toBe(20);
    expect(k.tY).toBe(0);
    expect(k.pY).toBeCloseTo(10, 6);
  });

  it("🔴 NÉM khi gặp lệnh chưa hỗ trợ — thà đỏ còn hơn đo bừa rồi trấn an", () => {
    expect(() => khungBao([{ loai: "path", d: "M0 0C10 10 20 20 30 30" }], 0)).toThrow(
      /chưa hỗ trợ/u,
    );
  });
});
