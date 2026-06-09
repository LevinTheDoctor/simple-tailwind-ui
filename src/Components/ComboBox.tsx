import { useState, useRef, useEffect, useMemo } from "react";
import { TitelBorder } from "./TitelBorder";
import { Loader2, ChevronDown, Check, type LucideIcon } from "lucide-react";

type ComboBoxSize    = "sm" | "md" | "lg" | "full";
type ComboBoxVariant = "default" | "subtle" | "strong";

type SelectOption = {
  readonly value: string;
  readonly label: string;
};

type ComboBoxBase = {
  readonly title: string;
  readonly options: SelectOption[];
  readonly size?: ComboBoxSize;
  readonly variant?: ComboBoxVariant;
  readonly icon?: LucideIcon;
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly fullWidth?: boolean;
  readonly maxVisible?: number;
  readonly placeholder?: string;
  readonly className?: string;
};

type ComboBoxSingle = ComboBoxBase & {
  readonly multiple?: false;
  readonly value?: string;
  readonly onChange?: (value: string) => void;
};

type ComboBoxMulti = ComboBoxBase & {
  readonly multiple: true;
  readonly value?: string[];
  readonly onChange?: (value: string[]) => void;
};

type ComboBoxProps = ComboBoxSingle | ComboBoxMulti;

// ── Style maps ────────────────────────────────────────────────────────────────

const triggerSizeClasses: Record<ComboBoxSize, string> = {
  sm:   "py-1 pl-2 pr-8 text-sm",
  md:   "py-2 pl-3 pr-9 text-sm",
  lg:   "py-3 pl-4 pr-11 text-base",
  full: "py-2 pl-3 pr-9 text-sm",
};

const iconLeftPadding: Record<ComboBoxSize, string> = {
  sm:   "pl-7",
  md:   "pl-9",
  lg:   "pl-11",
  full: "pl-9",
};

const iconSizeClasses: Record<ComboBoxSize, string> = {
  sm:   "w-3.5 h-3.5",
  md:   "w-4 h-4",
  lg:   "w-5 h-5",
  full: "w-4 h-4",
};

const chevronRightPos: Record<ComboBoxSize, string> = {
  sm:   "right-2",
  md:   "right-2.5",
  lg:   "right-3",
  full: "right-2.5",
};

const optionSizeClasses: Record<ComboBoxSize, string> = {
  sm:   "px-2 py-1 text-sm",
  md:   "px-3 py-2 text-sm",
  lg:   "px-4 py-2.5 text-base",
  full: "px-3 py-2 text-sm",
};

const triggerVariantClasses: Record<ComboBoxVariant, string> = {
  default: "border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900",
  subtle:  "border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800",
  strong:  "border-2 border-zinc-400 dark:border-zinc-500 bg-white dark:bg-zinc-900",
};

const panelVariantClasses: Record<ComboBoxVariant, string> = {
  default: "border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900",
  subtle:  "border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900",
  strong:  "border-2 border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900",
};

// ── Component ─────────────────────────────────────────────────────────────────

export function ComboBox(props: ComboBoxProps) {
  const {
    title,
    options,
    size = "md",
    variant = "default",
    icon: Icon,
    loading = false,
    disabled = false,
    fullWidth = false,
    maxVisible,
    placeholder = "Auswaehlen...",
    className = "",
  } = props;

  const [open, setOpen]       = useState(false);
  const [search, setSearch]   = useState("");
  const containerRef          = useRef<HTMLDivElement>(null);
  const searchRef             = useRef<HTMLInputElement>(null);

  const [singleValue, setSingleValue] = useState<string>(
    (!props.multiple ? props.value : undefined) ?? ""
  );
  const [multiValues, setMultiValues] = useState<string[]>(
    (props.multiple ? props.value : undefined) ?? []
  );

  // Click outside → close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search when panel opens
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 0);
  }, [open]);

  // Filtered options
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const matched = q ? options.filter(o => o.label.toLowerCase().includes(q)) : options;
    return maxVisible != null ? matched.slice(0, maxVisible) : matched;
  }, [options, search, maxVisible]);

  const totalMatched = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? options.filter(o => o.label.toLowerCase().includes(q)).length : options.length;
  }, [options, search]);

  const isTruncated = filtered.length < totalMatched;

  // Handlers
  const handleSelectSingle = (val: string) => {
    setSingleValue(val);
    if (!props.multiple) props.onChange?.(val);
    setOpen(false);
    setSearch("");
  };

  const handleToggleMulti = (val: string) => {
    const next = multiValues.includes(val)
      ? multiValues.filter(v => v !== val)
      : [...multiValues, val];
    setMultiValues(next);
    if (props.multiple) props.onChange?.(next);
  };

  const allFilteredSelected = filtered.length > 0 && filtered.every(o => multiValues.includes(o.value));

  const handleToggleAll = () => {
    const filteredSet = new Set(filtered.map(o => o.value));
    const next = allFilteredSelected
      ? multiValues.filter(v => !filteredSet.has(v))
      : [...multiValues, ...filtered.map(o => o.value).filter(v => !multiValues.includes(v))];
    setMultiValues(next);
    if (props.multiple) props.onChange?.(next);
  };

  // Trigger label
  const triggerLabel = props.multiple
    ? multiValues.length === 0
      ? undefined
      : multiValues.length === 1
        ? options.find(o => o.value === multiValues[0])?.label
        : `${multiValues.length} ausgewaehlt`
    : singleValue
      ? options.find(o => o.value === singleValue)?.label
      : undefined;

  const isPlaceholder = !triggerLabel;
  const isDisabled    = disabled || loading;
  const ChevronIcon   = loading ? Loader2 : ChevronDown;

  const triggerClasses = [
    "w-full rounded-lg flex items-center transition-colors duration-200 text-left",
    "focus-within:ring-2 focus-within:ring-zinc-400 dark:focus-within:ring-zinc-500",
    isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
    triggerSizeClasses[size],
    triggerVariantClasses[variant],
    Icon ? iconLeftPadding[size] : "",
  ].join(" ");

  return (
    <TitelBorder title={title} size={size} variant={variant} fullWidth={fullWidth} className={className}>
      <div ref={containerRef} className="relative">

        {/* Left icon */}
        {Icon && (
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none z-10">
            <Icon className={iconSizeClasses[size]} />
          </span>
        )}

        {/* Trigger — wird beim Öffnen zum Suchfeld */}
        <div
          onClick={() => !isDisabled && setOpen(o => !o)}
          className={triggerClasses}
        >
          {open && !isDisabled ? (
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={triggerLabel ?? placeholder}
              onClick={e => e.stopPropagation()}
              className="flex-1 min-w-0 bg-transparent outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
            />
          ) : (
            <span className={`flex-1 truncate ${isPlaceholder ? "text-zinc-400 dark:text-zinc-500" : "text-zinc-900 dark:text-zinc-100"}`}>
              {triggerLabel ?? placeholder}
            </span>
          )}
        </div>

        {/* Chevron */}
        <span className={`absolute ${chevronRightPos[size]} top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none`}>
          <ChevronIcon className={`${iconSizeClasses[size]} transition-transform duration-200 ${open ? "rotate-180" : ""} ${loading ? "animate-spin" : ""}`} />
        </span>

        {/* Panel */}
        {open && !isDisabled && (
          <div className={`absolute top-full left-0 right-0 mt-1 z-50 rounded-xl shadow-lg flex flex-col ${panelVariantClasses[variant]}`}>

            {/* Alle-Button (nur multi) */}
            {props.multiple && filtered.length > 0 && (
              <button
                type="button"
                onClick={handleToggleAll}
                className="px-3 py-2 text-xs font-medium text-left text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 border-b border-zinc-100 dark:border-zinc-800 transition-colors cursor-pointer"
              >
                {allFilteredSelected ? "Alle abwaehlen" : "Alle auswaehlen"}
              </button>
            )}

            {/* Options */}
            <div className="max-h-52 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="px-3 py-4 text-sm text-zinc-400 dark:text-zinc-500 text-center">
                  Keine Ergebnisse
                </p>
              ) : (
                filtered.map(opt => {
                  const isSelected = props.multiple
                    ? multiValues.includes(opt.value)
                    : singleValue === opt.value;

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => props.multiple
                        ? handleToggleMulti(opt.value)
                        : handleSelectSingle(opt.value)
                      }
                      className={[
                        "w-full text-left flex items-center gap-2.5 transition-colors duration-100 cursor-pointer",
                        optionSizeClasses[size],
                        isSelected
                          ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                          : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800",
                      ].join(" ")}
                    >
                      {/* Checkbox (multi) */}
                      {props.multiple && (
                        <span className={`w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-zinc-700 dark:bg-zinc-200 border-zinc-700 dark:border-zinc-200"
                            : "border-zinc-300 dark:border-zinc-600"
                        }`}>
                          {isSelected && <Check size={9} className="text-white dark:text-zinc-900" strokeWidth={3} />}
                        </span>
                      )}

                      {/* Checkmark (single) */}
                      {!props.multiple && (
                        <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                          {isSelected && <Check size={13} className="text-zinc-700 dark:text-zinc-300" strokeWidth={2.5} />}
                        </span>
                      )}

                      <span className={isSelected ? "font-medium" : ""}>{opt.label}</span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Truncation-Hinweis */}
            {isTruncated && (
              <p className="px-3 py-1.5 text-xs text-zinc-400 dark:text-zinc-500 border-t border-zinc-100 dark:border-zinc-800 text-center">
                {filtered.length} von {totalMatched} Ergebnissen
              </p>
            )}

          </div>
        )}

      </div>
    </TitelBorder>
  );
}
