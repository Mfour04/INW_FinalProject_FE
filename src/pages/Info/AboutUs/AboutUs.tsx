import {
  BookOpen,
  HandCoins,
  ShieldCheck,
  HeartHandshake,
  ArrowRight,
  Mail,
  Quote,
} from "lucide-react";
import { gradient, textGradient } from "../constant";
import { SectionTitle } from "./SectionTitle";
import { TeamMember, type Member } from "./TeamMember";
import { FeatureCard } from "./FeatureCard";

const row1: Member[] = [
  { name: "Minh Quân", role: "Kỹ sư trưởng", initials: "MQ" },
  { name: "Khánh Linh", role: "Thiết kế sản phẩm", initials: "KL" },
];

const row2: Member[] = [
  { name: "Hoàng Anh", role: "Backend", initials: "HA" },
  { name: "Tuệ Nhi", role: "Growth", initials: "TN" },
  { name: "Bảo Long", role: "Frontend", initials: "BL" },
];

export const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden dark:bg-[#0b0c0e] dark:text-gray-100">
      <section className="relative">
        {/* light/dark ambient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute left-0 top-0 h-[28rem] w-[28rem] -translate-x-1/3 -translate-y-1/3 rounded-full
                          bg-[radial-gradient(circle_at_center,rgba(255,122,69,0.08),transparent_60%)]
                          blur-2xl dark:bg-[radial-gradient(circle_at_center,rgba(255,122,69,0.18),transparent_60%)]" />
          <div className="absolute right-0 bottom-0 h-[28rem] w-[28rem] translate-x-1/3 translate-y-1/3 rounded-full
                          bg-[radial-gradient(circle_at_center,rgba(255,94,58,0.07),transparent_60%)]
                          blur-2xl dark:bg-[radial-gradient(circle_at_center,rgba(255,94,58,0.16),transparent_60%)]" />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-10 text-center relative">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] tracking-wider uppercase
                          ring-1 ring-gray-200 bg-gray-100 text-gray-700
                          dark:ring-white/10 dark:bg-white/5 dark:text-white/70">
            <BookOpen className="w-4 h-4" />
            Nền tảng truyện số
          </div>

          <h1 className="mt-4 text-3xl md:text-4xl font-extrabold leading-tight">
            Đọc truyện{" "}
            <span className={textGradient}>
              liền tay — tác giả nhận trực tiếp
            </span>
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-sm md:text-base dark:text-white/70">
            Tập trung vào tốc độ, trải nghiệm gọn và quy trình mua cực nhanh.
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <a
              href="#differ"
              className={`px-5 py-2 rounded-xl text-sm ${gradient} text-white font-medium shadow-sm hover:opacity-95 transition`}
            >
              Khám phá <ArrowRight className="inline w-4 h-4 ml-1" />
            </a>
            <a
              href="#contact"
              className="px-5 py-2 rounded-xl text-sm ring-1 ring-gray-200 bg-gray-100 text-gray-900 hover:bg-gray-200 transition
                         dark:ring-white/20 dark:bg-white/5 dark:text-white/90"
            >
              Liên hệ <Mail className="inline w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </section>

      <section id="differ" className="mx-auto max-w-6xl px-4 py-16">
        <SectionTitle title="Điểm khác biệt" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCard
            icon={<HandCoins className="w-5 h-5" />}
            title="Doanh thu đến đúng người viết"
            desc="Cơ chế thanh toán minh bạch, rút nhanh."
          />
          <FeatureCard
            icon={<HeartHandshake className="w-5 h-5" />}
            title="Kết nối trực tiếp tác giả–độc giả"
            desc="Theo dõi, ủng hộ, tương tác ngay trong trang đọc."
          />
          <FeatureCard
            icon={<ShieldCheck className="w-5 h-5" />}
            title="Bảo vệ nội dung & tác quyền"
            desc="Giảm sao chép trái phép qua watermark & kiểm duyệt."
          />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <Quote className="w-8 h-8 text-gray-400 mx-auto mb-3 dark:text-white/50" />
        <p className="text-lg md:text-xl text-gray-800 font-medium leading-relaxed dark:text-white/85">
          “Nơi câu chữ đến tay độc giả nhanh nhất, và giá trị quay về với tác
          giả trọn vẹn nhất.”
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionTitle title="Đội ngũ" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-4">
          {row1.map((m) => (
            <TeamMember key={m.name} m={m} />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {row2.map((m) => (
            <TeamMember key={m.name} m={m} />
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h3 className="text-xl md:text-2xl font-bold">
          Tham gia xây dựng nền tảng{" "}
          <span className={textGradient}>đọc & xuất bản trực tiếp</span>
        </h3>
        <p className="mt-2 text-gray-600 text-sm md:text-base dark:text-white/70">
          Nếu bạn là tác giả hoặc người đọc yêu thích sự gọn nhẹ, chúng ta hợp
          gu.
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <a
            href="/contact"
            className={`px-5 py-2 rounded-xl text-sm ${gradient} text-white font-medium shadow-sm hover:opacity-95 transition`}
          >
            Liên hệ ngay
          </a>
        </div>
      </section>
    </div>
  );
};
