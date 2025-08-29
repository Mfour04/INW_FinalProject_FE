import React from "react";
import Typography from "../../../components/TypographyComponent";
import { HEADER } from "../ui/tokens";

export type SectionHeaderProps = {
  icon?: React.ReactNode;
  title: string;
  right?: React.ReactNode;
};

export const SectionHeader = ({ icon, title, right }: SectionHeaderProps) => (
  <div className={`${HEADER} min-w-0`}>
    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
      {icon ? <span className="[&>svg]:h-5 [&>svg]:w-5">{icon}</span> : null}
      <Typography className="truncate tracking-wide">{title}</Typography>
    </div>
    <div className="shrink-0">{right}</div>
  </div>
);
