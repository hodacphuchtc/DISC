/**
 * NGƯỜI LỚN Ở CẠNH TRẺ — tình huống hằng ngày, câu nên nói / nên tránh, bảy ngày thử (29.3).
 *
 * Người đọc là NGƯỜI LỚN (bố, mẹ, ông, bà…) đọc về MỘT đứa trẻ trong nhà. Dùng cho thế quyền
 * `nguoi-lon-voi-tre`; ông bà ↔ cháu dùng chung nội dung với bố mẹ ↔ con — người lớn nói bằng
 * "mình" và gọi bé bằng TÊN (`{nguoiKia}`) nên không phải biết người lớn xưng là gì.
 *
 * 🔴 BẢN NHÁP GÓI A, CHƯA CÓ CHỮ KÝ CHUYÊN MÔN. Cờ `MO_NOI_DUNG_DOI` và `MO_NOI_DUNG_TRE` tắt
 * được trong 30 giây.
 *
 * 🔴 NẠP LƯỜI. Chỉ `app/components/noi-dung-doi.tsx` import file này; đừng import từ chỗ nào
 * khác — gói chính chỉ còn dư vài KB so với trần 300 KB.
 *
 * Luật giữ nguyên từ `disc-noi-dung-cap.ts` và `disc-noi-dung-doi.ts`:
 *  1. Bên nào cũng có lý do chính đáng; không đổ lỗi cho trẻ hay cho người lớn.
 *  2. Chỉ mô tả VÒNG PHẢN ỨNG nhìn thấy được, không đoán nguyên nhân bên trong.
 *  3. Không chẩn đoán, không so hơn kém, không nghề nghiệp, không học lực, không nói bản chất.
 *  4. Việc là của NGƯỜI LỚN làm trước; không giao trẻ "tự sửa mình".
 *  5. Mọi câu dài của bé phải đúng tuổi: `nho` (mầm non–lớp 2) · `tieu-hoc` (3–5) · `lon` (6+).
 *
 * Hướng: `toi-cao-hon` = người lớn có nhóm này NỔI hơn bé; `toi-thap-hon` = nhẹ hơn bé.
 * Chỗ giữ: `{toi}/{Toi}` (người lớn đang đọc), `{nguoiKia}/{NguoiKia}` (tên bé).
 */

import type { HuongLechCap } from "./disc-lech-cap";
import type { TinhHuongDoi } from "./disc-noi-dung-doi";

import type { MaTruc } from "@modules/core/bo-de/kieu";
import type { BacTre } from "@modules/core/gia-dinh/bac-hoc";

export const BAC_TRE_DANH_SACH: readonly BacTre[] = ["nho", "tieu-hoc", "lon"];

export const TINH_HUONG_VOI_TRE: Readonly<
  Record<MaTruc, Readonly<Record<HuongLechCap, Readonly<Record<BacTre, TinhHuongDoi>>>>>
> = {
  D: {
    "toi-cao-hon": {
      nho: {
        tinhHuong:
          "Buổi sáng đi học: {toi} đã tính sẵn mọi việc và nói liền một mạch “mặc áo, đi giày, đi thôi”. {NguoiKia} còn nhỏ, cần từng bước và thời gian để làm theo; {toi} giục thêm thì {nguoiKia} càng chậm lại hoặc khóc.",
        nenNoi: "“{NguoiKia} ơi, mình mặc áo trước nhé. Xong mình báo mình đi giày.”",
        nenTranh: "“Nhanh lên, trễ rồi!”",
      },
      "tieu-hoc": {
        tinhHuong:
          "Giờ làm bài tối: {toi} quyết luôn môn nào làm trước và làm trong bao lâu. {NguoiKia} cần tự chọn một phần và nghĩ xong mới bắt đầu; {toi} thấy {nguoiKia} chần chừ, còn {nguoiKia} thấy mình bị ra lệnh.",
        nenNoi: "“Tối nay {nguoiKia} chọn làm môn nào trước nhé. Bắt đầu lúc nào cũng được trong mười phút tới.”",
        nenTranh: "“Làm toán trước, rồi mới đến văn, không bàn nữa.”",
      },
      lon: {
        tinhHuong:
          "Chuyện giờ giấc và việc riêng của {nguoiKia}: {toi} đã có sẵn quy định và nói gọn “cứ thế mà làm”. {NguoiKia} đang muốn được bàn bạc như người lớn; {toi} thấy mình chỉ giữ nề nếp, còn {nguoiKia} thấy mình không có tiếng nói.",
        nenNoi: "“Mình nêu một lo ngại, còn cách làm thì {nguoiKia} đề xuất trước. Mình nghe rồi mới nói ý mình.”",
        nenTranh: "“Ở nhà này tôi quyết, không thương lượng.”",
      },
    },
    "toi-thap-hon": {
      nho: {
        tinhHuong:
          "{NguoiKia} chạy tới làm ngay và muốn tự làm tất cả; {toi} cần nhìn kỹ trước nên giữ lại “để mình xem đã”. {NguoiKia} thấy bị chặn đúng lúc đang hào hứng.",
        nenNoi: "“{NguoiKia} muốn tự làm thì mình cho thử. Mình đứng đây xem nhé.”",
        nenTranh: "“Khoan, để mình làm cho nhanh.”",
      },
      "tieu-hoc": {
        tinhHuong:
          "{NguoiKia} thích bắt tay vào làm ngay (làm thủ công, thí nghiệm) trong khi {toi} muốn đọc hướng dẫn và chuẩn bị kỹ. {NguoiKia} thấy bị giữ lại; {toi} lo việc bị làm hỏng.",
        nenNoi: "“Mình cho {nguoiKia} thử trước một lần. Hỏng cũng được, mình xem cùng.”",
        nenTranh: "“Chưa đọc hướng dẫn mà đã vội làm.”",
      },
      lon: {
        tinhHuong:
          "{NguoiKia} quyết nhanh chuyện của mình (chọn câu lạc bộ, bạn bè) rồi mới báo; {toi} cần thời gian để hỏi và tìm hiểu. {NguoiKia} thấy mình bị nghi ngờ; {toi} thấy mình bị đặt trước việc đã rồi.",
        nenNoi: "“Mình cần nghe {nguoiKia} kể lý do rồi mới nói được ý mình. Cho mình một ngày nhé.”",
        nenTranh: "“Sao không hỏi mình trước mà đã quyết rồi?”",
      },
    },
  },
  I: {
    "toi-cao-hon": {
      nho: {
        tinhHuong:
          "Đón {nguoiKia} về, {toi} hỏi liền một tràng “hôm nay vui không, ăn gì, chơi với ai?”. {NguoiKia} còn nhỏ và cần yên một lúc mới kể được; {toi} thấy bé ít nói, còn {nguoiKia} thấy mình bị hỏi dồn.",
        nenNoi: "“Về rồi nè. {NguoiKia} cứ nghỉ một lát, lúc nào muốn kể thì kể mình nghe.”",
        nenTranh: "“Sao không nói gì hết, trả lời đi.”",
      },
      "tieu-hoc": {
        tinhHuong:
          "{Toi} kể nhiều và hỏi nhiều lúc ăn cơm; {nguoiKia} thích ngồi lặng ăn hoặc nghĩ riêng. {Toi} tưởng đang gần gũi, còn {nguoiKia} thấy bữa cơm thành giờ bị hỏi.",
        nenNoi: "“Bữa nay mình kể trước một chuyện nhé. {NguoiKia} muốn kể thì kể, không thì thôi.”",
        nenTranh: "“Kể nghe đi, giấu gì mà không nói?”",
      },
      lon: {
        tinhHuong:
          "{Toi} muốn trò chuyện nhiều với {nguoiKia} và hay gõ cửa hỏi han; {nguoiKia} đang cần không gian riêng. {Toi} thấy bị xa cách, còn {nguoiKia} thấy mình bị theo dõi.",
        nenNoi: "“Mình luôn có mặt. Lúc nào {nguoiKia} muốn nói chuyện thì cứ tìm mình.”",
        nenTranh: "“Lớn rồi nên chẳng còn kể gì với người nhà nữa.”",
      },
    },
    "toi-thap-hon": {
      nho: {
        tinhHuong:
          "{NguoiKia} kể không ngừng và muốn {toi} đáp lại từng câu; {toi} cần yên tĩnh để làm việc nhà. {NguoiKia} thấy {toi} không quan tâm, trong khi {toi} vẫn đang nghe.",
        nenNoi: "“Mình đang nghe nè. Cho mình xong việc này, mình ngồi nghe {nguoiKia} kể hết nhé.”",
        nenTranh: "“Đừng nói nữa, để mình làm việc.”",
      },
      "tieu-hoc": {
        tinhHuong:
          "{NguoiKia} về nhà là kể chuyện lớp, bạn bè, cô giáo; {toi} nghe nhưng ít phản hồi vì mệt. {NguoiKia} kể càng to hơn.",
        nenNoi: "“Mình mệt nhưng vẫn muốn nghe. Mười phút nhé, {nguoiKia} kể cho mình chuyện vui nhất.”",
        nenTranh: "“Kể lắm thế, mệt người.”",
      },
      lon: {
        tinhHuong:
          "{NguoiKia} chia sẻ nhiều chuyện và cảm xúc, còn {toi} khó đáp bằng lời. {NguoiKia} thấy mình bị lờ đi; thật ra {toi} đang nghĩ cách trả lời cho đúng.",
        nenNoi: "“Mình chưa biết nói sao cho đúng, nhưng mình đang nghe. Cứ kể tiếp nhé.”",
        nenTranh: "“Chuyện đó có gì đâu mà phải buồn.”",
      },
    },
  },
  S: {
    "toi-cao-hon": {
      nho: {
        tinhHuong:
          "{NguoiKia} mỗi ngày muốn chơi một kiểu, đổi áo, đổi chỗ ngồi; {toi} quen nếp đều nên khó theo kịp. {NguoiKia} thấy mình bị gò mỗi khi {toi} nói “như hôm qua đi”.",
        nenNoi: "“Hôm nay mình thử một cách khác một lần. Mai mình quay lại nếp cũ nhé.”",
        nenTranh: "“Hôm qua đã thế rồi, sao hôm nay lại đổi?”",
      },
      "tieu-hoc": {
        tinhHuong:
          "{NguoiKia} muốn đổi kế hoạch cuối tuần và hay đổi sở thích; {toi} cần biết trước và quen nếp. {Toi} nói “cứ như cũ”, còn {nguoiKia} thấy ý mình không được nghe.",
        nenNoi: "“Mình cần biết trước một ngày để quen. Lần này mình thử đổi một lần cùng {nguoiKia}.”",
        nenTranh: "“Suốt ngày đổi ý, chẳng biết đường nào mà lần.”",
      },
      lon: {
        tinhHuong:
          "{NguoiKia} đang thử nhiều thứ mới (bạn, phong cách, kế hoạch); {toi} bất an vì mọi thứ đổi quá nhanh. {NguoiKia} thấy {toi} không tin mình.",
        nenNoi: "“Mình lo vì mình quen nếp cũ. Cho mình biết trước, mình sẽ ủng hộ {nguoiKia} thử.”",
        nenTranh: "“{NguoiKia} thay đổi quá, mình chẳng nhận ra nữa.”",
      },
    },
    "toi-thap-hon": {
      nho: {
        tinhHuong:
          "{Toi} hay đổi kế hoạch đột xuất (đi chơi, đổi giờ ngủ); {nguoiKia} cần nếp quen để thấy an toàn. {NguoiKia} khóc hoặc bám vì chưa kịp chuẩn bị.",
        nenNoi: "“Chiều nay mình đi chơi. Mình báo trước để {nguoiKia} chuẩn bị.”",
        nenTranh: "“Có gì đâu mà khóc, chỉ đi chơi thôi mà.”",
      },
      "tieu-hoc": {
        tinhHuong:
          "{Toi} rủ đi chơi phút chót khi {nguoiKia} đã có dự định hoặc đang làm dở; {nguoiKia} khó chuyển nhanh nên từ chối. {Toi} thấy {nguoiKia} cứng nhắc.",
        nenNoi: "“Mình định đi chơi chiều nay. {NguoiKia} xong việc rồi mình đi nhé.”",
        nenTranh: "“Đi chơi cũng không chịu, khó chiều quá.”",
      },
      lon: {
        tinhHuong:
          "{Toi} thay đổi nhịp sinh hoạt cả nhà (giờ ăn, giờ đi) mà ít báo; {nguoiKia} thấy lịch học và nghỉ của mình bị phá. {NguoiKia} im lặng rồi bực dần.",
        nenNoi: "“Mình sẽ báo {nguoiKia} sớm khi cả nhà đổi lịch. Nếu thấy vướng thì {nguoiKia} nói với mình.”",
        nenTranh: "“Chuyện nhỏ, đổi chút thì có sao đâu.”",
      },
    },
  },
  C: {
    "toi-cao-hon": {
      nho: {
        tinhHuong:
          "{Toi} muốn đồ chơi xếp đúng chỗ và ăn xong dọn gọn; {nguoiKia} còn nhỏ, chơi xong bỏ đó. {Toi} nhắc đi nhắc lại, còn {nguoiKia} thấy mình lúc nào cũng bị chỉnh.",
        nenNoi: "“Mình cùng cất đồ chơi nhé. {NguoiKia} cất xe, mình cất sách.”",
        nenTranh: "“Bừa quá, dọn lại đi!”",
      },
      "tieu-hoc": {
        tinhHuong:
          "{Toi} muốn bài làm chữ đẹp và đúng từng chi tiết; {nguoiKia} làm xong là xong. {Toi} sửa từng lỗi, còn {nguoiKia} thấy mất hứng làm.",
        nenNoi: "“Mình thấy phần này {nguoiKia} làm rất ổn. Có một chỗ nhỏ, {nguoiKia} muốn xem cùng mình không?”",
        nenTranh: "“Sai rồi, xoá làm lại.”",
      },
      lon: {
        tinhHuong:
          "{Toi} hay xem lại việc của {nguoiKia} (bài vở, lịch) để chắc không sót; {nguoiKia} thấy mình bị soi xét và không được tin.",
        nenNoi: "“Mình tin {nguoiKia}. Nếu cần kiểm lại cùng thì {nguoiKia} cho mình biết lúc nào tiện.”",
        nenTranh: "“Để mình xem lại cho chắc, tự làm thì thế nào cũng sót.”",
      },
    },
    "toi-thap-hon": {
      nho: {
        tinhHuong:
          "{NguoiKia} muốn xếp đồ chơi thẳng hàng và khóc khi bị xáo; {toi} xếp cho nhanh, bỏ cả vào hộp. {NguoiKia} thấy việc mình vừa làm xong bị phá.",
        nenNoi: "“Mình biết {nguoiKia} xếp rất đẹp. Mình hỏi trước khi cất nhé.”",
        nenTranh: "“Xếp làm gì cho mất công, cho cả vào hộp đi.”",
      },
      "tieu-hoc": {
        tinhHuong:
          "{NguoiKia} làm bài rất kỹ, tẩy xoá nhiều và mất thời gian; {toi} chỉ cần xong. {Toi} giục “thôi được rồi”, còn {nguoiKia} thấy việc mình làm không được coi trọng.",
        nenNoi: "“Mình thấy {nguoiKia} làm rất cẩn thận. Mình để thêm mười phút, rồi mình cùng nghỉ.”",
        nenTranh: "“Được rồi, có thế mà cũng làm lâu.”",
      },
      lon: {
        tinhHuong:
          "{NguoiKia} chuẩn bị rất kỹ và lo khi mọi thứ chưa chắc chắn; {toi} nghĩ cứ thử rồi tính. {NguoiKia} thấy {toi} coi nhẹ nỗi lo của mình.",
        nenNoi: "“Mình thấy {nguoiKia} đã chuẩn bị kỹ rồi. Nếu còn lo điều gì, mình ngồi liệt kê cùng nhau.”",
        nenTranh: "“Lo gì nhiều, cứ làm đi rồi tính.”",
      },
    },
  },
};

/**
 * BẢY NGÀY THỬ cho người lớn ở cạnh một đứa trẻ — theo BẬC, không theo trục (cùng lý do với
 * `KE_HOACH_BAY_NGAY`: nội dung theo trục đã nằm ở trên). Mọi việc là việc của NGƯỜI LỚN làm
 * với bé; ngày 7 luôn là ngồi lại.
 * 🔴 Câu dài nào cũng mang `{nguoiKia}` hoặc `{Toi}`: hai chiều của cùng một cặp không được dùng
 * chung câu dài (`tests/ban-tong-hop.test.tsx`).
 */
export const KE_HOACH_VOI_TRE: Readonly<Record<BacTre, readonly string[]>> = {
  nho: [
    "Ngày 1 — Chỉ quan sát. Để ý một lúc {nguoiKia} chơi hoặc làm việc theo cách riêng của {nguoiKia}, và không chỉnh gì.",
    "Ngày 2 — Ngồi xuống ngang tầm mắt {nguoiKia} và hỏi một câu đơn giản: “Hôm nay {nguoiKia} thích nhất điều gì?” Rồi chờ.",
    "Ngày 3 — Báo trước một việc sắp xảy ra bằng một câu ngắn cho {nguoiKia}: “Năm phút nữa mình đi tắm nhé.”",
    "Ngày 4 — Cho {nguoiKia} tự chọn một việc nhỏ (áo nào, cốc nào) và không đổi lại.",
    "Ngày 5 — Mười phút chơi theo ý {nguoiKia}: {toi} đi theo, không dẫn.",
    "Ngày 6 — Nói với {nguoiKia} một việc cụ thể bé đã làm, ví dụ “{nguoiKia} đã tự cất giày, mình thấy vui.”",
    "Ngày 7 — Ngồi lại với chính mình năm phút. {Toi} nhớ điều gì giúp {nguoiKia} dễ chịu nhất tuần này, rồi chọn một việc giữ sang tuần sau.",
  ],
  "tieu-hoc": [
    "Ngày 1 — Chỉ quan sát. Ghi nhớ một lần {nguoiKia} làm việc theo cách của {nguoiKia}, và không nhận xét.",
    "Ngày 2 — Hỏi một câu mở sau giờ học: “Hôm nay có chuyện gì {nguoiKia} muốn kể không?” rồi nghe đủ hai phút.",
    "Ngày 3 — Cho {nguoiKia} chọn một phần của buổi tối (làm bài trước hay chơi trước) và tôn trọng lựa chọn đó.",
    "Ngày 4 — Nói rõ điều {toi} cần bằng “mình cần…”, thay vì “{nguoiKia} lúc nào cũng…”.",
    "Ngày 5 — Mười phút làm một việc {nguoiKia} thích, theo cách của {nguoiKia}.",
    "Ngày 6 — Cảm ơn một việc cụ thể {nguoiKia} đã làm trong tuần và nói rõ việc đó là gì.",
    "Ngày 7 — Ngồi lại mười phút. {Toi} và {nguoiKia} mỗi người nói một điều thấy vui và một điều thấy khó trong tuần, rồi chọn một điều giữ tiếp.",
  ],
  lon: [
    "Ngày 1 — Chỉ quan sát. Để ý một lần {nguoiKia} tự quyết một việc nhỏ và cách {nguoiKia} làm, không nhận xét.",
    "Ngày 2 — Hỏi ý {nguoiKia} trước khi nói ý mình về một việc của nhà: “{nguoiKia} thấy sao?”",
    "Ngày 3 — Nói điều {toi} lo bằng một câu “mình lo vì…”, rồi hỏi {nguoiKia} muốn xử lý thế nào.",
    "Ngày 4 — Trao cho {nguoiKia} toàn quyền một việc nhỏ (giờ học, đồ dùng) và không kiểm tra giữa chừng.",
    "Ngày 5 — Mười phút bên {nguoiKia} theo cách {nguoiKia} chọn (đi dạo, ăn vặt, ngồi im), không khuyên nhủ.",
    "Ngày 6 — Cảm ơn {nguoiKia} một việc đã làm cho cả nhà, nói thật lòng.",
    "Ngày 7 — Ngồi lại mười phút. {Toi} và {nguoiKia} mỗi người nói một điều dễ chịu và một điều khó trong cách sống cùng nhau, rồi chọn một điều giữ tiếp.",
  ],
};
