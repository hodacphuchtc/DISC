/**
 * NỘI DUNG THEO MỐI QUAN HỆ — vợ ↔ chồng, anh/chị ↔ em và người lớn khác ↔ người lớn (27.5).
 *
 * 🔴 BẢN NHÁP, CHƯA CÓ CHỮ KÝ CHUYÊN MÔN. Thuộc GÓI B (xem `GOI_KY_DUYET` ở
 * `disc-loi-khuyen.ts` và mục B5 của `docs/noi-dung-cho-ky-duyet-goi-b.md`). Cờ
 * `MO_NOI_DUNG_DOI` ở `disc-nguong.ts` tắt được cả khối trong 30 giây.
 *
 * Vì sao có file này: `disc-noi-dung-cap.ts` dùng MỘT khoá `ngang-vai` cho cả hai người lớn
 * lẫn hai anh chị em, nên câu nào cũng phải đủ chung để đúng với cả hai — và vì thế mờ. Ở
 * đây mỗi mối quan hệ có tình huống của chính nó.
 *
 * Bốn luật giữ nguyên từ `disc-noi-dung-cap.ts`:
 *  1. Đoạn nói về người kia phải LẬT KHUNG (điều dễ bị đọc thành chê thì kể lại như một
 *     nhu cầu có lý do).
 *  2. Không so hơn kém, không từ khuyết thiếu, không nghề nghiệp, không học lực.
 *  3. Không đoán nguyên nhân bên trong: chỉ mô tả VÒNG PHẢN ỨNG nhìn thấy được.
 *  4. Câu mẫu dùng "mình" và tên, KHÔNG dùng anh/chị/em/vợ/chồng — sản phẩm cố ý không thu
 *     giới tính và không biết thứ bậc.
 *
 * Chỗ giữ: `{toi}`/`{Toi}` (người đọc), `{nguoiKia}`/`{NguoiKia}` (tên trong sổ). Thay bằng
 * `thayDaiTuCap(chuoi, "ngang-vai", ten)`.
 */

import type { HuongLechCap } from "./disc-lech-cap";

import type { MaTruc } from "@modules/core/bo-de/kieu";

export const MOI_QUAN_HE = ["vo-chong", "anh-chi-em", "nguoi-lon-khac"] as const;
export type MoiQuanHe = (typeof MOI_QUAN_HE)[number];

export type TinhHuongDoi = {
  /** Một cảnh hằng ngày + vòng phản ứng của cả hai bên, bên nào cũng có lý do chính đáng. */
  readonly tinhHuong: string;
  /** Một câu người đọc có thể nói thật. */
  readonly nenNoi: string;
  /** Một câu hay bật ra lúc căng — kể để nhận ra, không để trách. */
  readonly nenTranh: string;
};

export const TINH_HUONG_DOI: Readonly<
  Record<MaTruc, Readonly<Record<HuongLechCap, Readonly<Record<MoiQuanHe, TinhHuongDoi>>>>>
> = {
  D: {
    "toi-cao-hon": {
      "vo-chong": {
        tinhHuong:
          "Chuyện chi tiêu hay kế hoạch cuối tuần: {toi} đã nghĩ xong và nói luôn kết luận. {NguoiKia} cần thêm một nhịp để cân nhắc nên chỉ đáp “để xem”. {Toi} đọc đó là chưa đồng ý và hỏi lại; {nguoiKia} thấy bị thúc nên nói càng ít.",
        nenNoi:
          "“Mình đang nghiêng về phương án này, {nguoiKia} thấy sao? Tối nay nghĩ thêm cũng được, mai mình nghe.”",
        nenTranh: "“Vậy là quyết xong rồi nhé.” hoặc “Sao cứ phải nghĩ lâu thế?”",
      },
      "anh-chi-em": {
        tinhHuong:
          "Hai người chọn trò chơi hoặc phim: {toi} đã chọn xong và rủ làm ngay. {NguoiKia} cần nghĩ thêm nên chưa trả lời; {toi} bắt đầu một mình, còn {nguoiKia} thấy mình bị bỏ lại phía sau.",
        nenNoi: "“Mình muốn chơi cái này. {NguoiKia} thấy sao? Muốn đổi thì nói mình nghe.”",
        nenTranh: "“Mình chọn rồi, theo đi.”",
      },
      "nguoi-lon-khac": {
        tinhHuong:
          "Bàn chuyện chung của cả nhà (đổi chỗ đồ, lịch đón bé, sửa nhà): {toi} đã nghĩ xong và nói thẳng kết luận. {NguoiKia} cần thêm một nhịp để cân nhắc và quen được hỏi ý trước, nên chỉ đáp “để xem”. {Toi} đọc đó là chưa đồng ý; {nguoiKia} thấy việc nhà đã bị định sẵn.",
        nenNoi: "“Mình nghĩ nên làm cách này. {NguoiKia} thấy sao? Cần thì tối nay mình bàn lại.”",
        nenTranh: "“Việc này tôi quyết rồi, không cần bàn nữa.”",
      },
    },
    "toi-thap-hon": {
      "vo-chong": {
        tinhHuong:
          "{NguoiKia} chốt kế hoạch rất nhanh, {toi} chưa kịp nghĩ xong nên gật tạm hoặc im lặng. Sau đó {toi} thấy lấn cấn, nhắc lại muộn; {nguoiKia} thấy như vừa bị đổi ý giữa chừng.",
        nenNoi:
          "“Cho mình tới tối nghĩ rồi trả lời nhé. Mình sẽ nói rõ là đồng ý hay muốn đổi.”",
        nenTranh: "“Gì cũng được.” rồi sau đó nhắc lại, hoặc “Sao giờ mới nói?”",
      },
      "anh-chi-em": {
        tinhHuong:
          "{NguoiKia} chọn nhanh và làm luôn. {Toi} chưa kịp nghĩ nên đi theo, xong mới thấy mình không thích. Nói ra muộn thì {nguoiKia} thấy như bị chê.",
        nenNoi: "“Cho mình một phút xem đã nhé, mình sẽ nói được hay không.”",
        nenTranh: "“Thôi gì cũng được.” rồi hờn.",
      },
      "nguoi-lon-khac": {
        tinhHuong:
          "{NguoiKia} chốt nhanh việc chung (lịch đón bé, chuyện chi tiêu), còn {toi} cần xem kỹ rồi mới nói. {Toi} gật tạm hoặc im, sau đó lấn cấn; {nguoiKia} thấy như đã thống nhất rồi mà vẫn bị nhắc lại.",
        nenNoi: "“Cho mình thời gian đến tối rồi mình trả lời rõ ràng nhé.”",
        nenTranh: "“Sao lúc nãy không nói luôn?”",
      },
    },
  },
  I: {
    "toi-cao-hon": {
      "vo-chong": {
        tinhHuong:
          "Tối về {toi} muốn kể hết chuyện trong ngày. {NguoiKia} cần một lúc yên trước khi nói chuyện. {Toi} hỏi dồn, {nguoiKia} đáp ngắn; {toi} thấy bị xa cách, còn {nguoiKia} thấy bị đòi hỏi.",
        nenNoi:
          "“Mình có chuyện muốn kể. {NguoiKia} cần nghỉ chút thì cứ nói, lát mình kể.”",
        nenTranh: "“Sao {nguoiKia} chẳng nói gì với mình hết vậy?”",
      },
      "anh-chi-em": {
        tinhHuong:
          "{Toi} kể chuyện liên tục lúc hai người ngồi cùng, trong khi {nguoiKia} cần yên để làm việc của mình. {Toi} nói tiếp, {nguoiKia} đóng cửa lại.",
        nenNoi: "“Mình có chuyện muốn kể. Giờ {nguoiKia} nghe được không, hay để lát?”",
        nenTranh: "“Nghe mình nói đi mà!”",
      },
      "nguoi-lon-khac": {
        tinhHuong:
          "{Toi} hay kể chuyện và bàn bạc nhiều lúc cả nhà ngồi cùng; {nguoiKia} cần yên để nghỉ hoặc làm việc riêng. {Toi} hỏi han thêm cho gần gũi, còn {nguoiKia} đáp ngắn để giữ khoảng yên.",
        nenNoi: "“Mình có chuyện muốn kể. {NguoiKia} nghe được lúc nào thì nói mình nhé.”",
        nenTranh: "“Sao {nguoiKia} chẳng chịu nói chuyện với mình?”",
      },
    },
    "toi-thap-hon": {
      "vo-chong": {
        tinhHuong:
          "{NguoiKia} kể nhiều và muốn được hỏi lại. {Toi} vẫn nghe nhưng ít đáp; {nguoiKia} đọc đó là thờ ơ. Thật ra {toi} đang nghe và cần thời gian để nói thành lời.",
        nenNoi:
          "“Mình đang nghe đây. Cho mình một lát nghĩ rồi mình nói lại ý mình nhé.”",
        nenTranh: "Im lặng không báo gì, hoặc “Mình mệt, đừng kể nữa.”",
      },
      "anh-chi-em": {
        tinhHuong:
          "{NguoiKia} hay rủ chơi và kể chuyện. Sau giờ học {toi} cần ở một mình một lúc, nên từ chối ngắn; {nguoiKia} thấy như bị bỏ rơi.",
        nenNoi: "“Mình muốn ở yên 15 phút, xong mình sang chơi với {nguoiKia}.”",
        nenTranh: "“Đi chỗ khác đi.”",
      },
      "nguoi-lon-khac": {
        tinhHuong:
          "{NguoiKia} hay bắt chuyện và muốn được hỏi lại; {toi} cần một lúc yên mới nói được. {Toi} lắng nghe nhưng ít đáp, và {nguoiKia} dễ đọc đó là thờ ơ.",
        nenNoi: "“Mình đang nghe đây. Cho mình một lát nghĩ rồi mình nói lại.”",
        nenTranh: "“Mình mệt, đừng kể nữa.”",
      },
    },
  },
  S: {
    "toi-cao-hon": {
      "vo-chong": {
        tinhHuong:
          "{NguoiKia} hay nghĩ ra thay đổi (đổi lịch, đổi chỗ). {Toi} quen nhịp cũ nên thấy bị xáo và nói “cứ như cũ đi”; {nguoiKia} thấy ý mình bị gạt đi.",
        nenNoi:
          "“Mình cần biết trước một ngày để chuẩn bị. Với việc này mình thử đổi một lần xem sao.”",
        nenTranh: "“Lúc nào cũng thay đổi, mệt lắm.”",
      },
      "anh-chi-em": {
        tinhHuong:
          "{NguoiKia} hay đổi ý, đổi chỗ; {toi} quen làm theo thứ tự cũ. {Toi} giữ đồ đạc và lịch như cũ, còn {nguoiKia} thấy bị chặn.",
        nenNoi:
          "“Mình quen làm theo thứ tự cũ. Mình thử đổi một lần, lần sau {nguoiKia} báo mình trước nhé.”",
        nenTranh: "“Không đổi, cứ như cũ.”",
      },
      "nguoi-lon-khac": {
        tinhHuong:
          "{NguoiKia} hay đề nghị đổi cách làm trong nhà (giờ ăn, chỗ để đồ, cách chăm bé); {toi} quen nhịp cũ nên thấy bị xáo và nói “cứ như cũ đi”. {NguoiKia} thấy ý của mình bị gạt đi.",
        nenNoi: "“Mình cần biết trước một ngày để quen. Việc này mình thử đổi một lần xem sao.”",
        nenTranh: "“Nhà này xưa nay vẫn làm thế, đổi làm gì.”",
      },
    },
    "toi-thap-hon": {
      "vo-chong": {
        tinhHuong:
          "{NguoiKia} giữ lịch quen thuộc, còn {toi} rủ đổi kế hoạch phút chót. {NguoiKia} chưa kịp xoay xở nên từ chối; {toi} thấy bị cứng nhắc.",
        nenNoi: "“Mình muốn thử cái mới ở việc này. Mình báo từ sáng được không?”",
        nenTranh: "“Sao không thử một lần cho biết?”",
      },
      "anh-chi-em": {
        tinhHuong:
          "{NguoiKia} có thói quen riêng (chỗ ngồi, giờ giấc) còn {toi} thay đổi liên tục. {NguoiKia} cáu lên, {toi} thấy khó hiểu vì mình chỉ muốn đổi cho vui.",
        nenNoi: "“Mình muốn đổi cái này. Ngày mai đổi, {nguoiKia} thấy được không?”",
        nenTranh: "“Có gì đâu mà phải giữ.”",
      },
      "nguoi-lon-khac": {
        tinhHuong:
          "{NguoiKia} giữ nếp quen trong nhà, còn {toi} hay đề nghị thử cách mới. {NguoiKia} chưa kịp xoay xở nên từ chối, và {toi} thấy đề nghị của mình khó được thử.",
        nenNoi: "“Mình muốn thử một cách khác ở việc này. Mình báo trước từ sáng được không?”",
        nenTranh: "“Cứ cứng nhắc mãi thì làm sao thay đổi được.”",
      },
    },
  },
  C: {
    "toi-cao-hon": {
      "vo-chong": {
        tinhHuong:
          "{Toi} muốn xem kỹ số liệu và chi tiết trước khi quyết, còn {nguoiKia} thấy đại khái là đủ. {Toi} chỉnh lại từng chi tiết; {nguoiKia} thấy như bị soi.",
        nenNoi:
          "“Mình thấy cái này cần xem kỹ hơn một chút. Mình tự tra rồi tóm lại cho {nguoiKia} hai dòng nhé.”",
        nenTranh: "“Chỗ này sai rồi.”",
      },
      "anh-chi-em": {
        tinhHuong:
          "{Toi} muốn chơi đúng luật từng bước, còn {nguoiKia} chơi thoải mái. {Toi} sửa liên tục vì muốn trò chơi diễn ra cho trọn vẹn; {nguoiKia} thấy mình lúc nào cũng làm sai nên bỏ cuộc giữa chừng, và cả hai đều tiếc ván chơi.",
        nenNoi: "“Mình hay để ý luật. Mình nhắc một lần thôi, còn lại cứ chơi vui nhé.”",
        nenTranh: "“Sai rồi, làm lại!”",
      },
      "nguoi-lon-khac": {
        tinhHuong:
          "{Toi} muốn việc chung (sổ chi tiêu, lịch đưa đón) rõ ràng từng chi tiết; {nguoiKia} thấy đại khái là đủ. {Toi} hỏi lại từng khoản, còn {nguoiKia} thấy như bị kiểm tra.",
        nenNoi: "“Mình thấy khoản này cần ghi rõ. Mình tự ghi rồi báo lại {nguoiKia} hai dòng thôi.”",
        nenTranh: "“Khoản này sai rồi, sao không ghi cho đúng?”",
      },
    },
    "toi-thap-hon": {
      "vo-chong": {
        tinhHuong:
          "{NguoiKia} muốn xem kỹ từng khoản, còn {toi} chỉ cần nắm ý chính. Khi bị hỏi chi tiết {toi} thấy như bị kiểm tra, còn {nguoiKia} chỉ muốn chắc chắn.",
        nenNoi:
          "“Mình chưa nhớ chi tiết, tối mình xem lại rồi trả lời. Còn ý chính là…”",
        nenTranh: "“Sao phải tính chi li vậy?”",
      },
      "anh-chi-em": {
        tinhHuong:
          "{NguoiKia} muốn mọi thứ cho đúng, còn {toi} làm đại khái cho nhanh. Bị sửa nhiều thì {toi} thấy mất vui, trong khi {nguoiKia} chỉ muốn giúp.",
        nenNoi: "“Mình chưa rành chỗ này, {nguoiKia} chỉ mình một lần nhé, mình thử.”",
        nenTranh: "“Làm gì mà căng thế.”",
      },
      "nguoi-lon-khac": {
        tinhHuong:
          "{NguoiKia} muốn việc chung rõ ràng từng khoản, còn {toi} chỉ cần nắm ý chính. Khi bị hỏi chi tiết {toi} thấy như bị kiểm tra, trong khi {nguoiKia} chỉ muốn chắc chắn.",
        nenNoi: "“Mình chưa nhớ chi tiết, tối mình xem lại rồi trả lời. Ý chính là…”",
        nenTranh: "“Sao phải tính chi li vậy?”",
      },
    },
  },
};

/**
 * BẢY NGÀY THỬ — khuôn theo mối quan hệ, KHÔNG theo trục (mỗi ngày một việc nhỏ).
 *
 * Cố ý không theo trục: bảy ngày × bốn trục × hai hướng × hai quan hệ là 112 câu, và phần
 * lớn sẽ đọc như nhau. Nội dung theo trục đã nằm ở `TINH_HUONG_DOI`; đây là cái khung để
 * thử nó. Ngày 7 luôn là ngồi lại, đúng tinh thần "hai tuần rồi xem lại" của THOA_THUAN.
 */
export const KE_HOACH_BAY_NGAY: Readonly<Record<MoiQuanHe, readonly string[]>> = {
  "vo-chong": [
    "Ngày 1 — Chỉ quan sát. Để ý một lần {nguoiKia} làm việc đúng theo cách của {nguoiKia}, và không nhận xét gì.",
    "Ngày 2 — Hỏi một câu mở: “Hôm nay có gì làm {nguoiKia} vui hay phiền?” Rồi nghe đủ hai phút, không chen.",
    "Ngày 3 — Nói một điều {toi} cần bằng “mình cần…”, thay vì “{nguoiKia} lúc nào cũng…”.",
    "Ngày 4 — Chọn một việc nhà nhỏ, để {nguoiKia} làm theo cách của {nguoiKia}. Không sửa lại.",
    "Ngày 5 — Dành mười phút không điện thoại, theo nhịp {nguoiKia} cần: kể chuyện, hoặc ngồi yên cạnh nhau.",
    "Ngày 6 — Cảm ơn một việc cụ thể {nguoiKia} đã làm trong tuần, nói rõ việc đó là gì.",
    "Ngày 7 — Ngồi lại mười phút. {Toi} và {nguoiKia} mỗi người kể một lần thấy dễ chịu và một lần thấy khó, rồi chọn một điều giữ sang tuần sau.",
  ],
  "anh-chi-em": [
    "Ngày 1 — Chỉ để ý. Hôm nay {nguoiKia} làm gì đúng theo cách của {nguoiKia}? Nhớ một việc, không cần nói.",
    "Ngày 2 — Hỏi {nguoiKia}: “Hôm nay có gì vui hoặc khó chịu không?” Nghe hết rồi mới kể chuyện của mình.",
    "Ngày 3 — Nói một điều {toi} cần bằng “mình muốn…”, thay vì “{nguoiKia} cứ…”.",
    "Ngày 4 — Để {nguoiKia} chọn trò chơi hoặc cách làm một lần, và đi theo tới cuối.",
    "Ngày 5 — Mười phút chơi chung theo cách {nguoiKia} thích, hoặc mười phút yên ai làm việc nấy nếu {nguoiKia} cần thế.",
    "Ngày 6 — Nói cảm ơn một việc cụ thể {nguoiKia} đã làm, nói rõ việc đó là gì.",
    "Ngày 7 — Ngồi lại năm phút cùng nhau. {Toi} và {nguoiKia} mỗi người nói một điều thấy vui và một điều thấy khó trong tuần, rồi chọn một điều giữ tiếp.",
  ],
  "nguoi-lon-khac": [
    "Ngày 1 — Chỉ quan sát. Để ý một lần {nguoiKia} làm việc đúng theo nếp của {nguoiKia}, và không nhận xét.",
    "Ngày 2 — Hỏi một câu mở: “{nguoiKia} thấy cách sắp xếp trong nhà dạo này thế nào?” Rồi nghe đủ hai phút, không chen.",
    "Ngày 3 — Nói một việc {toi} cần bằng “mình cần…”, thay vì “{nguoiKia} lúc nào cũng…”.",
    "Ngày 4 — Chọn một việc chung nhỏ, để {nguoiKia} làm theo cách của {nguoiKia} và không sửa lại.",
    "Ngày 5 — Dành mười phút cùng nhau, không điện thoại, theo nhịp {nguoiKia} cần: trò chuyện hoặc ngồi yên.",
    "Ngày 6 — Cảm ơn một việc cụ thể {nguoiKia} đã làm cho cả nhà trong tuần.",
    "Ngày 7 — Ngồi lại mười phút. {Toi} và {nguoiKia} mỗi người nói một điều thấy dễ chịu và một điều thấy khó trong cách sống chung, rồi chọn một điều giữ sang tuần sau.",
  ],
};
