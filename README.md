# Wollner Design

**Produce professional slides right the first time.** Systematic decks built on modular typography, a restricted palette, and a fixed grid — correct by construction, not by luck.

## Why Wollner?

Because design that lasts is **not personal expression** — it's visual engineering.

Alexandre Wollner (1928–2021) studied under Max Bill at HfG Ulm (1955–1958), the functionalist school that inherited Bauhaus philosophy. He returned to Brazil and built identities that **age well** — Itaú, Hering, Eucatex, Klabin — not because they were pretty, but because they were **systematic**. Every element had a reason to exist. Nothing was decorative.

His rule: **system before form, module before aesthetics, function before beauty.**

60+ years later, the brands he designed still work. The ones chasing trends or personal expression are gone.

## What this skill does

It encodes that method so you **don't need to be Wollner's student** to produce work at that standard. Includes:

- **Brand diagnosis** — extracts palette, typography and tone from a URL, visual reference, or interview
- **Declarative system** — declare module, grid and type scale once; everything else follows automatically
- **HTML → PNG → PPTX pipeline** — fast visual loop (screenshots in 3 seconds) before generating the final binary
- **Two-layer validation** — method audit (grid, module, proportions) + robustness audit (no text breaks, consistent radii, harmonic spacing)
- **Professional output** — 16:9 PPTX up to 100 slides, modular typography, 3-color palette, elementary geometry

**Result:** presentations that look considered, not decorated.

## 40 business rules as a quality guarantee

This skill is not a set of suggestions — it is a rule system derived from real production. Every piece generated is validated against **40 rules before output**:

**12 method rules (Layer A)**
Mandatory modular grid, fixed-ratio type scale, 3-color palette with defined proportions, logo position hierarchy (tr → br → bl), calculated clearance zone to prevent logo collision, coherent unit per file (px or pt, never both).

**10 robustness rules (Layer B)**
Image proportion audit with sharp crop formulas, `border-radius` coherence between container and children, atomic labels with `white-space:nowrap`, typographic bullets via `<ul>::before`, `<br>` banned inside h1–h6 (causes paragraph gap in PPTX), Unicode characters replaced by HTML entities, `linear-gradient` replaced by rgba overlay.

**18 explicit prohibitions**
Each one with technical justification: gradients, shadows, clip art, asymmetric `border-radius` on inscribed bars, non-modular column widths, portrait image forced into landscape cell without crop, and more.

New rules are added with every project — the number grows, never shrinks.

## The five pillars (you will not violate)

1. **Module as minimum unit** — every measurement is a multiple of the base module (12pt ≡ 16px in html2pptx pipelines).
2. **Fixed modular grid** — once defined, never broken. Consistency beats flexibility.
3. **Elementary geometry** — triangle, square and circle only as supporting forms. No clip art.
4. **Module-derived typography** — fixed-ratio scale, maximum 2 sizes per slide. Clear hierarchy, no noise.
5. **Restricted palette** — maximum 3 colors with defined proportion (60% background / 30% primary / 10% accent). Less is more.

## How to use

The skill is self-contained in `scripts/`:

```bash
npm install playwright pptxgenjs colorthief node-html-parser
npx playwright install chromium

node scripts/extract-brand.js https://your-brand-reference.com
cp scripts/*.template.js ./
# edit gen-slides.js with palette + content
node gen-slides.js && node screenshot.js    # fast loop
node build.js                                # final PPTX
```

Full details in [`scripts/README.md`](scripts/README.md) and complete method in [`SKILL.md`](SKILL.md).

## Install as a Claude Code skill

Clone inside `~/.claude/skills/`:

```bash
git clone https://github.com/vsaraceni/wollner-design.git ~/.claude/skills/wollner-design
```

The skill triggers when the user asks for "Wollner design", "modular grid", "systematic layout", or references Bauhaus / Swiss / Ulm aesthetics.

## Who built this

**Vinicius Saraceni**, former student of Wollner. He absorbed from him that design is a project, not art. This skill exists to keep the method alive — because what Wollner taught is not a trend that expires, it's a principle.

## License and spirit

Open to everyone. Use it, adapt it, republish it. The method belongs to Wollner; this implementation is an attempt to keep it alive.
