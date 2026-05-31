import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X, Info, CheckCircle, AlertTriangle, XCircle, type LucideIcon } from "lucide-react";

type ToastType = "info" | "success" | "warning" | "error";

export type ToastOptions = {
  readonly type?:     ToastType;
  readonly duration?: number;
  readonly icon?:     LucideIcon;
};

type ToastItem = {
  readonly id:       string;
  readonly message:  string;
  readonly type:     ToastType;
  readonly duration: number;
  readonly icon?:    LucideIcon;
  visible:           boolean;
};

type ToastContextValue = {
  readonly show: (message: string, options?: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const typeBorderClasses: Record<ToastType, string> = {
  info:    "border-l-indigo-500",
  success: "border-l-emerald-500",
  warning: "border-l-amber-500",
  error:   "border-l-red-500",
};

const typeIconClasses: Record<ToastType, string> = {
  info:    "text-indigo-500",
  success: "text-emerald-500",
  warning: "text-amber-500",
  error:   "text-red-500",
};

const defaultIcons: Record<ToastType, LucideIcon> = {
  info:    Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error:   XCircle,
};

type SingleToastProps = {
  readonly item:    ToastItem;
  readonly onClose: (id: string) => void;
};

export function Toast({ item, onClose }: SingleToastProps) {
  const Icon = item.icon ?? defaultIcons[item.type];

  return (
    <div
      className={[
        "flex items-start gap-3 w-80 max-w-full",
        "bg-white dark:bg-zinc-900",
        "border border-zinc-200 dark:border-zinc-700 border-l-4",
        typeBorderClasses[item.type],
        "rounded-xl shadow-lg px-4 py-3",
        "transition-all duration-300",
        item.visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8",
      ].join(" ")}
    >
      <Icon className={["w-4 h-4 mt-0.5 shrink-0", typeIconClasses[item.type]].join(" ")} />
      <p className="flex-1 text-sm text-zinc-700 dark:text-zinc-300 leading-snug">{item.message}</p>
      <button
        type="button"
        onClick={() => onClose(item.id)}
        className={[
          "shrink-0 p-0.5 rounded-md cursor-pointer transition-colors duration-200",
          "text-zinc-400 dark:text-zinc-500",
          "hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800",
        ].join(" ")}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { readonly children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, visible: false } : t));
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300);
    const timer = timers.current.get(id);
    if (timer != null) clearTimeout(timer);
    timers.current.delete(id);
  }, []);

  const show = useCallback((message: string, options: ToastOptions = {}) => {
    const id       = crypto.randomUUID();
    const duration = options.duration ?? 3000;
    setToasts(prev => [...prev, { id, message, type: options.type ?? "info", duration, icon: options.icon, visible: false }]);
    // double rAF triggers CSS transition after mount
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, visible: true } : t));
      });
    });
    if (duration > 0) {
      timers.current.set(id, setTimeout(() => remove(id), duration));
    }
  }, [remove]);

  useEffect(() => {
    return () => { timers.current.forEach(t => clearTimeout(t)); };
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {createPortal(
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end pointer-events-none">
          {toasts.map(item => (
            <div key={item.id} className="pointer-events-auto">
              <Toast item={item} onClose={remove} />
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (ctx == null) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
