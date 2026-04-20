#!/usr/bin/env node
/**
 * Template Wollner — build.js
 *
 * Pipeline HTML → PPTX:
 *   1. Para cada ./slides/*.html, renderiza via Playwright em 2x (alta resolução).
 *   2. Insere cada PNG em um slide PPTX 16:9 (720×405 pt), ocupando 100% do frame.
 *   3. Salva ./out/deck.pptx.
 *
 * Menos elegante que html2pptx nativo, mas 100% reproduzível. A fidelidade
 * tipográfica depende da fonte estar instalada no sistema que roda o script
 * (ou carregada via @font-face no HTML).
 */

const { chromium } = require('playwright');
const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

const SLIDES_DIR = path.join(__dirname, 'slides');
const OUT_DIR = path.join(__dirname, 'out');
const SHOTS_DIR = path.join(OUT_DIR, 'build-shots');
const PPTX_OUT = path.join(OUT_DIR, 'deck.pptx');

// 16:9 Wollner canônico. Para outros ratios, ajustar ambos consistentemente.
const SLIDE_W_PT = 720;
const SLIDE_H_PT = 405;
const SCALE = 2; // 2x para telas Retina e impressão digital

(async () => {
  if (!fs.existsSync(SLIDES_DIR)) {
    console.error(`Pasta não encontrada: ${SLIDES_DIR}. Rode gen-slides.js antes.`);
    process.exit(1);
  }

  fs.mkdirSync(SHOTS_DIR, { recursive: true });

  const files = fs.readdirSync(SLIDES_DIR).filter(f => f.endsWith('.html')).sort();
  if (files.length === 0) { console.error('Nenhum .html em', SLIDES_DIR); process.exit(1); }

  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: SLIDE_W_PT * SCALE, height: SLIDE_H_PT * SCALE },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();

  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'W16x9', width: SLIDE_W_PT / 72, height: SLIDE_H_PT / 72 });
  pptx.layout = 'W16x9';

  for (const file of files) {
    const src = path.join(SLIDES_DIR, file);
    const shot = path.join(SHOTS_DIR, file.replace(/\.html$/, '.png'));

    await page.goto('file://' + src.replace(/\\/g, '/'));
    await page.screenshot({ path: shot, clip: { x: 0, y: 0, width: SLIDE_W_PT * SCALE, height: SLIDE_H_PT * SCALE } });

    const slide = pptx.addSlide();
    slide.addImage({ path: shot, x: 0, y: 0, w: SLIDE_W_PT / 72, h: SLIDE_H_PT / 72 });
    console.log('✓', file);
  }

  await browser.close();
  await pptx.writeFile({ fileName: PPTX_OUT });
  console.log('\nPPTX:', PPTX_OUT);
})().catch(e => { console.error(e); process.exit(1); });
