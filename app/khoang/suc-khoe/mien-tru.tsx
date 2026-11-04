/**
 * KHUNG LƯU Ý / MIỄN TRỪ — nằm DƯỚI kết quả, khoanh vùng riêng (chủ dự án duyệt 03/11/2026).
 * Giọng Sata Robo, nhân văn. 🔴 Nên có luật sư/chuyên gia y tế đọc lại trước khi bật thật.
 * Thuộc TẦNG GIAO DIỆN THAM CHIẾU (ADR-004).
 */

import { CHU_SK } from "@config/suc-khoe-tu-dien";

import { LinhVatMat } from "./linh-vat";
import { DongChu } from "./tien-ich";

export function MienTru() {
  const M = CHU_SK.mienTru;
  return (
    <section
      className="sk-mien-tru"
      aria-labelledby="sk-h-mien-tru"
      data-thu="sk-mien-tru"
    >
      <header>
        <LinhVatMat />
        <h2 id="sk-h-mien-tru">{M.tieuDe}</h2>
      </header>
      <p>
        <DongChu chu={M.moDau} />
      </p>
      <div className="sk-hl">
        <DongChu chu={M.nenGap} />
      </div>
      <ol>
        {M.dieu.map((d) => (
          <li key={d}>
            <DongChu chu={d} />
          </li>
        ))}
      </ol>
      <div className="sk-chuc">{M.chuc}</div>
    </section>
  );
}
