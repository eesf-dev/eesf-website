# EESF — Erlang Ecosystem SF Bay Area

A [Zola](https://www.getzola.org) site for the EESF monthly meetup. Same look
as the earlier one-page mockup, but now content-driven, with a real RSS feed.

## Requirements

Install Zola (a single static binary, no Node/Ruby toolchain needed):

- macOS: `brew bundle` (installs everything in the `Brewfile`), or `brew install zola`
- Linux: see https://www.getzola.org/documentation/getting-started/installation/
- Windows: `choco install zola` or download from the GitHub releases page

### Medic

If you use [Medic](https://github.com/synchronal/medic-rs), its config is in
`.config/medic.toml`:

- `medic doctor` checks that the `Brewfile` dependencies are installed
- `medic test` builds the site
- `medic audit` checks internal links
- `medic update` pulls and runs doctor
- `medic shipit` runs audit, update and test, then pushes

## Running locally

```
bin/dev/start
```

This runs `zola serve` from the project root; any extra arguments are passed
through (e.g. `bin/dev/start --port 2000`). Then open http://127.0.0.1:1111. Zola live-reloads on file changes.

## Building for deploy

```
zola build
```

Outputs the finished static site to `public/`. Upload that folder to any
static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages, S3, etc).

Before deploying, set `base_url` in `config.toml` to your real domain —
it's currently a placeholder (`https://eesf.dev`).

## Adding or editing events

Each event is a Markdown file in `content/events/`, e.g.
`2027-01-january-meeting.md`:

```
+++
title = "Talk Title Here"
[extra]
pub_date = 2026-12-15 # when this was announced (the RSS pubDate)
date = "2027-01-20"   # when the event happens: "YYYY-MM-DD", "YYYY-MM", or "TBD"
time = "6:30–9:00 PM"
location = "Venue, City"
status = "open"      # "open" or "soon"
featured = false     # true highlights it on the homepage
rsvp_url = "#"        # link to your meetup.com / Luma / etc. listing
+++

Event description goes here as normal Markdown.
```

There are two dates, both under `[extra]` (Zola ignores unknown top-level
keys, and its own top-level `date` only accepts full dates):

- `pub_date` is when the event was announced. It becomes the
  item's `pubDate` in the RSS feeds, so readers show it as new at the
  right time. Set it to the day you publish the event; if you leave it
  out, the feed item has no `pubDate`.
- `date` is when the event happens. It can be a full date
  (`"2027-01-20"`), just a month (`"2027-01"`) when the day isn't set
  yet, or `"TBD"`. Any other value fails the build with an error saying
  which value was wrong.

Add a new file for each meetup and it automatically shows up on the
homepage's Upcoming Events list, gets its own page at
`/events/<slug>/`, and is included in the RSS feeds. Old events can be
deleted or left in place — the homepage lists whatever is in
`content/events/`, sorted by date, with month-only dates after the
full dates in that month and TBD events last.

## Structure

```
config.toml          Site config, plus EESF-specific values under [extra]
content/
  _index.md           Homepage "About" copy
  events/
    _index.md          Events section config (enables the /events/ feed too)
    *.md                One file per event
templates/
  base.html            Shared page shell (head, RSS link, content block)
  index.html            Homepage: hero, contact, events
  events/
    list.html            /events/ — all events
    page.html             Single event detail page
  components/
    event_date.html       Formats and validates an event's date
  rss.xml               Feed listing every event (Zola's default skips undated pages)
static/
  style.css             All page styles (light + dark)
```

## Notes

- Light and dark themes follow the visitor's system preference via
  `prefers-color-scheme`; there's no in-page toggle.
- `generate_feeds = true` in `config.toml` produces `/rss.xml` (site-wide)
  and, because `content/events/_index.md` also sets `generate_feeds = true`,
  `/events/rss.xml` (events only). Point people at whichever one fits.
