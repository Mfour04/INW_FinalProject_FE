import React from "react";
import { motion } from "framer-motion";

type Novel = {
  novelId: string;
  title: string;
  novelImage?: string;
};

type SectionData = {
  id: string;
  title: string;
  items: Novel[];
};

const ORANGE_GRAD = "from-[#ff512f] via-[#ff6740] to-[#ff9966]";

const Dot = () => (
  <span className={`inline-block h-2 w-2 rounded-full bg-gradient-to-r ${ORANGE_GRAD} shadow-[0_0_0_3px_rgba(255,103,64,0.12)]`} />
);

const Header: React.FC<{ title: string; right?: React.ReactNode }> = ({ title, right }) => (
  <div className="flex items-center justify-between gap-3 py-2">
    <div className="flex items-center gap-2">
      <Dot />
      <h3 className="text-base font-semibold tracking-wide">{title}</h3>
    </div>
    {right}
  </div>
);

const ListTile: React.FC<{
  n: Novel;
  onClick: (n: Novel) => void;
  primary?: React.ReactNode;    
  secondary?: React.ReactNode;  
}> = ({ n, onClick, primary, secondary }) => (
  <button
    onClick={() => onClick(n)}
    className="group w-full flex items-center gap-3 rounded-xl p-2 hover:bg-white/5 transition"
  >
    <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-white/5 ring-1 ring-white/10">
      {n.novelImage ? (
        <img src={n.novelImage} alt={n.title} className="h-full w-full object-cover group-hover:scale-[1.03] transition" />
      ) : (
        <div className="h-full w-full animate-pulse" />
      )}
    </div>

    <div className="min-w-0 flex-1">
      <div className="text-[15px] font-medium leading-tight truncate">{n.title}</div>
      <div className="mt-1 text-xs text-white/70 flex items-center gap-3">
        {primary && <span className="inline-flex items-center gap-1">{primary}</span>}
        {secondary && <span className="inline-flex items-center gap-1">{secondary}</span>}
      </div>
    </div>

    <span className="ml-2 inline-flex h-1.5 w-1.5 rounded-full bg-white/40 group-hover:bg-gradient-to-r group-hover:from-[#ff512f] group-hover:via-[#ff6740] group-hover:to-[#ff9966] transition" />
  </button>
);

const CardTile: React.FC<{ n: Novel; onClick: (n: Novel) => void }> = ({ n, onClick }) => (
  <motion.button
    whileHover={{ y: -3, scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    onClick={() => onClick(n)}
    className="relative overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10"
  >
    <div className="aspect-[3/4] w-full">
      {n.novelImage ? (
        <img src={n.novelImage} alt={n.title} className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full animate-pulse" />
      )}
    </div>
    <div className="p-3">
      <div className="text-sm font-medium line-clamp-2">{n.title}</div>
    </div>
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
  </motion.button>
);

const SectionShell: React.FC<{
  data: SectionData;
  variant?: "list" | "grid";
  onClickItem: (n: Novel) => void;
  primaryMetric?: (n: Novel) => React.ReactNode;
  secondaryMetric?: (n: Novel) => React.ReactNode;
}> = ({ data, variant = "list", onClickItem, primaryMetric, secondaryMetric }) => (
  <section className="rounded-3xl bg-black/20 ring-1 ring-white/10 p-3">
    <Header title={data.title} />
    <div className="mx-1 mb-2 h-px bg-white/10" />
    {variant === "list" ? (
      <div className="divide-y divide-white/5">
        {data.items.map((n) => (
          <div key={n.novelId} className="py-1">
            <ListTile
              n={n}
              onClick={onClickItem}
              primary={primaryMetric?.(n)}
              secondary={secondaryMetric?.(n)}
            />
          </div>
        ))}
      </div>
    ) : (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-2">
        {data.items.map((n) => (
          <CardTile key={n.novelId} n={n} onClick={onClickItem} />
        ))}
      </div>
    )}
  </section>
);

export const DiscoveryColumns: React.FC<{
  sections: SectionData[];                  
  layout?: Array<"list" | "grid">;       
  onClickItem: (n: Novel) => void;
  primaryMetric?: (n: Novel) => React.ReactNode;
  secondaryMetric?: (n: Novel) => React.ReactNode;
}> = ({ sections, layout = [], onClickItem, primaryMetric, secondaryMetric }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {sections.map((s, i) => (
        <SectionShell
          key={s.id}
          data={s}
          variant={layout[i] ?? "list"}
          onClickItem={onClickItem}
          primaryMetric={primaryMetric}
          secondaryMetric={secondaryMetric}
        />
      ))}
    </div>
  );
};
