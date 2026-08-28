"use client";

/**
 * MÀN SỐ LIỆU MÁY NÀY (11.6) — chỉ ĐỌC, không gửi đi đâu.
 *
 * 🔴 Bộ đếm phễu có từ GĐ6 mà chưa màn nào đọc nó. Phát hành xong vẫn mù y như trước khi
 * có nó — một cửa đo không ai mở thì im lặng hệt một cửa đo hỏng. Màn này mở cửa đó ra.
 *
 * Con số đáng giá nhất ở đây là **đã có từ 2 người trở lên cùng làm chưa**. Nó chính là
 * giả định đang đỡ 9,5 ngày của GĐ14, và tới hôm nay chưa có một quan sát nào ủng hộ.
 *
 * Thuộc TẦNG GIAO DIỆN THAM CHIẾU (ADR-004). Không `fetch`, không gửi, không đồng bộ —
 * đó là ràng buộc R1 và màn đo lường là chỗ dễ phá nó nhất.
 */

import { useEffect, useState } from "react";

import { CHU_MOC, CHU_PHEU_MOI, CHU_SO_LIEU } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";
import {
  MOC,
  datDuocBaiThuHai,
  demBietDanhKhacNhau,
  demTheoMoc,
  docPhieu,
  type MaMoc,
} from "@modules/core/do-phieu";
import { docTatCa } from "@modules/core/luu-tru/kho-bai";

type SoLieu = {
  readonly soBai: number;
  readonly soBietDanh: number;
  readonly datBaiThuHai: boolean;
  readonly pheu: Record<MaMoc, number>;
};

export function KhoangSoLieu() {
  const [so, datSo] = useState<SoLieu | null>(null);

  useEffect(() => {
    let conSong = true;
    void (async () => {
      const bai = await docTatCa();
      const bietDanh = bai.map((b) => b.maTre);
      if (!conSong) return;
      datSo({
        soBai: bai.length,
        soBietDanh: demBietDanhKhacNhau(bietDanh),
        datBaiThuHai: datDuocBaiThuHai(bietDanh),
        pheu: demTheoMoc(docPhieu()),
      });
    })();
    return () => {
      conSong = false;
    };
  }, []);

  return (
    <section className="max-w-2xl px-5 py-8 md:px-12 md:py-12">
      <h1 className="text-[26px] leading-[1.15] font-extrabold tracking-tight text-neutral-900">
        {CHU_SO_LIEU.tieuDe}
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">{CHU_SO_LIEU.moTa}</p>

      {so === null ? (
        <p className="mt-8 text-[15px] text-neutral-500">…</p>
      ) : (
        <>
          <dl className="mt-8 grid gap-3 sm:grid-cols-3">
            <O nhan={CHU_SO_LIEU.soBai} giaTri={String(so.soBai)} thu="so-bai" />
            <O nhan={CHU_SO_LIEU.soBietDanh} giaTri={String(so.soBietDanh)} thu="so-biet-danh" />
            <O
              nhan={CHU_SO_LIEU.datBaiThuHai}
              giaTri={so.datBaiThuHai ? CHU_SO_LIEU.daDat : CHU_SO_LIEU.chuaDat}
              thu="bai-thu-hai"
              noiBat={so.datBaiThuHai}
            />
          </dl>

          <h2 className="mt-10 text-[15px] font-semibold text-neutral-900">
            {CHU_SO_LIEU.tieuDePheu}
          </h2>
          <ul className="mt-3 space-y-1.5">
            {MOC.map((m) => (
              <li
                key={m}
                data-thu={`moc-${m}`}
                className="flex items-baseline justify-between border-b border-neutral-100 pb-1.5 text-[15px]"
              >
                <span className="text-neutral-700">{CHU_MOC[m] ?? m}</span>
                <span className="font-semibold tabular-nums text-neutral-900">{so.pheu[m]}</span>
              </li>
            ))}
          </ul>

          {/* 🔴 ĐỌC HỘ CẶP SỐ. Hai con số này chỉ có nghĩa khi đặt cạnh nhau, và cái
              nghĩa đó phải viết ra — nếu không thì người đọc tự bịa một cách hiểu, và
              cách hiểu tự bịa bao giờ cũng nghiêng về phía "làm đẹp thêm chút nữa". */}
          <section data-thu="pheu-moi" className="mt-8 rounded-xl border p-4" style={{ borderColor: MAU.vienMo }}>
            <h3 className="text-[14px] font-semibold text-neutral-900">
              {CHU_PHEU_MOI.tieuDe}
            </h3>
            <p className="mt-1.5 text-[15px] font-semibold tabular-nums" style={{ color: MAU.timCongNghe }}>
              {CHU_PHEU_MOI.dong
                .replace("{soMoi}", String(so.pheu.bamMoi))
                .replace("{soLam}", String(so.pheu.baiThuHai))}
            </p>
            <p data-thu="chan-doan" className="mt-2 text-[14px] leading-relaxed text-neutral-700">
              {so.pheu.baiThuHai > 0
                ? CHU_PHEU_MOI.daChay
                : so.pheu.bamMoi === 0
                  ? CHU_PHEU_MOI.chuaAiMoi
                  : CHU_PHEU_MOI.moiMaKhongLam}
            </p>
          </section>

          {so.soBai === 0 && (
            <p className="mt-6 text-[15px] text-neutral-600">{CHU_SO_LIEU.trong}</p>
          )}
        </>
      )}

      <p className="mt-10 text-[13px] leading-relaxed text-neutral-500">
        {CHU_SO_LIEU.nhacRiengTu}
      </p>
    </section>
  );
}

function O({
  nhan,
  giaTri,
  thu,
  noiBat = false,
}: {
  readonly nhan: string;
  readonly giaTri: string;
  readonly thu: string;
  readonly noiBat?: boolean;
}) {
  return (
    <div
      data-thu={thu}
      className="rounded-xl border p-4"
      style={{ borderColor: noiBat ? MAU.camNangLuong : MAU.vienMo }}
    >
      <dt className="text-[13px] leading-snug text-neutral-600">{nhan}</dt>
      <dd
        className="mt-1.5 text-[24px] font-bold tabular-nums"
        style={{ color: noiBat ? MAU.camDamChoChu : MAU.timCongNghe }}
      >
        {giaTri}
      </dd>
    </div>
  );
}
