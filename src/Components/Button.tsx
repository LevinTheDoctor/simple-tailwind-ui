import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2, type LucideIcon } from "lucide-react";

type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
type ButtonVariant = "solid" | "outline" | "ghost";
type ButtonColor = "primary" | "secondary" | "success" | "danger" | "warning" | "neutral";
type IconPosition = "left" | "right" | "only";

type ButtonProps = {
  readonly variant?: ButtonVariant;
  readonly color?: ButtonColor;
  readonly size?: ButtonSize;
  readonly icon?: LucideIcon;
  readonly iconPosition?: IconPosition;
  readonly isLoading?: boolean;
  readonly fullWidth?: boolean;
  readonly children?: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

const sizeClasses: Record<ButtonSize, string> = {
  xs: "text-xs px-2 py-1 gap-1",
  sm: "text-sm px-3 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2 gap-2",
  lg: "text-base px-5 py-2.5 gap-2",
  xl: "text-lg px-6 py-3 gap-2.5",
};

const iconSizeClasses: Record<ButtonSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
};

const colorVariantClasses: Record<ButtonColor, Record<ButtonVariant, string>> = {
  primary: {
    solid:   "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-blue-500",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100 dark:hover:bg-blue-950 focus-visible:ring-blue-500",
    ghost:   "text-blue-600 hover:bg-blue-50 active:bg-blue-100 dark:hover:bg-blue-950 focus-visible:ring-blue-500",
  },
  secondary: {
    solid:   "bg-orange-400 text-white hover:bg-orange-700 active:bg-orange-800 focus-visible:ring-orange-500",
    outline: "border border-orange-400 text-orange-600 hover:bg-orange-50 active:bg-orange-100 dark:hover:bg-orange-950 focus-visible:ring-orange-500",
    ghost:   "text-orange-400 hover:bg-orange-50 active:bg-orange-100 dark:hover:bg-orange-950 focus-visible:ring-orange-500",
  },
  success: {
    solid:   "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 focus-visible:ring-emerald-500",
    outline: "border border-emerald-600 text-emerald-600 hover:bg-emerald-50 active:bg-emerald-100 dark:hover:bg-emerald-950 focus-visible:ring-emerald-500",
    ghost:   "text-emerald-600 hover:bg-emerald-50 active:bg-emerald-100 dark:hover:bg-emerald-950 focus-visible:ring-emerald-500",
  },
  danger: {
    solid:   "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500",
    outline: "border border-red-600 text-red-600 hover:bg-red-50 active:bg-red-100 dark:hover:bg-red-950 focus-visible:ring-red-500",
    ghost:   "text-red-600 hover:bg-red-50 active:bg-red-100 dark:hover:bg-red-950 focus-visible:ring-red-500",
  },
  warning: {
    solid:   "bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 focus-visible:ring-amber-400",
    outline: "border border-amber-500 text-amber-600 hover:bg-amber-50 active:bg-amber-100 dark:hover:bg-amber-950 focus-visible:ring-amber-400",
    ghost:   "text-amber-600 hover:bg-amber-50 active:bg-amber-100 dark:hover:bg-amber-950 focus-visible:ring-amber-400",
  },
  neutral: {
    solid:   "bg-zinc-700 text-white hover:bg-zinc-800 active:bg-zinc-900 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-300 focus-visible:ring-zinc-500",
    outline: "border border-zinc-300 text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800 focus-visible:ring-zinc-500",
    ghost:   "text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-800 focus-visible:ring-zinc-500",
  },
};

const disabledClasses = "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

export function Button({
  variant = "solid",
  color = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  isLoading = false,
  fullWidth = false,
  children,
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  const isIconOnly = iconPosition === "only" || (!children && Icon != null);
  const iconPixelSize = iconSizeClasses[size];

  const baseClasses = [
    "inline-flex items-center justify-center",
    "rounded-lg",
    "font-medium",
    "transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "cursor-pointer",
    sizeClasses[size],
    colorVariantClasses[color][variant],
    disabledClasses,
    fullWidth ? "w-full" : "",
    isIconOnly ? "aspect-square p-0 flex items-center justify-center" : "",
    className,
  ].join(" ");

  const resolvedIcon = isLoading
    ? <Loader2 size={iconPixelSize} className="animate-spin" />
    : Icon == null
      ? null
      : <Icon size={iconPixelSize} />;

  return (
    <button
      type={type}
      disabled={isLoading || rest.disabled}
      className={baseClasses}
      {...rest}
    >
      {resolvedIcon != null && (iconPosition === "left" || iconPosition === "only" || isIconOnly) && resolvedIcon}
      {!isIconOnly && children != null && (
        <span>{children}</span>
      )}
      {resolvedIcon != null && iconPosition === "right" && !isIconOnly && resolvedIcon}
    </button>
  );
}