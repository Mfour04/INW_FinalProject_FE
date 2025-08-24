import { gradient } from "../constant";

export type Member = {
  name: string;
  role: string;
  initials: string;
  imgSrc?: string;
};

export const TeamMember = ({ m }: { m: Member }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 flex items-center gap-4 hover:bg-white/[0.06] transition">
    {m.imgSrc ? (
      <img
        src={m.imgSrc}
        alt={m.name}
        className="h-14 w-14 rounded-xl object-cover ring-1 ring-white/15"
      />
    ) : (
      <div
        className={`h-14 w-14 ${gradient} rounded-xl grid place-items-center text-white font-bold`}
      >
        {m.initials}
      </div>
    )}
    <div className="min-w-0">
      <div className="font-semibold text-white truncate">{m.name}</div>
      <div className="text-xs text-white/60 truncate">{m.role}</div>
    </div>
  </div>
);
