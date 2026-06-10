import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { TitelBorder } from "./TitelBorder";

type MultipleChoiceSize = "sm" | "md" | "lg" | "full";
type MultipleChoiceVariant = "default" | "subtle" | "strong";
type MultipleChoiceOrientation = "vertical" | "horizontal";

export type MultipleChoiceOption = {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
};

type MultipleChoiceProps = {
  readonly title?: string;
  readonly options: ReadonlyArray<MultipleChoiceOption>;
  readonly value?: readonly string[];
  readonly defaultValue?: readonly string[];
  readonly onChange?: (values: string[]) => void;
  readonly orientation?: MultipleChoiceOrientation;
  readonly size?: MultipleChoiceSize;
  readonly variant?: MultipleChoiceVariant;
  readonly accentColor?: string;
  readonly disabled?: boolean;
  readonly fullWidth?: boolean;
  readonly className?: string;
};

const sizeClasses: Record<MultipleChoiceSize, string> = {
  sm:   "text-sm gap-2",
  md:   "text-sm gap-2.5",
  lg:   "text-base gap-3",
  full: "text-sm gap-2.5",
};

const boxSizeClasses: Record<MultipleChoiceSize, string> = {
  sm:   "w-4 h-4",
  md:   "w-4.5 h-4.5",
  lg:   "w-5 h-5",
  full: "w-4.5 h-4.5",
};

const iconSizeClasses: Record<MultipleChoiceSize, number> = {
  sm:   11,
  md:   12,
  lg:   14,
  full: 12,
};

export function MultipleChoice({
  title,
  options,
  value,
  defaultValue = [],
  onChange,
  orientation = "vertical",
  size = "md",
  variant = "default",
  accentColor = "bg-indigo-600 border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500",
  disabled = false,
  fullWidth = false,
  className = "",
}: MultipleChoiceProps) {
  const [selected, setSelected] = useState<string[]>([...(value ?? defaultValue)]);

  useEffect(() => {
    if (value !== undefined) setSelected([...value]);
  }, [value]);

  const toggle = (optionValue: string) => {
    const next = selected.includes(optionValue)
      ? selected.filter(v => v !== optionValue)
      : [...selected, optionValue];
    setSelected(next);
    onChange?.(next);
  };

  const list = (
    <div className={`flex ${orientation === "vertical" ? "flex-col gap-2" : "flex-row flex-wrap gap-x-5 gap-y-2"}`}>
      {options.map(option => {
        const isChecked = selected.includes(option.value);
        const isDisabled = disabled || option.disabled;
        const itemClasses = [
          "flex items-center select-none transition-colors duration-200",
          sizeClasses[size],
          isDisabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100",
        ].join(" ");
        const boxClasses = [
          "flex items-center justify-center shrink-0 rounded-md border transition-colors duration-200",
          boxSizeClasses[size],
          isChecked
            ? `${accentColor} text-white`
            : "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900",
        ].join(" ");
        return (
          <button
            key={option.value}
            type="button"
            role="checkbox"
            aria-checked={isChecked}
            disabled={isDisabled}
            onClick={() => toggle(option.value)}
            className={itemClasses}
          >
            <span className={boxClasses}>
              {isChecked && <Check size={iconSizeClasses[size]} strokeWidth={3} />}
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
