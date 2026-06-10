import { useEffect, useRef, useState, type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";

type BurgerMenuSize = "sm" | "md" | "lg";
type BurgerMenuAlign = "left" | "right";

export type BurgerMenuItem = {
  readonly id: string;
  readonly label: string;
  readonly icon?: LucideIcon;
  readonly disabled?: boolean;
};

type BurgerMenuProps = {
  readonly items: ReadonlyArray<BurgerMenuItem>;
  readonly onSelect?: (id: string) => void;
  readonly activeId?: string;
  readonly header?: ReactNode;
  readonly align?: BurgerMenuAlign;
  readonly size?: BurgerMenuSize;
  readonly accentColor?: string;
  readonly disabled?: boolean;
  readonly className?: string;
};

const buttonSizeClasses: Record<BurgerMenuSize, string> = {
  sm: "w-8 h-8",
  md: "w-9 h-9",
  lg: "w-11 h-11",
};

const lineSizeClasses: Record<BurgerMenuSize, string> = {
  sm: "w-4",
  md: "w-4.5",
  lg: "w-5.5",
};

export function BurgerMenu({
  items,
  onSelect,
  activeId,
  header,
  align = "left",
  size = "md",
  accentColor = "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300",
  disabled = false,
  className = "",
}: BurgerMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setOpen(false);
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", clickHandler);
    document.addEventListener("keydown", keyHandler);
    return () => {
      document.removeEventListener("mousedown", clickHandler);
      document.removeEventListener("keydown", keyHandler);
    };
  }, []);

  const select = (id: string) => {
    setOpen(false);
    onSelect?.(id);
  };

  const lineBase = `h-0.5 rounded-full bg-current transition-transform duration-200 ${lineSizeClasses[size]}`;

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        aria-label="Menu"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen(o => !o)}
        className={[
          "flex flex-col items-center justify-center gap-1 rounded-lg",
          "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-500",
          "transition-colors duration-200 cursor-pointer",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          buttonSizeClasses[size],
        ].join(" ")}
      >
        <span className={`${lineBase} ${open ? "translate-y-1.5 rotate-45" : ""}`} />
        <span className={`${lineBase} ${open ? "opacity-0" : "opacity-100"} transition-opacity duration-200`} />
        <span className={`${lineBase} ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
      </button>

      {open && (
        <div
          className={[
            "absolute top-full mt-2 z-50 min-w-52 p-1.5 rounded-xl",
            "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800",
            "shadow-xl shadow-zinc-900/15",
            align === "left" ? "left-0" : "right-0",
          ].join(" ")}
        >
          {header && (
            <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 mb-1">
              {header}
            </div>
          )}
          {items.map(item => {
            const ItemIcon = item.icon;
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                disabled={item.disabled}
                onClick={() => select(item.id)}
                className={[
                  "flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-left",
                  "transition-colors duration-200 cursor-pointer",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  isActive
                    ? `font-medium ${accentColor}`
                    : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100",
                ].join(" ")}
              >
                {ItemIcon && <ItemIcon className="w-4 h-4 shrink-0" />}
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
