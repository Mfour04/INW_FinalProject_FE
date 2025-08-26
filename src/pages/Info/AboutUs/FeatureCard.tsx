import { gradient } from "../constant";

type Props = {
  icon: React.ReactNode;
  title: string;
  desc?: string;
};

export const FeatureCard = ({ icon, title, desc }: Props) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col items-center text-center hover:bg-gray-50 transition
                  dark:border-white/10 dark:bg-[#131416]/80 dark:hover:bg-white/[0.06]">
    <div className={`h-12 w-12 grid place-items-center rounded-lg ${gradient} text-white mb-3 shadow-sm`}>
      {icon}
    </div>
    <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
    {desc ? <p className="text-xs text-gray-600 mt-2 dark:text-white/60">{desc}</p> : null}
  </div>
);
