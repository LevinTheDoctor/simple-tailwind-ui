import { type ReactNode, type HTMLAttributes } from "react";

type TitelBorderSize = "sm" | "md" | "lg" | "full";

type TitelBorderVariant = "default" | "subtle" | "strong";

type TitelBorderProps = {
  readonly title: string;
  readonly size?: TitelBorderSize;
  readonly variant?: TitelBorderVariant;
  readonly fullWidth?: boolean;
  readonly className?: string;
  readonly children: ReactNode;
} & Omit<HTMLAttributes<HTMLFieldSetElement>, "className" | "children">;

const paddingClasses: Record<TitelBorderSize, string> = {
  sm:   "px-2 pb-2",
  md:   "px-2 pb-2",
  lg:   "px-3 pb-3",
  full: "px-2 pb-2",
};

const widthClasses: Record<TitelBorderSize, string> = {
  sm:   "max-w-sm",
  md:   "max-w-md",
  lg:   "max-w-lg",
  full: "w-full",
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
  fullWidth = false,
  className = "",
  children,
  ...rest
}: TitelBorderProps) {
  const fieldsetClasses = [
    "rounded-xl transition-colors duration-200",
    paddingClasses[size],
    fullWidth ? "w-full" : widthClasses[size],
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
 