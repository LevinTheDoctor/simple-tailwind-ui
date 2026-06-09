import { type HTMLAttributes, type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";

type BadgeSize     = "sm" | "md" | "lg";
type BadgeVariant  = "default" | "subtle" | "strong";
type BadgeColor    = "neutral" | "info" | "success" | "warning" | "error";
type IconPosition  = "left" | "right";

type BadgeProps = {
  readonly children:      ReactNode;
  readonly color?:        BadgeColor;
  readonly variant?:      BadgeVariant;
  readonly size?:         BadgeSize;
  readonly icon?:         LucideIcon;
  readonly iconPosition?: IconPosition;
  readonly dot?:          boolean;
  readonly fullWidth?:    boolean;
  readonly className?:    string;
} & Omit<HTMLAttributes<HTMLSpanElement>, "className" | "children">;

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-1.5 py-0.5 text-xs gap-1",
  md: "px-2 py-0.5 text-xs gap-1.5",
  lg: "px-2.5 py-1 text-sm gap-1.5",
};

const iconSizeClasses: Record<BadgeSize, string> = {
  sm: "w-3 h-3",
  md: "w-3.5 h-3.5",
  lg: "w-4 h-4",
};

const dotSizeClasses: Record<BadgeSize, string> = {
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
  lg: "w-2 h-2",
};

const colorVariantClasses: Record<BadgeColor, Record<BadgeVariant, string>> = {
  neutral: {
    default: "bg-zinc-100 text-zinc-700 border border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-600",
    subtle:  "bg-zinc-50 text-zinc-600 border border-zinc-200 dark:bg-zinc-800/50 dark:text-zinc-400 dark:border-zinc-700",
    strong:  "bg-zinc-200 text-zinc-800 border-2 border-zinc-400 dark:bg-zinc-700 dark:text-zinc-100 dark:border-zinc-500",
  },
  info: {
    default: "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-800",
    subtle:  "bg-indigo-50/50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900",
    strong:  "bg-indigo-100 text-indigo-800 border-2 border-indigo-300 dark:bg-indigo-900/40 dark:text-indigo-200 dark:border-indigo-700",
  },
  success: {
    default: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800",
    subtle:  "bg-emerald-50/50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900",
    strong:  "bg-emerald-100 text-emerald-800 border-2 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-700",
  },
  warning: {
    default: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800",
    subtle:  "bg-amber-50/50 text-amber-600 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900",
    strong:  "bg-amber-100 text-amber-800 border-2 border-amber-300 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-700",
  },
  error: {
    default: "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800",
    subtle:  "bg-red-50/50 text-red-600 border border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900",
    strong:  "bg-red-100 text-red-800 border-2 border-red-300 dark:bg-red-900/40 dark:text-red-200 dark:border-red-700",
  },
};

const dotColorClasses: Record<BadgeColor, string> = {
  neutral: "bg-zinc-400 dark:bg-zinc-500",
  info:    "bg-indigo-500 dark:bg-indigo-400",
  success: "bg-emerald-500 dark:bg-emerald-400",
  warning: "bg-amber-500 dark:bg-amber-400",
  error:   "bg-red-500 dark:bg-red-400",
};

export function Badge({
  children,
  color         = "neutral",
  variant       = "default",
  size          = "md",
  icon: Icon,
  iconPosition  = "left",
  dot           = false,
  fullWidth     = false,
  className     = "",
  ...rest
}: BadgeProps) {
  const dotEl = dot
    ? <span className={["rounded-full shrink-0", dotSizeClasses[size], dotColorClasses[color]].join(" ")} />
    : null;

  const iconEl = !dot && Icon != null
    ? <Icon className={iconSizeClasses[size]} />
    : null;

  return (
    <span
      className={[
        fullWidth ? "flex w-full justify-center" : "inline-flex",
        "items-center font-medium rounded-full",
        sizeClasses[size],
        colorVariantClasses[color][variant],
        className,
      ].join(" ")}
      {...rest}
    >
      {dotEl ?? (iconPosition === "left" ? iconEl : null)}
      <span>{children}</span>
      {dotEl == null && iconPosition === "right" && iconEl}
    </span>
  );
}
