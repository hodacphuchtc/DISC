"use client";

/**
 * Điều phối khoang DISC: M1 chọn đối tượng → M2 dặn dò → M3 làm bài → M4 kết quả.
 * Mỗi màn ở một file riêng; file này chỉ giữ trạng thái và nối chúng lại.
 */

import { useEffect, useRef, useState } from "react";

import { ManChonDoiTuong } from "./chon-doi-tuong";
import { ManKetQua } from "./ket-qua";
import { LamBai } from "./lam-bai";
import { TruocKhiBatDau } from "./truoc-khi-bat-dau";
import { ManVungLech, useDoiChieu } from "./vung-lech";
import { napBoDe } from "@modules/core/bo-de/nap";
import { PHIEN_BAN_BO_DE } from "@config/disc-cau-hoi";
import type { BoDe, KetQua, MaBoDe } from "@modules/core/bo-de/kieu";
import { docNguonTuUrl, ghiMoc } from "@modules/core/do-phieu";
import { luuBai } from "@modules/core/luu-tru/kho-bai";
import { cham } from "@modules/report/cham";

type Buoc =
  | { readonly ten: "chon" }
  | { readonly ten: "dan-do"; readonly boDe: BoDe; readonly bietDanhGoiY?: string }
  | {
      readonly ten: "lam-bai";
      readonly boDe: BoDe;
      readonly bietDanh: string;
      readonly batDau: string;
    }
  | {
      readonly ten: "ket-qua";
      readonly boDe: BoDe;
      readonly bietDanh: string;
      readonly ketQua: KetQua;
    }
  | { readonly ten: "doi-chieu"; readonly maTre: string };

/** Bộ nào do chính trẻ trả lời, bộ nào do người lớn. Dùng cho bản ghi lưu trữ. */
function nguoiTraLoiCua(ma: MaBoDe): "tre" | "nguoi-lon" {
  return ma === "TH" || ma === "THCS" ? "tre" : "nguoi-lon";
}

function maMoi(): string {
  try {
    return crypto.randomUUID();
  } catch {
    // Bối cảnh không an toàn (http) không có randomUUID — vẫn phải có mã dùng được.
    return `bai-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  }
}

export function KhoangDisc() {
  const [buoc, datBuoc] = useState<Buoc>({ ten: "chon" });
  // Đọc nguồn MỘT LẦN lúc gắn — đọc lúc dựng HTML tĩnh thì máy chủ không có location.
  const [nguon, datNguon] = useState("truc-tiep");
  // Chặn ghi đôi mốc "mở": React StrictMode gọi effect hai lần ở chế độ dev. Bản
  // production không bị, nhưng con số phễu phải đúng ở MỌI chế độ — nếu không thì
  // lúc đọc số liệu chẳng ai nhớ ra là nó đã bị nhân đôi ở đâu.
  const daGhiMoMoc = useRef(false);
  useEffect(() => {
    if (daGhiMoMoc.current) return;
    daGhiMoMoc.current = true;
    const n = docNguonTuUrl();
    // Đọc nguồn sau khi hydrate xong — đọc lúc dựng HTML tĩnh thì máy chủ không có
    // `location`. Chốt `daGhiMoMoc` ở trên khiến effect này chỉ chạy đúng một lần.
    datNguon(n);
    ghiMoc("mo", n, new Date().toISOString());
  }, []);

  /** Mã bài trong kho — để nút "Kết thúc & xoá" biết xoá cái nào (QĐ7). */
  const [idBai, datIdBai] = useState<string | null>(null);

  function xongBai(
    boDe: BoDe,
    bietDanh: string,
    batDau: string,
    traLoi: Record<string, number>,
    giay: number,
  ) {
    const ketQua = cham(boDe, traLoi, giay);
    ghiMoc("xong", nguon, new Date().toISOString());

    // 🔴 Hiện kết quả NGAY, lưu ở nền. Người vừa trả lời xong 24 câu không nên phải chờ
    // IndexedDB ghi xong mới được xem kết quả của mình — và kho có hỏng thì cũng không
    // được chặn đường đi.
    datIdBai(null);
    datBuoc({ ten: "ket-qua", boDe, bietDanh, ketQua });

    const id = maMoi();
    void luuBai({
      id,
      boDe: boDe.ma,
      maTre: bietDanh,
      nguoiTraLoi: nguoiTraLoiCua(boDe.ma),
      batDau,
      ketThuc: new Date().toISOString(),
      traLoi,
      ketQua,
      phienBanBoDe: PHIEN_BAN_BO_DE,
    }).then((daLuu) => {
      if (daLuu) datIdBai(id);
    });
  }

  switch (buoc.ten) {
    case "chon":
      return <ManChonDoiTuong onXong={(boDe) => datBuoc({ ten: "dan-do", boDe })} />;

    case "dan-do":
      return (
        <TruocKhiBatDau
          boDe={buoc.boDe}
          bietDanhGoiY={buoc.bietDanhGoiY}
          onQuayLai={() => datBuoc({ ten: "chon" })}
          onBatDau={(bietDanh) => {
            ghiMoc("batDau", nguon, new Date().toISOString());
            datBuoc({
              ten: "lam-bai",
              boDe: buoc.boDe,
              bietDanh,
              batDau: new Date().toISOString(),
            });
          }}
        />
      );

    case "lam-bai":
      return (
        <LamBai
          boDe={buoc.boDe}
          bietDanh={buoc.bietDanh}
          phienBanBoDe={PHIEN_BAN_BO_DE}
          onQuayLai={() => datBuoc({ ten: "dan-do", boDe: buoc.boDe })}
          onXong={(traLoi, giay) =>
            xongBai(buoc.boDe, buoc.bietDanh, buoc.batDau, traLoi, giay)
          }
        />
      );

    case "ket-qua":
      return (
        <ManKetQua
          boDe={buoc.boDe}
          bietDanh={buoc.bietDanh}
          ketQua={buoc.ketQua}
          idBai={idBai}
          onLamLai={() => datBuoc({ ten: "chon" })}
          onXemDoiChieu={(maTre) => datBuoc({ ten: "doi-chieu", maTre })}
          onLamBoConThieu={(ma, maTre) =>
            datBuoc({ ten: "dan-do", boDe: napBoDe(ma), bietDanhGoiY: maTre })
          }
          nguon={nguon}
        />
      );

    case "doi-chieu":
      return <ManDoiChieu maTre={buoc.maTre} datBuoc={datBuoc} />;
  }
}

/** Tách riêng vì hook phải gọi ở cấp component, không gọi trong nhánh switch. */
function ManDoiChieu({
  maTre,
  datBuoc,
}: {
  readonly maTre: string;
  readonly datBuoc: (b: Buoc) => void;
}) {
  const { ketQua } = useDoiChieu(maTre);
  if (!ketQua) return null;
  return (
    <ManVungLech
      ketQua={ketQua}
      maTre={maTre}
      onDong={() => datBuoc({ ten: "chon" })}
      onLamBo={(ma) => datBuoc({ ten: "dan-do", boDe: napBoDe(ma), bietDanhGoiY: maTre })}
    />
  );
}
