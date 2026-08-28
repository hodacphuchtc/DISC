"use client";

/**
 * KHỐI "CÒN THIẾU AI" (V3.2) — đòn bẩy trực tiếp của con số `baiThuHai`.
 *
 * 🔴 ĐÂY LÀ PHẦN LÀM ĐẸP DUY NHẤT DÁM KHẲNG ĐỊNH LÀ CÓ TÁC DỤNG. Nó không đổi màu sắc hay
 * bố cục; nó đổi CÂU NÓI: từ *"cần ít nhất 2 người"* — một điều kiện kỹ thuật chẳng gợi ai
 * làm gì — thành một câu nêu ĐÍCH DANH người còn thiếu, kèm nút mời đúng người đó.
 *
 * 🔴 GHI MỐC `bamMoi` NGAY LÚC BẤM. `baiThuHai` chỉ có 0 hoặc 1, nên khi nó bằng 0 thì
 * không ai biết là *chưa ai bấm mời* hay *bấm rồi mà người kia không làm*. Hai chẩn đoán
 * ngược hẳn nhau, và không có cặp số này thì kết quả nào cũng đọc ra được thành "cần làm
 * đẹp thêm chút nữa".
 *
 * Hiện ở HAI chỗ: trên tấm bước 3 khi chưa mở được, và trên đầu bản phân tích khi vừa
 * chạy xong — đúng lúc người ta vừa thấy nó hay.
 *
 * Thuộc TẦNG GIAO DIỆN THAM CHIẾU (ADR-004).
 */

import { useState } from "react";

import { MinhHoa } from "@/app/components/nhan-vat";
import { CHU_MOI } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";
import { ghiMoc } from "@modules/core/do-phieu";

/** Nối tên thành "A, B và C" — đọc lên như người nói, không như một mảng. */
export function noiTen(ten: readonly string[]): string {
  if (ten.length <= 1) return ten[0] ?? "";
  return `${ten.slice(0, -1).join(CHU_MOI.noiGiua)}${CHU_MOI.noiCuoi}${ten.at(-1)}`;
}

export function KhoiConThieuAi({
  thieu,
  daDuNguoi,
  onLamNgay,
}: {
  /** Những người trong sổ CHƯA có hồ sơ nào. Rỗng thì khối không hiện. */
  readonly thieu: readonly { readonly id: string; readonly ten: string }[];
  /** Đã đủ người để phân tích chưa — đổi câu chữ, không đổi việc làm được. */
  readonly daDuNguoi: boolean;
  /** Cho người đó làm luôn trên máy này. Thiếu callback thì chỉ còn đường gửi link. */
  readonly onLamNgay?: (id: string) => void;
}) {
  const [dangMoi, datDangMoi] = useState<{ id: string; ten: string } | null>(null);

  if (thieu.length === 0) return null;

  const ds = noiTen(thieu.map((t) => t.ten));
  const cau = daDuNguoi
    ? CHU_MOI.themNguaCon.replace("{ds}", ds)
    : thieu.length === 1
      ? CHU_MOI.conThieuMot.replace("{ten}", ds)
      : CHU_MOI.conThieuNhieu.replace("{ds}", ds).replace("{so}", String(thieu.length));

  return (
    <section
      data-thu="con-thieu-ai"
      data-so-thieu={thieu.length}
      className="rounded-2xl border px-4 py-4"
      style={{ borderColor: MAU.camNangLuong, backgroundColor: "#FFF8F0" }}
    >
      <div className="flex items-center gap-3">
        {/* Chỉ hiện khi CHƯA đủ người: lúc đã đủ, khối này nói "thêm ai nữa cũng được" —
            một cảnh đang-chờ đặt cạnh câu đó là nói ngược lại chính nó. */}
        {!daDuNguoi && (
          <MinhHoa ma="cho-nguoi-thu-hai" mau={MAU.camNangLuong} kichThuoc={84} />
        )}
        <p
          className="flex-1 text-[15px] leading-snug font-semibold"
          style={{ color: MAU.camDamChoChu }}
        >
          {cau}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {thieu.map((t) => (
          <button
            key={t.id}
            type="button"
            data-thu="nut-moi"
            onClick={() => {
              // 🔴 Ghi mốc ở ĐÂY, không đợi tới lúc chép link: cái đáng đo là **có bao
              // nhiêu phụ huynh thật sự định rủ ai đó**, chứ không phải bao nhiêu người
              // bấm trót lọt tới cuối hộp thoại.
              ghiMoc("bamMoi", "buoc-3", new Date().toISOString());
              datDangMoi(t);
            }}
            className="min-h-[44px] rounded-xl px-4 text-[14px] font-semibold text-white"
            style={{ backgroundColor: MAU.camDamChoChu }}
          >
            {CHU_MOI.nutMoi.replace("{ten}", t.ten)}
          </button>
        ))}
      </div>

      {dangMoi && (
        <HopMoi
          ten={dangMoi.ten}
          {...(onLamNgay
            ? {
                onLamNgay: () => {
                  onLamNgay(dangMoi.id);
                  datDangMoi(null);
                },
              }
            : {})}
          onDong={() => datDangMoi(null)}
        />
      )}
    </section>
  );
}

/**
 * Hộp mời — nói rõ HAI đường, vì người dùng đang đứng trước một lựa chọn thật.
 *
 * 🔴 Không dùng mã QR ở đây. Mã mời mang một hồ sơ ĐÃ LÀM XONG đi ra; người chưa làm thì
 * chưa có gì để gói. Thứ họ cần là ĐƯỜNG DẪN. Lẫn hai chiều đó là bày ra một nút bấm vào
 * rồi chẳng dẫn tới đâu.
 */
function HopMoi({
  ten,
  onLamNgay,
  onDong,
}: {
  readonly ten: string;
  readonly onLamNgay?: () => void;
  readonly onDong: () => void;
}) {
  const [daChep, datDaChep] = useState<boolean | null>(null);

  async function chepLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      datDaChep(true);
    } catch {
      // Trình duyệt chặn clipboard (không phải bối cảnh an toàn, hoặc người dùng từ chối).
      // Nói thẳng và chỉ đường thủ công — im lặng thì họ tưởng đã chép rồi dán ra rỗng.
      datDaChep(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={CHU_MOI.hopTieuDe.replace("{ten}", ten)}
      data-thu="hop-moi"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-5">
        <h2 className="text-[17px] font-bold text-neutral-900">
          {CHU_MOI.hopTieuDe.replace("{ten}", ten)}
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-neutral-700">
          {CHU_MOI.hopThan.replaceAll("{ten}", ten)}
        </p>

        <div className="mt-5 space-y-2.5">
          <button
            type="button"
            onClick={() => void chepLink()}
            className="min-h-[44px] w-full rounded-xl px-4 text-[15px] font-semibold text-white"
            style={{ backgroundColor: MAU.timCongNghe }}
          >
            {CHU_MOI.nutChepLink}
          </button>
          {onLamNgay && (
            <button
              type="button"
              data-thu="nut-lam-ngay"
              onClick={onLamNgay}
              className="min-h-[44px] w-full rounded-xl border px-4 text-[15px] font-semibold"
              style={{ borderColor: MAU.timCongNghe, color: MAU.timCongNghe }}
            >
              {CHU_MOI.nutLamHo.replace("{ten}", ten)}
            </button>
          )}
          <button
            type="button"
            onClick={onDong}
            className="min-h-[44px] w-full rounded-xl px-4 text-[15px] text-neutral-600"
          >
            {CHU_MOI.nutDongHop}
          </button>
        </div>

        {daChep !== null && (
          <p
            role="status"
            className="mt-3 text-[14px]"
            style={{ color: daChep ? MAU.timCongNghe : MAU.camDamChoChu }}
          >
            {daChep
              ? CHU_MOI.daChepLink.replace("{ten}", ten)
              : CHU_MOI.loiChepLink}
          </p>
        )}
      </div>
    </div>
  );
}
