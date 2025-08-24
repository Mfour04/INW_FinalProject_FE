import { textGradient } from "../constant";
type Props = { title: string };

export const SectionTitle = ({ title }: Props) => (
  <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-8">
    <span className={textGradient}>{title}</span>
  </h2>
);
