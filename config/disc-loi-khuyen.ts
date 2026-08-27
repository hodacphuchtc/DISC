/**
 * TẦNG LỜI KHUYÊN — phần trả lời câu hỏi *"đọc xong rồi tôi phải làm gì?"*.
 *
 * 🔴 VÌ SAO FILE NÀY TỒN TẠI. Bản báo cáo cũ có bốn khối: trông như thế nào · điểm mạnh ·
 * chỗ cần để ý · ba câu hỏi. Không một trường nào chứa HÀNH ĐỘNG. Phụ huynh đọc xong biết
 * thêm về con nhưng không biết tối nay nên làm gì khác đi — và đó chính là chỗ bị chê
 * "chưa chạm".
 *
 * BA THỨ LÀM PHỤ HUYNH THẤY CHẠM, theo đúng thứ tự sức nặng:
 *  1. **Nhận ra** — "đúng là con tôi". Thuộc `BIEU_HIEN` ở `disc-bieu-hien.ts`.
 *  2. **Nhẹ lòng / lật khung** — "hoá ra không phải con hư, con đang quá tải". Đây là
 *     trường `khiCangThang` bên dưới, và là đòn bẩy mạnh nhất mà DISC làm được.
 *  3. **Biết làm gì tối nay** — trường `motViecToiNay`. ĐÚNG MỘT việc, không phải một danh
 *     sách. Danh sách mười việc thì không việc nào được làm.
 *
 * 🔴 BỐN LẰN RANH KHÔNG ĐƯỢC VƯỢT:
 *
 *  a. **"Cân bằng" nghĩa là LINH HOẠT TÌNH HUỐNG, không phải vá chỗ thiếu.** DISC không
 *     phải mô hình khuyết thiếu. Cặp `kyNangThem` (dạy con một kỹ năng dùng thêm) và
 *     `boMeChinh` (bố mẹ chỉnh cách mình nói) luôn đi cùng nhau — bỏ vế thứ hai là biến
 *     lời khuyên thành "sửa đứa trẻ", đúng thứ ADR-002 dựng ra để chặn.
 *
 *  b. **Nói CÁCH, cấm ĐOÁN (luật §9.2 số 5).** `cungHocTheNao` chỉ được nói cách tổ chức
 *     việc học cùng con. Tuyệt đối không đoán môn nào hợp, năng lực tới đâu, thi được hay
 *     không.
 *
 *  c. **Không nói bản chất (luật §9.2 số 1).** "có thiên hướng…", không phải "LÀ người…".
 *
 *  d. **Đúng người đọc.** `LOI_KHUYEN` viết cho NGƯỜI LỚN đọc về trẻ (bộ MN, QS).
 *     `TU_MINH` viết cho chính người làm bài (bộ TH, THCS, PH). Đây KHÔNG phải hai bản
 *     dịch của nhau — dùng nhầm là lặp lại đúng lỗi đã trả giá 27/08/2026, khi bộ THCS
 *     hiện tiêu đề "3 câu để tự hỏi mình" mà ruột là câu viết cho phụ huynh hỏi con.
 *
 * ⚠️ CHƯA CÓ NGƯỜI CHUYÊN MÔN TÂM LÝ/GIÁO DỤC KÝ DUYỆT. Xem mục CHỜ NGOÀI trong CLAUDE.md.
 *
 * Thuộc TẦNG LÕI (ADR-004): chuỗi thuần, không React, không DOM.
 */

import type { MaTruc } from "@modules/core/bo-de/kieu";

/* ── Lời khuyên cho NGƯỜI LỚN đọc về trẻ (bộ MN, QS) ─────────────────────── */

export type KhoiLoiKhuyen = {
  /** Cách nói để lời nói tới được. */
  readonly noiTheNao: string;
  /** 🔴 Câu NGUYÊN VĂN. Phụ huynh nhận ra chính câu mình đã nói hỏng — đó là chỗ chạm. */
  readonly cauNenNoi: readonly [string, string, string];
  readonly cauNenTranh: readonly [string, string, string];
  /** 🔴 Lật khung "con hư" thành "con đang quá tải". Đòn bẩy cảm xúc mạnh nhất. */
  readonly khiCangThang: string;
  /** Vế 1 của linh hoạt tình huống: kỹ năng dạy CON dùng thêm. */
  readonly kyNangThem: string;
  /** 🔴 Vế 2, bắt buộc đi cùng: điều BỐ MẸ tự chỉnh. Bỏ vế này là quay về "sửa đứa trẻ". */
  readonly boMeChinh: string;
  /** Chỉ CÁCH tổ chức việc học. Cấm đoán môn, đoán năng lực (luật §9.2 số 5). */
  readonly cungHocTheNao: string;
  /** 🔴 ĐÚNG MỘT việc, làm được ngay tối nay. */
  readonly motViecToiNay: string;
};

export const LOI_KHUYEN: Readonly<Record<MaTruc, KhoiLoiKhuyen>> = {
  D: {
    noiTheNao:
      "Nói ngắn, vào thẳng việc, và chừa cho {chuThe} một khoảng được tự quyết. Giải thích dài dòng trước khi vào việc thường bị {chuThe} nghe thành cản đường.",
    cauNenNoi: [
      "“Việc này {chuThe} muốn làm cách nào?”",
      "“{ChuThe} chọn một trong hai cách này nhé.”",
      "“Chỗ này {chuThe} tự quyết được.”",
    ],
    cauNenTranh: [
      "“Không được cãi, người lớn nói sao thì nghe vậy.”",
      "“Để đấy, làm không nổi đâu.”",
      "“Sao lúc nào cũng phải theo ý {chuThe}?”",
    ],
    khiCangThang:
      "Quá tải thì {chuThe} không rút lui mà đẩy tới: to tiếng, cãi lại, đòi làm cho bằng được. Nhìn từ ngoài rất dễ đọc thành hỗn. Thứ giúp được không phải là áp đảo lại, mà là bớt số việc đang tranh nhau và trả cho {chuThe} một chỗ được tự quyết.",
    kyNangThem:
      "Tập hỏi lại một câu trước khi chốt — “ý bạn thế nào?”. Không phải để {chuThe} bớt quyết đoán, mà để phần quyết đoán đó không làm người khác rụt lại.",
    boMeChinh:
      "Ra yêu cầu gọn, và cho hai lựa chọn thay vì một mệnh lệnh. Vẫn là việc đó, nhưng cách nói này giảm hẳn số lần va nhau.",
    cungHocTheNao:
      "Chia việc thành từng chặng ngắn và để {chuThe} tự gạch chỗ đã xong. {ChuThe} cần thấy mình đang tiến, và cần được tự chọn thứ tự làm.",
    motViecToiNay:
      "Tối nay giao cho {chuThe} một việc trong nhà mà {chuThe} được tự quyết cách làm, rồi không góp ý cho tới khi {chuThe} làm xong.",
  },
  I: {
    noiTheNao:
      "Nghe hết câu chuyện đã, rồi mới tới phần việc. Cắt ngang lúc {chuThe} đang kể thì phần việc nói sau đó cũng không vào được.",
    cauNenNoi: [
      "“Kể tiếp đi, rồi sao nữa?”",
      "“Chỗ này {chuThe} làm hay lắm, hay ở chỗ…”",
      "“Mình cùng làm phần này nhé?”",
    ],
    cauNenTranh: [
      "“Nói ít thôi, làm đi.”",
      "“Suốt ngày chỉ thấy bạn bè.”",
      "“Có thế mà cũng khoe.”",
    ],
    khiCangThang:
      "Quá tải thì {chuThe} nói nhiều hơn hẳn bình thường, hoặc đột nhiên im bặt nếu bị chê trước mặt người khác. Một lời chê nơi đông người ở lại rất lâu. Thứ giúp được là nói riêng, và nói rõ rằng việc chưa xong không có nghĩa là {chuThe} không được quý.",
    kyNangThem:
      "Tập ghi lại việc đã nhận thay vì nhớ trong đầu. {ChuThe} nhận lời nhanh vì thật lòng muốn giúp — chỗ vỡ nằm ở lúc quên, không nằm ở thiện chí.",
    boMeChinh:
      "Khen vào việc cụ thể chứ đừng khen chung chung, và tránh chê {chuThe} trước mặt người khác. Cùng một câu, nói riêng thì thành góp ý, nói giữa đám đông thì thành vết.",
    cungHocTheNao:
      "Cho {chuThe} nói lại điều vừa làm bằng lời của mình, hoặc giảng lại cho người khác nghe. {ChuThe} nhớ bằng cách kể ra, không nhớ bằng cách ngồi im.",
    motViecToiNay:
      "Tối nay dành mười phút chỉ để nghe {chuThe} kể chuyện — không xen vào, không lái sang chuyện bài vở.",
  },
  S: {
    noiTheNao:
      "Báo trước và cho thời gian. {ChuThe} không phản đối thay đổi, {chuThe} chỉ cần biết trước để kịp chuẩn bị.",
    cauNenNoi: [
      "“Mười lăm phút nữa mình chuyển sang việc khác nhé.”",
      "“{ChuThe} thấy thế nào? Cứ nói thật, không sao đâu.”",
      "“Việc này {chuThe} làm đều lắm, người khác khó theo được.”",
    ],
    cauNenTranh: [
      "“Nhanh lên, có thế mà cũng lâu.”",
      "“Đổi ngay bây giờ, không bàn nữa.”",
      "“{ChuThe} thì ý kiến gì.”",
    ],
    khiCangThang:
      "Quá tải thì {chuThe} thường không cãi mà im lặng rút đi, hoặc gật cho xong rồi giữ ấm ức lại. Nhìn từ ngoài rất dễ đọc thành giận dỗi hoặc lì. Thực ra đó là dấu hiệu {chuThe} đang cần một quãng yên và một lời hỏi riêng.",
    kyNangThem:
      "Tập nói ra điều mình muốn ngay lúc chuyện còn nhỏ, thay vì để dồn. Nhường là một thế mạnh thật, nhưng nhường mà không ai biết thì phần thiệt không ai bù.",
    boMeChinh:
      "Báo trước mọi thay đổi lịch, và hỏi ý {chuThe} bằng câu hỏi mở chứ đừng hỏi “có được không” — {chuThe} sẽ gật cho xong chuyện.",
    cungHocTheNao:
      "Giữ đúng một khung giờ và một chỗ ngồi quen. {ChuThe} vào việc chậm nhưng làm rất bền, nên thứ phá nhịp nhất là đổi giờ đổi chỗ liên tục.",
    motViecToiNay:
      "Tối nay hỏi {chuThe} một câu rồi chờ đủ lâu để {chuThe} trả lời — im lặng vài giây không có nghĩa là {chuThe} không có gì để nói.",
  },
  C: {
    noiTheNao:
      "Nói rõ lý do và tiêu chuẩn. {ChuThe} làm theo dễ hơn hẳn khi hiểu vì sao phải làm thế, và khựng lại khi bị yêu cầu mà không có lý do.",
    cauNenNoi: [
      "“Chỗ này {chuThe} thấy chưa ổn ở đâu?”",
      "“Làm đến mức này là đủ rồi, mình dừng ở đây.”",
      "“{ChuThe} hỏi tiếp đi, hỏi thế là đúng chỗ.”",
    ],
    cauNenTranh: [
      "“Sao cứ hỏi mãi thế, cứ làm đi.”",
      "“Có gì đâu mà phải kỹ thế.”",
      "“Sai có tí mà cũng làm lại từ đầu.”",
    ],
    khiCangThang:
      "Quá tải thì {chuThe} làm đi làm lại một chỗ, hoặc dừng hẳn vì sợ làm sai. Nhìn từ ngoài rất dễ đọc thành chậm chạp hay lười. Thực ra {chuThe} đang mắc ở chỗ chưa đủ chắc — thứ giúp được là nói rõ “đến mức này là đủ”, chứ không phải giục nhanh lên.",
    kyNangThem:
      "Tập chấp nhận một bản “đủ dùng” rồi sửa dần, thay vì chờ đúng ngay từ lần đầu. Kỹ lưỡng là thế mạnh, nhưng nó chỉ thành kết quả khi có thứ để đưa ra.",
    boMeChinh:
      "Nói trước tiêu chuẩn “thế nào là xong”, rồi giữ đúng tiêu chuẩn đó. {ChuThe} không cần bị hạ chuẩn, {chuThe} cần biết vạch đích nằm ở đâu.",
    cungHocTheNao:
      "Cho {chuThe} biết trước yêu cầu và cách soát, rồi để {chuThe} tự soát. Việc giao mập mờ làm {chuThe} tốn gấp đôi thời gian vì phải đoán.",
    motViecToiNay:
      "Tối nay chọn một việc và nói trước với {chuThe} rằng “làm đến mức này là đủ”, rồi giữ đúng lời khi {chuThe} muốn làm thêm.",
  },
};

/* ── Bản tự đọc, cho chính người làm bài (bộ TH, THCS, PH) ──────────────── */

/**
 * 🔴 KHÔNG PHẢI BẢN DỊCH CỦA `LOI_KHUYEN`.
 *
 * Người đọc ở đây là chính người vừa làm bài — một học sinh lớp 5, lớp 9, hoặc một phụ
 * huynh tự đánh giá. Bê nguyên câu viết cho bố mẹ sang rồi chỉ đổi tiêu đề là đúng lỗi đã
 * trả giá 27/08/2026. Ngắn hơn có chủ đích: người tự đọc cần một điều để thử, không cần
 * một giáo án về chính mình.
 */
export type KhoiTuMinh = {
  readonly khiCangThang: string;
  readonly tapThem: string;
  readonly motViecToiNay: string;
};

export const TU_MINH: Readonly<Record<MaTruc, KhoiTuMinh>> = {
  D: {
    khiCangThang:
      "Lúc quá tải, {chuThe} thường đẩy tới chứ không lùi lại: nói to hơn, muốn giải quyết cho xong ngay. Nhận ra sớm thì tách ra vài phút rồi hãy nói tiếp.",
    tapThem:
      "Hỏi lại một câu trước khi chốt. Chỉ một câu thôi cũng đủ để người nghĩ chậm hơn kịp vào chuyện.",
    motViecToiNay:
      "Hôm nay chọn một việc và để người khác quyết cách làm, kể cả khi {chuThe} thấy cách của mình nhanh hơn.",
  },
  I: {
    khiCangThang:
      "Lúc quá tải, {chuThe} nói nhiều hơn bình thường, hoặc hụt hẳn đi nếu bị chê trước mặt người khác. Cảm giác đó là thật, nhưng nó không đo đúng giá trị của {chuThe}.",
    tapThem:
      "Ghi lại việc đã nhận thay vì nhớ trong đầu. Chỗ vỡ thường nằm ở lúc quên, không nằm ở thiện chí.",
    motViecToiNay: "Hôm nay làm xong một việc đang dở trước khi bắt đầu việc mới.",
  },
  S: {
    khiCangThang:
      "Lúc quá tải, {chuThe} hay im lặng rút đi hoặc gật cho xong rồi giữ ấm ức lại. Điều đó khiến người khác tưởng {chuThe} đã đồng ý.",
    tapThem:
      "Nói ra điều mình muốn lúc chuyện còn nhỏ, đừng để dồn. Nhường mà không ai biết thì phần thiệt không ai bù.",
    motViecToiNay: "Hôm nay nói ra một điều {chuThe} vẫn định để sau.",
  },
  C: {
    khiCangThang:
      "Lúc quá tải, {chuThe} làm đi làm lại một chỗ hoặc dừng hẳn vì sợ sai. Đó là dấu hiệu cần một vạch đích rõ hơn, không phải dấu hiệu {chuThe} kém.",
    tapThem:
      "Chấp nhận một bản đủ dùng rồi sửa dần. Kỹ lưỡng chỉ thành kết quả khi có thứ để đưa ra.",
    motViecToiNay:
      "Hôm nay chọn một việc và tự chốt trước “đến mức này là đủ”, rồi dừng đúng ở đó.",
  },
};

/* ── Điều đang băn khoăn — một chạm ở màn kết quả ────────────────────────── */

export const MA_BAN_KHOAN = [
  "hay-cau",
  "ngai-giao-tiep",
  "le-me",
  "buong",
  "chi-to-mo",
] as const;
export type MaBanKhoan = (typeof MA_BAN_KHOAN)[number];

/**
 * 🔴 GIỌNG BẮT BUỘC: *"phong cách của con liên quan thế nào tới chuyện này"*.
 * TUYỆT ĐỐI KHÔNG: *"vì sao con bị như vậy"*. Bộ câu hỏi này đo thiên hướng hành vi, nó
 * không chẩn đoán gì hết — và một phụ huynh đang lo thì rất dễ đọc bất kỳ câu nào thành
 * chẩn đoán. Nên mỗi `loiMoDau` phải tự nói ra giới hạn của nó TRƯỚC khi nói phần có ích.
 */
export type KhoiBanKhoan = {
  readonly nhan: string;
  /** Trục liên quan nhất — dùng để đưa phần đó lên trước, KHÔNG dùng để kết luận. */
  readonly trucLienQuan: readonly MaTruc[];
  readonly loiMoDau: string;
};

export const BAN_KHOAN: Readonly<Record<MaBanKhoan, KhoiBanKhoan>> = {
  "hay-cau": {
    nhan: "Hay cáu, hay ăn vạ",
    trucLienQuan: ["D", "I"],
    loiMoDau:
      "Kết quả này không giải thích vì sao {chuThe} hay cáu — nó không đo được chuyện đó. Nhưng nó cho biết {chuThe} thường phản ứng thế nào khi quá tải, và kiểu nói nào làm chuyện dịu xuống nhanh hơn.",
  },
  "ngai-giao-tiep": {
    nhan: "Ngại giao tiếp, ít nói",
    trucLienQuan: ["I", "S"],
    loiMoDau:
      "Kết quả này không kết luận {chuThe} nhút nhát — ít nói và ngại là hai chuyện khác nhau. Nhưng nó cho biết {chuThe} lấy lại sức ở đâu, và chỗ đông người lạ tốn của {chuThe} bao nhiêu.",
  },
  "le-me": {
    nhan: "Lề mề, làm gì cũng chậm",
    trucLienQuan: ["S", "C"],
    loiMoDau:
      "Kết quả này không đo nhanh hay chậm. Nhưng nó cho biết {chuThe} cần gì để vào được việc — và vì sao giục thường làm chậm thêm chứ không nhanh lên.",
  },
  buong: {
    nhan: "Bướng, không chịu nghe lời",
    trucLienQuan: ["D", "C"],
    loiMoDau:
      "Kết quả này không phán xét chuyện nghe lời. Nhưng nó cho biết {chuThe} cần khoảng tự quyết tới đâu, và kiểu yêu cầu nào thì {chuThe} nhận được.",
  },
  "chi-to-mo": {
    nhan: "Chưa có gì cụ thể, chỉ muốn hiểu thêm",
    trucLienQuan: [],
    loiMoDau:
      "Không có băn khoăn cụ thể nào thì cứ đọc theo thứ tự bên dưới — bắt đầu từ nhóm nổi nhất của {chuThe}.",
  },
};

/* ── Lệch phong cách BỐ MẸ ↔ CON ─────────────────────────────────────────── */

/**
 * 🔴 KHÁC với vùng lệch ở `disc-doi-chieu.ts`. Vùng lệch cũ so *con tự thấy* với *bố mẹ
 * nhìn con* — cùng một đứa trẻ, hai góc nhìn. Bảng này so PHONG CÁCH CỦA BỐ MẸ (bộ PH)
 * với phong cách của con: hai người khác nhau, và chỗ vênh giữa họ là chỗ va nhau hằng
 * ngày trong nhà.
 *
 * Đây là thứ chạm cảm xúc nhất mà DISC làm được — *"bố mẹ nhóm D, con nhóm S: bố mẹ thấy
 * con chậm chạp, con thấy mình bị hối"* — và hạ tầng đã dựng sẵn từ GĐ5 nhưng đang bỏ không.
 *
 * ⚠️ MIỄN TRỪ CÓ CHỦ ĐÍCH khỏi luật cấm gõ cứng đại từ, cùng khuôn với `cauRaoTre`:
 * khối này CHỈ hiện khi có bài bộ PH ghép với bài của con, nên người đọc luôn là phụ huynh
 * và đối tượng luôn là con họ. "bạn" = bố mẹ đang đọc, "con" = đứa trẻ. Thay bằng
 * {chuThe} ở đây sẽ ra "em"/"bạn" — sai với người đang đọc.
 */
export type HuongLechPhongCach = "bo-me-cao-hon" | "bo-me-thap-hon";

export const LECH_PHONG_CACH: Readonly<
  Record<MaTruc, Readonly<Record<HuongLechPhongCach, string>>>
> = {
  D: {
    "bo-me-cao-hon":
      "Bạn chủ động và quyết nhanh hơn con khá nhiều. Trong nhà, điều đó dễ thành: bạn quyết xong rồi mới thấy con chưa kịp có ý kiến. Thử lùi một nhịp và hỏi trước khi chốt — không phải để chiều, mà để con tập nói ra ý mình.",
    "bo-me-thap-hon":
      "Con chủ động và quyết nhanh hơn bạn. Điều đó rất dễ bị đọc thành bướng, trong khi thực ra con đang muốn tự làm. Chừa cho con một khoảng được tự quyết thường hạ căng thẳng nhanh hơn là siết lại.",
  },
  I: {
    "bo-me-cao-hon":
      "Bạn cởi mở và bắt chuyện dễ hơn con. Chỗ va nhau thường là lúc bạn muốn con chào hỏi, kể chuyện, hoà vào chỗ đông người — còn con thì đang cần thêm thời gian. Giới thiệu trước rồi đứng cạnh vài phút giúp nhiều hơn là giục.",
    "bo-me-thap-hon":
      "Con cần được nói và được chú ý nhiều hơn bạn. Cái bạn thấy là ồn thì với con là cách kết nối. Mười phút ngồi nghe con kể mà không xen vào thường đủ để phần còn lại của buổi tối dễ hơn hẳn.",
  },
  S: {
    "bo-me-cao-hon":
      "Bạn điềm đạm và chịu được nhịp chậm hơn con. Chỗ va nhau thường là lúc con muốn đổi, muốn nhanh, còn bạn muốn giữ nếp. Nói rõ đâu là chỗ đổi được, đâu là chỗ giữ, sẽ đỡ hơn là cản chung chung.",
    "bo-me-thap-hon":
      "Con cần nếp quen và cần được báo trước nhiều hơn bạn. Việc bạn thấy là linh hoạt thì với con là mất chỗ bám. Báo trước mười lăm phút là việc rất nhỏ nhưng đổi hẳn cách buổi tối diễn ra.",
  },
  C: {
    "bo-me-cao-hon":
      "Bạn kỹ lưỡng và cần chắc chắn hơn con. Chỗ va nhau thường là lúc bạn thấy chưa đủ chuẩn còn con thấy đã xong rồi. Nói trước “thế nào là xong” giúp cả hai đỡ phải tranh nhau ở phút cuối.",
    "bo-me-thap-hon":
      "Con kỹ lưỡng và cần chắc chắn hơn bạn. Cái bạn thấy là chậm hoặc cầu toàn thì với con là chưa yên tâm. Cho con biết vạch đích nằm ở đâu thường hiệu quả hơn là giục nhanh lên.",
  },
};
