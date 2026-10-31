/**
 * ĐỒNG HÀNH CÙNG CON KHI HAI GÓC NHÌN LỆCH NHAU (28.5).
 *
 * Màn "Hai góc nhìn về {ten}" cho biết con tự thấy mình thế nào và bố mẹ thấy con thế nào.
 * Biết chỗ lệch chưa đủ: bố mẹ hỏi ngay "vậy tôi làm gì với con mỗi ngày?". File này trả lời
 * câu đó, theo từng trục × hướng lệch × bậc học của con.
 *
 * 🔴 BẢN NHÁP GÓI A, CHƯA CÓ CHỮ KÝ CHUYÊN MÔN (xem `GOI_KY_DUYET` và mục A-ĐỒNG-HÀNH của
 * `docs/noi-dung-cho-ky-duyet.md`). Nội dung về trẻ nên nằm sau cờ `MO_NOI_DUNG_TRE`.
 *
 * 🔴 NẠP LƯỜI. File này ~130 chuỗi và chỉ cần khi mở màn đối chiếu. `app/components/
 * dong-hanh-voi-con.tsx` là nơi DUY NHẤT import nó và chính nó được nạp bằng `React.lazy` —
 * gói chính chỉ còn dư vài KB so với trần 300 KB. Đừng import file này từ chỗ nào khác.
 *
 * Năm luật giữ nguyên từ `disc-doi-chieu.ts`, `disc-loi-khuyen.ts` và `disc-noi-dung-cap.ts`:
 *  1. LỆCH KHÔNG PHẢI LỖI. Hai góc nhìn khác nhau là tín hiệu về NGỮ CẢNH (nhà / lớp / bạn
 *     bè), không phải ai sai. Cả hai phía đều được tả bằng một lý do có lý.
 *  2. Việc dành cho BỐ MẸ làm, không giao con "sửa mình". Mọi gợi ý là việc bố mẹ làm trước.
 *  3. Không chẩn đoán, không so hơn kém, không nghề nghiệp, không học lực.
 *  4. Không nói bản chất ("con LÀ người…"); nói điều con có thể đang trải qua.
 *  5. Câu "nên tránh" để NHẬN RA lúc căng thẳng, không để trách bố mẹ.
 *
 * Chỗ giữ duy nhất: `{ten}` = tên con. Người viết ở "con", không dùng anh/chị/em.
 */

import type { MaTruc } from "@modules/core/bo-de/kieu";

export type HuongDongHanh = "con-cao-hon" | "con-thap-hon";
export type BacDongHanh = "TH" | "THCS";
export const HUONG_DONG_HANH: readonly HuongDongHanh[] = ["con-cao-hon", "con-thap-hon"];
export const BAC_DONG_HANH: readonly BacDongHanh[] = ["TH", "THCS"];

/** Phần KHÔNG đổi theo bậc học: hai góc nhìn khác nhau ở đâu, và dấu hiệu việc làm có tác dụng. */
export type ChungDongHanh = {
  /** Vì sao bố mẹ có thể đang thấy như vậy (ngữ cảnh, không lỗi). */
  readonly boMeThay: string;
  /** Con có thể đang trải qua điều gì. */
  readonly conThay: string;
  /** Dấu hiệu nhỏ cho biết cách đồng hành đang có tác dụng. */
  readonly dauHieu: string;
};

/** Phần ĐỔI theo bậc học: việc hằng ngày, câu mẫu, câu hỏi — lời lẽ hợp tuổi. */
export type TheoBacDongHanh = {
  readonly sang: string;
  readonly sauGioHoc: string;
  readonly truocKhiNgu: string;
  /** Một câu bố mẹ nói thật được. */
  readonly nenNoi: string;
  /** Một câu hay bật ra lúc căng — kể để nhận ra, không để trách. */
  readonly nenTranh: string;
  /** Một câu hỏi mở để hỏi con. */
  readonly cauHoi: string;
};

export const DONG_HANH_CHUNG: Readonly<
  Record<MaTruc, Readonly<Record<HuongDongHanh, ChungDongHanh>>>
> = {
  D: {
    "con-cao-hon": {
      boMeThay:
        "Ở nhà {ten} thường chờ người lớn quyết, nên bố mẹ ít có dịp thấy con cầm trịch và nghĩ con chủ động vừa phải.",
      conThay:
        "Con thấy mình có chính kiến, hay nghĩ ra cách làm, nhất là ở lớp và chỗ bạn bè. Ở nhà con có thể đang nhường vì nghĩ người lớn đã có sẵn đáp án.",
      dauHieu:
        "Con tự đề xuất cách làm hoặc kể mình đã nghĩ ra cách gì ở lớp; con bớt cãi vì thấy ý mình được nghe.",
    },
    "con-thap-hon": {
      boMeThay:
        "Nhìn từ ngoài {ten} ra yêu cầu, đòi tự làm, quyết nhanh, nên bố mẹ quen nghĩ con rất mạnh mẽ.",
      conThay:
        "Con thấy mình hay đắn đo và không chắc ý mình đúng. Bên trong con có thể đang tự hỏi nhiều hơn vẻ ngoài bố mẹ nhìn thấy.",
      dauHieu:
        "Con mở đầu bằng “con nghĩ là…” mà không ngó bố mẹ trước; con chịu nói ra khi chưa chắc thay vì cãi hay im.",
    },
  },
  I: {
    "con-cao-hon": {
      boMeThay:
        "Ở nhà {ten} ít kể chuyện, nên bố mẹ nghe được ít chuyện trường lớp và nghĩ con kín tiếng.",
      conThay:
        "Con thấy mình hay nói, hay kết bạn, có nhiều chuyện để kể. Có thể ở nhà chưa ai hỏi đúng lúc con muốn kể.",
      dauHieu:
        "Con tự kể một chuyện trong ngày mà không cần hỏi, và chuyện con kể dài hơn trước.",
    },
    "con-thap-hon": {
      boMeThay:
        "Ở nhà {ten} vui vẻ, hay kể, nên bố mẹ nghĩ con thoải mái ở mọi nơi.",
      conThay:
        "Con thấy mình ngại ở chỗ đông người và ít khi dám nói trước lớp. Sự hoạt bát ở nhà chưa chắc theo con ra ngoài.",
      dauHieu:
        "Con kể có chuyện mình ngại hoặc lo ở lớp; con thử phát biểu một câu hoặc rủ một bạn.",
    },
  },
  S: {
    "con-cao-hon": {
      boMeThay:
        "Những lúc {ten} phản ứng ở nhà thì bố mẹ nhớ rõ hơn những lúc con lặng lẽ nhường, nên thấy con nóng và đổi nhanh.",
      conThay:
        "Con thấy mình hay nhường và giữ yên để mọi người đỡ buồn. Phần nhường đó ở ngoài thì bố mẹ ít thấy.",
      dauHieu:
        "Con nói ra một điều mình đã nhường hoặc đã chịu; con bớt “nổ” bất ngờ vì đã có chỗ để nói.",
    },
    "con-thap-hon": {
      boMeThay:
        "{ten} ít than phiền và ít đòi hỏi, nên bố mẹ thấy con điềm đạm, dễ tính và nghĩ mọi thứ ổn.",
      conThay:
        "Bên trong con có thể đang sốt ruột, không thích bị giục hoặc bị đổi kế hoạch, dù vẻ ngoài vẫn yên.",
      dauHieu:
        "Con nói “con cần thêm thời gian” hoặc “con chưa sẵn sàng” thay vì im; con báo trước khi thấy quá tải.",
    },
  },
  C: {
    "con-cao-hon": {
      boMeThay:
        "Ở đồ đạc và việc nhà {ten} ít chỉn chu, nên bố mẹ chưa thấy phần kỹ lưỡng con dành cho việc con thật sự quan tâm.",
      conThay:
        "Con thấy mình kỹ ở việc con coi trọng và dễ khó chịu khi làm dở. Ở việc con không để tâm thì con buông.",
      dauHieu:
        "Con kể về một việc mình làm kỹ và vì sao; con thử cách chia nhỏ ở một việc nhà.",
    },
    "con-thap-hon": {
      boMeThay:
        "{ten} ít khi làm hỏng việc, nên bố mẹ thấy con chỉn chu, cẩn thận và nghĩ con yên tâm về mình.",
      conThay:
        "Con thấy mình luôn còn chỗ chưa trọn và khắt khe với chính mình. Vẻ chỉn chu bố mẹ thấy có thể đi cùng nhiều lo lắng bên trong.",
      dauHieu:
        "Con dám nộp một việc khi chưa hoàn hảo; con nói “thế này cũng được rồi” về một việc.",
    },
  },
};

export const DONG_HANH_THEO_BAC: Readonly<
  Record<MaTruc, Readonly<Record<HuongDongHanh, Readonly<Record<BacDongHanh, TheoBacDongHanh>>>>>
> = {
  D: {
    "con-cao-hon": {
      TH: {
        sang: "Cho con chọn một việc nhỏ buổi sáng (mặc áo nào, ăn món nào trước) và để con quyết, không đổi lại.",
        sauGioHoc: "Hỏi “hôm nay ở lớp con là người nghĩ ra cách gì?” rồi chỉ nghe, đừng sửa.",
        truocKhiNgu: "Giao con một việc của ngày mai mà con tự lên cách làm; bố mẹ chỉ hỏi “cần giúp gì không?”.",
        nenNoi: "“Việc này con muốn làm theo cách nào? Bố mẹ nghe con trước.”",
        nenTranh: "“Người lớn nói sao thì làm vậy, đừng cãi.”",
        cauHoi: "“Ở lớp có lúc nào con là người nghĩ ra cách cho cả nhóm không? Kể bố mẹ nghe đi.”",
      },
      THCS: {
        sang: "Báo kế hoạch trong ngày bằng một câu ngắn rồi hỏi “phần nào con muốn tự sắp xếp?”, đừng giao sẵn từng bước.",
        sauGioHoc: "Hỏi về một quyết định con vừa đưa ra ở trường (nhóm, câu lạc bộ, hẹn với bạn) và “con thấy kết quả thế nào?”.",
        truocKhiNgu: "Dành năm phút nói chuyện ngang hàng về một việc con đang cầm lái; hỏi ý con trước khi cho ý mình.",
        nenNoi: "“Chuyện này con quyết. Bố mẹ chỉ nêu một lo ngại để con cân nhắc thôi.”",
        nenTranh: "“Con còn nhỏ, biết gì mà quyết.”",
        cauHoi: "“Nếu con là người chịu trách nhiệm chuyện này, con sẽ làm gì trước?”",
      },
    },
    "con-thap-hon": {
      TH: {
        sang: "Khen một lần con quyết nhanh và đúng việc sáng nay, nói rõ việc đó là gì, không thêm “nhưng”.",
        sauGioHoc: "Hỏi “hôm nay có việc gì con muốn làm mà chưa dám không?” và đừng vội làm giúp.",
        truocKhiNgu: "Kể một lần chính bố mẹ cũng từng lưỡng lự rồi mới quyết, để con thấy ngập ngừng là chuyện bình thường.",
        nenNoi: "“Con chưa chắc cũng không sao. Mình thử một cách rồi xem, sai thì đổi.”",
        nenTranh: "“Con lúc nào cũng tự tin lắm mà, sợ gì.”",
        cauHoi: "“Có việc nào con muốn tự làm nhưng chưa dám không?”",
      },
      THCS: {
        sang: "Ở việc con đang lưỡng lự, hỏi “con cần thêm gì để quyết?” thay vì “sao chưa quyết?”.",
        sauGioHoc: "Nghe chuyện con đắn đo mà không chê “nghĩ nhiều”; tóm lại một câu cho con thấy bố mẹ hiểu.",
        truocKhiNgu: "Nói với con rằng bên ngoài có thể trông rất chắc chắn mà bên trong vẫn có lúc chưa chắc, và điều đó bình thường.",
        nenNoi: "“Bố mẹ thấy con quyết rất nhanh, và bố mẹ biết có lúc trong lòng con chưa chắc. Cần nói thì bố mẹ nghe.”",
        nenTranh: "“Con mạnh mẽ nhất nhà, lo gì.”",
        cauHoi: "“Việc nào gần đây con đã quyết xong mà vẫn còn lăn tăn?”",
      },
    },
  },
  I: {
    "con-cao-hon": {
      TH: {
        sang: "Dành hai phút đầu ngày chỉ để nghe con nói bất cứ điều gì, không nhắc việc.",
        sauGioHoc: "Đón con bằng một câu mở “hôm nay chuyện gì vui nhất?” rồi đợi đủ lâu, đừng hỏi dồn nhiều câu.",
        truocKhiNgu: "Mười phút cuối ngày để con kể tự do, cất điện thoại đi.",
        nenNoi: "“Kể tiếp đi, rồi sao nữa? Bố mẹ muốn nghe.”",
        nenTranh: "“Nói ít thôi, làm bài đi đã.”",
        cauHoi: "“Chuyện gì hôm nay con muốn kể nhất mà chưa có dịp?”",
      },
      THCS: {
        sang: "Nhắn con một câu quan tâm bằng tin nhắn hoặc mẩu giấy, không kèm yêu cầu gì.",
        sauGioHoc: "Ngồi cạnh làm việc khác để con tự bắt chuyện; ở tuổi này con thường kể khi không bị hỏi dồn.",
        truocKhiNgu: "Hỏi một chuyện về bạn bè của con và nghe đến hết, không đánh giá.",
        nenNoi: "“Bố mẹ có thời gian nghe con. Lúc nào con muốn kể thì nói nhé.”",
        nenTranh: "“Chuyện trẻ con, kể làm gì.”",
        cauHoi: "“Có chuyện gì con kể được cho bạn mà chưa kể được cho nhà không?”",
      },
    },
    "con-thap-hon": {
      TH: {
        sang: "Nói trước với con hôm nay sẽ có người lạ hay nơi đông, để con có thời gian chuẩn bị.",
        sauGioHoc: "Hỏi “có lúc nào ở lớp con muốn nói mà ngại không?” và đừng ép con phát biểu.",
        truocKhiNgu: "Cùng con tập trước một câu có thể nói ngày mai (chào cô, xin phép, hỏi bạn).",
        nenNoi: "“Ở nhà con nói giỏi lắm. Mai ở lớp chỉ cần thử một câu thôi, thế là đủ rồi.”",
        nenTranh: "“Sao ở nhà nói nhiều thế mà ra ngoài lại im?”",
        cauHoi: "“Nơi nào con thấy dễ nói nhất, nơi nào khó nhất?”",
      },
      THCS: {
        sang: "Đừng gọi con là “hoạt bát” trước mặt người khác; để con tự chọn lúc nào muốn nổi bật.",
        sauGioHoc: "Hỏi nhẹ về một tình huống con né, mà không bàn chuyện “phải mạnh dạn lên”.",
        truocKhiNgu: "Nói với con rằng ngại nơi đông là chuyện của rất nhiều người, kể cả người lớn.",
        nenNoi: "“Ở nhà con thoải mái, còn ở ngoài có lúc ngại. Cả hai đều là con, bố mẹ hiểu.”",
        nenTranh: "“Mạnh dạn lên, đừng làm mất mặt bố mẹ.”",
        cauHoi: "“Tình huống nào gần đây khiến con chỉ muốn ở yên một chỗ?”",
      },
    },
  },
  S: {
    "con-cao-hon": {
      TH: {
        sang: "Báo trước một ngày khi có thay đổi (đón muộn, đổi lịch) để con khỏi bị bất ngờ.",
        sauGioHoc: "Hỏi “hôm nay con đã nhường ai điều gì?” và nói “cảm ơn con đã nhường” khi nghe xong.",
        truocKhiNgu: "Cho con một phút nói “điều con cố chịu hôm nay”, không sửa, không rút bài học.",
        nenNoi: "“Bố mẹ thấy hôm nay con đã nhường nhiều. Cảm ơn con. Có điều gì con muốn nói không?”",
        nenTranh: "“Có thế mà cũng khóc, nhường em chút không được à?”",
        cauHoi: "“Hôm nay có điều gì con giữ trong lòng không?”",
      },
      THCS: {
        sang: "Cho con biết sớm lịch cả tuần để con chủ động sắp xếp, tránh đổi phút chót.",
        sauGioHoc: "Đừng hỏi dồn; mở lời bằng “hôm nay nhìn con hơi mệt” rồi chờ.",
        truocKhiNgu: "Nói với con rằng con có quyền nói “không” hoặc “để con nghĩ” mà bố mẹ không giận.",
        nenNoi: "“Con không phải lúc nào cũng nhường. Nếu con thấy không ổn, nói với bố mẹ, bố mẹ nghe.”",
        nenTranh: "“Con lớn rồi, phải biết nhường chứ.”",
        cauHoi: "“Có điều gì con đã chịu một mình mà muốn bố mẹ biết không?”",
      },
    },
    "con-thap-hon": {
      TH: {
        sang: "Đừng giục dồn; báo thời gian theo từng chặng (“còn mười phút nữa nhé”).",
        sauGioHoc: "Hỏi “hôm nay có lúc nào con muốn nhanh hơn hoặc chậm lại không?”.",
        truocKhiNgu: "Cho con tự chọn thứ tự các việc tối nay thay vì sắp sẵn.",
        nenNoi: "“Con cứ làm theo nhịp của con, bố mẹ đợi. Cần nhanh thì bố mẹ sẽ nói trước.”",
        nenTranh: "“Nhanh lên! Sao con cứ từ từ thế?”",
        cauHoi: "“Khi bị giục, trong người con thấy thế nào?”",
      },
      THCS: {
        sang: "Hỏi ý con trước khi đổi kế hoạch cuối tuần; nếu buộc phải đổi, nói lý do.",
        sauGioHoc: "Con im không có nghĩa là con ổn; hỏi “hôm nay thế nào?” thay cho “ổn chứ?”.",
        truocKhiNgu: "Mười phút ngồi với con, không việc gì và không màn hình.",
        nenNoi: "“Bố mẹ biết con hay không nói khi sốt ruột. Cứ nói “con cần thêm thời gian” là bố mẹ hiểu.”",
        nenTranh: "“Con thế nào cũng được nhỉ, dễ tính mà.”",
        cauHoi: "“Việc nào gần đây con muốn bố mẹ đừng giục hoặc đừng đổi?”",
      },
    },
  },
  C: {
    "con-cao-hon": {
      TH: {
        sang: "Cho con xem việc trong ngày bằng bảng nhỏ hoặc hình; con thích biết việc nào tới trước.",
        sauGioHoc: "Hỏi “hôm nay con làm kỹ việc gì nhất?” và khen đúng chỗ kỹ đó.",
        truocKhiNgu: "Cùng con chọn đúng một việc nhà để làm đến nơi đến chốn, với tiêu chí đơn giản (ví dụ sách xếp theo thứ tự).",
        nenNoi: "“Bố mẹ thấy con làm việc này rất kỹ. Việc nhà mình làm vừa đủ thôi, không cần hoàn hảo.”",
        nenTranh: "“Sao ở nhà con bừa bộn thế?”",
        cauHoi: "“Việc nào con thấy phải làm cho đúng, việc nào làm tạm cũng được?”",
      },
      THCS: {
        sang: "Thống nhất sớm một tiêu chí “xong” cho việc nhà (một câu, nhìn là biết) thay vì nhắc “dọn cho gọn”.",
        sauGioHoc: "Hỏi về một việc con làm kỹ và con học được gì; không gạn hỏi sang việc chưa làm.",
        truocKhiNgu: "Cho con một mục tiêu nhỏ cho ngày mai và để con tự chọn cách kiểm.",
        nenNoi: "“Bố mẹ thấy con kỹ ở việc con coi trọng. Việc nhà mình chốt một chuẩn vừa phải nhé.”",
        nenTranh: "“Con lười việc nhà, chỉ biết lo cho mình.”",
        cauHoi: "“Với việc nhà, thế nào là “đủ rồi” theo con?”",
      },
    },
    "con-thap-hon": {
      TH: {
        sang: "Nói trước một câu chấp nhận: “hôm nay làm được phần nào cũng được, không cần hoàn hảo”.",
        sauGioHoc: "Khi con tẩy xoá nhiều, nói “bố mẹ thấy con rất cố gắng” thay vì “sao bẩn thế”.",
        truocKhiNgu: "Kể một lỗi nhỏ bố mẹ vừa mắc và cách bố mẹ sửa, để con thấy mắc lỗi là chuyện bình thường.",
        nenNoi: "“Chỗ này con làm được vậy là ổn rồi. Lần sau mình thử cách khác.”",
        nenTranh: "“Con phải làm cho thật đúng, đừng để bố mẹ thất vọng.”",
        cauHoi: "“Lúc nào con thấy mình làm chưa trọn vẹn?”",
      },
      THCS: {
        sang: "Khen quá trình và cách con xử lý lúc gặp lỗi, đừng chỉ khen kết quả hoàn hảo.",
        sauGioHoc: "Hỏi nhẹ “hôm nay con đã bỏ qua cho mình điều gì chưa?”, đừng biến thành bài giảng.",
        truocKhiNgu: "Đặt giới hạn thời gian cho một việc con hay làm mãi (ví dụ bài tập) rồi hỏi “đủ rồi chứ?”.",
        nenNoi: "“Bố mẹ không cần con hoàn hảo. Bố mẹ cần con khoẻ và vui.”",
        nenTranh: "“Cố thêm chút nữa là trọn vẹn rồi, sao dừng ở đây?”",
        cauHoi: "“Điều gì làm con khó bỏ qua cho mình khi làm chưa trọn?”",
      },
    },
  },
};

/** Khi một trục khớp nhau: giữ điều đang tốt đẹp và nuôi tiếp. Không đổi theo bậc. */
export const DONG_HANH_TRUNG_KHOP: Readonly<
  Record<MaTruc, { readonly giu: string; readonly nuoiTiep: string }>
> = {
  D: {
    giu: "Hai góc nhìn khớp nhau: con được thấy đúng là người có chính kiến.",
    nuoiTiep:
      "Tiếp tục cho con những việc nhỏ để con tự quyết, và nói rõ khi nào bố mẹ cần quyết thay con, thay vì chỉ ra lệnh.",
  },
  I: {
    giu: "Hai góc nhìn khớp nhau: con kể và kết nối ở nhà giống như ở ngoài.",
    nuoiTiep:
      "Giữ thói quen nghe con kể cuối ngày; thử hỏi sâu thêm một lớp, ví dụ “lúc đó con thấy thế nào?”.",
  },
  S: {
    giu: "Hai góc nhìn khớp nhau: nhịp đều và sự điềm đạm của con được nhìn thấy đúng.",
    nuoiTiep:
      "Vẫn báo trước khi có thay đổi; thỉnh thoảng hỏi riêng “có điều gì con đang chịu không?” vì con ít tự nói.",
  },
  C: {
    giu: "Hai góc nhìn khớp nhau: sự kỹ lưỡng của con được bố mẹ nhìn thấy.",
    nuoiTiep:
      "Giữ tiêu chí rõ ràng, và cùng con tập chấp nhận “đủ rồi” ở những việc không quan trọng.",
  },
};

/** Chữ giao diện của khối này (nạp cùng chunk lười để không phình gói chính). */
export const CHU_DONG_HANH = {
  tieuDeKhoi: "Làm gì cùng {ten} mỗi ngày",
  moTaKhoi:
    "Hai góc nhìn khác nhau là tín hiệu về ngữ cảnh, không phải ai đúng ai sai. Dưới đây là những việc nhỏ bố mẹ có thể làm trước để đồng hành cùng {ten}.",
  tieuDeTruc: "Đồng hành cùng {ten} ở nhóm {truc}",
  tomTatTruc: "Bố mẹ thấy khác con ở nhóm này — bấm để xem việc nên làm",
  boMeThay: "Bố mẹ có thể đang thấy",
  conThay: "Con có thể đang trải qua",
  viecHangNgay: "Việc nhỏ mỗi ngày",
  nhanSang: "Buổi sáng",
  nhanSauHoc: "Sau giờ học",
  nhanTruocNgu: "Trước khi ngủ",
  nenNoi: "Nên nói",
  nenTranh: "Nên tránh",
  cauHoi: "Một câu hỏi để hỏi con",
  dauHieu: "Dấu hiệu việc này có tác dụng",
  tieuDeTrungKhop: "Chỗ hai góc nhìn khớp nhau",
  tomTatTrungKhop: "Giữ điều đang tốt đẹp và nuôi tiếp",
  nhanGiu: "Điều đang tốt đẹp",
  nhanNuoi: "Nuôi tiếp",
  tieuDeKeHoach: "Kế hoạch đồng hành tuần này của bố mẹ với {ten}",
  tomTatKeHoach: "Bốn việc nhỏ, từ đầu tuần đến Chủ nhật",
  moTaKeHoach:
    "Việc dành cho BỐ MẸ làm với {ten}, không phải việc con phải sửa. Hết tuần thì ngồi lại với con và hỏi con thấy gì khác.",
  ngayDauTuan: "Đầu tuần",
  ngayGiuaTuan: "Giữa tuần",
  ngayCuoiTuan: "Cuối tuần",
  ngayChuNhat: "Chủ nhật",
  nhacTestLai:
    "Sau khoảng 6 tháng, cả nhà làm lại để xem hai góc nhìn đã gần nhau hơn hay đã đổi sang chỗ khác.",
} as const;
