# Spare-Parts Re-Engineering Guide

## Principle

Treat third-party instrument assets (Air-Manager, etc.) as **visual spare parts only**.

- **Use:** PNG bezels, faces, needles, screws, glass glare
- **Ignore:** All Lua logic, lookup tables, non-linear mappings, canvas drawing routines
- **Build:** Your own React/SVG math using your own variables

---

## Case Study: ASI Hours Gauge

### What We Took (Spare Parts)
- `blank_face.png` — dark circular background
- `needle.png` / `needle_shadow.png` — hour hand + shadow
- `bezel.png` — outer rim
- `screw.png` — corner fasteners
- `glass_glare.png` — reflection overlay

### What We Dropped (Their Logic)
- Lua `interpolate_linear()` lookup tables for non-linear airspeed scales
- Canvas-based tick drawing routines (`tas_ticks.lua`, `ias_ticks.lua`)
- TAS card rotation, barometric knob events, simulator variable subscriptions
- Their rotation API (`rotate(id, angle, ...)`)

### What We Built (Our Math)

```
maxScale  = 1500          // our max: 1500 flight hours
startAngle = -135°        // 0 hrs position (bottom-left)
sweep     = 270°          // total arc (not 360° — real gauge style)

needleDeg = -135 + (rawHours / 1500) * 270
```

**Tick formula (same math for ticks, arcs, numbers):**
```
tickAngle = -135 + (tickValue / 1500) * 270
x = 100 + radius * cos(tickAngle in radians)
y = 100 + radius * sin(tickAngle in radians)
```

### Layer Stack (bottom → top)
1. `blank_face.png` — base background
2. SVG overlay — color arcs, ticks, numbers, digital readout
3. `needle_shadow.png` — hand shadow (rotated via CSS transform)
4. `needle.png` — hand itself (rotated via CSS transform)
5. `glass_glare.png` — reflection (mix-blend-mode: screen)
6. `bezel.png` — outer rim
7. `screw.png` × 4 — corner screws

### Needle Animation
Use plain CSS transition on a `<div>` wrapper, NOT framer-motion `animate`:

```tsx
<div style={{
  transform: `rotate(${needleDeg}deg)`,
  transformOrigin: 'center center',
  transition: 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
}}>
  <img src="/instruments/asi/needle.png" />
</div>
```

**Why:** Framer-motion `motion.img` or `motion.div` with `animate={{ rotate }}` can fail to interpolate correctly on image elements. A plain `div` with CSS `transition` is more reliable for prop-driven rotation.

### Key Decisions
- **Scale:** 0–1500 hrs (not knots, not any real instrument scale)
- **Color arcs:** Green (0–500), Yellow (500–1000), Red (1000–1500) — purely decorative
- **Sweep:** 270° arc (not 360°) — mimics real aviation gauges where 0 is bottom-left, max is bottom-right
- **Readout:** Digital hours in center (e.g., "0+00"), plus "HOURS" and "TOTAL TIME" labels
- **No non-linearity:** Our scale is linear — 250 hrs is exactly halfway between 0 and 500

---

## Checklist for Future Re-Engineering

1. **Copy assets** to `/public/instruments/<name>/`
2. **Ignore all logic files** (.lua, .js, logic docs)
3. **Define your own scale** — what variable, what min/max, what units
4. **Pick a sweep angle** — 270° for gauges, 360° for clocks, etc.
5. **Write one tick formula** — reuse it for ticks, arcs, labels
6. **Layer from back to front** — background → SVG data → needle → glare → bezel
7. **Animate with CSS transition** — not framer-motion for rotation
8. **Test with real data** — 0 value, mid value, max value
