import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Loader2, Search, X } from "lucide-react";

type SearchBarSize = "sm" | "md" | "lg" | "full";
type SearchBarVariant = "default" | "subtle" | "strong";

type SearchBarProps = {
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onChange?: (value: string) => void;
  readonly onSearch?: (value: string) => void;
  readonly placeholder?: string;
  readonly suggestions?: readonly string[];
  readonly maxSuggestions?: number;
  readonly clearable?: boolean;
  readonly accentRing?: string;
  readonly size?: SearchBarSize;
  readonly variant?: SearchBarVariant;
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly fullWidth?: boolean;
  readonly className?: string;
};

const sizeClasses: Record<SearchBarSize, string> = {
  sm:   "h-8 text-sm",
  md:   "h-10 text-sm",
  lg:   "h-12 text-base",
  full: "h-10 text-sm",
};

const widthClasses: Record<SearchBarSize, string> = {
  sm:   "max-w-sm",
  md:   "max-w-md",
  lg:   "max-w-lg",
  full: "w-full",
};

const iconSizeClasses: Record<SearchBarSize, string> = {
  sm:   "w-3.5 h-3.5",
  md:   "w-4 h-4",
  lg:   "w-5 h-5",
  full: "w-4 h-4",
};

const variantClasses: Record<SearchBarVariant, string> = {
  default: "border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm",
  subtle:  "border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800",
  strong:  "border-2 border-zinc-400 dark:border-zinc-500 bg-white dark:bg-zinc-900 shadow-sm",
};

export function SearchBar({
  value,
  defaultValue = "",
  onChange,
  onSearch,
  placeholder = "Suchen…",
  suggestions,
  maxSuggestions = 6,
  clearable = true,
  accentRing = "focus-within:ring-indigo-500/40 focus-within:border-indigo-400 dark:focus-within:border-indigo-500",
  size = "md",
  variant = "default",
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
}: SearchBarProps) {
  const [query, setQuery] = useState(value ?? defaultValue);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined) setQuery(value);
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = (suggestions ?? [])
    .filter(s => query.trim() !== "" && s.toLowerCase().includes(query.toLowerCase()) && s !== query)
    .slice(0, maxSuggestions);

  const update = (next: string) => {
    setQuery(next);
    onChange?.(next);
    setOpen(true);
  };

  const submit = (next: string) => {
    setOpen(false);
    onSearch?.(next);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") submit(query);
    if (e.key === "Escape") setOpen(false);
  };

  const pick = (suggestion: string) => {
    setQuery(suggestion);
    onChange?.(suggestion);
    submit(suggestion);
  };

  const barClasses = [
    "flex items-center gap-2 px-3.5 rounded-full w-full",
    "transition-colors duration-200",
    "focus-within:ring-2",
    variantClasses[variant],
    accentRing,
    sizeClasses[size],
    disabled ? "opacity-50 cursor-not-allowed" : "",
  ].join(" ");

  return (
    <div ref={containerRef} className={`relative w-full ${fullWidth ? "" : widthClasses[size]} ${className}`}>
      <div className={barClasses}>
        {loading
          ? <Loader2 className={`${iconSizeClasses[size]} shrink-0 text-zinc-400 dark:text-zinc-500 animate-spin`} />
          : <Search className={`${iconSizeClasses[size]} shrink-0 text-zinc-400 dark:text-zinc-500`} />}
        <input
          type="search"
          value={query}
          onChange={e => update(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 min-w-0 bg-transparent outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 [&::-webkit-search-cancel-button]:hidden"
        />
        {clearable && query !== "" && !disabled && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => { update(""); setOpen(false); }}
            className="shrink-0 p-0.5 rounded-full text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200 cursor-pointer"
          >
            <X className={iconSizeClasses[size]} />
          </button>
        )}
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 p-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-900/15 overflow-hidden">
          {filtered.map(suggestion => (
            <button
              key={suggestion}
              type="button"
              onClick={() => pick(suggestion)}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-left text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-200 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 shrink-0 text-zinc-400 dark:text-zinc-500" />
              <span className="truncate">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
