"use client";

/**
 * Điều phối khoang DISC: dặn dò → làm bài → kết quả. Mỗi màn ở một file riêng; file này
 * chỉ giữ trạng thái và nối chúng lại.
 *
 * 🔴 KHÔNG CÒN MÀN "AI ĐANG CẦM MÁY?" (V2.2). Mọi bài đều thuộc một người trong sổ, và bộ
 * đề suy từ VAI + BẬC HỌC của người đó. Màn 1 tồn tại vì trước đây có lối làm bài tự do
 * không gắn với ai — mà bài tự do thì rơi vào nhóm "chưa xếp" và không bao giờ vào được
 * phân tích cả nhà, tức là đi tới một ngõ cụt.
 */

import { useEffect, useRef, useState } from "react";

import { ManKetQua } from "./ket-qua";
import { LamBai } from "./lam-bai";
import { TruocKhiBatDau } from "./truoc-khi-bat-dau";
import { ManVungLech, useDoiChieu } from "./vung-lech";
import { napBoDe } from "@modules/core/bo-de/nap";
import { CHU_THIEU_BAC } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";
import type { ThanhVien } from "@modules/core/gia-dinh/kieu";
import {
  boDeChoThanhVien,
  boDeQuanSatTheoLop,
  type MaGiaiThich,
} from "@modules/test/dinh-tuyen";
import { PHIEN_BAN_BO_DE } from "@config/disc-cau-hoi";
import type { BoDe, KetQua, MaBoDe } from "@modules/core/bo-de/kieu";
import { daGhiMoc, datDuocBaiThuHai, docNguonTuUrl, ghiMoc } from "@modules/core/do-phieu";
import { docTatCa, luuBai } from "@modules/core/luu-tru/kho-bai";
import { cham } from "@modules/report/cham";

type Buoc =
  /**
   * 🔴 KHÔNG SUY RA ĐƯỢC BỘ ĐỀ. Từ V2.2 mọi bài phải thuộc một người trong sổ, và màn
   * *"Ai đang cầm máy?"* đã bị xoá — nên không còn đường lui nào để hỏi lại vai/lớp.
   * Nhánh này chỉ xảy ra khi hồ sơ thiếu bậc học, và nó phải NÓI RA, không được trắng màn.
   */
  | { readonly ten: "khong-tuyen-duoc" }
  | {
      readonly ten: "dan-do";
      readonly boDe: BoDe;
      readonly bietDanhGoiY?: string;
      /** Vào từ thẻ thành viên (12.4) — tên đã biết, không hỏi lại. */
      readonly tenCoSan?: string;
      readonly maThanhVien?: string;
      /** Lý do bị chuyển sang bản quan sát — màn dặn dò PHẢI hiện ra (DISC_BA.md §4.2). */
      readonly giaiThich?: MaGiaiThich;
    }
  | {
      readonly ten: "lam-bai";
      readonly boDe: BoDe;
      readonly bietDanh: string;
      readonly batDau: string;
      readonly maThanhVien?: string;
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

export function KhoangDisc({
  vaoTuThanhVien,
  cheDo,
  onThoat,
}: {
  /** 🔴 BẮT BUỘC từ V2.2 — mọi bài đều thuộc một người trong sổ. */
  readonly vaoTuThanhVien: ThanhVien;
  /** `"quan-sat"` ⇒ người lớn trả lời VỀ người này (bộ QS), không phải họ tự làm (V1.4). */
  readonly cheDo?: "quan-sat";
  /** Quay về bước 2. Mọi lối lui trước đây đổ về màn 1; nay đổ về đây. */
  readonly onThoat: () => void;
}) {
  // 🔴 12.4 + V1.3 — vào bài từ THẺ THÀNH VIÊN thì bỏ luôn màn hỏi tên VÀ màn hỏi vai/lớp:
  // sổ đã biết cả ba. Định tuyến từ VAI + BẬC HỌC đã lưu; thiếu dữ kiện thì mới qua màn 1.
  const [buoc, datBuoc] = useState<Buoc>(() => {
    // Chế độ quan sát: người lớn trả lời VỀ người này. Cửa ADR-002 nằm trong
    // `boDeQuanSatTheoLop()` — mầm non và lớp 1–2 ra bộ MN, từ lớp 3 mới ra bộ QS.
    if (cheDo === "quan-sat") {
      const ma = boDeQuanSatTheoLop(vaoTuThanhVien.lop);
      return ma
        ? { ten: "dan-do", boDe: napBoDe(ma), tenCoSan: vaoTuThanhVien.ten }
        : { ten: "khong-tuyen-duoc" };
    }

    const tuyen = boDeChoThanhVien(vaoTuThanhVien.vaiTro, vaoTuThanhVien.lop);
    return tuyen
      ? {
          ten: "dan-do",
          boDe: napBoDe(tuyen.boDe),
          tenCoSan: vaoTuThanhVien.ten,
          ...(tuyen.giaiThich ? { giaiThich: tuyen.giaiThich } : {}),
        }
      : { ten: "khong-tuyen-duoc" };
  });
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

  /** Người trong sổ đang làm bài này, nếu vào từ thẻ thành viên (12.4). */
  const maThanhVienDangLam = vaoTuThanhVien.id;

  /**
   * Bậc học ghi kèm bản ghi bài.
   *
   * 🔴 Vào từ thẻ thành viên thì màn 1 không chạy, nên `boiCanh` rỗng và bản ghi bài mất
   * trường `lop` — dù sổ biết thừa. Lấy thẳng từ hồ sơ người đó. Ưu tiên bậc của thành
   * viên vì nó là sự thật mới nhất; `boiCanh` chỉ dùng cho lối vào tự do của màn 1.
   *
   * Giữ dạng CHUỖI suốt đường đi: `"mam-non"` không quy về số được, và đổi nó thành `NaN`
   * ở giữa đường đúng là cách trẻ mầm non từng bị đá khỏi luồng làm bài.
   */
  const lopGhiKem = vaoTuThanhVien.lop;

  function xongBai(
    boDe: BoDe,
    bietDanh: string,
    batDau: string,
    traLoi: Record<string, number>,
    giay: number,
    maThanhVien?: string,
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
      ...(lopGhiKem !== undefined ? { lop: lopGhiKem } : {}),
      // 🔴 Đóng dấu thành viên NGAY LÚC LƯU. Gán sau bằng cách dò tên là dựng lại đúng
      // cái mơ hồ mà sổ gia đình sinh ra để dẹp: hai người trùng tên, hoặc một người đổi
      // tên giữa chừng, là bài về nhầm chỗ mà không ai biết.
      ...(maThanhVien ? { maThanhVien } : {}),
      nguoiTraLoi: nguoiTraLoiCua(boDe.ma),
      batDau,
      ketThuc: new Date().toISOString(),
      traLoi,
      ketQua,
      phienBanBoDe: PHIEN_BAN_BO_DE,
    }).then(async (daLuu) => {
      if (daLuu) datIdBai(id);
      // 🔴 Ghi mốc SAU khi lưu xong và ĐỌC LẠI TỪ KHO, không cộng dồn trong đầu: kho là
      // nơi duy nhất biết máy này thật sự có mấy biệt danh, kể cả bài của những lần mở
      // trước. Và chỉ ghi MỘT lần — mốc này đo "đã từng đạt", không đo số lượt.
      if (daLuu && !daGhiMoc("baiThuHai")) {
        const kho = await docTatCa();
        if (datDuocBaiThuHai(kho.map((b) => b.maTre))) {
          ghiMoc("baiThuHai", nguon, new Date().toISOString());
        }
      }
    }).catch(() => {
      // 🔴 PHẢI CÓ. Đây là lời gọi kiểu bắn-rồi-quên (`void`), nên một lời từ chối bên
      // trong `.then` không ai bắt — trình duyệt ghi "unhandled rejection", và người dùng
      // vừa làm xong 20 câu thì thấy một lỗi đỏ ở màn kết quả.
      //
      // Khối `then` này có `await docTatCa()`, tức là nó CÓ THỂ từ chối (kho bị đóng giữa
      // chừng, trình duyệt chặn IndexedDB). Mất một mốc ĐO là chuyện nhỏ; làm hỏng màn
      // kết quả của người vừa làm xong bài mới là chuyện lớn. Luật của kho ghi rõ:
      // hỏng kho thì mất tính năng LƯU, không mất khả năng DÙNG.
    });
  }

  switch (buoc.ten) {
    case "khong-tuyen-duoc":
      return <KhongTuyenDuoc ten={vaoTuThanhVien.ten} onThoat={onThoat} />;

    case "dan-do":
      return (
        <TruocKhiBatDau
          boDe={buoc.boDe}
          bietDanhGoiY={buoc.bietDanhGoiY}
          tenCoSan={buoc.tenCoSan}
          giaiThich={buoc.giaiThich}
          onQuayLai={onThoat}
          onBatDau={(bietDanh) => {
            ghiMoc("batDau", nguon, new Date().toISOString());
            datBuoc({
              ten: "lam-bai",
              boDe: buoc.boDe,
              bietDanh,
              batDau: new Date().toISOString(),
              ...(maThanhVienDangLam ? { maThanhVien: maThanhVienDangLam } : {}),
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
            xongBai(buoc.boDe, buoc.bietDanh, buoc.batDau, traLoi, giay, buoc.maThanhVien)
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
          onLamLai={onThoat}
          onXemDoiChieu={(maTre) => datBuoc({ ten: "doi-chieu", maTre })}
          onLamBoConThieu={(ma, maTre) =>
            datBuoc({ ten: "dan-do", boDe: napBoDe(ma), bietDanhGoiY: maTre })
          }
        />
      );

    case "doi-chieu":
      return <ManDoiChieu maTre={buoc.maTre} datBuoc={datBuoc} onThoat={onThoat} />;
  }
}

/** Tách riêng vì hook phải gọi ở cấp component, không gọi trong nhánh switch. */
function ManDoiChieu({
  maTre,
  datBuoc,
  onThoat,
}: {
  readonly maTre: string;
  readonly datBuoc: (b: Buoc) => void;
  readonly onThoat: () => void;
}) {
  const { ketQua } = useDoiChieu(maTre);
  if (!ketQua) return null;
  return (
    <ManVungLech
      ketQua={ketQua}
      maTre={maTre}
      onDong={onThoat}
      onLamBo={(ma) => datBuoc({ ten: "dan-do", boDe: napBoDe(ma), bietDanhGoiY: maTre })}
    />
  );
}

/**
 * KHÔNG SUY RA ĐƯỢC BỘ ĐỀ CHO NGƯỜI NÀY.
 *
 * 🔴 Chỉ xảy ra với một người ĐANG ĐI HỌC mà hồ sơ chưa có bậc học. Trước V2.2, ca này rơi
 * về màn *"Ai đang cầm máy?"* và người dùng bị hỏi lại vai + lớp — thứ mà sổ lẽ ra phải
 * biết. Nay màn đó không còn, nên phải NÓI RA và chỉ đúng chỗ sửa.
 *
 * Tuyệt đối không đoán bừa một bộ đề để "cho xong": đưa nhầm một em lớp 3 vào bộ THCS là
 * bịa ra một con số mà sáu tháng sau không ai phân biệt được với số thật.
 */
function KhongTuyenDuoc({
  ten,
  onThoat,
}: {
  readonly ten: string;
  readonly onThoat: () => void;
}) {
  return (
    <section data-thu="khong-tuyen-duoc" className="max-w-2xl px-5 py-10 md:px-12 md:py-16">
      <h1 className="text-[22px] leading-snug font-extrabold text-neutral-900">
        {CHU_THIEU_BAC.tieuDe.replace("{ten}", ten)}
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-neutral-700">
        {CHU_THIEU_BAC.than.replace("{ten}", ten)}
      </p>
      <button
        type="button"
        onClick={onThoat}
        className="mt-6 min-h-[48px] rounded-xl px-5 text-[16px] font-semibold text-white"
        style={{ backgroundColor: MAU.timCongNghe }}
      >
        {CHU_THIEU_BAC.nut}
      </button>
    </section>
  );
}
