import { useState, useEffect, useMemo, type ReactNode, type HTMLAttributes } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

type TabelleSize    = "sm" | "md" | "lg" | "full";
type TabelleVariant = "default" | "subtle" | "strong";
type SortDir        = "asc" | "desc" | "none";

export type TabelleColumn<T> = {
  readonly key:       keyof T;
  readonly header:    string;
  readonly render?:   (value: T[keyof T], row: T) => ReactNode;
  readonly sortable?: boolean;
  readonly width?:    string;
};

type TabelleProps<T extends Record<string, unknown>> = {
  readonly data:                readonly T[];
  readonly columns:             readonly TabelleColumn<T>[];
  readonly rowKey:              keyof T;
  readonly title?:              string;
  readonly size?:               TabelleSize;
  readonly variant?:            TabelleVariant;
  readonly scrollable?:         boolean;
  readonly maxHeight?:          string;
  readonly pagination?:         boolean;
  readonly pageSize?:           number;
  readonly pageSizeOptions?:    readonly number[];
  readonly selectable?:         boolean;
  readonly multiSelect?:        boolean;
  readonly selectedKeys?:       readonly (string | number)[];
  readonly onSelectionChange?:  (keys: (string | number)[]) => void;
  readonly striped?:            boolean;
  readonly loading?:            boolean;
  readonly emptyLabel?:         string;
  readonly className?:          string;
} & Omit<HTMLAttributes<HTMLDivElement>, "className" | "children">;

const wrapperSizeClasses: Record<TabelleSize, string> = {
  sm:   "max-w-xl",
  md:   "max-w-3xl",
  lg:   "max-w-5xl",
  full: "w-full",
};

const cellSizeClasses: Record<TabelleSize, string> = {
  sm:   "px-3 py-1.5 text-xs",
  md:   "px-4 py-2.5 text-sm",
  lg:   "px-5 py-3.5 text-base",
  full: "px-4 py-2.5 text-sm",
};

const variantStyles: Record<TabelleVariant, { container: string; header: string; divider: string }> = {
  default: {
    container: "border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900",
    header:    "bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700",
    divider:   "border-zinc-100 dark:border-zinc-800",
  },
  subtle: {
    container: "border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950",
    header:    "bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800",
    divider:   "border-zinc-100 dark:border-zinc-800",
  },
  strong: {
    container: "border-2 border-zinc-400 dark:border-zinc-500 bg-white dark:bg-zinc-900",
    header:    "bg-zinc-100 dark:bg-zinc-800 border-b-2 border-zinc-400 dark:border-zinc-500",
    divider:   "border-zinc-200 dark:border-zinc-700",
  },
};

const DEFAULT_PAGE_SIZE_OPTIONS: readonly number[] = [5, 10, 20, 50];

export function Tabelle<T extends Record<string, unknown>>({
  data,
  columns,
  rowKey,
  title,
  size            = "full",
  variant         = "default",
  scrollable      = false,
  maxHeight       = "400px",
  pagination      = false,
  pageSize        = 10,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  selectable      = false,
  multiSelect     = false,
  selectedKeys,
  onSelectionChange,
  striped         = false,
  loading         = false,
  emptyLabel      = "Keine Einträge vorhanden",
  className       = "",
  ...rest
}: TabelleProps<T>) {
  const [sortKey,  setSortKey]  = useState<keyof T | null>(null);
  const [sortDir,  setSortDir]  = useState<SortDir>("none");
  const [page,     setPage]     = useState(1);
  const [perPage,  setPerPage]  = useState(pageSize);
  const [selected, setSelected] = useState<Set<string | number>>(
    new Set(selectedKeys ?? [])
  );

  useEffect(() => {
    if (selectedKeys !== undefined) setSelected(new Set(selectedKeys));
  }, [selectedKeys]);

  useEffect(() => { setPage(1); }, [data, perPage]);

  const sorted = useMemo(() => {
    if (sortDir === "none" || !sortKey) return [...data];
    return [...data].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === bv) return 0;
      return (av < bv ? -1 : 1) * (sortDir === "asc" ? 1 : -1);
    });
  }, [data, sortKey, sortDir]);

  const total    = sorted.length;
  const pages    = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(page, pages);

  const visible = useMemo(() => {
    if (!pagination) return sorted;
    const s = (safePage - 1) * perPage;
    return sorted.slice(s, s + perPage);
  }, [sorted, pagination, safePage, perPage]);

  const handleSort = (key: keyof T) => {
    if (sortKey !== key) { setSortKey(key); setSortDir("asc"); return; }
    if (sortDir === "asc") { setSortDir("desc"); return; }
    setSortKey(null); setSortDir("none");
  };

  const getKey = (row: T) => row[rowKey] as string | number;

  const handleRow = (key: string | number) => {
    if (!selectable) return;
    const next = new Set(selected);
    if (multiSelect) {
      next.has(key) ? next.delete(key) : next.add(key);
    } else {
      if (next.has(key) && next.size === 1) next.clear();
      else { next.clear(); next.add(key); }
    }
    setSelected(next);
    onSelectionChange?.([...next]);
  };

  const visKeys     = visible.map(getKey);
  const allChecked  = visKeys.length > 0 && visKeys.every(k => selected.has(k));
  const someChecked = visKeys.some(k => selected.has(k)) && !allChecked;

  const handleHeaderCheck = () => {
    const next = new Set(selected);
    if (allChecked) visKeys.forEach(k => next.delete(k));
    else visKeys.forEach(k => next.add(k));
    setSelected(next);
    onSelectionChange?.([...next]);
  };

  const pageNums = useMemo((): (number | "...")[] => {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
    if (safePage <= 4)         return [1, 2, 3, 4, 5, "...", pages];
    if (safePage >= pages - 3) return [1, "...", pages - 4, pages - 3, pages - 2, pages - 1, pages];
    return [1, "...", safePage - 1, safePage, safePage + 1, "...", pages];
  }, [pages, safePage]);

  const vs       = variantStyles[variant];
  const cell     = cellSizeClasses[size];
  const colCount = columns.length + (selectable && multiSelect ? 1 : 0);
  const from     = total === 0 ? 0 : (safePage - 1) * perPage + 1;
  const to       = Math.min(safePage * perPage, total);

  return (
    <div
      className={[
        "flex flex-col gap-2",
        wrapperSizeClasses[size],
        className,
      ].join(" ")}
      {...rest}
    >
      {title && (
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          {title}
        </p>
      )}

      <div className={["rounded-xl overflow-hidden transition-colors duration-200", vs.container].join(" ")}>
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 dark:bg-zinc-900/70 backdrop-blur-[2px]">
              <Loader2 className="w-6 h-6 text-zinc-400 dark:text-zinc-500 animate-spin" />
            </div>
          )}

          <div
            className={scrollable ? "overflow-y-auto" : ""}
            style={scrollable ? { maxHeight } : undefined}
          >
            <table className="w-full border-collapse">
              <thead className={[scrollable ? "sticky top-0 z-10" : "", vs.header].join(" ")}>
                <tr>
                  {selectable && multiSelect && (
                    <th className={["w-10", cell].join(" ")}>
                      <input
                        type="checkbox"
                        checked={allChecked}
                        ref={(el) => { if (el) el.indeterminate = someChecked; }}
                        onChange={handleHeaderCheck}
                        className="w-3.5 h-3.5 rounded accent-indigo-500 cursor-pointer"
                      />
                    </th>
                  )}
                  {columns.map(col => (
                    <th
                      key={String(col.key)}
                      style={col.width ? { width: col.width } : undefined}
                      onClick={col.sortable ? () => handleSort(col.key) : undefined}
                      className={[
                        "text-left font-semibold text-zinc-600 dark:text-zinc-300",
                        cell,
                        col.sortable
                          ? "cursor-pointer select-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200"
                          : "",
                      ].join(" ")}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{col.header}</span>
                        {col.sortable && (
                          sortKey === col.key && sortDir === "asc"  ? <ChevronUp      className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" /> :
                          sortKey === col.key && sortDir === "desc" ? <ChevronDown    className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" /> :
                                                                      <ChevronsUpDown className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-600 shrink-0" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {visible.length === 0 ? (
                  <tr>
                    <td
                      colSpan={colCount}
                      className={["text-center text-zinc-400 dark:text-zinc-500 py-10", cell].join(" ")}
                    >
                      {emptyLabel}
                    </td>
                  </tr>
                ) : (
                  visible.map((row, idx) => {
                    const key   = getKey(row);
                    const isSel = selectable && selected.has(key);
                    const isOdd = idx % 2 === 1;

                    const rowClasses = [
                      "transition-colors duration-200",
                      `border-t ${vs.divider}`,
                      isSel                      ? "bg-indigo-50 dark:bg-indigo-950/60"                              : "",
                      !isSel && striped && isOdd ? "bg-zinc-50 dark:bg-zinc-800/40"                                  : "",
                      selectable && !isSel       ? "cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/40"       : "",
                      selectable && isSel        ? "cursor-pointer"                                                   : "",
                    ].join(" ");

                    return (
                      <tr key={String(key)} className={rowClasses} onClick={() => handleRow(key)}>
                        {selectable && multiSelect && (
                          <td className={cell} onClick={e => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSel}
                              onChange={() => handleRow(key)}
                              className="w-3.5 h-3.5 rounded accent-indigo-500 cursor-pointer"
                            />
                          </td>
                        )}
                        {columns.map(col => (
                          <td
                            key={String(col.key)}
                            className={["text-zinc-700 dark:text-zinc-300", cell].join(" ")}
                          >
                            {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "")}
                          </td>
                        ))}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {pagination && (
          <div
            className={[
              "flex items-center justify-between gap-3 px-4 py-3 flex-wrap",
              `border-t ${vs.divider}`,
            ].join(" ")}
          >
            <span className="text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
              Einträge {from}–{to} von {total}
            </span>

            <div className="flex items-center gap-0.5">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {pageNums.map((p, i) =>
                p === "..." ? (
                  <span key={`e${i}`} className="w-7 text-center text-xs text-zinc-400 dark:text-zinc-500 select-none">…</span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p as number)}
                    className={[
                      "min-w-[28px] h-7 px-1.5 rounded-lg text-xs font-medium transition-colors duration-200 cursor-pointer",
                      safePage === p
                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800",
                    ].join(" ")}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                type="button"
                disabled={safePage === pages}
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <select
              value={perPage}
              onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
              className="text-xs text-zinc-600 dark:text-zinc-300 bg-transparent border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500 transition-colors duration-200"
            >
              {pageSizeOptions.map(n => (
                <option key={n} value={n}>{n} pro Seite</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
