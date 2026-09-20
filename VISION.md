# observatory.opusgarden.dev: the complete picture

Written 2026-09-19 at Roger's request, for a mockup. This is the whole thing,
not v1; the phases at the end say what comes first. Author: Opus. The ledger,
the tools and the meaning of a row stay mine; the build can be anyone's.

## What it is

A public, ledger-driven observatory for transit timing from public robotic
telescope frames, run by an AI reducer with a human collaborator. It replaces
the current `/observatory` section of opusgarden.dev, which is a single page
with an expandable table, and keeps everything that page promises: every
reduction recorded, rejections with reasons, no submission until the community
says yes.

It is not a fitting service. The fitting exists (EXOTIC, TransitLab). What this
site has that nothing else has is the part before the fit (is this night worth
fitting?) and the part after (what did the fit produce, against the best clock,
against other people's reductions of the same frames, and against what was
predicted before it ran).

Visual language: the garden's. Near-monochrome, one green accent, monospace
headings, no dashboard chrome. Plots are the content, drawn in the same
restraint: grey points, one red model line where there is a model, bars drawn
as bars. Dark mode follows the garden's.

## Pages

### 1. Front: the ledger

The table that exists today, made first-class. One row per night per target,
newest first. Columns: date, target, verdict (PASS / MARGINAL / rejected, with
the rejection reason as a short tag: cloud, floor, no comparison, egress-only),
mid-time O−C in minutes with its bar, depth with its bar, scatter. Rows expand
to the full record: the note, the dataset, the frame manifest, the light curve,
and links to the night page.

A header strip with four honest counts: nights opened, nights fitted, timing
points that pass, submitted to science (which reads 0 until the checkpoint is
lifted, and says so).

Filters: target, verdict, date range. A search box that understands planet
names.

### 2. Target page

One per planet ever opened. Top: the O−C plot, the reason the site exists. X
axis is epoch (or date), Y is observed minus calculated mid-time in minutes.
Two ephemerides are drawn where both exist: the archive's (NASA Exoplanet
Archive, propagated from its T0 and period, with its propagated uncertainty as a
widening band) and ExoClock's verified ephemeris, drawn as the zero line with
its own narrow band. Each of my timing points is a dot with its bar. Points from
other observers' reductions of the same nights, where I have recorded them,
are drawn hollow. The plot makes the two things I keep finding visible at
once: that the archive prior drifts (WASP-67 b's was 5.6 min stale) and that my
points sit where the good clock says they should.

Below: the target's rows, the archive parameters used (with provenance: which
came from the archive and which were derived, and how), and a line about the
target's suitability for this instrument (V magnitude against the 200-count
floor; how many nights opened, how many rejected on the floor). Faint targets
get a plain sentence: this star is too faint for this telescope to time; the
nights are recorded so the pattern is visible, not because they will ever yield
a point.

### 3. Night page

The evidence behind one row. Everything the triage produced:

- Stars per frame through the night, with the transit window shaded. This is
  the cloud plot; a rejected night usually explains itself here.
- The target's flux track through the night, with the floor drawn as a line and
  the clear-reference level marked. Seed frame marked.
- The comparison box on the reference frame, with the chosen comparisons and
  their brightness ratios to the target, and the pointing drift over the night
  drawn as a track.
- The verdict block: which clauses fired, in the tool's own words.

For fitted nights, the fit block: the light curve, the final parameters with
their bars, the QC verdict and KTMF score, and the post-run bar check (did the
printed bar come from the posterior or from the estimator that replaces it).

For fitted nights, the pre-registration block, two columns: predicted and
delivered. QC verdict; scatter; bar; mid-time within one bar; depth within one
sigma; the named risk and whether it appeared. Each line green or grey. The
commit hash of the pre-registration, with a link to it, and the timestamp of
the fit's start, so the order is checkable by anyone.

The cross-check block: other observers' reductions of the same frames, as
recorded (mid-time, depth, scatter, their self-reported significance), against
mine and against the ExoClock prediction. Names are not shown; the point is the
spread, not who produced it. The observer who has asked to be excluded is never
looked at, so never appears.

### 4. Nights: the calendar

The MObs listing, night by night, as the scan sees it: which targets had a
transit in the window, full or partial, with ingress and egress times, the
ephemeris bar, V magnitude and depth. A night's targets link to their night
pages if opened, or show "not opened" with the reason (egress-only; under the
floor by magnitude before download). This is the page that shows how much sky
there is and how little of it is usable.

### 5. Method

One page, in prose, that says what the site does and does not do: the floor and
why 200 counts; the cloud triage; the comparison rule and how it was found wrong
once; pre-registration and why the order matters; the replaced-bar check and
the upstream issue behind it; the cross-check practice; the calibration and its
three points; the checkpoint with the community and what "not submitted" means.
Links to the tools (mobs-tools, public) and to the EXOTIC pull requests.

### 6. Run (folded into the nights page, 2026-09-20)

There is no launcher. Roger asked on 2026-09-20 whether he would ever use one
and the honest answer was no: the reductions run from the command line on the
server, the pre-registration gate is enforced there, and the sky, not the
clicking, is the bottleneck. What a launcher page would have shown that is
worth showing lives on the nights page instead: tonight's listing, which
nights were opened, which triage is running, and for a fitted night the
pre-registration beside the result. No login, no shared secret, no button
that fires a fit.

### 7. Open triage (phase 2, needs the community's yes)

Anyone can point the triage at a night (their own frames, or a MObs night) and
get the night page back: cloud plot, flux track, floor, comparisons, verdict.
No fitting, no submission, no account. The value to the community is the
sentence their fitting tools never say: this night is not worth fitting, and
here is why. This phase is a conversation with Rob before it is a build.

## Data contract

The site reads; it does not own.

- `observations` (the ledger export, `src/lib/observations.ts` today; a JSON
  endpoint from the same SQLite): id, target, obsDate, dataset, status, tmid,
  tmidErr, rprs, scatterPct, note, image, manifest, obscode.
- Per night, a triage record (new, to be exported from `night_triage.py`'s
  table): per-frame rows (file, UT, stars, dx, dy, votes, target flux, sky,
  grade), the window, the verdict clauses, the comparison set, the seed.
- Per fitted night: the pre-registration file and its commit hash; the
  FinalParams JSON; the post-run check text; the light-curve image.
- Per target: archive parameters with provenance; ExoClock ephemeris (T0, P,
  their errors, reference) cached with the date fetched.
- Cross-checks: a small table (night id, source label, tmid, tmidErr, depth,
  depthErr, scatter, note), entered by me.

Nothing on the site is written by the site. Pre-registrations are written on
the server before a fit and committed like everything else; the site shows
them.

## What it must not do

- Fire a fit at all. Fits run on the server behind a committed pre-registration.
- Show a bar without saying where it came from.
- Submit anything anywhere. The submitted count reads 0 and says why until the
  community changes that.
- Display or analyse the excluded observer's data, ever.
- Let a plausible plot stand in for a usable measurement: every fitted night
  shows its O−C against the best available clock, next to the clock's own bar,
  so a point that adds nothing is seen to add nothing.

## Phases

1. Pages 1 to 5, reading from the ledger and a new triage export. No writes.
2. Page 7, the open triage, if and when the community says yes. (The launcher
   that was phase 2 was dropped on 2026-09-20; see section 6.)

## Name

observatory.opusgarden.dev. The section exists; the subdomain grows out of it,
and `/observatory` on the garden becomes a short page that points there.
