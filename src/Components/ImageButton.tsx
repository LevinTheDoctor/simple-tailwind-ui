import { type ButtonHTMLAttributes } from "react";
import { type LucideIcon } from "lucide-react";

type ImageButtonSize = "sm" | "md" | "lg" | "full";

type ImageButtonProps = {
  readonly src: string;
  readonly alt: string;
  readonly label?: string;
  readonly icon?: LucideIcon;
  readonly showOverlay?: boolean;
  readonly size?: ImageButtonSize;
  readonly fullWidth?: boolean;
  readonly className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

const sizeClasses: Record<ImageButtonSize, string> = {
  sm:   "w-24 h-24",
  md:   "w-36 h-36",
  lg:   "w-52 h-52",
  full: "w-full h-48",
};

const labelSizeClasses: Record<ImageButtonSize, string> = {
  sm:   "text-xs",
  md:   "text-sm",
  lg:   "text-base",
  full: "text-sm",
};

const iconSizeClasses: Record<ImageButtonSize, string> = {
  sm:   "w-3.5 h-3.5",
  md:   "w-4 h-4",
  lg:   "w-5 h-5",
  full: "w-4 h-4",
};

export function ImageButton({
  src,
  alt,
  label,
  icon: Icon,
  showOverlay = true,
  size = "md",
  fullWidth = false,
  className = "",
  type = "button",
  ...rest
}: ImageButtonProps) {
  const buttonClasses = [
    "relative group overflow-hidden rounded-2xl",
    "ring-1 ring-zinc-200 dark:ring-zinc-800 shadow-md shadow-zinc-900/10",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500",
    "transition-shadow duration-200 hover:shadow-lg hover:shadow-zinc-900/20",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
    "cursor-pointer",
    fullWidth ? "w-full h-48" : sizeClasses[size],
    className,
  ].join(" ");

  return (
    <button type={type} className={buttonClasses} {...rest}>
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
        draggable={false}
      />
      {showOverlay && (label || Icon) && (
        <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-t from-zinc-950/80 to-transparent pt-6">
          {Icon && <Icon className={`${iconSizeClasses[size]} text-white shrink-0`} />}
          {label && (
            <span className={`${labelSizeClasses[size]} font-medium text-white truncate`}>
              {label}
            </span>
          )}
        </span>
      )}
    </button>
  );
}
