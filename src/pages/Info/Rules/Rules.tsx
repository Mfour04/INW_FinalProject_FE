import { FileWarning, Mail, Info, Clock } from "lucide-react";
import { textGradient } from "../constant";
import { Section } from "./component/Section";
import { RuleItem } from "./component/RuleItem";
import { Good } from "./component/Good";
import { Bad } from "./component/Bad";

export const Rules = () => {
  const updatedAt = "21/08/2025";

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-[#0b0c0e] dark:text-gray-100">
      <header className="border-b border-gray-200 dark:border-white/10">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Nội quy <span className={textGradient}>Inkwave</span>
          </h1>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-3xl dark:text-white/70">
            Bộ quy tắc ứng xử nhằm xây dựng cộng đồng sáng tác và đọc truyện
            lành mạnh, tôn trọng và an toàn.
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-white/50">
            <Clock className="h-4 w-4" />
            Cập nhật lần cuối: {updatedAt}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-2 py-5 md:py-7 space-y-4">
        <Section
          id="scope"
          title="1. Phạm vi áp dụng"
          desc="Nội quy áp dụng cho mọi người dùng khi truy cập, đăng, bình luận, đánh giá hoặc tương tác trên Inkwave."
        >
          <ul className="space-y-2">
            <RuleItem>Tuân thủ pháp luật Việt Nam và quốc gia nơi bạn cư trú.</RuleItem>
            <RuleItem>
              Chấp nhận{" "}
              <a href="/terms" className="underline text-gray-900 dark:text-white">
                Điều khoản dịch vụ
              </a>{" "}
              và các chính sách liên quan.
            </RuleItem>
            <RuleItem>
              Nội quy có thể được cập nhật định kỳ; tiếp tục sử dụng đồng nghĩa
              với việc chấp nhận phiên bản mới.
            </RuleItem>
          </ul>
        </Section>

        <Section
          id="conduct"
          title="2. Hành vi người dùng"
          desc="Hãy tôn trọng người khác và tranh luận văn minh."
        >
          <ul className="space-y-2">
            <RuleItem>Không quấy rối, đe doạ, bôi nhọ, kỳ thị hoặc kích động thù hằn.</RuleItem>
            <RuleItem>Không spam, treo thưởng/“dụ” tương tác, hoặc thao túng xếp hạng.</RuleItem>
            <RuleItem>Không mạo danh cá nhân/tổ chức; rõ ràng khi là nội dung giả tưởng hoặc châm biếm.</RuleItem>
            <RuleItem>
              Tranh luận lành mạnh: <Good>Tập trung vào ý kiến</Good> — <Bad>Không công kích cá nhân</Bad>.
            </RuleItem>
          </ul>
        </Section>

        <Section id="content" title="3. Quy định về nội dung" desc="Nội dung nên phù hợp với đối tượng độc giả đa dạng.">
          <ul className="space-y-2">
            <RuleItem>
              Gắn nhãn độ tuổi/thẻ nội dung nếu có yếu tố bạo lực, ngôn từ mạnh, tình cảm người lớn.
            </RuleItem>
            <RuleItem>
              Không đăng thông tin nhạy cảm (dữ liệu cá nhân của bạn hoặc người khác) khi chưa có phép.
            </RuleItem>
            <RuleItem>
              Ghi nguồn khi tham khảo; nội dung AI hỗ trợ cần được biên tập lại để đảm bảo chất lượng.
            </RuleItem>
            <RuleItem>Không dẫn link độc hại, phần mềm lừa đảo, hoặc kêu gọi hoạt động phi pháp.</RuleItem>
          </ul>
        </Section>

        <Section id="prohibited" title="4. Nội dung bị cấm" desc="Các nội dung sau sẽ bị gỡ bỏ ngay khi phát hiện.">
          <ul className="space-y-2">
            <RuleItem>Khuyến khích bạo lực cực đoan, khủng bố, buôn bán chất cấm, vũ khí, hoặc hoạt động tội phạm.</RuleItem>
            <RuleItem>Ấn phẩm khiêu dâm trẻ vị thành niên, bóc lột, hoặc xâm phạm quyền trẻ em (0 khoan nhượng).</RuleItem>
            <RuleItem>Phát tán thông tin cá nhân (doxxing), xâm phạm đời tư, hoặc đe doạ bạo lực.</RuleItem>
            <RuleItem>Nội dung thù hằn nhằm vào chủng tộc, giới tính, tôn giáo, khuynh hướng, khuyết tật, quốc tịch.</RuleItem>
            <RuleItem>Sao chép nguyên văn tác phẩm có bản quyền mà không có phép; crack, hack, lừa đảo.</RuleItem>
          </ul>
        </Section>

        <Section id="copyright" title="5. Bản quyền & DMCA" desc="Tôn trọng tác giả và người sáng tạo.">
          <ul className="space-y-2">
            <RuleItem>Người đăng chịu trách nhiệm về quyền sử dụng nội dung của mình.</RuleItem>
            <RuleItem>
              Nếu bạn là chủ sở hữu bản quyền, có thể gửi yêu cầu gỡ xuống (notice) qua email đính kèm bằng chứng sở hữu.
            </RuleItem>
            <RuleItem>
              Chúng tôi có thể tạm ẩn nội dung trong thời gian xem xét, và thông báo cho bên liên quan khi phù hợp.
            </RuleItem>
          </ul>
          <div className="mt-3 rounded-xl border border-gray-200 p-3 text-xs text-gray-600 dark:border-white/10 dark:text-white/70">
            <div className="flex items-center gap-2">
              <FileWarning className="h-4 w-4" />
              Mẫu email khiếu nại bản quyền (gợi ý):
            </div>
            <pre className="mt-2 whitespace-pre-wrap break-words">{`Chủ đề: Yêu cầu gỡ nội dung vi phạm bản quyền - [Liên kết nội dung]
Tôi là chủ sở hữu quyền của [tác phẩm]. Nội dung tại [URL] vi phạm bản quyền của tôi. Đính kèm bằng chứng: [đăng ký, bản gốc, so sánh].
Tôi cam đoan thông tin là chính xác.
Họ tên:
Liên hệ:
Ngày:`}</pre>
          </div>
        </Section>

        <Section id="moderation" title="6. Kiểm duyệt & Xử lý vi phạm" desc="Áp dụng nhất quán, cân nhắc bối cảnh.">
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-900 dark:bg-white/5 dark:text-white">
                <tr>
                  <th className="text-left p-3">Mức độ</th>
                  <th className="text-left p-3">Ví dụ</th>
                  <th className="text-left p-3">Biện pháp</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-white/80">
                <tr className="border-t border-gray-200 dark:border-white/10">
                  <td className="p-3">Nhẹ</td>
                  <td className="p-3">Spam nhẹ, đặt sai nhãn</td>
                  <td className="p-3">Nhắc nhở, yêu cầu chỉnh sửa</td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-white/10">
                  <td className="p-3">Trung bình</td>
                  <td className="p-3">Công kích cá nhân, leak thông tin nhẹ</td>
                  <td className="p-3">Gỡ nội dung, cảnh cáo, giới hạn tính năng tạm thời</td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-white/10">
                  <td className="p-3">Nặng</td>
                  <td className="p-3">Thù hằn, bạo lực, 18+ trái phép, xâm phạm bản quyền nghiêm trọng</td>
                  <td className="p-3">Khoá tài khoản, chặn thiết bị, thông báo cơ quan chức năng khi cần</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-gray-600 dark:text-white/70">
            Một số biện pháp có thể áp dụng ngay khi có rủi ro an toàn cao.
          </p>
        </Section>

        <Section id="report" title="7. Báo cáo vi phạm" desc="Chung tay xây dựng cộng đồng tích cực.">
          <ul className="space-y-2">
            <RuleItem>
              Nhấn <Good>Báo cáo</Good> ở cạnh nội dung hoặc gửi email kèm link/ảnh chụp màn hình.
            </RuleItem>
            <RuleItem>Chúng tôi ưu tiên báo cáo có bằng chứng rõ ràng và mô tả chi tiết.</RuleItem>
            <RuleItem>Không lạm dụng chức năng báo cáo; báo cáo sai sự thật có thể bị chế tài.</RuleItem>
          </ul>
          <a
            href="mailto:hello@your-domain.vn?subject=Bao%20cao%20vi%20pham%20Inkwave"
            className="mt-3 inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 hover:bg-gray-100
                       dark:border-white/10 dark:text-white dark:hover:bg-white/5"
          >
            <Mail className="h-4 w-4" />
            Gửi báo cáo qua email
          </a>
        </Section>

        <Section id="safety" title="8. An toàn & quyền riêng tư" desc="Bảo vệ tài khoản và dữ liệu của bạn.">
          <ul className="space-y-2">
            <RuleItem>Không chia sẻ mật khẩu hoặc mã OTP cho bất kỳ ai, kể cả người tự xưng là hỗ trợ.</RuleItem>
            <RuleItem>Kiểm tra kỹ liên kết lạ; chỉ đăng nhập qua tên miền chính thức.</RuleItem>
            <RuleItem>
              Đọc{" "}
              <a href="/privacy" className="underline text-gray-900 dark:text-white">
                Chính sách quyền riêng tư
              </a>{" "}
              để biết cách chúng tôi xử lý dữ liệu.
            </RuleItem>
          </ul>
        </Section>

        <Section id="appeal" title="9. Khiếu nại & khôi phục" desc="Nếu bạn cho rằng quyết định xử lý là sai, hãy gửi khiếu nại.">
          <ul className="space-y-2">
            <RuleItem>Gửi email với tiêu đề “Khiếu nại xử lý tài khoản/nội dung”.</RuleItem>
            <RuleItem>Đính kèm ID nội dung, lý do khiếu nại, lập luận và bằng chứng.</RuleItem>
            <RuleItem>Chúng tôi sẽ phản hồi trong 7 ngày làm việc cho hầu hết trường hợp.</RuleItem>
          </ul>
          <div className="mt-3 text-xs text-gray-600 dark:text-white/60">
            <Info className="inline h-4 w-4 mr-1" />
            Việc khôi phục không đảm bảo trong mọi trường hợp, đặc biệt với vi phạm nghiêm trọng.
          </div>
        </Section>

        <Section id="changes" title="10. Thay đổi nội quy" desc="Có hiệu lực ngay khi công bố.">
          <ul className="space-y-2">
            <RuleItem>Chúng tôi có thể cập nhật nội quy để phù hợp quy định pháp luật và vận hành.</RuleItem>
            <RuleItem>Những thay đổi quan trọng sẽ được thông báo trên trang chủ hoặc qua email (nếu cần).</RuleItem>
          </ul>
        </Section>

        <Section id="contact" title="Liên hệ">
          <div className="text-sm text-gray-700 dark:text-white/80">
            Cần giải đáp thêm? Gửi email về{" "}
            <a href="mailto:hello@your-domain.vn" className="underline text-gray-900 dark:text-white">
              hello@your-domain.vn
            </a>
            .
          </div>
        </Section>
      </main>
    </div>
  );
};
