# PROLOOK Team Stores — HTML/SCSS handoff

Static, componentized codebase for the Team Stores MVP. No frameworks, no inline styles.

## Structure

```
/pages
  landing.html      Marketing landing (hero, dashboard mockup, features, FAQ, CTA)
  workspace.html    Rep dashboard — Overview (KPIs, revenue chart, windows, payouts)
  storefront.html   Consumer team store (Grizzlies Basketball)
/style
  _variables.scss   Design tokens (PROLOOK DS: zinc ramp + red accent)
  _mixins.scss      Breakpoints, layout, type mixins
  _global.scss      Reset + base element styles
  app.scss          Master entry — compile this
  app.css           Pre-compiled output (pages link this directly)
  /components       _buttons, _cards, _forms, _navigation
  /layouts          _header, _footer, _sections
  /pages            _landing, _workspace, _storefront
  /responsive       _mobile (≤767), _tablet (768–1024), _desktop (≥1280)
/assets
  /images  /icons  /fonts
```

## Compiling

```
sass style/app.scss style/app.css
```

A compiled `app.css` is included so the pages open in a browser with no build step.
After editing any partial, re-run the command above.

## Conventions

- BEM naming: `.block__element--modifier`
- All colors/spacing/type via tokens in `_variables.scss` — no magic values in partials
- Chart bar heights and progress widths are data-driven classes (see the bottom of
  `pages/_landing.scss` / `pages/_workspace.scss`), not inline styles
