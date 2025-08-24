import { ShieldCheck } from "lucide-react";

export const Good = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1 rounded-md border border-emerald-400/30 px-2 py-0.5 text-xs text-emerald-300 bg-emerald-400/10">
    <ShieldCheck className="h-3.5 w-3.5" />
    {children}
  </span>
);
