# Baby Name Generator

Helping techies name their kids since 2019.

> For Anna and Cora. This app may have saved you from being named
> [**Tomax** and **Xamot**](https://en.wikipedia.org/wiki/Tomax_and_Xamot).

![Baby Names Catalog View](docs/search.png)
👉 [Try it live](https://baby-names-ecru.vercel.app/)

An editorial-style baby name catalog built on Social Security
Administration data (1880-2024) presented as a curated shortlist with
editorial categories like "Rare, not odd" and "Vintage revival".
Originally built in 2019 when Meg and I were expecting twin daughters;
rebuilt in 2026 with a modern stack and a more polished design system
(because I'm feeling a little sentimental as the girls turn 7).

![Corkboard View](docs/corkboard.png)

Pinned candidates render as nametags on a corkboard meant to mirror
how parents actually live with shortlisted names.

## Tech stack

Built with React, Vite, and Tailwind. Name data comes from a custom
pipeline that pulls from the Social Security Administration's annual
dataset.

## Running it locally

```bash
> yarn install
> yarn dev
```

## Data

Names come from the [Social Security Administration's national baby
names dataset](https://www.ssa.gov/oact/babynames/limits.html), which
records every name given to at least five US-born children in a given
year, going back to 1880.

The pipeline lives in `scripts/build-candidates.ts`. Run it with:

```bash
> yarn build:data
```

It downloads the SSA zip, parses 145 `yobYYYY.txt` files, aggregates
per `(name, sex)` pair across all years, computes a five-year trend
slope (linear regression of rank against year), and tags each name
with the heuristics that drive the curated tabs:

- **Rare, not odd** — currently rank 500–1500 with real historical use
  (≥1,500 total uses)
- **Vintage revival** — peaked ≥50 years ago, faded, currently trending up
- **Sweet-spot rising** — currently rank 100–800 and trending up
- **Just emerging** — first appeared after 1985, in the top 1000, not falling
- **Long-arc classic** — present nearly every year since 1880, never a
  megahit
- **Goldilocks** — ≥80% of observed years inside rank 200–1000

The output is `src/data/candidates.json` — about 4,600 names (~1.2 MB)
after filtering out the long tail. SSA refreshes the dataset once a
year, usually in May; re-running `yarn build:data` is the whole
"update" process.

A couple of caveats worth knowing:

- **Spellings are separate rows.** Sofia and Sophia, Catherine and
  Katherine and Kathryn — each gets its own rank. So "rank 22" really
  means rank of that *spelling*, not the name as parents pronounce it.
- **SSA suppresses names with fewer than 5 occurrences per year** for
  privacy, which means very rare names look spikier in their trend
  lines than they really are.

## Epilogue: Why Anna and Cora?

I wish I could say this app named our girls. The truth is more
embarrassing. Expectant dad brain had me spiraling — not too long, not
too short, nothing they'd get made fun of for, unique but not so unique
you can't find a keychain for it on vacation. So I did what a frazzled
engineer does: I downloaded the SSA dataset, parsed it, and built this
app.

Meg watched me do all of that, then said: "Let's name them Anna and
Cora. I've loved those names forever."
