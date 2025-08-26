import { gradient } from "../constant";

export type Member = {
  name: string;
  role: string;
  initials: string;
  imgSrc?: string;
};

export const TeamMember = ({ m }: { m: Member }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-4 flex items-center gap-4 hover:bg-gray-50 transition
                  dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.06]">
    {m.imgSrc ? (
      <img
        src={m.imgSrc}
        alt={m.name}
        className="h-14 w-14 rounded-xl object-cover ring-1 ring-gray-200 dark:ring-white/15"
      />
    ) : (
      <div className={`h-14 w-14 ${gradient} rounded-xl grid place-items-center text-white font-bold`}>
        {m.initials}
      </div>
    )}
    <div className="min-w-0">
      <div className="font-semibold text-gray-900 truncate dark:text-white">{m.name}</div>
      <div className="text-xs text-gray-600 truncate dark:text-white/60">{m.role}</div>
    </div>
  </div>
);
