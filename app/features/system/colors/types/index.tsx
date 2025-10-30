import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { SortableHeader } from "../../components/data-table";

export interface Color {
  colorId: string;
  displayName: string;
  hexCode: string;
  description: string;
  status: "active" | "inactive";
}

export interface CreateColorData {
  name: string;
  hexCode: string;
  description: string;
  status: "active" | "inactive";
}

export interface UpdateColorData extends CreateColorData {
  id: string;
}
