import { categoryIconMap } from "@/constants/iconMap";
import { Box } from "lucide-react";

export default function CategoryIcon({ keyName, className }) {
  const Icon = (keyName && categoryIconMap[keyName]) || Box;
  return <Icon className={className || "w-5 h-5"} />;
}
