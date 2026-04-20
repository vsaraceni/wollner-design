#!/usr/bin/env node
/**
 * Wollner brand extractor
 *
 * Uso:
 *   node extract-brand.js <URL | caminho-arquivo-imagem>
 *
 * Output (stdout): JSON com:
 *   - visualPalette:  cores dominantes do screenshot (via colorthief)
 *   - cssPalette:     cores declaradas no CSS da página (por frequência)
 *   - fontFamilies:   famílias tipográficas detectadas no CSS
 *   - suggestion:     sugestão de mapeamento Wollner (primária, acento, fundo-2, corpo, caption)
 *
 * Emite lado-a-lado para o usuário validar. A skill Wollner nunca deve
 * assumir que o extractor acertou — sempre pedir confirmação.
 */

const { chromium } = require('playwright');
const ColorThief = require('colorthief');
const fs = require('fs');
const path = require('path');
const { parse: parseHTML } = require('node-html-parser');

async function extractFromURL(url) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

  const shotPath = path.join(process.cwd(), '.wollner-extract-tmp.png');
  await page.screenshot({ path: shotPath, fullPage: false });

  const html = await page.content();
  const stylesheets = await page.evaluate(() => {
    return Array.from(document.styleSheets).flatMap(sheet => {
      try {
        return Array.from(sheet.cssRules || []).map(r => r.cssText);
      } catch { return []; }
    }).join('\n');
  });

  await browser.close();

  return { shotPath, html, css: stylesheets };
}

async function extractFromImage(filePath) {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) throw new Error(`Arquivo não encontrado: ${abs}`);
  return { shotPath: abs, html: '', css: '' };
}

async function getVisualPalette(shotPath, count = 6) {
  const palette = await ColorThief.getPalette(shotPath, count);
  return palette.map(([r, g, b]) => rgbToHex(r, g, b));
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(n => n.toString(16).padStart(2, '0')).join('');
}

function extractCSSColors(css) {
  const hex = [...css.matchAll(/#([0-9a-f]{3}|[0-9a-f]{6})\b/gi)].map(m => m[0].toLowerCase());
  const rgb = [...css.matchAll(/rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/gi)]
    .map(m => rgbToHex(+m[1], +m[2], +m[3]));
  const all = [...hex.map(h => h.length === 4 ? expandShortHex(h) : h), ...rgb];
  return rankByFrequency(all);
}

function expandShortHex(h) {
  return '#' + h.slice(1).split('').map(c => c + c).join('');
}

function extractFontFamilies(css) {
  const matches = [...css.matchAll(/font-family\s*:\s*([^;}\n]+)/gi)];
  const families = matches.flatMap(m => m[1].split(',').map(s => s.trim().replace(/["']/g, '')));
  const filtered = families.filter(f => !/^(inherit|initial|unset|var\()/.test(f) && f.length > 0);
  return rankByFrequency(filtered).slice(0, 5);
}

function rankByFrequency(arr) {
  const freq = new Map();
  for (const v of arr) freq.set(v, (freq.get(v) || 0) + 1);
  return [...freq.entries()].sort((a, b) => b[1] - a[1]).map(([v]) => v);
}

function suggestWollnerMapping(visualPalette, cssPalette) {
  const combined = [...new Set([...cssPalette.slice(0, 10), ...visualPalette])];
  const byLuma = combined.map(hex => ({ hex, luma: luminance(hex), sat: saturation(hex) }));

  const darkSaturated = byLuma.filter(c => c.luma < 0.3 && c.sat > 0.2).sort((a, b) => b.sat - a.sat);
  const lightNeutral = byLuma.filter(c => c.luma > 0.85 && c.sat < 0.1).sort((a, b) => b.luma - a.luma);
  const accent = byLuma.filter(c => c.sat > 0.5 && c.luma > 0.3 && c.luma < 0.7).sort((a, b) => b.sat - a.sat);
  const midGray = byLuma.filter(c => c.luma > 0.3 && c.luma < 0.6 && c.sat < 0.2).sort((a, b) => a.sat - b.sat);

  return {
    primaria: darkSaturated[0]?.hex || byLuma.sort((a, b) => a.luma - b.luma)[0]?.hex,
    acento: accent[0]?.hex,
    'fundo-2': lightNeutral[0]?.hex,
    corpo: midGray[0]?.hex,
    caption: midGray[1]?.hex,
    branco: '#ffffff',
  };
}

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(c => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function saturation(hex) {
  const [r, g, b] = hexToRgb(hex).map(c => c / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  if (max === 0) return 0;
  return (max - min) / max;
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

(async () => {
  const input = process.argv[2];
  if (!input) {
    console.error('Uso: node extract-brand.js <URL | arquivo-imagem>');
    process.exit(1);
  }

  const isURL = /^https?:\/\//.test(input);
  const { shotPath, css } = isURL ? await extractFromURL(input) : await extractFromImage(input);

  const visualPalette = await getVisualPalette(shotPath, 8);
  const cssPalette = css ? extractCSSColors(css).slice(0, 10) : [];
  const fontFamilies = css ? extractFontFamilies(css) : [];
  const suggestion = suggestWollnerMapping(visualPalette, cssPalette);

  if (isURL && fs.existsSync(shotPath)) fs.unlinkSync(shotPath);

  console.log(JSON.stringify({
    source: input,
    visualPalette,
    cssPalette,
    fontFamilies,
    suggestion,
    note: 'Confirmar mapeamento com o usuário antes de usar. O extractor acerta ~80% dos casos; marcas com design system forte saem melhor; sites com muita imagem-hero saem piores.',
  }, null, 2));
})().catch(e => { console.error(e.message); process.exit(1); });
