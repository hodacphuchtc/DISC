/**
 * TRẺ Ở CẠNH NGƯỜI LỚN — tình huống hằng ngày, câu nên nói / nên tránh, bảy ngày thử (29.4).
 *
 * Người đọc là MỘT ĐỨA TRẺ (hoặc bố mẹ đọc cùng bé) đọc về người lớn trong nhà. Thế quyền
 * `tre-voi-nguoi-lon`. Xưng hô thay bằng `thayXungHo` (`disc-xung-ho.ts`):
 * `{xungTre}` = con/cháu/em · `{goiNguoiKia}` = Bố/Mẹ/Ông/Bà hoặc tên.
 *
 * 🔴 LUẬT HẸP NHẤT CỦA CẢ SẢN PHẨM — đọc `disc-noi-dung-cap.ts` luật 2 trước khi sửa:
 *  · Chỉ nói được MỘT thứ: cách bé NÓI RA điều mình cần, và vì sao người lớn có thể đang hành xử
 *    như vậy (một lý do có lý, lật khung).
 *  · KHÔNG BAO GIỜ giao bé việc điều chỉnh người lớn ("giúp mẹ bình tĩnh", "làm bố vui"…). Khi
 *    chuyện trong nhà không đỡ hơn, đứa trẻ sẽ hiểu là mình đã làm hỏng.
 *  · Câu "nên tránh" để bé nhận ra lúc cáu; không để trách bé.
 *  · Bậc `nho` (mầm non–lớp 2): bé chưa tự đọc — chữ ngắn, đọc cùng bố mẹ.
 *
 * 🔴 BẢN NHÁP GÓI A, CHƯA CÓ CHỮ KÝ CHUYÊN MÔN. NẠP LƯỜI: chỉ `noi-dung-doi.tsx` import file này.
 *
 * Hướng: `toi-cao-hon` = bé NỔI hơn người lớn ở nhóm này; `toi-thap-hon` = bé nhẹ hơn.
 */

import type { HuongLechCap } from "./disc-lech-cap";
import type { TinhHuongDoi } from "./disc-noi-dung-doi";

import type { MaTruc } from "@modules/core/bo-de/kieu";
import type { BacTre } from "@modules/core/gia-dinh/bac-hoc";

export const TINH_HUONG_TRE_VOI_NL: Readonly<
  Record<MaTruc, Readonly<Record<HuongLechCap, Readonly<Record<BacTre, TinhHuongDoi>>>>>
> = {
  D: {
    "toi-cao-hon": {
      nho: {
        tinhHuong:
          "{XungTre} muốn tự chọn và làm ngay, còn {goiNguoiKia} hay nói “để mình xem đã”. {XungTre} thấy bị chặn; có thể {goiNguoiKia} đang nghĩ cho {xungTre} được an toàn.",
        nenNoi: "“{GoiNguoiKia} ơi, {xungTre} muốn tự làm, {GoiNguoiKia} cho {xungTre} thử ạ.”",
        nenTranh: "“Không cho thì {xungTre} không làm nữa!”",
      },
      "tieu-hoc": {
        tinhHuong:
          "{XungTre} nghĩ ra cách làm và muốn bắt đầu ngay, còn {goiNguoiKia} cần thêm thời gian để xem. {XungTre} sốt ruột và nói to hơn; có thể {goiNguoiKia} đang cân nhắc để việc không hỏng.",
        nenNoi: "“{GoiNguoiKia} ơi, {xungTre} có một cách làm. {GoiNguoiKia} nghe {xungTre} nói một phút được không ạ?”",
        nenTranh: "“Sao {goiNguoiKia} lúc nào cũng chậm?”",
      },
      lon: {
        tinhHuong:
          "{XungTre} đã có ý kiến riêng và muốn được quyết một số việc của mình, còn {goiNguoiKia} vẫn quen quyết thay. {XungTre} thấy mình chưa được tin; có thể {goiNguoiKia} chưa quen nhìn {xungTre} lớn lên.",
        nenNoi: "“{GoiNguoiKia} ơi, việc này {xungTre} muốn được cùng quyết. {XungTre} xin trình bày lý do để {goiNguoiKia} nghe ạ.”",
        nenTranh: "“{XungTre} lớn rồi, {goiNguoiKia} không có quyền quyết.”",
      },
    },
    "toi-thap-hon": {
      nho: {
        tinhHuong:
          "{GoiNguoiKia} nói nhanh và làm ngay, còn {xungTre} cần xem kỹ rồi mới làm theo. {XungTre} đứng yên hoặc im lặng; có thể {goiNguoiKia} chỉ muốn xong sớm cho {xungTre} đỡ mệt.",
        nenNoi: "“{GoiNguoiKia} ơi, {xungTre} chưa kịp, {goiNguoiKia} đợi {xungTre} một chút ạ.”",
        nenTranh: "“{XungTre} không chịu đâu!”",
      },
      "tieu-hoc": {
        tinhHuong:
          "{GoiNguoiKia} chốt kế hoạch rất nhanh, còn {xungTre} cần nghĩ xong mới đồng ý. {XungTre} gật tạm rồi thấy không thích; có thể {goiNguoiKia} chưa biết {xungTre} cần nghĩ thêm một lúc.",
        nenNoi: "“{GoiNguoiKia} cho {xungTre} nghĩ một phút rồi {xungTre} trả lời ạ.”",
        nenTranh: "“Thôi gì cũng được.”",
      },
      lon: {
        tinhHuong:
          "{GoiNguoiKia} hay quyết nhanh chuyện của cả nhà, còn {xungTre} cần xem kỹ và nghe lý do. {XungTre} thấy tiếng nói của mình đến muộn; có thể {goiNguoiKia} chưa biết {xungTre} đang nghĩ gì về chuyện đó.",
        nenNoi: "“{GoiNguoiKia} cho {xungTre} thời gian đến tối rồi {xungTre} nói ý kiến của {xungTre} nhé.”",
        nenTranh: "“Cái gì cũng {goiNguoiKia} quyết, hỏi {xungTre} làm gì.”",
      },
    },
  },
  I: {
    "toi-cao-hon": {
      nho: {
        tinhHuong:
          "{XungTre} có nhiều chuyện muốn kể ngay, còn {goiNguoiKia} đang bận làm việc. {XungTre} kể to hơn và kéo tay; có thể {goiNguoiKia} rất muốn nghe, chỉ chưa rảnh.",
        nenNoi: "“{GoiNguoiKia} ơi, lúc nào {goiNguoiKia} rảnh {xungTre} kể chuyện cho {goiNguoiKia} nghe ạ?”",
        nenTranh: "“{GoiNguoiKia} nghe {xungTre} đi, nghe ngay đi!”",
      },
      "tieu-hoc": {
        tinhHuong:
          "{XungTre} về là kể chuyện lớp ngay, còn {goiNguoiKia} mới về tới nhà và cần nghỉ. {XungTre} thấy không ai nghe; có thể {goiNguoiKia} nghe được sau một lúc yên.",
        nenNoi: "“{GoiNguoiKia} nghỉ một lát đi ạ, rồi {xungTre} kể chuyện vui hôm nay cho {goiNguoiKia} nghe.”",
        nenTranh: "“{GoiNguoiKia} chẳng bao giờ nghe {xungTre} cả.”",
      },
      lon: {
        tinhHuong:
          "{XungTre} muốn chia sẻ nhiều với {goiNguoiKia}, cả chuyện nhỏ lẫn chuyện lớn, còn {goiNguoiKia} chỉ đáp ngắn khi mệt. {XungTre} thấy bị gạt đi; có thể {goiNguoiKia} mệt chứ không hết quan tâm.",
        nenNoi: "“{GoiNguoiKia} ơi, {xungTre} có chuyện muốn kể. Lúc nào {goiNguoiKia} thoải mái thì báo {xungTre} nhé.”",
        nenTranh: "“Thôi {xungTre} chẳng kể gì với {goiNguoiKia} nữa.”",
      },
    },
    "toi-thap-hon": {
      nho: {
        tinhHuong:
          "{GoiNguoiKia} hỏi han và nói chuyện nhiều, còn {xungTre} cần ngồi yên chơi một mình một lát. {XungTre} quay mặt đi hoặc im; có thể {goiNguoiKia} chỉ muốn gần {xungTre}.",
        nenNoi: "“{GoiNguoiKia} ơi, cho {xungTre} chơi một mình một lát, xong {xungTre} chạy sang {goiNguoiKia} ạ.”",
        nenTranh: "“Đi chỗ khác đi!”",
      },
      "tieu-hoc": {
        tinhHuong:
          "{GoiNguoiKia} hay hỏi “hôm nay thế nào?” ngay khi {xungTre} vừa về, còn {xungTre} cần một lúc yên. {XungTre} trả lời cộc lốc; có thể {goiNguoiKia} chỉ muốn biết {xungTre} vui hay mệt.",
        nenNoi: "“{GoiNguoiKia} cho {xungTre} nghỉ mười phút, xong {xungTre} kể {goiNguoiKia} nghe ạ.”",
        nenTranh: "“Đừng hỏi nữa, phiền quá!”",
      },
      lon: {
        tinhHuong:
          "{GoiNguoiKia} hay gõ cửa và hỏi han nhiều, còn {xungTre} đang cần không gian riêng. {XungTre} đóng cửa hoặc cáu; có thể {goiNguoiKia} chỉ lo và muốn gần.",
        nenNoi: "“{GoiNguoiKia} ơi, {xungTre} cần ở yên một lát. Tối nay {xungTre} sẽ ra nói chuyện với {goiNguoiKia} ạ.”",
        nenTranh: "“{GoiNguoiKia} đừng xen vào chuyện của {xungTre}!”",
      },
    },
  },
  S: {
    "toi-cao-hon": {
      nho: {
        tinhHuong:
          "{XungTre} quen làm theo thứ tự cũ (ăn xong rồi mới chơi, đi đường quen), còn {goiNguoiKia} hay đổi sang cách khác. {XungTre} khóc vì chưa kịp quen; có thể {goiNguoiKia} chỉ nghĩ cách mới cũng sẽ vui.",
        nenNoi: "“{GoiNguoiKia} ơi, {goiNguoiKia} nói trước cho {xungTre} biết với ạ.”",
        nenTranh: "“{XungTre} không đi đâu, {xungTre} muốn như cũ!”",
      },
      "tieu-hoc": {
        tinhHuong:
          "{XungTre} cần biết trước kế hoạch cuối tuần, còn {goiNguoiKia} hay đổi vào phút chót. {XungTre} bực và không muốn đi; có thể {goiNguoiKia} cũng phải đổi theo hoàn cảnh.",
        nenNoi: "“{GoiNguoiKia} cho {xungTre} biết sớm một chút để {xungTre} chuẩn bị với ạ.”",
        nenTranh: "“Lúc nào cũng đổi, {xungTre} không đi nữa.”",
      },
      lon: {
        tinhHuong:
          "{XungTre} cần lịch sinh hoạt ổn định để học, còn {goiNguoiKia} thay đổi giờ giấc cả nhà khá thường xuyên. {XungTre} thấy rối và mệt; có thể {goiNguoiKia} chưa biết lịch đó quan trọng với {xungTre}.",
        nenNoi: "“{GoiNguoiKia} ơi, lịch học của {xungTre} cần ổn định. Nếu đổi, {goiNguoiKia} báo {xungTre} trước một ngày được không ạ?”",
        nenTranh: "“{GoiNguoiKia} cứ làm {xungTre} rối hết lên.”",
      },
    },
    "toi-thap-hon": {
      nho: {
        tinhHuong:
          "{XungTre} thích thử cái mới và đổi trò chơi liên tục, còn {goiNguoiKia} quen nếp đều. {XungTre} thấy bị giữ lại; có thể {goiNguoiKia} muốn {xungTre} thấy an toàn.",
        nenNoi: "“{GoiNguoiKia} ơi, hôm nay {xungTre} muốn thử chơi trò mới, {goiNguoiKia} chơi với {xungTre} nhé?”",
        nenTranh: "“Chán quá, lúc nào cũng như cũ!”",
      },
      "tieu-hoc": {
        tinhHuong:
          "{XungTre} muốn đổi cách làm hoặc thử việc mới, còn {goiNguoiKia} quen làm theo nếp. {XungTre} thấy ý mình khó được thử; có thể {goiNguoiKia} chưa biết {xungTre} muốn thử điều đó.",
        nenNoi: "“{GoiNguoiKia} ơi, {xungTre} muốn thử cách này một lần thôi. Nếu không hợp, {xungTre} sẽ quay lại cách cũ.”",
        nenTranh: "“{GoiNguoiKia} cứng nhắc quá!”",
      },
      lon: {
        tinhHuong:
          "{XungTre} muốn thay đổi (kiểu tóc, nhóm bạn, cách học), còn {goiNguoiKia} lo vì quen {xungTre} như cũ. {XungTre} thấy bị cản; có thể {goiNguoiKia} cần thời gian để làm quen.",
        nenNoi: "“{GoiNguoiKia} ơi, {xungTre} đang muốn thử điều này. {GoiNguoiKia} cho {xungTre} giải thích lý do rồi {goiNguoiKia} nghĩ thêm ạ.”",
        nenTranh: "“{GoiNguoiKia} chẳng chịu hiểu gì cả.”",
      },
    },
  },
  C: {
    "toi-cao-hon": {
      nho: {
        tinhHuong:
          "{XungTre} muốn xếp đồ thật thẳng và làm cho đúng, còn {goiNguoiKia} làm cho nhanh gọn. {XungTre} khóc vì bị xáo; có thể {goiNguoiKia} chưa biết việc đó quan trọng với {xungTre}.",
        nenNoi: "“{GoiNguoiKia} ơi, {xungTre} xếp xong rồi, {goiNguoiKia} đừng xếp lại giúp {xungTre} ạ.”",
        nenTranh: "“{GoiNguoiKia} làm hỏng hết rồi!”",
      },
      "tieu-hoc": {
        tinhHuong:
          "{XungTre} muốn làm thật kỹ và đúng, còn {goiNguoiKia} nhắc “được rồi, xong đi”. {XungTre} thấy việc mình bị coi nhẹ; có thể {goiNguoiKia} lo {xungTre} mệt.",
        nenNoi: "“{GoiNguoiKia} ơi, {xungTre} làm kỹ thêm mười phút nữa rồi nghỉ ạ.”",
        nenTranh: "“{XungTre} chưa xong, đừng giục {xungTre}!”",
      },
      lon: {
        tinhHuong:
          "{XungTre} chuẩn bị rất kỹ và lo khi chưa chắc chắn, còn {goiNguoiKia} nói “cứ làm đi rồi tính”. {XungTre} thấy nỗi lo bị coi nhẹ; có thể {goiNguoiKia} muốn trấn an.",
        nenNoi: "“{GoiNguoiKia} ơi, {xungTre} thấy lo vì còn chưa chắc. {GoiNguoiKia} giúp {xungTre} liệt kê việc cần làm được không ạ?”",
        nenTranh: "“{GoiNguoiKia} chẳng hiểu {xungTre} đang lo gì.”",
      },
    },
    "toi-thap-hon": {
      nho: {
        tinhHuong:
          "{XungTre} chơi xong chưa kịp cất, còn {goiNguoiKia} muốn mọi thứ ngăn nắp. {XungTre} thấy bị nhắc hoài; có thể {goiNguoiKia} quen nhà gọn.",
        nenNoi: "“{GoiNguoiKia} ơi, {xungTre} chơi xong rồi {xungTre} cất cùng {goiNguoiKia} nhé.”",
        nenTranh: "“Cất làm gì, mai lại chơi!”",
      },
      "tieu-hoc": {
        tinhHuong:
          "{XungTre} làm bài nhanh gọn, còn {goiNguoiKia} xem kỹ từng chỗ. {XungTre} thấy bị soi; có thể {goiNguoiKia} muốn giúp {xungTre} làm trọn.",
        nenNoi: "“{GoiNguoiKia} ơi, {xungTre} làm xong rồi. {GoiNguoiKia} chỉ giúp {xungTre} một chỗ thôi, được không ạ?”",
        nenTranh: "“{GoiNguoiKia} chê hoài, {xungTre} chẳng làm nữa.”",
      },
      lon: {
        tinhHuong:
          "{XungTre} làm việc theo cách thoải mái, còn {goiNguoiKia} hay hỏi chi tiết và kiểm lại. {XungTre} thấy bị nghi ngờ; có thể {goiNguoiKia} lo lắng nên muốn chắc.",
        nenNoi: "“{GoiNguoiKia} ơi, {xungTre} muốn tự kiểm lại trước, rồi cho {goiNguoiKia} xem nếu cần ạ.”",
        nenTranh: "“{GoiNguoiKia} lúc nào cũng không tin {xungTre}.”",
      },
    },
  },
};

/**
 * 🔴 DÒNG AN TOÀN CỐ ĐỊNH cho cả phần trẻ → người lớn (rà soát nội dung 31/10/2026).
 *
 * Mọi ô ở trên tả người lớn bằng "có thể": một lý do nhẹ, không phải sự thật. Nhưng một đứa trẻ
 * đang bị đau hoặc sợ không được hiểu nội dung này là "cứ nói khéo hơn là ổn". Dòng này luôn đứng
 * cuối khối bảy ngày của bé, đủ để bé biết còn một lối ra: nói với một người lớn khác mà bé tin.
 */
export const CHU_AN_TOAN_TRE =
  "Nếu có ai làm {xungTre} đau hoặc sợ, hãy nói với một người lớn khác mà {xungTre} tin.";

/**
 * BẢY NGÀY THỬ cho BÉ — việc nhỏ do chính bé làm: nhận ra điều mình cần, NÓI RA, cảm ơn, ngồi
 * lại. Không có ngày nào giao bé đi chỉnh người lớn. Bậc `nho` ghi rõ "bố mẹ đọc cùng bé".
 */
export const KE_HOACH_TRE_VOI_NL: Readonly<Record<BacTre, readonly string[]>> = {
  nho: [
    "Ngày 1 — Người lớn đọc cùng bé. {XungTre} chỉ cần nhớ một việc làm {xungTre} vui hôm nay.",
    "Ngày 2 — Tập nói một câu: “{GoiNguoiKia} ơi, {xungTre} cần…”. Bé chọn điều mình cần (nước, chơi, nghỉ) và nói với {goiNguoiKia}.",
    "Ngày 3 — Khi {xungTre} thấy bực, tập nói “{xungTre} đang bực”. Nếu {xungTre} muốn được ôm thì nói “{xungTre} muốn được ôm”.",
    "Ngày 4 — Nói lời cảm ơn {goiNguoiKia} về một việc cụ thể: “Cảm ơn {goiNguoiKia} đã nấu cơm cho {xungTre}.”",
    "Ngày 5 — Cùng {goiNguoiKia} làm một việc nhỏ trong mười phút (xếp đồ, tưới cây, vẽ tranh).",
    "Ngày 6 — Kể cho {goiNguoiKia} nghe một chuyện {xungTre} thích nhất trong ngày.",
    "Ngày 7 — Cả nhà ngồi lại năm phút. Bé nói một điều vui và một điều chưa vui trong tuần, người lớn lắng nghe, rồi cùng chọn một điều giữ tiếp.",
  ],
  "tieu-hoc": [
    "Ngày 1 — Chỉ để ý. Hôm nay có việc gì làm {xungTre} thấy dễ chịu? Nhớ một việc, không cần nói.",
    "Ngày 2 — Nói một điều {xungTre} cần bằng câu bắt đầu “{xungTre} cần…” hoặc “{xungTre} muốn…”, thay vì “{goiNguoiKia} lúc nào cũng…”.",
    "Ngày 3 — Khi {xungTre} chưa kịp nghĩ, nói “{xungTre} cần thêm một phút ạ” rồi đợi, để {goiNguoiKia} biết {xungTre} đang suy nghĩ.",
    "Ngày 4 — Chọn lúc {goiNguoiKia} thoải mái để kể một chuyện ở trường, kể đến hết rồi hỏi {goiNguoiKia} một câu.",
    "Ngày 5 — Cùng {goiNguoiKia} làm một việc nhỏ, mỗi người một phần, rồi nói với nhau mình thấy thế nào.",
    "Ngày 6 — Nói cảm ơn {goiNguoiKia} một việc cụ thể và nói rõ việc đó là gì.",
    "Ngày 7 — Ngồi lại mười phút với {goiNguoiKia}. {XungTre} nói một điều thấy vui và một điều thấy khó trong tuần, {goiNguoiKia} cũng nói của mình, rồi cả hai chọn một điều giữ tiếp.",
  ],
  lon: [
    "Ngày 1 — Chỉ quan sát. Để ý điều gì làm {xungTre} thấy dễ chịu khi ở cạnh {goiNguoiKia}, và điều gì chưa.",
    "Ngày 2 — Viết ra một điều {xungTre} cần ở {goiNguoiKia} và vì sao, bằng một hai câu bắt đầu “{xungTre} cần… vì…”.",
    "Ngày 3 — Chọn lúc cả hai thoải mái để nói điều đã viết, dùng “{xungTre} cảm thấy…” thay vì “{goiNguoiKia} luôn…”.",
    "Ngày 4 — Hỏi {goiNguoiKia} một câu về ngày của {goiNguoiKia} và nghe hết.",
    "Ngày 5 — Nếu {xungTre} cần không gian riêng, nói trước giờ {xungTre} sẽ ra nói chuyện, thay vì đóng cửa im lặng.",
    "Ngày 6 — Cảm ơn {goiNguoiKia} một việc cụ thể trong tuần, nói thật lòng.",
    "Ngày 7 — Ngồi lại mười phút. {XungTre} và {goiNguoiKia} mỗi người nói một điều dễ chịu và một điều khó trong tuần, rồi chọn một điều giữ tiếp.",
  ],
};
