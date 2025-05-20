export interface MenuItem {
  icon?: string;
  label: string;
  path: string;
  isHeader?: boolean;
  subItems?: {
    label: string;
    path: string;
    isActive?: boolean;
  }[];
}