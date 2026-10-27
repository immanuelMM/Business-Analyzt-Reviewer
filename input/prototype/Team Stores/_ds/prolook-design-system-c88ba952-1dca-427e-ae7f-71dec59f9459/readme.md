# PROLOOK Design System

Custom team sports apparel and uniform platform. Powers the account area, apparel customizer, team stores and ordering flows.

**Namespace:** `PROLOOKDesignSystem_c88ba9`
**Components:** 202 · **Tokens:** 547 · **Cards:** 17 · **Templates:** none

---

## Setup

```html
<link rel="stylesheet" href="styles.css">
<script src="_ds_bundle.js"></script>
```

```js
const { Button, Badge, Alert, AlertCircle, AlertTriangle,
  InputField, ModalInputField, DoubleInputField,
  Checkbox, RadioButton, Toggle, ColorPickerTile,
  NavItem, SideNavigation, TabItem, BrandLogo,
  BrowserHeader, ProgressIndicator, NotificationBadge,
  Icon, Avatar, Card, IconButton, Tag, Tabs
} = window.PROLOOKDesignSystem_c88ba9;
```

In a consuming project use paths under `_ds/<folder>/`.

---

## Brand

Monochrome + one red accent. Near-black (`#09090B`) on white, Tailwind Zinc ramp. `--red-500` is the only brand accent and doubles as the destructive color. Typeface: Gotham (Book 400, Medium 500, Bold 700). No gradients, no emoji. Motion: 120–200 ms `cubic-bezier(0.2,0,0,1)`.

---

## All components (202)

AccountLineItem, AdjustmentBarsHorizontal, AdjustmentBarsVertical, Alert, AlertCircle, AlertTriangle, Alignment, Archive, Archive2, ArchiveDownArrow, ArrowCircle, ArrowCircleDown, ArrowCircleLeft, ArrowCircleRight, ArrowCircleUp, ArrowDiagonalUpOnSquare, ArrowDown, ArrowDownOnSquare, ArrowDownOnSquareTrack, ArrowLeft, ArrowRight, ArrowRoundedSquare, ArrowTrendingDown, ArrowTrendingUp, ArrowUp, ArrowUpOnSquare, ArrowUturnLeft, ArrowUturnRight, Attach, AttentionBadge, Avatar, Badge, Banner, BarGraph, BarGraphBox, BarsFour, BarsThree, BarsTwo, BatteryPercentage, Bell, Bookmark, BrandLogo, BrandLogo2, Briefcase, Briefcase3, BrowserHeader, Button, ButtonOffOnSecondarySquare, ButtonOffOnTertiaryRounded5, Calendar, Cancel, Card, Caret, Cart, Cart3, CartPlus, CellThumbnail, ChatBubble, Check, Check2, CheckBox, CheckCircle, CheckCircle3, Checkbox, Chevron, ChevronDoubleDown, ChevronDoubleUp, ChevronDown, ChevronLeft, ChevronRight, ChevronRight2, ChevronUp, Clock, Close, CloseCircle, Collapse, CollapseNewSmall, ColorPickerTile, ColorSample, Column, Comment, Component1, Component2, Component3, Component4, Component5, Component6, Content, Customize, Dash, DealerInfo, DoubleInputField, Download, DropDownLineItem, DropToggleHeader, Duplicate, Edit, EllipsisHorizontal, EllipsisHorizontalCircle, EllipsisVertical, Envelope, Eraser, Example, Expand, Filter, Flow, Folder, FolderPlus, Frame19, Globe, Grid, GripDots, HeroiconsOutlineStar, HeroiconsOutlineTrash, History, Home, HoverLabel, HoverLabel2, Icon, IconButton, IconHover, IconsCaret, IconsCheckBox, Image, Image3, Image4, IndexCell, Info, InfoDot, InputField, Inventory, Lightbulb, Link, List, LockClosed, LockOpen, MODALFOOTER, MapPin, MapPin3, MenuBars, ModalInputField, ModalTemplate, MoveBars, NavItem, NavItem2, NotificationBadge, Notes, OpenInNewTab, Order, Page, Pencil, Percent, Phone, Pip, Plus, PlusCircle, Primary, Printer, ProgressIndicator, QuestionMark, Queue, RadioButton, Range, RectangleStack, Save, Scissors, Search, Send, Settings, Share, Shirt, ShoppingBag, ShoppingBag3, SideNavigation, Slot, Sort, Sparkles, Split, Stack, Star, StatusBarIPad, Swatch, TabItem, TableHeader, Tabs, Tag, Template, Text, Toggle, Toggle2, Trash, Trash2, Trophy, Trophy3, Upload, User, User2, Users, Users2, View, Wrench, Wrench3

---

## Tokens (547)

- `tokens/fonts.css` — Gotham `@font-face`
- `tokens/colors.css` — neutral ramp, accent, status, semantic aliases
- `tokens/typography.css` — type scale
- `tokens/spacing.css` — spacing, radii, shadows, motion

Key: `--zinc-50`…`--zinc-950`, `--red-500/600/700`, `--text-primary/secondary/muted`, `--surface-page/card/subtle`, `--border-default/strong`, `--radius-sm/md/lg/full`, `--shadow-xs/md/modal`

---

## Design cards (17)

Account App: 1 · Brand: 1 · Colors: 3 · Components: 7 · Icons: 1 · Spacing: 2 · Type: 2

---

## Icons

122 families · 732 SVGs in `assets/icons/svg/`. Naming: `{name}-{size}-{style}.svg`. Use `Icon` component. Browse: `assets/icons/icons.html`.

---

## Templates

None. `ui_kits/account/index.html` is a candidate for `templates/account/`.

---

## File structure

```
styles.css
tokens/
components/figma/      202 Figma-extracted components
components/core/       Card, Avatar, IconButton, Tag, Tabs
assets/icons/
assets/brand-logo.svg
ui_kits/account/
guidelines/
```
