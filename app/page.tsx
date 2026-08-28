"use client";

import { useEffect, useState } from "react";

import { ThanhBen } from "./components/thanh-ben";
import { KhoangBaBuoc } from "./khoang/ba-buoc";
import { KhoangSoLieu } from "./khoang/so-lieu";
import { MAU } from "@config/thuong-hieu";
import {
  lyDoKhoHong,
  nhanNuoiNeuCan,
  type LyDoKhoHong,
} from "@modules/core/luu-tru/kho-bai";
import { CHU_KHO_HONG, THAM_SO_SO_LIEU } from "@config/disc-tu-dien";

export default function Trang() {
  const [khoHong, datKhoHong] = useState<LyDoKhoHong | null>(null);
  /**
   * 🔴 MÀN SỐ LIỆU ẨN KHỎI PHỤ HUYNH, KHÔNG XOÁ (V2.1).
   *
   * Phụ huynh không có việc gì với bộ đếm phễu. Nhưng `baiThuHai` trên màn đó là con số
   * DUY NHẤT kiểm chứng được giả định đang đỡ 9,5 ngày công của GĐ14 — *một phụ huynh sẽ
   * triệu tập được từ hai người trở lên cùng làm bài* — và giả định đó hiện có 0 quan sát
   * ủng hộ. Xoá màn đi là tự bịt mắt mình đúng lúc sắp có 30 máy thật để nhìn.
   *
   * Nên: bỏ khỏi thanh bên, giữ một cửa sau bằng tham số địa chỉ.
   */
  const [moSoLieu, datMoSoLieu] = useState(false);

  // 🔴 DI TRÚ v1 → v2 (ADR-007). Chạy LƯỜI, một lần, ở transaction thường — cố ý KHÔNG
  // làm trong `onupgradeneeded`. Xem `modules/core/luu-tru/kho-bai.ts` để biết vì sao.
  // Hàm idempotent nên lỡ chạy lại cũng không đẻ ra thành viên trùng.
  useEffect(() => {
    void nhanNuoiNeuCan(new Date().toISOString()).then(() => {
      const ly = lyDoKhoHong();
      // Chỉ nói ra chuyện tab khác đang giữ kho: hai lý do kia người dùng không sửa được
      // ở màn này, và một cảnh báo không hành động được chỉ tổ làm người ta lo.
      if (ly === "chan-boi-tab-khac") datKhoHong(ly);
    });
  }, []);

  // Đọc địa chỉ trong `useEffect`, KHÔNG đọc lúc dựng HTML tĩnh — máy chủ không có
  // `location` nên lần dựng đầu sẽ khác lần dựng lại và React báo lệch hydration.
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      datMoSoLieu(new URLSearchParams(window.location.search).get(THAM_SO_SO_LIEU) === "1");
    } catch {
      // Không đọc được địa chỉ thì cứ coi như không mở — trang vẫn chạy.
    }
  }, []);

  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <ThanhBen />
      <main className="min-w-0 flex-1">
        {khoHong && (
          <p
            role="alert"
            data-thu="kho-hong"
            className="mx-5 mt-5 rounded-xl px-4 py-3 text-[14px] leading-relaxed md:mx-12"
            style={{ backgroundColor: "#FFF4E6", color: MAU.camDamChoChu }}
          >
            {CHU_KHO_HONG[khoHong]}
          </p>
        )}
        {moSoLieu ? <KhoangSoLieu /> : <KhoangBaBuoc />}
      </main>
    </div>
  );
}
