import { type ReactNode, type HTMLAttributes } from "react";

type TitelBorderSize = "sm" | "md" | "lg" | "full";

type TitelBorderVariant = "default" | "subtle" | "strong";

type TitelBorderProps = {
  readonly title: string;
  readonly size?: TitelBorderSize;
  readonly variant?: TitelBorderVariant;
  readonly className?: string;
  readonly children: ReactNode;
} & Omit<HTMLAttributes<HTMLFieldSetElement>, "className" | "children">;

const sizeClasses: Record<TitelBorderSize, string> = {
  sm:   "px-2 pb-2 max-w-sm",
  md:   "px-2 pb-2 max-w-md",
  lg:   "px-3 pb-3 max-w-lg",
  full: "px-2 pb-2 w-full",
};

const variantClasses: Record<TitelBorderVariant, string> = {
  default: "border border-zinc-300 dark:border-zinc-700",
  subtle:  "border border-zinc-200 dark:border-zinc-800",
  strong:  "border-2 border-zinc-400 dark:border-zinc-500",
};

const legendClasses: Record<TitelBorderVariant, string> = {
  default: "text-zinc-500 dark:text-zinc-400",
  subtle:  "text-zinc-400 dark:text-zinc-500",
  strong:  "text-zinc-700 dark:text-zinc-300 font-medium",
};

export function TitelBorder({
  title,
  size = "md",
  variant = "default",
  className = "",
  children,
  ...rest
}: TitelBorderProps) {
  const fieldsetClasses = [
    "rounded-xl",
    "transition-colors",
    "duration-200",
    sizeClasses[size],
    variantClasses[variant],
    className,
  ].join(" ");

  return (
    <fieldset className={fieldsetClasses} {...rest}>
      <legend className={`text-sm px-1 ${legendClasses[variant]}`}>
        {title}
      </legend>
      {children}
    </fieldset>
  );
}
 