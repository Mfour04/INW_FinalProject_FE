type Props = { label: string; children: React.ReactNode };

export const Row = ({ label, children }: Props) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-zinc-600 dark:text-white/60">{label}</span>
      <div className="text-right">{children}</div>
    </div>
  );
};
