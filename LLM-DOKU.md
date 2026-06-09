---
description: Build React UI with SimpleTailwindUI — @levin-the-doctor/simple-tailwind-ui component library (v1.5.1)
---

You are helping the user build React UIs using the **SimpleTailwindUI** component library (`@levin-the-doctor/simple-tailwind-ui`) — a handcrafted React + Tailwind CSS component library with dark-mode support and full TypeScript types.

This document matches **v1.5.1** of the library and is generated from the actual TypeScript definitions.

## Setup

```bash
npm install @levin-the-doctor/simple-tailwind-ui
npm install react react-dom lucide-react tailwindcss react-markdown
```

In your CSS entry file:
```css
@import "tailwindcss";
```

## Importing components

All components are imported from the package root:
```tsx
import { Button, Card, Input, Modal } from "@levin-the-doctor/simple-tailwind-ui"
```

## General conventions

- Labels are always passed as **`title`** (not `label`).
- Icons are **Lucide icon components** passed as a reference, e.g. `icon={Search}` — never as JSX (`icon={<Search />}` is wrong).
- Sizes are usually `sm | md | lg | full` (Button: `xs–xl`, Badge/Tabs nav: `sm–lg`).
- Visual style is `variant`: `default | subtle | strong` (Card: `default | elevated | outlined | ghost`).
- Most components accept `fullWidth` and `className`.

---

## Components

### Button
`variant`: solid | outline | ghost (default: solid)
`color`: primary | secondary | success | danger | warning | neutral (default: primary)
`size`: xs | sm | md | lg | xl (default: md)
`icon` (LucideIcon), `iconPosition`: left | right | only (default: left)
`isLoading`, `fullWidth`, plus all native button attributes (`disabled`, `onClick`, `title`, `type`, …)

```tsx
<Button color="primary">Save</Button>
<Button variant="outline" color="neutral" size="sm">Cancel</Button>
<Button color="danger" isLoading>Deleting…</Button>
<Button variant="ghost" color="primary" icon={Plus}>Add item</Button>
<Button icon={Bell} iconPosition="only" title="Notify me" onClick={onNotify} />
```

Note: the loading prop is **`isLoading`** (not `loading`); there is **no** `link` variant and **no** `leftIcon`/`rightIcon` — use `icon` + `iconPosition`.

---

### Card
`title?`, `variant`: default | elevated | outlined | ghost, `size`: sm | md | lg | full
`fullWidth`, `className`

```tsx
<Card title="Overview" variant="elevated" size="md">
  <p>Card content here.</p>
</Card>
<Card variant="outlined" fullWidth title="Filter">…</Card>
```

---

### Input
`title` (required), `size`: sm | md | lg | full, `variant`: default | subtle | strong
`icon` (LucideIcon), `iconPosition`: left | right | only, `loading`, `fullWidth`, `className`
Plus all native input attributes: `placeholder`, `value`, `onChange` (native event!), `disabled`, `type`, …

```tsx
<Input title="Email" placeholder="you@example.com" icon={Mail} />
<Input title="Search" value={q} onChange={e => setQ(e.target.value)} loading />
```

Note: `onChange` is the **native input event** — read the text via `e.target.value`.

---

### Dropdown
`title` (required), `options` (`{value, label}[]`), `value?`, `onChange?: (value: string) => void`
`size`, `variant`, `icon` (LucideIcon), `loading`, `disabled`, `fullWidth`, `placeholder`, `className`

```tsx
<Dropdown
  title="Status"
  options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]}
  value={status}
  onChange={setStatus}
/>
```

Note: `onChange` receives the **value string directly** (not an event).

---

### ComboBox
Searchable select — single or multi.
`title` (required), `options` (`{value, label}[]`), `maxVisible`, `placeholder`
`size`, `variant`, `icon` (LucideIcon), `loading`, `disabled`, `fullWidth`, `className`

Single select (default): `value?: string`, `onChange?: (value: string) => void`
Multi select (`multiple`): `value?: string[]`, `onChange?: (value: string[]) => void`

```tsx
<ComboBox title="Country" options={countries} value={country} onChange={setCountry} />
<ComboBox title="Tags" options={opts} multiple value={selected} onChange={setSelected} />
<ComboBox title="Niederlassung" icon={House} variant="subtle" size="sm" multiple
          options={options} value={ids} onChange={setIds} loading={isLoading} />
```

Note: both modes use **`value`** (the prop `values` does not exist); the multi flag is **`multiple`** (not `multi`).

---

### DatePicker

| Prop | Typ | Default | Beschreibung |
|---|---|---|---|
| `title` | `string` | — | Label / Feldbezeichnung (required) |
| `size` | `"sm" \| "md" \| "lg" \| "full"` | `"md"` | Größe des Triggers |
| `variant` | `"default" \| "subtle" \| "strong"` | `"default"` | Visueller Stil |
| `icon` | `LucideIcon` | `Calendar` | Eigenes Icon links im Trigger |
| `loading` | `boolean` | `false` | Zeigt Lade-Spinner, blockiert Interaktion |
| `disabled` | `boolean` | `false` | Deaktiviert den Picker |
| `fullWidth` | `boolean` | `false` | Volle Breite des Containers |
| `value` | `Date \| string \| number \| null` | — | Kontrollierter Wert |
| `onChange` | `(v: Date \| string \| number) => void` | — | Callback bei Datumsauswahl |
| `displayFormat` | `"de" \| "us" \| "iso" \| "long"` | `"de"` | Vordefiniertes Anzeigeformat im Trigger |
| `customDisplayFormat` | `string` | — | Freies Anzeigeformat, überschreibt `displayFormat`. Tokens: `DD` `MM` `YYYY` `D` `M` |
| `outputFormat` | `"date" \| "iso" \| "de" \| "us" \| "timestamp"` | `"date"` | Vordefiniertes Format für `onChange` |
| `customOutputFormat` | `string` | — | Freies Ausgabeformat, überschreibt `outputFormat`. Gleiche Tokens wie `customDisplayFormat` |
| `minDate` | `Date` | — | Frühestes wählbares Datum |
| `maxDate` | `Date` | — | Spätestes wählbares Datum |
| `placeholder` | `string` | `"Datum waehlen..."` | Platzhaltertext wenn kein Datum gewählt |
| `className` | `string` | `""` | Zusätzliche CSS-Klassen |

```tsx
// Standard
<DatePicker title="Startdatum" value={date} onChange={setDate} />

// Vordefinierte Formate
<DatePicker title="Datum" displayFormat="long" outputFormat="iso" value={date} onChange={setDate} />

// Eigene Formate
<DatePicker
  title="Datum"
  customDisplayFormat="DD.MM.YYYY"
  customOutputFormat="YYYY/MM/DD"
  value={date}
  onChange={setDate}
/>
```

---

### TitelBorder
Groups form elements inside a labelled fieldset border.
`title` (required), `size`: sm | md | lg | full, `variant`: default | subtle | strong, `fullWidth`, `className`

```tsx
<TitelBorder title="Personal Information" size="lg" variant="strong">
  <Input title="First name" />
  <Input title="Last name" />
</TitelBorder>
```

---

### NavigationBar
`items` (`{id, label?, icon?, href?, node?, disabled?}[]`), `activeId`, `onSelect: (id: string) => void`
`orientation`: horizontal | vertical, `indicator`: gradient-line | pill | dot | none
`size`: sm | md | lg, `variant`: default | subtle | strong
`logo` (ReactNode), `trailing` (ReactNode), `trailingClassName`
`indicatorGradient` (Tailwind-Klassen), `indicatorLineSize`: px | 0.5 | 1 | 1.5 | 2, `dotSize`
`activeTextColor`, `inactiveTextColor`, `activeFontWeight` (Tailwind-Klassen)
`height` (CSS-Wert oder Tailwind-Klasse), `background`, `fullWidth`, `sticky`, `className`

```tsx
const items = [
  { id: "home",     label: "Home",     icon: Home },
  { id: "settings", label: "Settings", icon: Settings },
];

<NavigationBar items={items} activeId={active} onSelect={setActive} indicator="pill" />

<NavigationBar
  items={items}
  activeId={active}
  onSelect={setActive}
  indicator="gradient-line"
  indicatorGradient="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900"
  logo={<img src="/logo.svg" className="h-8" />}
  size="lg"
  fullWidth
  sticky
  trailing={<UserMenu />}
/>
```

---

### Accordion
`title` (required), `defaultOpen`, `open` (kontrolliert), `onToggle: (open: boolean) => void`
`icon` (LucideIcon, ersetzt den Chevron), `size`: sm | md | lg | full, `variant`: default | subtle | strong
`loading`, `disabled`, `fullWidth`, `className`

```tsx
<Accordion title="Details" defaultOpen>
  <p>Expanded content here.</p>
</Accordion>
<Accordion title="Advanced" icon={Settings} size="full">
  <p>More options.</p>
</Accordion>
```

---

### Tabelle (Data Table)
`data` (required), `columns` (required, `{key: keyof T, header, render?: (value, row) => ReactNode, sortable?, width?}[]`)
`rowKey` (**required** — Feld mit eindeutigem Wert pro Zeile!)
`title`, `size`, `variant`: default | subtle | strong
`scrollable`, `maxHeight`, `pagination`, `pageSize`, `pageSizeOptions`
`selectable`, `multiSelect`, `selectedKeys`, `onSelectionChange: (keys: (string|number)[]) => void`
`striped`, `loading`, `emptyLabel`, `className`

```tsx
const columns = [
  { key: "name",  header: "Name",  sortable: true },
  { key: "email", header: "Email" },
  { key: "role",  header: "Role",  render: (v) => <Badge color="info">{v as string}</Badge> },
];

<Tabelle
  columns={columns}
  data={rows}
  rowKey="id"
  scrollable
  maxHeight="400px"
  pagination
  pageSize={10}
  loading={isLoading}
  emptyLabel="Keine Daten verfügbar."
/>
```

Note: `rowKey` is required and must reference a unique field — duplicate keys break selection and rendering.

---

### Modal
`open` (required), `onClose` (required), `title?`, `size`: sm | md | lg | full
`variant`: default | subtle | strong, `showCloseButton` (default: true), `className`

```tsx
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open</Button>

<Modal open={open} onClose={() => setOpen(false)} title="Confirm action" size="sm">
  <p>Are you sure you want to delete this item?</p>
  <div className="flex gap-2 mt-4">
    <Button color="danger" onClick={() => setOpen(false)}>Delete</Button>
    <Button variant="outline" color="neutral" onClick={() => setOpen(false)}>Cancel</Button>
  </div>
</Modal>
```

Note: there is **no** `xl` size — the largest is `full`.

---

### Toast
Wrap your app with `<ToastProvider>`, then use the `useToast()` hook anywhere inside.

```tsx
// In your root component:
<ToastProvider>
  <App />
</ToastProvider>

// Anywhere inside:
const { show } = useToast();

show("Saved successfully!", { type: "success" });
show("Something went wrong.", { type: "error" });
show("Heads up.", { type: "warning", duration: 5000 });
show("FYI.", { type: "info", duration: 0 }); // duration: 0 = stays until closed
show("Custom icon.", { type: "info", icon: Bell });
```

`show(message, options?)` options: `type`: info | success | warning | error (default: info), `duration` (ms, `0` = persistent), `icon` (LucideIcon)

---

### Tabs
`items` (`{id, label, icon?, disabled?}[]`), `activeId` (kontrolliert), `defaultActiveId`, `onChange: (id: string) => void`
`size`: sm | md | lg | full, `variant`: default | subtle | strong, `orientation`: horizontal | vertical, `fullWidth`, `className`

```tsx
const tabs = [
  { id: "overview",  label: "Overview",  icon: LayoutDashboard },
  { id: "settings",  label: "Settings",  icon: Settings },
];

<Tabs items={tabs} defaultActiveId="overview" size="full">
  <TabPanel id="overview"><p>Overview content</p></TabPanel>
  <TabPanel id="settings"><p>Settings content</p></TabPanel>
</Tabs>
```

---

### Badge
Content goes in **`children`** (there is no `label` prop).
`color`: neutral | info | success | warning | error (default: neutral)
`variant`: default | subtle | strong, `size`: sm | md | lg
`icon` (LucideIcon), `iconPosition`: left | right, `dot`, `fullWidth`, `className`

```tsx
<Badge color="info" dot>New</Badge>
<Badge color="error" variant="strong">Error</Badge>
<Badge color="success" variant="subtle" icon={CheckCircle}>Success</Badge>
```

Note: colors are **info/error** (not primary/danger) and variants are **default/subtle/strong** (not solid/outline).

---

### Changelog
Displays an info button that opens a modal with a rendered Markdown changelog.
`program`, `version`, `date`, `path` (URL to your `CHANGELOG.md` in `/public`) — all required.

Requires `react-markdown` as a peer dependency. The file is fetched at runtime, so it **must exist** as a public asset.

```tsx
// Place CHANGELOG.md in your /public folder, then:
<Changelog program="MyApp" version="1.1.0" date="09.06.2026" path="/CHANGELOG.md" />
```

---

## Tips

- All components support **dark mode** out of the box via the `dark` class on `<html>`.
- Icons come from `lucide-react` — pass the icon **component reference** (`icon={Mail}`), never JSX.
- Use `TitelBorder` to group related `Input` / `Dropdown` / `DatePicker` fields visually.
- Mount `ToastProvider` once at the app root so `useToast()` is available everywhere.
- `Tabelle` needs a `rowKey` with unique values — build a synthetic key if your data has none.
