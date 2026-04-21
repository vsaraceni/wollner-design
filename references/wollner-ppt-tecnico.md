# Wollner PPT: Referência Técnica

## Parâmetros de módulo por tamanho de deck

### Deck padrão 720x405pt (16:9)

**Regra de negócio: toda divisão de coluna DEVE ser múltiplo de 12pt e derivada do grid.**

Valores canônicos de largura para divisões de colunas de layout:

| Divisão | Largura coluna | Derivação |
|---|---|---|
| 1 de 3 colunas | 192pt | (624 − 2×24) / 3 |
| 2 de 3 colunas + calha | 408pt | 2×192 + 24 |
| 2 de 3 colunas + 2 calhas | 432pt | 2×192 + 2×24 |
| 1 de 2 colunas | 300pt | (624 − 24) / 2 |
| 1 de 2 colunas sangrada | 336pt | 300 + margem 36pt |
| Coluna texto estreita (2 cols úteis) | 360pt | 3×12×10 = 300 + 60 |
| Coluna foto sangrada até borda | restante | 720 − coluna texto |

**Nunca usar valores arbitrários** como 368pt, 436pt, 310pt, 330pt, 320pt. Se um valor não for derivável da tabela acima, revisar o layout.

**Regra de largura do bloco título/subtítulo:**

O h1 e o p de subtítulo imediatamente abaixo nunca devem ultrapassar **2/3 da largura total do slide** (480pt de 720pt). Essa regra garante espaço livre no canto do logo e evita colisão visual.

Implementação: `max-width:480pt` em h1 e subtítulo em slides com layout de coluna única. Em slides com colunas parciais (coluna de texto + coluna de imagem), o h1 já está naturalmente limitado pela largura da coluna — mas verificar que não invade a zona do logo quando o logo é `tr`.

**Regra de clearance do logo (zona de exclusão):**

O logo posicionado em `tr` (top-right) ocupa: `x = 720−36−72 = 612pt` até `684pt`, `y = 36pt` até `67pt`. Nenhum conteúdo pode entrar nessa zona.

Para slides full-width: `max-width: 480pt` no h1 é suficiente pois 480 < 612.

Para slides com colunas parciais, calcular:

```
max-width_h1 = x_logo_no_slide − x_início_coluna − padding_lateral_esquerdo
             = 612 − col_start − padding_left
```

Exemplos:
- Slide com coluna texto começando em x=36pt, padding 36pt: max-width = 612−36−36 = **540pt** (cobertura full da coluna, mas verificar se tem logo tr)
- Slide com coluna direita começando em x=324pt, padding 36pt: max-width = 612−324−36 = **252pt**
- Slide com coluna direita começando em x=360pt, padding 36pt: max-width = 612−360−36 = **216pt**

O padding-right da coluna de conteúdo também deve ser ≥ M (margem Wollner) para que cards não ultrapassem a borda útil.

**Regra de posição do logotipo (hierarquia obrigatória):**
1. **Superior direito** — posição canônica. Usar sempre que o canto estiver livre de conteúdo ou imagem.
2. **Inferior direito** — quando o superior direito está ocupado por conteúdo ou foto.
3. **Inferior esquerdo** — quando ambos os cantos direitos estão ocupados (ex: slides com foto ou vinhetas cobrindo toda a coluna direita).

O logo nunca sobrepõe foto, dado ou elemento de conteúdo.

**Auditoria de proporção de imagens:**

Antes de renderizar o deck, verificar se a proporção (ratio = width/height) da célula HTML onde cada imagem será exibida é compatível com a proporção do arquivo de origem. Incompatibilidades causam esticamento mesmo com `object-fit:cover`.

**Snippet de auditoria a rodar no início de todo build.js:**

```javascript
const sharp = require('C:/Users/vinnie/node_modules/sharp');
async function auditarImagens(imagens) {
  // imagens = [{ src, cellW, cellH, label }]
  const THRESHOLD = 0.20;
  let temFlag = false;
  for (const { src, cellW, cellH, label } of imagens) {
    const meta = await sharp(src).metadata();
    const ratioImg = meta.width / meta.height;
    const ratioCel = cellW / cellH;
    const desvio   = Math.abs(ratioImg - ratioCel) / ratioCel;
    const status   = desvio > THRESHOLD ? '⚠  CROP NECESSÁRIO' : '✓  OK';
    if (desvio > THRESHOLD) temFlag = true;
    console.log(`  [${status}] ${label}: img ${ratioImg.toFixed(2)} vs célula ${ratioCel.toFixed(2)} (desvio ${(desvio*100).toFixed(0)}%)`);
  }
  if (temFlag) console.log('\n  ⚠  Atenção: corrija as imagens acima antes de distribuir o deck.\n');
  else         console.log('\n  ✓  Todas as proporções OK.\n');
}
```

**Regras de correção:**
- Desvio ≤ 20% → aceitar com `object-fit:cover`
- Desvio > 20% → fazer crop com sharp antes do build; nunca confiar que o browser vai corrigir

**Fórmulas de crop canônico com sharp:**

```javascript
// Para qualquer proporção alvo (targetRatio = targetW / targetH):
// Se a imagem original for mais larga que o alvo → crop horizontal (reduzir largura)
// Se a imagem original for mais alta que o alvo  → crop vertical (reduzir altura)

const m = await sharp(src).metadata();
const origRatio = m.width / m.height;

if (origRatio > targetRatio) {
  // imagem mais larga → fixar altura, cortar laterais
  const cropW = Math.round(m.height * targetRatio);
  const cropH = m.height;
  const left  = Math.round((m.width - cropW) / 2);
  await sharp(src).extract({ left, top: 0, width: cropW, height: cropH }).toFile(out);
} else {
  // imagem mais alta → fixar largura, cortar topo/baixo
  const cropW = m.width;
  const cropH = Math.round(m.width / targetRatio);
  const top   = Math.round((m.height - cropH) / 2);  // centrar; ou offset % p/ rosto
  await sharp(src).extract({ left: 0, top, width: cropW, height: cropH }).toFile(out);
}
```

Exemplos de `targetRatio` por tipo de célula:
| Célula | Ratio | Exemplo |
|---|---|---|
| Portrait 3:4 (foto vertical) | 0.75 | Foto de pessoa, 276×368pt |
| Portrait extremo (0.42:1) | 0.42 | Strip lateral estreita, 140×333pt |
| Quadrado | 1.0 | Vinheta 165×165pt |
| Landscape 4:3 | 1.33 | Card horizontal |
| Landscape wide (1.26:1) | 1.26 | Persona 208×165pt |
| Panorâmico 3:1 | 3.0 | Strip hero 720×240pt |
| Portrait sangrado (0.83:1) | 0.83 | Coluna lateral 336×405pt |

Para fotos de pessoas: usar `top` com offset de 10–15% em vez de centro exato, para preservar o rosto que fica no terço superior.

**Gotcha:** células com `flex:1` e `height:100%` sem `position:relative` não respeitam o `object-fit`. Estrutura obrigatória para célula de imagem flex:
```html
<div style="flex:1;position:relative;overflow:hidden;border-radius:4pt;">
  <img src="..." style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;object-position:center top;">
</div>
```

### Tabela de parâmetros de módulo — 720x405pt

| Parâmetro          | pt     | px     | Derivação          |
|--------------------|--------|--------|--------------------|
| Módulo base        | 12pt   | 16px   | definição inicial  |
| Margem lateral     | 48pt   | 64px   | 4× módulo (formal) |
| Margem lateral M   | 36pt   | 48px   | 3× módulo (compacto) |
| Margem vertical    | 36pt   | 48px   | 3× módulo          |
| Calha de coluna    | 24pt   | 32px   | 2× módulo          |
| Largura útil (48pt)| 624pt  | 832px  | 720 − 2×48         |
| Largura útil (36pt)| 648pt  | 864px  | 720 − 2×36         |
| Col. 2 colunas     | 300pt  | 400px  | (624 − 24) / 2     |
| Col. 3 colunas     | 192pt  | 256px  | (624 − 2×24) / 3   |
| Line-height corpo  | 1.5    | 1.5    | padrão legibilidade|
| Line-height título | 1.1    | 1.1    | compressão display |

### Conversão pt ⇄ px em pipelines html2pptx

Puppeteer renderiza em px; html2pptx converte para pt no PPTX final. A razão é **1pt = 1.333px** (96 DPI / 72pt por polegada).

**Regra de conformidade modular:**
- Em **px**: valores devem ser múltiplos de **4px** (= ¼ módulo = 3pt equivalente). Preferir múltiplos de 8px.
- Em **pt**: valores devem ser múltiplos de **3pt**. Preferir múltiplos de 6pt.
- **Não misturar unidades no mesmo gerador.** Escolher px **ou** pt por arquivo e manter coerência.

**Por que ambas as unidades são válidas:** o que importa para o método Ulm/Wollner é o *ritmo modular cartesiano*, não a unidade física. Um deck consistentemente construído em múltiplos de 4px tem o mesmo rigor estrutural que um em múltiplos de 3pt — muda apenas o rótulo.

**Quando preferir px:** gerador JavaScript/Node que lê do DOM ou interage com Puppeteer. É a unidade nativa do browser e evita conversões implícitas.

**Quando preferir pt:** geração de PDF via bibliotecas tipográficas (ex: jsPDF, docx), ou quando os valores vão ser lidos por humanos que pensam em "pontos de fonte".

**Escala tipográfica equivalente:**

| Função    | pt     | px     |
|-----------|--------|--------|
| Display   | 48pt   | 64px   |
| Título    | 32pt   | 42px ou 44px (múltiplo de 4, arred.) |
| Subtítulo | 20pt   | 28px (arred. up, múltiplo de 4) |
| Corpo     | 16pt   | 22px   |
| Caption   | 12pt   | 16px   |

Arredondamentos: a conversão matemática é 32×1.333=42.66px, mas como px inteiro, escolher 42px (próximo) ou 44px (mais legível; ainda múltiplo de 4). Essas escolhas não violam o método desde que consistentes dentro do deck.

## CSS base para cada tipo de slide

### Container universal

```css
width: 720pt;
height: 405pt;
position: relative;
overflow: hidden;
font-family: Arial, Helvetica, sans-serif;
```

### Área útil (inner wrapper)

```css
position: absolute;
top: 36pt;
left: 48pt;
right: 48pt;
bottom: 36pt;
```

### Acento lateral (barra vertical decorativa)

```css
position: absolute;
top: 0;
right: 0;         /* ou left: 0 */
width: 6pt;       /* 0.5x módulo */
height: 100%;
background: [cor-acento];
```

### Acento superior (barra horizontal)

```css
position: absolute;
top: 0;
left: 0;
right: 0;
height: 4pt;
background: [cor-acento];
```

### Bullets são marcadores tipográficos, não elementos gráficos

Bullet de lista deve ser marcador da própria tipografia (`::marker` em `<ul>` + `list-style`), não um `<div>` quadrado posicionado ao lado do `<p>`. O bullet pertence ao texto, acompanha o texto quando o texto quebra linha, e é editável como parte do conteúdo, não como bloco gráfico separado.

**Template canônico de lista Wollner (quadrado sólido):**

```html
<ul class="w-list">
  <li>Primeiro item da lista.</li>
  <li>Segundo item, eventualmente mais longo e que pode quebrar em duas linhas sem perder o alinhamento do marcador.</li>
</ul>
```

```css
.w-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.w-list li {
  position: relative;
  padding-left: 16pt;
  margin-bottom: 10pt;
  font-size: 12pt;
  color: [cor-texto];
  line-height: 1.4;
}
.w-list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.45em;           /* alinhado com a capital, não com a descida */
  width: 6pt;
  height: 6pt;
  background: [cor-acento];
}
```

Variantes:
- **Quadrado sólido** (padrão Wollner): `width/height:6pt; background:cor;`
- **Quadrado vazado**: `border:1pt solid cor; background:transparent;`
- **Linha horizontal fina** (dash editorial): `width:8pt; height:1pt; top:0.7em;`

**Por que `::before` e não `list-style-type: square`:**
- `list-style-type: square` do HTML tem cor, tamanho e posicionamento controlados pelo renderer — imprevisível entre navegadores e no Puppeteer/html2pptx.
- `::before` dá controle total sobre cor, tamanho, alinhamento vertical (`top:0.45em` casa com a altura-x da fonte), e funciona identicamente em html2pptx.

**Nunca usar:**
- `<div>` com `width:6px; height:6px` ao lado do `<p>` como bullet. Quebra em quebra de linha, exige `flex align-items:flex-start` e `margin-top:6px` arbitrário, e vira elemento gráfico dissociado do texto.
- Caracteres Unicode tipo `•` ou `■` no texto. Dependem da fonte disponível no PPTX, variam de tamanho, não dão controle de cor independente.

### Gotchas críticos do pipeline html2pptx

**Gotcha 1 — `<br>` dentro de h1-h6 gera gap de parágrafo no PPTX:**
O Playwright renderiza o `<br>` como quebra de linha visual, mas o html2pptx converte cada linha em um parágrafo PowerPoint separado com espaçamento padrão (~1× font-size). O resultado é um gap enorme entre as linhas do título.

Solução: **nunca usar `<br>` dentro de h1-h6**. Substituir por dois elementos irmãos:
```html
<!-- Errado -->
<h1>Primeira linha<br>Segunda linha</h1>

<!-- Correto -->
<h1 style="margin:0;line-height:1.1;">Primeira linha</h1>
<h1 style="margin:0 0 16pt 0;line-height:1.1;">Segunda linha</h1>
```

**Gotcha 2 — Caracteres Unicode especiais renderizam como lixo no PPTX:**
Caracteres como `·` (ponto médio U+00B7), `—` (em dash U+2014), `→` (seta) e similares podem aparecer como caixas, interrogações ou caracteres incorretos dependendo da fonte embarcada no PPTX.

Solução: usar **entidades HTML** no lugar de caracteres Unicode diretos:
| Caractere | Unicode direto | Entidade HTML segura |
|---|---|---|
| Ponto médio | `·` | `&middot;` |
| Travessão | `—` | `&mdash;` |
| Hífen longo | `–` | `&ndash;` |
| Seta direita | `→` | `&rarr;` |
| Multiplicação | `×` | `&times;` |

**Gotcha 3 — `linear-gradient` em div não é suportado pelo html2pptx:**
O Puppeteer renderiza o gradiente corretamente no HTML, mas o html2pptx não consegue converter `background:linear-gradient()` em formato PPTX nativo — o build falha com erro "Background images on DIV elements are not supported".

Solução: substituir gradientes por **overlays sólidos com rgba**:
```html
<!-- Errado -->
<div style="background:linear-gradient(to right, rgba(0,0,0,0.8), transparent);">

<!-- Correto: overlay sólido semi-transparente sobre a imagem -->
<div style="background:rgba(67,34,114,0.88);">
```
Se precisar de transição visual, usar dois divs sobrepostos com larguras diferentes e opacidades distintas.

### Robustez de layout: rótulos atômicos e flex-wrap

Caixas de texto em grids apertados quebram linhas em lugares errados ("78" + "%" separados, "Sistema garante" em duas linhas, "48pt lateral, 36pt" + "vertical" em linha separada). Três princípios para robustez:

**1. Rótulos atômicos com `white-space:nowrap`.** Qualquer elemento cujo sentido se perde com quebra no meio:
- Nome de cor, hex code, número+unidade ("12pt", "48pt")
- Label UPPERCASE curto (até 3 palavras): "DISPLAY", "CAPA", "DADO"
- Título de card/coluna: "Sistema garante", "Nunca"

**2. Container flexível via `flex-wrap:wrap`**, não `flex:1` forçado. Cada item mantém sua largura natural. Se falta espaço, a linha inteira quebra (não uma palavra solta).

```css
display: flex;
gap: 20pt;
flex-wrap: wrap;
```

**3. Encurtar o rótulo antes de espremer o container.**
- "48pt lateral, 36pt vertical" → "48/36pt"
- "Colunas 3 × 192pt + calha 24pt" → separar em "Colunas 3 × 192pt" + "Calha 24pt"

Rótulos atômicos curtos são mais robustos e mais Wollner.

**Não usar `nowrap`** em subtítulos longos, descrições, parágrafos de corpo — deixar quebrar naturalmente.

### Barra inscrita dentro de card arredondado

Barra de acento posicionada dentro de um card com `border-radius` é **inscrita**: mais curta que o card nos dois eixos, afastada também da borda lateral, e arredondada nos **quatro cantos** com seu próprio raio pequeno.

```css
/* Card com border-radius: 4-6pt (raio sutil preferido) */
position: absolute;
top: 24pt;       /* offset vertical = ~2× radius do card, com folga */
bottom: 24pt;
left: 12pt;      /* offset horizontal — NÃO colar em left:0 ou right:0 */
width: 4pt;
background: [cor-acento];
border-radius: 2pt;  /* 4 cantos, sem valores 0 */
```

E reservar `padding-left` (ou `padding-right`) extra no card para o conteúdo não encostar na barra (ex.: `padding: 24pt 24pt 24pt 36pt`).

**Regras de consistência:**

1. **Raio do card sutil.** Usar 4pt em mini-cards (thumbs, swatches) e 6pt em cards de conteúdo. Evitar 8–12pt — fica infantil e aumenta o desencontro com a barra inscrita.
2. **Barra sempre arredondada nos 4 cantos.** Nunca `border-radius: 0 2pt 2pt 0` ou análogo. Usar `border-radius: 2pt` uniforme. A barra é um elemento próprio, não uma extensão da borda do card.
3. **Offset horizontal obrigatório.** Barra nunca em `left:0` ou `right:0`. Afastar ao menos 8–12pt da borda interna para que os dois raios diferentes (card e barra) não disputem a mesma quina.
4. **Offset vertical com folga.** Top/bottom ≥ 2× radius do card. Isso garante que o arco do card já terminou antes da barra começar.

**Por que todas essas regras:** radius de barra fina (2pt) e radius de card são arcos de raios diferentes. Se ocupam o mesmo canto, os arcos não casam e aparece um "dente" visual. A barra inscrita com offset nos dois eixos resolve estruturalmente: os dois elementos nunca competem pelo mesmo pixel.

**Não usar:** `border-left/right/top/bottom: Npx solid` em cards arredondados. A borda CSS é reta internamente mesmo com radius. Trocar por barra inscrita conforme acima.

## Escala tipográfica completa

```css
/* Display — capa */
font-size: 48pt; font-weight: bold; line-height: 1.0; color: #FFFFFF;

/* Título — slide normal */
font-size: 32pt; font-weight: bold; line-height: 1.1; color: #1A1A1A;

/* Subtítulo / label de seção */
font-size: 20pt; font-weight: normal; line-height: 1.2; color: #1A1A1A;

/* Corpo */
font-size: 16pt; font-weight: normal; line-height: 1.5; color: #1A1A1A;

/* Caption / footnote */
font-size: 12pt; font-weight: normal; line-height: 1.4; color: #555555;
```

## Paletas pré-definidas

### Wollner Neutro (padrão)
```
#1A1A1A  primária (texto)
#F5F5F0  fundo
#0055A4  acento (azul institucional)
```

### Wollner Escuro (capa, seção)
```
#1A1A1A  fundo
#F5F5F0  texto
#E8C84A  acento (amarelo)
```

### Padrão de 6 slots (marca com cor institucional + acento)

Quando a marca do projeto já define primária, fundo claro e acento, este padrão de 6 slots funciona bem:

```
[PRIMÁRIA]    âncora — títulos, logotipo, CTAs
[FUNDO-CLARO] fundo de seções secundárias e cards; NUNCA texto
[ACENTO]      máximo 10% da composição — dados, highlights, barras
[CORPO]       texto de corpo em fundo claro (≠ preto puro)
[CAPTION]     caption e label secundário (contraste reduzido)
#ffffff       fundo principal
```

Regras de proporção e aplicação não mudam: 60% fundo / 30% primária / 10% acento. Uma única família tipográfica por deck. Raio de cards: 4pt (mini) ou 6pt (conteúdo). A paleta concreta é derivada da marca do projeto durante a entrevista inicial (ver SKILL.md, Etapa 1).

## Layouts HTML completos

### Capa

```html
<div style="width:720pt; height:405pt; background:#1A1A1A; font-family:Arial,Helvetica,sans-serif; position:relative; overflow:hidden;">
  <!-- Acento lateral -->
  <div style="position:absolute; top:0; left:0; width:8pt; height:100%; background:#0055A4;"></div>
  <!-- Conteúdo no terço inferior -->
  <div style="position:absolute; bottom:60pt; left:72pt; right:48pt;">
    <p style="font-size:14pt; color:#0055A4; margin:0 0 12pt 0; letter-spacing:2pt; text-transform:uppercase;">SUBTÍTULO OU CATEGORIA</p>
    <h1 style="font-size:48pt; font-weight:bold; color:#F5F5F0; margin:0 0 16pt 0; line-height:1.0;">Título principal do deck</h1>
    <p style="font-size:16pt; color:#888888; margin:0;">Organização · Data</p>
  </div>
</div>
```

### Slide de tese (1 ideia)

```html
<div style="width:720pt; height:405pt; background:#F5F5F0; font-family:Arial,Helvetica,sans-serif; position:relative; overflow:hidden;">
  <div style="position:absolute; top:0; left:0; right:0; height:4pt; background:#0055A4;"></div>
  <div style="position:absolute; top:36pt; left:48pt; right:48pt; bottom:36pt;">
    <h1 style="font-size:32pt; font-weight:bold; color:#1A1A1A; margin:0 0 36pt 0; line-height:1.1;">Título da tese</h1>
    <p style="font-size:16pt; color:#1A1A1A; line-height:1.5; max-width:500pt;">Corpo do argumento central. Máximo 3-4 linhas. Uma ideia por slide.</p>
  </div>
</div>
```

### Slide de 2 colunas

```html
<div style="width:720pt; height:405pt; background:#F5F5F0; font-family:Arial,Helvetica,sans-serif; position:relative; overflow:hidden;">
  <div style="position:absolute; top:36pt; left:48pt; right:48pt; bottom:36pt;">
    <h1 style="font-size:32pt; font-weight:bold; color:#1A1A1A; margin:0 0 24pt 0; line-height:1.1;">Título</h1>
    <div style="display:flex; gap:24pt; align-items:flex-start;">
      <div style="flex:1;">
        <p style="font-size:20pt; font-weight:bold; color:#0055A4; margin:0 0 12pt 0;">Label A</p>
        <p style="font-size:16pt; color:#1A1A1A; line-height:1.5; margin:0;">Conteúdo da coluna esquerda.</p>
      </div>
      <div style="width:1pt; background:#CCCCCC; align-self:stretch;"></div>
      <div style="flex:1;">
        <p style="font-size:20pt; font-weight:bold; color:#0055A4; margin:0 0 12pt 0;">Label B</p>
        <p style="font-size:16pt; color:#1A1A1A; line-height:1.5; margin:0;">Conteúdo da coluna direita.</p>
      </div>
    </div>
  </div>
</div>
```

### Slide de processo (3 etapas)

```html
<div style="width:720pt; height:405pt; background:#F5F5F0; font-family:Arial,Helvetica,sans-serif; position:relative; overflow:hidden;">
  <div style="position:absolute; top:36pt; left:48pt; right:48pt; bottom:36pt;">
    <h1 style="font-size:32pt; font-weight:bold; color:#1A1A1A; margin:0 0 36pt 0;">Título do processo</h1>
    <div style="display:flex; gap:0; align-items:flex-start;">
      <!-- Etapa 1 -->
      <div style="flex:1; text-align:center;">
        <div style="width:48pt; height:48pt; background:#0055A4; margin:0 auto 12pt auto; display:flex; align-items:center; justify-content:center;">
          <span style="font-size:24pt; font-weight:bold; color:#F5F5F0;">1</span>
        </div>
        <p style="font-size:16pt; font-weight:bold; color:#1A1A1A; margin:0 0 8pt 0;">Etapa</p>
        <p style="font-size:12pt; color:#555555; line-height:1.4; margin:0;">Descrição breve da etapa.</p>
      </div>
      <!-- Seta -->
      <div style="width:24pt; padding-top:20pt; text-align:center; color:#CCCCCC; font-size:20pt;">→</div>
      <!-- Etapa 2 -->
      <div style="flex:1; text-align:center;">
        <div style="width:48pt; height:48pt; background:#0055A4; margin:0 auto 12pt auto; display:flex; align-items:center; justify-content:center;">
          <span style="font-size:24pt; font-weight:bold; color:#F5F5F0;">2</span>
        </div>
        <p style="font-size:16pt; font-weight:bold; color:#1A1A1A; margin:0 0 8pt 0;">Etapa</p>
        <p style="font-size:12pt; color:#555555; line-height:1.4; margin:0;">Descrição breve da etapa.</p>
      </div>
      <!-- Seta -->
      <div style="width:24pt; padding-top:20pt; text-align:center; color:#CCCCCC; font-size:20pt;">→</div>
      <!-- Etapa 3 -->
      <div style="flex:1; text-align:center;">
        <div style="width:48pt; height:48pt; background:#0055A4; margin:0 auto 12pt auto; display:flex; align-items:center; justify-content:center;">
          <span style="font-size:24pt; font-weight:bold; color:#F5F5F0;">3</span>
        </div>
        <p style="font-size:16pt; font-weight:bold; color:#1A1A1A; margin:0 0 8pt 0;">Etapa</p>
        <p style="font-size:12pt; color:#555555; line-height:1.4; margin:0;">Descrição breve da etapa.</p>
      </div>
    </div>
  </div>
</div>
```

### Slide de número grande (destaque estatístico)

```html
<div style="width:720pt; height:405pt; background:#F5F5F0; font-family:Arial,Helvetica,sans-serif; position:relative; overflow:hidden;">
  <div style="position:absolute; top:0; right:0; width:6pt; height:100%; background:#0055A4;"></div>
  <div style="position:absolute; top:36pt; left:48pt; right:72pt; bottom:36pt; display:flex; flex-direction:column; justify-content:center;">
    <p style="font-size:14pt; color:#0055A4; margin:0 0 8pt 0; letter-spacing:2pt; text-transform:uppercase;">Dado relevante</p>
    <p style="font-size:96pt; font-weight:bold; color:#1A1A1A; margin:0; line-height:1.0;">78%</p>
    <p style="font-size:20pt; color:#1A1A1A; margin:12pt 0 0 0;">Descrição do que esse número significa.</p>
    <p style="font-size:12pt; color:#888888; margin:16pt 0 0 0;">Fonte: nome da fonte, ano</p>
  </div>
</div>
```

## Gotchas html2pptx no Windows

1. **charset**: sempre incluir `<meta charset="utf-8">` no HTML pai
2. **dimensões do slide**: definir `width:720pt; height:405pt; margin:0; padding:0; overflow:hidden` em `html, body` no `<style>` do head. Não envolver tudo num div-wrapper extra — o próprio `<body>` é o slide
3. **position absolute**: funciona, mas elementos filhos precisam de `position:relative` no pai
4. **flex + flex-wrap**: AMBOS suportados. `flex-wrap:wrap` é inclusive recomendado em footers métricos e barras de rótulos atômicos — dá robustez quando o conteúdo excede a largura
5. **data URI**: imagens embutidas funcionam, preferir PNG em base64; ler de arquivo temporário (`/tmp/logo-b64.txt`) via `fs.readFileSync` no gerador
6. **border-radius**: suporte pleno, mas preferir raios sutis (4–6pt) — ver seção "Barra inscrita dentro de card arredondado"
7. **gradiente**: NÃO usar (não renderiza corretamente e viola o método Wollner)
8. **fontes externas via Google Fonts**: o `<link>` não carrega no Puppeteer headless; declarar a família na cadeia `font-family` com fallback web-safe (`'Rubik', Arial, sans-serif`) e aceitar que a renderização final usa o fallback — ou embutir @font-face com base64 da fonte
9. **`<br>` dentro de `<h1>`–`<h6>` gera gap enorme no PPTX, não quebra de linha suave.** O html2pptx converte `<br>` em parágrafo separado, e o PowerPoint aplica espaçamento de parágrafo antes e depois de cada um. Num título de 42pt isso vira ~50pt de vazio entre as linhas visuais. Solução: dois elementos irmãos com `margin:0`. `<br>` é seguro apenas em `<p>` com fonte ≤10pt.

10. **viewport do Playwright no build.js DEVE casar com o tamanho em pt do HTML**. Se o `<body>` é `720×405pt`, o viewport precisa ser `960×540px` (pt × 96/72), não `720×405px`. Usar `deviceScaleFactor` para alta resolução, nunca multiplicar o viewport. Erro clássico: conteúdo aparece numa "ilha" de ~56% no canto superior-esquerdo do PPTX. O `screenshot.js` não tem esse bug porque já usa 960×540; o bug antigo estava no `build.template.js` (corrigido 2026-04)

## Workflow de revisão visual antes do build PPTX

A regra é: **nunca construir o PPTX sem passar por screenshot dos HTMLs primeiro**. Build → upload → olhar o PPTX no Drive é um loop de 2 minutos por iteração. Screenshot do HTML é de 3 segundos.

Pipeline padrão em três arquivos:

```
projeto/
├── gen-slides.js      # gera slides/*.html a partir das constantes de design
├── screenshot.js      # roda playwright em cada HTML, emite out/thumbs/*.png
└── build.js           # loop final: html2pptx em cada HTML → out/deck.pptx
```

**screenshot.js de referência** (viewport 960×540 = 720×405pt em escala 1.333x):

```js
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 960, height: 540 } });
  const page = await context.newPage();
  const slides = fs.readdirSync('slides').filter(f => f.endsWith('.html'));
  fs.mkdirSync('out/thumbs', { recursive: true });
  for (const s of slides) {
    await page.goto('file://' + path.resolve('slides', s));
    await page.screenshot({ path: `out/thumbs/${s.replace('.html', '.png')}` });
    console.log('shot', s.replace('.html', '.png'));
  }
  await browser.close();
})();
```

**Ciclo de iteração:**
1. Editar `gen-slides.js`
2. `node gen-slides.js && node screenshot.js`
3. Abrir PNG afetado e conferir: colapso, corte, sobreposição, raio, alinhamento
4. Iterar na HTML até o PNG estar limpo
5. Só então rodar `build.js` + upload

**Por que isso importa:** html2pptx renderiza via Puppeteer, o mesmo motor do playwright. O PNG do screenshot é quase idêntico ao slide final do PPTX. Bugs de layout que aparecem no PNG aparecem no PPTX. Corrigir no loop curto.

## Checklist de robustez por slide

Antes de aceitar um slide como pronto, rodar mentalmente este checklist contra o screenshot:

**Texto:**
- [ ] Nenhum rótulo atômico quebrou no meio ("78" + "%", "Branc" + "o", etc.)?
- [ ] Nenhum título de card quebrou em duas linhas indevidamente?
- [ ] Nenhum texto está sendo cortado por `overflow:hidden`?
- [ ] Footer métrico (com múltiplos rótulos curtos) está inteiro numa linha ou quebra em linha inteira, não em palavra solta?

**Cantos e raios:**
- [ ] Raio dos cards é sutil (4pt mini, 6pt conteúdo)?
- [ ] Toda barra inscrita tem `border-radius:2pt` uniforme (4 cantos)?
- [ ] Toda barra inscrita tem offset dos dois eixos (não em `left:0`/`right:0`)?
- [ ] Card com barra inscrita tem padding extra no lado da barra?

**Hierarquia:**
- [ ] Máximo 3 cores no slide (fundo, primária, acento)?
- [ ] Máximo 3 tamanhos de fonte?
- [ ] Bullets são `<ul>` + `::before`, não `<div>` ao lado de `<p>`?
- [ ] Geometria é elementar (quadrado, círculo, triângulo, linha)?

**Grid:**
- [ ] Todos os valores de espaço são múltiplos do módulo base?
- [ ] Nenhum elemento invade a margem (48pt lateral, 36pt vertical)?
- [ ] Logo do rodapé não está sendo comprimido por flex?
- [ ] Posição do logo segue a regra de prioridade: (1) superior direito se livre; (2) inferior direito se superior ocupado; (3) inferior esquerdo se ambos ocupados. Logo nunca sobrepõe foto ou conteúdo.