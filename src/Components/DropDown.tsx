import { useState, useRef, useEffect } from "react";
import { TitelBorder } from "./TitelBorder";
import { Loader2, ChevronDown, type LucideIcon } from "lucide-react";

type DropdownSize = "sm" | "md" | "lg" | "full";

type DropdownVariant = "default" | "subtle" | "strong";

type SelectOption = {
  readonly value: string;
  readonly label: string;
};

type DropdownProps = {
  readonly title: string;
  readonly options: SelectOption[];
  readonly size?: DropdownSize;
  readonly variant?: DropdownVariant;
  readonly icon?: LucideIcon;
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly placeholder?: string;
  readonly value?: string;
  readonly onChange?: (value: string) => void;
  readonly className?: string;
};

const triggerSizeClasses: Record<DropdownSize, string> = {
  sm:   "py-1 pl-2 pr-8 text-sm",
  md:   "py-2 pl-3 pr-9 text-sm",
  lg:   "py-3 pl-4 pr-11 text-base",
  full: "py-2 pl-3 pr-9 text-sm",
};

const iconLeftPadding: Record<DropdownSize, string> = {
  sm:   "pl-7",
  md:   "pl-9",
  lg:   "pl-11",
  full: "pl-9",
};

const iconSizeClasses: Record<DropdownSize, string> = {
  sm:   "w-3.5 h-3.5",
  md:   "w-4 h-4",
  lg:   "w-5 h-5",
  full: "w-4 h-4",
};

const chevronRightPos: Record<DropdownSize, string> = {
  sm:   "right-2",
  md:   "right-2.5",
  lg:   "right-3",
  full: "right-2.5",
};

const optionSizeClasses: Record<DropdownSize, string> = {
  sm:   "px-2 py-1 text-sm",
  md:   "px-3 py-2 text-sm",
  lg:   "px-4 py-2.5 text-base",
  full: "px-3 py-2 text-sm",
};

const triggerVariantClasses: Record<DropdownVariant, string> = {
  default: "border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900",
  subtle:  "border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800",
  strong:  "border-2 border-zinc-400 dark:border-zinc-500 bg-white dark:bg-zinc-900",
};

const panelVariantClasses: Record<DropdownVariant, string> = {
  default: "border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900",
  subtle:  "border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900",
  strong:  "border-2 border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900",
};

export function Dropdown({
  title,
  options,
  size = "md",
  variant = "default",
  icon: Icon,
  loading = false,
  disabled = false,
  placeholder = "Auswaehlen...",
  value,
  onChange,
  className = "",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value ?? "");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined) setInternalValue(value);
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedLabel = options.find(o => o.value === internalValue)?.label;
  const ChevronIcon = loading ? Loader2 : ChevronDown;
  const isDisabled = disabled || loading;

  const handleSelect = (optValue: string) => {
    setInternalValue(optValue);
    onChange?.(optValue);
    setOpen(false);
  };

  const triggerClasses = [
    "w-full rounded-lg flex items-center transition-colors duration-200 cursor-pointer",
    "text-zinc-900 dark:text-zinc-100 text-left",
    "focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    triggerSizeClasses[size],
    triggerVariantClasses[variant],
    Icon ? iconLeftPadding[size] : "",
  ].join(" ");

  return (
    <TitelBorder title={title} size={size} variant={variant} className={className}>
      <div ref={containerRef} className="relative">

        {/* Left icon */}
        {Icon && (
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none z-10">
            <Icon className={iconSizeClasses[size]} />
          </span>
        )}

        {/* Trigger */}
        <button
          type="button"
          disabled={isDisabled}
          onClick={() => setOpen(o => !o)}
          className={triggerClasses}
        >
          <span className={`flex-1 truncate ${selectedLabel ? "" : "text-zinc-400 dark:text-zinc-500"}`}>
            {selectedLabel ?? placeholder}
          </span>
        </button>

        {/* Chevron */}
        <span className={`absolute ${chevronRightPos[size]} top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none`}>
          <ChevronIcon
            className={`${iconSizeClasses[size]} transition-transform duration-200 ${open ? "rotate-180" : ""} ${loading ? "animate-spin" : ""}`}
          />
        </span>

        {/* Options panel */}
        {open && !isDisabled && (
          <div className={`absolute top-full left-0 right-0 mt-1 z-50 rounded-xl shadow-lg overflow-hidden ${panelVariantClasses[variant]}`}>
            {options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={[
                  "w-full text-left transition-colors duration-100",
                  optionSizeClasses[size],
                  internalValue === opt.value
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800",
                ].join(" ")}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

      </div>
    </TitelBorder>
  );
}
