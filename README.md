# DID90° Agency — website

Next.js 16 + Sanity, design based on the Drkst® Framer template (by Danny).

- Languages: `/` O‘zbekcha (default), `/ru` Русский, `/en` English
- Admin panel (Sanity Studio): `/studio`
- Content lives in Sanity project `qeffq8u8`, dataset `production`

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Structure

- `src/app/(site)/[lang]` — public pages
- `src/app/(studio)/studio` — embedded Sanity Studio
- `src/sanity/schemaTypes` — CMS content model (all text fields have uz/ru/en)
- `src/i18n` — UI strings for the three languages
- `src/components/home` — sections of the home page (Hero with 3D lanyard, Services, Process…)
