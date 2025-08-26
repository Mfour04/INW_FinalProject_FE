import { CheckCircle2 } from "lucide-react";

export const RuleItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex gap-3">
    <CheckCircle2 className="mt-0.5 h-4 w-4 text-gray-400 dark:text-white/60" />
    <span className="text-sm text-gray-700 dark:text-white/80">{children}</span>
  </li>
);
