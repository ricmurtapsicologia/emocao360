# Onda 4 — Extração conservadora do JavaScript

Status: **somente ramificação de trabalho**. Nenhuma alteração desta onda deve ser incorporada à `main` antes da homologação E2E da Onda 5.

## Alteração proposta

- O JavaScript inline do `index.html` foi movido sem qualquer alteração de conteúdo para `assets/js/app.js`.
- A tag de script foi substituída na mesma posição por `<script src="./assets/js/app.js"></script>`.
- Não foram modificados campos, questões, resultados, cálculos, armazenamento, consentimento, integrações ou políticas de privacidade.
- Nenhuma dependência nova foi instalada. Nenhum workflow novo foi habilitado.
- Esta etapa apenas prepara uma futura modularização; ela não reestrutura as regras existentes.

## Evidência estática

- Repositório: `ricmurtapsicologia/emocao360`.
- Branch: `audit/onda4-extracao-js-20261015`.
- SHA do blob original de `index.html` na `main`: `6201ca4a56281e44ac1b3dfdc642e27bc2237e91`.
- Código JavaScript extraído: 24959 caracteres.
- Reconstituição do original: **igualdade integral confirmada na ferramenta de leitura do GitHub**.

## Como verificar, sem alterar a produção

```bash
node --test tests/onda4-paridade.test.mjs
```

O teste verifica: referência única ao novo arquivo, identidade do HTML original reconstruído e sintaxe do JavaScript com `node --check`.

## Gate da Onda 5

1. Executar o teste automatizado no checkout da branch e registrar saída.
2. Executar smoke e E2E em desktop/mobile, incluindo cálculos e fluxos existentes.
3. Confirmar que a política de dados e a interface permanecem inalteradas.
4. Somente depois da homologação avaliar merge; não há merge automático.

## Reversão

Até o merge, a produção não muda: basta abandonar/excluir esta branch. Após um eventual merge autorizado, reverter o commit correspondente e executar novamente a suíte de validação.
