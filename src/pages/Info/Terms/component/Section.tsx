import { ShieldCheck } from "lucide-react";
import { pill } from "../../constant";

type Props = {
  id: string;
  title: string;
  children?: React.ReactNode;
};

export const Section = ({ id, title, children }: Props) => (
  <section id={id} className={`${pill} p-5 md:p-6 scroll-mt-24`}>
    <h2 className="flex items-center gap-2 text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
      <ShieldCheck className="h-5 w-5 text-gray-700 dark:text-white" />
      {title}
    </h2>
    <div className="mt-3 space-y-2 text-sm text-gray-700 dark:text-white/80">
      {children}
    </div>
  </section>
);
