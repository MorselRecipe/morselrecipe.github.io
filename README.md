# Morsel - marketing site

The public website for **Morsel**, the app that saves recipes from any link and keeps
them (with macros) on your phone for offline cooking.

Built as a static site so it can be hosted for free on **GitHub Pages**. It mirrors
the app's **Morsel Design System** - paprika brand, basil/honey accents, warm "sand"
neutrals and warm "ink" text, with Bricolage Grotesque / Inter / Space Grotesk type.

## Pages

| File | Contents |
|------|----------|
| `index.html` | Hero, "how it works", **feature showcase**, spotlight sections, **contact form**, CTA |
| `privacy.html` | Full **privacy policy** |

Design tokens live in `assets/css/styles.css`; behaviour (theme toggle, scroll
reveal, contact form) in `assets/js/main.js`.

## Deploy to GitHub Pages

1. Push these files to the `MorselRecipe/morselrecipe.github.io` repo:
   ```bash
   git add .
   git commit -m "Morsel marketing site"
   git branch -M main
   git remote add origin git@github.com:MorselRecipe/morselrecipe.github.io.git
   git push -u origin main
   ```
2. On GitHub: **Settings → Pages → Build and deployment**, set **Source = Deploy
   from a branch**, branch **`main`**, folder **`/ (root)`**, then **Save**.
3. Your site goes live at `https://morselrecipe.github.io/` within a minute or two.

The `.nojekyll` file tells Pages to serve the files as-is (no Jekyll processing).

### Custom domain (optional)
Add a `CNAME` file containing your domain (e.g. `morselapp.com`) and point your DNS at
GitHub Pages per [GitHub's docs](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Wire up the contact form

The form works out of the box by **opening the visitor's email app pre-filled** -
no backend required. To collect submissions to your inbox instead:

1. Create a free form at [Formspree](https://formspree.io) (or similar).
2. In `index.html`, put your endpoint in the form's **`data-endpoint`** attribute.

`assets/js/main.js` submits via `fetch` when `data-endpoint` is set, showing an
inline success/error message. While it's empty, the script falls back to a
`mailto:` draft and leaves the fields filled.

> **Don't put the endpoint in `action`.** That attribute is only used when the
> script doesn't run, so it stays a `mailto:` deliberately. Pointing it at an
> endpoint that isn't live means a no-JS submit navigates to a 404 and throws
> away whatever the visitor typed.

The support address appears in `index.html`, `privacy.html`, and as
`SUPPORT_EMAIL` in `main.js` - change all three together.

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Assets

Logo, app icon and screenshot were copied from the Morsel app repo
(`../Morsel`). Replace the placeholder store screenshot / email address with your own
before launch.
