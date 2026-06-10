import { useEffect, useState, type ChangeEvent } from "react";
import { TitelBorder } from "./TitelBorder";

type SliderSize = "sm" | "md" | "lg" | "full";
type SliderVariant = "default" | "subtle" | "strong";

type SliderProps = {
  readonly title?: string;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly value?: number;
  readonly defaultValue?: number;
  readonly onChange?: (value: number) => void;
  readonly showValue?: boolean;
  readonly formatValue?: (value: number) => string;
  readonly fillColor?: string;
  readonly size?: SliderSize;
  readonly variant?: SliderVariant;
  readonly disabled?: boolean;
  readonly fullWidth?: boolean;
  readonly className?: string;
};

const widthClasses: Record<SliderSize, string> = {
  sm:   "max-w-sm",
  md:   "max-w-md",
  lg:   "max-w-lg",
  full: "w-full",
};

const trackHeightClasses: Record<SliderSize, string> = {
  sm:   "h-1",
  md:   "h-1.5",
  lg:   "h-2",
  full: "h-1.5",
};

const thumbSizeClasses: Record<SliderSize, string> = {
  sm:   "w-3.5 h-3.5",
  md:   "w-4 h-4",
  lg:   "w-5 h-5",
  full: "w-4 h-4",
};

export function Slider({
  title,
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  onChange,
  showValue = true,
  formatValue,
  fillColor = "bg-indigo-600 dark:bg-indigo-500",
  size = "md",
  variant = "default",
  disabled = false,
  fullWidth = false,
  className = "",
}: SliderProps) {
  const [internalValue, setInternalValue] = useState(value ?? defaultValue ?? min);

  useEffect(() => {
    if (value !== undefined) setInternalValue(value);
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value);
    setInternalValue(next);
    onChange?.(next);
  };

  const percent = max === min ? 0 : ((internalValue - min) / (max - min)) * 100;
  const displayValue = formatValue ? formatValue(internalValue) : String(internalValue);

  const slider = (
    <div className={`flex items-center gap-3 ${disabled ? "opacity-50" : ""}`}>
      <div className="relative flex-1 flex items-center h-6">
        {/* Track */}
        <div className={`w-full rounded-full bg-zinc-200 dark:bg-zinc-700 ${trackHeightClasses[size]}`}>
          <div
            className={`rounded-full ${trackHeightClasses[size]} ${fillColor}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        {/* Thumb */}
        <div
          className={[
            "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full",
            "bg-white border-2 border-zinc-300 dark:border-zinc-500",
            "shadow-md shadow-zinc-900/20 transition-transform duration-200 pointer-events-none",
            thumbSizeClasses[size],
          ].join(" ")}
          style={{ left: `${percent}%` }}
        />
        {/* Native input for interaction & accessibility */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={internalValue}
          onChange={handleChange}
          disabled={disabled}
          aria-label={title}
          className={`absolute inset-0 w-full h-full opacity-0 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
        />
      </div>
      {showValue && (
        <span className="text-sm font-mono text-zinc-600 dark:text-zinc-300 tabular-nums min-w-[2.5rem] text-right shrink-0">
          {displayValue}
        </span>
      )}
    </div>
  );

  if (title) {
    return (
      <TitelBorder title={title} size={size} variant={variant} fullWidth={fullWidth} className={className}>
        <div className="pt-1">{slider}</div>
      </TitelBorder>
    );
  }
  return (
    <div className={`${fullWidth ? "w-full" : widthClasses[size]} ${className}`}>
      {slider}
    </div>
  );
}
