import React from "react";
import Typography from "../../../components/TypographyComponent";
import { HEADER } from "../ui/tokens";

export type SectionHeaderProps = {
  icon?: React.ReactNode;
  title: string;
  right?: React.ReactNode;
};

export const SectionHeader = ({ icon, title, right }: SectionHeaderProps) => (
  <div className={HEADER}>
    <div className="flex items-center gap-3">
      {icon}
      <Typography className="tracking-wide">{title}</Typography>
    </div>
    {right}
  </div>
);
