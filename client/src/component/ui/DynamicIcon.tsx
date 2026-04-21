import * as Icons from 'lucide-react';
import type { LucideProps } from 'lucide-react'; 

interface DynamicIconProps extends LucideProps {
  name: string;
}

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  // Access the icon by its string name (e.g., Icons["Monitor"])
  const IconComponent = (Icons as any)[name];

  if (!IconComponent) {
    // Fallback icon if the name in the DB doesn't match a Lucide icon
    return <Icons.Briefcase {...props} />;
  }

  return <IconComponent {...props} />;
};