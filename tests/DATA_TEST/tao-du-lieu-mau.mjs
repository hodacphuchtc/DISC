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
    batDau: "2026-08-20T09:15:00+07:00",
    minhHoa: "Mầm non — nhóm D nổi rõ. Phụ huynh trả lời hộ bé.",
    truc: { D: [5, 5, 5, 4, 4], I: [4, 4, 3, 3, 2], S: [3, 3, 2, 2, 2], C: [4, 3, 3, 2, 2] },
  },
  {
    id: "02",
    boDe: "TH",
    maTre: "Su Kem",
    lop: "4",
    batDau: "2026-08-21T14:30:00+07:00",
    minhHoa: "Tiểu học tự làm, thang 3 mức — pha I-S. Thang 3 mức là chỗ thô nhất của phép đo.",
    truc: { D: [3, 3, 1, 1, 1], I: [3, 3, 3, 2, 1], S: [3, 3, 3, 1, 2], C: [3, 1, 1, 2, 1] },
  },
  {
    id: "03",
    boDe: "THCS",
    maTre: "Tí Nị",
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
    batDau: "2026-08-26T08:45:00+07:00",
    minhHoa:
      "KHÔNG HỢP LỆ — 80% câu chọn mức giữa, hàng rào HL-1 phải CHẶN và không trả kết quả.",
    truc: { D: [3, 3, 3, 3, 3], I: [3, 3, 3, 3, 3], S: [3, 3, 3, 2, 4], C: [3, 3, 3, 4, 2] },
  },
  {
    id: "08",
    boDe: "TH",
    maTre: "Nem Rán",
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
 * Repo KHÔNG có hàm nhập: `app/khoang/lich-su.tsx` chỉ có nút tải xuống, và `JSZip.loadAsync`
 * chỉ xuất hiện trong test. Nên đường nạp duy nhất là ghi thẳng vào IndexedDB.
 * Console của trình duyệt không đọc được file trên đĩa ⇒ dữ liệu phải nằm SẴN trong file js,
 * và file js phải do chính script này sinh ra thì mới không bao giờ lệch với bộ JSON.
 */
const napJs = `/**
 * NẠP DỮ LIỆU MẪU DISC vào trình duyệt.  ⚠️ FILE NÀY DO MÁY SINH — đừng sửa tay.
 * Sinh lại: node tests/DATA_TEST/tao-du-lieu-mau.mjs
 *
 * Cách dùng: mở http://localhost:3000 → DevTools → Console → dán trọn file này → Enter.
 * Xong thì mở màn "Bài đã làm".
 *
 * 🔴 Toàn bộ biệt danh ở đây là BỊA. Không có dữ liệu thật của trẻ.
 */
(async () => {
  const TEN_KHO = ${JSON.stringify("disc")};
  const TEN_BANG = ${JSON.stringify("bai-lam")};
  const BAI = ${JSON.stringify(
    tomTat.map((t) => t.bai),
    null,
    2,
  )
    .split("\n")
    .join("\n  ")};

  const db = await new Promise((ok, loi) => {
    const yc = indexedDB.open(TEN_KHO, 1);
    yc.onupgradeneeded = () => {
      const d = yc.result;
      if (!d.objectStoreNames.contains(TEN_BANG)) {
        const b = d.createObjectStore(TEN_BANG, { keyPath: "id" });
        b.createIndex("maTre", "maTre", { unique: false });
        b.createIndex("ketThuc", "ketThuc", { unique: false });
      }
    };
    yc.onsuccess = () => ok(yc.result);
    yc.onerror = () => loi(yc.error);
  });

  await new Promise((ok, loi) => {
    const gd = db.transaction(TEN_BANG, "readwrite");
    const bang = gd.objectStore(TEN_BANG);
    for (const b of BAI) bang.put(b);
    gd.oncomplete = ok;
    gd.onerror = () => loi(gd.error);
  });
  db.close();

  console.log("✅ Đã nạp " + BAI.length + " bài mẫu. Mở màn \\"Bài đã làm\\" để xem.");
  console.table(BAI.map((b) => ({ id: b.id, boDe: b.boDe, bietDanh: b.maTre })));
})();
`;
writeFileSync(new URL("tests/DATA_TEST/nap-vao-trinh-duyet.js", GOC), napJs, "utf8");

console.log(`Đã sinh ${tomTat.length} bài mẫu vào tests/DATA_TEST/bai-lam/`);
console.log(`Đã sinh bộ nạp tests/DATA_TEST/nap-vao-trinh-duyet.js\n`);
for (const t of tomTat) {
  console.log(`  ${t.boDe.padEnd(4)} ${t.maTre.padEnd(10)} ${t.moTa}`);
}
