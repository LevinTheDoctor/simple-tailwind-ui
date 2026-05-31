# SimpleTailwindUI

A handcrafted React + Tailwind CSS component library — clean, accessible, and dark-mode ready. Built with TypeScript and Vite.

## Components

| Component | Description |
| --- | --- |
| `Button` | Colors, variants (solid / outline / ghost), sizes, icon support, loading state |
| `Input` | Text field with icon, loading state, TitelBorder wrapper |
| `Dropdown` | Select with custom chevron, icon support, TitelBorder wrapper |
| `ComboBox` | Searchable select — single or multi, optional visible limit |
| `DatePicker` | Calendar with configurable display and output format |
| `Card` | Container with visual styles (default / elevated / outlined / ghost) |
| `TitelBorder` | Fieldset container with legend title for grouping content |
| `NavigationBar` | Horizontal or vertical nav bar with logo, indicators, and React nodes |
| `Accordion` | Expandable content area with animated height transition |
| `Tabelle` | Generic data table — sort, paginate, scroll, row selection |
| `Modal` | Dialog overlay with backdrop, Escape key and portal rendering |
| `Toast` | Notification system with provider, hook and auto-dismiss |
| `Tabs` | Tab navigation with active indicator — horizontal or vertical |
| `Badge` | Inline label with color scheme, variants, icon and dot support |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- **React 19** — UI framework
- **TypeScript** — Type safety
- **Tailwind CSS v4** — Utility-first styling
- **Vite** — Build tool and dev server
- **lucide-react** — Icon library

## Usage

Import any component directly from its file:

```tsx
import { Button } from "./Components/Button";
import { Input } from "./Components/Input";
import { Card } from "./Components/Card";
import { Dropdown } from "./Components/DropDown";
import { ComboBox } from "./Components/ComboBox";
import { DatePicker } from "./Components/Datepicker";
import { TitelBorder } from "./Components/TitelBorder";
import { NavigationBar } from "./Components/NavigationBar";
import { Accordion } from "./Components/Accordion";
import { Tabelle } from "./Components/Tabelle";
import { Modal } from "./Components/Modal";
import { ToastProvider, useToast } from "./Components/Toast";
import { Tabs, TabPanel } from "./Components/Tabs";
import { Badge } from "./Components/Badge";
```

### Button

```tsx
<Button color="primary" variant="solid" size="md">
  Click me
</Button>

<Button color="success" icon={Save} iconPosition="right" isLoading>
  Saving…
</Button>
```

### Input

```tsx
<Input title="Search" icon={Search} iconPosition="left" placeholder="Search…" />
```

### ComboBox

```tsx
const options = [
  { value: "de", label: "Deutsch" },
  { value: "en", label: "English" },
];

<ComboBox title="Language" options={options} multiple maxVisible={2} />
```

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

### Modal

```tsx
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open Modal</Button>

<Modal open={open} onClose={() => setOpen(false)} title="Example" size="md">
  <p>Modal content…</p>
</Modal>
```

### Toast

```tsx
// 1. Wrap your app root:
<ToastProvider>
  <App />
</ToastProvider>

// 2. Use the hook anywhere inside:
const { show } = useToast();

show("Saved!", { type: "success" });
show("Something went wrong.", { type: "error", duration: 5000 });
show("Persists until dismissed.", { duration: 0 });
```

### Tabs

```tsx
const items = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "settings", label: "Settings", icon: Settings },
];

<Tabs items={items} size="full">
  <TabPanel id="overview"><p>Overview content</p></TabPanel>
  <TabPanel id="settings"><p>Settings content</p></TabPanel>
</Tabs>
```

### Badge

```tsx
<Badge color="success" dot>Online</Badge>
<Badge color="info" icon={Tag} iconPosition="left">New</Badge>
<Badge color="warning" variant="strong" size="lg">Pending</Badge>
```

## Live Documentation

Run `npm run dev` and open the app — the built-in documentation page shows every component with live previews, code examples, and full props reference. Toggle between light/dark mode and DE/EN language at any time.

## Dark Mode

All components support dark mode via Tailwind's `dark:` variant. Wrap your root element with the `dark` class to enable it:

```tsx
<div className={isDark ? "dark" : ""}>
  {/* your app */}
</div>
```

## Roadmap

- [ ] Publish as npm package
- [ ] Storybook integration
- [ ] Accessibility (ARIA) improvements
