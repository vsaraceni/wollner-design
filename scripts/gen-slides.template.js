#!/usr/bin/env node
/**
 * Template Wollner — gen-slides.js
 *
 * Gera um HTML por slide em ./slides/*.html a partir das constantes
 * de design declaradas no topo. Este arquivo é um ponto de partida;
 * duplicar e adaptar para cada projeto.
 *
 * Unidade de medida: escolher px OU pt e não misturar.
 * Módulo base: 16px (= 12pt). Valores devem ser múltiplos de 4px (= 3pt).
 */

const fs = require('fs');
const path = require('path');

// =============================================================
// CONFIG — preencher a partir do output da entrevista Wollner
// =============================================================

const CFG = {
  width: 720,   // pt
  height: 405,  // pt
  module: 16,   // px (= 12pt); sub-módulo = 4px
  margin: { x: 64, y: 48 }, // px
  fontFamily: `'Inter', Arial, Helvetica, sans-serif`,
};

const C = {
  primaria: '#1A1A1A',
  acento:   '#0055A4',
  fundo2:   '#F5F5F0',
  corpo:    '#333333',
  caption:  '#777777',
  branco:   '#ffffff',
};

const BASE = path.join(__dirname, 'slides');
fs.mkdirSync(BASE, { recursive: true });

// =============================================================
// Helpers
// =============================================================

const head = `<meta charset="utf-8"><style>
html, body { margin: 0; padding: 0; width: ${CFG.width}pt; height: ${CFG.height}pt; overflow: hidden; }
body { font-family: ${CFG.fontFamily}; background: ${C.branco}; position: relative; }
ul.w-list { list-style: none; margin: 0; padding: 0; }
ul.w-list li { position: relative; padding-left: 14px; margin-bottom: 10px; font-size: 14px; line-height: 1.4; color: ${C.corpo}; }
ul.w-list li::before { content: ""; position: absolute; left: 0; top: 7px; width: 6px; height: 6px; background: ${C.acento}; }
</style>`;

// =============================================================
// Slides
// =============================================================

const s1_capa = `<!DOCTYPE html><html><head>${head}</head><body style="background:${C.primaria};">
  <div style="position:absolute;top:0;right:0;width:8px;height:100%;background:${C.acento};"></div>
  <div style="position:absolute;bottom:80px;left:64px;right:80px;">
    <p style="font-size:12px;color:${C.acento};margin:0 0 12px 0;letter-spacing:3px;text-transform:uppercase;font-weight:600;">Categoria ou tag</p>
    <h1 style="font-size:52px;font-weight:700;color:${C.branco};margin:0 0 16px 0;line-height:1.0;">Título principal do deck</h1>
    <div style="width:48px;height:4px;background:${C.acento};margin-bottom:16px;"></div>
    <p style="font-size:18px;color:${C.fundo2};margin:0;line-height:1.4;">Subtítulo descritivo em uma linha.</p>
  </div>
</body></html>`;

const s2_tese = `<!DOCTYPE html><html><head>${head}</head><body style="background:${C.fundo2};">
  <div style="position:absolute;top:0;left:0;right:0;height:4px;background:${C.primaria};"></div>
  <div style="position:absolute;top:48px;left:64px;right:64px;">
    <h2 style="font-size:36px;font-weight:700;color:${C.primaria};margin:0 0 24px 0;">Título da tese</h2>
    <p style="font-size:18px;color:${C.corpo};line-height:1.5;max-width:560px;margin:0;">Corpo do argumento central. Uma ideia por slide. Máximo 3-4 linhas.</p>
  </div>
</body></html>`;

// =============================================================
// Escrita
// =============================================================

fs.writeFileSync(path.join(BASE, '01-capa.html'), s1_capa, 'utf8');
fs.writeFileSync(path.join(BASE, '02-tese.html'), s2_tese, 'utf8');
console.log('slides gerados em', BASE);
