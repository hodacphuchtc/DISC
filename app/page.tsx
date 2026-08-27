"use client";

import { useEffect, useState } from "react";

import { ThanhBen } from "./components/thanh-ben";
import { KhoangDisc } from "./khoang/disc";
import { KhoangLichSu } from "./khoang/lich-su";
import {
  KHOA_KHOANG_DANG_MO,
  KHOANG_MAC_DINH,
  chuanHoaMaKhoang,
  type MaKhoang,
} from "@config/disc-tu-dien";

export default function Trang() {
  const [khoangDangMo, datKhoang] = useState<MaKhoang>(KHOANG_MAC_DINH);

  // Đọc trong useEffect, KHÔNG đọc lúc dựng HTML tĩnh — máy chủ không có localStorage
  // nên lần dựng đầu sẽ khác lần dựng lại và React báo lệch hydration.
  useEffect(() => {
    try {
      // Đọc trạng thái CHỈ CÓ ở trình duyệt sau khi hydrate xong — đọc lúc dựng HTML
      // tĩnh thì máy chủ và trình duyệt ra hai kết quả khác nhau ⇒ lệch hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      datKhoang(chuanHoaMaKhoang(window.localStorage.getItem(KHOA_KHOANG_DANG_MO)));
    } catch {
      // Cửa sổ ẩn danh chặn localStorage — giữ khoang mặc định, trang vẫn chạy.
    }
  }, []);

  function chon(ma: MaKhoang) {
    datKhoang(ma);
    try {
      window.localStorage.setItem(KHOA_KHOANG_DANG_MO, ma);
    } catch {
      // Không nhớ được thì thôi, không được làm hỏng thao tác đang diễn ra.
    }
  }

  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <ThanhBen khoangDangMo={khoangDangMo} onChon={chon} />
      <main className="min-w-0 flex-1">
        {khoangDangMo === "disc" ? <KhoangDisc /> : <KhoangLichSu />}
      </main>
    </div>
  );
}
