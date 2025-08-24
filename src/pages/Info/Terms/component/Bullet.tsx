import { CheckCircle2 } from "lucide-react";

export const Bullet = ({ children }: { children: React.ReactNode }) => (
  <li className="flex gap-2">
    <CheckCircle2 className="h-5 w-5 shrink-0 text-gray-400 dark:text-white/60" />
    <span className="text-gray-700 dark:text-white">{children}</span>
  </li>
);
