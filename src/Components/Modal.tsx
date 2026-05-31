import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type ModalSize    = "sm" | "md" | "lg" | "full";
type ModalVariant = "default" | "subtle" | "strong";

type ModalProps = {
  readonly open:              boolean;
  readonly onClose:           () => void;
  readonly title?:            string;
  readonly size?:             ModalSize;
  readonly variant?:          ModalVariant;
  readonly showCloseButton?:  boolean;
  readonly children?:         ReactNode;
  readonly className?:        string;
};

const sizeClasses: Record<ModalSize, string> = {
  sm:   "max-w-sm w-full",
  md:   "max-w-md w-full",
  lg:   "max-w-lg w-full",
  full: "max-w-full w-full mx-4",
};

const variantClasses: Record<ModalVariant, string> = {
  default: "border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900",
  subtle:  "border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950",
  strong:  "border-2 border-zinc-400 dark:border-zinc-500 bg-white dark:bg-zinc-900",
};

const headerDividerClasses: Record<ModalVariant, string> = {
  default: "border-zinc-100 dark:border-zinc-800",
  subtle:  "border-zinc-100 dark:border-zinc-800",
  strong:  "border-zinc-300 dark:border-zinc-600",
};

export function Modal({
  open,
  onClose,
  title,
  size            = "md",
  variant         = "default",
  showCloseButton = true,
  children,
  className       = "",
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const hasHeader = title != null || showCloseButton;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={[
          "relative z-10 rounded-xl shadow-xl transition-all duration-200",
          sizeClasses[size],
          variantClasses[variant],
          className,
        ].join(" ")}
      >
        {hasHeader && (
          <div className={["flex items-center px-5 py-4 border-b", headerDividerClasses[variant]].join(" ")}>
            {title != null && (
              <h2 className="flex-1 text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className={[
                  "p-1.5 rounded-lg cursor-pointer transition-colors duration-200",
                  "text-zinc-400 dark:text-zinc-500",
                  "hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-500",
                  title == null ? "ml-auto" : "",
                ].join(" ")}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
        <div className="px-5 py-4 text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
