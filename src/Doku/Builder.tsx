import { useState, useId, type ReactNode } from "react";
import { Button } from "../Components/Button";
import { Card } from "../Components/Card";
import { Input } from "../Components/Input";
import { Badge } from "../Components/Badge";
import { TitelBorder } from "../Components/TitelBorder";
import { Accordion } from "../Components/Accordion";
import { Copy, Check, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

type Lang = "de" | "en";

// ── Prop field types ──────────────────────────────────────────────────────────

type TextField    = { kind: "text";    name: string; label: string; default: string };
type SelectField  = { kind: "select";  name: string; label: string; options: string[]; default: string };
type BooleanField = { kind: "boolean"; name: string; label: string; default: boolean };
type PropField = TextField | SelectField | BooleanField;

type ComponentDef = {
  type: string;
  label: string;
  fields: PropField[];
  render: (props: Record<string, unknown>) => ReactNode;
  code:   (props: Record<string, unknown>) => string;
};

// ── Component definitions ─────────────────────────────────────────────────────

const DEFS: ComponentDef[] = [
  {
    type: "Button",
    label: "Button",
    fields: [
      { kind: "text",    name: "children", label: "Label",    default: "Click me" },
      { kind: "select",  name: "variant",  label: "Variant",  options: ["solid","outline","ghost","link"], default: "solid" },
      { kind: "select",  name: "color",    label: "Color",    options: ["primary","secondary","success","warning","danger","neutral"], default: "primary" },
      { kind: "select",  name: "size",     label: "Size",     options: ["xs","sm","md","lg"], default: "md" },
      { kind: "boolean", name: "loading",  label: "Loading",  default: false },
      { kind: "boolean", name: "disabled", label: "Disabled", default: false },
    ],
    render: p => (
      <Button
        variant={p.variant as never}
        color={p.color as never}
        size={p.size as never}
        loading={p.loading as boolean}
        disabled={p.disabled as boolean}
      >
        {p.children as string}
      </Button>
    ),
    code: p =>
      `<Button variant="${p.variant}" color="${p.color}" size="${p.size}"${p.loading ? " loading" : ""}${p.disabled ? " disabled" : ""}>\n  ${p.children}\n</Button>`,
  },
  {
    type: "Badge",
    label: "Badge",
    fields: [
      { kind: "text",    name: "label",   label: "Label",   default: "Badge" },
      { kind: "select",  name: "color",   label: "Color",   options: ["primary","secondary","success","warning","danger","neutral"], default: "primary" },
      { kind: "select",  name: "variant", label: "Variant", options: ["solid","subtle","outline"], default: "subtle" },
      { kind: "boolean", name: "dot",     label: "Dot",     default: false },
    ],
    render: p => <Badge label={p.label as string} color={p.color as never} variant={p.variant as never} dot={p.dot as boolean} />,
    code: p =>
      `<Badge label="${p.label}" color="${p.color}" variant="${p.variant}"${p.dot ? " dot" : ""} />`,
  },
  {
    type: "Card",
    label: "Card",
    fields: [
      { kind: "text",   name: "title",   label: "Title",   default: "Card Title" },
      { kind: "select", name: "variant", label: "Variant", options: ["default","elevated","outlined","ghost"], default: "default" },
      { kind: "select", name: "size",    label: "Size",    options: ["sm","md","lg"], default: "md" },
    ],
    render: p => (
      <Card title={p.title as string} variant={p.variant as never} size={p.size as never}>
        <p className="text-sm text-zinc-400">Card content here.</p>
      </Card>
    ),
    code: p =>
      `<Card title="${p.title}" variant="${p.variant}" size="${p.size}">\n  <p>Card content here.</p>\n</Card>`,
  },
  {
    type: "Input",
    label: "Input",
    fields: [
      { kind: "text",    name: "label",       label: "Label",       default: "Label" },
      { kind: "text",    name: "placeholder", label: "Placeholder", default: "Enter text…" },
      { kind: "boolean", name: "disabled",    label: "Disabled",    default: false },
      { kind: "boolean", name: "loading",     label: "Loading",     default: false },
    ],
    render: p => (
      <Input
        label={p.label as string}
        placeholder={p.placeholder as string}
        disabled={p.disabled as boolean}
        loading={p.loading as boolean}
      />
    ),
    code: p =>
      `<Input label="${p.label}" placeholder="${p.placeholder}"${p.disabled ? " disabled" : ""}${p.loading ? " loading" : ""} />`,
  },
  {
    type: "TitelBorder",
    label: "TitelBorder",
    fields: [
      { kind: "text", name: "title", label: "Title", default: "Group Title" },
    ],
    render: p => (
      <TitelBorder title={p.title as string}>
        <p className="text-sm text-zinc-400">Content inside TitelBorder.</p>
      </TitelBorder>
    ),
    code: p => `<TitelBorder title="${p.title}">\n  {/* children */}\n</TitelBorder>`,
  },
  {
    type: "Accordion",
    label: "Accordion",
    fields: [
      { kind: "text",    name: "title",       label: "Title",        default: "Accordion" },
      { kind: "boolean", name: "defaultOpen", label: "Default open", default: false },
      { kind: "boolean", name: "disabled",    label: "Disabled",     default: false },
      { kind: "select",  name: "size",        label: "Size",         options: ["sm","md","lg","full"], default: "full" },
    ],
    render: p => (
      <Accordion
        title={p.title as string}
        defaultOpen={p.defaultOpen as boolean}
        disabled={p.disabled as boolean}
        size={p.size as never}
      >
        <p className="text-sm text-zinc-400">Accordion content here.</p>
      </Accordion>
    ),
    code: p =>
      `<Accordion title="${p.title}"${p.defaultOpen ? " defaultOpen" : ""}${p.disabled ? " disabled" : ""} size="${p.size}">\n  <p>Content here.</p>\n</Accordion>`,
  },
];

const DEF_MAP = Object.fromEntries(DEFS.map(d => [d.type, d]));

// ── Item state ────────────────────────────────────────────────────────────────

type Item = { id: string; type: string; props: Record<string, unknown> };

function defaultProps(type: string): Record<string, unknown> {
  return Object.fromEntries(DEF_MAP[type].fields.map(f => [f.name, f.default]));
}

// ── Code generation ───────────────────────────────────────────────────────────

function generateCode(items: Item[]): string {
  if (items.length === 0) return "";
  const types = [...new Set(items.map(i => i.type))];
  const imp  = `import { ${types.join(", ")} } from "@levin-the-doctor/simple-tailwind-ui"`;
  const body = items.map(i => DEF_MAP[i.type].code(i.props)).join("\n\n");
  return `${imp}\n\n${body}`;
}

// ── Builder ───────────────────────────────────────────────────────────────────

export function Builder({ lang }: { lang: Lang }) {
  const [items,      setItems]      = useState<Item[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copied,     setCopied]     = useState(false);
  const uid = useId();

  const selected = items.find(i => i.id === selectedId) ?? null;
  const def      = selected ? DEF_MAP[selected.type] : null;

  const de = lang === "de";
  const t = {
    components: de ? "Komponenten" : "Components",
    props:      de ? "Props"       : "Props",
    code:       de ? "Code"        : "Code",
    empty:      de ? "Klicke links auf eine Komponente, um sie hinzuzufügen." : "Click a component on the left to add it.",
    noSel:      de ? "Komponente in der Vorschau auswählen, um Props zu bearbeiten." : "Select a component in the preview to edit its props.",
    copy:       de ? "Code kopieren" : "Copy code",
    copied:     de ? "Kopiert!"      : "Copied!",
  };

  function add(type: string) {
    const id = `${uid}-${Date.now()}`;
    setItems(prev => [...prev, { id, type, props: defaultProps(type) }]);
    setSelectedId(id);
  }

  function remove(id: string) {
    setItems(prev => prev.filter(i => i.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function setProp(id: string, name: string, value: unknown) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, props: { ...i.props, [name]: value } } : i));
  }

  function move(id: string, dir: -1 | 1) {
    setItems(prev => {
      const idx  = prev.findIndex(i => i.id === id);
      const next = idx + dir;
      if (next < 0 || next >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr;
    });
  }

  function copy() {
    navigator.clipboard.writeText(generateCode(items));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] overflow-hidden">

      {/* ── Palette ───────────────────────────────────────────────────── */}
      <div className="w-44 shrink-0 border-r border-zinc-200 dark:border-zinc-800 overflow-y-auto p-3 flex flex-col gap-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 px-1 mb-1">
          {t.components}
        </p>
        {DEFS.map(d => (
          <button
            key={d.type}
            onClick={() => add(d.type)}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-700 dark:hover:text-indigo-300 border border-zinc-200 dark:border-zinc-700 transition-colors text-left cursor-pointer"
          >
            <span className="text-xs">{d.label}</span>
            <Plus className="w-3 h-3 shrink-0 opacity-50" />
          </button>
        ))}
      </div>

      {/* ── Canvas ────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3 min-w-0">
        {items.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-zinc-400 dark:text-zinc-500 text-center px-6">
            {t.empty}
          </div>
        ) : items.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setSelectedId(item.id)}
            className={`relative group rounded-xl border-2 p-4 cursor-pointer transition-all ${
              selectedId === item.id
                ? "border-indigo-500 dark:border-indigo-400 bg-indigo-50/30 dark:bg-indigo-950/20"
                : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900"
            }`}
          >
            {/* controls */}
            <div className="absolute top-2 right-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {idx > 0 && (
                <button onClick={e => { e.stopPropagation(); move(item.id, -1); }}
                  className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500 cursor-pointer">
                  <ChevronUp className="w-3 h-3" />
                </button>
              )}
              {idx < items.length - 1 && (
                <button onClick={e => { e.stopPropagation(); move(item.id, 1); }}
                  className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500 cursor-pointer">
                  <ChevronDown className="w-3 h-3" />
                </button>
              )}
              <button onClick={e => { e.stopPropagation(); remove(item.id); }}
                className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/40 text-red-400 cursor-pointer">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>

            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 mb-2 block">{item.type}</span>
            <div className="pointer-events-none select-none">
              {DEF_MAP[item.type].render(item.props)}
            </div>
          </div>
        ))}
      </div>

      {/* ── Props + Code ──────────────────────────────────────────────── */}
      <div className="w-68 shrink-0 border-l border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden" style={{ width: "17rem" }}>

        {/* Props */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">{t.props}</p>
          {selected && def ? def.fields.map(field => (
            <label key={field.name} className="flex flex-col gap-1">
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{field.label}</span>
              {field.kind === "text" && (
                <input
                  value={selected.props[field.name] as string}
                  onChange={e => setProp(selected.id, field.name, e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              )}
              {field.kind === "select" && (
                <select
                  value={selected.props[field.name] as string}
                  onChange={e => setProp(selected.id, field.name, e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              )}
              {field.kind === "boolean" && (
                <button
                  onClick={() => setProp(selected.id, field.name, !selected.props[field.name])}
                  className={`self-start px-2.5 py-1 text-xs rounded-lg border font-mono transition-colors cursor-pointer ${
                    selected.props[field.name]
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300"
                      : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-500"
                  }`}
                >
                  {selected.props[field.name] ? "true" : "false"}
                </button>
              )}
            </label>
          )) : (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">{t.noSel}</p>
          )}
        </div>

        {/* Code output */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 p-4 flex flex-col gap-2 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">{t.code}</span>
            <button
              onClick={copy}
              disabled={items.length === 0}
              className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
              {copied ? t.copied : t.copy}
            </button>
          </div>
          <pre className="text-[10px] font-mono bg-zinc-900 text-zinc-100 rounded-xl p-3 overflow-auto max-h-52 leading-relaxed whitespace-pre-wrap break-all">
            {items.length > 0
              ? generateCode(items)
              : <span className="text-zinc-500">{lang === "de" ? "// Noch leer" : "// Nothing here yet"}</span>
            }
          </pre>
        </div>

      </div>
    </div>
  );
}
