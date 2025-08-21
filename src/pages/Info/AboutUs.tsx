import React from "react";
import {
  BookOpen,
  HandCoins,
  ShieldCheck,
  Sparkles,
  HeartHandshake,
  ArrowRight,
  Mail,
  Quote,
} from "lucide-react";

const gradient = "bg-gradient-to-r from-[#ff7a45] to-[#ff5e3a]";
const textGradient =
  "bg-gradient-to-r from-[#ff7a45] to-[#ff5e3a] bg-clip-text text-transparent";

const SectionTitle = ({ title }: { title: string }) => (
  <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-8">
    <span className={textGradient}>{title}</span>
  </h2>
);

const FeatureCard = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc?: string;
}) => (
  <div className="rounded-2xl border border-white/10 bg-[#131416]/80 p-6 flex flex-col items-center text-center hover:bg-white/[0.06] transition">
    <div className={`h-12 w-12 grid place-items-center rounded-lg ${gradient} text-white mb-3`}>
      {icon}
    </div>
    <h3 className="text-white font-semibold">{title}</h3>
    {desc ? <p className="text-xs text-white/60 mt-2">{desc}</p> : null}
  </div>
);

type Member = {
  name: string;
  role: string;
  initials: string;
  imgSrc?: string;
};

const TeamMember = ({ m }: { m: Member }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 flex items-center gap-4 hover:bg-white/[0.06] transition">
    {m.imgSrc ? (
      <img
        src={m.imgSrc}
        alt={m.name}
        className="h-14 w-14 rounded-xl object-cover ring-1 ring-white/15"
      />
    ) : (
      <div className={`h-14 w-14 ${gradient} rounded-xl grid place-items-center text-white font-bold`}>
        {m.initials}
      </div>
    )}
    <div className="min-w-0">
      <div className="font-semibold text-white truncate">{m.name}</div>
      <div className="text-xs text-white/60 truncate">{m.role}</div>
    </div>
  </div>
);

export default function AboutUs() {
  const row1: Member[] = [
    { name: "Minh Quân", role: "Kỹ sư trưởng", initials: "MQ" },
    { name: "Khánh Linh", role: "Thiết kế sản phẩm", initials: "KL" },
  ];

  const row2: Member[] = [
    { name: "Hoàng Anh", role: "Backend", initials: "HA" },
    { name: "Tuệ Nhi", role: "Growth", initials: "TN" },
    { name: "Bảo Long", role: "Frontend", initials: "BL" },
  ];

  return (
    // Chặn tràn ngang toàn trang
    <div className="min-h-screen bg-[#0b0c0e] text-gray-100 font-sans overflow-x-hidden">
      {/* HERO */}
      <section className="relative">
        {/* Lớp nền trang trí, nhưng bọc trong overflow-hidden để không đẩy width */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute left-0 top-0 h-[28rem] w-[28rem] -translate-x-1/3 -translate-y-1/3 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,122,69,0.18),transparent_60%)] blur-2xl" />
          <div className="absolute right-0 bottom-0 h-[28rem] w-[28rem] translate-x-1/3 translate-y-1/3 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,94,58,0.16),transparent_60%)] blur-2xl" />
        </div>

        {/* Nội dung hero đóng khung max width để tránh kéo giãn */}
        <div className="mx-auto max-w-6xl px-4 py-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] tracking-wider uppercase ring-1 ring-white/10 bg-white/5 text-white/70">
            <BookOpen className="w-4 h-4" />
            Nền tảng truyện số
          </div>

          <h1 className="mt-4 text-3xl md:text-4xl font-extrabold leading-tight text-white">
            Đọc truyện{" "}
            <span className={textGradient}>liền tay — tác giả nhận trực tiếp</span>
          </h1>
          <p className="mt-3 text-white/70 max-w-2xl mx-auto text-sm md:text-base">
            Tập trung vào tốc độ, trải nghiệm gọn và quy trình mua cực nhanh.
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <a
              href="#differ"
              className={`px-5 py-2 rounded-xl text-sm ${gradient} text-white font-medium`}
            >
              Khám phá <ArrowRight className="inline w-4 h-4 ml-1" />
            </a>
            <a
              href="#contact"
              className="px-5 py-2 rounded-xl text-sm ring-1 ring-white/20 bg-white/5 text-white/90"
            >
              Liên hệ <Mail className="inline w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </section>

      {/* DIFFERENTIATOR */}
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

      {/* STORY */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <Quote className="w-8 h-8 text-white/50 mx-auto mb-3" />
        <p className="text-lg md:text-xl text-white/85 font-medium leading-relaxed">
          “Nơi câu chữ đến tay độc giả nhanh nhất, và giá trị quay về với tác giả trọn vẹn nhất.”
        </p>
      </section>

      {/* TEAM */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionTitle title="Đội ngũ" />
        {/* Row 1: 2 người, canh giữa */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-4">
          {row1.map((m) => (
            <TeamMember key={m.name} m={m} />
          ))}
        </div>
        {/* Row 2: 3 người, tự co theo màn hình */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {row2.map((m) => (
            <TeamMember key={m.name} m={m} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h3 className="text-xl md:text-2xl font-bold">
          Tham gia xây dựng nền tảng{" "}
          <span className={textGradient}>đọc & xuất bản trực tiếp</span>
        </h3>
        <p className="mt-2 text-white/70 text-sm md:text-base">
          Nếu bạn là tác giả hoặc người đọc yêu thích sự gọn nhẹ, chúng ta hợp gu.
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <a
            href="mailto:hello@your-domain.vn"
            className={`px-5 py-2 rounded-xl text-sm ${gradient} text-white font-medium`}
          >
            Liên hệ ngay
          </a>
        </div>
      </section>
    </div>
  );
}
