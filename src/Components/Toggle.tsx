import { useEffect, useState } from "react";

type ToggleSize = "sm" | "md" | "lg";
type ToggleLabelPosition = "left" | "right";

type ToggleProps = {
  readonly checked?: boolean;
  readonly defaultChecked?: boolean;
  readonly onChange?: (checked: boolean) => void;
  readonly label?: string;
  readonly labelPosition?: ToggleLabelPosition;
  readonly size?: ToggleSize;
  readonly onColor?: string;
  readonly offColor?: string;
  readonly disabled?: boolean;
  readonly className?: string;
};

const trackSizeClasses: Record<ToggleSize, string> = {
  sm: "w-8 h-4.5",
  md: "w-10 h-5.5",
  lg: "w-12 h-6.5",
};

const thumbSizeClasses: Record<ToggleSize, string> = {
  sm: "w-3.5 h-3.5",
  md: "w-4.5 h-4.5",
  lg: "w-5.5 h-5.5",
};

const thumbTranslateClasses: Record<ToggleSize, string> = {
  sm: "translate-x-3.5",
  md: "translate-x-4.5",
  lg: "translate-x-5.5",
};

const labelSizeClasses: Record<ToggleSize, string> = {
  sm: "text-sm",
  md: "text-sm",
  lg: "text-base",
};

export function Toggle({
  checked,
  defaultChecked = false,
  onChange,
  label,
  labelPosition = "right",
  size = "md",
  onColor = "bg-indigo-600 dark:bg-indigo-500",
  offColor = "bg-zinc-300 dark:bg-zinc-700",
  disabled = false,
  className = "",
}: ToggleProps) {
  const [isOn, setIsOn] = useState(checked ?? defaultChecked);

  useEffect(() => {
    if (checked !== undefined) setIsOn(checked);
  }, [checked]);

  const toggle = () => {
    const next = !isOn;
    setIsOn(next);
    onChange?.(next);
  };

  const wrapperClasses = [
    "inline-flex items-center gap-2.5 select-none",
    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
    className,
  ].join(" ");

  const trackClasses = [
    "relative inline-flex items-center shrink-0 rounded-full p-0.5",
    "transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-500",
    trackSizeClasses[size],
    isOn ? onColor : offColor,
    disabled ? "cursor-not-allowed" : "cursor-pointer",
  ].join(" ");

  const thumbClasses = [
    "rounded-full bg-white shadow-md shadow-zinc-900/20",
    "transition-transform duration-200",
    thumbSizeClasses[size],
    isOn ? thumbTranslateClasses[size] : "translate-x-0",
  ].join(" ");

  const labelNode = label && (
    <span className={`${labelSizeClasses[size]} text-zinc-700 dark:text-zinc-300`}>{label}</span>
  );

  return (
    <label className={wrapperClasses}>
      {labelPosition === "left" && labelNode}
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        disabled={disabled}
        onClick={toggle}
        className={trackClasses}
      >
        <span className={thumbClasses} />
      </button>
      {labelPosition === "right" && labelNode}
    </label>
  );
}
