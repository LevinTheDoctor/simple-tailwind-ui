import { type ReactNode,  type HTMLAttributes } from "react"; 

type CardSize = "sm" | "md" | "lg" | "full";

type CardVariant = "default" | "elevated" | "outlined" | "ghost";

type CardProps = {
    readonly title?: string;
    readonly size?: CardSize;
    readonly variant?: CardVariant;
    readonly fullWidth?: boolean;
    readonly className?: string;
    readonly children: ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, "className" | "children">;

const paddingClasses: Record<CardSize, string> = {
  sm:   "p-3",
  md:   "p-5",
  lg:   "p-7",
  full: "p-5",
};

const widthClasses: Record<CardSize, string> = {
  sm:   "max-w-sm",
  md:   "max-w-md",
  lg:   "max-w-lg",
  full: "w-full",
};

const variantClasses: Record<CardVariant, string> = {
  default:  "bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm",
  elevated: "bg-white dark:bg-zinc-900 shadow-lg dark:shadow-zinc-950",
  outlined: "bg-transparent border-2 border-zinc-200 dark:border-zinc-700",
  ghost:    "bg-zinc-50 dark:bg-zinc-800 border-none shadow-none",
};

export function Card({
  title,
  size = "md",
  variant = "default",
  fullWidth = false,
  className = "",
  children,
  ...rest
}: CardProps) {

  const baseClasses = [
    "rounded-2xl transition-colors duration-200 text-zinc-700 dark:text-zinc-300",
    paddingClasses[size],
    fullWidth ? "w-full" : widthClasses[size],
    variantClasses[variant],
    className,
  ].join(" ");
  return (
    <div className={baseClasses} {...rest}>
      {title && (
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}