type Props = {
  id: string;
  title: string;
  desc?: string;
  children?: React.ReactNode;
};

export const Section = ({ id, title, desc, children }: Props) => (
  <section
    id={id}
    className="scroll-mt-24 rounded-2xl bg-white border border-gray-200 p-5 md:p-6
               dark:bg-white/[0.03] dark:border-white/10"
    aria-labelledby={`${id}-title`}
  >
    <h2
      id={`${id}-title`}
      className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white"
    >
      {title}
    </h2>
    {desc && <p className="mt-2 text-sm text-gray-600 dark:text-white/70">{desc}</p>}
    <div className="mt-4 space-y-3">{children}</div>
  </section>
);
