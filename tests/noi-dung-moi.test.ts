import { describe, expect, it } from "vitest";

import {
  BIEU_HIEN,
  DAC_DIEM_TRUC,
  LUA_TUOI,
  MUC_DO_RO,
  THU_TU_PHA,
} from "../config/disc-bieu-hien";
import { KHOI_DAN_NGUON } from "../config/disc-tu-dien";
import {
  BAN_KHOAN,
  LECH_PHONG_CACH,
  LOI_KHUYEN,
  MA_BAN_KHOAN,
  TU_MINH,
} from "../config/disc-loi-khuyen";
import { MA_TRUC } from "../modules/core/bo-de/kieu";

/**
 * 🔴 VÌ SAO CÓ FILE NÀY.
 *
 * `tests/dien-giai.test.ts` canh bốn luật §9.2, nhưng nguồn quét của nó là `DIEN_GIAI` và
 * chỉ `DIEN_GIAI`. Mọi chuỗi thêm vào `disc-bieu-hien.ts` và `disc-loi-khuyen.ts` sẽ
 * KHÔNG đỏ — và cũng KHÔNG được canh. Đó là lỗ hổng im lặng, đúng loại nguy hiểm nhất:
 * hàng rào trông như vẫn còn nguyên trong khi phần lớn nội dung đã đi ra ngoài nó.
 */

/** Mọi chuỗi mới, gom một chỗ. Thêm hằng mới thì phải nối vào đây. */
const MOI_VAN_BAN: readonly { readonly nguon: string; readonly chu: string }[] = [
  ...MA_TRUC.flatMap((t) =>
    LUA_TUOI.map((l) => ({ nguon: `BIEU_HIEN.${t}.${l}`, chu: BIEU_HIEN[t][l] })),
  ),
  ...MA_TRUC.flatMap((t) => [
    { nguon: `DAC_DIEM_TRUC.${t}.diemManh`, chu: DAC_DIEM_TRUC[t].diemManh },
    { nguon: `DAC_DIEM_TRUC.${t}.choCanDeY`, chu: DAC_DIEM_TRUC[t].choCanDeY },
    { nguon: `DAC_DIEM_TRUC.${t}.khiNhe`, chu: DAC_DIEM_TRUC[t].khiNhe },
    { nguon: `MUC_DO_RO.${t}`, chu: MUC_DO_RO[t] },
  ]),
  ...Object.entries(THU_TU_PHA).flatMap(([ma, k]) => [
    { nguon: `THU_TU_PHA.${ma}.tieuDe`, chu: k.tieuDe },
    { nguon: `THU_TU_PHA.${ma}.tieuDeNgan`, chu: k.tieuDeNgan },
    { nguon: `THU_TU_PHA.${ma}.than`, chu: k.than },
  ]),
  ...MA_TRUC.flatMap((t) => [
    { nguon: `LOI_KHUYEN.${t}.noiTheNao`, chu: LOI_KHUYEN[t].noiTheNao },
    ...LOI_KHUYEN[t].cauNenNoi.map((c, i) => ({ nguon: `LOI_KHUYEN.${t}.cauNenNoi[${i}]`, chu: c })),
    ...LOI_KHUYEN[t].cauNenTranh.map((c, i) => ({
      nguon: `LOI_KHUYEN.${t}.cauNenTranh[${i}]`,
      chu: c,
    })),
    { nguon: `LOI_KHUYEN.${t}.khiCangThang`, chu: LOI_KHUYEN[t].khiCangThang },
    { nguon: `LOI_KHUYEN.${t}.kyNangThem`, chu: LOI_KHUYEN[t].kyNangThem },
    { nguon: `LOI_KHUYEN.${t}.boMeChinh`, chu: LOI_KHUYEN[t].boMeChinh },
    { nguon: `LOI_KHUYEN.${t}.cungHocTheNao`, chu: LOI_KHUYEN[t].cungHocTheNao },
    { nguon: `LOI_KHUYEN.${t}.motViecToiNay`, chu: LOI_KHUYEN[t].motViecToiNay },
    { nguon: `TU_MINH.${t}.khiCangThang`, chu: TU_MINH[t].khiCangThang },
    { nguon: `TU_MINH.${t}.tapThem`, chu: TU_MINH[t].tapThem },
    { nguon: `TU_MINH.${t}.motViecToiNay`, chu: TU_MINH[t].motViecToiNay },
  ]),
  ...MA_BAN_KHOAN.flatMap((m) => [
    { nguon: `BAN_KHOAN.${m}.nhan`, chu: BAN_KHOAN[m].nhan },
    { nguon: `BAN_KHOAN.${m}.loiMoDau`, chu: BAN_KHOAN[m].loiMoDau },
  ]),
];

/**
 * `LECH_PHONG_CACH` cố ý KHÔNG nằm trong danh sách kiểm đại từ ở trên — xem khối chú thích
 * "MIỄN TRỪ CÓ CHỦ ĐÍCH" trong `disc-loi-khuyen.ts`. Nó vẫn phải qua bốn luật §9.2.
 *
 * 🔴 GĐ10 chặng 2: mỗi khoá nay có BỐN trường, và cả bốn đều phải qua §9.2. Trải phẳng ra
 * ở đây thay vì kiểm một trường — thêm trường mới mà quên trải là thêm một khối chữ không
 * cửa nào soi, đúng kiểu lỗi đã trả giá ở GĐ9.
 */
const TRUONG_LECH = ["choBoMe", "choCon", "boMeTuNhin", "thoaThuan"] as const;

const VAN_BAN_LECH = MA_TRUC.flatMap((t) =>
  (["bo-me-cao-hon", "bo-me-thap-hon"] as const).flatMap((h) =>
    TRUONG_LECH.map((f) => ({
      nguon: `LECH_PHONG_CACH.${t}.${h}.${f}`,
      chu: LECH_PHONG_CACH[t][h][f],
    })),
  ),
);

describe("🔴 luật viết nội dung §9.2 áp cho MỌI chuỗi mới", () => {
  const tatCa = [...MOI_VAN_BAN, ...VAN_BAN_LECH];

  it("KHÔNG tiên đoán nghề nghiệp", () => {
    for (const { nguon, chu } of tatCa) {
      expect(chu, nguon).not.toMatch(
        /hợp làm|nghề nghiệp|sau này làm|trở thành (lãnh đạo|kế toán|bác sĩ|kỹ sư)/iu,
      );
    }
  });

  it("KHÔNG so sánh với trẻ khác", () => {
    for (const { nguon, chu } of tatCa) {
      expect(chu, nguon).not.toMatch(/hơn \d+ ?%|so với các bạn cùng lớp|top \d/iu);
    }
  });

  it("KHÔNG gắn với học lực — được nói CÁCH học, cấm ĐOÁN năng lực", () => {
    for (const { nguon, chu } of tatCa) {
      expect(chu, nguon).not.toMatch(
        /học giỏi|học kém|điểm cao|điểm thấp|giỏi toán|giỏi văn|hợp khối|thi (được|đỗ)/iu,
      );
    }
  });

  it("KHÔNG nói bản chất kiểu 'LÀ người ...'", () => {
    for (const { nguon, chu } of tatCa) {
      expect(chu, nguon).not.toMatch(
        /\b(là|LÀ) (một )?(người|đứa trẻ) (chủ động|cẩn trọng|ổn định|ảnh hưởng)/u,
      );
    }
  });
});

describe("🔴 §9.2 luật 2 — MỖI TRỤC nêu cả mặt mạnh lẫn mặt cần để ý", () => {
  /**
   * Đây chính là món đặc tả đòi từ đầu mà bản dựng đầu tiên bỏ sót: nó làm theo KIỂU nên
   * chỉ trục trội có chữ, hai ba trục còn lại — nhất là trục thấp nhất — không một dòng
   * nào, dù biểu đồ vẫn hiện đủ bốn cột kèm số.
   */
  it.each(MA_TRUC)("trục %s có đủ ba khối, không khối nào rỗng", (t) => {
    expect(DAC_DIEM_TRUC[t].diemManh.trim().length).toBeGreaterThan(30);
    expect(DAC_DIEM_TRUC[t].choCanDeY.trim().length).toBeGreaterThan(30);
    expect(DAC_DIEM_TRUC[t].khiNhe.trim().length).toBeGreaterThan(30);
  });

  it.each(MA_TRUC)("trục %s có biểu hiện cho ĐỦ bốn lứa tuổi", (t) => {
    for (const l of LUA_TUOI) {
      expect(BIEU_HIEN[t][l].trim().length, `${t}/${l}`).toBeGreaterThan(30);
    }
  });

  it("🔴 bốn lứa tuổi phải viết KHÁC nhau, không phải chép một bản", () => {
    // Bé ba tuổi và học sinh lớp chín đọc y hệt một đoạn là đúng lời chê "sơ sài".
    for (const t of MA_TRUC) {
      const rieng = new Set(LUA_TUOI.map((l) => BIEU_HIEN[t][l]));
      expect(rieng.size, `trục ${t} có lứa bị chép lại`).toBe(LUA_TUOI.length);
    }
  });
});

describe("🔴 trục NHẸ không được viết thành trục HỎNG", () => {
  /**
   * ADR-002. Khuyên "nâng trục thấp lên" là ngầm nói đứa trẻ đang thiếu. Mỗi `khiNhe` phải
   * nêu cái ĐƯỢC trước, rồi mới tới cái giá đi kèm.
   */
  it.each(MA_TRUC)("trục %s: khiNhe không dùng từ ngữ khuyết thiếu", (t) => {
    expect(DAC_DIEM_TRUC[t].khiNhe).not.toMatch(/thiếu|yếu|kém|khiếm khuyết|cần bổ sung|hạn chế của/iu);
  });

  it.each(MA_TRUC)("trục %s: khiNhe nêu cái ĐƯỢC trước cái giá", (t) => {
    const chu = DAC_DIEM_TRUC[t].khiNhe;
    const viTriGia = chu.indexOf("Cái giá đi kèm");
    expect(viTriGia, `trục ${t} thiếu vế "Cái giá đi kèm"`).toBeGreaterThan(0);
    // Phải có ít nhất một câu nói về cái được TRƯỚC khi tới vế cái giá.
    expect(chu.slice(0, viTriGia).trim().length).toBeGreaterThan(60);
  });
});

describe("🔴 linh hoạt tình huống — hai vế phải đi cùng nhau", () => {
  /**
   * Bỏ vế `boMeChinh` là biến lời khuyên thành "sửa đứa trẻ". Cặp này không được tách.
   */
  it.each(MA_TRUC)("trục %s có cả kỹ năng cho con LẪN điều bố mẹ tự chỉnh", (t) => {
    expect(LOI_KHUYEN[t].kyNangThem.trim().length).toBeGreaterThan(30);
    expect(LOI_KHUYEN[t].boMeChinh.trim().length).toBeGreaterThan(30);
  });

  it.each(MA_TRUC)("trục %s: 'một việc tối nay' đúng MỘT việc, không phải danh sách", (t) => {
    for (const chu of [LOI_KHUYEN[t].motViecToiNay, TU_MINH[t].motViecToiNay]) {
      expect(chu, `${t}: "${chu}"`).not.toMatch(/^\s*[-•]|\d\./u);
      expect(chu.length, `${t} quá dài để làm được ngay tối nay`).toBeLessThan(220);
    }
  });
});

describe("🔴 không gõ cứng đại từ chỉ người làm bài", () => {
  /**
   * Lỗi đã trả giá 27/08/2026: khối viết cho phụ huynh hỏi con bị dùng nguyên cho bộ THCS,
   * nơi người đọc là chính học sinh. Tiêu đề đổi đúng, ruột thì chưa.
   *
   * ⚠️ Tiếng Việt: "bạn" vừa là đại từ chỉ người đọc, vừa là DANH TỪ chỉ bạn bè của trẻ.
   * Nghĩa thứ hai xuất hiện khắp nơi trong mô tả hành vi ("kết bạn nhanh", "phân vai cho
   * các bạn") và hoàn toàn hợp lệ. Gỡ nghĩa danh từ ra trước khi soi, nếu không hàng rào
   * báo nhầm hàng loạt rồi người sau sẽ tắt nó đi — mất luôn cả phần canh thật.
   *
   * Nhận dạng nghĩa danh từ bằng từ đứng cạnh, không bằng cách liệt kê từng câu.
   */
  const NGOAI_LE =
    /(?:các|kết|có|ít|người|với|cho|ý|nhiều|những|mấy)\s+bạn|bạn\s+(?:bè|mới|cùng|thân)/giu;
  const DAI_TU_CAM = ["con", "bé", "em", "bạn", "cháu"];

  it.each(MOI_VAN_BAN.map((v) => [v.nguon, v.chu] as const))("%s", (nguon, chu) => {
    const sach = chu.replace(NGOAI_LE, "…");
    for (const dt of DAI_TU_CAM) {
      const re = new RegExp(`(?<!\\p{L})${dt}(?!\\p{L})`, "iu");
      expect(
        re.test(sach),
        `${nguon} gõ cứng đại từ "${dt}" trong "${chu}". Dùng {chuThe}/{ChuThe}.`,
      ).toBe(false);
    }
  });
});

describe("🔴 chốt chặn ảnh PNG — Canvas không báo lỗi khi chữ tràn khung", () => {
  /**
   * Nhan đề dài làm `thuCoChuVuaMotDong` tụt cỡ chữ rồi `ngatDongCoHan(...,3)` cắt mất,
   * và khối kết quả cao cố định nên dòng thứ ba đè lên biểu đồ. Ảnh phải dùng bản ngắn.
   * Mốc so sánh là nhan đề dài nhất mà bản hiện tại đã vẽ lọt.
   */
  const MOC = "Pha giữa Chủ động và Ảnh hưởng".length;

  it.each(Object.entries(THU_TU_PHA))("%s: tieuDeNgan không dài hơn mốc đang chạy được", (ma, k) => {
    expect(k.tieuDeNgan.length, `${ma}: "${k.tieuDeNgan}"`).toBeLessThanOrEqual(MOC);
  });

  it("tieuDeNgan luôn ngắn hơn tieuDe đầy đủ", () => {
    for (const [ma, k] of Object.entries(THU_TU_PHA)) {
      expect(k.tieuDeNgan.length, ma).toBeLessThan(k.tieuDe.length);
    }
  });
});

describe("🔴 cặp pha CÓ THỨ TỰ — sửa lỗi DI đọc y hệt ID", () => {
  it("đủ mười hai cặp có thứ tự, không phải sáu", () => {
    expect(Object.keys(THU_TU_PHA)).toHaveLength(12);
  });

  it("mọi cặp trội/phụ khác nhau đều có khoá riêng", () => {
    for (const a of MA_TRUC) {
      for (const b of MA_TRUC) {
        if (a === b) continue;
        expect(THU_TU_PHA[`${a}${b}`], `thiếu cặp ${a}${b}`).toBeDefined();
      }
    }
  });

  it("🔴 hai chiều của cùng một cặp phải viết KHÁC nhau", () => {
    for (const a of MA_TRUC) {
      for (const b of MA_TRUC) {
        if (a === b) continue;
        expect(THU_TU_PHA[`${a}${b}`].than, `${a}${b} và ${b}${a} giống nhau`).not.toBe(
          THU_TU_PHA[`${b}${a}`].than,
        );
      }
    }
  });
});

describe("băn khoăn — giọng không được thành chẩn đoán", () => {
  it.each(MA_BAN_KHOAN)("%s: lời mở đầu tự nói ra giới hạn trước", (m) => {
    expect(BAN_KHOAN[m].loiMoDau).toMatch(/không (giải thích|kết luận|đo|phán xét)|Không có/u);
  });

  it.each(MA_BAN_KHOAN)("%s: KHÔNG hứa hẹn nguyên nhân", (m) => {
    expect(BAN_KHOAN[m].loiMoDau).not.toMatch(/vì sao .* bị|nguyên nhân là|do .* gây ra/iu);
  });

  it("mọi trục liên quan đều là mã trục thật", () => {
    for (const m of MA_BAN_KHOAN) {
      for (const t of BAN_KHOAN[m].trucLienQuan) {
        expect(MA_TRUC as readonly string[]).toContain(t);
      }
    }
  });
});

/* ────────────────────────────────────────────────────────────────────────────
   12.5 — CHÚ GIẢI BỐN NHÓM + KHỐI DẪN NGUỒN
   ──────────────────────────────────────────────────────────────────────────── */

describe("🔴 12.5 — mỗi trục ĐỦ BỐN KHỐI, không trục nào thiếu", () => {
  /**
   * 🔴 Kiểm theo TRỤC, đúng danh từ mà đặc tả dùng.
   *
   * Bài học đắt nhất của GĐ9: đặc tả nói "mỗi TRỤC", bản dựng làm theo "mỗi KIỂU", test
   * kiểm "mỗi kiểu" — nên test xanh, DEMO đạt, hạng mục tick ✅, mà phụ huynh nhìn biểu
   * đồ bốn cột chỉ đọc được chữ về một nhóm, suốt bốn giai đoạn.
   */
  it.each(MA_TRUC)("trục %s có đủ bốn khối, không khối nào rỗng", (t) => {
    const d = DAC_DIEM_TRUC[t];
    for (const [ten, chu] of Object.entries({
      diemManh: d.diemManh,
      choCanDeY: d.choCanDeY,
      khiNhe: d.khiNhe,
      muonCach: d.muonCach,
    })) {
      expect(typeof chu, `${t}.${ten}`).toBe("string");
      expect(chu.trim().length, `${t}.${ten} quá ngắn`).toBeGreaterThan(60);
    }
  });

  it("🔴 bốn câu 'mượn cách' KHÁC NHAU — không trục nào bị dồn nhầm", () => {
    // Ngày 27/08 một script sửa hàng loạt đã dồn cả 8 câu vào riêng trục D vì dò khoá
    // bằng indexOf("  D: {"). Không cửa kiểm nào bắt được, vì độ dài vẫn đạt và luật
    // "không trùng giữa các TRƯỜNG" vẫn thoả. Cửa này soi chiều còn lại: giữa các KHOÁ.
    const cac = MA_TRUC.map((t) => DAC_DIEM_TRUC[t].muonCach);
    expect(new Set(cac).size).toBe(MA_TRUC.length);
  });

  it("🔴 'mượn cách' KHÔNG dùng từ khuyết thiếu — DISC không phải mô hình thiếu sót", () => {
    for (const t of MA_TRUC) {
      expect(
        DAC_DIEM_TRUC[t].muonCach,
        `trục ${t} nói về khuyết thiếu — đụng thẳng ADR-002`,
      ).not.toMatch(/thiếu|yếu|kém|khiếm khuyết|cần bổ sung|hạn chế của|khắc phục|cải thiện/iu);
    }
  });

  it("'mượn cách' viết theo khuôn TÌNH HUỐNG, không theo khuôn sửa người", () => {
    // "Có những lúc…" là cách nói rằng hoàn cảnh đổi, không phải người phải đổi.
    for (const t of MA_TRUC) {
      expect(DAC_DIEM_TRUC[t].muonCach, `trục ${t}`).toMatch(/có những lúc|những lúc đó/iu);
    }
  });
});

describe("🔴 12.5 — khối dẫn nguồn nói SỰ THẬT, kể cả sự thật khó chịu", () => {
  const CA_KHOI = KHOI_DAN_NGUON.doan.join(" ");

  it("nói rõ Marston KHÔNG tạo bài trắc nghiệm nào", () => {
    // Rất nhiều tài liệu bán hàng gộp "mô hình 1928" với "bài trắc nghiệm" để mượn uy tín
    // của một cái tên cũ hơn. Bản này tách hai chuyện đó ra.
    expect(CA_KHOI).toMatch(/Marston/u);
    expect(CA_KHOI).toMatch(/không tạo ra bài trắc nghiệm nào/iu);
    expect(CA_KHOI).toMatch(/Clarke/u);
  });

  it("🔴 nói rõ bộ câu hỏi CHƯA chuẩn hoá trên dữ liệu người Việt", () => {
    expect(CA_KHOI).toMatch(/chưa được chuẩn hoá trên dữ liệu người Việt/iu);
  });

  it("nói rõ đây là để mở một cuộc trò chuyện, không phải kết luận về ai", () => {
    expect(CA_KHOI).toMatch(/trò chuyện/iu);
    expect(CA_KHOI).toMatch(/không phải như một kết luận/iu);
  });

  it("🔴 KHÔNG có con số tin cậy hay hiệu lực nào", () => {
    // Ngày duy nhất được phép nói về độ tin cậy là ngày có 30–50 phản hồi thật chạy qua
    // scripts/phan-tich-item.mjs — và khi đó nói bằng con số của chính mình.
    expect(CA_KHOI).not.toMatch(/cronbach|alpha|α|hệ số|độ tin cậy|\br\s*=|\d+\s*%/iu);
  });

  it("🔴 KHÔNG nói 'đã được khoa học chứng minh' hay họ hàng của nó", () => {
    expect(CA_KHOI).not.toMatch(
      /khoa học chứng minh|đã được chứng minh|nghiên cứu chỉ ra|kiểm chứng khoa học|độ chính xác/iu,
    );
  });

  it("🔴 KHÔNG trích dẫn nghiên cứu nào mà người đọc không tự kiểm được", () => {
    // Một cái tên + một năm là mốc lịch sử tra được. Một "theo nghiên cứu của…" không
    // kèm gì thì người đọc không có đường nào kiểm.
    expect(CA_KHOI).not.toMatch(/theo nghiên cứu|theo một khảo sát|các nhà khoa học/iu);
  });
});
