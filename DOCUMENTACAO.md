# Documentação — Tech Challenge Fase 03

**Aluno:** Leandro Clemente
**Curso:** Pós-Graduação em Full Stack Development (FIAP / POSTECH)
**Entrega:** interface gráfica em React para a aplicação de blogging desenvolvida nas fases anteriores

> Este documento complementa o `README.md`, que traz o setup e a referência técnica. Aqui estão a visão de arquitetura, o uso da aplicação e o relato de desenvolvimento. **Ajuste o relato final com a sua própria experiência antes de entregar.**

---

## 1. Contexto

Na Fase 1 o problema foi resolvido em OutSystems. Na Fase 2 o back-end foi reescrito em Node.js com Express, Sequelize, SQLite e autenticação JWT, entregue com Docker e GitHub Actions. Esta fase fecha o ciclo: uma interface própria, responsiva e acessível, consumindo aquela mesma API REST sem precisar alterá-la.

O público é duplo e com necessidades opostas. O estudante quer chegar, encontrar a aula e ler — sem conta, sem fricção. O professor quer publicar e manter o que publicou, com segurança de que ninguém mais mexe. A interface foi organizada em torno dessa divisão: tudo que é leitura é público e direto; tudo que é escrita vive atrás do login.

---

## 2. Arquitetura do sistema

### 2.1 Visão geral

```
 Navegador
 ┌──────────────────────────────────────────────┐
 │  React 18 SPA (Vite)                         │
 │  ├─ React Router 6      rotas e proteção     │
 │  ├─ Context API         sessão e tema        │
 │  ├─ Styled Components   tema e responsivo    │
 │  └─ services/api.js     único cliente HTTP   │
 └──────────────────┬───────────────────────────┘
                    │  /api/*  (mesma origem)
 ┌──────────────────▼───────────────────────────┐
 │  Proxy reverso                               │
 │  dev: Vite  |  produção: Nginx               │
 └──────────────────┬───────────────────────────┘
                    │  HTTP + JSON + Bearer token
 ┌──────────────────▼───────────────────────────┐
 │  API REST — Fase 2 (+ rotas de comentários)  │
 │  Express 5 → authMiddleware → Sequelize      │
 └──────────────────┬───────────────────────────┘
                    │
 ┌──────────────────▼───────────────────────────┐
 │  SQLite (database.sqlite)                    │
 └──────────────────────────────────────────────┘
```

### 2.2 Camadas do front-end

| Camada | Responsabilidade | Não faz |
| :-- | :-- | :-- |
| Roteamento (`App.jsx`) | Mapear URLs e envolver rotas restritas | Buscar dados |
| Páginas (`pages/`) | Orquestrar carregamento, estado e erros | Falar HTTP diretamente |
| Componentes (`components/`) | Apresentar dados recebidos por props | Conhecer a API |
| Serviços (`services/api.js`) | Requisições, token e normalização de erros | Renderizar |
| Contexto (`context/`) | Sessão do usuário, disponível em qualquer nível | Persistir regras de negócio |

### 2.3 Decisões de projeto

**Context API em vez de Redux.** O estado verdadeiramente global é apenas o usuário autenticado. Os dados de posts são estado de tela, buscados sob demanda e descartados na saída. Redux resolveria um problema que a aplicação não tem e acrescentaria três camadas de indireção.

**Um único cliente HTTP.** Concentrar `fetch` em `services/api.js` mantém em um lugar só a URL base, o header `Authorization`, o parse da resposta e a conversão de falhas em `ApiError` com o status HTTP preservado. As telas decidem a reação: 404 vira “publicação não encontrada”, 401/403 derruba a sessão.

**Proxy em vez de CORS.** O back-end da Fase 2 não habilita CORS. Em vez de alterá-lo — o que descaracterizaria a entrega anterior —, o front sempre chama `/api`, e Vite (dev) ou Nginx (produção) encaminham para a API. O navegador enxerga sempre a mesma origem.

**Formulário único para criar e editar.** `PostForm` recebe valores iniciais, rótulo do botão e um sinalizador `authorLocked`. Validação, contagem de palavras e tratamento de erro ficam em um componente só, e as duas páginas cuidam apenas de carregar e salvar.

**Comentários com autoria vinda do token.** O front envia apenas o texto; o back-end preenche autor e papel a partir de `req.user`. Permitir que o cliente informasse o autor abriria espaço para alguém comentar assinando com o nome de outra pessoa. A mesma lógica separa quem pode o quê: comentar exige só estar autenticado, remover comentário exige ser professor.

**Dois modos de cor sem componentes cientes disso.** As paletas clara e escura expõem os mesmos nomes de token (`paper`, `ink`, `rule`, `margin`…). Nenhum componente testa o modo atual: todos leem o token e recebem o valor certo do `ThemeProvider`. Trocar de modo é trocar o objeto de tema, nada além disso.

**Ícones próprios em vez de biblioteca.** Um conjunto de dezesseis ícones em SVG, com a mesma espessura de traço da interface e `currentColor`, custa menos que uma dependência inteira e garante coerência com o resto do desenho.

**Autoria como chave de permissão.** O papel `professor` diz o que alguém pode fazer em tese; a autoria diz sobre o que. As rotas de escrita comparam `post.author` com `req.user.username` antes de alterar qualquer coisa, e o autor é imutável depois da criação — se ele pudesse ser trocado no `PUT`, a permissão poderia ser transferida ou tomada. A interface esconde os botões que não fariam efeito, mas quem decide é a API.

**Requisições canceláveis.** Cada efeito que busca dados cria um `AbortController` e aborta na limpeza. Na busca com debounce isso impede que uma resposta antiga chegue depois de uma nova e sobrescreva a lista.

### 2.4 Segurança

São três camadas de verificação: o token prova quem é, o papel define o tipo de ação, e a autoria define o alvo permitido. As duas primeiras estavam prontas desde a Fase 2; a terceira foi acrescentada nesta fase, porque sem ela qualquer docente autenticado editava a aula de qualquer colega.

O JWT vive no `localStorage` e é lido no cliente apenas para saber quem está logado e quando a sessão expira. A validação da assinatura e a checagem de papel continuam no middleware da API — a verificação no front é usabilidade, não controle de acesso. O logout automático é agendado para o instante do `exp` do token, de uma hora.

---

## 3. Uso da aplicação

### Estudante
Abre a página inicial e encontra a publicação mais recente em destaque, seguida das demais. O campo de busca filtra por palavras do título ou do conteúdo conforme se digita. Um clique abre o texto completo. Ao final da leitura estão os comentários: qualquer pessoa lê, e quem entrar com uma conta pode escrever.

Um botão no cabeçalho alterna entre o modo claro e o escuro; na primeira visita a escolha vem da preferência do sistema operacional.

### Professor
Entra informando usuário e perfil, e passa a ver dois itens novos na navegação: *Escrever* e *Minhas publicações*. A criação pede título e conteúdo — o autor é o próprio usuário da sessão. A área administrativa lista tudo com editar e excluir; a exclusão pede confirmação na própria linha e informa o resultado por uma região anunciada a leitores de tela. Nos comentários, o professor tem a opção de remover o que for inadequado.

---

## 4. Relato de experiência e desafios

*(Ajuste com a sua vivência — os pontos abaixo são os obstáculos técnicos reais deste código.)*

**CORS foi a primeira parede.** A API da Fase 2 funcionava perfeitamente no Postman e falhava no navegador. O diagnóstico levou à escolha entre alterar o back-end já entregue ou resolver no front. A segunda opção venceu por ser reversível e por replicar o que se faz em produção: um proxy reverso na frente da SPA.

**O campo autor expôs uma diferença entre os endpoints.** O desafio pede título, conteúdo e autor no formulário de criação, mas o `POST /posts` sobrescreve o autor com o usuário do token, enquanto o `PUT /posts/:id` aceita o que vier no corpo. Em vez de esconder a inconsistência, a interface mostra o campo somente leitura na criação, com uma frase explicando o motivo, e editável na edição.

**Busca com debounce e corrida de respostas.** Disparar uma requisição por tecla digitada sobrecarregava a API e produzia resultados fora de ordem. A combinação de `useDebouncedValue` com `AbortController` resolveu os dois problemas de uma vez.

**Responsividade da tabela administrativa.** Tabela é a estrutura semanticamente correta para uma lista de registros com ações, mas quebra no celular. A saída foi manter o `<table>` e, abaixo de 768 px, esconder o cabeçalho e transformar linhas e células em blocos — semântica preservada, leitura preservada.

**Estados que não são “carregou” nem “deu erro”.** Boa parte do trabalho foi cobrir o que fica no meio: lista vazia, busca sem resultado, token expirado durante a edição, API fora do ar. Cada um desses casos tem uma mensagem que diz o que aconteceu e o que fazer em seguida.

**Comentários exigiram tocar no back-end da Fase 2.** O item era opcional, mas a API não tinha onde guardar comentário nenhum. A alteração foi mantida no menor tamanho possível: um modelo `Comment`, três rotas e nenhuma dependência nova. O `authMiddleware` não precisou de uma linha sequer — ele já tratava o caso de "só validar o token, sem exigir papel". Um detalhe do SQLite apareceu no caminho: o `onDelete: 'CASCADE'` só age com `PRAGMA foreign_keys` ligado, então excluir uma postagem deixava comentários órfãos até a limpeza ser feita explicitamente na rota.

**Um professor editava a aula de outro.** O `authorize('professor')` da Fase 2 respondia "esta pessoa é docente?", que é uma pergunta diferente de "esta pessoa publicou isto?". O bug só aparece com dois professores cadastrados, o que não acontece num teste rápido com um usuário só. A correção foi pequena — uma função que carrega o post e compara o autor —, mas exigiu também tornar o autor imutável na edição, senão a permissão viraria algo transferível.

**O modo escuro obrigou a caçar cores fixas.** A primeira versão tinha alguns valores escritos direto no CSS dos componentes (o hover do botão, o fundo dos campos desabilitados). Cada um deles virou um token no tema. Foi um bom lembrete de que o tema só funciona se for a única fonte de cor.

**O que faria diferente com mais tempo:** paginação na listagem, resposta encadeada nos comentários, senha real no login e cobertura de testes nas telas de criação e edição.

---

## 5. Entregáveis

| Item | Onde |
| :-- | :-- |
| Código-fonte | Repositório GitHub |
| Dockerfile e docker-compose | Raiz do projeto |
| Pipeline de CI/CD | `.github/workflows/ci.yml` |
| Documentação técnica | `README.md` |
| Documento de arquitetura e relato | este arquivo |
| Alterações do back-end para comentários | `backend-fase2-comentarios/` |
| Apresentação gravada | link no repositório |
