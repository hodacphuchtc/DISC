/**
 * NẠP DỮ LIỆU MẪU DISC vào trình duyệt.  ⚠️ FILE NÀY DO MÁY SINH — đừng sửa tay.
 * Sinh lại: node tests/DATA_TEST/tao-du-lieu-mau.mjs
 *
 * Cách dùng: mở http://localhost:3000 → DevTools → Console → dán trọn file này → Enter.
 * Xong thì mở màn "Bài đã làm".
 *
 * 🔴 Toàn bộ biệt danh ở đây là BỊA. Không có dữ liệu thật của trẻ.
 */
(async () => {
  const TEN_KHO = "disc";
  const TEN_BANG = "bai-lam";
  const BAI = [
    {
      "id": "mau-disc-01",
      "boDe": "MN",
      "maTre": "Bé Bún",
      "nguoiTraLoi": "nguoi-lon",
      "batDau": "2026-08-20T02:15:00.000Z",
      "ketThuc": "2026-08-20T02:17:40.000Z",
      "traLoi": {
        "MN-D1": 5,
        "MN-D5": 1,
        "MN-D2": 5,
        "MN-D3": 4,
        "MN-D4": 4,
        "MN-I5": 3,
        "MN-I1": 4,
        "MN-I2": 4,
        "MN-I3": 3,
        "MN-I4": 2,
        "MN-S1": 3,
        "MN-S2": 3,
        "MN-S3": 2,
        "MN-S5": 4,
        "MN-S4": 2,
        "MN-C1": 4,
        "MN-C2": 3,
        "MN-C5": 3,
        "MN-C3": 2,
        "MN-C4": 2
      },
      "ketQua": {
        "hopLe": true,
        "diem": {
          "D": 90,
          "I": 55,
          "S": 35,
          "C": 45
        },
        "xepHang": [
          "D",
          "I",
          "C",
          "S"
        ],
        "kieu": {
          "loai": "don",
          "truc": "D"
        },
        "canhBao": []
      },
      "phienBanBoDe": "1.0"
    },
    {
      "id": "mau-disc-02",
      "boDe": "TH",
      "maTre": "Su Kem",
      "lop": "4",
      "nguoiTraLoi": "tre",
      "batDau": "2026-08-21T07:30:00.000Z",
      "ketThuc": "2026-08-21T07:32:40.000Z",
      "traLoi": {
        "TH-D1": 3,
        "TH-D5": 3,
        "TH-D2": 3,
        "TH-D3": 1,
        "TH-D4": 1,
        "TH-I5": 2,
        "TH-I1": 3,
        "TH-I2": 3,
        "TH-I3": 3,
        "TH-I4": 1,
        "TH-S1": 3,
        "TH-S2": 3,
        "TH-S3": 3,
        "TH-S5": 2,
        "TH-S4": 1,
        "TH-C1": 3,
        "TH-C2": 1,
        "TH-C5": 2,
        "TH-C3": 1,
        "TH-C4": 1
      },
      "ketQua": {
        "hopLe": true,
        "diem": {
          "D": 40,
          "I": 70,
          "S": 70,
          "C": 30
        },
        "xepHang": [
          "I",
          "S",
          "D",
          "C"
        ],
        "kieu": {
          "loai": "pha",
          "cap": [
            "I",
            "S"
          ]
        },
        "canhBao": []
      },
      "phienBanBoDe": "1.0"
    },
    {
      "id": "mau-disc-03",
      "boDe": "THCS",
      "maTre": "Tí Nị",
      "nguoiTraLoi": "tre",
      "batDau": "2026-08-22T12:05:00.000Z",
      "ketThuc": "2026-08-22T12:08:12.000Z",
      "traLoi": {
        "THCS-D1": 4,
        "THCS-D6": 3,
        "THCS-D2": 2,
        "THCS-D3": 2,
        "THCS-D4": 2,
        "THCS-D5": 2,
        "THCS-I6": 3,
        "THCS-I1": 4,
        "THCS-I2": 4,
        "THCS-I3": 2,
        "THCS-I4": 2,
        "THCS-I5": 2,
        "THCS-S1": 4,
        "THCS-S2": 4,
        "THCS-S3": 4,
        "THCS-S6": 3,
        "THCS-S4": 2,
        "THCS-S5": 2,
        "THCS-C1": 5,
        "THCS-C2": 5,
        "THCS-C6": 2,
        "THCS-C3": 4,
        "THCS-C4": 4,
        "THCS-C5": 3
      },
      "ketQua": {
        "hopLe": true,
        "diem": {
          "D": 37.5,
          "I": 45.8,
          "S": 54.2,
          "C": 79.2
        },
        "xepHang": [
          "C",
          "S",
          "I",
          "D"
        ],
        "kieu": {
          "loai": "don",
          "truc": "C"
        },
        "canhBao": []
      },
      "phienBanBoDe": "1.0"
    },
    {
      "id": "mau-disc-04",
      "boDe": "QS",
      "maTre": "Tí Nị",
      "tuoi": 13,
      "nguoiTraLoi": "nguoi-lon",
      "batDau": "2026-08-24T13:40:00.000Z",
      "ketThuc": "2026-08-24T13:42:08.000Z",
      "traLoi": {
        "QS-D1": 5,
        "QS-D4": 3,
        "QS-D2": 5,
        "QS-D3": 2,
        "QS-I4": 3,
        "QS-I1": 4,
        "QS-I2": 2,
        "QS-I3": 2,
        "QS-S1": 4,
        "QS-S2": 2,
        "QS-S3": 1,
        "QS-S4": 4,
        "QS-C1": 5,
        "QS-C2": 2,
        "QS-C4": 2,
        "QS-C3": 2
      },
      "ketQua": {
        "hopLe": true,
        "diem": {
          "D": 68.8,
          "I": 43.8,
          "S": 31.3,
          "C": 56.3
        },
        "xepHang": [
          "D",
          "C",
          "I",
          "S"
        ],
        "kieu": {
          "loai": "don",
          "truc": "D"
        },
        "canhBao": []
      },
      "phienBanBoDe": "1.0"
    },
    {
      "id": "mau-disc-05",
      "boDe": "PH",
      "maTre": "Mẹ Bống",
      "nguoiTraLoi": "nguoi-lon",
      "batDau": "2026-08-24T14:10:00.000Z",
      "ketThuc": "2026-08-24T14:13:12.000Z",
      "traLoi": {
        "PH-D1": 3,
        "PH-D6": 4,
        "PH-D2": 2,
        "PH-D3": 2,
        "PH-D4": 2,
        "PH-D5": 2,
        "PH-I6": 3,
        "PH-I1": 4,
        "PH-I2": 4,
        "PH-I3": 2,
        "PH-I4": 2,
        "PH-I5": 2,
        "PH-S1": 5,
        "PH-S2": 5,
        "PH-S3": 4,
        "PH-S6": 2,
        "PH-S4": 4,
        "PH-S5": 2,
        "PH-C1": 4,
        "PH-C2": 4,
        "PH-C6": 3,
        "PH-C3": 4,
        "PH-C4": 2,
        "PH-C5": 2
      },
      "ketQua": {
        "hopLe": true,
        "diem": {
          "D": 29.2,
          "I": 45.8,
          "S": 75,
          "C": 54.2
        },
        "xepHang": [
          "S",
          "C",
          "I",
          "D"
        ],
        "kieu": {
          "loai": "don",
          "truc": "S"
        },
        "canhBao": []
      },
      "phienBanBoDe": "1.0"
    },
    {
      "id": "mau-disc-06",
      "boDe": "THCS",
      "maTre": "Kem Bơ",
      "nguoiTraLoi": "tre",
      "batDau": "2026-08-25T09:20:00.000Z",
      "ketThuc": "2026-08-25T09:23:12.000Z",
      "traLoi": {
        "THCS-D1": 5,
        "THCS-D6": 3,
        "THCS-D2": 4,
        "THCS-D3": 3,
        "THCS-D4": 2,
        "THCS-D5": 2,
        "THCS-I6": 3,
        "THCS-I1": 5,
        "THCS-I2": 5,
        "THCS-I3": 2,
        "THCS-I4": 2,
        "THCS-I5": 2,
        "THCS-S1": 5,
        "THCS-S2": 4,
        "THCS-S3": 2,
        "THCS-S6": 3,
        "THCS-S4": 2,
        "THCS-S5": 2,
        "THCS-C1": 4,
        "THCS-C2": 4,
        "THCS-C6": 3,
        "THCS-C3": 4,
        "THCS-C4": 2,
        "THCS-C5": 1
      },
      "ketQua": {
        "hopLe": true,
        "diem": {
          "D": 54.2,
          "I": 54.2,
          "S": 50,
          "C": 50
        },
        "xepHang": [
          "D",
          "I",
          "S",
          "C"
        ],
        "kieu": {
          "loai": "deu"
        },
        "canhBao": []
      },
      "phienBanBoDe": "1.0"
    },
    {
      "id": "mau-disc-07",
      "boDe": "MN",
      "maTre": "Cà Rốt",
      "nguoiTraLoi": "nguoi-lon",
      "batDau": "2026-08-26T01:45:00.000Z",
      "ketThuc": "2026-08-26T01:47:40.000Z",
      "traLoi": {
        "MN-D1": 3,
        "MN-D5": 3,
        "MN-D2": 3,
        "MN-D3": 3,
        "MN-D4": 3,
        "MN-I5": 3,
        "MN-I1": 3,
        "MN-I2": 3,
        "MN-I3": 3,
        "MN-I4": 3,
        "MN-S1": 3,
        "MN-S2": 3,
        "MN-S3": 2,
        "MN-S5": 3,
        "MN-S4": 4,
        "MN-C1": 3,
        "MN-C2": 3,
        "MN-C5": 3,
        "MN-C3": 4,
        "MN-C4": 2
      },
      "ketQua": {
        "hopLe": false,
        "lyDo": "PHANG"
      },
      "phienBanBoDe": "1.0"
    },
    {
      "id": "mau-disc-08",
      "boDe": "TH",
      "maTre": "Nem Rán",
      "lop": "5",
      "nguoiTraLoi": "tre",
      "batDau": "2026-08-26T10:00:00.000Z",
      "ketThuc": "2026-08-26T10:02:40.000Z",
      "traLoi": {
        "TH-D1": 3,
        "TH-D5": 3,
        "TH-D2": 3,
        "TH-D3": 3,
        "TH-D4": 1,
        "TH-I5": 2,
        "TH-I1": 3,
        "TH-I2": 3,
        "TH-I3": 1,
        "TH-I4": 1,
        "TH-S1": 3,
        "TH-S2": 3,
        "TH-S3": 3,
        "TH-S5": 2,
        "TH-S4": 1,
        "TH-C1": 2,
        "TH-C2": 3,
        "TH-C5": 3,
        "TH-C3": 3,
        "TH-C4": 1
      },
      "ketQua": {
        "hopLe": true,
        "diem": {
          "D": 60,
          "I": 50,
          "S": 70,
          "C": 50
        },
        "xepHang": [
          "S",
          "D",
          "I",
          "C"
        ],
        "kieu": {
          "loai": "don",
          "truc": "S"
        },
        "canhBao": [
          "MOT_COT"
        ]
      },
      "phienBanBoDe": "1.0"
    }
  ];

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

  console.log("✅ Đã nạp " + BAI.length + " bài mẫu. Mở màn \"Bài đã làm\" để xem.");
  console.table(BAI.map((b) => ({ id: b.id, boDe: b.boDe, bietDanh: b.maTre })));
})();
