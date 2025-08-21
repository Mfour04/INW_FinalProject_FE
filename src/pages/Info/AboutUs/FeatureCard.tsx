import { gradient } from "../constant";

type Props = {
  icon: React.ReactNode;
  title: string;
  desc?: string;
};

export const FeatureCard = ({ icon, title, desc }: Props) => (
  <div className="rounded-2xl border border-white/10 bg-[#131416]/80 p-6 flex flex-col items-center text-center hover:bg-white/[0.06] transition">
    <div
      className={`h-12 w-12 grid place-items-center rounded-lg ${gradient} text-white mb-3`}
    >
      {icon}
    </div>
    <h3 className="text-white font-semibold">{title}</h3>
    {desc ? <p className="text-xs text-white/60 mt-2">{desc}</p> : null}
  </div>
);
