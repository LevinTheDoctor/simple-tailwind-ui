import { useEffect, useState } from "react";
import { TitelBorder } from "./TitelBorder";

type RadioGroupSize = "sm" | "md" | "lg" | "full";
type RadioGroupVariant = "default" | "subtle" | "strong";
type RadioGroupOrientation = "vertical" | "horizontal";

export type RadioGroupOption = {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
};

type RadioGroupProps = {
  readonly title?: string;
  readonly options: ReadonlyArray<RadioGroupOption>;
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onChange?: (value: string) => void;
  readonly orientation?: RadioGroupOrientation;
  readonly size?: RadioGroupSize;
  readonly variant?: RadioGroupVariant;
  readonly accentColor?: string;
  readonly disabled?: boolean;
  readonly fullWidth?: boolean;
  readonly className?: string;
};

const sizeClasses: Record<RadioGroupSize, string> = {
  sm:   "text-sm gap-2",
  md:   "text-sm gap-2.5",
  lg:   "text-base gap-3",
  full: "text-sm gap-2.5",
};

const circleSizeClasses: Record<RadioGroupSize, string> = {
  sm:   "w-4 h-4",
  md:   "w-4.5 h-4.5",
  lg:   "w-5 h-5",
  full: "w-4.5 h-4.5",
};

const dotSizeClasses: Record<RadioGroupSize, string> = {
  sm:   "w-1.5 h-1.5",
  md:   "w-2 h-2",
  lg:   "w-2.5 h-2.5",
  full: "w-2 h-2",
};

export function RadioGroup({
  title,
  options,
  value,
  defaultValue,
  onChange,
  orientation = "vertical",
  size = "md",
  variant = "default",
  accentColor = "border-indigo-600 dark:border-indigo-500 bg-indigo-600 dark:bg-indigo-500",
  disabled = false,
  fullWidth = false,
  className = "",
}: RadioGroupProps) {
  const [selected, setSelected] = useState<string | undefined>(value ?? defaultValue);

  useEffect(() => {
    if (value !== undefined) setSelected(value);
  }, [value]);

  const select = (optionValue: string) => {
    setSelected(optionValue);
    onChange?.(optionValue);
  };

  const list = (
    <div
      role="radiogroup"
      className={`flex ${orientation === "vertical" ? "flex-col gap-2" : "flex-row flex-wrap gap-x-5 gap-y-2"}`}
    >
      {options.map(option => {
        const isChecked = selected === option.value;
        const isDisabled = disabled || option.disabled;
        const itemClasses = [
          "flex items-center select-none transition-colors duration-200",
          sizeClasses[size],
          isDisabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100",
        ].join(" ");
        const circleClasses = [
          "flex items-center justify-center shrink-0 rounded-full border-2 bg-white dark:bg-zinc-900 transition-colors duration-200",
          circleSizeClasses[size],
          isChecked
            ? accentColor.split(" ").filter(c => c.startsWith("border-") || c.startsWith("dark:border-")).join(" ")
            : "border-zinc-300 dark:border-zinc-600",
        ].join(" ");
        const dotClasses = [
          "rounded-full transition-colors duration-200",
          dotSizeClasses[size],
          accentColor.split(" ").filter(c => c.startsWith("bg-") || c.startsWith("dark:bg-")).join(" "),
        ].join(" ");
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isChecked}
            disabled={isDisabled}
            onClick={() => select(option.value)}
            className={itemClasses}
          >
            <span className={circleClasses}>
              {isChecked && <span className={dotClasses} />}
            </span>
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );

  if (title) {
    return (
      <TitelBorder title={title} size={size} variant={variant} fullWidth={fullWidth} className={className}>
        <div className="pt-1">{list}</div>
      </TitelBorder>
    );
  }
  return <div className={`${fullWidth ? "w-full" : ""} ${className}`}>{list}</div>;
}
