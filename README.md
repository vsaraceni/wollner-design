# Wollner Design

> Skill em homenagem a **Alexandre Wollner** (1928–2021), pai do design moderno brasileiro.

## Sobre Alexandre Wollner

Alexandre Wollner é o pai do design moderno brasileiro. Estudou na HfG Ulm (1955–1958), a escola alemã que sucedeu a Bauhaus, onde absorveu o rigor sistemático da tradição funcionalista. De volta ao Brasil, fundou o Forminform (1958), primeiro escritório de design do país, e depois a ESDI (1962), primeira escola superior de design da América Latina.

Ao longo de seis décadas, Wollner assinou algumas das identidades visuais mais duradouras do Brasil: Itaú, Hering, Eucatex, Klabin e Coqueiro, entre outras. Seu método era o mesmo em todas: **sistema antes de forma, módulo antes de estética, função antes de beleza**. Design, para ele, era projeto — uma disciplina de engenharia visual, não de expressão pessoal.

## Sobre esta skill

Esta skill foi criada por **Vinicius Saraceni**, ex-aluno de Wollner, como homenagem e perpetuação do método. Está aberta ao público para que qualquer pessoa possa projetar sistemas de comunicação com o rigor que ele ensinou.

A skill estrutura o método em três fases:

- **Diagnóstico** — captura de marca, paleta e tipografia a partir de URL, arquivo de referência ou entrevista dirigida.
- **Estruturação** — declaração explícita de módulo, grid, escala tipográfica e paleta restrita, com geração automática do pipeline HTML → PNG → PPTX.
- **Auditoria** — validação em duas camadas (método e robustez de layout) antes da entrega final.

## Pilares do método

1. **Módulo como unidade mínima** — toda medida é múltiplo do módulo base (12pt ≡ 16px em pipelines html2pptx).
2. **Grid modular fixo** — uma vez definido, nunca violado.
3. **Geometria elementar** — apenas triângulo, quadrado e círculo como formas de suporte.
4. **Tipografia derivada do módulo** — escala em razão fixa, no máximo 2 tamanhos por slide.
5. **Paleta restrita** — no máximo 3 cores com proporção definida (60/30/10).

## Como usar

A skill é auto-contida em `scripts/`:

```bash
npm install playwright pptxgenjs colorthief node-html-parser
npx playwright install chromium

node scripts/extract-brand.js https://marca-referencia.com
cp scripts/*.template.js ./
# editar gen-slides.js com paleta + conteúdo
node gen-slides.js && node screenshot.js    # loop curto
node build.js                                # PPTX final
```

Detalhes em [`scripts/README.md`](scripts/README.md) e método completo em [`SKILL.md`](SKILL.md).

## Instalação como skill do Claude Code

Clonar dentro de `~/.claude/skills/`:

```bash
git clone https://github.com/vsaraceni/wollner-design.git ~/.claude/skills/wollner-design
```

A skill passa a ser disparada quando o usuário pede "design no estilo Wollner", "grid modular", "layout sistemático" ou mencionar Bauhaus/Swiss/Ulm.

## Licença e espírito

Aberto ao público. Use, adapte, republique. O método é do Wollner; a implementação é uma tentativa de mantê-lo vivo.
