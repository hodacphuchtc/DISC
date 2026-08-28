/**
 * SINH DỮ LIỆU MẪU cho khoang DISC.
 *
 * Chạy:  node tests/DATA_TEST/tao-du-lieu-mau.mjs
 * Ra:    tests/DATA_TEST/bai-lam/*.json
 *
 * 🔴 MỌI BIỆT DANH Ở ĐÂY LÀ BỊA. Không có một mẩu dữ liệu thật nào của trẻ trong file
 * này, và cũng đừng bao giờ thay bằng dữ liệu thật — thư mục này nằm trong repo CÔNG KHAI
 * (guardrail 2 của CLAUDE.md + NĐ 13/2023).
 *
 * 🔴 `ketQua` KHÔNG được gõ tay. Nó do chính `cham()` của tầng lõi tính ra, nên đổi ngưỡng
 * trong `config/disc-nguong.ts` rồi chạy lại script này là dữ liệu mẫu tự đúng theo. Gõ tay
 * là để nó âm thầm lệch khỏi lõi ngay lần đổi ngưỡng đầu tiên.
 *
 * Cách chọn đáp án: mỗi trục khai một BỘ GIÁ TRỊ SAU-ĐẢO-CHIỀU (thang 1..mucToiDa). Câu
 * `dao: true` được quy ngược lại thành giá trị thô lúc ghi. Nhờ vậy hồ sơ luôn nhất quán
 * thuận/đảo ⇒ không dính cảnh báo MAU_THUAN ngoài ý muốn.
 */

import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";

const GOC = pathToFileURL(process.cwd() + "/");

// Node không biết alias `@config` / `@modules` của tsconfig, và ESM đòi đuôi file đầy đủ.
// Hook này dịch cả hai. (Import KIỂU thì bị xoá lúc chạy nên không cần lo.)
registerHooks({
  resolve(spec, ctx, next) {
    if (spec.startsWith("@config/") || spec.startsWith("@modules/")) {
      return { url: new URL(spec.slice(1) + ".ts", GOC).href, shortCircuit: true };
    }
    if ((spec.startsWith("./") || spec.startsWith("../")) && !/\.[a-z]+$/u.test(spec)) {
      return next(spec + ".ts", ctx);
    }
    return next(spec, ctx);
  },
});

const { cham } = await import(new URL("modules/report/cham.ts", GOC).href);
const { napBoDe, PHIEN_BAN_BO_DE } = await import(new URL("modules/core/bo-de/nap.ts", GOC).href);
const { LOP_MAM_NON } = await import(new URL("config/disc-nguong.ts", GOC).href);
const {
  TEN_KHO,
  TEN_BANG,
  BANG_THANH_VIEN,
  BANG_PHAN_TICH,
  PHIEN_BAN_KHO,
} = await import(new URL("modules/core/luu-tru/kho-bai.ts", GOC).href);

const THU_MUC = new URL("tests/DATA_TEST/bai-lam/", GOC);
const TIEN_TO_ID = "mau-disc-";
/** Giây dành cho mỗi câu — phải ≥ 2,5 nếu không muốn dính cảnh báo BAM_BUA. */
const GIAY_MOI_CAU = 8;

/* ── Tám hồ sơ mẫu ────────────────────────────────────────────────────────
 * `truc` là bộ giá trị SAU đảo chiều, đúng bằng số câu của trục trong bộ đề đó.
 * `ghiDe` ghi đè giá trị THÔ theo vị trí hiển thị (0-based) — dùng để dựng ca hỏng.
 */
const MAU = [
  {
    id: "01",
    boDe: "MN",
    maTre: "Bé Bún",
    vai: "con",
    lop: LOP_MAM_NON,
    batDau: "2026-08-20T09:15:00+07:00",
    minhHoa: "Mầm non — nhóm D nổi rõ. Phụ huynh trả lời hộ bé.",
    truc: { D: [5, 5, 5, 4, 4], I: [4, 4, 3, 3, 2], S: [3, 3, 2, 2, 2], C: [4, 3, 3, 2, 2] },
  },
  {
    id: "02",
    boDe: "TH",
    maTre: "Su Kem",
    vai: "con",
    lop: "4",
    batDau: "2026-08-21T14:30:00+07:00",
    minhHoa: "Tiểu học tự làm, thang 3 mức — pha I-S. Thang 3 mức là chỗ thô nhất của phép đo.",
    truc: { D: [3, 3, 1, 1, 1], I: [3, 3, 3, 2, 1], S: [3, 3, 3, 1, 2], C: [3, 1, 1, 2, 1] },
  },
  {
    id: "03",
    boDe: "THCS",
    maTre: "Tí Nị",
    vai: "con",
    lop: "7",
    batDau: "2026-08-22T19:05:00+07:00",
    minhHoa: "THCS tự làm — nhóm C nổi rõ. Ghép cặp vùng lệch với mẫu 04.",
    truc: {
      D: [4, 3, 2, 2, 2, 2],
      I: [4, 4, 3, 2, 2, 2],
      S: [4, 4, 4, 3, 2, 2],
      C: [5, 5, 4, 4, 4, 3],
    },
  },
  {
    id: "04",
    boDe: "QS",
    maTre: "Tí Nị",
    vai: "con",
    lop: "7",
    tuoi: 13,
    batDau: "2026-08-24T20:40:00+07:00",
    minhHoa:
      "Bố mẹ nhìn ĐÚNG đứa trẻ ở mẫu 03 — mở khoá màn Vùng lệch. Con tự thấy nhóm C, bố mẹ thấy nhóm D.",
    truc: { D: [5, 5, 3, 2], I: [4, 3, 2, 2], S: [4, 2, 2, 1], C: [5, 4, 2, 2] },
  },
  {
    id: "05",
    boDe: "PH",
    maTre: "Mẹ Bống",
    vai: "me",
    batDau: "2026-08-24T21:10:00+07:00",
    minhHoa:
      "Phụ huynh tự đánh giá — nhóm S nổi rõ. Đặt cạnh mẫu 03 (con nhóm C) để thử phần so sánh phong cách bố mẹ ↔ con.",
    truc: {
      D: [3, 2, 2, 2, 2, 2],
      I: [4, 4, 3, 2, 2, 2],
      S: [5, 5, 4, 4, 4, 2],
      C: [4, 4, 4, 3, 2, 2],
    },
  },
  {
    id: "06",
    boDe: "THCS",
    maTre: "Kem Bơ",
    vai: "con",
    lop: "8",
    batDau: "2026-08-25T16:20:00+07:00",
    minhHoa: "PHỔ ĐỀU — bốn nhóm sát nhau, không được ép nhãn. Sạch cảnh báo.",
    // Cố ý rải nhiều giá trị khác nhau: bốn trục cùng dáng thì các câu liền kề trong thứ
    // tự hiển thị dễ trùng đáp án và ăn cảnh báo MOT_COT oan (đã trả giá ở lần sinh thứ hai).
    truc: {
      D: [5, 4, 3, 3, 2, 2],
      I: [5, 5, 3, 2, 2, 2],
      S: [5, 4, 3, 2, 2, 2],
      C: [4, 4, 4, 3, 2, 1],
    },
  },
  {
    id: "07",
    boDe: "MN",
    maTre: "Cà Rốt",
    vai: "con",
    lop: LOP_MAM_NON,
    batDau: "2026-08-26T08:45:00+07:00",
    minhHoa:
      "KHÔNG HỢP LỆ — 80% câu chọn mức giữa, hàng rào HL-1 phải CHẶN và không trả kết quả.",
    truc: { D: [3, 3, 3, 3, 3], I: [3, 3, 3, 3, 3], S: [3, 3, 3, 2, 4], C: [3, 3, 3, 4, 2] },
  },
  {
    id: "08",
    boDe: "TH",
    maTre: "Nem Rán",
    vai: "con",
    lop: "5",
    batDau: "2026-08-26T17:00:00+07:00",
    minhHoa: "CẢNH BÁO MOT_COT — 9 câu liên tiếp cùng một đáp án, vẫn trả kết quả nhưng kèm cảnh báo.",
    truc: { D: [3, 3, 2, 1, 1], I: [3, 2, 1, 1, 1], S: [3, 3, 3, 2, 1], C: [2, 1, 1, 1, 1] },
    ghiDe: Array.from({ length: 9 }, (_, i) => ({ viTri: 5 + i, giaTri: 3 })),
  },
];

/** Trải bộ giá trị sau-đảo-chiều lên đúng các câu của trục, trả về map mã câu → giá trị THÔ. */
function dungTraLoi(boDe, truc) {
  const traLoi = {};
  for (const [maTruc, bo] of Object.entries(truc)) {
    const cua = boDe.cau.filter((c) => c.truc === maTruc);
    if (cua.length !== bo.length) {
      throw new Error(
        `Trục ${maTruc} của bộ ${boDe.ma} có ${cua.length} câu nhưng bộ giá trị khai ${bo.length}.`,
      );
    }
    for (const v of bo) {
      if (v < 1 || v > boDe.mucToiDa) {
        throw new Error(`Giá trị ${v} nằm ngoài thang 1..${boDe.mucToiDa} của bộ ${boDe.ma}.`);
      }
    }

    // 🔴 Câu ĐẢO phải nhận giá trị SÁT TRUNG BÌNH của trục.
    // HL-3 so trung bình câu thuận với trung bình câu đảo (đã đảo chiều). Mỗi trục ở đây
    // chỉ có 0–1 câu đảo, nên nếu câu đảo vớ phải giá trị ở rìa bộ (vd 1 trong [3,3,3,2,1])
    // thì một mình nó thành cả "trung bình câu đảo", lệch xa trung bình câu thuận và ăn
    // cảnh báo MAU_THUAN — dù hồ sơ hoàn toàn nhất quán. Đã trả giá ở lần sinh đầu tiên:
    // mẫu 02 và 04 đều đỏ vì chuyện này.
    const trungBinh = bo.reduce((a, b) => a + b, 0) / bo.length;
    const conLai = [...bo].sort((x, y) => Math.abs(x - trungBinh) - Math.abs(y - trungBinh));
    const choDao = conLai.splice(0, cua.filter((c) => c.dao).length);
    // Phần còn lại trả về đúng thứ tự đã khai, để giữ nguyên dáng phân bố.
    const choThuan = bo.filter((v) => {
      const i = conLai.indexOf(v);
      return i >= 0 ? (conLai.splice(i, 1), true) : false;
    });

    let iDao = 0;
    let iThuan = 0;
    for (const c of cua) {
      const sauDao = c.dao ? choDao[iDao++] : choThuan[iThuan++];
      traLoi[c.ma] = c.dao ? boDe.mucToiDa + 1 - sauDao : sauDao;
    }
  }
  return traLoi;
}

// Xoá bản cũ để không để lại file mồ côi khi đổi danh sách mẫu.
mkdirSync(THU_MUC, { recursive: true });
for (const f of readdirSync(THU_MUC)) {
  if (f.endsWith(".json")) unlinkSync(new URL(f, THU_MUC));
}

/* ── Suy DANH SÁCH THÀNH VIÊN từ chính tám hồ sơ mẫu (V0.3) ───────────────
 *
 * 🔴 SUY RA, KHÔNG KHAI TAY. Khai một danh sách thành viên riêng bên cạnh danh sách bài
 * là dựng nguồn sự thật thứ hai: sửa tên ở một bên rồi quên bên kia thì bài thành mồ côi,
 * và không cửa nào bắt được. Ở đây `maTre` của hồ sơ mẫu là khoá duy nhất.
 *
 * Mẫu 03 và 04 cùng là "Tí Nị" — cố ý: một bài em tự làm, một bài bố mẹ quan sát về em.
 * Hai bài đó phải về CÙNG một thành viên thì màn Vùng lệch mới ghép được cặp, và người đó
 * chạm đúng trần 2 bài mỗi người.
 */
const MOC_TAO = "2026-08-19T02:00:00.000Z";

const thanhVien = [];
for (const m of MAU) {
  if (thanhVien.some((t) => t.ten === m.maTre)) continue;
  thanhVien.push({
    id: `tv-mau-${String(thanhVien.length + 1).padStart(2, "0")}`,
    ten: m.maTre,
    vaiTro: m.vai,
    ...(m.lop ? { lop: m.lop } : {}),
    thuTu: thanhVien.length,
    taoLuc: MOC_TAO,
    suaLuc: MOC_TAO,
  });
}

const idThanhVienTheoTen = new Map(thanhVien.map((t) => [t.ten, t.id]));

// Cửa kiểm ngay tại chỗ sinh: mỗi hồ sơ mẫu phải khai `vai`, và người đi học phải có bậc.
for (const m of MAU) {
  if (!m.vai) throw new Error(`Mẫu ${m.id} (${m.maTre}) thiếu trường \`vai\`.`);
  if (m.vai === "con" && !m.lop) {
    throw new Error(`Mẫu ${m.id} (${m.maTre}) là con nhưng thiếu \`lop\` — sẽ không vào được bài.`);
  }
}

const tomTat = [];

for (const m of MAU) {
  const boDe = napBoDe(m.boDe);
  const traLoi = dungTraLoi(boDe, m.truc);

  for (const g of m.ghiDe ?? []) {
    const c = boDe.cau[g.viTri];
    if (!c) throw new Error(`Mẫu ${m.id}: vị trí ghi đè ${g.viTri} vượt số câu.`);
    traLoi[c.ma] = g.giaTri;
  }

  const giay = boDe.cau.length * GIAY_MOI_CAU;
  const batDau = new Date(m.batDau);
  const ketThuc = new Date(batDau.getTime() + giay * 1000);
  const ketQua = cham(boDe, traLoi, giay);

  const bai = {
    id: TIEN_TO_ID + m.id,
    boDe: m.boDe,
    maTre: m.maTre,
    ...(m.lop ? { lop: m.lop } : {}),
    ...(m.tuoi ? { tuoi: m.tuoi } : {}),
    // 🔴 Đóng dấu thành viên NGAY LÚC SINH. Bài không có `maThanhVien` rơi vào nhóm
    // "chưa xếp" và KHÔNG vào được phân tích cả nhà — tức là bộ mẫu sẽ không demo được
    // đúng cái màn mà sale cần cho xem.
    maThanhVien: idThanhVienTheoTen.get(m.maTre),
    nguoiTraLoi: m.boDe === "TH" || m.boDe === "THCS" ? "tre" : "nguoi-lon",
    batDau: batDau.toISOString(),
    ketThuc: ketThuc.toISOString(),
    traLoi,
    ketQua,
    phienBanBoDe: PHIEN_BAN_BO_DE,
  };

  const ten = `${m.id}-${m.boDe}-${m.maTre.normalize("NFD").replace(/[̀-ͯ]/gu, "").replace(/\s+/gu, "-").toLowerCase()}.json`;
  writeFileSync(new URL(ten, THU_MUC), JSON.stringify(bai, null, 2) + "\n", "utf8");

  const moTa = ketQua.hopLe
    ? `${ketQua.kieu.loai}${ketQua.kieu.truc ? " " + ketQua.kieu.truc : ketQua.kieu.cap ? " " + ketQua.kieu.cap.join("-") : ""}` +
      ` | ${["D", "I", "S", "C"].map((t) => `${t}=${ketQua.diem[t]}`).join(" ")}` +
      (ketQua.canhBao.length ? ` | cảnh báo: ${ketQua.canhBao.join(",")}` : "")
    : `CHẶN: ${ketQua.lyDo}`;
  tomTat.push({ ten, maTre: m.maTre, boDe: m.boDe, moTa, bai });
}
/* ── Sinh kèm bộ nạp cho trình duyệt ──────────────────────────────────────
 * Repo KHÔNG có hàm nhập: nút sao lưu chỉ tải xuống, và `JSZip.loadAsync` chỉ xuất hiện
 * trong test. Nên đường nạp duy nhất là ghi thẳng vào IndexedDB. Console của trình duyệt
 * không đọc được file trên đĩa ⇒ dữ liệu phải nằm SẴN trong file js, và file js phải do
 * chính script này sinh ra thì mới không bao giờ lệch với bộ JSON.
 *
 * 🔴 MỌI TÊN BẢNG VÀ SỐ PHIÊN BẢN ĐỀU IMPORT TỪ `kho-bai.ts`, không gõ lại.
 * Bản trước gõ cứng `open(TEN_KHO, 1)`; kho lên v2 thì bộ nạp chết lặng — mở kho v1 trên
 * một kho đã v2 là `VersionError`, lời hứa văng, và người dán vào Console chỉ thấy một
 * lỗi đỏ lạ. Nay số phiên bản đi theo kho, nên chuyện đó không lặp lại được nữa.
 */
const napJs = `/**
 * NẠP DỮ LIỆU MẪU DISC vào trình duyệt.  ⚠️ FILE NÀY DO MÁY SINH — đừng sửa tay.
 * Sinh lại: node tests/DATA_TEST/tao-du-lieu-mau.mjs
 *
 * Cách dùng: mở bản đang chạy (npm run xem-thu → http://localhost:3100)
 *            → DevTools → Console → dán trọn file này → Enter → tải lại trang.
 *
 * 🔴 TOÀN BỘ TÊN Ở ĐÂY LÀ BỊA. Không có dữ liệu thật của trẻ.
 *    Máy demo của giáo viên/sale chỉ được dùng bộ này, và bấm Xoá sạch sau mỗi lần demo.
 */
(async () => {
  const TEN_KHO = ${JSON.stringify(TEN_KHO)};
  const PHIEN_BAN_KHO = ${JSON.stringify(PHIEN_BAN_KHO)};
  const TEN_BANG = ${JSON.stringify(TEN_BANG)};
  const BANG_THANH_VIEN = ${JSON.stringify(BANG_THANH_VIEN)};
  const BANG_PHAN_TICH = ${JSON.stringify(BANG_PHAN_TICH)};

  const THANH_VIEN = ${JSON.stringify(thanhVien, null, 2).split("\n").join("\n  ")};

  const BAI = ${JSON.stringify(
    tomTat.map((t) => t.bai),
    null,
    2,
  )
    .split("\n")
    .join("\n  ")};

  const db = await new Promise((ok, loi) => {
    const yc = indexedDB.open(TEN_KHO, PHIEN_BAN_KHO);
    // Dựng đúng ba bảng như \`kho-bai.ts\` — kể cả khi máy chưa từng mở khoang DISC.
    yc.onupgradeneeded = () => {
      const d = yc.result;
      if (!d.objectStoreNames.contains(TEN_BANG)) {
        const b = d.createObjectStore(TEN_BANG, { keyPath: "id" });
        b.createIndex("maTre", "maTre", { unique: false });
        b.createIndex("ketThuc", "ketThuc", { unique: false });
      }
      const gd = yc.transaction;
      if (gd) {
        const b = gd.objectStore(TEN_BANG);
        if (!b.indexNames.contains("maThanhVien")) {
          b.createIndex("maThanhVien", "maThanhVien", { unique: false });
        }
      }
      if (!d.objectStoreNames.contains(BANG_THANH_VIEN)) {
        const b = d.createObjectStore(BANG_THANH_VIEN, { keyPath: "id" });
        b.createIndex("thuTu", "thuTu", { unique: false });
      }
      if (!d.objectStoreNames.contains(BANG_PHAN_TICH)) {
        d.createObjectStore(BANG_PHAN_TICH, { keyPath: "id" });
      }
    };
    yc.onsuccess = () => ok(yc.result);
    yc.onerror = () => loi(yc.error);
    // Tab khác đang giữ kho ở phiên bản cũ thì \`onupgradeneeded\` treo im lặng. Nói ra.
    yc.onblocked = () =>
      loi(new Error("Một tab DISC khác đang mở và giữ kho. Đóng tab đó rồi dán lại."));
  });

  const ghi = (bang, ds) =>
    new Promise((ok, loi) => {
      const gd = db.transaction(bang, "readwrite");
      const b = gd.objectStore(bang);
      for (const x of ds) b.put(x);
      gd.oncomplete = ok;
      gd.onerror = () => loi(gd.error);
    });

  await ghi(BANG_THANH_VIEN, THANH_VIEN);
  await ghi(TEN_BANG, BAI);
  db.close();

  // 🔴 Đánh dấu ĐÃ nhận nuôi: bộ mẫu đã tự gắn \`maThanhVien\` cho từng bài rồi, nên để
  // \`nhanNuoiNeuCan()\` chạy nữa là nó đẻ thêm một loạt thành viên trùng tên.
  try {
    window.localStorage.setItem("disc:da-nhan-nuoi-v2", "1");
  } catch {
    // Cửa sổ ẩn danh chặn localStorage — không sao, chỉ là có thể sinh thành viên trùng.
  }

  console.log(
    "✅ Đã nạp " + THANH_VIEN.length + " người và " + BAI.length + " bài mẫu. Tải lại trang rồi mở bước 1.",
  );
  console.table(
    BAI.map((b) => ({
      id: b.id,
      boDe: b.boDe,
      cuaAi: b.maTre,
      thanhVien: b.maThanhVien,
      hopLe: b.ketQua.hopLe,
    })),
  );
})().catch((loi) => {
  // 🔴 PHẢI CÓ. Bản trước là một IIFE async không ai bắt lỗi: mở kho hỏng thì trình duyệt
  // chỉ ghi "unhandled rejection", dòng ✅ không bao giờ in ra, và người dán nó ngồi đoán.
  console.error("🔴 Nạp dữ liệu mẫu THẤT BẠI:", loi && loi.message ? loi.message : loi);
  console.error("   Thử: đóng hết tab DISC khác, tải lại trang, rồi dán lại.");
});
`;
writeFileSync(new URL("tests/DATA_TEST/nap-vao-trinh-duyet.js", GOC), napJs, "utf8");

console.log(`Đã sinh ${tomTat.length} bài mẫu vào tests/DATA_TEST/bai-lam/`);
console.log(`Đã sinh bộ nạp tests/DATA_TEST/nap-vao-trinh-duyet.js\n`);
for (const t of tomTat) {
  console.log(`  ${t.boDe.padEnd(4)} ${t.maTre.padEnd(10)} ${t.moTa}`);
}
