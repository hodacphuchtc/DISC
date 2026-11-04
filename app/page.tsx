"use client";

import { Suspense, lazy, useEffect, useState } from "react";

import { ThanhBen } from "./components/thanh-ben";
import { KhoangCacBuoc } from "./khoang/cac-buoc";
import { KhoangSoLieu } from "./khoang/so-lieu";
import { MAU } from "@config/thuong-hieu";
import {
  lyDoKhoHong,
  nhanNuoiNeuCan,
  type LyDoKhoHong,
} from "@modules/core/luu-tru/kho-bai";
import { CHU_KHO_HONG, THAM_SO_SO_LIEU } from "@config/disc-tu-dien";
import { MO_SUC_KHOE, THAM_SO_SUC_KHOE } from "@config/suc-khoe-nguong";

/**
 * 🔴 THẺ SỨC KHOẺ (ADR-010) — NẠP LƯỜI: chunk riêng, gói chính không phình (đang sát trần
 * 300 KB). Chỉ được nạp khi cờ `MO_SUC_KHOE` bật, hoặc khi xem thử qua `?suc-khoe=1`.
 */
const KhoangSucKhoe = lazy(() => import("./khoang/suc-khoe/khoang-suc-khoe"));

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
  /**
   * Thẻ sức khoẻ: bật bằng cờ, hoặc XEM THỬ bằng `?suc-khoe=1` trong lúc nội dung lời khuyên
   * còn là BẢN NHÁP chờ chữ ký Gói C. 🔴 Tham số địa chỉ KHÔNG phải một hàng rào bảo mật —
   * ai biết địa chỉ đều thấy; ta dựa vào chỗ nội dung nháp chưa chứa gì nguy hiểm (xem
   * `tests/so-suc-khoe.test.ts`) và vào việc chưa ai biết tới nó.
   */
  const [moSucKhoe, datMoSucKhoe] = useState(MO_SUC_KHOE);

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
      const q = new URLSearchParams(window.location.search);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      datMoSoLieu(q.get(THAM_SO_SO_LIEU) === "1");
      if (q.get(THAM_SO_SUC_KHOE) === "1") datMoSucKhoe(true);
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
        {moSoLieu ? <KhoangSoLieu /> : <KhoangCacBuoc />}
        {moSucKhoe && !moSoLieu && (
          <Suspense fallback={null}>
            <KhoangSucKhoe />
          </Suspense>
        )}
      </main>
    </div>
  );
}
