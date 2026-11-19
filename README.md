# JRS Studios

Personal portfolio site for **Jonathan Rufus Samuel** — Systems & Infrastructure Engineer at CERN, founder of [Dijkstra](https://github.com/Dijkstra-Edu).

## Sections

- About — bio, education, resume / CV
- Experience
- Projects — folder-based project browser
- Research — publications & interests
- Activities
- Extras
- Contact

## Run locally

Static site — no build step. From the repo root:

```bash
# Python
python -m http.server 8000

# or Node
npx serve .
```

Then open `http://localhost:8000`.

### Organisation logos (logo.dev)

Organisation logos load from [logo.dev](https://www.logo.dev). Each logo is an `<img data-logo-domain="example.com">`, and [assets/js/logos.js](assets/js/logos.js) fills it in at runtime. Set your logo.dev publishable key (`pk_...`) in `LOGO_DEV_TOKEN` at the top of that file.

When logo.dev has no logo for a domain, the image falls back to its `data-logo-fallback` URL.

## Stack

- HTML / CSS / jQuery (Dimension-based template)
- Assets under `assets/`, images under `images/`, resumes under `Resumes/`

## License

GPL-3.0 — see [LICENSE](LICENSE).
