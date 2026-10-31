/**
 * KHI HAI NGƯỜI CÙNG NHỊP — một tình huống và một việc nuôi tiếp, cho từng loại cặp (29.5).
 *
 * `trungKhop` từng chỉ hiện MỘT câu chung (`TRUNG_KHOP`). "Cùng nhịp" không có nghĩa là hết việc
 * phải làm: hai người giống nhau thường có điểm mạnh chung VÀ một chỗ cùng dễ trượt (cùng chờ
 * nhau, cùng muốn quyết, cùng ít nói…). Mỗi ô nói đúng hai điều đó, rồi gợi ý MỘT việc nuôi tiếp.
 *
 * Khoá: loại cặp × trục × kiểu (`cung-noi` = cả hai cùng nổi ở nhóm này; `cung-nhe` = cả hai
 * cùng nhẹ). Không theo bậc của bé — "cùng nhịp" là chuyện chung, và giữ file này gọn.
 *
 * 🔴 BẢN NHÁP, CHƯA CÓ CHỮ KÝ CHUYÊN MÔN. Phần có trẻ (`nguoi-lon-voi-tre`, `tre-voi-nguoi-lon`)
 * thuộc GÓI A; phần giữa người lớn (`vo-chong`, `nguoi-lon-khac`) thuộc GÓI B; `anh-chi-em`
 * thuộc GÓI A khi cả hai là trẻ.
 * 🔴 NẠP LƯỜI: chỉ `noi-dung-doi.tsx` import file này.
 *
 * Luật giữ nguyên: bên nào cũng có lý; không so hơn kém / khuyết thiếu / nghề / học lực; không
 * giao trẻ việc điều chỉnh người lớn (`tre-voi-nguoi-lon` chỉ nói việc bé tự làm); và với cặp
 * mà hai chiều dùng chung chữ (`vo-chong`, `anh-chi-em`, `nguoi-lon-khac`) mọi câu dài đều mang
 * `{nguoiKia}` để hai chiều không dùng chung một câu.
 */

import type { KieuTrungKhop, MoiQuanHeCap } from "./disc-lech-cap";

import type { MaTruc } from "@modules/core/bo-de/kieu";

export type CungNhip = {
  /** Điểm mạnh chung và chỗ cùng dễ trượt. */
  readonly tinhHuong: string;
  /** Một việc nhỏ để nuôi tiếp. */
  readonly nuoiTiep: string;
};

export const CUNG_NHIP: Readonly<
  Record<MoiQuanHeCap, Readonly<Record<MaTruc, Readonly<Record<KieuTrungKhop, CungNhip>>>>>
> = {
  "vo-chong": {
    D: {
      "cung-noi": {
        tinhHuong:
          "{Toi} và {nguoiKia} đều quyết nhanh nên việc chung ít khi bị treo. Chỗ dễ trượt giữa {toi} và {nguoiKia} là cả hai cùng chốt trước khi hỏi ý nhau, rồi mới thấy mỗi người đang đi một đường.",
        nuoiTiep:
          "Trước khi chốt việc lớn, mỗi người nói một câu “mình nghiêng về…” rồi dừng ba giây để nghe {nguoiKia}.",
      },
      "cung-nhe": {
        tinhHuong:
          "{Toi} và {nguoiKia} đều thích nhìn kỹ trước khi quyết nên ít phải quay lại sửa. Chỗ dễ trượt giữa {toi} và {nguoiKia} là cả hai cùng chờ người kia mở lời nên việc nằm đó lâu.",
        nuoiTiep:
          "Đặt hạn cho mỗi việc đang treo: đến thứ Sáu, ai nêu đề xuất đầu tiên thì {toi} và {nguoiKia} chốt trong ngày.",
      },
    },
    I: {
      "cung-noi": {
        tinhHuong:
          "{Toi} và {nguoiKia} đều dễ bắt chuyện nên nhà thường vui. Chỗ dễ trượt giữa {toi} và {nguoiKia} là ít có khoảng lặng, nên chuyện khó dễ trôi qua giữa những chuyện vui.",
        nuoiTiep:
          "Mỗi tối hai lượt: {toi} nói hai phút rồi {nguoiKia} nói hai phút, người kia chỉ nghe.",
      },
      "cung-nhe": {
        tinhHuong:
          "{Toi} và {nguoiKia} đều cần quãng yên nên ở cạnh nhau rất nhẹ. Chỗ dễ trượt giữa {toi} và {nguoiKia} là chuyện khó cứ để đó vì không ai là người mở lời.",
        nuoiTiep:
          "Hẹn một lúc cố định mỗi tuần để {toi} và {nguoiKia} mỗi người nói một điều đang giữ trong lòng, một câu thôi.",
      },
    },
    S: {
      "cung-noi": {
        tinhHuong:
          "{Toi} và {nguoiKia} đều giữ nhịp đều nên rất dễ dựa vào nhau. Chỗ dễ trượt giữa {toi} và {nguoiKia} là cả hai cùng ngại phá nhịp, nên điều cần đổi bị hoãn mãi.",
        nuoiTiep:
          "Mỗi tháng cùng {nguoiKia} thử một thay đổi nhỏ (đổi một món, đổi một lối đi) rồi xem cả hai thấy thế nào.",
      },
      "cung-nhe": {
        tinhHuong:
          "{Toi} và {nguoiKia} đều linh hoạt nên đổi kế hoạch rất dễ. Chỗ dễ trượt giữa {toi} và {nguoiKia} là không ai giữ nếp, nên nhà thiếu một nhịp ổn định để dựa vào.",
        nuoiTiep:
          "Chọn một nếp cố định (bữa tối chung hoặc giờ ngủ) để {toi} và {nguoiKia} cùng giữ trong một tháng.",
      },
    },
    C: {
      "cung-noi": {
        tinhHuong:
          "{Toi} và {nguoiKia} đều chú ý chi tiết nên việc nhà được làm kỹ. Chỗ dễ trượt giữa {toi} và {nguoiKia} là cả hai cùng bắt lỗi nhau, và một chi tiết nhỏ thành một cuộc tranh luận.",
        nuoiTiep:
          "Thống nhất với {nguoiKia} một danh sách ngắn những việc cần làm thật đúng; còn lại cả hai cùng chấp nhận “đủ rồi”.",
      },
      "cung-nhe": {
        tinhHuong:
          "{Toi} và {nguoiKia} đều thoải mái với chi tiết nên nhà nhẹ nhàng. Chỗ dễ trượt giữa {toi} và {nguoiKia} là sót một việc quan trọng vì mỗi bên tưởng bên kia đã lo.",
        nuoiTiep:
          "Cùng {nguoiKia} ghi ra giấy ba việc không được sót trong tuần và treo ở chỗ cả hai nhìn thấy.",
      },
    },
  },
  "anh-chi-em": {
    D: {
      "cung-noi": {
        tinhHuong:
          "{Toi} và {nguoiKia} đều muốn quyết và bắt đầu ngay nên chơi rất sôi nổi. Chỗ dễ trượt giữa {toi} và {nguoiKia} là cả hai cùng muốn chọn trước nên giằng co.",
        nuoiTiep:
          "Chia lượt chọn với {nguoiKia}: hôm nay {toi} chọn, mai {nguoiKia} chọn, và nói to khi đổi lượt.",
      },
      "cung-nhe": {
        tinhHuong:
          "{Toi} và {nguoiKia} đều không vội chọn nên chơi nhẹ nhàng. Chỗ dễ trượt giữa {toi} và {nguoiKia} là cả hai cùng “gì cũng được” nên chẳng ai bắt đầu.",
        nuoiTiep:
          "Đổi lượt đề xuất trước: hôm nay {toi} nêu một trò, mai {nguoiKia} nêu một trò.",
      },
    },
    I: {
      "cung-noi": {
        tinhHuong:
          "{Toi} và {nguoiKia} đều hay kể và hay nói nên luôn có chuyện. Chỗ dễ trượt giữa {toi} và {nguoiKia} là cả hai cùng nói một lúc nên chẳng ai nghe hết.",
        nuoiTiep:
          "Chia lượt kể với {nguoiKia}: mỗi người kể trọn một chuyện, người kia chỉ được hỏi một câu.",
      },
      "cung-nhe": {
        tinhHuong:
          "{Toi} và {nguoiKia} đều thích ở yên nên ngồi cạnh nhau rất êm. Chỗ dễ trượt giữa {toi} và {nguoiKia} là nhiều điều muốn nói mà không ai bắt đầu.",
        nuoiTiep:
          "Mỗi ngày {toi} nói với {nguoiKia} một điều mình thích về hôm nay, chỉ một câu.",
      },
    },
    S: {
      "cung-noi": {
        tinhHuong:
          "{Toi} và {nguoiKia} đều quen nếp nên rất dễ chơi và sống chung. Chỗ dễ trượt giữa {toi} và {nguoiKia} là cả hai cùng ngại thử cái mới.",
        nuoiTiep:
          "Mỗi tuần thử cùng {nguoiKia} một trò hoặc một cách chơi mới, chỉ một lần.",
      },
      "cung-nhe": {
        tinhHuong:
          "{Toi} và {nguoiKia} đều thích đổi và thử nên không bao giờ chán. Chỗ dễ trượt giữa {toi} và {nguoiKia} là đồ đạc và lịch chơi hay xáo trộn vì không ai giữ nếp.",
        nuoiTiep:
          "Chọn một việc cố định mà {toi} và {nguoiKia} cùng giữ mỗi ngày, ví dụ cất đồ chơi sau khi chơi.",
      },
    },
    C: {
      "cung-noi": {
        tinhHuong:
          "{Toi} và {nguoiKia} đều làm kỹ và đúng luật nên chơi công bằng. Chỗ dễ trượt giữa {toi} và {nguoiKia} là cả hai cùng bắt lỗi nhau nên mất vui.",
        nuoiTiep:
          "Nhắc luật một lần đầu trò chơi, sau đó {toi} và {nguoiKia} cùng chơi vui, không sửa nhau giữa chừng.",
      },
      "cung-nhe": {
        tinhHuong:
          "{Toi} và {nguoiKia} đều thoải mái nên chơi dễ chịu. Chỗ dễ trượt giữa {toi} và {nguoiKia} là quên luật hoặc quên cất đồ vì mỗi bên tưởng bên kia đã lo.",
        nuoiTiep:
          "Cùng {nguoiKia} chọn một việc “ai chơi thì người đó cất” và nhắc nhau bằng một dấu hiệu vui.",
      },
    },
  },
  "nguoi-lon-khac": {
    D: {
      "cung-noi": {
        tinhHuong:
          "{Toi} và {nguoiKia} đều quyết nhanh nên việc chung của nhà gọn gàng. Chỗ dễ trượt giữa {toi} và {nguoiKia} là cả hai cùng nói “để mình lo” rồi làm trùng việc của nhau.",
        nuoiTiep:
          "Mỗi tuần chia rõ với {nguoiKia} ai đứng ra việc chung nào; người kia chỉ hỏi khi cần.",
      },
      "cung-nhe": {
        tinhHuong:
          "{Toi} và {nguoiKia} đều cân nhắc kỹ nên ít va chạm. Chỗ dễ trượt giữa {toi} và {nguoiKia} là việc chung nằm chờ vì không ai nêu trước.",
        nuoiTiep:
          "Đặt một ngày cố định mỗi tuần để {toi} và {nguoiKia} ngồi chốt việc chung.",
      },
    },
    I: {
      "cung-noi": {
        tinhHuong:
          "{Toi} và {nguoiKia} đều cởi mở nên nhà đầm ấm. Chỗ dễ trượt giữa {toi} và {nguoiKia} là chuyện nghiêm túc bị lẫn vào chuyện vui và không được bàn tới.",
        nuoiTiep:
          "Chọn một lúc mỗi tuần để {toi} và {nguoiKia} nói riêng một chuyện nghiêm túc, còn lại cứ vui.",
      },
      "cung-nhe": {
        tinhHuong:
          "{Toi} và {nguoiKia} đều ít nói nên sống chung rất yên. Chỗ dễ trượt giữa {toi} và {nguoiKia} là ít biết người kia đang nghĩ gì.",
        nuoiTiep:
          "Mỗi ngày hỏi {nguoiKia} một câu nhỏ như “hôm nay ổn không?” và nghe câu trả lời.",
      },
    },
    S: {
      "cung-noi": {
        tinhHuong:
          "{Toi} và {nguoiKia} đều giữ nếp nên nhà có nhịp rất ổn định. Chỗ dễ trượt giữa {toi} và {nguoiKia} là cả hai cùng ngại đổi nên những chỗ cần đổi cứ để nguyên.",
        nuoiTiep:
          "Mỗi tháng {toi} cùng {nguoiKia} rà một nếp cũ và hỏi xem nó còn hợp với cả nhà không.",
      },
      "cung-nhe": {
        tinhHuong:
          "{Toi} và {nguoiKia} đều linh hoạt nên thích nghi nhanh. Chỗ dễ trượt giữa {toi} và {nguoiKia} là nhà thiếu một vài nếp cố định để cả nhà dựa vào.",
        nuoiTiep:
          "Chọn một nếp chung (bữa tối cả nhà hoặc giờ họp nhà) để {toi} và {nguoiKia} cùng giữ.",
      },
    },
    C: {
      "cung-noi": {
        tinhHuong:
          "{Toi} và {nguoiKia} đều coi trọng chi tiết nên sổ sách và lịch rất rõ. Chỗ dễ trượt giữa {toi} và {nguoiKia} là cả hai cùng kiểm lại nhau.",
        nuoiTiep:
          "Chia với {nguoiKia} mỗi người một mảng và tin mảng của nhau, chỉ gặp lại khi có số bất thường.",
      },
      "cung-nhe": {
        tinhHuong:
          "{Toi} và {nguoiKia} đều thoải mái nên nhà dễ chịu. Chỗ dễ trượt giữa {toi} và {nguoiKia} là sót hạn hoặc khoản quan trọng vì mỗi bên tưởng bên kia đã lo.",
        nuoiTiep:
          "Cùng {nguoiKia} ghi các hạn quan trọng vào một tờ lịch chung ở chỗ cả nhà nhìn thấy.",
      },
    },
  },
  "nguoi-lon-voi-tre": {
    D: {
      "cung-noi": {
        tinhHuong:
          "{Toi} và {nguoiKia} đều quyết đoán nên có nhiều ý kiến riêng. Chỗ dễ trượt là cả hai cùng muốn là người quyết, và buổi nói chuyện dễ thành giằng co.",
        nuoiTiep:
          "Chia việc theo mảng: {nguoiKia} quyết một phần của buổi tối, {toi} quyết phần còn lại, và nói trước từ đầu.",
      },
      "cung-nhe": {
        tinhHuong:
          "{Toi} và {nguoiKia} đều thận trọng nên hay cùng chờ nhau. Chỗ dễ trượt là bữa tối hoặc kế hoạch cuối tuần chẳng ai nêu, đến sát giờ mới vội.",
        nuoiTiep:
          "Hỏi {nguoiKia} trước một ngày “mai mình làm gì?” và cho {nguoiKia} chọn một trong hai.",
      },
    },
    I: {
      "cung-noi": {
        tinhHuong:
          "{Toi} và {nguoiKia} đều thích kể và thích trò chuyện nên bữa cơm rộn ràng. Chỗ dễ trượt là ai cũng kể mà chẳng ai nghe hết.",
        nuoiTiep:
          "Đặt luật bữa cơm “kể trọn”: mỗi người, kể cả {nguoiKia}, được kể hết một chuyện không bị ngắt.",
      },
      "cung-nhe": {
        tinhHuong:
          "{Toi} và {nguoiKia} đều ít nói nên bên nhau rất nhẹ nhàng. Chỗ dễ trượt là hai bên đều đợi người kia mở lời nên điều cần nói để lâu.",
        nuoiTiep:
          "Cuối ngày hỏi {nguoiKia} đúng một câu, ví dụ “hôm nay có điều gì làm {nguoiKia} vui không?”, và chờ.",
      },
    },
    S: {
      "cung-noi": {
        tinhHuong:
          "{Toi} và {nguoiKia} đều thích nếp quen nên nhà rất ổn định. Chỗ dễ trượt là cả hai cùng ngại thay đổi, kể cả khi {nguoiKia} đã lớn thêm một bậc.",
        nuoiTiep:
          "Mỗi tháng cùng {nguoiKia} thử một thay đổi nhỏ, ví dụ một món mới hoặc một lối đi khác, rồi hỏi {nguoiKia} thấy sao.",
      },
      "cung-nhe": {
        tinhHuong:
          "{Toi} và {nguoiKia} đều linh hoạt nên đổi kế hoạch dễ dàng. Chỗ dễ trượt là nhà ít nếp cố định để bé dựa vào.",
        nuoiTiep:
          "Chọn một nếp cố định cho {nguoiKia} (giờ ngủ hoặc bữa tối) và cùng giữ trong một tháng.",
      },
    },
    C: {
      "cung-noi": {
        tinhHuong:
          "{Toi} và {nguoiKia} đều chú ý chi tiết nên việc được làm kỹ. Chỗ dễ trượt là cả hai cùng muốn cho đúng nên căng thẳng lúc làm bài hoặc dọn dẹp.",
        nuoiTiep:
          "Thống nhất với {nguoiKia} thế nào là “đủ rồi” cho từng việc và dừng đúng lúc đó.",
      },
      "cung-nhe": {
        tinhHuong:
          "{Toi} và {nguoiKia} đều thoải mái nên nhà nhẹ nhàng. Chỗ dễ trượt là sót việc quan trọng như đồ dùng học tập hoặc hẹn lịch vì mỗi bên tưởng bên kia đã lo.",
        nuoiTiep:
          "Cùng {nguoiKia} chuẩn bị đồ cho ngày mai vào một giờ cố định mỗi tối.",
      },
    },
  },
  "tre-voi-nguoi-lon": {
    D: {
      "cung-noi": {
        tinhHuong:
          "{XungTre} và {goiNguoiKia} đều thích quyết nhanh nên làm gì cũng hăng. Chỗ dễ trượt là cả hai cùng muốn theo ý mình lúc gấp.",
        nuoiTiep:
          "{XungTre} thử nói trước một câu khi gấp: “{GoiNguoiKia} cho {xungTre} nói một câu rồi {goiNguoiKia} nói ạ.”",
      },
      "cung-nhe": {
        tinhHuong:
          "{XungTre} và {goiNguoiKia} đều cẩn thận nên ít xảy ra va chạm. Chỗ dễ trượt là cả hai cùng chờ nhau nói trước.",
        nuoiTiep:
          "{XungTre} thử là người đề nghị một việc nhỏ cho cuối tuần với {goiNguoiKia}, chỉ một câu.",
      },
    },
    I: {
      "cung-noi": {
        tinhHuong:
          "{XungTre} và {goiNguoiKia} đều thích trò chuyện nên nói với nhau rất vui. Chỗ dễ trượt là cả hai cùng nói một lúc nên chẳng ai nghe hết.",
        nuoiTiep:
          "{XungTre} thử nói “{xungTre} kể xong, {goiNguoiKia} kể nhé” để mỗi người một lượt.",
      },
      "cung-nhe": {
        tinhHuong:
          "{XungTre} và {goiNguoiKia} đều ít nói nên bên nhau rất yên. Chỗ dễ trượt là điều cần nói để lâu vì cả hai đều chờ.",
        nuoiTiep:
          "Mỗi tối {xungTre} thử kể với {goiNguoiKia} một điều nhỏ trong ngày, chỉ một câu.",
      },
    },
    S: {
      "cung-noi": {
        tinhHuong:
          "{XungTre} và {goiNguoiKia} đều thích nếp quen nên rất dễ chịu bên nhau. Chỗ dễ trượt là cả hai cùng ngại thử cái mới.",
        nuoiTiep:
          "{XungTre} thử nói với {goiNguoiKia} một điều {xungTre} muốn thử, nếu {xungTre} muốn.",
      },
      "cung-nhe": {
        tinhHuong:
          "{XungTre} và {goiNguoiKia} đều dễ đổi nên rất linh hoạt. Chỗ dễ trượt là lịch chung hay bị lộn xộn.",
        nuoiTiep:
          "{XungTre} thử cùng {goiNguoiKia} chọn một nếp nhỏ để giữ mỗi ngày, ví dụ bữa tối chung.",
      },
    },
    C: {
      "cung-noi": {
        tinhHuong:
          "{XungTre} và {goiNguoiKia} đều coi trọng chi tiết nên việc làm kỹ. Chỗ dễ trượt là cả hai cùng bắt lỗi nhau.",
        nuoiTiep:
          "{XungTre} thử nói “việc này {xungTre} làm đủ tốt rồi ạ” khi đã làm xong phần cần thiết.",
      },
      "cung-nhe": {
        tinhHuong:
          "{XungTre} và {goiNguoiKia} đều thoải mái nên dễ chịu bên nhau. Chỗ dễ trượt là quên một việc quan trọng vì mỗi bên tưởng bên kia đã lo.",
        nuoiTiep:
          "{XungTre} thử nói với {goiNguoiKia} một việc {xungTre} cần nhớ cho ngày mai để người lớn ghi giúp.",
      },
    },
  },
};
