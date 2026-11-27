# Bargain Beacon — Black Friday Deal Finder

[![Black Friday Deal Finder](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![Rank](https://make.fun/badge/black-friday-deal-finder-01/Alim-14-code/black-friday-deal-finder-01/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![Reward](https://make.fun/badge/black-friday-deal-finder-01/Alim-14-code/black-friday-deal-finder-01/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01)

A static Black Friday deal finder for the [black-friday-deal-finder-01](https://make.fun/bounty/black-friday-deal-finder-01) bounty on make.fun. 41 real deals, each price read at its store on 27 November 2026.

## What it is

**Bargain Beacon** lists Black Friday and Cyber Monday deals a shopper can actually act on: every deal shows its product, store, sale price, usual price, discount, saving, a link to the product at that store, and when its price was checked — plus an honest verdict on whether it is really a deal.

- **NEW LOW** — the lowest price tracked for that product (7 deals)
- **STRONG DEAL** — a genuine cut worth buying (27 deals)
- **ROUTINE SALE** — a fair price, not a record (7 deals)

Search and filters by category, store, minimum discount and verdict all work, with sorting by best deal, biggest % off, most dollars saved, or price. Each deal has its own page with the evidence behind its verdict, the source its price was read in, and the same product at other stores where a second price was verified.

## Deals, checked

All 41 deals were found and checked by the maker on 27 November 2026, reading the price at the store or in a deals source that names the store (9to5Mac, Tom's Guide, CNN Underscored, The Gadgeteer, BuzzFeed, ComicBook, Yahoo Shopping and others — each deal names its source on its page). Nothing here is invented: a price no store or source showed is not listed.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

No build step, no network loads: `app/` is plain static files, and the deals are data in `app/data.js`.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library (`vendor/makefun-frontend.ts`).

## Layout

- `app/index.html` — the page shell
- `app/main.js` — hash routing (`#/` list, `#/deal/<id>` detail) and control wiring
- `app/views.js` — list and detail HTML
- `app/filters.js` — search, filter and sort (pure functions)
- `app/verdict.js` — verdict labels, discount and money math
- `app/data.js` — the 41 checked deals
- `app/style.css` — the whole look, no framework
- `screenshots/` — 3 desktop + 1 phone render of the site itself
