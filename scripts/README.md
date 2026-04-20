# Pipeline Wollner — scripts

Quatro scripts que, juntos, cobrem todo o fluxo de um deck Wollner a partir
de uma referência de marca até o `.pptx` final. Cada um tem função única
e pode ser rodado isoladamente.

## Ordem canônica

```
extract-brand.js   →  gen-slides.js   →  screenshot.js   →  build.js
     (1)                  (2)              (3)              (4)
```

1. **extract-brand.js** — captura paleta e tipografia de uma URL ou imagem de referência. Emite JSON com sugestão de mapeamento Wollner (primária, acento, fundo-2, corpo, caption). Opcional: se o usuário já trouxer a paleta pronta na entrevista, pular.
2. **gen-slides.js** — gera um HTML por slide em `./slides/*.html`. É o único arquivo que *precisa* ser editado por projeto. Duplicar de `gen-slides.template.js`, preencher CFG e paleta, e declarar os slides.
3. **screenshot.js** — renderiza cada HTML em PNG de baixa resolução em `./out/thumbs/`. Serve para revisão visual rápida antes do build final. **Nunca rodar `build.js` sem antes ver thumbs limpos.**
4. **build.js** — renderiza cada HTML em 2x e empacota como PPTX 16:9 em `./out/deck.pptx`.

## Como usar

```bash
# 1. Instalar deps (uma vez)
npm install playwright pptxgenjs colorthief node-html-parser
npx playwright install chromium

# 2. Extrair brand (opcional)
node extract-brand.js https://marca-referencia.com
# ou
node extract-brand.js ./manual-da-marca.png

# 3. Copiar templates
cp gen-slides.template.js gen-slides.js
cp screenshot.template.js screenshot.js
cp build.template.js build.js

# 4. Editar gen-slides.js com paleta, tipografia e conteúdo

# 5. Iterar visualmente
node gen-slides.js && node screenshot.js
# abrir ./out/thumbs/*.png, ajustar gen-slides.js, repetir

# 6. Quando grade estiver limpa, gerar PPTX
node build.js
# saída: ./out/deck.pptx
```

## Regra Wollner para este pipeline

Bug em HTML é barato; bug em PPTX já compartilhado é caro. O ciclo
`gen-slides → screenshot` roda em segundos e não produz binário. Só
rodar `build.js` quando os thumbs estiverem aprovados.

## Customização por projeto

Apenas `gen-slides.js` é esperado ser editado a cada projeto. Os outros
três são genéricos e funcionam inalterados em qualquer deck 16:9
720×405pt. Se precisar de outro ratio, ajustar as constantes no topo de
`screenshot.js` e `build.js` consistentemente.

## Fontes

A fidelidade tipográfica no PPTX depende da fonte estar instalada no
sistema que roda `build.js`, ou carregada via `@font-face` dentro do HTML.
Fontes do Google Fonts funcionam se o HTML puxar via `<link>` e o
Playwright tiver internet no momento do build.
