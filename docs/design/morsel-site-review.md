# Morsel marketing site — design review

> Reviewed 2026-07-23 · canon-version 2026-07 · full audit
> Surface: `index.html` (hero, how-it-works, feature showcase, two spotlights, contact, CTA band, footer) and `privacy.html`.
> Evidence: rendered pages via headless Chromium at 320 / 390 / 640 / 1440 px, light and dark, JS on and off; computed contrast, target sizes, focus order, anchor landings, and reflow measured from the live DOM. Source read second.

## Status — 2026-07-23

**All four blockers fixed and re-verified against the live render.** Findings below are kept as the original record; the majors, minors and polish items are untouched.

| ID | Fix | Verified |
|---|---|---|
| B1 | `[data-early-access]` reveals an inline fallback panel on every click, carrying the address as selectable text plus a working copy control — the CTA can no longer produce nothing | Panel hidden → visible on click; `role="status"`; clipboard reads `morselrecipeapp@gmail.com`; panel text 9.17:1 light / 12.57:1 dark |
| B2 | Endpoint moved to `data-endpoint`; `action` is now `mailto:` + `enctype="text/plain"` so a no-JS submit can never POST into a dead URL. `<noscript>` added; `YOUR_FORM_ID` gone from the page | No-JS `action` = `mailto:morselrecipeapp@gmail.com`; live submit keeps Name/Message filled and reports `info`, not `ok` |
| B3 | New `--brand-solid` / `--brand-solid-hover` (paprika-600/700) for any brand fill carrying a label; `--paprika-500` kept for decorative fills | Primary button **4.91:1** and step badge **4.91:1** in both themes (were 3.64 / 3.11) |
| B4 | `--success-fg` / `--danger-fg` / `--info-fg` paired per theme; `.form-status` bound to them | ok **5.59 → 5.78**, err **5.89 → 5.95**, info 14.15 / 15.05 — all pass in both themes (dark was 2.09 / 2.95) |

Also swept up in the same edits: **m14** (the `mailto:` path now reports `info` rather than dressing an unverifiable handoff as success) and the stale Formspree instructions in `README.md`.

### Majors — all ten fixed, one partially

| ID | Fix | Verified |
|---|---|---|
| M5 | Hamburger + disclosure panel added to both pages; `Get the app` moves into the panel so the bar still fits at 320px | Toggle visible at 390px, `aria-expanded` and icon swap correct, closes on link click / Escape / resize; panel links **342×51**; no overflow at 320px |
| M6 | `.reveal` is visible by default and only hidden under `html.js`, plus a 3s backstop that un-hides if `main.js` never runs | **0 of 22** reveal elements hidden with JS off, and 0 hidden when `main.js` is blocked |
| M7 | `html { scroll-padding-top: 84px }` | Shift-tab sweep of 16 stops returns **no** element obscured by the header (was Name + Email) |
| M8 | Same property | Mobile anchor landings now at **144–145px** against a header bottom of 69px (were 60–63) |
| M9 | New `--border-interactive` (`--sand-500` #9C8A76 light / #6A6A72 dark) on inputs, ghost button, theme toggle | Input border **3.33 / 3.17**, ghost + toggle **3.23 / 3.57** — all clear 3:1 (were 1.19–1.70) |
| M10 | Five paired accent roles (`--accent-*-fg` / `--accent-*-tint`); `.ico`, `.macro`, `.feature-list .check` bound to them. Dead `--accent` / `--fresh` removed | Dark chip luminance spread **27× → 2.3×** (0.024–0.056, was 0.024–0.801); all macro-value contrast failures gone in both themes |
| M11 | `Early access` restored to the Topic select, revealing a Google Play email field that the `mailto:` body now carries | Option present; field hidden by default, reveals on selection, clears and re-hides on switch away |
| M12 | **Partial.** Dark `--surface-sunken` widened to #1A1A1D; `.tint` / `.spotlight` borders raised to `--border-strong` | Band fill 1.06 → **1.10**, band border 1.34 → **1.70**. See caveat below |
| M13 | `.contact-links a` set to `inline-block` with `padding-block: 3px` | **33px** tall, up from 20px; the small-target list is now empty |
| M14 | Dropped the `grid-row: 1` reorder and tightened the mockup to `min(460px, 88%)` below 820px | At 390×844 the h1 moves from **518px → 137px**; both CTAs now sit at 379–493, well inside the fold |

**M12 caveat.** Luminance ratios compress hard at the near-black end: with `--bg` at #0F0F10, no fill lighter than #1A1A1D can exceed ~1.10:1 without becoming brighter than `--card` and inverting the raised/sunken relationship. The band separation is therefore carried by the border (now 1.70:1) rather than the fill. Getting a bigger fill step would mean re-pitching the whole dark surface ladder, which is a larger design decision than this finding warrants.

Swept up alongside: **m4** (macro values), **m9** (reveal transition 600ms → 250ms), **m10** (Privacy link restored to the privacy page's nav with `aria-current="page"`), and part of **m11** (`aria-hidden` added to the two toggle icons, not yet to the decorative feature/contact icons).

### Contrast minors — cleared

| ID | Fix | Verified |
|---|---|---|
| m1 | New `--brand-text` (paprika-700 light / paprika-400 dark) for brand-coloured small text — eyebrows, links, and the nav/footer hover states. `--brand` stays paprika-500 for the 74px headline accent and the stat numerals, which are large text at 3:1 | Eyebrows **3.31–3.53 → 6.35–6.74** |
| m2 | `--ink-500` #7A6E64 → **#6E6359** and `--ink-400` #9A8E82 → **#786C62**; dark `--faint` #7C7C82 → **#949499** | hero note, form hint, footer legal and contact captions all clear 4.5:1 in both themes |
| m3 | CTA band moved to `--brand-solid`; sub-copy uses a new hand-tinted `--on-brand-muted` instead of fading white to transparent | **2.91 / 2.56 → 4.60** in both themes |

**A full sweep of both pages in both themes now returns zero contrast failures and zero undersized targets.**

Two notes on this batch:

- **m3 was not in the list I gave you.** It failed the whole time, but my scripted sweep parses `rgb()` and missed the `color-mix()` on `.cta-inner p` — it only ever showed up in the targeted check. Fixed now, and worth remembering the sweep has that blind spot.
- **The light theme can no longer carry three distinct text tiers by colour alone.** At 4.5:1 on cream, the window between "muted" and "faint" is about 0.006 in luminance. `--muted` and `--faint` are now one step apart rather than the three they implied, and the tertiary tier leans on the 13px size difference the CSS already applied. Dark has more headroom and keeps a genuine third tier.
- The four inline links on the privacy page still measure 20px tall. That is a **pass**, not an outstanding item: WCAG 2.5.8's inline exception covers targets inside a sentence, which these are (unlike the standalone `.contact-links` list on the home page, which was M13).

**Not fixed — still open:** the residual excise in B1. The *form* route now collects the Play Store address in a field, but the hero and CTA-band buttons still open a `mailto:` whose body asks the visitor to type it themselves. Pointing those two buttons at `#contact` would close it — deliberately not done, since the last commit moved them to the email link on purpose. Everything else in the findings below stands.

## Summary

The site is well-made at the level a visitor consciously notices: the type pairing is confident, the warm sand/paprika palette is genuinely distinctive rather than default-AI, the copy is short and concrete, and the structural bones — heading order, image alt text, reflow at 320 px and at 200 % zoom — are clean on both pages. The Aesthetic-Usability Effect is doing real work here, and it is also the problem: the polish is convincing enough to mask that the page's single most important action does not reliably do anything.

Three failures sit on the critical path. The primary conversion — **Get early access**, appearing twice — is a bare `mailto:` that produces no visible response at all on a machine with no mail client configured, and which asks the visitor to hand-type their Google Play address into a body template the system could have collected in a field. The contact form's `action` is still the literal placeholder `https://formspree.io/f/YOUR_FORM_ID`, so any submit that isn't intercepted by JavaScript navigates the visitor away to a 404 and destroys what they typed. And every primary button on the site — white on `--paprika-500` — measures 3.64:1 in light and 3.11:1 in dark against a 4.5:1 requirement, so the buttons carrying those actions also fail WCAG 1.4.3.

Underneath that is one structural cause worth fixing before the individual symptoms: `--accent` and `--fresh`, the two semantic tokens that *are* defined for both themes, have **zero usages** in the stylesheet. Every accent-bearing component — macro chips, feature icon chips, form status messages, the checklist ticks — binds instead to raw palette steps that have no dark override. The measured consequence is that five sibling icon chips span 27× in luminance in dark mode, and the form's only success/error channel drops to 2.09:1 there. Repairing the token binding resolves M6, B4, m4 and part of M4 in one pass.

The rest is ordinary and fixable: navigation vanishes below 860 px with nothing to replace it, everything below the hero is invisible without JavaScript, and the sticky header eats both keyboard focus and every in-page anchor landing on mobile.

---

## Findings

### Blocker

**B1 · Primary conversion is a `mailto:` dead end** — *Hero + CTA band*
`Get early access` (index.html:76, index.html:293) is a `mailto:` link carrying a pre-written body. On a desktop with no mail handler registered the click produces no navigation, no feedback, and no state change whatsoever — the user presses the loudest button on the page and cannot tell whether anything happened. The body template also instructs them to type their Google Play address by hand, which is bookkeeping the system should absorb.
*Norman: Gulf of Evaluation; Nielsen #1 visibility of system status; Cooper: eliminate excise; Tesler's Law.*
**Fix:** replace with an on-page early-access form (name + Play Store email) posting to the same endpoint as the contact form, with visible submitting / success / error states. Keep `mailto:` demoted to a secondary "or email us directly" link beneath it.

**B2 · Contact form destroys user input when JavaScript doesn't run** — *Contact*
`action="https://formspree.io/f/YOUR_FORM_ID"` (index.html:256) is unmodified placeholder text. Verified with `javaScriptEnabled: false`: the attribute is still the placeholder, so a native submit POSTs to a non-existent Formspree form, navigates away to a 404, and the typed message is gone with no back-path.
*Cooper: treat input as sacred; Nielsen #5 error prevention, #9 recover from errors.*
**Fix:** wire the real Formspree ID; until then remove the `action` attribute entirely so the JS `mailto:` path is the only route, and add a `<noscript>` block naming the support address.

**B3 · Primary button text fails 1.4.3 everywhere** — *All screens*
White on `--paprika-500` (#E8552D) measures **3.64:1** light and **3.11:1** dark at 16–17 px / 600 weight — below the 4.5:1 floor and not eligible for the large-text exception (needs ≥24 px, or ≥19 px bold). Affects `Get the app` ×2, `Get early access` ×2, `Send message`, and the three numbered step badges (15 px / 700).
*WCAG 1.4.3; gates.md text-contrast row.*
**Fix:** set the button fill to `--paprika-600` (#C8431F → white ≈ 5.3:1) in light and to a darkened paprika in dark. Keep `--paprika-500` for decorative fills that carry no text.

**B4 · Form success and error messages are illegible in dark mode** — *Contact*
`.form-status.ok` measures **2.09:1** and `.form-status.err` **2.95:1** in dark (styles.css:559–560). Both bind to `--basil-500/600` and `--paprika-500/600`, which have no dark override, over a `color-mix` background that also doesn't adapt. The only channel that tells a visitor whether their message sent cannot be read.
*WCAG 1.4.3; Nielsen #1, #9; Norman: Gulf of Evaluation.*
**Fix:** add `--success-fg/--success-bg` and `--danger-fg/--danger-bg` token pairs defined for both themes, and bind `.form-status` to them.

### Major

**M5 · Navigation disappears below 860 px with no replacement** — *All screens, mobile*
`@media (max-width: 860px) { .nav-links .link { display: none } }` (styles.css:277–279) hides all four nav links. `.nav-toggle { display: none }` is styled but **no `.nav-toggle` element exists in either HTML file** — the hamburger was never built. Verified at 390 px: the header contains only the logo, the theme toggle, and `Get the app`. Section navigation survives only in the footer, twelve screens down.
*Krug: always answer "where can I go"; Nielsen #4 consistency and standards; Jakob's Law.*
**Fix:** add a `<button class="nav-toggle">` with an `aria-expanded` disclosure panel listing the same four links, or — given only four short links — let them wrap to a second header row instead of hiding.

**M6 · Everything below the hero is invisible without JavaScript** — *Home*
`.reveal { opacity: 0 }` (styles.css:635) is cleared only by the IntersectionObserver callback. There is a fallback for a *missing* IntersectionObserver but none for JavaScript failing, being blocked, or erroring. Verified with JS disabled: the stats band, all three steps, all nine feature cards, both spotlights, the contact form and the CTA band render as blank space.
*Nielsen #1; Rams: honest; progressive enhancement.*
**Fix:** invert the default. Ship `.reveal` visible, add `document.documentElement.classList.add('js')` as the first inline script in `<head>`, and gate the hidden state behind `.js .reveal { opacity: 0 }`.

**M7 · WCAG 2.4.11 Focus Not Obscured — fail** — *Contact*
Shift-tabbing upward through the page lands the Name and Email inputs at `top: 8px, bottom: 56px` while the sticky header's bottom edge is at `69px` — the focused field is entirely underneath it. No `scroll-margin-top` or `scroll-padding-top` is set anywhere.
*WCAG 2.4.11; gates.md focus row.*
**Fix:** `html { scroll-padding-top: 84px }` (header 68 px + 16 px breathing room).

**M8 · In-page anchors land under the sticky header on mobile** — *Home, ≤ 820 px*
At 390 px the section padding collapses to `clamp(56px, 9vw, 112px)` → 56 px, less than the 68 px header. Measured landings: `#how` eyebrow at 63 px, `#features` at 60 px, `#contact` at 61 px, all against a header bottom of 69 px — the section label the visitor clicked to reach is hidden. Reached via the footer links and the hero's `See how it works`. Passes at 1440 px (116–118 px) only because the padding is larger there.
*Krug: unmissable page names; Norman: Gulf of Evaluation.*
**Fix:** same `scroll-padding-top` as M7.

**M9 · WCAG 1.4.11 Non-text contrast — fail across form controls** — *Contact, header*
Measured against the surface each sits on, all below the 3:1 floor:

| Element | Light | Dark |
|---|---|---|
| Text input border vs card | 1.23 | 1.19 |
| Text input fill vs card | ~1.05 | — |
| Ghost button border vs page | 1.42 | 1.70 |
| Theme-toggle border vs page | 1.42 | 1.70 |
| Feature-card border vs page | 1.20 | 1.34 |

Visible in the render: the form fields read as faint cream smudges whose only real signifier is the placeholder text — and placeholder text vanishes the moment you type.
*WCAG 1.4.11; Norman: signifiers over labels; Refactoring UI: diagnose spacing → alignment → contrast.*
**Fix:** add a `--border-interactive` token at ≥3:1 (light ≈ #8C7B67, dark ≈ #5A5A62) for inputs, the ghost button and the theme toggle. `--border` may stay decorative for card edges, which are not component-identifying.

**M10 · Dark mode is not designed in pairs for accent components** — *Features, spotlight, contact*
`--accent` and `--fresh` — the theme-paired semantic tokens — have **zero usages** in `styles.css`. `.macro.*`, `.ico.*`, `.form-status.*` and `.feature-list .check` bind directly to raw palette steps (`--paprika-100`, `--paprika-500`, `--honey-600`, `--basil-500`, `--sand-200`, `--blueberry`) that carry no `[data-theme='dark']` override. Measured luminance of the five sibling icon chips in dark: paprika **0.768**, sand **0.801**, honey 0.209, basil 0.101, blueberry **0.029** — a 27× spread across elements that are the same role, plainly visible as two glowing pastel tiles among seven muted ones.
*ui-canon: dark mode designed in pairs, never inverted; Law of Similarity; M3 token architecture.*
**Fix:** route every accent-bearing component through a semantic token with a dark counterpart. This is the root cause behind B4, m4 and part of M9 — fix it once.

**M11 · The contact section invites early access the form cannot express** — *Contact*
The copy reads "Questions, feedback, a bug, or **want in on early access**? Drop us a line" (index.html:230), but the Topic select offers only General question / Bug report / Feature request / Privacy & data. A visitor who arrives wanting early access has no way to say so, and the site's only early-access route is the `mailto:` of B1.
*Nielsen #4 consistency; Mental Model; Cooper: never make the user feel stupid.*
**Fix:** restore an "Early access" option and, when selected, reveal a Google Play email field — which also gives B1 its on-page destination.

**M12 · Section-band rhythm is imperceptible in dark mode** — *All sections*
`.tint` / `.spotlight` measure **1.06:1** against the base page background in dark (1.07 light), and the 1px `border-block` meant to carry the boundary is itself at 1.34:1. The alternating-shade structure that organises the light page — which works well there because the cards supply the contrast — collapses into one flat black field.
*Law of Common Region; Law of Uniform Connectedness; dark-mode-in-pairs.*
**Fix:** widen the dark surface step (`--surface-sunken` #1A1A1D or lighter against `--bg` #0F0F10) and raise the band border to the new `--border-interactive`.

**M13 · WCAG 2.5.8 Target Size — fail on contact links** — *Contact*
The three links in `.contact-links` measure 20 px tall (`morselrecipeapp@gmail.com` 241.4×20, `Report a bug` 104.9×20, `Privacy policy` 115.2×20) against a 24×24 minimum. The "inline" exception does not apply — these are standalone list items, not links inside a sentence.
*WCAG 2.5.8; Fitts's Law; gates.md target-size row.*
**Fix:** `padding-block: 4px` on `.contact-links a`, or make the whole `li` row the target — the 42 px icon is already adjacent and would then be part of the hit area.

**M14 · Mobile hero buries the value proposition below the app screenshot** — *Home, ≤ 820 px*
At 390×844, `.phone-shell` is reordered to `grid-row: 1` and occupies 117–458 px. The `<h1>` does not begin until **518 px**; the secondary CTA sits at 823–874 and the offline note at 890 — both below the fold. With typical mobile browser chrome (~730 px usable), the primary CTA lands at the very bottom edge of the first screen. The first thing a phone visitor sees is a screenshot of an app they have not been told the purpose of.
*Krug: self-evidence within seconds; Serial Position Effect; Fitts's Law.*
**Fix:** drop the `grid-row: 1` reorder so the headline leads on mobile, or crop the mockup to a single phone at ~55 % height for widths under 820 px.

### Minor

**m1 · Eyebrow labels fail text contrast** — brand orange at 13 px / 700 measures 3.31–3.53:1 on both surfaces (`How it works`, `Feature showcase`, `Nutrition`, `Your kitchen`, `Contact us`). *WCAG 1.4.3.* Use `--paprika-700` for the eyebrow role, or raise it to 19 px bold to qualify as large text.

**m2 · Muted and faint body text fails** — hero-note 3.10:1, form-hint 3.20:1, footer-legal 2.91:1, contact-link captions 2.91:1 (light); 4.10–4.36:1 in dark. *WCAG 1.4.3.* Darken `--faint` to roughly #6E6259 light / #9A9AA2 dark, or stop using it for anything that must be read.

**m3 · CTA band sub-copy fails** — `color-mix(in srgb, #fff 82%, transparent)` over paprika measures 2.91:1 light / 2.56:1 dark at 19 px (styles.css:579). *WCAG 1.4.3; Refactoring UI: no grey text on color.* Use full white, or a hand-tinted lighter paprika shade rather than a transparency fade.

**m4 · Macro chip values fail** — carbs (`--honey-600` on white) 2.76:1 light; protein 3.48:1 and fat 3.73:1 in dark. Resolved by M10. *WCAG 1.4.3.*

**m5 · Nine equal-weight feature cards, no hierarchy** — every card carries identical weight, border, shadow and type scale, so nothing is recoverable after scanning; the two genuinely differentiating features (Cook mode, USDA cross-check) sit at positions 5 and 8, the least-remembered part of the sequence. *Hick's Law; Choice Overload; Serial Position Effect; Von Restorff; Refactoring UI: hierarchy over uniformity.* Promote three to a larger first row and mute the remaining six, or cut to six and move the rest into the spotlight copy.

**m6 · The stats band borrows metric grammar for feature counts** — the row is styled as a traction/social-proof band (large numeric display face, brand color, four columns) but reports `4 Smart categories`, `100% Offline browsing`, `4 Macros per recipe`, `∞ Custom folders`. Two of the four are literally "4", and "4 macros per recipe" is arithmetic, not an achievement. *Rams: honest; Selective Attention.* Either replace with real numbers once they exist, or restyle as a plain feature strip that doesn't cash a cheque the content can't cover.

**m7 · "Offline" is stated five times** — hero sub-headline, hero note, stats band, the `Works offline` feature card, and the organise spotlight. *Krug: omit needless words; Nielsen #8.* Keep the hero note and the feature card; cut the other three.

**m8 · Line measure off target** — measured: hero-sub 36 ch, feature-card copy 36 ch, section-head paragraph 34 ch at mobile — all well under the 45-character floor, producing choppy 4-line blocks; privacy body copy runs 80 ch, above the 75 ceiling. *Refactoring UI: 45–75 characters.* Raise `.hero-sub` from `max-width: 30ch` to ~42ch; narrow `.doc` from 780 px to ~700 px.

**m9 · Reveal animation runs 600 ms** — `transition: opacity 0.6s, transform 0.6s` (styles.css:635) is double the 300 ms motion ceiling. *gates.md motion row; M3/HIG.* Reduce to 250 ms. (`prefers-reduced-motion` is correctly honoured — that part passes.)

**m10 · Privacy page's header nav omits the Privacy link** — index.html carries How it works / Features / Contact / **Privacy**; privacy.html carries only the first three. Navigation changes shape between pages, and the page you are on is the one that vanished. *WCAG 3.2.3 Consistent Navigation; Nielsen #4; Krug: "you are here".* Add the link and mark it current with `aria-current="page"`.

**m11 · Decorative icon instances lack `aria-hidden`** — the sprite root is correctly hidden, but every `<svg class="i"><use …></svg>` instance (contact icons, feature icons, checklist ticks, the footer utensils) is exposed to assistive tech as an unlabelled graphic. *WCAG 1.1.1.* Add `aria-hidden="true" focusable="false"` to `.i` instances.

**m12 · No skip link** — keyboard users traverse seven header controls before reaching content on every page load. *WCAG 2.4.1.* Add a visually-hidden `Skip to content` anchor as the first focusable element.

**m13 · `og:image` is a relative path** — `content="assets/img/icon.png"` (index.html:14). Open Graph requires an absolute URL, so shared links will render with no image — the funnel's first impression, blank. *Peak-End Rule (the entry peak).* Use the full `https://…` URL.

**m14 · The `mailto:` fallback reports success it cannot verify** — `showStatus('ok', 'Opening your email app…')` fires unconditionally (main.js:79), the form is never reset, and that path has no error branch at all. The hedge ("if nothing happens, write to…") is honest, but it is styled as a success. *Nielsen #1; Rams: honest.* Style it as a neutral/info state rather than `ok`, and keep the address selectable as text.

### Polish

**p1** · `.btn { border-radius: 15px }` matches none of the six radius tokens (6 / 10 / 14 / 20 / 28 / 999). Use `--r-md`.
**p2** · The same logo mark is rendered at `border-radius: 9px` in the header and `8px` in the footer (styles.css:255, 596). *Law of Similarity.*
**p3** · Dead tokens declared and never referenced: `--r-xs`, `--r-sm`, `--s-xs`, `--shadow-lg`, `--accent`, `--fresh`. The last two are the ones M10 needs.
**p4** · Off-scale padding against the 4/8/12/16/20/24/32 scale: `.btn` 9/22, `.btn-lg` 11/26, `.field input` 13/15, `.macro` 8/16, plus 10 px and 6 px gaps.
**p5** · Off-scale type: `15.5px` and `16.5px`, within roughly twelve distinct sizes and no type-scale token at all — only the three font families are tokenised.
**p6** · Raw `#fff` three times in `.cta-inner` (styles.css:578–580) where `--on-brand` already exists.
**p7** · Four inline `style=` attributes (index.html:189, 190, 212; privacy.html:120) hand-roll a "small section h2" role that `.contact-copy h2` already defines with the identical `clamp(28px, 4vw, 42px)`. Name the role once as a class.

---

## Screen × state inventory

| Screen | Empty | Loading | Error | Success |
|---|---|---|---|---|
| Home (`index.html`) | n/a — static content | **Missing.** Pre-JS state is `opacity: 0` on everything below the hero (M6); no `<noscript>` | **Missing.** JS failure has no fallback path | n/a |
| Privacy (`privacy.html`) | n/a | n/a — no JS dependency for content | n/a | n/a |
| Contact form | Designed — labels + placeholders present, though the field boundary itself fails 1.4.11 (M9) | Partial — `Sending…` + disabled button on the `fetch` path; **nothing at all** on the live `mailto:` path | Designed in CSS but **illegible in dark** (B4) and unreachable on the live path; no-JS path destroys input (B2) | Designed but same dark-mode failure; `mailto:` path reports unverifiable success (m14) |
| Early access (`mailto:`) | n/a | **Missing** | **Missing** — silent failure is the default outcome (B1) | **Missing** — no confirmation of any kind |

---

## Hard gates

### Accessibility

| Gate | Threshold | Verdict | Evidence |
|---|---|---|---|
| Text contrast | ≥ 4.5:1 (≥ 3:1 large) | **FAIL** | 23 failures light, 14 dark. Worst: form-status ok 2.09, cta sub-copy 2.56, macro carbs 2.76, footer-legal 2.91, primary buttons 3.64/3.11 (B3, B4, m1–m4) |
| Non-text contrast | ≥ 3:1 icons, borders, focus | **FAIL** | Input border 1.23/1.19, ghost + toggle border 1.42/1.70, card border 1.20/1.34, band border 1.34 (M9, M12) |
| Target size | ≥ 24×24 CSS px | **FAIL** | Three `.contact-links` anchors at 20 px tall (M13). All other controls pass; nav links exactly 24 px |
| Focus visible | WCAG 2.4.7 | **PASS (caveat)** | UA default ring present on all controls (`auto 1px rgb(0,95,204)`); no `:focus-visible` style is authored, so the ring is browser-blue on warm cream and unverified against the brand |
| Focus not obscured | WCAG 2.4.11 | **FAIL** | Name/Email land at top 8–56 px under a header whose bottom is 69 px (M7) |
| Color not sole carrier | WCAG 1.4.1 | **PASS** | Macro chips pair color with a text unit label; status messages carry text; theme toggle swaps both icon and `aria-label` |
| Reflow | 200 % zoom, 320 px | **PASS** | No horizontal overflow measured at 320 px or 640 px on either page; `scrollWidth === innerWidth` in all four runs |
| Keyboard operable | WCAG 2.1.1 | **PASS** | All controls reachable and operable by tab; logical order; no traps |
| Errors named in text + fix | WCAG 3.3.1 / 3.3.3 | **FAIL** | Native `required` covers empty fields, but submit failure has no programmatic error on the live path and no-JS submit destroys input without any message (B2, B4) |
| Redundant entry | WCAG 3.3.7 | **PASS** | No information is re-requested within a flow. Noted separately: the early-access `mailto:` asks the user to supply data the site never gave itself a way to collect (B1) |

### Performance and motion

| Gate | Threshold | Verdict | Evidence |
|---|---|---|---|
| Interaction responsiveness | INP < 200 ms p75 | **NOT MEASURED** | No field data available; static page with ~100 lines of JS and one IntersectionObserver — low risk, but unverified |
| System response | < 400 ms or covered | **FAIL** | `mailto:` path emits no feedback at all (B1, m14). The `fetch` path is correctly covered with `Sending…` |
| AI first token | < ~800 ms | **N/A** | No AI-mediated interface on this surface |
| Motion | 150–300 ms, honors `prefers-reduced-motion` | **PARTIAL** | Media query correctly honoured for `.reveal` and `scroll-behavior` (pass); `.reveal` transition is 600 ms, double the ceiling (m9) |
| Loading coverage | No bare spinner past 1 s | **PASS** | No spinners used; button-label swap instead |

---

## Principle coverage

| Principle | Verdict | Evidence and finding |
|---|---|---|
| Aesthetic-Usability Effect | ⚠️ Flagged | Craft level is high enough to disguise B1/B2; polish separated from task success — task success fails |
| Choice Overload | ⚠️ Minor | Nine undifferentiated feature cards (m5) |
| Chunking | ✅ Pass | Steps, features and privacy sections are cleanly grouped; privacy `h2` rules give strong chunk boundaries |
| Cognitive Bias | ⚠️ Minor | Stats band borrows metric credibility for feature counts (m6); no dark pattern present |
| Cognitive Load | ✅ Pass | Short copy, one idea per card, no jargon |
| Doherty Threshold | ❌ Fail | `mailto:` path gives zero feedback (B1); `fetch` path correctly covered |
| Fitts's Law | ❌ Fail | 20 px contact-link targets (M13); mobile primary CTA at the fold edge (M14) |
| Flow | ✅ Pass | Single uninterrupted scroll; no modes or interruptions |
| Goal-Gradient Effect | ➖ N/A | No multi-step task on this surface |
| Hick's Law | ⚠️ Minor | Nine equal-weight features (m5); nav is appropriately short at four items |
| Jakob's Law | ❌ Fail | Missing mobile nav breaks the universal hamburger expectation (M5); logo-left / CTA-right conventions otherwise correct |
| Law of Common Region | ❌ Fail | Section bands at 1.06:1 in dark; card and input borders below 3:1 (M9, M12) |
| Law of Proximity | ✅ Pass | Spacing does the grouping work before borders throughout |
| Law of Prägnanz | ✅ Pass | Icon set is a single coherent line style; no ambiguous forms |
| Law of Similarity | ❌ Fail | Five sibling icon chips span 27× luminance in dark (M10); one logo mark at two radii (p2) |
| Law of Uniform Connectedness | ⚠️ Minor | Band borders that connect sections measure 1.34:1 in dark (M12) |
| Mental Model | ❌ Fail | Copy invites early access the form cannot express (M11); "Get the app" and "Get early access" resolve to different destinations for one intent |
| Miller's Law | ✅ Pass | No arbitrary caps; four nav items, four stats, three steps |
| Occam's Razor | ⚠️ Minor | "Offline" stated five times (m7); four inline styles duplicating an existing class (p7) |
| Paradox of the Active User | ✅ Pass | No upfront learning required; the page is immediately actionable |
| Pareto Principle | ⚠️ Flagged | The 20 % that matters is the early-access conversion, and it is the least-finished part of the page (B1) |
| Parkinson's Law | ✅ Pass | Contact form is four fields with sensible autocomplete on name and email |
| Peak-End Rule | ❌ Fail | The ending is the CTA band, whose button is the silent `mailto:` (B1); no success state exists anywhere in the funnel; `og:image` breaks the entry impression (m13) |
| Postel's Law | ✅ Pass | Form accepts free-form input; no format policing |
| Selective Attention | ⚠️ Minor | Stats band reads as decorative promotion rather than goal-relevant signal (m6) |
| Serial Position Effect | ⚠️ Minor | Differentiating features buried at positions 5 and 8 (m5); mobile hero puts the proposition last (M14) |
| Tesler's Law | ❌ Fail | Early-access complexity is pushed onto the user — hand-typing a Play Store address into a mail body the system should have collected in a field (B1) |
| Von Restorff Effect | ⚠️ Minor | The primary CTA is correctly the only loud element, but nine identical feature cards leave nothing memorable (m5) |
| Working Memory | ✅ Pass | Nothing must be carried between screens; single-page scroll keeps context visible |
| Zeigarnik Effect | ➖ N/A | No interruptible or resumable task on this surface |

### Not applicable

- **AI-product sweep (§7)** — the site *describes* an AI-backed extraction feature but presents no AI-mediated interface: no streaming, no probabilistic output rendered, no open input, no agentic surface. Skipped in full. Worth recording as a pass on one adjacent point: the copy consistently marks estimated macros as estimates ("estimated when the source doesn't state them", "Morsel estimates"), which is the honest confidence signalling `modern-ux.md` asks for.
- **Goal-Gradient, Zeigarnik** — no multi-step or resumable flow exists on a two-page marketing site.

### Not reviewed

- **INP / real-world responsiveness** — no field data; not measurable from a local static server.
- **Screen-reader pass** — no VoiceOver/NVDA run was performed. Structural prerequisites were checked and pass (heading order `h1 → h2 → h3` with no skips on both pages, zero images missing `alt`, `lang="en"`, `aria-live` on the form status, labelled nav landmarks), but announcement quality is unverified.
- **Real `mailto:` handoff behaviour** — B1's failure mode is described from the mechanism (no registered handler → no navigation, no event); it was not reproduced against a live OS mail client.
- **Font-loading behaviour** — Google Fonts uses `display=swap`, so a FOUT is expected; the visual impact of the swap was not measured.

---

## Recommended order of work

1. **B2** — one attribute; stops destroying user input today.
2. **M10** — bind accents to theme-paired tokens. Resolves B4, m4 and part of M9 in one change.
3. **B3 + m1–m3** — one palette decision (paprika-600 for text-bearing surfaces, paprika-700 for eyebrows, darker `--faint`) clears most of the contrast table.
4. **B1 + M11** — build the on-page early-access form; the two findings share a fix.
5. **M7 + M8** — one line: `html { scroll-padding-top: 84px }`.
6. **M5, M6, M9, M12, M13, M14** — mobile nav, no-JS fallback, interactive border token, dark surface step, target padding, hero order.
7. Minors and polish.
