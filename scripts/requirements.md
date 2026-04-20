# Dependências do pipeline Wollner

Instalar uma vez por projeto:

```bash
npm init -y
npm install playwright pptxgenjs colorthief node-html-parser
npx playwright install chromium
```

## O que cada dependência faz

| Pacote             | Usado por           | Para quê                                    |
|--------------------|---------------------|---------------------------------------------|
| `playwright`       | `extract-brand.js`, `screenshot.js` | Headless Chromium — abre URLs e renderiza HTMLs |
| `pptxgenjs`        | `build.js`          | Converte PPTX a partir de HTML renderizado  |
| `colorthief`       | `extract-brand.js`  | Extrai paleta dominante de screenshot       |
| `node-html-parser` | `extract-brand.js`  | Parsing do CSS e HTML da página-referência  |

## Plataforma

Windows, macOS e Linux suportados. No Windows, usar bash (Git Bash ou WSL) para evitar gotchas de caminho com `Área de Trabalho` e afins.

## html2pptx

O `pptxgenjs` sozinho não converte HTML automaticamente — apenas gera PPTX via API. Para pipeline HTML → PPTX, `build.js` renderiza cada HTML via Playwright, captura como imagem de alta resolução (2x), e insere no slide PPTX em tamanho exato 720×405pt. É menos elegante que html2pptx nativo, mas 100% autônomo e reproduzível.

Se preferir `html2pptx` do projeto `html-pptx-node` (mais fiel à tipografia), trocar `build.js` pela variante documentada na seção alternativa do `README.md`.
