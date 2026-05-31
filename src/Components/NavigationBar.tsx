import { type ReactNode, type HTMLAttributes } from "react";
import { type LucideIcon } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type NavBarSize        = "sm" | "md" | "lg";
export type NavBarVariant     = "default" | "subtle" | "strong";
export type NavBarOrientation = "horizontal" | "vertical";
export type NavBarIndicator   = "gradient-line" | "pill" | "dot" | "none";

export type NavBarItem = {
  readonly id:        string;
  readonly label?:    string;
  readonly icon?:     LucideIcon;
  readonly href?:     string;
  readonly node?:     ReactNode;
  readonly disabled?: boolean;
};

export type NavigationBarProps = {
  readonly items:        ReadonlyArray<NavBarItem>;
  readonly activeId?:    string;
  readonly onSelect?:    (id: string) => void;
  readonly orientation?: NavBarOrientation;
  readonly logo?:        ReactNode;
  readonly background?:  string;
  readonly size?:        NavBarSize;
  readonly variant?:     NavBarVariant;
  readonly indicator?:   NavBarIndicator;
  readonly trailing?:    ReactNode;
  readonly fullWidth?:   boolean;
  readonly sticky?:      boolean;
  readonly className?:   string;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children" | "onSelect">;

// ── Maps ──────────────────────────────────────────────────────────────────────

const itemSizeClasses: Record<NavBarSize, string> = {
  sm: "px-3 py-1.5 text-xs  gap-1.5",
  md: "px-4 py-2   text-sm  gap-2",
  lg: "px-5 py-2.5 text-base gap-2.5",
};

const iconSizeClasses: Record<NavBarSize, string> = {
  sm: "w-3.5 h-3.5",
  md: "w-4   h-4",
  lg: "w-5   h-5",
};

const navContainerH: Record<NavBarSize, string> = {
  sm: "px-2 h-10",
  md: "px-3 h-12",
  lg: "px-4 h-14",
};

const navContainerV: Record<NavBarSize, string> = {
  sm: "py-2 px-2",
  md: "py-3 px-2",
  lg: "py-4 px-3",
};

const variantClasses: Record<NavBarVariant, string> = {
  default: "border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900",
  subtle:  "border border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-sm",
  strong:  "border-2 border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900",
};

// ── Component ─────────────────────────────────────────────────────────────────

export function NavigationBar({
  items,
  activeId,
  onSelect,
  orientation = "horizontal",
  logo,
  background,
  size      = "md",
  variant   = "default",
  indicator = "gradient-line",
  trailing,
  fullWidth = false,
  sticky    = false,
  className,
  ...rest
}: NavigationBarProps) {
  const isH = orientation === "horizontal";

  const navClasses = [
    "flex transition-colors duration-200",
    isH ? "flex-row items-center" : "flex-col",
    background !== undefined ? background : variantClasses[variant],
    isH ? navContainerH[size] : navContainerV[size],
    fullWidth ? "w-full" : "",
    sticky    ? "sticky top-0 z-20" : "",
    className ?? "",
  ].join(" ");

  return (
    <nav className={navClasses} {...rest}>
      {/* Logo slot */}
      {logo !== undefined && (
        <div className={[
          "flex items-center shrink-0",
          isH ? "mr-4" : "mb-4 px-1",
        ].join(" ")}>
          {logo}
        </div>
      )}

      {/* Items */}
      <div className={[
        "flex",
        isH ? "flex-row items-center flex-1 gap-0.5" : "flex-col flex-1 gap-0.5",
      ].join(" ")}>
        {items.map(item => {
          // Custom React node — render as-is, no active state handling
          if (item.node !== undefined) {
            return (
              <div key={item.id} className={isH ? "mx-0.5" : "py-0.5 px-1"}>
                {item.node}
              </div>
            );
          }

          const isActive   = item.id === activeId;
          const isDisabled = item.disabled ?? false;
          const Icon       = item.icon;
          const isPill     = indicator === "pill";

          const itemClasses = [
            "relative flex items-center overflow-hidden rounded-lg transition-colors duration-200 select-none whitespace-nowrap",
            itemSizeClasses[size],
            isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer",
            isPill
              ? isActive
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
                : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300"
              : isActive
                ? "text-zinc-900 dark:text-zinc-100 font-medium"
                : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-700 dark:hover:text-zinc-300",
          ].join(" ");

          const handleClick = () => { if (!isDisabled) onSelect?.(item.id); };

          const inner = (
            <>
              {Icon !== undefined && (
                <Icon className={[
                  iconSizeClasses[size],
                  "shrink-0 transition-transform duration-200",
                  isActive ? "scale-110" : "scale-100",
                ].join(" ")} />
              )}
              {item.label !== undefined && <span>{item.label}</span>}

              {/* Gradient-line indicator — grows from left (H) or top (V) */}
              {indicator === "gradient-line" && (
                <span
                  aria-hidden
                  className={[
                    "absolute bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-200",
                    isH
                      ? "bottom-0 left-0 right-0 h-0.5 origin-left"
                      : "top-0 left-0 bottom-0 w-0.5 origin-top",
                    isH
                      ? (isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0")
                      : (isActive ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"),
                  ].join(" ")}
                />
              )}

              {/* Dot indicator */}
              {indicator === "dot" && (
                <span
                  aria-hidden
                  className={[
                    "absolute rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-200",
                    isH
                      ? "bottom-1 left-1/2 -translate-x-1/2 w-1 h-1"
                      : "left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5",
                    isActive ? "opacity-100 scale-100" : "opacity-0 scale-0",
                  ].join(" ")}
                />
              )}
            </>
          );

          if (item.href !== undefined) {
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={handleClick}
                className={itemClasses}
                aria-current={isActive ? "page" : undefined}
              >
                {inner}
              </a>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={handleClick}
              disabled={isDisabled}
              className={itemClasses}
              aria-current={isActive ? "page" : undefined}
            >
              {inner}
            </button>
          );
        })}
      </div>

      {/* Trailing slot */}
      {trailing !== undefined && (
        <div className={[
          "flex items-center shrink-0",
          isH ? "ml-4" : "mt-4 px-1",
        ].join(" ")}>
          {trailing}
        </div>
      )}
    </nav>
  );
}
