# 🎨 Portfolio v2 — Complete Design Blueprint

**Target:** `anonymoustest137.github.io/anonymoustest137`
**Goal:** Hold a visitor's attention for 90+ seconds through motion, depth, and reveal-pacing.
**Current baseline:** 7 sections · 6 effects · 21 KB total.

---

## 0. The Core Principle — Why Sites Feel "Expensive"

Cheap sites animate **elements**. Expensive sites animate **space**.

The single biggest upgrade is moving from *"things fade in when scrolled to"* to
**scroll-linked animation** — where scroll position drives a timeline, and the
viewer feels they are *scrubbing* the page rather than falling down it.

Three mechanics do 80% of the work:

| Mechanic | What it does | Why it holds attention |
|---|---|---|
| **Parallax depth** | Layers move at different speeds | Creates 3D space; the brain keeps tracking it |
| **Scroll-scrub** | Animation progress tied to scroll % | Viewer feels *in control* — they cause the motion |
| **Staggering** | Children animate 60–90 ms apart | Eye follows a path instead of absorbing a blob |

> **Rule:** never animate more than 2 properties at once (`transform` + `opacity`).
> Anything else (`width`, `top`, `filter`) drops frames.

---

## 1. Colour System

The current green-on-black is good but one-note. Upgrade to a **three-accent system**
over a near-black base, with each section owning an accent so scrolling feels like
travelling through zones.

### Base ramp (dark, slightly blue-shifted — never pure black)

| Token | Hex | Use |
|---|---|---|
| `--bg-void` | `#05070A` | Page background |
| `--bg-deep` | `#0A0E14` | Section alternate |
| `--bg-panel` | `#0F1620` | Cards |
| `--bg-raised` | `#161F2C` | Hover state |
| `--line` | `#1E2A3A` | Borders, dividers |

### Accents

| Token | Hex | Meaning | Owns |
|---|---|---|---|
| `--acc-green` | `#00FF9C` | Primary / "terminal" | Hero, About |
| `--acc-cyan` | `#00D9FF` | Secondary / "data" | Skills, Stats |
| `--acc-violet` | `#A855F7` | Tertiary / "AI" | Projects, Writeups |
| `--acc-red` | `#FF3B5C` | Alert / danger | Experience, warnings |

### Text

| Token | Hex |
|---|---|
| `--text-hi` | `#E8F0F7` |
| `--text-mid` | `#8FA3B8` |
| `--text-low` | `#546678` |

**Why this works:** shifting green → cyan → violet as the user descends creates an
unconscious sense of *progress*. They keep scrolling to see what colour comes next.

### Gradient usage

- **Mesh gradient** blobs at 8–12% opacity, heavily blurred (`120px`), drifting slowly behind content
- Never gradient body text — only headings, and only at 2 stops max
- Glow = `box-shadow` with the accent at 25% alpha, 40px blur, no spread

---

## 2. Typography

| Role | Font | Size (desktop) | Notes |
|---|---|---|---|
| Display | **Space Grotesk** / Clash Display | `clamp(3rem, 9vw, 7rem)` | Tight `-0.04em` tracking |
| Body | **Inter** | `1.0625rem` | `line-height: 1.75` |
| Mono | **JetBrains Mono** | `0.875rem` | Terminal blocks, labels, nav |

**Hierarchy trick:** section labels in mono, uppercase, `letter-spacing: 0.25em`,
at `--text-low` — tiny and quiet, which makes the display heading beneath feel huge.

---

## 3. Section-by-Section Build

### `00` Preloader — 1.2 s
Full-screen `--bg-void`. Centred mono counter `00 → 100`. A 1px green line grows
to full width beneath it. At 100 the whole overlay **slides up** revealing the hero,
which is already mid-animation underneath.

*Purpose:* guarantees fonts/canvas are ready, and buys a beat of anticipation.
**Never exceed 1.5 s.**

---

### `01` Hero — the 3-second test

**Layers (back → front), each at a different parallax speed:**

| Layer | Speed | Content |
|---|---|---|
| 1 | `0.0` | Matrix rain, 6% opacity |
| 2 | `0.15` | Two drifting mesh-gradient blobs |
| 3 | `0.35` | Faint grid, perspective-tilted |
| 4 | `0.60` | Giant outlined ghost text `SECURITY` |
| 5 | `1.00` | Name, typing line, CTAs |

**Entrance:** name reveals via **per-character mask-slide** — each letter rises from
behind an invisible bar, 35 ms apart. Far better than a fade.

**Idle motion:** whole hero group translates ±8px counter to cursor position
(`0.02` coefficient, heavily eased) — subtle life without distraction.

**Scroll-out:** hero scales to `0.92`, drops opacity to 0, and blurs `4px` as the
next section slides over it. This "camera pull-back" is the signature move.

**Scroll cue:** thin vertical line with a dot travelling down it, looping.

---

### `02` About — split-scroll

Left column **pins** while the right column scrolls three "cards" past it.
The pinned side's heading changes as each card passes.

- Portrait/terminal panel with a 2° tilt that **straightens to 0° as it enters**
- Text reveals **line by line** with a mask, not word-fade
- Small stat counters roll up when 50% visible, with a slight overshoot easing

---

### `03` Skills — horizontal scroll-jack

The most attention-holding section available.

Pin the viewport and convert **vertical scroll into horizontal travel** across
6 skill cards. The viewer scrolls down, but the world moves sideways — an
unexpected mechanic that reliably stops people from bouncing.

- Cards scale `0.9 → 1.0` as they approach centre
- Progress bars fill only when their card is centred
- A dot indicator shows position (1/6)
- **Limit to ~2.5 viewport heights** or it feels like a trap
- On mobile: degrade to a normal swipeable carousel

---

### `04` Projects — the showpiece

**Layout:** asymmetric grid, alternating wide/narrow rows.

**Card interactions (all cursor-driven):**
- **3D tilt** — card rotates up to 8° on X/Y following cursor, with a
  `perspective: 1000px` parent
- **Spotlight** — a radial gradient at 12% white follows the cursor *inside*
  the card border
- **Magnetic CTA** — the "source →" link drifts up to 6px toward the cursor
  when within 80px
- **Image scale** — preview zooms `1.0 → 1.08` over 600ms on hover

**Scroll behaviour:** cards enter staggered on **alternating X axes**
(odd from `-40px`, even from `+40px`) with a 90 ms delay between them.

**Filters:** use FLIP animation — cards physically slide to new positions
rather than popping. This is the difference between "a filter" and "a product".

---

### `05` Experience — the drawing line

A vertical timeline whose connecting line **draws itself** via `stroke-dashoffset`
tied directly to scroll progress. Nodes pulse and their content slides in as the
line's tip passes them.

Highly satisfying, and it paces the reader — they *must* scroll to advance the story.

---

### `06` Stats — counting numbers
Large mono figures that roll up with overshoot, plus a sparkline that draws
left-to-right. Accent: cyan.

---

### `07` Contact — terminal emulator
Style the form as a working shell. Focused inputs show a blinking block cursor
and a `$` prefix. Submit prints a fake command response line by line.

Ends with the footer: large ghost wordmark, socials, and the matrix rain
fading back up to 10% to bookend the hero.

---

## 4. Global Effects Layer

| Effect | Spec |
|---|---|
| **Custom cursor** | 8px solid dot (instant) + 36px outlined ring (lerp `0.15`). Ring scales ×2.5 and inverts over interactive elements. Hide on touch devices. |
| **Scroll progress** | 2px gradient bar (green→cyan→violet) across the top, width = scroll %. |
| **Smooth scroll** | Lenis-style inertia, `lerp: 0.08`. This single change makes everything else feel premium. |
| **Noise overlay** | Tiled SVG grain at 3% opacity, `pointer-events: none`. Kills banding on gradients. |
| **Scanlines** | Keep, but drop to 2% — currently too strong. |
| **Section snap** | *Avoid.* Fights the inertia scroll and frustrates users. |
| **Magnetic buttons** | All primary CTAs, 6px max pull. |
| **Text scramble** | Nav links scramble through random chars on hover, 400ms settle. Very on-theme. |

---

## 5. Motion Specification

### Easing — never use `ease` or `linear`

| Name | Curve | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrances (default) |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Movement |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Counters, buttons (overshoots) |

### Duration

| Interaction | ms |
|---|---|
| Micro (hover, colour) | 150–250 |
| Standard (card, reveal) | 400–600 |
| Large (section, pin) | 800–1200 |
| Stagger gap | 60–90 |

### Reveal trigger
Fire at **15% visible**, not 50% — the element should already be finishing
its animation as it reaches comfortable reading position.

---

## 6. Attention-Retention Strategy

Visitors decide in **5–10 seconds**. The structure must keep paying out:

1. **0–3 s — Hook.** Preloader + name reveal. Motion before information.
2. **3–15 s — Orient.** One sentence of who you are. No walls of text.
3. **15–40 s — Surprise.** The horizontal skills scroll. An unexpected mechanic
   resets the boredom clock.
4. **40–70 s — Substance.** Projects. Interactive tilt cards invite play;
   playing = staying.
5. **70–90 s — Narrative.** The self-drawing timeline creates completion urge.
6. **90 s+ — Convert.** Terminal contact form, still on-theme.

**Pacing rules**
- Change the *type* of motion every section — never two reveals in a row
- Alternate background `--bg-void` / `--bg-deep` so section edges are felt
- Vary density: dense grid → airy quote → dense grid
- Give every section one "hero moment" worth screenshotting

---

## 7. Performance Budget

Non-negotiable, or the animations become the problem:

- Animate **only** `transform` and `opacity`
- `will-change` applied on enter, **removed on exit** (leaving it on eats GPU memory)
- Matrix rain: cap at 30 fps, pause via `IntersectionObserver` when off-screen
- Throttle cursor/parallax to `requestAnimationFrame` — never raw `mousemove`
- Lazy-load all images below the fold; use `aspect-ratio` to prevent layout shift
- Target: **< 150 KB** total, **60 fps** on a mid-range phone, **LCP < 2 s**

---

## 8. Accessibility — the part most "cool" sites fail

- `@media (prefers-reduced-motion: reduce)` must disable **parallax, scroll-jack,
  and tilt** — not just fades. Content jumps straight to final state.
- Never trap keyboard focus inside a pinned section
- Maintain 4.5:1 contrast — `--text-mid` on `--bg-void` passes; don't go dimmer for body copy
- Custom cursor must not replace real focus rings
- All animation is decorative: the site must be fully readable with JS disabled

---

## 9. Recommended Build Order

1. Colour tokens + typography + noise overlay *(instant 40% improvement)*
2. Smooth inertia scroll *(the highest-leverage single change)*
3. Custom cursor + scroll progress bar
4. Hero parallax layers + character reveal
5. Staggered project grid + 3D tilt cards
6. Timeline draw-on-scroll
7. Horizontal skills section *(most complex — do last)*
8. Preloader
9. Reduced-motion pass + performance audit

**Library options**
- *Zero-dependency:* IntersectionObserver + rAF + CSS custom properties — ~12 KB, total control
- *Fast path:* **Lenis** (smooth scroll, 3 KB) + **GSAP ScrollTrigger** (pinning/scrub) — industry standard, ~40 KB

---

## 10. Summary of Changes vs. Current Site

| Area | Now | v2 |
|---|---|---|
| Palette | Green only | 3 accents + zoned sections |
| Scroll | Fade-up reveals | Scrub, pin, parallax, draw |
| Cursor | Default | Custom + magnetic + spotlight |
| Depth | Flat | 5 parallax layers |
| Cards | Hover lift | 3D tilt + spotlight |
| Skills | Static grid | Horizontal scroll-jack |
| Timeline | Static | Draws with scroll |
| Scrolling | Native | Inertia-smoothed |
| Entry | Instant | Preloader |
