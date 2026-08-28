"use client";

import { useEffect, useState } from "react";

import { ThanhBen } from "./components/thanh-ben";
import { KhoangDisc } from "./khoang/disc";
import { KhoangNhaMinh } from "./khoang/nha-minh";
import { KhoangSoLieu } from "./khoang/so-lieu";
import { MAU } from "@config/thuong-hieu";
import type { ThanhVien } from "@modules/core/gia-dinh/kieu";
import {
  lyDoKhoHong,
  nhanNuoiNeuCan,
  type LyDoKhoHong,
} from "@modules/core/luu-tru/kho-bai";
import {
  CHU_KHO_HONG,
  KHOA_KHOANG_DANG_MO,
  KHOANG_MAC_DINH,
  chuanHoaMaKhoang,
  type MaKhoang,
} from "@config/disc-tu-dien";

export default function Trang() {
  const [khoangDangMo, datKhoang] = useState<MaKhoang>(KHOANG_MAC_DINH);
  const [khoHong, datKhoHong] = useState<LyDoKhoHong | null>(null);
  /**
   * Người trong sổ vừa được bấm *Làm bài* (12.4). `null` = vào khoang DISC theo lối cũ.
   * `cheDo: "quan-sat"` ⇒ người lớn trả lời VỀ người này, không phải người này tự làm (V1.4).
   */
  const [dangLamCho, datDangLamCho] = useState<{
    tv: ThanhVien;
    cheDo?: "quan-sat";
  } | null>(null);

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
    // Bấm tay vào mục DISC trên thanh bên = làm bài TỰ DO, không phải cho ai trong sổ.
    // Không xoá chỗ này thì người dùng thoát ra rồi vào lại vẫn bị dính người cũ.
    if (ma !== "disc") datDangLamCho(null);
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
        {khoangDangMo === "disc" && (
          // `key` đổi theo người ⇒ React dựng lại khoang từ đầu. Không có nó thì bấm
          // *Làm bài* cho người thứ hai sẽ rơi vào một khoang đang giữ trạng thái của
          // người thứ nhất, và bài về nhầm chỗ.
          <KhoangDisc
            key={`${dangLamCho?.tv.id ?? "tu-do"}:${dangLamCho?.cheDo ?? "tu-lam"}`}
            {...(dangLamCho
              ? {
                  vaoTuThanhVien: dangLamCho.tv,
                  ...(dangLamCho.cheDo ? { cheDo: dangLamCho.cheDo } : {}),
                }
              : {})}
          />
        )}
        {khoangDangMo === "lich-su" && (
          <KhoangNhaMinh
            onLamBai={(tv, cheDo) => {
              datDangLamCho({ tv, ...(cheDo ? { cheDo } : {}) });
              chon("disc");
            }}
          />
        )}
        {khoangDangMo === "so-lieu" && <KhoangSoLieu />}
      </main>
    </div>
  );
}
