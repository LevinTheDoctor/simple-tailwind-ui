# Component Creation Rules

Konventionen für neue Komponenten in diesem Projekt.
Alle bestehenden Komponenten (Card, Button, Input, Dropdown, ComboBox, DatePicker, TitelBorder)
folgen diesen Regeln — neue Komponenten müssen sich daran halten.

---

## 1. Dateistruktur

```
src/Components/
  MeineKomponente.tsx   ← PascalCase, eine Komponente pro Datei
```

Einfache Komponenten direkt in `Components/`.
Zusammengehörige Gruppen in einem Unterordner `Components/MeineGruppe/`.

---

## 2. Props-Typen

Immer eigene Typen definieren, keine `any`. Props sind `readonly`.

```tsx
type MySize    = "sm" | "md" | "lg" | "full";
type MyVariant = "default" | "subtle" | "strong";

type MyComponentProps = {
  readonly title: string;           // Pflicht
  readonly size?: MySize;           // Optional mit Default
  readonly variant?: MyVariant;     // Optional mit Default
  readonly className?: string;      // Immer anbieten
  readonly children?: ReactNode;    // Falls Inhalt nötig
} & Omit<HTMLAttributes<HTMLDivElement>, "className" | "children">;
//  ↑ Native HTML-Attribute spreaden (passend zum Root-Element)
```

Für Panels (Dropdown, ComboBox, DatePicker) **kein** HTML-Spread — stattdessen
nur explizit benötigte Props wie `value`, `onChange`, `disabled`.

---

## 3. Size-System

Jede Komponente hat dieselben vier Größen:

| Key    | Bedeutung                        |
|--------|----------------------------------|
| `sm`   | Kompakt, kleine Fläche           |
| `md`   | Standard (immer der Default)     |
| `lg`   | Großzügig                        |
| `full` | Volle Breite (`w-full`)          |

Als Record-Map definieren, **nie** inline ternäre Ausdrücke:

```tsx
const sizeClasses: Record<MySize, string> = {
  sm:   "py-1 px-2 text-sm max-w-sm",
  md:   "py-2 px-3 text-sm max-w-md",
  lg:   "py-3 px-4 text-base max-w-lg",
  full: "py-2 px-3 text-sm w-full",
};
```

---

## 4. Variant-System

Drei visuelle Varianten, immer dieselben Namen:

| Key       | Bedeutung                        |
|-----------|----------------------------------|
| `default` | Standard mit leichtem Rahmen     |
| `subtle`  | Sehr dezent, fast unsichtbar     |
| `strong`  | Dickerer Rahmen, betont          |

```tsx
const variantClasses: Record<MyVariant, string> = {
  default: "border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900",
  subtle:  "border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800",
  strong:  "border-2 border-zinc-400 dark:border-zinc-500 bg-white dark:bg-zinc-900",
};
```

---

## 5. Dark Mode

**Immer** mit Tailwind `dark:`-Klassen umsetzen — nie mit `useContext` oder
manueller Klassenlogik. Der Dark Mode wird durch die `dark`-Klasse am
Root-`<div>` gesteuert (siehe `Demo.tsx`).

### Farbpalette

| Zweck                  | Light                      | Dark                        |
|------------------------|----------------------------|-----------------------------|
| Hintergrund Seite      | `bg-zinc-50`               | `dark:bg-zinc-950`          |
| Hintergrund Komponente | `bg-white`                 | `dark:bg-zinc-900`          |
| Hintergrund subtil     | `bg-zinc-50`               | `dark:bg-zinc-800`          |
| Rahmen Standard        | `border-zinc-300`          | `dark:border-zinc-700`      |
| Rahmen subtil          | `border-zinc-200`          | `dark:border-zinc-800`      |
| Text primär            | `text-zinc-900`            | `dark:text-zinc-100`        |
| Text sekundär          | `text-zinc-700`            | `dark:text-zinc-300`        |
| Text Muted / Labels    | `text-zinc-500`            | `dark:text-zinc-400`        |
| Text Placeholder       | `text-zinc-400`            | `dark:text-zinc-500`        |
| Hover-Fläche           | `hover:bg-zinc-100`        | `dark:hover:bg-zinc-800`    |
| Focus-Ring             | `ring-zinc-400`            | `dark:ring-zinc-500`        |

Niemals `text-black` / `text-white` direkt — immer die Zinc-Abstufungen.

---

## 6. TitelBorder als Wrapper

Alle Formular-Komponenten (Input, Dropdown, ComboBox, DatePicker) werden in
`<TitelBorder>` gewrappt. Der `title`-Prop der Komponente wird als
`title`-Prop an `TitelBorder` weitergegeben. `size` und `variant` ebenfalls.

```tsx
return (
  <TitelBorder title={title} size={size} variant={variant} className={className}>
    {/* eigener Inhalt */}
  </TitelBorder>
);
```

---

## 7. Icon-System

Icons kommen aus `lucide-react`. Der Typ ist `LucideIcon`.

```tsx
import { type LucideIcon } from "lucide-react";

type MyProps = {
  readonly icon?: LucideIcon;
};

// Verwendung im JSX:
const { icon: Icon } = props;
// ...
{Icon && <Icon className="w-4 h-4" />}
```

Ikongrößen als Record pro Size definieren:

```tsx
const iconSizeClasses: Record<MySize, string> = {
  sm:   "w-3.5 h-3.5",
  md:   "w-4 h-4",
  lg:   "w-5 h-5",
  full: "w-4 h-4",
};
```

---

## 8. Loading & Disabled

Jede interaktive Komponente bekommt `loading` und `disabled`:

```tsx
import { Loader2 } from "lucide-react";

const ActiveIcon = loading ? Loader2 : Icon;
// ...
<ActiveIcon className={`... ${loading ? "animate-spin" : ""}`} />
```

Disabled-Stil immer via Tailwind (nicht `pointer-events-none` allein):

```tsx
"disabled:opacity-50 disabled:cursor-not-allowed"
// oder bei <div>-basierten Komponenten:
isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
```

---

## 9. Panel-Komponenten (Dropdown, ComboBox, DatePicker)

Panels brauchen:

### Click-Outside schließen

```tsx
const containerRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const handler = (e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node))
      setOpen(false);
  };
  document.addEventListener("mousedown", handler);
  return () => document.removeEventListener("mousedown", handler);
}, []);
```

### Panel-Positionierung

```tsx
<div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl shadow-lg ...">
```

`z-50` damit das Panel über anderen Elementen liegt.

### Trigger-Chevron

Chevron dreht sich beim Öffnen:

```tsx
<ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
```

---

## 10. Klassen zusammenbauen

Nie Inline-Ternäre verschachteln. Immer Array + `.join(" ")`:

```tsx
const classes = [
  "rounded-lg transition-colors duration-200",
  sizeClasses[size],
  variantClasses[variant],
  isDisabled ? "opacity-50 cursor-not-allowed" : "",
  className,
].join(" ");
```

---

## 11. Kontrolliertes vs. unkontrolliertes Verhalten

Interner State als Source of Truth, `value`-Prop synchronisiert via `useEffect`:

```tsx
const [internalValue, setInternalValue] = useState(value ?? defaultValue);

useEffect(() => {
  if (value !== undefined) setInternalValue(value);
}, [value]);
```

`onChange` immer aufrufen wenn der interne Wert sich ändert.

---

## 12. Transitions

Immer `transition-colors duration-200` für Farb-Übergänge.
Für Transforms: `transition-transform duration-200`.
Kein `duration-300` oder höher — wirkt träge.
