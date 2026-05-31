import { useState, useEffect, type ReactNode, type HTMLAttributes } from "react";
import { ChevronDown, Loader2, type LucideIcon } from "lucide-react";

/**
 * Accordion — ein aufklappbarer Inhaltsbereich mit animierter Höhen-Transition.
 *
 * Folgt dem Design-System: Size sm/md/lg/full, Variant default/subtle/strong,
 * Dark Mode via Tailwind dark:-Klassen, Icons aus lucide-react.
 *
 * @example
 * // Einfach, standardmäßig geschlossen
 * <Accordion title="Details">
 *   <p>Versteckter Inhalt…</p>
 * </Accordion>
 *
 * @example
 * // Standardmäßig geöffnet, große Variante
 * <Accordion title="Reiseinfo" defaultOpen size="lg" variant="strong">
 *   <p>Inhalt…</p>
 * </Accordion>
 *
 * @example
 * // Kontrolliert von außen + eigenes Icon
 * import { Plus } from "lucide-react";
 * <Accordion title="Optionen" open={isOpen} onToggle={setIsOpen} icon={Plus}>
 *   <p>Inhalt…</p>
 * </Accordion>
 *
 * @prop title       — Beschriftung der Header-Zeile (Pflicht)
 * @prop defaultOpen — Startzustand: aufgeklappt (default: false)
 * @prop open        — Kontrollierter Öffnungszustand (optional)
 * @prop onToggle    — Callback wenn der Zustand wechselt (optional)
 * @prop icon        — Ersetzt den Standard-ChevronDown durch ein beliebiges LucideIcon
 * @prop size        — sm | md | lg | full  (default: "md")
 * @prop variant     — default | subtle | strong  (default: "default")
 * @prop loading     — Zeigt Spinner, sperrt Interaktion
 * @prop disabled    — Deaktiviert den Toggle
 * @prop className   — Zusätzliche Klassen am Root-Element
 * @prop children    — Aufklappbarer Inhalt
 */

type AccordionSize    = "sm" | "md" | "lg" | "full";
type AccordionVariant = "default" | "subtle" | "strong";

type AccordionProps = {
  readonly title:        string;
  readonly defaultOpen?: boolean;
  readonly open?:        boolean;
  readonly onToggle?:    (open: boolean) => void;
  readonly icon?:        LucideIcon;
  readonly size?:        AccordionSize;
  readonly variant?:     AccordionVariant;
  readonly loading?:     boolean;
  readonly disabled?:    boolean;
  readonly className?:   string;
  readonly children?:    ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, "className" | "children">;

const sizeClasses: Record<AccordionSize, string> = {
  sm:   "max-w-sm",
  md:   "max-w-md",
  lg:   "max-w-lg",
  full: "w-full",
};

const headerSizeClasses: Record<AccordionSize, string> = {
  sm:   "px-3 py-2 text-sm",
  md:   "px-4 py-2.5 text-sm",
  lg:   "px-5 py-3 text-base",
  full: "px-4 py-2.5 text-sm",
};

const contentSizeClasses: Record<AccordionSize, string> = {
  sm:   "px-3 pb-3 pt-1 text-sm",
  md:   "px-4 pb-4 pt-1 text-sm",
  lg:   "px-5 pb-5 pt-2 text-base",
  full: "px-4 pb-4 pt-1 text-sm",
};

const iconSizeClasses: Record<AccordionSize, string> = {
  sm:   "w-3.5 h-3.5",
  md:   "w-4 h-4",
  lg:   "w-5 h-5",
  full: "w-4 h-4",
};

const variantClasses: Record<AccordionVariant, string> = {
  default: "border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900",
  subtle:  "border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950",
  strong:  "border-2 border-zinc-400 dark:border-zinc-500 bg-white dark:bg-zinc-900",
};

const dividerVariantClasses: Record<AccordionVariant, string> = {
  default: "border-zinc-100 dark:border-zinc-800",
  subtle:  "border-zinc-100 dark:border-zinc-800",
  strong:  "border-zinc-300 dark:border-zinc-600",
};

export function Accordion({
  title,
  defaultOpen = false,
  open: controlledOpen,
  onToggle,
  icon: CustomIcon,
  size      = "md",
  variant   = "default",
  loading   = false,
  disabled  = false,
  className = "",
  children,
  ...rest
}: AccordionProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  useEffect(() => {
    if (controlledOpen !== undefined) setInternalOpen(controlledOpen);
  }, [controlledOpen]);

  const isOpen      = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const isDisabled  = disabled || loading;
  const IndicatorIcon = loading ? Loader2 : (CustomIcon ?? ChevronDown);

  const handleToggle = () => {
    if (isDisabled) return;
    const next = !isOpen;
    setInternalOpen(next);
    onToggle?.(next);
  };

  const rootClasses = [
    "rounded-xl overflow-hidden transition-colors duration-200",
    sizeClasses[size],
    variantClasses[variant],
    isDisabled ? "opacity-50" : "",
    className,
  ].join(" ");

  const headerClasses = [
    "w-full flex items-center justify-between transition-colors duration-200",
    "text-zinc-900 dark:text-zinc-100 font-medium",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset",
    "focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-500",
    headerSizeClasses[size],
    isDisabled ? "cursor-not-allowed" : "cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800",
  ].join(" ");

  const indicatorClasses = [
    iconSizeClasses[size],
    "flex-shrink-0 text-zinc-400 dark:text-zinc-500",
    "transition-transform duration-200",
    isOpen    ? "rotate-180" : "",
    loading   ? "animate-spin" : "",
  ].join(" ");

  return (
    <div className={rootClasses} {...rest}>
      {/* Header */}
      <button
        type="button"
        disabled={isDisabled}
        onClick={handleToggle}
        aria-expanded={isOpen}
        className={headerClasses}
      >
        <span>{title}</span>
        <IndicatorIcon className={indicatorClasses} />
      </button>

      {/* Animated content — CSS grid trick for smooth height transition */}
      <div
        className={[
          "grid transition-all duration-200",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        ].join(" ")}
      >
        <div className="overflow-hidden">
          {isOpen && (
            <div className={`border-t ${dividerVariantClasses[variant]}`} />
          )}
          <div
            className={[
              "text-zinc-700 dark:text-zinc-300",
              contentSizeClasses[size],
            ].join(" ")}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
