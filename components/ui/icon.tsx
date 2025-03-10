import { icons } from "lucide-react";

export const Icon = ({
  name,
  // color,
  size,
  className,
}: {
  name: keyof typeof icons;
  // color: string;
  size: number;
  className?: string;
}) => {
  const LucideIcon = icons[name as keyof typeof icons];

  return <LucideIcon size={size} className={className} />;
};
