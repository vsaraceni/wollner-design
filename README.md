# Wollner Design

**Design que envelhece bem.** Decks e documentos com rigor sistemático — tipografia modular, paleta restrita, grid fixo. Saem certos da primeira vez porque obedecem regras, não apenas gosto.

## Por que Wollner?

Porque design que dura **não é expressão pessoal**, é engenharia visual.

Wollner foi discípulo direto de Max Bill na HfG Ulm (1955–1958), a escola funcionalista que herdou a filosofia Bauhaus. Voltou ao Brasil e criou identidades que **envelhecem** — Itaú, Hering, Eucatex, Klabin — não porque fossem "bonitas", mas porque eram **sistemáticas**. Cada elemento tinha razão de existir. Nada era decorativo.

A regra dele: **sistema antes de forma, módulo antes de estética, função antes de beleza.**

60+ anos depois, as marcas que ele projetou ainda funcionam. As que focavam em tendência ou expressão pessoal desapareceram.

## O que esta skill faz

Automatiza esse método para que você **não precise ser discípulo de Wollner** para produzir apresentações com essa qualidade. Vem com:

- **Diagnóstico** — extrai paleta, tipografia e tom a partir de URL, referência visual ou entrevista
- **Sistema declarativo** — define módulo, grid e escala tipográfica uma vez; o resto segue automático
- **Pipeline HTML → PNG → PPTX** — loop visual rápido (screenshots em 3 segundos) antes de gerar binário final
- **Auditoria em duas camadas** — valida método (grid, módulo, proporções) + robustez (sem quebras de texto, raios consisten

tes, espacamentos harmônicos)
- **Saída profissional** — PPTX 16:9 com até 100 slides, tipografia modular, paleta de 3 cores, geometria elementar

**Resultado:** apresentações que parecem ter sido pensadas, não decoradas.

## Quem criou isto

**Vinicius Saraceni**, ex-aluno de Wollner. Como aluno, absorveu que design é projeto, não arte. Criou esta skill para manter o método vivo — porque o que Wollner ensinou não é moda que expira, é princípio.

## Pilares (que você não vai violar)

1. **Módulo como unidade mínima** — toda medida é múltiplo do módulo base (12pt ≡ 16px em pipelines html2pptx).
2. **Grid modular fixo** — uma vez definido, nunca violado. Coerência > flexibilidade.
3. **Geometria elementar** — apenas triângulo, quadrado e círculo como formas de suporte. Sem clip art.
4. **Tipografia derivada do módulo** — escala em razão fixa, máximo 2 tamanhos por slide. Hierarquia clara, sem ruído.
5. **Paleta restrita** — máximo 3 cores com proporção definida (60% fundo / 30% primária / 10% acento). Menos é mais.

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
