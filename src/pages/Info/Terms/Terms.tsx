import { Clock, Receipt, CreditCard } from "lucide-react";
import { textGradient } from "../constant";
import { Section } from "./component/Section";
import { Bullet } from "./component/Bullet";

export const Terms = () => {
  const updatedAt = "21/08/2025";

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-[#0b0c0e] dark:text-gray-100">
      <header className="border-b border-gray-200 dark:border-white/10">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Điều khoản <span className={textGradient}>Inkwave</span>
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-white/70">
            Vui lòng đọc kỹ trước khi sử dụng dịch vụ đọc & sáng tác trên Inkwave.
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-white/50">
            <Clock className="h-4 w-4" />
            Cập nhật: {updatedAt}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-2 py-5 md:py-7 space-y-4">
        <Section id="acceptance" title="1. Chấp nhận điều khoản">
          <ul className="space-y-1">
            <Bullet>Sử dụng Inkwave đồng nghĩa bạn đồng ý với điều khoản này.</Bullet>
            <Bullet>Nếu không đồng ý, vui lòng ngừng sử dụng dịch vụ.</Bullet>
          </ul>
        </Section>

        <Section id="account" title="2. Tài khoản & Bảo mật">
          <ul className="space-y-1">
            <Bullet>Bạn cần từ 13 tuổi trở lên để tạo tài khoản.</Bullet>
            <Bullet>Tự chịu trách nhiệm với mật khẩu và hoạt động trên tài khoản.</Bullet>
            <Bullet>Thông tin đăng ký phải chính xác, không mạo danh.</Bullet>
          </ul>
        </Section>

        <Section id="content" title="3. Nội dung người dùng">
          <ul className="space-y-1">
            <Bullet>Bạn giữ bản quyền nội dung mình tạo (truyện, bình luận...).</Bullet>
            <Bullet>Khi đăng tải, bạn cho phép Inkwave hiển thị & phân phối nội dung.</Bullet>
            <Bullet>Nội dung không được vi phạm pháp luật hoặc quyền của người khác.</Bullet>
          </ul>
        </Section>

        <Section id="prohibited" title="4. Hành vi cấm">
          <ul className="space-y-1">
            <Bullet>Phát tán mã độc, hack hệ thống, lừa đảo, gian lận.</Bullet>
            <Bullet>Nội dung thù ghét, khiêu dâm trẻ vị thành niên, doxxing.</Bullet>
            <Bullet>Sao chép, mạo danh hoặc vi phạm bản quyền.</Bullet>
          </ul>
        </Section>

        <Section id="payment" title="5. Thanh toán & Coin">
          <ul className="space-y-1">
            <Bullet>Bạn nạp Coin qua các mệnh giá có sẵn trên web.</Bullet>
            <Bullet>Coin dùng để mua truyện hoặc có thể yêu cầu rút ra tiền.</Bullet>
            <Bullet>Yêu cầu rút Coin phải tuân thủ hướng dẫn và kiểm duyệt của Inkwave.</Bullet>
          </ul>
          <div className="mt-2 text-xs text-gray-600 dark:text-white/70 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Thanh toán xử lý bởi cổng thanh toán đối tác.
            </div>
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Lưu lại biên nhận để được hỗ trợ khi có sự cố.
            </div>
          </div>
        </Section>

        <Section id="ip" title="6. Quyền sở hữu Inkwave">
          <ul className="space-y-1">
            <Bullet>Mã nguồn, thiết kế, logo thuộc sở hữu Inkwave.</Bullet>
            <Bullet>Cấm sao chép, khai thác trái phép.</Bullet>
          </ul>
        </Section>

        <Section id="moderation" title="7. Kiểm duyệt & Chấm dứt">
          <ul className="space-y-1">
            <Bullet>Chúng tôi có thể xóa nội dung, khóa tài khoản khi vi phạm.</Bullet>
            <Bullet>Bạn có thể khiếu nại qua email kèm ID và bằng chứng.</Bullet>
          </ul>
        </Section>

        <Section id="disclaimer" title="8. Miễn trừ trách nhiệm">
          <ul className="space-y-1">
            <Bullet>Dịch vụ có thể gián đoạn hoặc lỗi, không đảm bảo mọi nhu cầu.</Bullet>
            <Bullet>Không chịu trách nhiệm với thiệt hại phát sinh ngoài khả năng pháp luật cho phép.</Bullet>
          </ul>
        </Section>

        <Section id="law" title="9. Luật áp dụng">
          <ul className="space-y-1">
            <Bullet>Điều khoản tuân theo pháp luật Việt Nam.</Bullet>
            <Bullet>Tranh chấp giải quyết tại Tòa án Việt Nam.</Bullet>
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
