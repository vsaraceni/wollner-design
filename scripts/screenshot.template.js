#!/usr/bin/env node
/**
 * Template Wollner — screenshot.js
 *
 * Renderiza cada HTML em ./slides/*.html como PNG em ./out/thumbs/*.png.
 * Usado para revisão visual rápida ANTES de rodar build.js (PPTX).
 *
 * Regra Wollner: nunca gerar PPTX antes de validar a grade visualmente
 * nos thumbs. Bug em HTML é barato; bug em PPTX já distribuído é caro.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SLIDES_DIR = path.join(__dirname, 'slides');
const OUT_DIR = path.join(__dirname, 'out', 'thumbs');

// Proporção 16:9 em pt (720×405) renderizada em px 1:1 no viewport (960×540).
// Para pipelines em px puro, usar 1280×720 ou 1920×1080 e manter a mesma proporção.
const VIEWPORT = { width: 960, height: 540 };

(async () => {
  if (!fs.existsSync(SLIDES_DIR)) {
    console.error(`Pasta não encontrada: ${SLIDES_DIR}`);
    console.error('Rode gen-slides.js antes.');
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const files = fs.readdirSync(SLIDES_DIR).filter(f => f.endsWith('.html')).sort();
  if (files.length === 0) {
    console.error('Nenhum .html em', SLIDES_DIR);
    process.exit(1);
  }

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 });
  const page = await ctx.newPage();

  for (const file of files) {
    const src = path.join(SLIDES_DIR, file);
    const dst = path.join(OUT_DIR, file.replace(/\.html$/, '.png'));
    await page.goto('file://' + src.replace(/\\/g, '/'));
    await page.screenshot({ path: dst, clip: { x: 0, y: 0, ...VIEWPORT } });
    console.log('✓', path.relative(__dirname, dst));
  }

  await browser.close();
  console.log(`\n${files.length} thumbs em ${OUT_DIR}`);
})().catch(e => { console.error(e); process.exit(1); });
