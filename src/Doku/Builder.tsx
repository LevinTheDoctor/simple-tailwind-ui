import { useState, useId, type ReactNode } from "react";
import * as LucideIcons from "lucide-react";
import { type LucideIcon, Copy, Check, Plus, Trash2, ChevronUp, ChevronDown, ExternalLink } from "lucide-react";
import { Button }        from "../Components/Button";
import { Card }          from "../Components/Card";
import { Input }         from "../Components/Input";
import { Badge }         from "../Components/Badge";
import { TitelBorder }   from "../Components/TitelBorder";
import { Accordion }     from "../Components/Accordion";
import { NavigationBar } from "../Components/NavigationBar";
import { Tabs, TabPanel }from "../Components/Tabs";
import { Dropdown }      from "../Components/DropDown";

type Lang = "de" | "en";

// ── Icon resolver ─────────────────────────────────────────────────────────────

function getIcon(name: string): LucideIcon | undefined {
  if (!name.trim()) return undefined;
  const pascal = name.charAt(0).toUpperCase() + name.slice(1);
  const icon = (LucideIcons as Record<string, unknown>)[pascal];
  return typeof icon === "function" ? (icon as LucideIcon) : undefined;
}

// ── Field types ───────────────────────────────────────────────────────────────

type TextField    = { kind: "text";    name: string; label: string; default: string };
type SelectField  = { kind: "select";  name: string; label: string; options: string[]; default: string };
type BooleanField = { kind: "boolean"; name: string; label: string; default: boolean };
type IconField    = { kind: "icon";    name: string; label: string; default: string };
type PropField    = TextField | SelectField | BooleanField | IconField;

type ComponentDef = {
  type:   string;
  label:  string;
  group:  "layout" | "form" | "display" | "nav";
  fields: PropField[];
  render: (props: Record<string, unknown>, onAction?: (msg: string) => void) => ReactNode;
  code:   (props: Record<string, unknown>) => string;
};

// ── Component definitions ─────────────────────────────────────────────────────

const DEFS: ComponentDef[] = [
  // ── Display ────────────────────────────────────────────────────────────────
  {
    type: "Heading", label: "Heading", group: "layout",
    fields: [
      { kind: "text",   name: "text",  label: "Text",  default: "My Heading" },
      { kind: "select", name: "level", label: "Level", options: ["h1","h2","h3","h4"], default: "h2" },
      { kind: "select", name: "size",  label: "Size",  options: ["text-4xl","text-3xl","text-2xl","text-xl","text-lg"], default: "text-2xl" },
    ],
    render: p => {
      const cls = `${p.size as string} font-bold text-zinc-900 dark:text-zinc-100`;
      const text = p.text as string;
      if (p.level === "h1") return <h1 className={cls}>{text}</h1>;
      if (p.level === "h3") return <h3 className={cls}>{text}</h3>;
      if (p.level === "h4") return <h4 className={cls}>{text}</h4>;
      return <h2 className={cls}>{text}</h2>;
    },
    code: p => `<${p.level} className="${p.size} font-bold">${p.text}</${p.level}>`,
  },
  {
    type: "Paragraph", label: "Paragraph", group: "layout",
    fields: [
      { kind: "text",   name: "text",  label: "Text",  default: "Lorem ipsum dolor sit amet." },
      { kind: "select", name: "color", label: "Color", options: ["text-zinc-900 dark:text-zinc-100","text-zinc-500 dark:text-zinc-400","text-indigo-600 dark:text-indigo-400"], default: "text-zinc-500 dark:text-zinc-400" },
    ],
    render: p => <p className={`text-sm ${p.color as string}`}>{p.text as string}</p>,
    code: p => `<p className="text-sm">${p.text}</p>`,
  },
  {
    type: "Button", label: "Button", group: "display",
    fields: [
      { kind: "text",    name: "children",     label: "Label",       default: "Click me" },
      { kind: "select",  name: "variant",      label: "Variant",     options: ["solid","outline","ghost","link"], default: "solid" },
      { kind: "select",  name: "color",        label: "Color",       options: ["primary","secondary","success","warning","danger","neutral"], default: "primary" },
      { kind: "select",  name: "size",         label: "Size",        options: ["xs","sm","md","lg"], default: "md" },
      { kind: "icon",    name: "icon",         label: "Icon",        default: "" },
      { kind: "select",  name: "iconPosition", label: "Icon pos.",   options: ["left","right"], default: "left" },
      { kind: "boolean", name: "isLoading",    label: "Loading",     default: false },
      { kind: "boolean", name: "disabled",     label: "Disabled",    default: false },
      { kind: "boolean", name: "fullWidth",    label: "Full width",  default: false },
      { kind: "text",    name: "href",         label: "Link (href)", default: "" },
      { kind: "text",    name: "actionMsg",    label: "Action text", default: "" },
    ],
    render: (p, onAction) => {
      const icon = getIcon(p.icon as string);
      const btn = (
        <Button
          variant={p.variant as never}
          color={p.color as never}
          size={p.size as never}
          icon={icon}
          iconPosition={p.iconPosition as never}
          isLoading={p.isLoading as boolean}
          disabled={p.disabled as boolean}
          fullWidth={p.fullWidth as boolean}
          onClick={p.actionMsg ? () => onAction?.(p.actionMsg as string) : undefined}
        >
          {p.children as string}
        </Button>
      );
      return p.href ? <a href={p.href as string} target="_blank" rel="noopener noreferrer">{btn}</a> : btn;
    },
    code: p => {
      const icon = p.icon ? `\n  icon={${p.icon}}` : "";
      const iconPos = p.icon ? `\n  iconPosition="${p.iconPosition}"` : "";
      const loading = p.isLoading ? "\n  isLoading" : "";
      const disabled = p.disabled ? "\n  disabled" : "";
      const fw = p.fullWidth ? "\n  fullWidth" : "";
      const onClick = p.actionMsg ? `\n  onClick={() => alert("${p.actionMsg}")}` : "";
      const inner = `<Button\n  variant="${p.variant}"\n  color="${p.color}"\n  size="${p.size}"${icon}${iconPos}${loading}${disabled}${fw}${onClick}\n>\n  ${p.children}\n</Button>`;
      return p.href ? `<a href="${p.href}" target="_blank">\n  ${inner.replace(/\n/g, "\n  ")}\n</a>` : inner;
    },
  },
  {
    type: "Badge", label: "Badge", group: "display",
    fields: [
      { kind: "text",    name: "children", label: "Label",   default: "Badge" },
      { kind: "select",  name: "color",    label: "Color",   options: ["neutral","info","success","warning","error"], default: "info" },
      { kind: "select",  name: "variant",  label: "Variant", options: ["default","subtle","strong"], default: "subtle" },
      { kind: "select",  name: "size",     label: "Size",    options: ["sm","md","lg"], default: "md" },
      { kind: "icon",    name: "icon",     label: "Icon",    default: "" },
      { kind: "boolean", name: "dot",      label: "Dot",     default: false },
    ],
    render: p => (
      <Badge
        color={p.color as never}
        variant={p.variant as never}
        size={p.size as never}
        icon={getIcon(p.icon as string)}
        dot={p.dot as boolean}
      >
        {p.children as string}
      </Badge>
    ),
    code: p => {
      const icon = p.icon ? ` icon={${p.icon}}` : "";
      const dot  = p.dot ? " dot" : "";
      return `<Badge color="${p.color}" variant="${p.variant}" size="${p.size}"${icon}${dot}>\n  ${p.children}\n</Badge>`;
    },
  },
  {
    type: "Card", label: "Card", group: "display",
    fields: [
      { kind: "text",   name: "title",   label: "Title",   default: "Card Title" },
      { kind: "select", name: "variant", label: "Variant", options: ["default","elevated","outlined","ghost"], default: "default" },
      { kind: "select", name: "size",    label: "Size",    options: ["sm","md","lg"], default: "md" },
      { kind: "text",   name: "content", label: "Content", default: "Card content here." },
    ],
    render: p => (
      <Card title={p.title as string} variant={p.variant as never} size={p.size as never}>
        <p className="text-sm text-zinc-400">{p.content as string}</p>
      </Card>
    ),
    code: p => `<Card title="${p.title}" variant="${p.variant}" size="${p.size}">\n  <p>${p.content}</p>\n</Card>`,
  },
  // ── Form ───────────────────────────────────────────────────────────────────
  {
    type: "Input", label: "Input", group: "form",
    fields: [
      { kind: "text",    name: "title",       label: "Title",       default: "Label" },
      { kind: "text",    name: "placeholder", label: "Placeholder", default: "Enter text…" },
      { kind: "select",  name: "variant",     label: "Variant",     options: ["default","subtle","strong"], default: "default" },
      { kind: "select",  name: "size",        label: "Size",        options: ["sm","md","lg","full"], default: "md" },
      { kind: "icon",    name: "icon",        label: "Icon",        default: "" },
      { kind: "select",  name: "iconPosition",label: "Icon pos.",   options: ["left","right"], default: "left" },
      { kind: "boolean", name: "loading",     label: "Loading",     default: false },
      { kind: "boolean", name: "disabled",    label: "Disabled",    default: false },
    ],
    render: p => (
      <Input
        title={p.title as string}
        placeholder={p.placeholder as string}
        variant={p.variant as never}
        size={p.size as never}
        icon={getIcon(p.icon as string)}
        iconPosition={p.iconPosition as never}
        loading={p.loading as boolean}
        disabled={p.disabled as boolean}
      />
    ),
    code: p => {
      const icon = p.icon ? `\n  icon={${p.icon}}\n  iconPosition="${p.iconPosition}"` : "";
      const loading  = p.loading  ? "\n  loading"  : "";
      const disabled = p.disabled ? "\n  disabled" : "";
      return `<Input\n  title="${p.title}"\n  placeholder="${p.placeholder}"\n  variant="${p.variant}"\n  size="${p.size}"${icon}${loading}${disabled}\n/>`;
    },
  },
  {
    type: "Dropdown", label: "Dropdown", group: "form",
    fields: [
      { kind: "text",    name: "title",       label: "Title",       default: "Select" },
      { kind: "text",    name: "placeholder", label: "Placeholder", default: "Choose…" },
      { kind: "select",  name: "variant",     label: "Variant",     options: ["default","subtle","strong"], default: "default" },
      { kind: "select",  name: "size",        label: "Size",        options: ["sm","md","lg","full"], default: "md" },
      { kind: "boolean", name: "disabled",    label: "Disabled",    default: false },
    ],
    render: p => (
      <Dropdown
        title={p.title as string}
        placeholder={p.placeholder as string}
        variant={p.variant as never}
        size={p.size as never}
        disabled={p.disabled as boolean}
        options={[{ value: "a", label: "Option A" }, { value: "b", label: "Option B" }, { value: "c", label: "Option C" }]}
      />
    ),
    code: p =>
      `<Dropdown\n  title="${p.title}"\n  placeholder="${p.placeholder}"\n  variant="${p.variant}"\n  size="${p.size}"\n  options={[\n    { value: "a", label: "Option A" },\n    { value: "b", label: "Option B" },\n  ]}\n  value={value}\n  onChange={setValue}\n/>`,
  },
  {
    type: "TitelBorder", label: "TitelBorder", group: "form",
    fields: [
      { kind: "text",   name: "title",   label: "Title",   default: "Group Title" },
      { kind: "select", name: "variant", label: "Variant", options: ["default","subtle","strong"], default: "default" },
      { kind: "select", name: "size",    label: "Size",    options: ["sm","md","lg","full"], default: "md" },
    ],
    render: p => (
      <TitelBorder title={p.title as string} variant={p.variant as never} size={p.size as never}>
        <p className="text-sm text-zinc-400">Children go here.</p>
      </TitelBorder>
    ),
    code: p => `<TitelBorder title="${p.title}" variant="${p.variant}" size="${p.size}">\n  {/* children */}\n</TitelBorder>`,
  },
  // ── Layout ─────────────────────────────────────────────────────────────────
  {
    type: "Accordion", label: "Accordion", group: "layout",
    fields: [
      { kind: "text",    name: "title",       label: "Title",        default: "Accordion" },
      { kind: "text",    name: "content",     label: "Content",      default: "Expanded content here." },
      { kind: "select",  name: "variant",     label: "Variant",      options: ["default","subtle","strong"], default: "default" },
      { kind: "select",  name: "size",        label: "Size",         options: ["sm","md","lg","full"], default: "full" },
      { kind: "icon",    name: "icon",        label: "Icon",         default: "" },
      { kind: "boolean", name: "defaultOpen", label: "Default open", default: false },
      { kind: "boolean", name: "disabled",    label: "Disabled",     default: false },
    ],
    render: p => (
      <Accordion
        title={p.title as string}
        variant={p.variant as never}
        size={p.size as never}
        icon={getIcon(p.icon as string)}
        defaultOpen={p.defaultOpen as boolean}
        disabled={p.disabled as boolean}
      >
        <p className="text-sm text-zinc-400">{p.content as string}</p>
      </Accordion>
    ),
    code: p => {
      const icon    = p.icon        ? `\n  icon={${p.icon}}`  : "";
      const open    = p.defaultOpen ? "\n  defaultOpen"       : "";
      const dis     = p.disabled    ? "\n  disabled"          : "";
      return `<Accordion\n  title="${p.title}"\n  variant="${p.variant}"\n  size="${p.size}"${icon}${open}${dis}\n>\n  <p>${p.content}</p>\n</Accordion>`;
    },
  },
  // ── Nav ────────────────────────────────────────────────────────────────────
  {
    type: "NavigationBar", label: "NavigationBar", group: "nav",
    fields: [
      { kind: "select",  name: "orientation",       label: "Orientation",        options: ["horizontal","vertical"], default: "horizontal" },
      { kind: "select",  name: "indicator",         label: "Indicator",          options: ["gradient-line","pill","dot","none"], default: "gradient-line" },
      { kind: "select",  name: "variant",           label: "Variant",            options: ["default","subtle","strong"], default: "default" },
      { kind: "boolean", name: "fullWidth",         label: "Full width",         default: true },
      { kind: "text",    name: "indicatorGradient", label: "Indicator gradient", default: "" },
      { kind: "select",  name: "indicatorLineSize", label: "Line thickness",     options: ["px","0.5","1","1.5","2"], default: "0.5" },
      { kind: "select",  name: "dotSize",           label: "Dot size",           options: ["sm","md","lg"], default: "md" },
      { kind: "text",    name: "activeTextColor",   label: "Active text color",  default: "" },
      { kind: "text",    name: "inactiveTextColor", label: "Inactive text color",default: "" },
      { kind: "select",  name: "activeFontWeight",  label: "Active font weight", options: ["font-light","font-normal","font-medium","font-semibold","font-bold"], default: "font-medium" },
      { kind: "text",    name: "trailingClassName", label: "Trailing className",  default: "" },
    ],
    render: p => {
      const items = [
        { id: "home",      label: "Home",      icon: LucideIcons.Home },
        { id: "dashboard", label: "Dashboard", icon: LucideIcons.LayoutDashboard },
        { id: "settings",  label: "Settings",  icon: LucideIcons.Settings },
      ] as const;
      return (
        <NavigationBar
          items={items}
          activeId="home"
          orientation={p.orientation as never}
          indicator={p.indicator as never}
          variant={p.variant as never}
          fullWidth={p.fullWidth as boolean}
          indicatorGradient={(p.indicatorGradient as string) || undefined}
          indicatorLineSize={p.indicatorLineSize as never}
          dotSize={p.dotSize as never}
          activeTextColor={(p.activeTextColor as string) || undefined}
          inactiveTextColor={(p.inactiveTextColor as string) || undefined}
          activeFontWeight={p.activeFontWeight !== "font-medium" ? p.activeFontWeight as string : undefined}
          trailingClassName={(p.trailingClassName as string) || undefined}
        />
      );
    },
    code: p => {
      const ig  = p.indicatorGradient                    ? `\n  indicatorGradient="${p.indicatorGradient}"`    : "";
      const ils = p.indicatorLineSize !== "0.5"          ? `\n  indicatorLineSize="${p.indicatorLineSize}"`    : "";
      const ds  = p.dotSize !== "md"                     ? `\n  dotSize="${p.dotSize}"`                        : "";
      const atc = p.activeTextColor                      ? `\n  activeTextColor="${p.activeTextColor}"`        : "";
      const itc = p.inactiveTextColor                    ? `\n  inactiveTextColor="${p.inactiveTextColor}"`    : "";
      const afw = p.activeFontWeight !== "font-medium"   ? `\n  activeFontWeight="${p.activeFontWeight}"`      : "";
      const tc  = p.trailingClassName                    ? `\n  trailingClassName="${p.trailingClassName}"`    : "";
      return `const items = [\n  { id: "home",      label: "Home",      icon: Home },\n  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },\n  { id: "settings",  label: "Settings",  icon: Settings },\n];\n\n<NavigationBar\n  items={items}\n  activeId={active}\n  onSelect={setActive}\n  orientation="${p.orientation}"\n  indicator="${p.indicator}"\n  variant="${p.variant}"\n  fullWidth={${p.fullWidth}}${ig}${ils}${ds}${atc}${itc}${afw}${tc}\n/>`;
    },
  },
  {
    type: "Tabs", label: "Tabs", group: "nav",
    fields: [
      { kind: "select",  name: "orientation", label: "Orientation", options: ["horizontal","vertical"], default: "horizontal" },
      { kind: "select",  name: "variant",     label: "Variant",     options: ["default","subtle","strong"], default: "default" },
      { kind: "select",  name: "size",        label: "Size",        options: ["sm","md","lg","full"], default: "full" },
    ],
    render: p => {
      const items = [
        { id: "a", label: "Overview" },
        { id: "b", label: "Settings" },
        { id: "c", label: "Profile"  },
      ];
      return (
        <Tabs
          items={items}
          defaultActiveId="a"
          orientation={p.orientation as never}
          variant={p.variant as never}
          size={p.size as never}
        >
          <TabPanel id="a"><p className="text-sm text-zinc-400 p-2">Overview content</p></TabPanel>
          <TabPanel id="b"><p className="text-sm text-zinc-400 p-2">Settings content</p></TabPanel>
          <TabPanel id="c"><p className="text-sm text-zinc-400 p-2">Profile content</p></TabPanel>
        </Tabs>
      );
    },
    code: p =>
      `const tabs = [\n  { id: "a", label: "Overview" },\n  { id: "b", label: "Settings" },\n  { id: "c", label: "Profile"  },\n];\n\n<Tabs\n  items={tabs}\n  defaultActiveId="a"\n  orientation="${p.orientation}"\n  variant="${p.variant}"\n  size="${p.size}"\n>\n  <TabPanel id="a">Overview</TabPanel>\n  <TabPanel id="b">Settings</TabPanel>\n  <TabPanel id="c">Profile</TabPanel>\n</Tabs>`,
  },
];

const DEF_MAP = Object.fromEntries(DEFS.map(d => [d.type, d]));
const GROUPS: Array<{ key: string; label_de: string; label_en: string }> = [
  { key: "layout",  label_de: "Layout",      label_en: "Layout"  },
  { key: "display", label_de: "Anzeige",     label_en: "Display" },
  { key: "form",    label_de: "Formular",    label_en: "Form"    },
  { key: "nav",     label_de: "Navigation",  label_en: "Nav"     },
];

// ── Item type ─────────────────────────────────────────────────────────────────

type Item = { id: string; type: string; props: Record<string, unknown> };

function defaultProps(type: string): Record<string, unknown> {
  return Object.fromEntries(DEF_MAP[type].fields.map(f => [f.name, f.default]));
}

// ── Code generation ───────────────────────────────────────────────────────────

function generateCode(items: Item[]): string {
  if (items.length === 0) return "";
  const libTypes = [...new Set(
    items.map(i => i.type).filter(t => !["Heading","Paragraph"].includes(t))
  )];
  const lucideIcons = [...new Set(
    items.flatMap(i => {
      const props = i.props;
      const icons: string[] = [];
      if (props.icon && typeof props.icon === "string" && props.icon.trim()) icons.push(props.icon.trim());
      if (i.type === "NavigationBar") icons.push("Home", "LayoutDashboard", "Settings");
      return icons;
    })
  )];

  const lines: string[] = [];
  if (libTypes.length) lines.push(`import { ${libTypes.join(", ")} } from "@levin-the-doctor/simple-tailwind-ui"`);
  if (lucideIcons.length) lines.push(`import { ${lucideIcons.join(", ")} } from "lucide-react"`);
  lines.push("");
  lines.push(...items.map(i => DEF_MAP[i.type].code(i.props)));
  return lines.join("\n");
}

// ── Builder ───────────────────────────────────────────────────────────────────

export function Builder({ lang }: { lang: Lang }) {
  const [items,      setItems]     = useState<Item[]>([]);
  const [selectedId, setSelectedId]= useState<string | null>(null);
  const [copied,     setCopied]    = useState(false);
  const [actionMsg,  setActionMsg] = useState<string | null>(null);
  const [mobileTab,  setMobileTab] = useState<"palette" | "canvas" | "props">("canvas");
  const uid = useId();

  const selected = items.find(i => i.id === selectedId) ?? null;
  const def      = selected ? DEF_MAP[selected.type] : null;
  const de = lang === "de";

  const t = {
    copy:   de ? "Code kopieren"  : "Copy code",
    copied: de ? "Kopiert!"       : "Copied!",
    empty:  de ? "Klicke links eine Komponente an, um sie hinzuzufügen." : "Click a component on the left to add it.",
    noSel:  de ? "Komponente anklicken um Props zu bearbeiten." : "Select a component to edit its props.",
    props:  de ? "Props"  : "Props",
    code:   de ? "Code"   : "Code",
  };

  function add(type: string) {
    const id = `${uid}-${Date.now()}`;
    setItems(prev => [...prev, { id, type, props: defaultProps(type) }]);
    setSelectedId(id);
    setMobileTab("canvas");
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
    <div className="flex flex-col h-[calc(100vh-6rem)] overflow-hidden relative">

      {/* Action toast */}
      {actionMsg && (
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm rounded-xl shadow-lg animate-pulse"
          onAnimationEnd={() => setActionMsg(null)}
          onClick={() => setActionMsg(null)}
        >
          ⚡ {actionMsg}
        </div>
      )}

      {/* ── Mobile tab bar ────────────────────────────────────────────── */}
      <div className="flex md:hidden shrink-0 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        {(["palette", "canvas", "props"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={`flex-1 py-2.5 text-xs font-semibold capitalize transition-colors cursor-pointer ${
              mobileTab === tab
                ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500 dark:border-indigo-400"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Panel row ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden min-h-0">

      {/* ── Palette ──────────────────────────────────────────────────── */}
      <div className={`border-r border-zinc-200 dark:border-zinc-800 overflow-y-auto p-3 ${mobileTab === "palette" ? "flex flex-1 flex-col gap-3" : "hidden"} md:flex md:flex-col md:gap-3 md:w-44 md:flex-none`}>
        {GROUPS.map(g => {
          const groupDefs = DEFS.filter(d => d.group === g.key);
          return (
            <div key={g.key}>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 px-1 mb-1">
                {de ? g.label_de : g.label_en}
              </p>
              <div className="flex flex-col gap-1">
                {groupDefs.map(d => (
                  <button
                    key={d.type}
                    onClick={() => add(d.type)}
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-700 dark:hover:text-indigo-300 border border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer"
                  >
                    <span>{d.label}</span>
                    <Plus className="w-3 h-3 shrink-0 opacity-50" />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Canvas ───────────────────────────────────────────────────── */}
      <div className={`overflow-y-auto p-6 min-w-0 ${mobileTab === "canvas" ? "flex flex-1 flex-col gap-3" : "hidden"} md:flex md:flex-col md:flex-1 md:gap-3`}>
        {items.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-zinc-400 dark:text-zinc-500 text-center px-8">
            {t.empty}
          </div>
        ) : items.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => { setSelectedId(item.id); setMobileTab("props"); }}
            className={`relative group rounded-xl border-2 p-4 cursor-pointer transition-all ${
              selectedId === item.id
                ? "border-indigo-500 dark:border-indigo-400 bg-indigo-50/30 dark:bg-indigo-950/20"
                : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900"
            }`}
          >
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
              {DEF_MAP[item.type].render(item.props, msg => { setActionMsg(msg); setTimeout(() => setActionMsg(null), 2500); })}
            </div>
          </div>
        ))}
      </div>

      {/* ── Props + Code ─────────────────────────────────────────────── */}
      <div className={`border-l border-zinc-200 dark:border-zinc-800 overflow-hidden ${mobileTab === "props" ? "flex flex-1 flex-col" : "hidden"} md:flex md:flex-col md:w-[17rem] md:flex-none`}>

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
                      : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {selected.props[field.name] ? "true" : "false"}
                </button>
              )}

              {field.kind === "icon" && (
                <div className="flex gap-1.5 items-center">
                  <div className="relative flex-1">
                    <input
                      value={selected.props[field.name] as string}
                      onChange={e => setProp(selected.id, field.name, e.target.value)}
                      placeholder="z.B. Star"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    {(selected.props[field.name] as string) ? (
                      getIcon(selected.props[field.name] as string)
                        ? <>{(() => { const IC = getIcon(selected.props[field.name] as string)!; return <IC className="w-3 h-3 text-indigo-500 absolute right-2 top-1/2 -translate-y-1/2" />; })()}</>
                        : <span className="text-[10px] text-red-400 absolute right-2 top-1/2 -translate-y-1/2">?</span>
                    ) : null}
                  </div>
                  <a
                    href="https://lucide.dev/icons/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-7 h-7 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-indigo-600 hover:border-indigo-400 transition-colors shrink-0"
                    title="Lucide Icons"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

            </label>
          )) : (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">{t.noSel}</p>
          )}
        </div>

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
              : <span className="text-zinc-500">{de ? "// Noch leer" : "// Nothing here yet"}</span>
            }
          </pre>
        </div>
      </div>
      </div>
    </div>
  );
}
