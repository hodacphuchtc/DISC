/**
 * Nghe kho đổi, rồi nạp lại.
 *
 * 🔴 VÌ SAO CÓ HOOK NÀY. Trước đây ba component (`bang-gia-dinh`, `phan-tich`, `ba-buoc`)
 * mỗi cái tự gõ lại `new BroadcastChannel(KENH_KHO)` — ba chỗ để quên, và cả ba đều mắc
 * cùng một lỗi: `BroadcastChannel` **không gửi về chính tab đã đăng tin**, nên tab người
 * dùng đang nhìn không bao giờ nghe thấy thay đổi do chính nó gây ra. Làm xong bài, bấm
 * quay lại, thẻ vẫn hiện số cũ cho tới khi bấm F5.
 *
 * `dangKyDoiKho()` ở tầng kho lo cả hai chiều — trong tab và giữa các tab — nên ở đây chỉ
 * còn đúng một việc: đăng ký lúc gắn, huỷ lúc gỡ.
 */

"use client";

import { useEffect } from "react";

import { dangKyDoiKho } from "@modules/core/luu-tru/kho-bai";

/**
 * @param napLai hàm nạp lại dữ liệu. Phải ổn định giữa các lượt vẽ (bọc `useCallback`),
 *   nếu không thì mỗi lượt vẽ là một lượt huỷ rồi đăng ký lại.
 */
export function useKhoDoi(napLai: () => void | Promise<unknown>): void {
  useEffect(() => dangKyDoiKho(() => void napLai()), [napLai]);
}
