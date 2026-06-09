import { useState, useRef, useEffect, useMemo } from "react";
import { TitelBorder } from "./TitelBorder";
import { Loader2, ChevronLeft, ChevronRight, Calendar, type LucideIcon } from "lucide-react";

type DatePickerSize    = "sm" | "md" | "lg" | "full";
type DatePickerVariant = "default" | "subtle" | "strong";

/** Wie das Datum dem User angezeigt wird */
type DisplayFormat = "de" | "us" | "iso" | "long";

/** Was onChange zurueckgibt */
type OutputFormat = "date" | "iso" | "de" | "us" | "timestamp";

type DatePickerProps = {
  readonly title: string;
  readonly size?: DatePickerSize;
  readonly variant?: DatePickerVariant;
  readonly icon?: LucideIcon;
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly fullWidth?: boolean;
  readonly displayFormat?: DisplayFormat;
  /** Freies Anzeigeformat, überschreibt displayFormat. Tokens: DD MM YYYY D M */
  readonly customDisplayFormat?: string;
  readonly outputFormat?: OutputFormat;
  /** Freies Ausgabeformat für onChange, überschreibt outputFormat. Tokens: DD MM YYYY D M */
  readonly customOutputFormat?: string;
  readonly value?: Date | null;
  readonly onChange?: (value: Date | string | number) => void;
  readonly minDate?: Date;
  readonly maxDate?: Date;
  readonly placeholder?: string;
  readonly className?: string;
};

// ── Style maps ────────────────────────────────────────────────────────────────

const triggerSizeClasses: Record<DatePickerSize, string> = {
  sm:   "py-1 pl-2 pr-8 text-sm",
  md:   "py-2 pl-3 pr-9 text-sm",
  lg:   "py-3 pl-4 pr-11 text-base",
  full: "py-2 pl-3 pr-9 text-sm",
};

const iconLeftPadding: Record<DatePickerSize, string> = {
  sm:   "pl-7",
  md:   "pl-9",
  lg:   "pl-11",
  full: "pl-9",
};

const iconSizeClasses: Record<DatePickerSize, string> = {
  sm:   "w-3.5 h-3.5",
  md:   "w-4 h-4",
  lg:   "w-5 h-5",
  full: "w-4 h-4",
};

const chevronRightPos: Record<DatePickerSize, string> = {
  sm:   "right-2",
  md:   "right-2.5",
  lg:   "right-3",
  full: "right-2.5",
};

const triggerVariantClasses: Record<DatePickerVariant, string> = {
  default: "border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900",
  subtle:  "border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800",
  strong:  "border-2 border-zinc-400 dark:border-zinc-500 bg-white dark:bg-zinc-900",
};

const panelVariantClasses: Record<DatePickerVariant, string> = {
  default: "border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900",
  subtle:  "border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900",
  strong:  "border-2 border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900",
};

// ── Hilfsfunktionen ───────────────────────────────────────────────────────────

const MONTH_NAMES = [
  "Januar","Februar","Maerz","April","Mai","Juni",
  "Juli","August","September","Oktober","November","Dezember",
];

const DAY_LABELS = ["Mo","Di","Mi","Do","Fr","Sa","So"];

function applyFormatString(date: Date, fmt: string): string {
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear();
  return fmt
    .replace("YYYY", String(y))
    .replace("MM",   String(m).padStart(2, "0"))
    .replace("DD",   String(d).padStart(2, "0"))
    .replace("M",    String(m))
    .replace("D",    String(d));
}

function formatDisplay(date: Date, format: DisplayFormat): string {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = String(date.getFullYear());
  switch (format) {
    case "de":   return `${d}.${m}.${y}`;
    case "us":   return `${m}/${d}/${y}`;
    case "iso":  return `${y}-${m}-${d}`;
    case "long": return `${date.getDate()}. ${MONTH_NAMES[date.getMonth()]} ${y}`;
  }
}

function formatOutput(date: Date, format: OutputFormat): Date | string | number {
  switch (format) {
    case "date":      return date;
    case "iso":       return formatDisplay(date, "iso");
    case "de":        return formatDisplay(date, "de");
    case "us":        return formatDisplay(date, "us");
    case "timestamp": return date.getTime();
  }
}

function buildCalendarDays(year: number, month: number): Array<{ date: Date; isCurrentMonth: boolean }> {
  const firstDay  = new Date(year, month, 1).getDay();
  const offset    = firstDay === 0 ? 6 : firstDay - 1; // Montag als erster Wochentag
  const prevDays  = new Date(year, month, 0).getDate();
  const currDays  = new Date(year, month + 1, 0).getDate();
  const days: Array<{ date: Date; isCurrentMonth: boolean }> = [];

  for (let i = offset - 1; i >= 0; i--)
    days.push({ date: new Date(year, month - 1, prevDays - i), isCurrentMonth: false });
  for (let d = 1; d <= currDays; d++)
    days.push({ date: new Date(year, month, d), isCurrentMonth: true });
  for (let d = 1; days.length < 42; d++)
    days.push({ date: new Date(year, month + 1, d), isCurrentMonth: false });

  return days;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getDate() === b.getDate()
    && a.getMonth() === b.getMonth()
    && a.getFullYear() === b.getFullYear();
}

// ── Komponente ────────────────────────────────────────────────────────────────

export function DatePicker({
  title,
  size = "md",
  variant = "default",
  icon: Icon,
  loading = false,
  disabled = false,
  fullWidth = false,
  displayFormat = "de",
  customDisplayFormat,
  outputFormat = "date",
  customOutputFormat,
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = "Datum waehlen...",
  className = "",
}: DatePickerProps) {
  const today = useMemo(() => new Date(), []);

  const [open, setOpen]           = useState(false);
  const [selected, setSelected]   = useState<Date | null>(value ?? null);
  const [viewYear, setViewYear]   = useState(value?.getFullYear()  ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(value?.getMonth()     ?? today.getMonth());
  const containerRef              = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined) setSelected(value);
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const calendarDays = useMemo(() => buildCalendarDays(viewYear, viewMonth), [viewYear, viewMonth]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const isDateDisabled = (date: Date): boolean => {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    if (minDate && d < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) return true;
    if (maxDate && d > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())) return true;
    return false;
  };

  const handleSelectDate = (date: Date) => {
    if (isDateDisabled(date)) return;
    setSelected(date);
    const out = customOutputFormat
      ? applyFormatString(date, customOutputFormat)
      : formatOutput(date, outputFormat);
    onChange?.(out);
    setOpen(false);
  };

  const ActiveIcon  = loading ? Loader2 : (Icon ?? Calendar);
  const isDisabled  = disabled || loading;
  let triggerLabel: string | null = null;
  if (selected) {
    triggerLabel = customDisplayFormat
      ? applyFormatString(selected, customDisplayFormat)
      : formatDisplay(selected, displayFormat);
  }

  const triggerClasses = [
    "w-full rounded-lg flex items-center transition-colors duration-200 text-left",
    "focus-within:ring-2 focus-within:ring-zinc-400 dark:focus-within:ring-zinc-500",
    isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
    triggerSizeClasses[size],
    triggerVariantClasses[variant],
    iconLeftPadding[size],
  ].join(" ");

  return (
    <TitelBorder title={title} size={size} variant={variant} fullWidth={fullWidth} className={className}>
      <div ref={containerRef} className="relative">

        {/* Icon links */}
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none z-10">
          <ActiveIcon className={`${iconSizeClasses[size]} ${loading ? "animate-spin" : ""}`} />
        </span>

        {/* Trigger */}
        <div
          onClick={() => !isDisabled && setOpen(o => !o)}
          className={triggerClasses}
        >
          <span className={`flex-1 truncate ${triggerLabel ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-500"}`}>
            {triggerLabel ?? placeholder}
          </span>
        </div>

        {/* Chevron */}
        <span className={`absolute ${chevronRightPos[size]} top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none`}>
          <ChevronRight className={`${iconSizeClasses[size]} transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
        </span>

        {/* Kalender-Panel */}
        {open && !isDisabled && (
          <div className={`absolute top-full left-0 mt-1 z-50 rounded-xl shadow-lg min-w-[280px] ${panelVariantClasses[variant]}`}>

            {/* Monats-Navigation */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3">
              {/* Wochentag-Header */}
              <div className="grid grid-cols-7 mb-2">
                {DAY_LABELS.map(d => (
                  <div key={d} className="text-center text-xs font-medium text-zinc-400 dark:text-zinc-500 py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Tage */}
              <div className="grid grid-cols-7 gap-0.5">
                {calendarDays.map(({ date, isCurrentMonth }, i) => {
                  const isSelected  = selected != null && isSameDay(date, selected);
                  const isToday     = isSameDay(date, today);
                  const isDayDisabled = isDateDisabled(date);

                  const dayClasses = [
                    "w-8 h-8 mx-auto rounded-full text-xs flex items-center justify-center transition-colors",
                    isDayDisabled
                      ? "opacity-30 cursor-not-allowed"
                      : isSelected
                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold cursor-pointer"
                        : isCurrentMonth
                          ? "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                          : "text-zinc-300 dark:text-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer",
                    isToday && !isSelected ? "ring-1 ring-zinc-400 dark:ring-zinc-500" : "",
                  ].join(" ");

                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={isDayDisabled}
                      onClick={() => handleSelectDate(date)}
                      className={dayClasses}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Heute-Button */}
            <div className="px-3 pb-3">
              <button
                type="button"
                onClick={() => handleSelectDate(today)}
                className="w-full py-1.5 text-xs rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-700"
              >
                Heute
              </button>
            </div>

          </div>
        )}

      </div>
    </TitelBorder>
  );
}
