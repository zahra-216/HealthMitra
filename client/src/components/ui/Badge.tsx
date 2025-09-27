// client/src/components/ui/Badge.tsx
import React from "react";
import { clsx } from "clsx";

interface BadgeProps {
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  children,
  className,
}) => {
  const variantClasses = {
    default: "badge-default",
    primary: "badge-primary",
    success: "badge-success",
    warning: "badge-warning",
    danger: "badge-danger",
  };

  return (
    <span className={clsx("badge", variantClasses[variant], className)}>
      {children}
    </span>
  );
};

export default Badge;
