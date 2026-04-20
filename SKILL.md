---
name: wollner-design
description: |-
  This skill should be used when the user asks to "design no estilo Wollner", "aplicar método Wollner", "criar slide com grid modular", "layout sistemático", "programação visual", "design funcionalista", "grid Ulm", or asks for slides/presentations with systematic, mathematical, or modular design discipline. Also trigger when user says "sem decoração", "só o essencial", "design com rigor", or references Bauhaus/Swiss/Ulm aesthetics.
version: 0.1.0
---

# Wollner Design System

> Esta skill é uma homenagem a **Alexandre Wollner** (1928-2021), pai do design moderno brasileiro.
> Foi criada por **Vinicius Saraceni**, ex-aluno de Wollner, que atua hoje no desenvolvimento de iniciativas ecossistêmicas e carrega o design como princípio de trabalho. Para Vinicius, ter sido aluno de Wollner é um orgulho e uma responsabilidade — e esta skill existe para que o método dele continue vivo, ensinando e construindo, como ele fez com as grandes marcas do Brasil.

---

Alexandre Wollner (1928-2021) foi o criador do design moderno brasileiro. Estudou na HfG Ulm (1955-1958), fundou o primeiro escritório de design do Brasil (Forminform, 1958) e a ESDI (1962). Criou as identidades visuais de Itaú, Hering, Eucatex, Klabin e Coqueiro. Seu método: **sistema antes de forma, módulo antes de estética, função antes de beleza**.

---

## Princípio central

> "Design não é arte. Design é projeto."

Cada slide é um **sistema de comunicação**, não uma página decorada. A forma deriva da função. A estética emerge do rigor estrutural, nunca é aplicada por cima.

---

## Os 5 pilares técnicos

### 1. Módulo como unidade mínima

Antes de qualquer elemento, definir a **unidade modular base** (ex: 8pt, 12pt, 16pt). Todo espaçamento, tamanho de fonte, margem e padding é múltiplo dessa unidade. Nunca usar valores arbitrários.

**Regra prática para PPT (720x405pt):**
- Módulo base: **12pt** (≡ **16px** em pipelines html2pptx — ver equivalência abaixo)
- Margens: 48pt (4× módulo) ≡ 64px
- Coluna: derivada do grid; nunca livre

**Equivalência pt ⇄ px em pipelines html2pptx:**

Puppeteer renderiza em px e html2pptx converte para pt na saída. A conversão oficial é `1pt = 1.333px` (96 DPI / 72). Para manter rigor modular sem atrito com o toolchain, adotar o sistema dual:

| Módulo | pt   | px   | Sub-módulo (¼) |
|--------|------|------|----------------|
| base   | 12pt | 16px | 4px = 3pt      |
| ½      | 6pt  | 8px  | —              |
| 2×     | 24pt | 32px | —              |
| 3×     | 36pt | 48px | —              |
| 4×     | 48pt | 64px | —              |

**Regra de conformidade:** um valor em px é considerado modular se for múltiplo de **4px** (= ¼ do módulo). Valores em pt devem ser múltiplos de **3pt**. Isso preserva o ritmo cartesiano do método Ulm/Wollner mesmo quando a unidade física varia.

Declarar no início do gerador (`gen-slides.js`) qual unidade domina o arquivo — e usá-la de forma coerente. Nunca misturar `font-size:32px` com `padding:24pt` no mesmo elemento.

### 2. Grid modular fixo

O grid não é uma grelha decorativa - é a **gramática** do slide. Uma vez definido, nunca violar.

**Grid padrão Wollner para 720x405pt:**
```
Margem lateral:    48pt
Margem vertical:   36pt
Colunas:           2 (largura útil 624pt = 2x 300pt + 24pt calha)
Linhas de base:    múltiplos de 12pt
```

**Variante de 3 colunas** (para conteúdo denso):
```
3x 192pt + 2x 24pt calha
```

### 3. Geometria elementar

Usar apenas **triângulo, quadrado, círculo** como formas visuais de suporte. Nenhuma forma decorativa. Se um ícone ou ilustração não puder ser reduzido a uma forma básica, eliminar.

Cores em blocos geométricos limpos, sem gradiente, sem sombra, sem textura.

### 4. Tipografia derivada do módulo

Escala tipográfica em razão fixa. Para PPT com módulo 12pt:

| Função    | Tamanho | Peso    | Uso                   |
|-----------|---------|---------|-----------------------|
| Display   | 48pt    | Bold    | Título de capa        |
| Título    | 32pt    | Bold    | Título de slide       |
| Subtítulo | 20pt    | Regular | Subtítulo / seção     |
| Corpo     | 16pt    | Regular | Texto principal       |
| Caption   | 12pt    | Regular | Fonte, nota, rótulo   |

**Regras:**
- Máximo **2 tamanhos por slide** (exceto capa)
- Nunca itálico decorativo
- Alinhamento: esquerdo por padrão, centralizado só em capas
- Fonte: Arial ou Helvetica (web-safe, sem serifa, sem ambiguidade)
- **Bullets são elementos tipográficos, não gráficos.** Usar `<ul>` + `::before` para o marcador (quadrado sólido 6pt na cor de acento). Nunca `<div>` posicionado ao lado do `<p>`. Detalhes em `references/wollner-ppt-tecnico.md`.
- **Posição do logotipo: hierarquia de três opções.** (1) Canto superior direito — posição canônica, usar sempre que o canto estiver livre. (2) Canto inferior direito — quando o superior direito está ocupado por conteúdo ou imagem. (3) Canto inferior esquerdo — quando ambos os cantos direitos estão ocupados (ex: slides com foto ou vinhetas ocupando toda a coluna direita). O logo nunca sobrepõe foto, dado ou elemento de conteúdo.
- **Cantos sutis, sempre uniformes.** `border-radius` de cards entre 4pt (mini-cards) e 6pt (cards de conteúdo). Nunca 8–12pt. Barras de acento inscritas dentro de cards têm raio em todos os 4 cantos (2pt uniforme) e offset tanto vertical quanto horizontal — nunca coladas na borda.

### 5. Paleta restrita

Máximo **3 cores com proporção definida**. Nunca livre.

**Paleta base Wollner:**
```
Primária:    #1A1A1A  (quase preto - texto, peso, âncora)
Secundária:  #F5F5F0  (branco sujo - fundo, respiro)
Acento:      1 cor forte (definida pelo contexto - ex: #0055A4 azul institucional)
```

Proporção sugerida: 60% fundo / 30% primária / 10% acento.

Nunca usar mais de uma cor de acento no mesmo deck.

---

## Workflow de produção

### Etapa 1: Entrevista inicial em 3 camadas

Antes de escrever uma linha de HTML, rodar esta entrevista. Wollner é um método, mas o método precisa de inputs concretos. Não inventar respostas — perguntar. Se o usuário já respondeu em mensagem anterior, reusar; se falta algum item, perguntar só o que falta.

#### Camada 1 — Captura de referência (abertura)

Começar pela forma de menor fricção. Oferecer três caminhos ao usuário:

**A. Tem link de referência?** (site da marca, página de produto, guia público)
- Rodar `node scripts/extract-brand.js <URL>` — captura paleta visual (via screenshot) e paleta CSS declarada, tipografia, e sugere mapeamento para os slots Wollner.
- Requer `playwright` e `colorthief` instalados (ver `scripts/requirements.md`).
- Saída é JSON — mostrar ao usuário as cores top-5 e fontes detectadas, com prévia visual (hex + swatch).

**B. Tem arquivo de referência?** (manual de marca em PDF, screenshot do site, PPT anterior, logo em PNG)
- Para imagem (PNG/JPG): `node scripts/extract-brand.js <caminho>` — puxa paleta visual.
- Para PDF ou PPTX: abrir com `Read` e ler paleta/tipografia declaradas no conteúdo.

**C. Não tem referência, só quero conversar.** → pular para Camada 2 fazendo as perguntas diretas.

> **Regra:** o extractor erra ~20% do tempo (marcas com muita imagem hero, sites com design system fraco). Nunca aceitar o output sem validação humana. A Camada 2 é obrigatória mesmo quando a Camada 1 roda.

#### Camada 2 — Confirmação e correção dirigida

Com base no que veio da Camada 1 (ou do zero), fechar as variáveis do sistema. Perguntar apenas o que ainda falta.

**1. Marca e identidade**
- Marca/projeto? Logotipo (caminho/URL)?
- Cor **primária** (hex) — âncora institucional, títulos, CTAs.
- Cor de **acento** (hex) — máximo 10% da composição: dados, highlights, barras.
- Cor de **fundo secundário** (hex) — cards e seções alternadas. Se ausente, a skill propõe um tom neutro derivado.

**2. Tipografia**
- **Família tipográfica** (Rubik, Inter, Helvetica, etc.)?
- Fallback? (Se ausente, Arial/Helvetica.)
- Atenção: fontes via Google Fonts podem não renderizar em Playwright headless sem `<link>` explícito. A cadeia `font-family` deve terminar em uma fonte web-safe.

**3. Deck**
- **Formato?** Padrão: 720×405pt (16:9). Alternativas: 960×540pt, A4 paisagem.
- Quantos slides? **Finalidade** (pitch, institucional, guia de identidade, relatório)?
- **Público-alvo** que muda hierarquia (executivo = síntese / técnico = densidade)?

**4. Restrições ou referências adicionais**
- Manual de marca, apresentação anterior ou template obrigatório?
- Conteúdo pronto (texto, dados, imagens) ou estrutura também a definir?

#### Camada 3 — Declaração do sistema

Antes do primeiro slide, emitir este bloco explícito para o usuário (ele vira o cabeçalho do `gen-slides.js`):

```
Projeto: [nome]
Formato: [WxH]pt ([proporção])
Módulo base: 12pt
Margens: 48pt lateral, 36pt vertical
Grid: 3 colunas × 192pt, calha 24pt
Escala tipográfica: Display 48pt / Título 32pt / Subtítulo 20pt / Corpo 16pt / Caption 12pt
Família: [fonte-da-marca], [fallback web-safe]
Paleta:
  primária   [#hex]   âncora institucional
  acento     [#hex]   máximo 10% da composição
  fundo-2    [#hex]   cards e seções secundárias
  corpo      [#hex]   texto em fundo claro (≠ preto puro)
  caption    [#hex]   label secundário
  branco     #ffffff  fundo principal
Raio de cards: 4pt (mini) / 6pt (conteúdo)
```

Só depois desse bloco declarado começar o HTML do primeiro slide.

### Etapa 2: Estrutura HTML/CSS por slide

Cada slide é um arquivo HTML independente com dimensão 720×405pt (ou formato declarado). CSS inline. O corpo do HTML é um documento completo — `<!DOCTYPE>`, `<meta charset="utf-8">`, `<style>` — renderizado depois pelo Playwright.

**Template base Wollner:**
```html
<div style="width:720pt; height:405pt; background:#F5F5F0; font-family:Arial,Helvetica,sans-serif; position:relative; overflow:hidden;">
  <div style="position:absolute; top:36pt; left:48pt; right:48pt; bottom:36pt;">
    <div style="position:absolute; top:0; right:0; width:6pt; height:100%; background:#0055A4;"></div>
    <h1 style="font-size:32pt; font-weight:bold; color:#1A1A1A; margin:0 0 24pt 0; line-height:1.1;">
      Título do slide
    </h1>
    <div style="display:flex; gap:24pt;">
      <div style="flex:1; font-size:16pt; color:#1A1A1A; line-height:1.5;">
        Coluna esquerda
      </div>
      <div style="flex:1; font-size:16pt; color:#1A1A1A; line-height:1.5;">
        Coluna direita
      </div>
    </div>
  </div>
</div>
```

### Etapa 3: Pipeline de quatro scripts

A skill é auto-contida. Todos os scripts ficam em `scripts/` dentro da skill e são copiados/adaptados para a pasta do projeto. Fluxo:

```
scripts/
├── extract-brand.js           # URL ou imagem → paleta + tipografia (Camada 1)
├── gen-slides.template.js     # CFG + paleta → slides/*.html (editar por projeto)
├── screenshot.template.js     # playwright em cada HTML → out/thumbs/*.png (loop curto)
├── build.template.js          # 2x render + pptxgenjs → out/deck.pptx (loop longo)
├── requirements.md            # deps npm: playwright, pptxgenjs, colorthief, node-html-parser
└── README.md                  # ordem canônica de execução
```

Ciclo de iteração: `gen-slides → screenshot → abrir PNG → ajustar`. **Nunca rodar `build.js` antes de os thumbs estarem limpos.** Screenshot é 3s por slide; build é 2min por deck. Otimizar o loop curto.

Ver `scripts/README.md` para comandos exatos e `scripts/requirements.md` para instalação de dependências.

### Etapa 4: Validação Wollner (duas camadas)

**Camada A — método (checklist rápido):**
- [ ] Todo valor de espaço é múltiplo do módulo base (12pt ou 16px; sub-módulo aceito = 3pt / 4px)
- [ ] Toda width fixa de coluna de layout é múltiplo de 12pt e derivada do grid (192 / 300 / 312 / 336 / 360 / 408 / 432pt)
- [ ] Posição do logo segue a hierarquia: (1) superior direito → (2) inferior direito → (3) inferior esquerdo
- [ ] Bloco título+subtítulo tem max-width:480pt (2/3 de 720pt) em slides com logo superior direito
- [ ] Em colunas parciais (não full-width), o h1 tem max-width calculado para não entrar na zona do logo: x_logo_no_slide − x_início_coluna − padding_lateral
- [ ] Unidade coerente por arquivo — não misturar px e pt no mesmo gerador
- [ ] Grid não foi violado (elementos dentro das margens)
- [ ] Máximo 3 tamanhos de fonte no slide (**exceção documental:** meta-slides que *declaram* a escala)
- [ ] Máximo 3 cores no deck de conteúdo (**exceção documental:** slide que *declara* a paleta)
- [ ] Sem gradiente, sombra ou textura
- [ ] Alinhamento esquerdo por padrão
- [ ] Hierarquia visual clara sem usar cor como muleta

**Camada B — robustez (contra o screenshot):**
- [ ] Nenhum rótulo atômico quebrou no meio ("78" + "%", "Branc" + "o")
- [ ] Nenhum título de card quebrou em duas linhas indevidamente
- [ ] Bullets são `<ul>` + `::before` (tipográficos, não `<div>` gráficos)
- [ ] Raio de cards é sutil (4pt mini, 6pt conteúdo)
- [ ] Barras inscritas têm `border-radius:2pt` nos 4 cantos e offset nos dois eixos
- [ ] Logo no rodapé não está sendo comprimido por flex (`flex-shrink:0`)

Detalhes, CSS de referência e gotchas em `references/wollner-ppt-tecnico.md`.

---

## Tipos de slide e layouts canônicos

### Capa
- Fundo: cor primária ou cor de acento (bloco sólido)
- Título: Display 48pt, branco, alinhado à esquerda, no terço inferior
- Logotipo: canto superior esquerdo ou inferior direito, nunca centralizado

### Slide de tese (1 ideia)
- Título: 32pt, topo esquerdo
- Corpo: 1 parágrafo ou 3 bullet points máximo, 16pt
- Nenhum elemento adicional

### Slide de dados (1 gráfico)
- Título: 32pt, topo
- Gráfico: ocupa 70% da área útil
- Caption: 12pt abaixo do gráfico, alinhado à borda do gráfico
- Fonte: 12pt, rodapé

### Slide de comparação (2 colunas)
- Título: 32pt, topo
- 2 colunas simétricas (300pt cada, calha 24pt)
- Rótulo de coluna: 20pt, peso bold
- Conteúdo: 16pt

### Slide de processo (sequência linear)
- 3 a 5 etapas em linha horizontal
- Cada etapa: forma geométrica (quadrado ou círculo) + número + label 16pt
- Setas mínimas (1pt, cor primária)

---

## O que nunca fazer

| Proibido                        | Por quê                                  |
|---------------------------------|------------------------------------------|
| Degradê ou gradiente            | Introduz ambiguidade visual              |
| Mais de 3 cores                 | Destrói hierarquia                       |
| Fonte serifada em corpo         | Reduz legibilidade em projeção           |
| Mais de 2 tamanhos por slide    | Fragmenta a atenção                      |
| Imagem decorativa sem função    | Design não é arte                        |
| Sombra em elementos             | Falsa profundidade, sinal de fragilidade |
| Animação sem propósito          | Distrai do conteúdo                      |
| Clip art ou ícone complexo      | Só formas elementares                    |
| Texto centralizado em corpo     | Dificulta leitura em sequência           |
| Elemento fora do grid           | Quebra o sistema                         |
| Divisão de coluna com valor não-modular | Ex: 368pt, 436pt, 310pt. Toda width fixa de coluna de layout deve ser múltiplo de 12pt (ou submódulo 3pt). Derivar sempre do grid: 192pt (1 col), 300pt (2 col), 408pt (2+calha), 432pt (3+calhas de 24pt). |
| Logo em posição arbitrária | Usar hierarquia obrigatória: (1) superior direito se livre; (2) inferior direito se superior ocupado; (3) inferior esquerdo se ambos os cantos direitos ocupados por foto ou conteúdo. Nunca sobrepor imagem. |
| Título/subtítulo ultrapassando 2/3 da largura | O bloco h1 + p de subtítulo de cada slide nunca deve exceder 2/3 da largura total (480pt de 720pt). Deixa espaço livre para o logo no canto superior direito e evita colisão. Aplicar `max-width:480pt` nesses elementos. |
| Conteúdo entrando na zona de clearance do logo | Quando o logo está no canto superior direito (tr), ele ocupa um retângulo absoluto de 72pt×31pt a 36pt da borda. Todo conteúdo (h1, cards, textos) na mesma região deve ter max-width calculado para não entrar nessa zona. Fórmula: calcular a posição x do logo no slide (720−36−72=612pt), subtrair a origem da coluna de conteúdo e o padding lateral para obter o max-width seguro do h1. |
| Bullet como `<div>` gráfico     | Bullet é parte do texto, não elemento dissociado |
| `border-radius` 8–12pt em cards | Fica infantil; preferir 4–6pt sutil      |
| Barra inscrita com `border-radius` assimétrico (valor 0 em algum canto) | A barra tem raio próprio; raio parcial parece bug de renderização |
| Barra colada em `left:0` / `right:0` dentro de card arredondado | Dois raios diferentes competem pela mesma quina → "dente" visual |
| `flex:1` uniforme em container com rótulos atômicos | Comprime rótulos curtos e quebra "78%" em "78" + "%"; usar `flex-wrap:wrap` |

---

## Autonomia da skill

A skill é auto-contida: define o **sistema de design** (método Wollner) **e** executa a geração técnica (HTML → PNG → PPTX) via os scripts em `scripts/`. Não depende de outras skills. Uma pessoa instalando a skill pela primeira vez precisa apenas de Node.js + `npm install` conforme `scripts/requirements.md`.

Fluxo completo end-to-end:
1. Entrevista em 3 camadas → declaração do sistema
2. `gen-slides.js` (editado por projeto) → `slides/*.html`
3. `screenshot.js` → `out/thumbs/*.png` para revisão rápida
4. Validação Wollner (Camada A método + Camada B robustez)
5. `build.js` → `out/deck.pptx`

---

## Recursos adicionais

- **`scripts/README.md`** — ordem canônica do pipeline e comandos
- **`scripts/requirements.md`** — dependências npm e o que cada uma faz
- **`scripts/extract-brand.js`** — captura paleta + tipografia de URL/imagem
- **`scripts/gen-slides.template.js`** — template de gerador de slides
- **`scripts/screenshot.template.js`** — template de renderização PNG
- **`scripts/build.template.js`** — template de build PPTX 16:9
- **`references/wollner-ppt-tecnico.md`** — CSS detalhado, parâmetros de módulo, gotchas de robustez
- **`references/wollner-fundamentos.md`** — biografia, HfG Ulm, citações primárias
