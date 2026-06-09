# SimpleTailwindUI

A handcrafted React + Tailwind CSS component library — clean, accessible, and dark-mode ready. Built with TypeScript and Vite.

[![npm](https://img.shields.io/npm/v/@levin-the-doctor/simple-tailwind-ui)](https://www.npmjs.com/package/@levin-the-doctor/simple-tailwind-ui)
[![Live Docs](https://img.shields.io/badge/docs-simple--tailwind--ui.de-indigo)](https://www.simple-tailwind-ui.de/)

**Live documentation & interactive builder → [simple-tailwind-ui.de](https://www.simple-tailwind-ui.de/)**

---

## Installation

```bash
npm install @levin-the-doctor/simple-tailwind-ui
```

### Peer Dependencies

```bash
npm install react react-dom lucide-react tailwindcss react-markdown
```

### Tailwind Content Scanning

Make sure Tailwind scans the library files so all `dark:` utilities are included:

```js
// tailwind.config.js  (or vite.config / postcss for v4)
content: [
  "./src/**/*.{ts,tsx}",
  "./node_modules/@levin-the-doctor/simple-tailwind-ui/lib/**/*.js",
]
```

---

## Components

| Component | Import | Description |
|---|---|---|
| `Button` | `Button` | Colors, variants, sizes, icon support, loading state |
| `Input` | `Input` | Text field with icon, loading state, TitelBorder wrapper |
| `Dropdown` | `Dropdown` | Select with custom chevron, icon support |
| `ComboBox` | `ComboBox` | Searchable select — single or multi, optional visible limit |
| `DatePicker` | `DatePicker` | Calendar with configurable display and output format |
| `Card` | `Card` | Container with visual styles (default / elevated / outlined / ghost) |
| `TitelBorder` | `TitelBorder` | Fieldset container with legend title for grouping content |
| `NavigationBar` | `NavigationBar` | Horizontal or vertical nav bar — fully customizable colors & indicators |
| `Accordion` | `Accordion` | Expandable content with animated height transition |
| `Tabelle` | `Tabelle` | Generic data table — sort, paginate, scroll, row selection |
| `Modal` | `Modal` | Dialog overlay with backdrop, Escape key and portal rendering |
| `Toast` | `ToastProvider` + `useToast` | Notification system with provider, hook and auto-dismiss |
| `Tabs` | `Tabs` + `TabPanel` | Tab navigation — horizontal or vertical |
| `Badge` | `Badge` | Inline label with color scheme, variants, icon and dot support |
| `Changelog` | `Changelog` | Info button that opens a scrollable Markdown changelog modal |

---

## Usage

```tsx
import {
  Button, Card, Input, Dropdown, ComboBox, DatePicker,
  TitelBorder, NavigationBar, Accordion, Tabelle,
  Modal, ToastProvider, useToast, Tabs, TabPanel, Badge, Changelog,
} from "@levin-the-doctor/simple-tailwind-ui";
```

---

### Button

```tsx
<Button color="primary" variant="solid" size="md">
  Click me
</Button>

<Button color="success" icon={Save} iconPosition="right" isLoading>
  Saving…
</Button>

<Button color="danger" variant="outline" disabled>
  Delete
</Button>
```

**Props:** `color` (primary | secondary | success | danger | warning | neutral), `variant` (solid | outline | ghost | link), `size` (xs | sm | md | lg | xl), `icon`, `iconPosition` (left | right | only), `isLoading`, `fullWidth`, `disabled`

---

### Input

```tsx
<Input title="Search" icon={Search} iconPosition="left" placeholder="Search…" />
<Input title="Email" variant="subtle" loading />
```

**Props:** `title`, `variant` (default | subtle | strong), `size` (sm | md | lg | full), `icon`, `iconPosition` (left | right), `loading`, `disabled`, `fullWidth`, `placeholder`, `value`, `onChange`

---

### Dropdown

```tsx
<Dropdown
  title="Language"
  options={[{ value: "de", label: "Deutsch" }, { value: "en", label: "English" }]}
  value={val}
  onChange={e => setVal(e.target.value)}
/>
```

**Props:** `title`, `options`, `variant` (default | subtle | strong), `size` (sm | md | lg | full), `icon`, `loading`, `disabled`, `fullWidth`, `value`, `onChange`

---

### ComboBox

```tsx
const options = [
  { value: "de", label: "Deutsch" },
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
];

<ComboBox title="Language" options={options} />
<ComboBox title="Tags" options={options} multiple maxVisible={2} />
```

**Props:** `title`, `options`, `multiple`, `maxVisible`, `variant`, `icon`, `loading`, `disabled`, `fullWidth`, `value`, `onChange`

---

### DatePicker

```tsx
<DatePicker title="Date" displayFormat="de" outputFormat="date" onChange={val => console.log(val)} />
<DatePicker title="Range" minDate={new Date()} maxDate={new Date(2025, 11, 31)} />
```

**Props:** `title`, `displayFormat` (de | us | iso | long), `outputFormat` (date | iso | de | us | timestamp), `minDate`, `maxDate`, `variant`, `icon`, `loading`, `disabled`, `fullWidth`, `onChange`

---

### Card

```tsx
<Card title="My Card" variant="elevated" size="lg">
  <p>Card content</p>
</Card>
```

**Props:** `title`, `variant` (default | elevated | outlined | ghost), `size` (sm | md | lg), `fullWidth`, `className`, `children`

---

### TitelBorder

```tsx
<TitelBorder title="Group" variant="subtle">
  <Input title="Name" placeholder="Enter name" />
</TitelBorder>
```

**Props:** `title`, `variant` (default | subtle | strong), `size` (sm | md | lg), `fullWidth`, `className`, `children`

---

### NavigationBar

```tsx
const items = [
  { id: "home",      label: "Home",      icon: Home },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "settings",  label: "Settings",  icon: Settings },
];

const [active, setActive] = useState("home");

<NavigationBar
  items={items}
  activeId={active}
  onSelect={setActive}
  indicator="gradient-line"
  fullWidth
  sticky
/>
```

**Custom colors & indicator:**

```tsx
<NavigationBar
  items={items}
  activeId={active}
  onSelect={setActive}
  indicatorGradient="from-rose-500 to-pink-600"
  indicatorLineSize="1"
  activeTextColor="text-rose-600 dark:text-rose-400"
  inactiveTextColor="text-zinc-400 dark:text-zinc-500"
  activeFontWeight="font-semibold"
/>
```

**Vertical with trailing slot:**

```tsx
<NavigationBar
  items={items}
  activeId={active}
  onSelect={setActive}
  orientation="vertical"
  indicator="pill"
  trailing={<Bell className="w-4 h-4" />}
  trailingClassName="mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-800"
/>
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `NavBarItem[]` | — | Array of nav items (`id`, `label?`, `icon?`, `href?`, `node?`, `disabled?`) |
| `activeId` | `string` | — | ID of the active item |
| `onSelect` | `(id: string) => void` | — | Callback when an item is clicked |
| `orientation` | `horizontal \| vertical` | `horizontal` | Bar orientation |
| `indicator` | `gradient-line \| pill \| dot \| none` | `gradient-line` | Active indicator style |
| `size` | `sm \| md \| lg` | `md` | Item size |
| `variant` | `default \| subtle \| strong` | `default` | Border and background style |
| `logo` | `ReactNode` | — | Optional logo on the left |
| `trailing` | `ReactNode` | — | Content at the right / bottom end |
| `trailingClassName` | `string` | — | Extra classes for the trailing wrapper |
| `indicatorGradient` | `string` | `from-indigo-500 to-violet-600` | Tailwind gradient classes for the indicator |
| `indicatorLineSize` | `px \| 0.5 \| 1 \| 1.5 \| 2` | `0.5` | gradient-line thickness |
| `dotSize` | `sm \| md \| lg` | `md` | dot indicator size |
| `activeTextColor` | `string` | `text-zinc-900 dark:text-zinc-100` | Text color of the active item |
| `inactiveTextColor` | `string` | `text-zinc-500 dark:text-zinc-400` | Text color of inactive items |
| `activeFontWeight` | `string` | `font-medium` | Font weight class for the active item |
| `height` | `string` | — | Custom bar height as CSS value (e.g. `"56px"`, `"4rem"`) — overrides `size` |
| `background` | `string` | — | Tailwind class or CSS for background |
| `fullWidth` | `boolean` | `false` | Bar takes full width |
| `sticky` | `boolean` | `false` | Sticks at top while scrolling |

---

### Accordion

```tsx
<Accordion title="Details" variant="subtle">
  <p>Hidden content revealed on click.</p>
</Accordion>

<Accordion title="Open by default" defaultOpen icon={ChevronRight}>
  <p>Content visible initially.</p>
</Accordion>
```

**Props:** `title`, `defaultOpen`, `open`, `onToggle`, `icon`, `size` (sm | md | lg), `variant` (default | subtle | strong), `loading`, `disabled`, `fullWidth`, `children`

---

### Tabelle

```tsx
type Row = { id: number; name: string; city: string };

const columns: TabelleColumn<Row>[] = [
  { key: "name", header: "Name", sortable: true },
  { key: "city", header: "City", sortable: true },
];

<Tabelle
  data={rows}
  columns={columns}
  rowKey="id"
  pagination
  pageSize={10}
  striped
/>
```

**With row selection and scroll:**

```tsx
<Tabelle
  data={rows}
  columns={columns}
  rowKey="id"
  scrollable
  maxHeight="400px"
  selectable
  multiSelect
  onSelectionChange={keys => console.log(keys)}
/>
```

**Props:** `data`, `columns`, `rowKey`, `variant`, `scrollable`, `maxHeight`, `pagination`, `pageSize`, `pageSizeOptions`, `selectable`, `multiSelect`, `selectedKeys`, `onSelectionChange`, `striped`, `loading`, `emptyLabel`

---

### Modal

```tsx
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open Modal</Button>

<Modal open={open} onClose={() => setOpen(false)} title="Example" size="md">
  <p>Modal content scrolls automatically when it overflows.</p>
</Modal>
```

**Props:** `open`, `onClose`, `title`, `size` (sm | md | lg | full), `variant` (default | subtle | strong), `showCloseButton`, `className`, `children`

---

### Toast

```tsx
// 1. Wrap your app root (required for portals):
<ToastProvider>
  <App />
</ToastProvider>

// 2. Use the hook anywhere inside:
const { show } = useToast();

show("Saved!", { type: "success" });
show("Something went wrong.", { type: "error", duration: 5000 });
show("Persists until dismissed.", { duration: 0 });
show("Custom icon.", { type: "info", icon: Bell });
```

**`show(message, options?)` options:** `type` (info | success | warning | error), `duration` (ms, `0` = persistent), `icon` (LucideIcon)

---

### Tabs

```tsx
const items = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "profile",  label: "Profile",  icon: User, disabled: true },
];

<Tabs items={items} defaultActiveId="overview" size="full">
  <TabPanel id="overview"><p>Overview content</p></TabPanel>
  <TabPanel id="settings"><p>Settings content</p></TabPanel>
  <TabPanel id="profile"><p>Profile content</p></TabPanel>
</Tabs>
```

**Props:** `items`, `activeId`, `defaultActiveId`, `onChange`, `size` (sm | md | lg), `variant` (default | subtle | strong), `orientation` (horizontal | vertical), `fullWidth`, `children`

---

### Badge

```tsx
<Badge color="success" dot>Online</Badge>
<Badge color="info" icon={Tag}>New</Badge>
<Badge color="warning" variant="strong" size="lg">Pending</Badge>
<Badge color="error" variant="subtle">Failed</Badge>
```

**Props:** `color` (neutral | info | success | warning | error), `variant` (default | subtle | strong), `size` (sm | md | lg), `icon`, `iconPosition` (left | right), `dot`, `fullWidth`, `className`, `children`

---

### Changelog

Displays a small info button that opens a scrollable modal with a Markdown changelog loaded from a URL.

```tsx
import { Changelog } from "@levin-the-doctor/simple-tailwind-ui";

<Changelog
  program="MyApp"
  version="v2.3.0"
  date="09.06.2026"
  path="/CHANGELOG.md"
/>
```

**Props:** `program`, `version`, `date`, `path` (URL path to the Markdown file, e.g. `/CHANGELOG.md`)

> The file is fetched at runtime via the browser's `fetch` API — serve it as a public asset in your Vite/CRA project.

---

## Dark Mode

All components support dark mode via Tailwind's `dark:` variant. Toggle the `dark` class on `document.documentElement`:

```tsx
useEffect(() => {
  document.documentElement.classList.toggle("dark", isDark);
}, [isDark]);
```

> **Note:** This is required when using `Modal` or `Toast` — they render via React portals outside your root div.

Alternatively, use the `dark` class on a wrapping div if you don't use portals:

```tsx
<div className={isDark ? "dark" : ""}>
  {/* your app */}
</div>
```

---

## Local Development

```bash
git clone https://github.com/LevinTheDoctor/simple-tailwind-ui.git
cd simple-tailwind-ui
npm install
npm run dev        # start dev server with live docs
npm run build:lib  # build the npm package to lib/
```

---

## Tech Stack

- **React 19** — UI framework
- **TypeScript** — Type safety
- **Tailwind CSS v4** — Utility-first styling
- **Vite** — Build tool and dev server
- **lucide-react** — Icon library
- **react-markdown** — Markdown rendering (Changelog component)
- **tsup** — Library bundler (ESM + CJS)
