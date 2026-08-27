/**
 * XOÁ DỮ LIỆU MẪU DISC khỏi trình duyệt.
 *
 * Cách dùng: mở http://localhost:3000 → DevTools → Console → dán trọn file này → Enter.
 *
 * 🔴 CHỈ xoá đúng những bản ghi có id bắt đầu bằng "mau-disc-". Bài làm thật trên máy
 * KHÔNG bị đụng tới. Cố ý không dùng `clear()` — một nút "xoá sạch" đặt nhầm chỗ là cách
 * nhanh nhất để xoá mất dữ liệu của người khác.
 */
(async () => {
  const TEN_KHO = "disc";
  const TEN_BANG = "bai-lam";
  const TIEN_TO = "mau-disc-";

  const db = await new Promise((ok, loi) => {
    const yc = indexedDB.open(TEN_KHO, 1);
    yc.onsuccess = () => ok(yc.result);
    yc.onerror = () => loi(yc.error);
  });

  if (!db.objectStoreNames.contains(TEN_BANG)) {
    db.close();
    console.log("Chưa có kho bài nào trên máy — không có gì để xoá.");
    return;
  }

  const tatCa = await new Promise((ok, loi) => {
    const yc = db.transaction(TEN_BANG, "readonly").objectStore(TEN_BANG).getAll();
    yc.onsuccess = () => ok(yc.result);
    yc.onerror = () => loi(yc.error);
  });

  const canXoa = tatCa.filter((b) => typeof b.id === "string" && b.id.startsWith(TIEN_TO));
  const giuLai = tatCa.length - canXoa.length;

  if (canXoa.length === 0) {
    db.close();
    console.log(`Không có bản ghi mẫu nào. Giữ nguyên ${giuLai} bài thật.`);
    return;
  }

  await new Promise((ok, loi) => {
    const gd = db.transaction(TEN_BANG, "readwrite");
    const bang = gd.objectStore(TEN_BANG);
    for (const b of canXoa) bang.delete(b.id);
    gd.oncomplete = ok;
    gd.onerror = () => loi(gd.error);
  });
  db.close();

  console.log(`✅ Đã xoá ${canXoa.length} bài mẫu. Còn nguyên ${giuLai} bài không phải mẫu.`);
})();
