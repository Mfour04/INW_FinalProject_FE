import { AlertTriangle } from "lucide-react";

export const Bad = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-0.5 text-xs text-red-700 bg-red-50
                   dark:border-red-400/30 dark:text-red-300 dark:bg-red-400/10">
    <AlertTriangle className="h-3.5 w-3.5" />
    {children}
  </span>
);
