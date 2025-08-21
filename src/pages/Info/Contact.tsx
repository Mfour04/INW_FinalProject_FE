// Contact.tsx
import React, { useState } from "react";
import { Mail, Phone, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

const gradient = "bg-gradient-to-r from-[#ff7a45] to-[#ff5e3a]";
const textGradient =
  "bg-gradient-to-r from-[#ff7a45] to-[#ff5e3a] bg-clip-text text-transparent";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "", // honeypot
  });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");

  const onChange =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((s) => ({ ...s, [k]: e.target.value }));
      if (errors[k]) setErrors((er) => ({ ...er, [k]: "" }));
    };

  const validate = () => {
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = "Vui lòng nhập họ tên.";
    if (!form.email.trim()) next.email = "Vui lòng nhập email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Email không hợp lệ.";
    if (!form.message.trim()) next.message = "Hãy nhập nội dung cần liên hệ.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.website) return; // bot
    if (!validate()) return;

    try {
      setStatus("submitting");
      setStatusMsg("");
      await new Promise((r) => setTimeout(r, 900)); // giả lập API
      setStatus("success");
      setStatusMsg("Đã gửi liên hệ. Chúng tôi sẽ phản hồi sớm.");
      setForm({ name: "", email: "", subject: "", message: "", website: "" });
    } catch {
      setStatus("error");
      setStatusMsg("Gửi thất bại. Vui lòng thử lại sau.");
    } finally {
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-gray-100 overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Liên hệ <span className={textGradient}>Inkwave</span>
          </h1>
          <p className="mt-2 text-sm md:text-base text-white/70 max-w-2xl">
            Gửi câu hỏi, góp ý hoặc hợp tác. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Form */}
          <section className="lg:col-span-3">
            <form
              onSubmit={onSubmit}
              className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 md:p-6"
              noValidate
            >
              <input
                type="text"
                value={form.website}
                onChange={onChange("website")}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="text-sm text-white/70">Họ tên *</label>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={onChange("name")}
                    className="mt-1 w-full rounded-xl bg-[#101114] border border-white/10 px-4 py-3 text-sm outline-none focus:border-white/20"
                    placeholder="Nhập tên của bạn"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="text-sm text-white/70">Email *</label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={onChange("email")}
                    className="mt-1 w-full rounded-xl bg-[#101114] border border-white/10 px-4 py-3 text-sm outline-none focus:border-white/20"
                    placeholder="Nhập địa chỉ email của bạn"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="subject" className="text-sm text-white/70">Tiêu đề</label>
                <input
                  id="subject"
                  type="text"
                  value={form.subject}
                  onChange={onChange("subject")}
                  className="mt-1 w-full rounded-xl bg-[#101114] border border-white/10 px-4 py-3 text-sm outline-none focus:border-white/20"
                  placeholder="Hợp tác / Góp ý / Báo lỗi…"
                />
              </div>

              <div className="mt-4">
                <label htmlFor="message" className="text-sm text-white/70">Nội dung *</label>
                <textarea
                  id="message"
                  value={form.message}
                  onChange={onChange("message")}
                  rows={6}
                  maxLength={2000}
                  className="mt-1 w-full rounded-xl bg-[#101114] border border-white/10 px-4 py-3 text-sm outline-none focus:border-white/20 resize-none"
                  placeholder="Mô tả ngắn gọn, kèm thông tin cần thiết…"
                />
                {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
                <p className="mt-1 text-xs text-white/50 text-right">
                  {form.message.length}/2000
                </p>
              </div>

              {/* trạng thái */}
              <div className="mt-2 min-h-[22px]" aria-live="polite">
                {status === "success" && (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <CheckCircle2 className="h-4 w-4" />
                    {statusMsg}
                  </div>
                )}
                {status === "error" && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {statusMsg}
                  </div>
                )}
              </div>

              <div className="mt-0">
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm ${gradient} text-white font-medium disabled:opacity-60`}
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang gửi…
                    </>
                  ) : (
                    <>
                      Gửi liên hệ
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* Info + Tips */}
          <aside className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5">
              <h2 className="text-base font-semibold text-white">Thông tin liên hệ</h2>
              <ul className="mt-3 space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-white/70 mt-0.5" />
                  <div>
                    <div className="text-white/70">Email</div>
                    <a href="mailto:hello@your-domain.vn" className="text-white hover:underline">
                      hello@your-domain.vn
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-white/70 mt-0.5" />
                  <div>
                    <div className="text-white/70">Điện thoại</div>
                    <div className="text-white">(+84) 912-345-678</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Tips ngắn gọn thay vì FAQ */}
            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 text-sm text-white/70 space-y-2">
              <p>⏳ Phản hồi trong 24–48h làm việc.</p>
              <p>📧 Email sẽ được ưu tiên xử lý nhanh nhất.</p>
              <p>🕒 Yêu cầu gửi ngoài giờ có thể chậm hơn.</p>
            </div>

            {/* Google Map: Đại học FPT Đà Nẵng */}
            <div className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden">
              <div className="aspect-[16/10]">
                <iframe
                  title="Đại học FPT Đà Nẵng"
                  src="https://www.google.com/maps?q=Đại+học+FPT+Đà+Nẵng&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
