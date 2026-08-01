# Emoção 360

**Atlas emocional interativo para psicoeducação, registro e reflexão sobre experiências emocionais.**

O **Emoção 360** é uma aplicação web estática baseada no modelo de emoções de Robert Plutchik. A ferramenta foi desenvolvida para ampliar o vocabulário emocional, apoiar a organização de situações vividas e facilitar a continuidade do trabalho entre sessões de psicoterapia.

> **Importante:** o Emoção 360 é um recurso psicoeducativo. Não é teste psicológico, instrumento diagnóstico, prontuário clínico nem medida validada de gravidade emocional.

## Acesso

Aplicação publicada em:

https://ricmurtapsicologia.github.io/emocao360/

## O que a ferramenta permite

- explorar a Roda das Emoções de Plutchik em formato interativo;
- selecionar **uma ou várias emoções simultaneamente** para representar experiências emocionais complexas ou ambivalentes;
- consultar descrições funcionais, possíveis funções, estratégias de regulação e perguntas para reflexão;
- registrar contexto, possíveis ativadores, comportamento e resposta desejada;
- editar livremente o nome das emoções sugeridas pela roda;
- manter registros apenas durante a sessão atual ou, mediante escolha explícita, salvá-los no armazenamento local do navegador;
- visualizar frequência das emoções registradas sem transformar frequência em diagnóstico;
- excluir registros individualmente ou apagar todo o histórico persistente;
- exportar os dados persistentes em JSON;
- preparar um resumo para compartilhamento deliberado pelo usuário;
- gerar uma versão editorial em A4 para impressão ou salvamento em PDF;
- alternar entre tema claro e escuro;
- utilizar a aplicação em desktop e dispositivos móveis.

## Seleção de múltiplas emoções

Experiências emocionais reais podem envolver mais de uma emoção ao mesmo tempo. Por isso, o Emoção 360 permite marcar diferentes setores da roda no mesmo registro.

Exemplo conceitual:

**medo + tristeza + raiva** podem coexistir em uma mesma situação sem que uma emoção invalide as demais.

Cada seleção funciona como uma hipótese de linguagem para ajudar o usuário a nomear a experiência. A combinação não constitui classificação diagnóstica.

No gráfico de frequência:

- cada emoção primária selecionada conta 1 ponto;
- cada diade conta 0,5 ponto para cada uma das duas emoções que a compõem;
- quando várias emoções são selecionadas em um registro, cada seleção é contabilizada separadamente.

Essas regras são convenções internas de visualização do Emoção 360 e não correspondem a uma métrica clínica do modelo de Plutchik.

## Fluxo de uso

1. **Perceber** — observar o que aparece no corpo, nos pensamentos e no contexto.
2. **Nomear** — selecionar uma ou mais emoções na roda e ajustar os nomes quando necessário.
3. **Contextualizar** — registrar o episódio, possíveis ativadores e respostas comportamentais.
4. **Escolher** — refletir sobre uma resposta mais alinhada a valores, objetivos e contexto.
5. **Revisar** — observar padrões ao longo dos registros e, quando pertinente, levar o material para psicoterapia.

## Privacidade por desenho

A aplicação foi estruturada para reduzir coleta e circulação desnecessárias de informações pessoais.

- Não utiliza analytics próprio.
- Não depende de bibliotecas JavaScript de terceiros em tempo de execução.
- Nome ou iniciais não são armazenados no histórico.
- Registros são temporários por padrão.
- Persistência no navegador depende de ação explícita do usuário.
- Os registros persistentes permanecem no `localStorage` do navegador até serem excluídos.
- É possível excluir registros individualmente ou limpar todo o histórico persistente.
- O compartilhamento de resumo ocorre somente após ação voluntária do usuário.
- O link da ferramenta pode ser compartilhado sem compartilhar registros.

A política de privacidade está disponível em `privacidade.html`.

## PDF / impressão

A saída de impressão foi desenhada especificamente para A4 e não é uma simples captura da interface.

O documento inclui:

- identificação opcional;
- data de referência;
- emoção ou conjunto de emoções;
- intensidade percebida;
- contexto;
- possíveis ativadores;
- comportamento observado;
- resposta desejada;
- leitura psicoeducativa;
- identificação da finalidade do documento;
- aviso de privacidade antes da geração.

O navegador é responsável pelo salvamento final em PDF por meio do recurso nativo de impressão.

## Arquitetura técnica

O projeto utiliza uma arquitetura estática e deliberadamente enxuta:

- HTML5;
- CSS responsivo;
- JavaScript nativo;
- SVG gerado no navegador para a roda emocional;
- `localStorage` apenas para persistência opcional;
- Web Share API e Clipboard API quando disponíveis;
- impressão nativa do navegador para PDF;
- GitHub Pages para publicação.

Não há backend, banco de dados ou API própria de coleta de registros.

## Estrutura principal do repositório

```text
emocao360/
├── index.html
├── privacidade.html
├── robots.txt
├── sitemap.xml
├── README.md
└── assets/
    ├── favicon.svg
    └── og-card.svg
```

## Acessibilidade

A aplicação inclui, entre outros recursos:

- navegação por teclado;
- foco visível;
- elementos SVG selecionáveis por `Tab`, `Enter` e `Espaço`;
- alternativa de seleção por lista em dispositivos móveis;
- estrutura semântica de seções e títulos;
- suporte a `prefers-reduced-motion`;
- contraste e temas claro/escuro;
- mensagens de feedback com região `aria-live`.

## Uso clínico e limites

O Emoção 360 pode ser usado como apoio psicoeducativo e como material para discussão em psicoterapia. Ele não substitui avaliação profissional individualizada, não produz diagnóstico e não deve ser interpretado como prontuário psicológico.

A Roda de Plutchik é apresentada como um modelo qualitativo para organização da experiência emocional. Existem outros modelos científicos de emoção, e experiências humanas podem envolver ambivalência, sobreposição e significados que não cabem integralmente em uma única taxonomia.

## Autoria

**Richelmy Murta**  
Psicólogo clínico

Projeto: **Emoção 360 — Atlas Emocional Interativo**

## Estado do projeto

Versão web em evolução contínua, com foco em:

- clareza clínica;
- ergonomia cognitiva;
- acessibilidade;
- privacidade;
- segurança de dados;
- uso entre sessões;
- experiência mobile;
- qualidade editorial da versão em PDF.
