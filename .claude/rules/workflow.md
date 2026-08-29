# Quy trình làm việc với Claude Code

## Bộ handle giai đoạn (`.claude/commands/`, thêm 06/08/2026)

`/B1_y_tuong` bàn + phản biện (Plan Mode, KHÔNG code) → `/B2_lo_trinh` ghi hạng mục vào
sổ đang hiệu lực ở gốc (`PLAN_V4.md`) chờ DUYỆT → `/B3_thi_cong` code theo GÓI trên LOCAL →
`/B4_nghiem_thu` đòi bằng chứng + bộ cổng → `/B6_xuat_ban` soat → DUYỆT → phat-hanh.
Mở/đóng phiên dùng `/mo_session` · `/dong_session` (bản TOÀN CỤC, không chép vào dự án).

Bộ chuẩn của skill `khoi-tao-du-an` có 8 handle; dự án này CỐ Ý bỏ 3, và **ba file lệnh
tương ứng đã XOÁ khỏi `.claude/commands/` ngày 29/08/2026**: `B5_luu_code` (đã có luật
commit riêng ở mục Git) · `B6_trien_khai` (dùng skill `cau-hinh-ha-tang` khi tới `26.1`) ·
`reset_db` (không có CSDL nào để reset — ADR-001).

*Trước 29/08 ba file ấy vẫn nằm trong `.claude/commands/` dù mục này nói đã bỏ — tài liệu
tự mâu thuẫn với chính nó, và người đọc không biết bên nào đang có hiệu lực.*

## Plan Mode — bắt buộc khi

- Feature mới, task phức tạp, đụng ≥ 3 file, thay đổi schema/migration,
  thay đổi liên quan ≥ 2 module.
- Trình plan → chờ người dùng duyệt → mới thực hiện. Không "vừa plan vừa code".

## Thi công theo GÓI (cắm máy — chốt 28/07/2026)

Plan đã duyệt = duyệt CẢ GÓI. Người dùng rời máy được; máy réo (hook toàn cục) khi
thật sự cần người.

- Tự chạy liền các hạng mục TRONG plan; **mỗi hạng mục xong phải lint/test/build XANH
  mới được đi tiếp** — test xanh thay cho người duyệt từng bước.
- Tick checkbox tại sổ đang hiệu lực ở gốc (`PLAN_V4.md`) + báo cáo 3 dòng
  từng mục (đã làm / kiểm chứng / tiếp theo) nhưng KHÔNG dừng chờ; báo cáo tổng cuối gói.
- **DỪNG BẮT BUỘC chờ duyệt khi:** commit/push GitHub · deploy · migration production ·
  ghi/xóa/vô hiệu hóa DỮ LIỆU THẬT (ở đây là IndexedDB của một máy đang có bài làm thật)
  · tác động ra ngoài thư mục dự án · việc phát sinh NGOÀI phạm vi plan.
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

🔴 **DỰ ÁN NÀY KHÔNG CÓ MÁY SINH SỔ.** Bộ chuẩn của skill `khoi-tao-du-an` có
`Plan/TIEN_DO.md`, `Plan/VIEC_CON_LAI.md` và một script `check:plan` sinh ra chúng — dự án DISC
**không dùng** cái nào: nó có MỘT sổ đang hiệu lực ở gốc (`PLAN_V4.md`), không chia module,
nên một bảng tổng hợp máy sinh chỉ là bản sao thứ hai của chính nó. Dòng `(e)` viết tay,
đọc bằng mắt. *(Sửa 29/08/2026 — ba tên file và một lệnh npm ở trên chưa bao giờ tồn tại
trong repo này, và tài liệu cũ dạy sai suốt từ đó.)*

**Khi đóng một hạng mục:** tick `[x]` và **xóa dòng `(e)`** của nó (xong rồi thì không còn
gì chặn). Khi BA hạng mục mới: viết `(e)` ngay từ đầu, đừng để lượt sau đi phân định lại.

## Ba mức đọc sổ (chống đốt token — chốt 11/08/2026, sửa 29/08/2026)

> Nạp trọn một sổ chỉ để trả lời một câu là đốt token vô ích. Luật chung: **file não >30KB
> thì `grep` trước, Read theo khoảng (`offset`/`limit`); cần trọn file thì giao agent.**
> Ở dự án này, file não lớn nhất là `docs/so-seo.md` (~26KB) và `modules/core/OVERVIEW.md`.

- **Mức 1 — sửa code thường nhật trong module:** đọc OVERVIEW mục 1–4 (~1KB) +
  `grep -n "^###"` rồi Read ĐÚNG các tiêu đề con liên quan.
  🔴 **Và `grep docs/so-seo.md` theo từ khoá của vùng đang sửa** — 44 bài học ở đó đều đổi
  bằng một lỗi thật, đọc trước thì khỏi trả giá lần hai.
- **Mức 2 — làm tiếp hạng mục đang dở:** mức 1 + grep MÃ hạng mục trong `PLAN_V4.md` (sổ
  đang hiệu lực) và trong OVERVIEW của module, đọc đúng khối đó. Sổ cũ `PLAN_V3/V2/V1_LUU`
  chỉ tra khi cần biết *vì sao*, không tick thêm.
- **Mức 3 — BA gói mới / review lớn / câu hỏi liên-module:** KHÔNG tự đọc — giao
  `researcher` đọc trọn trong context riêng, trả tóm tắt ≤40 dòng kèm pointer.
  🔴 **KHÔNG gửi gói nén mã nguồn ra ngoài máy** (repo có nội dung viết về trẻ).

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

## Git

> 🔴 **Viết lại 29/08/2026.** Bản cũ mô tả một quy trình NHIỀU SESSION SONG SONG với
> worktree cho từng module, migration CSDL, và một loạt script `plan:*` · `db-migrate` ·
> `soat` · `phat-hanh`. **Không cái nào trong đó tồn tại ở dự án này:**
> không có CSDL (ADR-001), không có thư mục `Plan/`, không có bốn lệnh npm ấy trong
> `package.json`, và sản phẩm là MỘT khoang chứ không phải nhiều module chạy song song.
> Tài liệu cũ đã dạy sai suốt từ 11/08. Cửa `tests/ngan-sach-context.test.ts` nay canh
> chuyện đó: mọi `npm run <x>` viết trong tài liệu phải có thật trong `package.json`.

- **Commit/push: LUÔN HỎI TRƯỚC.** Đây là điểm DỪNG BẮT BUỘC, không phụ thuộc mode.
- **Stage theo ĐƯỜNG DẪN, cấm `git add -A`** — quét bừa là cuốn theo việc dở của phiên
  trước vào commit của mình, và lịch sử hết đọc được.
- **Việc của người khác đang dở trong cây làm việc** thì tách thành commit RIÊNG của nó,
  đừng trộn vào commit của mình.
- **Hook `pre-commit` chạy gitleaks** trên phần đã stage. Nó đỏ thì DỪNG, đừng `--no-verify`.
- Merge conflict: giải thích ý nghĩa nghiệp vụ của cả hai phía trước, sửa sau khi duyệt.
- Cần chạy một việc độc lập trong bản sao repo: Agent tool `isolation: worktree`.
  **Worktree KHÔNG phát hành được** và không nên dùng cho thi công thường nhật.

## Ba tầng năng lực

1. Nền tảng (PHẢI có): CLAUDE.md + Verification Loop + Plan Mode.
2. Tăng tốc (NÊN có): Skills (.claude/skills/) + Context Management + MCP.
3. Mở rộng (KHI CẦN): Sub-agents & Agent Teams — chỉ khi build song song nhiều module.
