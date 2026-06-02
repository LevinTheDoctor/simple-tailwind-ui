import { useState, useEffect, type ReactNode } from "react";
import { Card } from "../Components/Card";
import { Button } from "../Components/Button";
import { Input } from "../Components/Input";
import { Dropdown } from "../Components/DropDown";
import { ComboBox } from "../Components/ComboBox";
import { DatePicker } from "../Components/Datepicker";
import { TitelBorder } from "../Components/TitelBorder";
import {
  NavigationBar,
  type NavBarItem,
  type NavBarIndicator,
  type NavBarOrientation,
} from "../Components/NavigationBar";
import { Accordion } from "../Components/Accordion";
import { Tabelle, type TabelleColumn } from "../Components/Tabelle";
import { Modal } from "../Components/Modal";
import { ToastProvider, useToast } from "../Components/Toast";
import { Tabs, TabPanel } from "../Components/Tabs";
import { Badge } from "../Components/Badge";
import { Changelog } from "../Components/Changelog";
import {
  Search, Mail, Globe, Trash2, Plus, Save, User, Copy, Check,
  Home, LayoutDashboard, BarChart3, Settings, Bell, MoreHorizontal,
  Tag, Star, AlertCircle, ShieldCheck, Zap,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Lang = "de" | "en";

type PropRowBase = {
  id:      number;
  prop:    string;
  type:    string;
  dflt:    string;
  desc_de: string;
  desc_en: string;
};

type PropRow = {
  id:          number;
  prop:        string;
  type:        string;
  dflt:        string;
  description: string;
};

// ── Translations ──────────────────────────────────────────────────────────────

const S = {
  de: {
    uiTitle:  "SimpleTailwindUI",
    uiSub:    "Komponentenbibliothek",
    intro:    "Alle Komponenten live vorschaubar — mit Codebeispielen und Props-Referenz.",
    dark:     "Dark Mode",
    light:    "Hell",
    nav:      "Komponenten",
    allProps: "Alle Props",
    prop:     "Prop",
    type:     "Typ",
    dflt:     "Standard",
    desc:     "Beschreibung",
    sections: {
      install:       { title: "Installation",  desc: "Paket installieren und in wenigen Schritten einrichten." },
      card:          { title: "Card",          desc: "Container mit verschiedenen visuellen Stilen und Größen." },
      button:        { title: "Button",        desc: "Interaktiver Button mit Farben, Varianten, Icons und Loading-State." },
      input:         { title: "Input",         desc: "Textfeld mit Icon, Loading-State und TitelBorder-Wrapper." },
      dropdown:      { title: "Dropdown",      desc: "Select mit eigenem Chevron, Icon-Support und TitelBorder-Wrapper." },
      combobox:      { title: "ComboBox",      desc: "Durchsuchbares Auswahlfeld — single oder multi, mit optionalem Limit." },
      datepicker:    { title: "DatePicker",    desc: "Kalender-Komponente mit konfigurierbarem Anzeige- und Ausgabeformat." },
      titelborder:   { title: "TitelBorder",   desc: "Fieldset-Container mit Legend-Titel für das Gruppieren beliebiger Inhalte." },
      navigationbar: { title: "NavigationBar", desc: "Flexible Navigationsleiste — horizontal oder vertikal, mit Logo und React-Nodes." },
      accordion:     { title: "Accordion",     desc: "Aufklappbarer Inhaltsbereich mit animierter Höhen-Transition und Dark-Mode-Support." },
      tabelle:       { title: "Tabelle",       desc: "Generische Datentabelle — sortieren, paginieren, scrollen, Zeilen auswählen." },
      modal:         { title: "Modal",         desc: "Dialog-Overlay mit Backdrop, Escape-Taste und Portal-Rendering." },
      toast:         { title: "Toast",         desc: "Benachrichtigungssystem mit Provider, Hook und automatischem Ausblenden." },
      tabs:          { title: "Tabs",          desc: "Tab-Navigation mit aktivem Indigo-Indikator — horizontal oder vertikal." },
      badge:         { title: "Badge",         desc: "Inline-Label mit Farbschema, Varianten, Icon- und Dot-Support." },
      changelog:     { title: "Changelog",     desc: "Info-Button der ein Modal mit Markdown-Changelog öffnet — lädt die Datei per Fetch." },
    },
    ex: {
      variants:    "Varianten",
      sizes:       "Größen",
      states:      "Zustände",
      colors:      "Farben",
      icons:       "Icons & Loading",
      std:         "Standard",
      withIcon:    "Mit Icon",
      multi:       "Multi-Select mit Alle-Button",
      maxVis:      "maxVisible — begrenzte Anzeige",
      dispFmt:     "Anzeigeformate",
      outFmt:      "Ausgabeformate (outputFormat)",
      minMax:      "Mit minDate / maxDate",
      content:     "Beliebiger Inhalt",
      horiz:       "Grundlegend (horizontal, gradient-line)",
      vert:        "Vertikal",
      full:        "fullWidth — volle Breite",
      sticky:      "sticky — klebt am oberen Rand beim Scrollen",
      inds:        "Indikatoren — gradient-line / pill / dot / none",
      logo:        "Mit Logo",
      node:        "React Node — beliebige JSX als Nav-Item",
      bg:          "Hintergrund — eigener Gradient",
      trail:       "Trailing — Inhalt am Ende",
      dis:         "Deaktivierte Items",
      defOpen:     "defaultOpen — standardmäßig geöffnet",
      custIcon:    "Eigenes Icon (ersetzt ChevronDown)",
      ldDis:       "Zustände — loading / disabled",
      scroll:      "Scrollable — fixierte Höhe, klebender Header",
      page:        "Pagination — Seitennavigation & Seitengröße wählbar",
      rowSel:      "Zeilenauswahl — multiSelect mit Header-Checkbox",
      strip:       "Striped & Sortierbar — abwechselnde Zeilen",
      load:        "Loading-State",
      empty:       "Leerer Zustand",
      modalOpen:   "Öffnen / Schließen",
      modalSizes:  "Größen",
      modalVar:    "Varianten",
      toastTypes:  "Typen — info / success / warning / error",
      toastDur:    "Dauer & Persist (duration: 0)",
      tabsHoriz:   "Horizontal (Standard)",
      tabsVert:    "Vertikal",
      tabsVar:     "Varianten",
      tabsDis:     "Deaktivierte Tabs",
      badgeColors: "Farben",
      badgeVar:    "Varianten",
      badgeSizes:  "Größen",
      badgeDot:    "Dot-Indikator",
      badgeIcon:   "Mit Icon",
      changelogStd: "Standard",
    },
  },
  en: {
    uiTitle:  "SimpleTailwindUI",
    uiSub:    "Component Library",
    intro:    "All components with live previews, code examples and complete props reference.",
    dark:     "Dark Mode",
    light:    "Light",
    nav:      "Components",
    allProps: "All Props",
    prop:     "Prop",
    type:     "Type",
    dflt:     "Default",
    desc:     "Description",
    sections: {
      install:       { title: "Installation",  desc: "Install the package and get started in a few steps." },
      card:          { title: "Card",          desc: "Container with various visual styles and sizes." },
      button:        { title: "Button",        desc: "Interactive button with colors, variants, icons and loading state." },
      input:         { title: "Input",         desc: "Text field with icon, loading state and TitelBorder wrapper." },
      dropdown:      { title: "Dropdown",      desc: "Select with custom chevron, icon support and TitelBorder wrapper." },
      combobox:      { title: "ComboBox",      desc: "Searchable select — single or multi, with optional visible limit." },
      datepicker:    { title: "DatePicker",    desc: "Calendar component with configurable display and output format." },
      titelborder:   { title: "TitelBorder",   desc: "Fieldset container with legend title for grouping arbitrary content." },
      navigationbar: { title: "NavigationBar", desc: "Flexible nav bar — horizontal or vertical, with logo and React nodes." },
      accordion:     { title: "Accordion",     desc: "Expandable content area with animated height transition and dark mode support." },
      tabelle:       { title: "Tabelle",       desc: "Generic data table — sort, paginate, scroll, select rows." },
      modal:         { title: "Modal",         desc: "Dialog overlay with backdrop, Escape key support and portal rendering." },
      toast:         { title: "Toast",         desc: "Notification system with provider, hook and auto-dismiss." },
      tabs:          { title: "Tabs",          desc: "Tab navigation with active indigo indicator — horizontal or vertical." },
      badge:         { title: "Badge",         desc: "Inline label with color scheme, variants, icon and dot support." },
      changelog:     { title: "Changelog",     desc: "Info button that opens a modal with a Markdown changelog — fetches the file on demand." },
    },
    ex: {
      variants:    "Variants",
      sizes:       "Sizes",
      states:      "States",
      colors:      "Colors",
      icons:       "Icons & Loading",
      std:         "Standard",
      withIcon:    "With Icon",
      multi:       "Multi-Select with Select-All",
      maxVis:      "maxVisible — limited display",
      dispFmt:     "Display Formats",
      outFmt:      "Output Formats (outputFormat)",
      minMax:      "With minDate / maxDate",
      content:     "Arbitrary Content",
      horiz:       "Basic (horizontal, gradient-line)",
      vert:        "Vertical",
      full:        "fullWidth — full width",
      sticky:      "sticky — sticks at top while scrolling",
      inds:        "Indicators — gradient-line / pill / dot / none",
      logo:        "With Logo",
      node:        "React Node — arbitrary JSX as Nav-Item",
      bg:          "Background — custom gradient",
      trail:       "Trailing — content at end",
      dis:         "Disabled Items",
      defOpen:     "defaultOpen — initially open",
      custIcon:    "Custom Icon (replaces ChevronDown)",
      ldDis:       "States — loading / disabled",
      scroll:      "Scrollable — fixed height, sticky header",
      page:        "Pagination — page navigation & page size",
      rowSel:      "Row Selection — multiSelect with header checkbox",
      strip:       "Striped & Sortable — alternating rows",
      load:        "Loading State",
      empty:       "Empty State",
      modalOpen:   "Open / Close",
      modalSizes:  "Sizes",
      modalVar:    "Variants",
      toastTypes:  "Types — info / success / warning / error",
      toastDur:    "Duration & Persist (duration: 0)",
      tabsHoriz:   "Horizontal (Default)",
      tabsVert:    "Vertical",
      tabsVar:     "Variants",
      tabsDis:     "Disabled Tabs",
      badgeColors: "Colors",
      badgeVar:    "Variants",
      badgeSizes:  "Sizes",
      badgeDot:    "Dot Indicator",
      badgeIcon:   "With Icon",
      changelogStd: "Standard",
    },
  },
} as const;

// ── Prop Table Data ───────────────────────────────────────────────────────────

const toRows = (lang: Lang, data: readonly PropRowBase[]): PropRow[] =>
  data.map(r => ({
    id:          r.id,
    prop:        r.prop,
    type:        r.type,
    dflt:        r.dflt,
    description: lang === "de" ? r.desc_de : r.desc_en,
  }));

const CARD_PROPS: readonly PropRowBase[] = [
  { id: 1, prop: "title",     type: "string",                                dflt: "—",         desc_de: "Überschrift der Card (optional)",              desc_en: "Card heading (optional)" },
  { id: 2, prop: "variant",   type: "default | elevated | outlined | ghost", dflt: '"default"', desc_de: "Visueller Stil der Card",                      desc_en: "Visual style of the card" },
  { id: 3, prop: "size",      type: "sm | md | lg",                          dflt: '"md"',      desc_de: "Innenabstand und Gesamtgröße",                 desc_en: "Padding and overall size" },
  { id: 4, prop: "className", type: "string",                                dflt: '""',        desc_de: "Zusätzliche Tailwind-Klassen",                 desc_en: "Additional Tailwind classes" },
  { id: 5, prop: "children",  type: "ReactNode",                             dflt: "—",         desc_de: "Inhalt der Card",                              desc_en: "Card content" },
];

const BUTTON_PROPS: readonly PropRowBase[] = [
  { id: 1, prop: "color",        type: "primary | secondary | success | danger | warning | neutral", dflt: '"primary"', desc_de: "Farbschema",                                     desc_en: "Color scheme" },
  { id: 2, prop: "variant",      type: "solid | outline | ghost",            dflt: '"solid"',   desc_de: "Visueller Stil",                               desc_en: "Visual style" },
  { id: 3, prop: "size",         type: "xs | sm | md | lg | xl",             dflt: '"md"',      desc_de: "Größe des Buttons",                            desc_en: "Button size" },
  { id: 4, prop: "icon",         type: "LucideIcon",                         dflt: "—",         desc_de: "Icon-Komponente aus lucide-react",              desc_en: "Icon component from lucide-react" },
  { id: 5, prop: "iconPosition", type: "left | right | only",                dflt: '"left"',    desc_de: "Position des Icons",                           desc_en: "Icon position" },
  { id: 6, prop: "isLoading",    type: "boolean",                            dflt: "false",     desc_de: "Zeigt Ladeindikator, sperrt Interaktion",      desc_en: "Shows spinner, blocks interaction" },
  { id: 7, prop: "fullWidth",    type: "boolean",                            dflt: "false",     desc_de: "Nimmt volle Breite ein",                       desc_en: "Takes full width" },
  { id: 8, prop: "disabled",     type: "boolean",                            dflt: "false",     desc_de: "Deaktiviert den Button",                       desc_en: "Disables the button" },
];

const INPUT_PROPS: readonly PropRowBase[] = [
  { id: 1, prop: "title",        type: "string",                             dflt: "—",         desc_de: "Label-Text (via TitelBorder)",                 desc_en: "Label text (via TitelBorder)" },
  { id: 2, prop: "variant",      type: "default | subtle | strong",          dflt: '"default"', desc_de: "Rahmen- und Hintergrundstil",                  desc_en: "Border and background style" },
  { id: 3, prop: "icon",         type: "LucideIcon",                         dflt: "—",         desc_de: "Icon links oder rechts im Feld",               desc_en: "Icon left or right in the field" },
  { id: 4, prop: "iconPosition", type: "left | right",                       dflt: '"left"',    desc_de: "Position des Icons",                           desc_en: "Icon position" },
  { id: 5, prop: "loading",      type: "boolean",                            dflt: "false",     desc_de: "Zeigt Ladeindikator",                          desc_en: "Shows loading indicator" },
  { id: 6, prop: "disabled",     type: "boolean",                            dflt: "false",     desc_de: "Deaktiviert das Feld",                         desc_en: "Disables the field" },
  { id: 7, prop: "placeholder",  type: "string",                             dflt: "—",         desc_de: "Platzhaltertext",                              desc_en: "Placeholder text" },
  { id: 8, prop: "value",        type: "string",                             dflt: "—",         desc_de: "Kontrollierter Wert",                          desc_en: "Controlled value" },
  { id: 9, prop: "onChange",     type: "(e: ChangeEvent) => void",           dflt: "—",         desc_de: "Callback bei Eingabe",                         desc_en: "Callback on input" },
];

const DROPDOWN_PROPS: readonly PropRowBase[] = [
  { id: 1, prop: "title",    type: "string",                                  dflt: "—",         desc_de: "Label-Text (via TitelBorder)",                 desc_en: "Label text (via TitelBorder)" },
  { id: 2, prop: "options",  type: "{ value: string; label: string }[]",      dflt: "—",         desc_de: "Auswahloptionen",                              desc_en: "Select options" },
  { id: 3, prop: "variant",  type: "default | subtle | strong",               dflt: '"default"', desc_de: "Rahmen- und Hintergrundstil",                  desc_en: "Border and background style" },
  { id: 4, prop: "icon",     type: "LucideIcon",                              dflt: "—",         desc_de: "Icon links im Select",                         desc_en: "Icon on the left" },
  { id: 5, prop: "loading",  type: "boolean",                                 dflt: "false",     desc_de: "Zeigt Ladeindikator",                          desc_en: "Shows loading indicator" },
  { id: 6, prop: "disabled", type: "boolean",                                 dflt: "false",     desc_de: "Deaktiviert das Select",                       desc_en: "Disables the select" },
  { id: 7, prop: "value",    type: "string",                                  dflt: "—",         desc_de: "Kontrollierter Wert",                          desc_en: "Controlled value" },
  { id: 8, prop: "onChange", type: "(e: ChangeEvent) => void",                dflt: "—",         desc_de: "Callback bei Auswahl",                         desc_en: "Callback on selection" },
];

const COMBOBOX_PROPS: readonly PropRowBase[] = [
  { id: 1, prop: "title",      type: "string",                                dflt: "—",         desc_de: "Label-Text (via TitelBorder)",                 desc_en: "Label text (via TitelBorder)" },
  { id: 2, prop: "options",    type: "{ value: string; label: string }[]",    dflt: "—",         desc_de: "Auswahloptionen",                              desc_en: "Select options" },
  { id: 3, prop: "multiple",   type: "boolean",                               dflt: "false",     desc_de: "Erlaubt Mehrfachauswahl mit Alle-Button",      desc_en: "Allows multi-selection with select-all" },
  { id: 4, prop: "maxVisible", type: "number",                                dflt: "—",         desc_de: "Max. sichtbare Tags bei Mehrfachauswahl",      desc_en: "Max visible tags in multi-select" },
  { id: 5, prop: "loading",    type: "boolean",                               dflt: "false",     desc_de: "Zeigt Ladeindikator",                          desc_en: "Shows loading indicator" },
  { id: 6, prop: "disabled",   type: "boolean",                               dflt: "false",     desc_de: "Deaktiviert das Feld",                         desc_en: "Disables the field" },
];

const DATEPICKER_PROPS: readonly PropRowBase[] = [
  { id: 1, prop: "title",         type: "string",                                   dflt: "—",         desc_de: "Label-Text (via TitelBorder)",          desc_en: "Label text (via TitelBorder)" },
  { id: 2, prop: "displayFormat", type: "de | us | iso | long",                    dflt: '"de"',      desc_de: "Anzeigeformat im Eingabefeld",           desc_en: "Display format in input field" },
  { id: 3, prop: "outputFormat",  type: "date | iso | de | us | timestamp",        dflt: '"date"',    desc_de: "Typ des onChange-Rückgabewerts",         desc_en: "Type returned by onChange" },
  { id: 4, prop: "minDate",       type: "Date",                                    dflt: "—",         desc_de: "Frühestes auswählbares Datum",           desc_en: "Earliest selectable date" },
  { id: 5, prop: "maxDate",       type: "Date",                                    dflt: "—",         desc_de: "Spätestes auswählbares Datum",           desc_en: "Latest selectable date" },
  { id: 6, prop: "variant",       type: "default | subtle | strong",               dflt: '"default"', desc_de: "Rahmen- und Hintergrundstil",            desc_en: "Border and background style" },
  { id: 7, prop: "loading",       type: "boolean",                                 dflt: "false",     desc_de: "Zeigt Ladeindikator",                   desc_en: "Shows loading indicator" },
  { id: 8, prop: "disabled",      type: "boolean",                                 dflt: "false",     desc_de: "Deaktiviert den Picker",                desc_en: "Disables the picker" },
  { id: 9, prop: "onChange",      type: "(value: Date | string | number) => void", dflt: "—",         desc_de: "Callback — Typ hängt von outputFormat ab", desc_en: "Callback — type depends on outputFormat" },
];

const TITELBORDER_PROPS: readonly PropRowBase[] = [
  { id: 1, prop: "title",     type: "string",                          dflt: "—",         desc_de: "Legend-Text am oberen Rand",            desc_en: "Legend text at top border" },
  { id: 2, prop: "variant",   type: "default | subtle | strong",       dflt: '"default"', desc_de: "Rahmen- und Hintergrundstil",           desc_en: "Border and background style" },
  { id: 3, prop: "size",      type: "sm | md | lg",                    dflt: '"md"',      desc_de: "Innenabstand",                          desc_en: "Padding" },
  { id: 4, prop: "className", type: "string",                          dflt: '""',        desc_de: "Zusätzliche Tailwind-Klassen",          desc_en: "Additional Tailwind classes" },
  { id: 5, prop: "children",  type: "ReactNode",                       dflt: "—",         desc_de: "Inhalt innerhalb der Border",           desc_en: "Content inside the border" },
];

const NAVBAR_PROPS: readonly PropRowBase[] = [
  { id: 1,  prop: "items",       type: "NavBarItem[]",                      dflt: "—",              desc_de: "Array aus Nav-Einträgen",                    desc_en: "Array of nav items" },
  { id: 2,  prop: "activeId",    type: "string",                            dflt: "—",              desc_de: "ID des aktiven Eintrags",                    desc_en: "ID of the active item" },
  { id: 3,  prop: "onSelect",    type: "(id: string) => void",              dflt: "—",              desc_de: "Callback bei Klick",                         desc_en: "Callback when item is clicked" },
  { id: 4,  prop: "orientation", type: "horizontal | vertical",             dflt: '"horizontal"',   desc_de: "Ausrichtung der Leiste",                     desc_en: "Bar orientation" },
  { id: 5,  prop: "indicator",   type: "gradient-line | pill | dot | none", dflt: '"gradient-line"', desc_de: "Aktiv-Indikator-Stil",                      desc_en: "Active indicator style" },
  { id: 6,  prop: "logo",        type: "ReactNode",                         dflt: "—",              desc_de: "Optionales Logo links in der Leiste",        desc_en: "Optional logo on the left" },
  { id: 7,  prop: "trailing",    type: "ReactNode",                         dflt: "—",              desc_de: "Inhalt am rechten / unteren Ende",           desc_en: "Content at the right / bottom end" },
  { id: 8,  prop: "background",  type: "string",                            dflt: "—",              desc_de: "Tailwind-Klasse oder CSS-Wert für Hintergrund", desc_en: "Tailwind class or CSS for background" },
  { id: 9,  prop: "size",        type: "sm | md | lg",                      dflt: '"md"',           desc_de: "Größe der Items",                            desc_en: "Item size" },
  { id: 10, prop: "fullWidth",   type: "boolean",                           dflt: "false",          desc_de: "Leiste nimmt volle Breite ein",              desc_en: "Bar takes full width" },
  { id: 11, prop: "sticky",      type: "boolean",                           dflt: "false",          desc_de: "Klebt am oberen Rand beim Scrollen",         desc_en: "Sticks at top while scrolling" },
];

const ACCORDION_PROPS: readonly PropRowBase[] = [
  { id: 1, prop: "title",       type: "string",                          dflt: "—",           desc_de: "Beschriftung der Header-Zeile",          desc_en: "Header line label" },
  { id: 2, prop: "defaultOpen", type: "boolean",                         dflt: "false",       desc_de: "Startzustand: aufgeklappt",              desc_en: "Initial state: expanded" },
  { id: 3, prop: "open",        type: "boolean",                         dflt: "—",           desc_de: "Kontrollierter Öffnungszustand",         desc_en: "Controlled open state" },
  { id: 4, prop: "onToggle",    type: "(open: boolean) => void",         dflt: "—",           desc_de: "Callback wenn Zustand wechselt",         desc_en: "Callback when state changes" },
  { id: 5, prop: "icon",        type: "LucideIcon",                      dflt: "ChevronDown", desc_de: "Ersetzt den Standard-Pfeil",             desc_en: "Replaces the default arrow" },
  { id: 6, prop: "size",        type: "sm | md | lg | full",             dflt: '"md"',        desc_de: "Breite und Schriftgröße",                desc_en: "Width and font size" },
  { id: 7, prop: "variant",     type: "default | subtle | strong",       dflt: '"default"',   desc_de: "Rahmen- und Hintergrundstil",            desc_en: "Border and background style" },
  { id: 8, prop: "loading",     type: "boolean",                         dflt: "false",       desc_de: "Zeigt Spinner, sperrt Interaktion",      desc_en: "Shows spinner, blocks interaction" },
  { id: 9, prop: "disabled",    type: "boolean",                         dflt: "false",       desc_de: "Deaktiviert den Toggle",                 desc_en: "Disables toggling" },
];

const TABELLE_PROPS: readonly PropRowBase[] = [
  { id: 1,  prop: "data",              type: "readonly T[]",                 dflt: "—",          desc_de: "Datensätze (beliebige Objekte)",          desc_en: "Data records (any objects)" },
  { id: 2,  prop: "columns",           type: "TabelleColumn<T>[]",           dflt: "—",          desc_de: "Spaltendefinitionen",                    desc_en: "Column definitions" },
  { id: 3,  prop: "rowKey",            type: "keyof T",                      dflt: "—",          desc_de: "Eindeutiger Schlüssel jeder Zeile",      desc_en: "Unique key for each row" },
  { id: 4,  prop: "variant",           type: "default | subtle | strong",    dflt: '"default"',  desc_de: "Tabellen-Stil",                          desc_en: "Table style" },
  { id: 5,  prop: "scrollable",        type: "boolean",                      dflt: "false",      desc_de: "Vertikales Scrollen + Sticky Header",    desc_en: "Vertical scroll + sticky header" },
  { id: 6,  prop: "maxHeight",         type: "string",                       dflt: '"300px"',    desc_de: "Max. Höhe beim Scrollen",                desc_en: "Maximum height when scrollable" },
  { id: 7,  prop: "pagination",        type: "boolean",                      dflt: "false",      desc_de: "Aktiviert Seitennavigation",             desc_en: "Enables pagination" },
  { id: 8,  prop: "pageSize",          type: "number",                       dflt: "10",         desc_de: "Einträge pro Seite",                     desc_en: "Entries per page" },
  { id: 9,  prop: "pageSizeOptions",   type: "number[]",                     dflt: "[10,25,50]", desc_de: "Auswahlbare Seitengrößen",               desc_en: "Selectable page sizes" },
  { id: 10, prop: "selectable",        type: "boolean",                      dflt: "false",      desc_de: "Aktiviert Zeilenauswahl",                desc_en: "Enables row selection" },
  { id: 11, prop: "multiSelect",       type: "boolean",                      dflt: "false",      desc_de: "Mehrfachauswahl + Header-Checkbox",      desc_en: "Multi-select + header checkbox" },
  { id: 12, prop: "selectedKeys",      type: "(string | number)[]",          dflt: "—",          desc_de: "Kontrollierte Auswahl",                  desc_en: "Controlled selection" },
  { id: 13, prop: "onSelectionChange", type: "(keys) => void",               dflt: "—",          desc_de: "Callback bei Auswahlwechsel",            desc_en: "Callback when selection changes" },
  { id: 14, prop: "striped",           type: "boolean",                      dflt: "false",      desc_de: "Abwechselnde Zeilenhintergründe",        desc_en: "Alternating row backgrounds" },
  { id: 15, prop: "loading",           type: "boolean",                      dflt: "false",      desc_de: "Zeigt Ladeindikator",                    desc_en: "Shows loading indicator" },
  { id: 16, prop: "emptyLabel",        type: "string",                       dflt: '"—"',        desc_de: "Text bei leerer Tabelle",                desc_en: "Text when table is empty" },
];

const MODAL_PROPS: readonly PropRowBase[] = [
  { id: 1, prop: "open",            type: "boolean",                         dflt: "—",         desc_de: "Kontrollierter Öffnungszustand",          desc_en: "Controlled open state" },
  { id: 2, prop: "onClose",         type: "() => void",                      dflt: "—",         desc_de: "Callback zum Schließen",                  desc_en: "Callback to close" },
  { id: 3, prop: "title",           type: "string",                          dflt: "—",         desc_de: "Überschrift im Modal-Header",             desc_en: "Heading in modal header" },
  { id: 4, prop: "size",            type: "sm | md | lg | full",             dflt: '"md"',      desc_de: "Breite des Modal-Dialogs",               desc_en: "Width of the modal dialog" },
  { id: 5, prop: "variant",         type: "default | subtle | strong",       dflt: '"default"', desc_de: "Rahmen- und Hintergrundstil",             desc_en: "Border and background style" },
  { id: 6, prop: "showCloseButton", type: "boolean",                         dflt: "true",      desc_de: "Zeigt X-Button im Header",               desc_en: "Shows X button in header" },
  { id: 7, prop: "className",       type: "string",                          dflt: '""',        desc_de: "Zusätzliche Klassen am Dialog-Panel",    desc_en: "Additional classes on dialog panel" },
  { id: 8, prop: "children",        type: "ReactNode",                       dflt: "—",         desc_de: "Inhalt des Modals",                      desc_en: "Modal content" },
];

const TOAST_PROPS: readonly PropRowBase[] = [
  { id: 1, prop: "show(message)",   type: "(message: string, options?) => void", dflt: "—",    desc_de: "Löst einen Toast aus (vom useToast-Hook)", desc_en: "Triggers a toast (from useToast hook)" },
  { id: 2, prop: "options.type",    type: "info | success | warning | error",    dflt: '"info"', desc_de: "Visueller Typ des Toasts",              desc_en: "Visual type of the toast" },
  { id: 3, prop: "options.duration", type: "number",                         dflt: "3000",      desc_de: "Anzeigedauer in ms (0 = dauerhaft)",     desc_en: "Display duration in ms (0 = persist)" },
  { id: 4, prop: "options.icon",    type: "LucideIcon",                      dflt: "—",         desc_de: "Ersetzt das Standard-Icon",              desc_en: "Replaces the default icon" },
];

const TABS_PROPS: readonly PropRowBase[] = [
  { id: 1,  prop: "items",            type: "readonly TabItem[]",            dflt: "—",              desc_de: "Array aus Tab-Einträgen (id, label, icon?, disabled?)", desc_en: "Array of tab items (id, label, icon?, disabled?)" },
  { id: 2,  prop: "activeId",         type: "string",                        dflt: "—",              desc_de: "Kontrollierter aktiver Tab",             desc_en: "Controlled active tab" },
  { id: 3,  prop: "defaultActiveId",  type: "string",                        dflt: "items[0].id",    desc_de: "Initialer aktiver Tab",                  desc_en: "Initial active tab" },
  { id: 4,  prop: "onChange",         type: "(id: string) => void",          dflt: "—",              desc_de: "Callback bei Tab-Wechsel",               desc_en: "Callback on tab change" },
  { id: 5,  prop: "size",             type: "sm | md | lg | full",           dflt: '"md"',           desc_de: "Größe der Tab-Items",                    desc_en: "Tab item size" },
  { id: 6,  prop: "variant",          type: "default | subtle | strong",     dflt: '"default"',      desc_de: "Stil der Trennlinie und des Indikators",  desc_en: "Divider and indicator style" },
  { id: 7,  prop: "orientation",      type: "horizontal | vertical",         dflt: '"horizontal"',   desc_de: "Ausrichtung der Tab-Liste",              desc_en: "Tab list orientation" },
  { id: 8,  prop: "children",         type: "ReactNode (TabPanel)",          dflt: "—",              desc_de: "TabPanel-Kinder — nur aktives Panel wird gerendert", desc_en: "TabPanel children — only active panel is rendered" },
];

const CHANGELOG_PROPS: readonly PropRowBase[] = [
  { id: 1, prop: "program", type: "string", dflt: "—", desc_de: "Name der Anwendung — erscheint im Modal-Titel",       desc_en: "Application name — shown in modal title" },
  { id: 2, prop: "version", type: "string", dflt: "—", desc_de: "Aktuelle Versionsnummer — erscheint im Modal-Titel",  desc_en: "Current version number — shown in modal title" },
  { id: 3, prop: "date",    type: "string", dflt: "—", desc_de: "Datum des Releases — erscheint im Modal-Titel",       desc_en: "Release date — shown in modal title" },
  { id: 4, prop: "path",    type: "string", dflt: "—", desc_de: "URL-Pfad zur Markdown-Datei (z. B. /CHANGELOG.md)",  desc_en: "URL path to the Markdown file (e.g. /CHANGELOG.md)" },
];

const BADGE_PROPS: readonly PropRowBase[] = [
  { id: 1, prop: "children",     type: "ReactNode",                                     dflt: "—",         desc_de: "Badge-Text oder -Inhalt",              desc_en: "Badge text or content" },
  { id: 2, prop: "color",        type: "neutral | info | success | warning | error",    dflt: '"neutral"', desc_de: "Farbschema",                           desc_en: "Color scheme" },
  { id: 3, prop: "variant",      type: "default | subtle | strong",                     dflt: '"default"', desc_de: "Intensität des Stils",                 desc_en: "Style intensity" },
  { id: 4, prop: "size",         type: "sm | md | lg",                                 dflt: '"md"',      desc_de: "Größe des Badges",                     desc_en: "Badge size" },
  { id: 5, prop: "icon",         type: "LucideIcon",                                   dflt: "—",         desc_de: "Icon links oder rechts",               desc_en: "Icon left or right" },
  { id: 6, prop: "iconPosition", type: "left | right",                                 dflt: '"left"',    desc_de: "Position des Icons",                   desc_en: "Icon position" },
  { id: 7, prop: "dot",          type: "boolean",                                       dflt: "false",     desc_de: "Zeigt farbigen Dot statt Icon",        desc_en: "Shows colored dot instead of icon" },
  { id: 8, prop: "className",    type: "string",                                        dflt: '""',        desc_de: "Zusätzliche Klassen",                  desc_en: "Additional classes" },
];

// ── Prop Table Component ──────────────────────────────────────────────────────

function PropTable({ lang, data }: { lang: Lang; data: readonly PropRowBase[] }) {
  const s = S[lang];
  const cols: readonly TabelleColumn<PropRow>[] = [
    { key: "prop",        header: s.prop, width: "130px" },
    { key: "type",        header: s.type, width: "220px" },
    { key: "dflt",        header: s.dflt, width: "100px" },
    { key: "description", header: s.desc },
  ];
  return (
    <Accordion title={s.allProps} variant="subtle" size="full">
      <div className="pt-2">
        <Tabelle
          data={toRows(lang, data)}
          columns={cols}
          rowKey="id"
          size="sm"
          variant="subtle"
        />
      </div>
    </Accordion>
  );
}

// ── CodeBlock ─────────────────────────────────────────────────────────────────

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group rounded-xl overflow-hidden">
      <pre className="bg-zinc-900 text-zinc-100 text-xs p-4 overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
      <button
        onClick={copy}
        className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-zinc-700 hover:bg-zinc-600 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
      </button>
    </div>
  );
}

// ── ExampleBlock ──────────────────────────────────────────────────────────────

function ExampleBlock({ label, preview, code }: {
  label: string;
  preview: ReactNode;
  code: string;
}) {
  return (
    <div className="flex flex-col gap-0">
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">{label}</p>
      <div className="flex flex-wrap gap-3 items-start p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-t-xl">
        {preview}
      </div>
      <CodeBlock code={code} />
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

function Section({ id, title, description, importStr, children }: {
  id: string;
  title: string;
  description: string;
  importStr: string;
  children: ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(importStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <section id={id} className="flex flex-col gap-7 pb-16 scroll-mt-16">
      <div className="pb-4">
        <div className="flex items-start justify-between gap-4 mb-1">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{title}</h2>
          <button
            onClick={copy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer shrink-0 group"
          >
            <code className="text-xs font-mono text-indigo-600 dark:text-indigo-400 select-none">
              {importStr}
            </code>
            <span className="text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
              {copied ? <Check size={11} /> : <Copy size={11} />}
            </span>
          </button>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
        <div className="mt-4 h-px bg-gradient-to-r from-zinc-200 dark:from-zinc-800 to-transparent" />
      </div>
      <div className="flex flex-col gap-10">{children}</div>
    </section>
  );
}

// ── Demo Data & Helpers ───────────────────────────────────────────────────────

const LANG_OPTIONS = [
  { value: "de", label: "Deutsch" },
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
];

const NAV_KEYS = [
  "install",
  "card", "button", "input", "dropdown", "combobox", "datepicker",
  "titelborder", "navigationbar", "accordion", "tabelle",
  "modal", "toast", "tabs", "badge", "changelog",
] as const;

type NavKey = typeof NAV_KEYS[number];

const IMPORT_STRINGS: Record<NavKey, string> = {
  install:       'npm install @levin-the-doctor/simple-tailwind-ui',
  card:          'import { Card } from "@levin-the-doctor/simple-tailwind-ui"',
  button:        'import { Button } from "@levin-the-doctor/simple-tailwind-ui"',
  input:         'import { Input } from "@levin-the-doctor/simple-tailwind-ui"',
  dropdown:      'import { Dropdown } from "@levin-the-doctor/simple-tailwind-ui"',
  combobox:      'import { ComboBox } from "@levin-the-doctor/simple-tailwind-ui"',
  datepicker:    'import { DatePicker } from "@levin-the-doctor/simple-tailwind-ui"',
  titelborder:   'import { TitelBorder } from "@levin-the-doctor/simple-tailwind-ui"',
  navigationbar: 'import { NavigationBar } from "@levin-the-doctor/simple-tailwind-ui"',
  accordion:     'import { Accordion } from "@levin-the-doctor/simple-tailwind-ui"',
  tabelle:       'import { Tabelle } from "@levin-the-doctor/simple-tailwind-ui"',
  modal:         'import { Modal } from "@levin-the-doctor/simple-tailwind-ui"',
  toast:         'import { ToastProvider, useToast } from "@levin-the-doctor/simple-tailwind-ui"',
  tabs:          'import { Tabs, TabPanel } from "@levin-the-doctor/simple-tailwind-ui"',
  badge:         'import { Badge } from "@levin-the-doctor/simple-tailwind-ui"',
  changelog:     'import { Changelog } from "@levin-the-doctor/simple-tailwind-ui"',
};

// ── NavigationBar demo helpers ────────────────────────────────────────────────

const NB_ITEMS: ReadonlyArray<NavBarItem> = [
  { id: "home",      label: "Home",           icon: Home },
  { id: "dashboard", label: "Dashboard",      icon: LayoutDashboard },
  { id: "analytics", label: "Analytics",      icon: BarChart3 },
  { id: "settings",  label: "Einstellungen",  icon: Settings },
];
const NB_SHORT: ReadonlyArray<NavBarItem> = [
  { id: "home",    label: "Home",   icon: Home },
  { id: "search",  label: "Suchen", icon: Search },
  { id: "profile", label: "Profil", icon: User },
];

function NBDemo({ indicator, orientation }: { indicator?: NavBarIndicator; orientation?: NavBarOrientation }) {
  const [a, setA] = useState("home");
  return <NavigationBar items={NB_ITEMS} activeId={a} onSelect={setA} indicator={indicator} orientation={orientation} />;
}
function NBDemoIndicators() {
  const [a, setA] = useState("home");
  return (
    <div className="flex flex-col gap-3 w-full">
      {(["gradient-line", "pill", "dot", "none"] as const).map(ind => (
        <div key={ind}>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-1.5 font-mono">{ind}</p>
          <NavigationBar items={NB_SHORT} activeId={a} onSelect={setA} indicator={ind} />
        </div>
      ))}
    </div>
  );
}
function NBDemoLogo() {
  const [a, setA] = useState("home");
  const logo = (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
        <span className="text-white text-xs font-bold leading-none">ST</span>
      </div>
      <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">SimpleTailwindUI</span>
    </div>
  );
  return <NavigationBar items={NB_SHORT} activeId={a} onSelect={setA} logo={logo} />;
}
function NBDemoNode() {
  const [a, setA] = useState("home");
  const items: ReadonlyArray<NavBarItem> = [
    { id: "home",   label: "Home",   icon: Home },
    { id: "search", label: "Suchen", icon: Search },
    {
      id: "custom-menu",
      node: (
        <button type="button" className="flex items-center gap-1.5 px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors duration-200 cursor-pointer select-none whitespace-nowrap">
          <MoreHorizontal className="w-4 h-4" />
          <span>Mehr</span>
        </button>
      ),
    },
    { id: "profile", label: "Profil", icon: User },
  ];
  return <NavigationBar items={items} activeId={a} onSelect={setA} />;
}
function NBDemoBg() {
  const [a, setA] = useState("home");
  return (
    <div className="dark rounded-xl overflow-hidden w-full">
      <NavigationBar background="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900" items={NB_SHORT} activeId={a} onSelect={setA} className="w-full" />
    </div>
  );
}
function NBDemoTrailing() {
  const [a, setA] = useState("home");
  const trailing = (
    <button type="button" className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors duration-200 cursor-pointer">
      <Bell className="w-4 h-4" />
    </button>
  );
  return <NavigationBar items={NB_SHORT} activeId={a} onSelect={setA} trailing={trailing} />;
}
function NBDemoSizes() {
  const [a1, setA1] = useState("home");
  const [a2, setA2] = useState("home");
  const [a3, setA3] = useState("home");
  return (
    <div className="flex flex-col gap-3 w-full">
      {([["sm", NB_SHORT, a1, setA1], ["md", NB_SHORT, a2, setA2], ["lg", NB_SHORT, a3, setA3]] as const).map(
        ([sz, items, active, setActive]) => (
          <div key={sz}>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-1.5 font-mono">{sz}</p>
            <NavigationBar items={items} activeId={active} onSelect={setActive} size={sz} />
          </div>
        ),
      )}
    </div>
  );
}
function NBDemoDisabled() {
  const [a, setA] = useState("home");
  const items: ReadonlyArray<NavBarItem> = [
    { id: "home",    label: "Home",   icon: Home },
    { id: "search",  label: "Suchen", icon: Search, disabled: true },
    { id: "profile", label: "Profil", icon: User,   disabled: true },
  ];
  return <NavigationBar items={items} activeId={a} onSelect={setA} />;
}
function NBDemoFullWidth() {
  const [a, setA] = useState("home");
  return <NavigationBar items={NB_SHORT} activeId={a} onSelect={setA} fullWidth />;
}
function NBDemoSticky() {
  const [a, setA] = useState("home");
  return <NavigationBar items={NB_SHORT} activeId={a} onSelect={setA} fullWidth sticky />;
}

// ── Tabelle demo data ─────────────────────────────────────────────────────────

type StadtRow = { id: number; name: string; bundesland: string; einwohner: number; flaeche: string };

const STAEDTE: readonly StadtRow[] = [
  { id: 1,  name: "Berlin",     bundesland: "Berlin",            einwohner: 3645000, flaeche: "892 km²" },
  { id: 2,  name: "Hamburg",    bundesland: "Hamburg",           einwohner: 1841000, flaeche: "755 km²" },
  { id: 3,  name: "München",    bundesland: "Bayern",            einwohner: 1472000, flaeche: "310 km²" },
  { id: 4,  name: "Köln",       bundesland: "NRW",               einwohner: 1084000, flaeche: "405 km²" },
  { id: 5,  name: "Frankfurt",  bundesland: "Hessen",            einwohner:  753000, flaeche: "248 km²" },
  { id: 6,  name: "Stuttgart",  bundesland: "Baden-Württemberg", einwohner:  634000, flaeche: "207 km²" },
  { id: 7,  name: "Düsseldorf", bundesland: "NRW",               einwohner:  619000, flaeche: "217 km²" },
  { id: 8,  name: "Leipzig",    bundesland: "Sachsen",           einwohner:  605000, flaeche: "297 km²" },
  { id: 9,  name: "Dortmund",   bundesland: "NRW",               einwohner:  587000, flaeche: "280 km²" },
  { id: 10, name: "Essen",      bundesland: "NRW",               einwohner:  582000, flaeche: "210 km²" },
  { id: 11, name: "Bremen",     bundesland: "Bremen",            einwohner:  563000, flaeche: "319 km²" },
  { id: 12, name: "Dresden",    bundesland: "Sachsen",           einwohner:  556000, flaeche: "328 km²" },
];
const STADT_COLS: readonly TabelleColumn<StadtRow>[] = [
  { key: "name",       header: "Stadt",      sortable: true },
  { key: "bundesland", header: "Bundesland", sortable: true },
  { key: "einwohner",  header: "Einwohner",  sortable: true, render: v => (v as number).toLocaleString("de-DE") },
  { key: "flaeche",    header: "Fläche" },
];
function TabelleSelectDemo() {
  const [sel, setSel] = useState<(string | number)[]>([]);
  return (
    <div className="flex flex-col gap-2 w-full">
      <Tabelle data={STAEDTE.slice(0, 6)} columns={STADT_COLS.slice(0, 3)} rowKey="id" selectable multiSelect selectedKeys={sel} onSelectionChange={setSel} />
      <p className="text-xs text-zinc-400 dark:text-zinc-500">
        {sel.length === 0 ? "Keine Zeile ausgewählt." : `Ausgewählt: ID ${sel.join(", ")}`}
      </p>
    </div>
  );
}

// ── Modal demos ───────────────────────────────────────────────────────────────

function ModalOpenDemo({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        {lang === "de" ? "Modal öffnen" : "Open Modal"}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title={lang === "de" ? "Beispiel-Modal" : "Example Modal"}>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {lang === "de"
            ? "Das ist der Inhalt des Modals. Klick auf X oder den Hintergrund zum Schließen — oder drück Escape."
            : "This is the modal content. Click X or the backdrop to close — or press Escape."}
        </p>
      </Modal>
    </>
  );
}

function ModalVariantsDemo({ lang }: { lang: Lang }) {
  const [openVariant, setOpenVariant] = useState<"default" | "subtle" | "strong" | null>(null);
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {(["default", "subtle", "strong"] as const).map(v => (
          <Button key={v} color="neutral" variant="outline" size="sm" onClick={() => setOpenVariant(v)}>{v}</Button>
        ))}
      </div>
      {(["default", "subtle", "strong"] as const).map(v => (
        <Modal key={v} open={openVariant === v} onClose={() => setOpenVariant(null)} title={`variant="${v}"`} variant={v}>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{lang === "de" ? "Inhalt" : "Content"}</p>
        </Modal>
      ))}
    </>
  );
}

function ModalSizesDemo({ lang }: { lang: Lang }) {
  const [openSize, setOpenSize] = useState<"sm" | "md" | "lg" | "full" | null>(null);
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {(["sm", "md", "lg", "full"] as const).map(s => (
          <Button key={s} color="neutral" variant="outline" size="sm" onClick={() => setOpenSize(s)}>
            {s}
          </Button>
        ))}
      </div>
      {(["sm", "md", "lg", "full"] as const).map(s => (
        <Modal key={s} open={openSize === s} onClose={() => setOpenSize(null)} title={`size="${s}"`} size={s}>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {lang === "de" ? "Modal-Inhalt bei Größe" : "Modal content at size"} <code>{s}</code>.
          </p>
        </Modal>
      ))}
    </>
  );
}

// ── Toast demos ───────────────────────────────────────────────────────────────

function ToastTypesDemo({ lang }: { lang: Lang }) {
  const { show } = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Button color="primary"   variant="outline" size="sm" onClick={() => show(lang === "de" ? "Info-Meldung" : "Info message",                 { type: "info" })}>Info</Button>
      <Button color="success"   variant="outline" size="sm" onClick={() => show(lang === "de" ? "Erfolgreich gespeichert!" : "Saved successfully!", { type: "success" })}>Success</Button>
      <Button color="warning"   variant="outline" size="sm" onClick={() => show(lang === "de" ? "Bitte beachten." : "Please note.",               { type: "warning" })}>Warning</Button>
      <Button color="danger"    variant="outline" size="sm" onClick={() => show(lang === "de" ? "Fehler aufgetreten." : "An error occurred.",      { type: "error" })}>Error</Button>
    </div>
  );
}

function ToastDurationDemo({ lang }: { lang: Lang }) {
  const { show } = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Button color="neutral" variant="outline" size="sm" onClick={() => show(lang === "de" ? "Verschwindet nach 1s" : "Disappears after 1s", { duration: 1000 })}>
        duration: 1000
      </Button>
      <Button color="neutral" variant="outline" size="sm" onClick={() => show(lang === "de" ? "Bleibt dauerhaft (duration: 0)" : "Persists (duration: 0)", { duration: 0, type: "info" })}>
        duration: 0
      </Button>
    </div>
  );
}

// ── Tabs demos ────────────────────────────────────────────────────────────────

const TAB_ITEMS_DE = [
  { id: "overview", label: "Übersicht",  icon: LayoutDashboard },
  { id: "settings", label: "Einstellungen", icon: Settings },
  { id: "profile",  label: "Profil",     icon: User },
] as const;

const TAB_ITEMS_EN = [
  { id: "overview", label: "Overview",  icon: LayoutDashboard },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "profile",  label: "Profile",  icon: User },
] as const;

function TabsHorizDemo({ lang }: { lang: Lang }) {
  const items = lang === "de" ? TAB_ITEMS_DE : TAB_ITEMS_EN;
  return (
    <Tabs items={items} size="full">
      <TabPanel id="overview"><p className="text-zinc-500 dark:text-zinc-400">{lang === "de" ? "Übersicht-Inhalt" : "Overview content"}</p></TabPanel>
      <TabPanel id="settings"><p className="text-zinc-500 dark:text-zinc-400">{lang === "de" ? "Einstellungen-Inhalt" : "Settings content"}</p></TabPanel>
      <TabPanel id="profile" ><p className="text-zinc-500 dark:text-zinc-400">{lang === "de" ? "Profil-Inhalt" : "Profile content"}</p></TabPanel>
    </Tabs>
  );
}

function TabsVertDemo({ lang }: { lang: Lang }) {
  const items = lang === "de" ? TAB_ITEMS_DE : TAB_ITEMS_EN;
  return (
    <Tabs items={items} orientation="vertical" size="full">
      <TabPanel id="overview"><p className="text-zinc-500 dark:text-zinc-400">{lang === "de" ? "Übersicht-Inhalt" : "Overview content"}</p></TabPanel>
      <TabPanel id="settings"><p className="text-zinc-500 dark:text-zinc-400">{lang === "de" ? "Einstellungen-Inhalt" : "Settings content"}</p></TabPanel>
      <TabPanel id="profile" ><p className="text-zinc-500 dark:text-zinc-400">{lang === "de" ? "Profil-Inhalt" : "Profile content"}</p></TabPanel>
    </Tabs>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function Doku() {
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState<Lang>("de");
  const [active, setActive] = useState<NavKey>("card");

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const s  = S[lang];
  const ex = s.ex;

  const scrollTo = (id: NavKey) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const pt = (data: readonly PropRowBase[]) => <PropTable lang={lang} data={data} />;

  return (
    <ToastProvider>
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-20 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/SimpleTailwindUILogo.svg" alt="SimpleTailwindUI Logo" className="w-8 h-8 shrink-0" />
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{s.uiTitle}</span>
              <span className="text-xs text-zinc-400 dark:text-zinc-500">{s.uiSub}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-white dark:bg-zinc-800">
              {(["de", "en"] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-all duration-150 cursor-pointer ${
                    lang === l
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                      : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <Button variant="outline" color="neutral" size="sm" onClick={() => setDark(d => !d)}>
              {dark ? s.light : s.dark}
            </Button>
          </div>
        </header>

        <div className="flex">

          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="w-56 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-zinc-200 dark:border-zinc-800">
            <div className="p-4">
              {/* Intro panel */}
              <div className="mb-5 p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30 border border-indigo-100 dark:border-indigo-900/40">
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                  {lang === "de" ? "Dokumentation" : "Documentation"}
                </p>
                <p className="text-xs text-indigo-500/80 dark:text-indigo-400/60 leading-relaxed">{s.intro}</p>
              </div>

              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2 px-1">
                {s.nav}
              </p>
              <nav className="flex flex-col gap-0.5">
                {NAV_KEYS.map(key => {
                  const isActive = active === key;
                  return (
                    <button
                      key={key}
                      onClick={() => scrollTo(key)}
                      className={`text-left px-3 py-1.5 rounded-lg text-sm transition-all duration-150 cursor-pointer ${
                        isActive
                          ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold border-l-2 border-indigo-500 dark:border-indigo-400 pl-2.5"
                          : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                      }`}
                    >
                      {s.sections[key].title}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* ── Content ──────────────────────────────────────────────────── */}
          <main className="flex-1 px-10 py-8 max-w-3xl flex flex-col gap-0">

            {/* Install */}
            <Section id="install" title={s.sections.install.title} description={s.sections.install.desc} importStr={IMPORT_STRINGS.install}>
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                    {lang === "de" ? "1. Paket installieren" : "1. Install the package"}
                  </p>
                  <CodeBlock code="npm install @levin-the-doctor/simple-tailwind-ui" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                    {lang === "de" ? "2. Peer-Dependencies" : "2. Peer dependencies"}
                  </p>
                  <CodeBlock code="npm install react react-dom lucide-react tailwindcss react-markdown" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                    {lang === "de" ? "3. Tailwind CSS einbinden (CSS-Datei)" : "3. Import Tailwind CSS (in your CSS file)"}
                  </p>
                  <CodeBlock code={`@import "tailwindcss";`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                    {lang === "de" ? "4. Komponente importieren & verwenden" : "4. Import & use a component"}
                  </p>
                  <CodeBlock code={`import { Button } from "@levin-the-doctor/simple-tailwind-ui"

export default function App() {
  return <Button color="primary">Hello World</Button>
}`} />
                </div>
              </div>
            </Section>

            {/* Card */}
            <Section id="card" title={s.sections.card.title} description={s.sections.card.desc} importStr={IMPORT_STRINGS.card}>
              <ExampleBlock
                label={ex.variants}
                preview={<>
                  <Card title="Default"  variant="default"  size="sm"><p className="text-sm text-zinc-400">Inhalt</p></Card>
                  <Card title="Elevated" variant="elevated" size="sm"><p className="text-sm text-zinc-400">Inhalt</p></Card>
                  <Card title="Outlined" variant="outlined" size="sm"><p className="text-sm text-zinc-400">Inhalt</p></Card>
                  <Card title="Ghost"    variant="ghost"    size="sm"><p className="text-sm text-zinc-400">Inhalt</p></Card>
                </>}
                code={`<Card title="Default"  variant="default"  size="sm">...</Card>
<Card title="Elevated" variant="elevated" size="sm">...</Card>
<Card title="Outlined" variant="outlined" size="sm">...</Card>
<Card title="Ghost"    variant="ghost"    size="sm">...</Card>`}
              />
              <ExampleBlock
                label={ex.sizes}
                preview={<>
                  <Card size="sm" variant="outlined"><p className="text-xs text-zinc-400">sm</p></Card>
                  <Card size="md" variant="outlined"><p className="text-xs text-zinc-400">md</p></Card>
                  <Card size="lg" variant="outlined"><p className="text-xs text-zinc-400">lg</p></Card>
                </>}
                code={`<Card size="sm" variant="outlined">...</Card>
<Card size="md" variant="outlined">...</Card>
<Card size="lg" variant="outlined">...</Card>`}
              />
              {pt(CARD_PROPS)}
            </Section>

            {/* Button */}
            <Section id="button" title={s.sections.button.title} description={s.sections.button.desc} importStr={IMPORT_STRINGS.button}>
              <ExampleBlock
                label={ex.colors}
                preview={<>
                  <Button color="primary">Primary</Button>
                  <Button color="secondary">Secondary</Button>
                  <Button color="success">Success</Button>
                  <Button color="danger">Danger</Button>
                  <Button color="warning">Warning</Button>
                  <Button color="neutral">Neutral</Button>
                </>}
                code={`<Button color="primary">Primary</Button>
<Button color="secondary">Secondary</Button>
<Button color="success">Success</Button>
<Button color="danger">Danger</Button>
<Button color="warning">Warning</Button>
<Button color="neutral">Neutral</Button>`}
              />
              <ExampleBlock
                label={ex.variants}
                preview={<>
                  <Button color="primary" variant="solid">Solid</Button>
                  <Button color="primary" variant="outline">Outline</Button>
                  <Button color="primary" variant="ghost">Ghost</Button>
                </>}
                code={`<Button color="primary" variant="solid">Solid</Button>
<Button color="primary" variant="outline">Outline</Button>
<Button color="primary" variant="ghost">Ghost</Button>`}
              />
              <ExampleBlock
                label={ex.icons}
                preview={<>
                  <Button color="primary" icon={Plus}   iconPosition="left">Hinzufügen</Button>
                  <Button color="success" icon={Save}   iconPosition="right">Speichern</Button>
                  <Button color="danger"  icon={Trash2} iconPosition="only" />
                  <Button color="neutral" icon={User}   iconPosition="only" variant="outline" />
                  <Button color="primary" isLoading>Laden</Button>
                </>}
                code={`<Button color="primary" icon={Plus}   iconPosition="left">Hinzufügen</Button>
<Button color="success" icon={Save}   iconPosition="right">Speichern</Button>
<Button color="danger"  icon={Trash2} iconPosition="only" />
<Button color="neutral" icon={User}   iconPosition="only" variant="outline" />
<Button color="primary" isLoading>Laden</Button>`}
              />
              <ExampleBlock
                label={ex.sizes}
                preview={<>
                  <Button size="xs">XSmall</Button>
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">XLarge</Button>
                </>}
                code={`<Button size="xs">XSmall</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">XLarge</Button>`}
              />
              {pt(BUTTON_PROPS)}
            </Section>

            {/* Input */}
            <Section id="input" title={s.sections.input.title} description={s.sections.input.desc} importStr={IMPORT_STRINGS.input}>
              <ExampleBlock
                label={ex.std}
                preview={<Input title="Name" placeholder="Max Mustermann" />}
                code={`<Input title="Name" placeholder="Max Mustermann" />`}
              />
              <ExampleBlock
                label={ex.withIcon}
                preview={<>
                  <Input title="Suche"  placeholder="Suchen..."         icon={Search} iconPosition="left" />
                  <Input title="E-Mail" placeholder="mail@example.com"  icon={Mail}   iconPosition="right" />
                </>}
                code={`<Input title="Suche"  icon={Search} iconPosition="left"  placeholder="Suchen..." />
<Input title="E-Mail" icon={Mail}   iconPosition="right" placeholder="mail@example.com" />`}
              />
              <ExampleBlock
                label={ex.variants}
                preview={<>
                  <Input title="Default" variant="default" placeholder="Default..." />
                  <Input title="Subtle"  variant="subtle"  placeholder="Subtle..." />
                  <Input title="Strong"  variant="strong"  placeholder="Strong..." />
                </>}
                code={`<Input title="Default" variant="default" placeholder="Default..." />
<Input title="Subtle"  variant="subtle"  placeholder="Subtle..." />
<Input title="Strong"  variant="strong"  placeholder="Strong..." />`}
              />
              <ExampleBlock
                label={ex.states}
                preview={<>
                  <Input title="Laden"       loading />
                  <Input title="Deaktiviert" placeholder="Deaktiviert" disabled />
                </>}
                code={`<Input title="Laden"       loading />
<Input title="Deaktiviert" placeholder="Deaktiviert" disabled />`}
              />
              {pt(INPUT_PROPS)}
            </Section>

            {/* Dropdown */}
            <Section id="dropdown" title={s.sections.dropdown.title} description={s.sections.dropdown.desc} importStr={IMPORT_STRINGS.dropdown}>
              <ExampleBlock
                label={ex.std}
                preview={<Dropdown title="Sprache" options={LANG_OPTIONS} />}
                code={`const options = [
  { value: "de", label: "Deutsch" },
  { value: "en", label: "English" },
];

<Dropdown title="Sprache" options={options} />`}
              />
              <ExampleBlock
                label={`${ex.variants} & Icon`}
                preview={<>
                  <Dropdown title="Default" options={LANG_OPTIONS} icon={Globe} variant="default" />
                  <Dropdown title="Subtle"  options={LANG_OPTIONS} icon={Globe} variant="subtle" />
                  <Dropdown title="Strong"  options={LANG_OPTIONS} icon={Globe} variant="strong" />
                </>}
                code={`<Dropdown title="Default" options={options} icon={Globe} variant="default" />
<Dropdown title="Subtle"  options={options} icon={Globe} variant="subtle" />
<Dropdown title="Strong"  options={options} icon={Globe} variant="strong" />`}
              />
              <ExampleBlock
                label={ex.states}
                preview={<>
                  <Dropdown title="Laden"       options={LANG_OPTIONS} loading />
                  <Dropdown title="Deaktiviert" options={LANG_OPTIONS} disabled />
                </>}
                code={`<Dropdown title="Laden"       options={options} loading />
<Dropdown title="Deaktiviert" options={options} disabled />`}
              />
              {pt(DROPDOWN_PROPS)}
            </Section>

            {/* ComboBox */}
            <Section id="combobox" title={s.sections.combobox.title} description={s.sections.combobox.desc} importStr={IMPORT_STRINGS.combobox}>
              <ExampleBlock
                label="Single-Select"
                preview={<ComboBox title="Land" options={LANG_OPTIONS} />}
                code={`<ComboBox title="Land" options={options} />`}
              />
              <ExampleBlock
                label={ex.multi}
                preview={<ComboBox title="Sprachen" multiple options={LANG_OPTIONS} />}
                code={`<ComboBox title="Sprachen" multiple options={options} />`}
              />
              <ExampleBlock
                label={ex.maxVis}
                preview={<ComboBox title="Suche (max 2)" multiple maxVisible={2} options={LANG_OPTIONS} />}
                code={`<ComboBox
  title="Suche (max 2)"
  multiple
  maxVisible={2}
  options={options}
/>`}
              />
              <ExampleBlock
                label={ex.states}
                preview={<>
                  <ComboBox title="Laden"       options={LANG_OPTIONS} loading />
                  <ComboBox title="Deaktiviert" options={LANG_OPTIONS} disabled />
                </>}
                code={`<ComboBox title="Laden"       options={options} loading />
<ComboBox title="Deaktiviert" options={options} disabled />`}
              />
              {pt(COMBOBOX_PROPS)}
            </Section>

            {/* DatePicker */}
            <Section id="datepicker" title={s.sections.datepicker.title} description={s.sections.datepicker.desc} importStr={IMPORT_STRINGS.datepicker}>
              <ExampleBlock
                label={`${ex.std} (displayFormat: de)`}
                preview={<DatePicker title="Datum" />}
                code={`<DatePicker title="Datum" />`}
              />
              <ExampleBlock
                label={ex.dispFmt}
                preview={<>
                  <DatePicker title='displayFormat="de"'   displayFormat="de" />
                  <DatePicker title='displayFormat="us"'   displayFormat="us" />
                  <DatePicker title='displayFormat="iso"'  displayFormat="iso" />
                  <DatePicker title='displayFormat="long"' displayFormat="long" />
                </>}
                code={`<DatePicker title="Datum" displayFormat="de"   /> // 31.05.2026
<DatePicker title="Datum" displayFormat="us"   /> // 05/31/2026
<DatePicker title="Datum" displayFormat="iso"  /> // 2026-05-31
<DatePicker title="Datum" displayFormat="long" /> // 31. Mai 2026`}
              />
              <ExampleBlock
                label={ex.outFmt}
                preview={<DatePicker title="ISO-Output" displayFormat="de" outputFormat="iso" />}
                code={`// onChange gibt unterschiedliche Typen zurück:
<DatePicker outputFormat="date"      onChange={(v) => v} /> // Date-Objekt
<DatePicker outputFormat="iso"       onChange={(v) => v} /> // "2026-05-31"
<DatePicker outputFormat="de"        onChange={(v) => v} /> // "31.05.2026"
<DatePicker outputFormat="timestamp" onChange={(v) => v} /> // 1748649600000`}
              />
              <ExampleBlock
                label={ex.minMax}
                preview={<DatePicker title="Nur Zukunft" minDate={new Date()} />}
                code={`<DatePicker
  title="Nur Zukunft"
  minDate={new Date()}
/>`}
              />
              <ExampleBlock
                label={`${ex.variants} & ${ex.states}`}
                preview={<>
                  <DatePicker title="Subtle"      variant="subtle" />
                  <DatePicker title="Strong"      variant="strong" />
                  <DatePicker title="Laden"       loading />
                  <DatePicker title="Deaktiviert" disabled />
                </>}
                code={`<DatePicker title="Subtle"      variant="subtle" />
<DatePicker title="Strong"      variant="strong" />
<DatePicker title="Laden"       loading />
<DatePicker title="Deaktiviert" disabled />`}
              />
              {pt(DATEPICKER_PROPS)}
            </Section>

            {/* TitelBorder */}
            <Section id="titelborder" title={s.sections.titelborder.title} description={s.sections.titelborder.desc} importStr={IMPORT_STRINGS.titelborder}>
              <ExampleBlock
                label={ex.variants}
                preview={<>
                  <TitelBorder title="Default" size="sm" variant="default"><p className="text-sm text-zinc-400">Inhalt</p></TitelBorder>
                  <TitelBorder title="Subtle"  size="sm" variant="subtle"> <p className="text-sm text-zinc-400">Inhalt</p></TitelBorder>
                  <TitelBorder title="Strong"  size="sm" variant="strong"> <p className="text-sm text-zinc-400">Inhalt</p></TitelBorder>
                </>}
                code={`<TitelBorder title="Default" variant="default" size="sm">...</TitelBorder>
<TitelBorder title="Subtle"  variant="subtle"  size="sm">...</TitelBorder>
<TitelBorder title="Strong"  variant="strong"  size="sm">...</TitelBorder>`}
              />
              <ExampleBlock
                label={ex.content}
                preview={
                  <TitelBorder title="Formular" size="md">
                    <div className="flex flex-col gap-3">
                      <Input title="Name" placeholder="Max Mustermann" />
                      <Button color="primary" icon={Save} iconPosition="right" fullWidth>Speichern</Button>
                    </div>
                  </TitelBorder>
                }
                code={`<TitelBorder title="Formular" size="md">
  <Input title="Name" placeholder="Max Mustermann" />
  <Button color="primary" icon={Save} iconPosition="right" fullWidth>
    Speichern
  </Button>
</TitelBorder>`}
              />
              {pt(TITELBORDER_PROPS)}
            </Section>

            {/* NavigationBar */}
            <Section id="navigationbar" title={s.sections.navigationbar.title} description={s.sections.navigationbar.desc} importStr={IMPORT_STRINGS.navigationbar}>
              <ExampleBlock
                label={ex.horiz}
                preview={<NBDemo />}
                code={`const items = [
  { id: "home",      label: "Home",      icon: Home },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings",  label: "Einstellungen", icon: Settings },
];

const [active, setActive] = useState("home");

<NavigationBar items={items} activeId={active} onSelect={setActive} />`}
              />
              <ExampleBlock
                label={ex.vert}
                preview={<div className="w-52"><NBDemo orientation="vertical" /></div>}
                code={`<NavigationBar
  items={items}
  activeId={active}
  onSelect={setActive}
  orientation="vertical"
/>`}
              />
              <ExampleBlock
                label={ex.full}
                preview={
                  <div className="w-full border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-2">
                    <NBDemoFullWidth />
                  </div>
                }
                code={`<NavigationBar items={items} activeId={active} onSelect={setActive} fullWidth />`}
              />
              <ExampleBlock
                label={ex.sticky}
                preview={
                  <div className="relative h-28 overflow-y-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <NBDemoSticky />
                    <div className="px-4 py-3 text-xs text-zinc-400 dark:text-zinc-500 space-y-1">
                      <p>Scroll-Inhalt darunter …</p>
                      <p>Noch mehr Inhalt …</p>
                      <p>Und noch mehr …</p>
                    </div>
                  </div>
                }
                code={`<NavigationBar items={items} activeId={active} onSelect={setActive} fullWidth sticky />`}
              />
              <ExampleBlock
                label={ex.inds}
                preview={<NBDemoIndicators />}
                code={`<NavigationBar ... indicator="gradient-line" />  // Standard
<NavigationBar ... indicator="pill" />
<NavigationBar ... indicator="dot" />
<NavigationBar ... indicator="none" />`}
              />
              <ExampleBlock
                label={ex.logo}
                preview={<NBDemoLogo />}
                code={`const logo = (
  <div className="flex items-center gap-2">
    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600
                    flex items-center justify-center shrink-0">
      <span className="text-white text-xs font-bold">ST</span>
    </div>
    <span className="font-semibold text-sm">SimpleTailwindUI</span>
  </div>
);

<NavigationBar items={items} activeId={active} onSelect={setActive} logo={logo} />`}
              />
              <ExampleBlock
                label={ex.node}
                preview={<NBDemoNode />}
                code={`const items = [
  { id: "home",   label: "Home",   icon: Home },
  { id: "search", label: "Suchen", icon: Search },
  {
    id: "custom-menu",
    node: (
      <button className="flex items-center gap-1.5 px-3 py-2 text-sm
                         text-zinc-500 hover:bg-zinc-50 rounded-lg ...">
        <MoreHorizontal className="w-4 h-4" />
        <span>Mehr</span>
      </button>
    ),
  },
  { id: "profile", label: "Profil", icon: User },
];`}
              />
              <ExampleBlock
                label={ex.bg}
                preview={<NBDemoBg />}
                code={`<div className="dark">
  <NavigationBar
    background="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900"
    items={items}
    activeId={active}
    onSelect={setActive}
  />
</div>`}
              />
              <ExampleBlock
                label={ex.sizes}
                preview={<NBDemoSizes />}
                code={`<NavigationBar ... size="sm" />
<NavigationBar ... size="md" />
<NavigationBar ... size="lg" />`}
              />
              <ExampleBlock
                label={ex.trail}
                preview={<NBDemoTrailing />}
                code={`<NavigationBar
  items={items}
  activeId={active}
  onSelect={setActive}
  trailing={
    <button className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 ...">
      <Bell className="w-4 h-4" />
    </button>
  }
/>`}
              />
              <ExampleBlock
                label={ex.dis}
                preview={<NBDemoDisabled />}
                code={`const items = [
  { id: "home",    label: "Home",   icon: Home },
  { id: "search",  label: "Suchen", icon: Search, disabled: true },
  { id: "profile", label: "Profil", icon: User,   disabled: true },
];

<NavigationBar items={items} activeId="home" onSelect={setActive} />`}
              />
              {pt(NAVBAR_PROPS)}
            </Section>

            {/* Accordion */}
            <Section id="accordion" title={s.sections.accordion.title} description={s.sections.accordion.desc} importStr={IMPORT_STRINGS.accordion}>
              <ExampleBlock
                label={ex.std}
                preview={
                  <Accordion title="Reisedetails" size="full">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Hier stehen z.&nbsp;B. Details zur Reise — Abfahrtszeit, Treffpunkt, Ausrüstung.
                    </p>
                  </Accordion>
                }
                code={`<Accordion title="Reisedetails">
  <p>Details zur Reise …</p>
</Accordion>`}
              />
              <ExampleBlock
                label={ex.defOpen}
                preview={
                  <Accordion title="Hinweise" defaultOpen size="full">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Dieser Bereich ist beim Laden bereits aufgeklappt.
                    </p>
                  </Accordion>
                }
                code={`<Accordion title="Hinweise" defaultOpen>
  <p>Bereits aufgeklappt beim Laden.</p>
</Accordion>`}
              />
              <ExampleBlock
                label={ex.variants}
                preview={
                  <div className="flex flex-col gap-3 w-full">
                    <Accordion title="Default" variant="default" size="full" defaultOpen><p className="text-sm text-zinc-400">Inhalt default</p></Accordion>
                    <Accordion title="Subtle"  variant="subtle"  size="full" defaultOpen><p className="text-sm text-zinc-400">Inhalt subtle</p></Accordion>
                    <Accordion title="Strong"  variant="strong"  size="full" defaultOpen><p className="text-sm text-zinc-400">Inhalt strong</p></Accordion>
                  </div>
                }
                code={`<Accordion title="Default" variant="default" defaultOpen>...</Accordion>
<Accordion title="Subtle"  variant="subtle"  defaultOpen>...</Accordion>
<Accordion title="Strong"  variant="strong"  defaultOpen>...</Accordion>`}
              />
              <ExampleBlock
                label={ex.custIcon}
                preview={
                  <Accordion title="Mit Plus-Icon" icon={Plus} size="full">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Beliebiges LucideIcon als Indikator.</p>
                  </Accordion>
                }
                code={`import { Plus } from "lucide-react";

<Accordion title="Mit Plus-Icon" icon={Plus}>
  <p>Beliebiges LucideIcon als Indikator.</p>
</Accordion>`}
              />
              <ExampleBlock
                label={ex.ldDis}
                preview={
                  <div className="flex flex-col gap-3 w-full">
                    <Accordion title="Laden"       loading  size="full"><p className="text-sm text-zinc-400">Inhalt</p></Accordion>
                    <Accordion title="Deaktiviert" disabled size="full"><p className="text-sm text-zinc-400">Inhalt</p></Accordion>
                  </div>
                }
                code={`<Accordion title="Laden"       loading>...</Accordion>
<Accordion title="Deaktiviert" disabled>...</Accordion>`}
              />
              <ExampleBlock
                label={ex.sizes}
                preview={
                  <div className="flex flex-wrap gap-3 items-start">
                    <Accordion title="sm" size="sm" defaultOpen><p className="text-sm text-zinc-400">sm</p></Accordion>
                    <Accordion title="md" size="md" defaultOpen><p className="text-sm text-zinc-400">md</p></Accordion>
                    <Accordion title="lg" size="lg" defaultOpen><p className="text-sm text-zinc-400">lg</p></Accordion>
                  </div>
                }
                code={`<Accordion title="sm" size="sm" defaultOpen>...</Accordion>
<Accordion title="md" size="md" defaultOpen>...</Accordion>
<Accordion title="lg" size="lg" defaultOpen>...</Accordion>`}
              />
              {pt(ACCORDION_PROPS)}
            </Section>

            {/* Tabelle */}
            <Section id="tabelle" title={s.sections.tabelle.title} description={s.sections.tabelle.desc} importStr={IMPORT_STRINGS.tabelle}>
              <ExampleBlock
                label={lang === "de" ? "Grundlegend — Modell anbinden" : "Basic — binding a model"}
                preview={
                  <Tabelle data={STAEDTE.slice(0, 8)} columns={STADT_COLS} rowKey="id" />
                }
                code={`type StadtRow = {
  id: number; name: string; bundesland: string; einwohner: number; flaeche: string;
};

const columns: TabelleColumn<StadtRow>[] = [
  { key: "name",       header: "Stadt",      sortable: true },
  { key: "bundesland", header: "Bundesland", sortable: true },
  { key: "einwohner",  header: "Einwohner",  sortable: true,
    render: (v) => (v as number).toLocaleString("de-DE") },
  { key: "flaeche",    header: "Fläche" },
];

<Tabelle data={staedte} columns={columns} rowKey="id" />`}
              />
              <ExampleBlock
                label={ex.scroll}
                preview={
                  <Tabelle data={STAEDTE} columns={STADT_COLS} rowKey="id" scrollable maxHeight="250px" />
                }
                code={`<Tabelle
  data={staedte}
  columns={columns}
  rowKey="id"
  scrollable
  maxHeight="250px"
/>`}
              />
              <ExampleBlock
                label={ex.page}
                preview={
                  <Tabelle data={STAEDTE} columns={STADT_COLS} rowKey="id" pagination pageSize={5} pageSizeOptions={[5, 10]} />
                }
                code={`<Tabelle
  data={staedte}
  columns={columns}
  rowKey="id"
  pagination
  pageSize={5}
  pageSizeOptions={[5, 10]}
/>`}
              />
              <ExampleBlock
                label={ex.rowSel}
                preview={<TabelleSelectDemo />}
                code={`const [sel, setSel] = useState<(string | number)[]>([]);

<Tabelle
  data={staedte}
  columns={columns}
  rowKey="id"
  selectable
  multiSelect
  selectedKeys={sel}
  onSelectionChange={setSel}
/>`}
              />
              <ExampleBlock
                label={ex.strip}
                preview={<Tabelle data={STAEDTE.slice(0, 8)} columns={STADT_COLS} rowKey="id" striped />}
                code={`<Tabelle data={staedte} columns={columns} rowKey="id" striped />`}
              />
              <ExampleBlock
                label={ex.variants}
                preview={
                  <div className="flex flex-col gap-4 w-full">
                    {(["default", "subtle", "strong"] as const).map(v => (
                      <div key={v}>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-1.5 font-mono">{v}</p>
                        <Tabelle data={STAEDTE.slice(0, 3)} columns={STADT_COLS.slice(0, 3)} rowKey="id" variant={v} />
                      </div>
                    ))}
                  </div>
                }
                code={`<Tabelle ... variant="default" />
<Tabelle ... variant="subtle" />
<Tabelle ... variant="strong" />`}
              />
              <ExampleBlock
                label={ex.load}
                preview={<Tabelle data={STAEDTE.slice(0, 4)} columns={STADT_COLS} rowKey="id" loading />}
                code={`<Tabelle data={staedte} columns={columns} rowKey="id" loading />`}
              />
              <ExampleBlock
                label={ex.empty}
                preview={<Tabelle data={[]} columns={STADT_COLS} rowKey="id" emptyLabel={lang === "de" ? "Keine Städte gefunden." : "No cities found."} />}
                code={`<Tabelle
  data={[]}
  columns={columns}
  rowKey="id"
  emptyLabel="Keine Städte gefunden."
/>`}
              />
              {pt(TABELLE_PROPS)}
            </Section>

            {/* Modal */}
            <Section id="modal" title={s.sections.modal.title} description={s.sections.modal.desc} importStr={IMPORT_STRINGS.modal}>
              <ExampleBlock
                label={ex.modalOpen}
                preview={<ModalOpenDemo lang={lang} />}
                code={`const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Modal öffnen</Button>

<Modal open={open} onClose={() => setOpen(false)} title="Beispiel-Modal">
  <p>Inhalt des Modals…</p>
</Modal>`}
              />
              <ExampleBlock
                label={ex.modalSizes}
                preview={<ModalSizesDemo lang={lang} />}
                code={`<Modal open={open} onClose={onClose} title="sm"   size="sm">…</Modal>
<Modal open={open} onClose={onClose} title="md"   size="md">…</Modal>
<Modal open={open} onClose={onClose} title="lg"   size="lg">…</Modal>
<Modal open={open} onClose={onClose} title="full" size="full">…</Modal>`}
              />
              <ExampleBlock
                label={ex.modalVar}
                preview={<ModalVariantsDemo lang={lang} />}
                code={`<Modal open={open} onClose={onClose} variant="default">…</Modal>
<Modal open={open} onClose={onClose} variant="subtle">…</Modal>
<Modal open={open} onClose={onClose} variant="strong">…</Modal>`}
              />
              {pt(MODAL_PROPS)}
            </Section>

            {/* Toast */}
            <Section id="toast" title={s.sections.toast.title} description={s.sections.toast.desc} importStr={IMPORT_STRINGS.toast}>
              <ExampleBlock
                label={ex.toastTypes}
                preview={<ToastTypesDemo lang={lang} />}
                code={`// 1. Wrap your app with ToastProvider:
<ToastProvider>
  <App />
</ToastProvider>

// 2. Use the hook anywhere inside:
const { show } = useToast();

show("Info-Meldung",           { type: "info" });
show("Erfolgreich gespeichert!", { type: "success" });
show("Bitte beachten.",        { type: "warning" });
show("Fehler aufgetreten.",    { type: "error" });`}
              />
              <ExampleBlock
                label={ex.toastDur}
                preview={<ToastDurationDemo lang={lang} />}
                code={`show("Kurz", { duration: 1000 });  // verschwindet nach 1s
show("Dauerhaft", { duration: 0 });   // bleibt bis manuell geschlossen`}
              />
              {pt(TOAST_PROPS)}
            </Section>

            {/* Tabs */}
            <Section id="tabs" title={s.sections.tabs.title} description={s.sections.tabs.desc} importStr={IMPORT_STRINGS.tabs}>
              <ExampleBlock
                label={ex.tabsHoriz}
                preview={<TabsHorizDemo lang={lang} />}
                code={`const items = [
  { id: "overview", label: "Übersicht",     icon: LayoutDashboard },
  { id: "settings", label: "Einstellungen", icon: Settings },
  { id: "profile",  label: "Profil",        icon: User },
];

<Tabs items={items} size="full">
  <TabPanel id="overview"><p>Übersicht-Inhalt</p></TabPanel>
  <TabPanel id="settings"><p>Einstellungen-Inhalt</p></TabPanel>
  <TabPanel id="profile" ><p>Profil-Inhalt</p></TabPanel>
</Tabs>`}
              />
              <ExampleBlock
                label={ex.tabsVert}
                preview={<TabsVertDemo lang={lang} />}
                code={`<Tabs items={items} orientation="vertical" size="full">
  <TabPanel id="overview"><p>Übersicht</p></TabPanel>
  <TabPanel id="settings"><p>Einstellungen</p></TabPanel>
  <TabPanel id="profile" ><p>Profil</p></TabPanel>
</Tabs>`}
              />
              <ExampleBlock
                label={ex.tabsVar}
                preview={
                  <div className="flex flex-col gap-4 w-full">
                    {(["default", "subtle", "strong"] as const).map(v => (
                      <div key={v}>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-1.5 font-mono">{v}</p>
                        <Tabs items={[{ id: "a", label: "Alpha" }, { id: "b", label: "Beta" }, { id: "c", label: "Gamma" }]} variant={v} size="full" />
                      </div>
                    ))}
                  </div>
                }
                code={`<Tabs items={items} variant="default" />
<Tabs items={items} variant="subtle" />
<Tabs items={items} variant="strong" />`}
              />
              <ExampleBlock
                label={ex.tabsDis}
                preview={
                  <Tabs
                    items={[
                      { id: "a", label: "Aktiv" },
                      { id: "b", label: lang === "de" ? "Deaktiviert" : "Disabled", disabled: true },
                      { id: "c", label: "Aktiv 2" },
                    ]}
                    size="full"
                  />
                }
                code={`<Tabs
  items={[
    { id: "a", label: "Aktiv" },
    { id: "b", label: "Deaktiviert", disabled: true },
    { id: "c", label: "Aktiv 2" },
  ]}
/>`}
              />
              {pt(TABS_PROPS)}
            </Section>

            {/* Badge */}
            <Section id="badge" title={s.sections.badge.title} description={s.sections.badge.desc} importStr={IMPORT_STRINGS.badge}>
              <ExampleBlock
                label={ex.badgeColors}
                preview={<>
                  <Badge color="neutral">Neutral</Badge>
                  <Badge color="info">Info</Badge>
                  <Badge color="success">Success</Badge>
                  <Badge color="warning">Warning</Badge>
                  <Badge color="error">Error</Badge>
                </>}
                code={`<Badge color="neutral">Neutral</Badge>
<Badge color="info">Info</Badge>
<Badge color="success">Success</Badge>
<Badge color="warning">Warning</Badge>
<Badge color="error">Error</Badge>`}
              />
              <ExampleBlock
                label={ex.badgeVar}
                preview={
                  <div className="flex flex-col gap-2">
                    {(["default", "subtle", "strong"] as const).map(v => (
                      <div key={v} className="flex flex-wrap gap-2 items-center">
                        <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 w-16">{v}</span>
                        <Badge color="info"    variant={v}>Info</Badge>
                        <Badge color="success" variant={v}>Success</Badge>
                        <Badge color="warning" variant={v}>Warning</Badge>
                        <Badge color="error"   variant={v}>Error</Badge>
                      </div>
                    ))}
                  </div>
                }
                code={`<Badge color="info" variant="default">Info</Badge>
<Badge color="info" variant="subtle">Info</Badge>
<Badge color="info" variant="strong">Info</Badge>`}
              />
              <ExampleBlock
                label={ex.badgeSizes}
                preview={<>
                  <Badge color="info" size="sm">Small</Badge>
                  <Badge color="info" size="md">Medium</Badge>
                  <Badge color="info" size="lg">Large</Badge>
                </>}
                code={`<Badge color="info" size="sm">Small</Badge>
<Badge color="info" size="md">Medium</Badge>
<Badge color="info" size="lg">Large</Badge>`}
              />
              <ExampleBlock
                label={ex.badgeDot}
                preview={<>
                  <Badge color="neutral" dot>Neutral</Badge>
                  <Badge color="info"    dot>Info</Badge>
                  <Badge color="success" dot>Online</Badge>
                  <Badge color="warning" dot>Pending</Badge>
                  <Badge color="error"   dot>Offline</Badge>
                </>}
                code={`<Badge color="success" dot>Online</Badge>
<Badge color="warning" dot>Pending</Badge>
<Badge color="error"   dot>Offline</Badge>`}
              />
              <ExampleBlock
                label={ex.badgeIcon}
                preview={<>
                  <Badge color="info"    icon={Tag}        iconPosition="left">Neu</Badge>
                  <Badge color="success" icon={ShieldCheck} iconPosition="left">Verifiziert</Badge>
                  <Badge color="warning" icon={AlertCircle} iconPosition="left">Ausstehend</Badge>
                  <Badge color="neutral" icon={Star}        iconPosition="right">Featured</Badge>
                  <Badge color="error"   icon={Zap}         iconPosition="right">Kritisch</Badge>
                </>}
                code={`<Badge color="info"    icon={Tag}         iconPosition="left">Neu</Badge>
<Badge color="success" icon={ShieldCheck} iconPosition="left">Verifiziert</Badge>
<Badge color="warning" icon={AlertCircle} iconPosition="left">Ausstehend</Badge>
<Badge color="neutral" icon={Star}        iconPosition="right">Featured</Badge>`}
              />
              {pt(BADGE_PROPS)}
            </Section>

            {/* Changelog */}
            <Section id="changelog" title={s.sections.changelog.title} description={s.sections.changelog.desc} importStr={IMPORT_STRINGS.changelog}>
              <ExampleBlock
                label={ex.changelogStd}
                preview={
                  <div className="flex items-center gap-3">
                    <Changelog program="SimpleTailwindUI" version="v1.1.0" date="02.06.2026" path="/CHANGELOG.md" />
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                      {lang === "de" ? "← Info-Button klicken" : "← Click info button"}
                    </span>
                  </div>
                }
                code={`import { Changelog } from "@levin-the-doctor/simple-tailwind-ui"

<Changelog
  program="MeineApp"
  version="v2.3.0"
  date="02.06.2026"
  path="/CHANGELOG.md"
/>`}
              />
              <ExampleBlock
                label={lang === "de" ? "Einbindung — Peer-Dependency" : "Setup — peer dependency"}
                preview={
                  <div className="text-sm text-zinc-500 dark:text-zinc-400 flex flex-col gap-1">
                    <span>{lang === "de" ? "Zusätzliche Peer-Dependency notwendig:" : "Additional peer dependency required:"}</span>
                    <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded font-mono text-indigo-600 dark:text-indigo-400 w-fit">
                      npm install react-markdown
                    </code>
                  </div>
                }
                code={`npm install react-markdown

// CHANGELOG.md im /public-Ordner ablegen
// → wird per fetch() beim Öffnen des Modals geladen`}
              />
              {pt(CHANGELOG_PROPS)}
            </Section>

          </main>
        </div>
      </div>
    </div>
    </ToastProvider>
  );
}
