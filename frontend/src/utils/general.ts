import type { SelectOption } from "@/components/Select/Select.tsx";

export const categoryOptions: SelectOption[] = [
  { value: "", label: "All Transactions" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Bills", label: "Bills" },
  { value: "Groceries", label: "Groceries" },
  { value: "Dining Out", label: "Dining Out" },
  { value: "Transportation", label: "Transportation" },
  { value: "Personal Care", label: "Personal Care" },
  { value: "Education", label: "Education" },
  { value: "Lifestyle", label: "Lifestyle" },
  { value: "Shopping", label: "Shopping" },
  { value: "General", label: "General" },
];

export const themeOptions: SelectOption[] = [
  { value: "#277C78", label: "Green" },
  { value: "#82C9D7", label: "Cyan" },
  { value: "#F2CDAC", label: "Beige" },
  { value: "#626070", label: "Navy" },
  { value: "#826CB0", label: "Purple" },
  { value: "#3F82B2", label: "Blue" },
  { value: "#BE6C49", label: "Orange" },
  { value: "#93674F", label: "Brown" },
  { value: "#C94736", label: "Red" },
  { value: "#CAB361", label: "Gold" },
];
