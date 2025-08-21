import { CheckCircle2 } from "lucide-react";

export const Bullet = ({ children }: { children: React.ReactNode }) => (
  <li className="flex gap-2">
    <CheckCircle2 className="h-5 w-5 shrink-0 text-white/60" />
    <span>{children}</span>
  </li>
);
