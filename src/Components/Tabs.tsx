import { useState, useEffect, Children, isValidElement, type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";

type TabsSize        = "sm" | "md" | "lg" | "full";
type TabsVariant     = "default" | "subtle" | "strong";
type TabsOrientation = "horizontal" | "vertical";

type TabItem = {
  readonly id:        string;
  readonly label:     string;
  readonly icon?:     LucideIcon;
  readonly disabled?: boolean;
};

type TabsProps = {
  readonly items:             readonly TabItem[];
  readonly activeId?:         string;
  readonly defaultActiveId?:  string;
  readonly onChange?:         (id: string) => void;
  readonly size?:             TabsSize;
  readonly variant?:          TabsVariant;
  readonly orientation?:      TabsOrientation;
  readonly children?:         ReactNode;
  readonly className?:        string;
};

export type TabPanelProps = {
  readonly id:       string;
  readonly children?: ReactNode;
};

export function TabPanel({ children }: TabPanelProps) {
  return <>{children}</>;
}

const sizeClasses: Record<TabsSize, string> = {
  sm:   "max-w-sm",
  md:   "max-w-md",
  lg:   "max-w-lg",
  full: "w-full",
};

const tabSizeClasses: Record<TabsSize, string> = {
  sm:   "px-2.5 py-1.5 text-xs gap-1.5",
  md:   "px-3.5 py-2 text-sm gap-2",
  lg:   "px-4 py-2.5 text-base gap-2",
  full: "px-3.5 py-2 text-sm gap-2",
};

const iconSizeClasses: Record<TabsSize, string> = {
  sm:   "w-3.5 h-3.5",
  md:   "w-4 h-4",
  lg:   "w-5 h-5",
  full: "w-4 h-4",
};

const variantContainerClasses: Record<TabsVariant, Record<TabsOrientation, string>> = {
  default: {
    horizontal: "border-b border-zinc-200 dark:border-zinc-700",
    vertical:   "border-r border-zinc-200 dark:border-zinc-700",
  },
  subtle: {
    horizontal: "border-b border-zinc-100 dark:border-zinc-800",
    vertical:   "border-r border-zinc-100 dark:border-zinc-800",
  },
  strong: {
    horizontal: "border-b-2 border-zinc-400 dark:border-zinc-500",
    vertical:   "border-r-2 border-zinc-400 dark:border-zinc-500",
  },
};

const variantActiveTextClasses: Record<TabsVariant, string> = {
  default: "text-indigo-700 dark:text-indigo-300",
  subtle:  "text-indigo-600 dark:text-indigo-400",
  strong:  "text-indigo-700 dark:text-indigo-300",
};

const variantIndicatorClasses: Record<TabsVariant, string> = {
  default: "bg-indigo-500 dark:bg-indigo-400",
  subtle:  "bg-indigo-400 dark:bg-indigo-500",
  strong:  "bg-indigo-600 dark:bg-indigo-400",
};

export function Tabs({
  items,
  activeId: controlledActiveId,
  defaultActiveId,
  onChange,
  size        = "md",
  variant     = "default",
  orientation = "horizontal",
  children,
  className   = "",
}: TabsProps) {
  const [internalActiveId, setInternalActiveId] = useState(
    defaultActiveId ?? (items[0]?.id ?? ""),
  );

  useEffect(() => {
    if (controlledActiveId !== undefined) setInternalActiveId(controlledActiveId);
  }, [controlledActiveId]);

  const activeId = controlledActiveId !== undefined ? controlledActiveId : internalActiveId;

  const handleSelect = (id: string) => {
    setInternalActiveId(id);
    onChange?.(id);
  };

  const activePanel = Children.toArray(children).find(
    child => isValidElement(child) && (child.props as { id?: string }).id === activeId,
  ) ?? null;

  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={[
        "flex",
        isHorizontal ? "flex-col" : "flex-row gap-4",
        sizeClasses[size],
        className,
      ].join(" ")}
    >
      <div
        role="tablist"
        aria-orientation={orientation}
        className={[
          "flex",
          isHorizontal ? "flex-row" : "flex-col",
          variantContainerClasses[variant][orientation],
        ].join(" ")}
      >
        {items.map(item => {
          const isActive   = item.id === activeId;
          const isDisabled = item.disabled ?? false;
          const Icon       = item.icon;

          return (
            <button
              key={item.id}
              role="tab"
              type="button"
              disabled={isDisabled}
              aria-selected={isActive}
              onClick={() => handleSelect(item.id)}
              className={[
                "relative flex items-center transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset",
                "focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-500",
                tabSizeClasses[size],
                isActive
                  ? ["font-semibold", variantActiveTextClasses[variant]].join(" ")
                  : "text-zinc-500 dark:text-zinc-400 font-medium",
                isDisabled
                  ? "opacity-40 cursor-not-allowed pointer-events-none"
                  : [
                      "cursor-pointer",
                      "hover:text-zinc-700 dark:hover:text-zinc-200",
                      "hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
                    ].join(" "),
              ].join(" ")}
            >
              {Icon != null && <Icon className={iconSizeClasses[size]} />}
              <span>{item.label}</span>
              {isActive && (
                <span
                  className={[
                    "absolute transition-all duration-200",
                    isHorizontal
                      ? "bottom-0 left-0 right-0 h-0.5"
                      : "top-0 bottom-0 right-0 w-0.5",
                    variantIndicatorClasses[variant],
                  ].join(" ")}
                />
              )}
            </button>
          );
        })}
      </div>

      {children != null && activePanel != null && (
        <div
          role="tabpanel"
          className={[
            "text-zinc-700 dark:text-zinc-300 text-sm",
            isHorizontal ? "pt-4" : "pt-0",
          ].join(" ")}
        >
          {activePanel}
        </div>
      )}
    </div>
  );
}
