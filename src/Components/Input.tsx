import { type InputHTMLAttributes } from "react";
import { TitelBorder } from "./TitelBorder";
import { Loader2, type LucideIcon } from "lucide-react";

type InputSize = "sm" | "md" | "lg" | "full";

type InputVariant = "default" | "subtle" | "strong";

type IconPosition = "left" | "right" | "only";

type InputProps = {
  readonly title: string;
  readonly size?: InputSize;
  readonly variant?: InputVariant;
  readonly icon?: LucideIcon;
  readonly iconPosition?: IconPosition;
  readonly loading?: boolean;
  readonly className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "size">;

const inputSizeClasses: Record<InputSize, string> = {
  sm:   "py-1 px-2 text-sm",
  md:   "py-2 px-3 text-sm",
  lg:   "py-3 px-4 text-base",
  full: "py-2 px-3 text-sm",
};

const iconPaddingLeft: Record<InputSize, string> = {
  sm:   "pl-7",
  md:   "pl-9",
  lg:   "pl-11",
  full: "pl-9",
};

const iconPaddingRight: Record<InputSize, string> = {
  sm:   "pr-7",
  md:   "pr-9",
  lg:   "pr-11",
  full: "pr-9",
};

const iconSizeClasses: Record<InputSize, string> = {
  sm:   "w-3.5 h-3.5",
  md:   "w-4 h-4",
  lg:   "w-5 h-5",
  full: "w-4 h-4",
};

const inputVariantClasses: Record<InputVariant, string> = {
  default: "border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900",
  subtle:  "border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800",
  strong:  "border-2 border-zinc-400 dark:border-zinc-500 bg-white dark:bg-zinc-900",
};

export function Input({
  title,
  size = "md",
  variant = "default",
  icon: Icon,
  iconPosition = "right",
  loading = false,
  className = "",
  ...rest
}: InputProps) {
  const ActiveIcon = loading ? Loader2 : Icon;
  const hasIcon = Boolean(ActiveIcon);
  const showLeft  = hasIcon && iconPosition === "left";
  const showRight = hasIcon && (iconPosition === "right" || iconPosition === "only");

  const inputClasses = [
    "w-full rounded-lg outline-none transition-colors duration-200",
    "text-zinc-900 dark:text-zinc-100",
    "placeholder-zinc-400 dark:placeholder-zinc-500",
    "focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    inputSizeClasses[size],
    inputVariantClasses[variant],
    showLeft  ? iconPaddingLeft[size]  : "",
    showRight ? iconPaddingRight[size] : "",
  ].join(" ");

  return (
    <TitelBorder title={title} size={size} variant={variant} className={className}>
      <div className="relative">
        {showLeft && ActiveIcon && (
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none">
            <ActiveIcon className={`${iconSizeClasses[size]} ${loading ? "animate-spin" : ""}`} />
          </span>
        )}
        <input className={inputClasses} {...rest} />
        {showRight && ActiveIcon && (
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none">
            <ActiveIcon className={`${iconSizeClasses[size]} ${loading ? "animate-spin" : ""}`} />
          </span>
        )}
      </div>
    </TitelBorder>
  );
}
