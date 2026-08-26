# Quy trình làm việc với Claude Code

## Bộ handle giai đoạn (`.claude/commands/`, thêm 06/08/2026)

`/B1_y_tuong` bàn + phản biện (Plan Mode, KHÔNG code) → `/B2_lo_trinh` ghi hạng mục vào
`Plan/PLAN_<MODULE>.md` chờ DUYỆT → `/B3_thi_cong` code theo GÓI trên DB dev →
`/B4_nghiem_thu` đòi bằng chứng + bộ cổng → `/B6_xuat_ban` soat → DUYỆT → phat-hanh.
Mở/đóng phiên dùng `/mo_session` · `/dong_session` (bản TOÀN CỤC, không chép vào dự án).

Bộ chuẩn của skill `khoi-tao-du-an` có 8 handle; dự án này CỐ Ý bỏ 3: `B5_luu_code`
(đã có luật commit + `plan:chot-phien` riêng) · `B6_trien_khai` (hạ tầng xong từ lâu) ·
`reset_db` (không có Supabase local; DB dev chứa dữ liệu thật — xóa là mất thật).

## Plan Mode — bắt buộc khi

- Feature mới, task phức tạp, đụng ≥ 3 file, thay đổi schema/migration,
  thay đổi liên quan ≥ 2 module.
- Trình plan → chờ người dùng duyệt → mới thực hiện. Không "vừa plan vừa code".

## Thi công theo GÓI (cắm máy — chốt 28/07/2026)

Plan đã duyệt = duyệt CẢ GÓI. Người dùng rời máy được; máy réo (hook toàn cục) khi
thật sự cần người.

- Tự chạy liền các hạng mục TRONG plan; **mỗi hạng mục xong phải lint/test/build XANH
  mới được đi tiếp** — test xanh thay cho người duyệt từng bước.
- Tick checkbox tại Plan/PLAN_<MODULE>.md (kèm `npm run plan:tien-do`) + báo cáo 3 dòng
  từng mục (đã làm / kiểm chứng / tiếp theo) nhưng KHÔNG dừng chờ; báo cáo tổng cuối gói.
- **DỪNG BẮT BUỘC chờ duyệt khi:** commit/push GitHub · deploy · migration production ·
  ghi/xóa/vô hiệu hóa DỮ LIỆU THẬT (kể cả DB dev — đang chứa dữ liệu Teky + hồ sơ
  nhân sự) · tác động ra ngoài thư mục dự án · việc phát sinh NGOÀI phạm vi plan.
- **Thiếu key/env/dịch vụ ngoài → GOM, đừng dừng:** ghi vào mục "Chờ ngoài" trong
  TRẠNG THÁI của CLAUDE.md kèm rõ _cần gì, để làm gì_, rồi chuyển sang hạng mục khác.
  Chỉ dừng khi TẤT CẢ hạng mục còn lại đều bị chặn — khi đó in danh sách
  "cần gì để mở khóa".
- Việc chạy dài (build, e2e, quét lớn) → chạy nền, làm tiếp hạng mục khác rồi quay lại
  đọc kết quả.
- Script vặt viết bằng `node` (đã pre-approve), KHÔNG dùng `python3` (mỗi lần gọi là
  một lần bắt người dùng quay lại bấm duyệt).

## Phân định AI ĐANG CHẶN từng hạng mục — dòng `(e) chặn:` (chốt 11/08/2026)

> **Vì sao có luật này.** % của sổ tính theo NGÀY CÔNG của mọi hạng mục đã BA, **tính cả
> việc của người và việc mua ngoài**. Nên một module xong sạch phần code vẫn đọc lên như
> còn dở (SALES 42%), và CEO hỏi lại "sao chưa xong" — **ba lần trong một phiên ngày
> 11/08**. Tệ hơn: chính tôi suy từ "HR 61%" ra "HR còn hở máy" và khuyên sai, trong khi
> HR đã hết việc máy từ trước.

**Mọi hạng mục CHƯA tick phải có dòng `(e) chặn:` trong thân hạng mục**, đặt sau `(d)`:

```
- [ ] **GIA.0 — …**
  - (d) 0 ngày dev.
  - (e) chặn: NGƯỜI — 7 câu ở `docs/brd/kinh-doanh-gia-chi-tieu.md` § 7.
```

Đúng **BA nhãn**, không tự chế thêm:

- **`MÁY`** — không có gì chặn, giao là làm được ngay hôm nay.
- **`NGƯỜI`** — chờ quyết định · chữ ký · một cái TÊN · nghiệm thu phải dùng thật. 0 dòng code.
- **`NGOÀI`** — chờ mua / mở tài khoản / bên thứ ba (token, VPS, SIM, luật sư, Meta duyệt).

🔴 **NHÃN NÓI CÁI GÌ ĐANG CHẶN, KHÔNG NÓI VIỆC ĐÓ CÓ PHẢI CODE HAY KHÔNG.** `3D.1` là việc
code thuần nhưng đang chờ spike + VPS ⇒ nhãn `NGOÀI`. Phân loại theo "có phải code không"
thì con số trả lời sai đúng câu người ta hỏi: _còn việc nào giao máy làm được ngay không?_

🔴 **Thiếu dòng `(e)` ⇒ máy xếp `CHƯA PHÂN ĐỊNH`, và nó KÉO % khối máy XUỐNG có chủ đích.**
Không đoán hộ — đoán hộ là đúng bệnh `MKT.LS` (một con số chẳng ai từng quyết mà đọc lên
đầy thuyết phục). Chưa phân định thì chưa được tuyên bố "hết việc máy".

**Máy sinh ra hai thứ, không gõ tay cái nào:**

- `Plan/TIEN_DO.md` mục **`CÒN AI CHẶN`** — mỗi module một dòng: % khối MÁY + đếm 3 nhóm.
- `Plan/VIEC_CON_LAI.md` — **việc NÀO** chưa xong, nhóm theo NGƯỜI/NGOÀI/MÁY kèm lý do.

`npm run check:plan` canh cả hai (CI đỏ nếu lệch). **OVERVIEW của module chỉ TRỎ tới hai
file này, KHÔNG chép danh sách sang** — chép là dựng bản sao thứ hai, và hai bản chỉ lệch
vào đúng ngày ai đó sửa một bản.

**Khi đóng một hạng mục:** tick `[x]` và **xóa dòng `(e)`** của nó (xong rồi thì không còn
gì chặn). Khi BA hạng mục mới: viết `(e)` ngay từ đầu, đừng để lượt sau đi phân định lại.

## Ba mức đọc sổ (chống đốt token — chốt 11/08/2026)

> Sổ module đã phình (PLAN_CORE ~195KB, core/OVERVIEW ~148KB). Nạp trọn một sổ chỉ để trả
> lời một câu là đốt 30–60K token vô ích. Luật chung: **file não >30KB thì grep trước,
> Read theo khoảng (offset/limit); cần trọn file thì giao agent.**

- **Mức 1 — sửa code thường nhật trong module:** đọc OVERVIEW mục 1–4 (~1KB) +
  `grep -n "^###"` mục 7 rồi Read ĐÚNG các tiêu đề con liên quan. KHÔNG đọc trọn mục 5.
- **Mức 2 — làm tiếp hạng mục đang dở:** mức 1 + grep MÃ hạng mục trong OVERVIEW mục 5
  và trong `Plan/PLAN_<MODULE>.md`, đọc đúng khối đó.
- **Mức 3 — BA gói mới / review lớn / câu hỏi liên-module:** KHÔNG tự đọc — giao
  `researcher`/`ba-analyst` đọc trọn trong context riêng, trả tóm tắt ≤40 dòng kèm pointer.
  Cần TOÀN CẢNH nhiều file một lượt → `npm run gop:kien-truc` (repomix) cấp gói nén cho
  agent, thay 30 lượt Read lẻ. KHÔNG dùng repomix cho thi công thường nhật, KHÔNG gửi
  gói nén ra ngoài máy (PII).

## Verification Loop

- Sau mỗi thay đổi có ý nghĩa: chạy `npm run lint` / `npm test` / `npm run build` thật.
- KHÔNG xác nhận "đã xong" khi chưa có bằng chứng lệnh chạy pass.
- Test fail → hỏi root cause trước (code mới sai / test lỗi thời / fixture /
  environment / dependency), không xóa test vội.

## Session Handoff (nhịp làm việc)

| Thời điểm    | Việc phải làm                                                                                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mở session   | Đọc CLAUDE.md + OVERVIEW.md module đang làm → báo trạng thái, bước tiếp theo                                                                                              |
| Session lớn  | Vào Plan Mode lên kế hoạch phiên, chốt thứ tự ưu tiên                                                                                                                     |
| Context      | Auto-compact tự lo; phiên dài thì chủ động `/compact` ở mốc nghỉ giữa 2 hạng mục — giữ lại: kiến trúc/schema/danh sách file/quyết định. Mở lại phiên: `claude --continue` |
| Đóng session | Cập nhật mục 5-6 OVERVIEW.md module + mục TRẠNG THÁI/QUYẾT ĐỊNH của CLAUDE.md                                                                                             |

## Sub-agents (5 agent trong .claude/agents/)

- Dùng cho việc "đào bới": đọc nhiều file, log dài, review kiến trúc, draft BRD.
- Main session chỉ nhận kết luận theo khung: Objective / Files inspected /
  Key findings / Risks / Recommendation / Next steps.
- KHÔNG dùng subagent cho việc sửa 1 dòng.

## Git + DEV SONG SONG nhiều session

> Viết lại 11/08/2026 — thay dòng worktree cũ từng mâu thuẫn với memory
> `nhieu-session-song-song-mot-repo`.

**Bản đồ tuyến:** `npm run plan:phu-thuoc` in LỚP 0 (song song được ngay, nhóm
MÁY/NGƯỜI/NGOÀI) → LỚP n → gợi ý phân tuyến. Nguồn quan hệ = dòng `(f)` của hạng mục.

- **1 session = 1 module = 1 worktree = 1 nhánh** (`git worktree add ../disc-<mod>
-b goi/<mod>-<ten>`). Session nhánh CHỈ ghi: `modules/<X>/**`, route của X, test của X.
- **File DÙNG CHUNG chỉ SESSION CHỦ đụng:** CLAUDE.md · Plan/* · config/ · scripts/
  chung · `modules/core/**` · `database/migrations/`. Trước khi đụng: kiểm
  `ps aux | grep claude`, có phiên khác thì HỎI người dùng.
- 🔴 **Session nhánh KHÔNG tick sổ, KHÔNG chạy `plan:tien-do`** — tick 1 ô là ghi vào
  `Plan/PLAN.md` gộp ⇒ conflict chắc chắn + `check:plan` đỏ chéo (đã đo). Tick = "ĐÃ
  KIỂM CHỨNG" nên session CHỦ tick SAU merge + test xanh trên main.
- **Điểm TUẦN TỰ HÓA (xếp hàng qua session chủ, ưu tiên làm TRƯỚC):** hạng mục
  `modules/core/**` = lớp 0 ưu tiên, xong merge rồi các nhánh rebase · migration DB dev
  CHỈ session chủ chạy (`db-migrate` không có lock — 2 tiến trình = SQL chạy 2 lần trên
  DB dữ liệu thật; nhánh chỉ ĐỂ file .sql, merge rồi mới migrate) · e2e + dev server ở
  CÂY CHÍNH, một session một thời điểm (worktree không có `.env*`) · `plan:tien-do`/
  `chot-phien` chỉ session chủ.
- **Xanh cục bộ của nhánh** = vitest + typecheck + `check:sast` (chạy được trong
  worktree, symlink node_modules — khuôn trong memory). **Worktree KHÔNG phát hành
  được** (thiếu `.env.production.local` — phat-hanh.ts cũng chặn sẵn).
- **Merge:** session chủ `git fetch` → rebase/merge TUẦN TỰ từng nhánh vào main → test
  sau mỗi merge → tick sổ + `plan:tien-do` MỘT lần → migration (nếu có) → `soat` →
  DUYỆT → `phat-hanh`. Commit trên nhánh: stage theo ĐƯỜNG DẪN, cấm `git add -A`.
- Merge conflict: giải thích ý nghĩa business 2 bên trước, sửa sau khi duyệt.
- Commit/push: luôn hỏi trước (theo settings.json ask).
- Mức nhẹ không cần mở nhiều cửa sổ: Agent tool `isolation: worktree` cho tác vụ độc lập
  cùng lớp 0 — session chính làm session chủ điều phối.

## Ba tầng năng lực

1. Nền tảng (PHẢI có): CLAUDE.md + Verification Loop + Plan Mode.
2. Tăng tốc (NÊN có): Skills (.claude/skills/) + Context Management + MCP.
3. Mở rộng (KHI CẦN): Sub-agents & Agent Teams — chỉ khi build song song nhiều module.
