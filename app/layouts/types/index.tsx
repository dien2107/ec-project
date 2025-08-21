import type { LucideIcon } from "lucide-react";

export type SideBarMenuItemProps = {
  title: string;
  url: string;
  icon: LucideIcon;
};

export type SideBarMenuGroupProps = {
  group_label: string;
  items: SideBarMenuItemProps[];
};
