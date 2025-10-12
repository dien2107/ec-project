import type { CSSObjectWithLabel } from "react-select";

export const reactSelectStyles = {
  control: (provided: CSSObjectWithLabel) => ({
    ...provided,
    minHeight: 36,
    height: 36,
    borderRadius: 8,
    fontSize: 14,
  }),
  menu: (provided: CSSObjectWithLabel) => ({
    ...provided,
    maxHeight: 300,
    overflowY: "auto" as const,
    borderRadius: 8,
    fontSize: 14,
  }),
};
