# Tech Challenge — Fase 03 | Front-end do Blog

Interface gráfica em **React** para a plataforma de blogging de professores da rede pública, consumindo a API REST construída na Fase 2.

**Aluno:** Leandro Clemente — Pós-Graduação em Full Stack Development (FIAP / POSTECH)
**Link GitHub:**https://github.com/Leandro-Clem/Tech-Challenge-Fase3-Final
**Apresentação em vídeo:** https://youtu.be/gkQu1XRImSE

---

## Sumário

- [Visão geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Setup inicial](#setup-inicial)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Scripts disponíveis](#scripts-disponíveis)
- [Arquitetura da aplicação](#arquitetura-da-aplicação)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Rotas](#rotas)
- [Integração com a API](#integração-com-a-api)
- [Autenticação e autorização](#autenticação-e-autorização)
- [Guia de uso](#guia-de-uso)
- [Design e acessibilidade](#design-e-acessibilidade)
- [Testes](#testes)
- [Docker](#docker)
- [CI/CD](#cicd)

---

## Visão geral

A aplicação cobre os seis requisitos funcionais do desafio:

| # | Requisito | Onde está |
| :-- | :-- | :-- |
| 1 | Lista de posts com título, autor, descrição e busca | `/` — `src/pages/Home.jsx` |
| 2 | Leitura do post completo | `/posts/:id` — `src/pages/PostDetail.jsx` |
| 3 | Criação de postagens (título, conteúdo, autor) | `/posts/novo` — `src/pages/NewPost.jsx` |
| 4 | Edição com dados carregados do post | `/posts/:id/editar` — `src/pages/EditPost.jsx` |
| 5 | Página administrativa com editar/excluir | `/admin` — `src/pages/Admin.jsx` |
| 6 | Login e proteção das rotas restritas | `/login` + `src/components/ProtectedRoute.jsx` |
| 2b | Comentários nos posts (item opcional) | `src/components/Comments.jsx` |

Um professor só altera as próprias publicações — a regra é aplicada na API e refletida na interface.

Além do escopo pedido, a interface traz **modo claro e escuro** com persistência da escolha e um conjunto próprio de **ícones em SVG**.

> Os comentários dependem de três rotas novas no back-end. Os arquivos já alterados estão em [`backend-fase2-comentarios/`](./backend-fase2-comentarios/INSTRUCOES.md) — basta copiá-los por cima dos originais da Fase 2.

---

## Tecnologias

| Camada | Tecnologia |
| :-- | :-- |
| Biblioteca de UI | React 18 (componentes funcionais + hooks) |
| Build e dev server | Vite 5 |
| Roteamento | React Router 6 |
| Estilização | Styled Components 6 (com `ThemeProvider`) |
| Estado global | Context API (`AuthContext`, `ThemeContext`) |
| Ícones | SVG próprios, sem dependência externa |
| Acesso HTTP | Fetch API encapsulada em `src/services/api.js` |
| Testes | Vitest + Testing Library |
| Containerização | Docker multi-stage (Node → Nginx) |
| CI/CD | GitHub Actions |

Não há dependência de Redux nem de bibliotecas de componentes: o estado compartilhado é pequeno (usuário logado) e todo o visual é próprio.

---

## Setup inicial

Pré-requisitos: **Node.js 18+** e o back-end da Fase 2 rodando.

```bash
# 1. Suba o back-end (em outro terminal, na pasta do projeto da Fase 2)
npm install
npm start            # API em http://localhost:3000

# 2. Suba o front-end
npm install
cp .env.example .env # opcional: os padrões já funcionam
npm run dev          # aplicação em http://localhost:5173
```

### Sobre CORS

O back-end da Fase 2 não habilita CORS, então o navegador bloquearia chamadas diretas de `localhost:5173` para `localhost:3000`. A solução adotada aqui **não exige alterar o back-end**: o Vite atua como proxy reverso em desenvolvimento e o Nginx faz o mesmo papel em produção. Tudo que o front pede vai para `/api/...`, na mesma origem, e é encaminhado para a API.

Se preferir apontar direto para a API, instale o pacote `cors` no back-end (`app.use(cors())`) e defina `VITE_API_URL=http://localhost:3000` no `.env`.

---

## Variáveis de ambiente

| Variável | Padrão | Para que serve |
| :-- | :-- | :-- |
| `VITE_API_URL` | `/api` | Caminho/URL base da API |
| `VITE_PROXY_TARGET` | `http://localhost:3000` | Destino do proxy do Vite em desenvolvimento |

---

## Comentários

Qualquer pessoa lê os comentários de um post; para escrever é preciso estar autenticado, como professor ou como aluno. O autor é sempre o usuário do token — o front não envia nome nenhum, justamente para que ninguém comente assinando com o nome de outro. Comentários de professores recebem uma marcação ao lado do nome, e só professores podem remover comentários.

As rotas consumidas (`GET`, `POST /posts/:id/comments` e `DELETE /comments/:id`) são um acréscimo desta fase ao back-end; veja `backend-fase2-comentarios/INSTRUCOES.md`.

---

## Modo claro e escuro

Há três paletas prontas em `src/styles/theme.js`. Trocar a do site inteiro é mudar uma constante:

```js
export const PALETA = 'grafite'; // 'grafite' | 'carvao' | 'classico'
```

| Paleta | Modo claro | Modo escuro |
| :-- | :-- | :-- |
| `grafite` (padrão) | papel neutro, azul de caneta esferográfica | cinza quase preto (#121213) |
| `carvao` | branco quente, âmbar queimado | preto neutro (#0F0F10) |
| `classico` | a primeira versão: azul-marinho e tijolo | cinza-azulado escuro |

Nenhum componente sabe qual paleta está ativa: todas expõem os mesmos nomes de token. Dois deles são deliberadamente separados — `accent` é a cor de identidade (régua da margem, item ativo do menu, foco do teclado) e `danger` serve só a erro e exclusão, para que uma paleta de identidade azul não deixe as mensagens de erro azuis.

Na primeira visita a aplicação segue a preferência do sistema operacional (`prefers-color-scheme`) e continua acompanhando as mudanças dele. A partir da primeira troca manual no botão do cabeçalho, a escolha do usuário passa a valer e fica salva no `localStorage`.

---

## Scripts disponíveis

| Comando | Efeito |
| :-- | :-- |
| `npm run dev` | Servidor de desenvolvimento com HMR |
| `npm run build` | Bundle de produção em `dist/` |
| `npm run preview` | Serve o bundle já construído (com o mesmo proxy) |
| `npm test` | Roda a suíte de testes uma vez |
| `npm run test:watch` | Testes em modo observação |

---

## Arquitetura da aplicação

A aplicação é dividida em quatro camadas, de fora para dentro:

```
┌──────────────────────────────────────────────────────────┐
│  ROTEAMENTO — App.jsx (React Router)                     │
│  Rotas públicas e rotas envolvidas por <ProtectedRoute>  │
└───────────────────────┬──────────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────────┐
│  PÁGINAS — src/pages                                     │
│  Buscam dados, guardam estado local (useState/useEffect) │
│  e tratam erros vindos da API                            │
└───────────────────────┬──────────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────────┐
│  COMPONENTES — src/components                            │
│  Layout, PostForm, PostListItem, ui.js (design system)   │
│  Recebem tudo por props, sem conhecer a API              │
└───────────────────────┬──────────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────────┐
│  SERVIÇOS — src/services/api.js                          │
│  Único ponto que fala HTTP: monta headers, injeta o      │
│  Bearer token, normaliza erros em ApiError(status)       │
└───────────────────────┬──────────────────────────────────┘
                        │ HTTP + JSON
┌───────────────────────▼──────────────────────────────────┐
│  API REST — Fase 2 (Express + Sequelize + SQLite)        │
└──────────────────────────────────────────────────────────┘

Transversal: AuthContext (Context API) guarda o usuário logado e o token,
consumido por Layout, ProtectedRoute e pelas páginas restritas.
```

**Decisões que sustentam essa divisão**

- *Nenhum componente chama `fetch` diretamente.* Trocar a URL da API, o formato do token ou o tratamento de erro mexe em um arquivo só.
- *Erros carregam o status HTTP.* `ApiError` permite que a tela reaja de forma diferente a 404 (“publicação não encontrada”) e a 401/403 (derruba a sessão e manda para o login).
- *Requisições são canceláveis.* Todo `useEffect` que busca dados cria um `AbortController`, evitando atualizar estado de componente desmontado e respostas fora de ordem na busca.
- *O design system mora em `ui.js`.* Botões, campos e avisos são styled components reutilizados por todas as páginas, o que mantém a interface coerente sem CSS global espalhado.

---

## Estrutura de pastas

```
src/
├── components/
│   ├── Comments.jsx        Lista, envio e moderação de comentários
│   ├── icons.jsx           Ícones em SVG (traço único, currentColor)
│   ├── Layout.jsx          Cabeçalho, navegação, rodapé e <Outlet>
│   ├── PostForm.jsx        Formulário compartilhado (criar e editar)
│   ├── PostListItem.jsx    Item da lista de publicações
│   ├── ProtectedRoute.jsx  Guarda de rota por autenticação e papel
│   ├── ThemeToggle.jsx     Alternador claro/escuro
│   └── ui.js               Design system em styled components
├── context/
│   ├── AuthContext.jsx     Sessão, login, logout e expiração do token
│   └── ThemeContext.jsx    Modo claro/escuro e ThemeProvider
├── hooks/
│   └── useDebouncedValue.js
├── pages/
│   ├── Home.jsx  PostDetail.jsx  NewPost.jsx
│   ├── EditPost.jsx  Admin.jsx  Login.jsx  NotFound.jsx
├── services/
│   └── api.js              Cliente HTTP da API da Fase 2
├── styles/
│   ├── GlobalStyle.js      Reset, tipografia base, foco visível
│   └── theme.js            Tokens dos dois modos, fonte, espaço, breakpoints
├── utils/
│   └── format.js           Data, resumo e tempo de leitura
├── App.jsx                 Mapa de rotas
└── main.jsx                Providers e bootstrap
```

---

## Rotas

| Rota | Acesso | Página |
| :-- | :-- | :-- |
| `/` | Pública | Lista de publicações com busca |
| `/posts/:id` | Pública | Leitura do post |
| `/login` | Pública | Autenticação |
| `/posts/novo` | Professor | Criação |
| `/posts/:id/editar` | Professor | Edição |
| `/admin` | Professor | Administração |
| `*` | Pública | Página não encontrada |

Quem não está autenticado e tenta abrir uma rota restrita é enviado para `/login`, e o endereço original volta em `location.state.from` — depois de entrar, o usuário cai exatamente onde queria. Quem está autenticado como aluno vê um aviso explicando que a área é de docentes.

---

## Integração com a API

| Ação na interface | Requisição |
| :-- | :-- |
| Abrir a página principal | `GET /posts` |
| Digitar na busca | `GET /posts/search?q=termo` (com debounce de 400 ms) |
| Abrir uma publicação | `GET /posts/:id` |
| Publicar | `POST /posts` + `Authorization: Bearer <token>` |
| Salvar edição | `PUT /posts/:id` + token |
| Excluir | `DELETE /posts/:id` + token |
| Entrar | `POST /login` com `{ username, role }` |
| Abrir os comentários | `GET /posts/:id/comments` |
| Comentar | `POST /posts/:id/comments` + token (qualquer perfil) |
| Remover comentário | `DELETE /comments/:id` + token de professor |

**Autoria e permissão de escrita.** O autor sai do token na criação e é imutável dali em diante — o campo aparece preenchido e somente leitura nos dois formulários. Isso não é cosmético: é a autoria que define quem pode alterar a publicação. Um professor só edita, exclui e modera comentários das próprias aulas; nas dos colegas, a API responde `403` e a interface nem oferece os botões.

**O que é público:** ler a lista, ler um post e ler os comentários. Nada disso exige conta, por decisão de produto — o aluno precisa chegar à aula sem cadastro. Só escrever exige login.

---

## Autenticação e autorização

1. O usuário informa nome e papel; a API devolve um JWT válido por 1 hora.
2. O token vai para o `localStorage` e o payload é lido no cliente para recuperar `username`, `role` e `exp`.
3. O `AuthContext` agenda o logout automático no vencimento do token e restaura a sessão ao recarregar a página.
4. Toda requisição protegida recebe o header `Authorization`. Se a API responder 401 ou 403, a sessão é encerrada e o usuário volta ao login.

A verificação de papel no front é conveniência de navegação; a autorização real continua sendo feita pela API. São duas checagens distintas lá: o `authMiddleware` valida o token e o papel, e as rotas de escrita comparam `post.author` com `req.user.username` antes de alterar qualquer coisa.

---

## Guia de uso

**Como estudante (sem login):** abra a página inicial, use o campo de busca para filtrar por palavras do título ou do conteúdo e clique em uma publicação para ler o texto completo.

**Como professor:**

1. Clique em *Entrar*, informe um nome de usuário e escolha o perfil **Professor**.
2. Use *Escrever* para criar uma publicação. Separe os parágrafos com uma linha em branco — eles são renderizados individualmente na leitura.
3. Em *Administração* estão as postagens, com um filtro entre "Minhas" (o padrão) e "Todas da plataforma" — o requisito 5 pede a lista completa, e o filtro evita que ela pareça uma lista pessoal. Editar e excluir só aparecem nas próprias publicações; nas dos colegas a linha mostra apenas quem publicou. A exclusão pede confirmação na própria linha antes de chamar a API.

---

## Design e acessibilidade

A estrutura vem do caderno pautado: a régua vertical marcando a coluna de conteúdo e pautas horizontais separando as publicações. A cor dessa estrutura é o token `accent`, que muda com a paleta escolhida. Títulos e corpo dos posts usam a serifada **Newsreader**; a interface usa **IBM Plex Sans**.

Os ícones são desenhados em SVG com a mesma espessura de traço da régua da interface e usam `currentColor`, então acompanham sozinhos o modo e a cor do botão em que estão. Todos são `aria-hidden`: nenhum deles carrega informação que não esteja também no texto ao lado.

- Layout responsivo em uma coluna, com a tabela administrativa virando blocos empilhados abaixo de 768 px.
- Todos os campos têm `<label>` associado; erros usam `aria-invalid` e `aria-describedby`.
- Carregamento e resultados de busca são anunciados por regiões `aria-live`.
- Link “Ir para o conteúdo”, foco visível em todos os elementos interativos e `prefers-reduced-motion` respeitado.
- Medida de leitura limitada a ~68 caracteres por linha na página do post.
- Contraste verificado nos dois modos; o alternador de tema expõe seu estado por `aria-pressed`.

---

## Testes

```bash
npm test
```

25 testes cobrindo cinco frentes:

- `src/utils/format.test.js` — formatação de data, resumo e tempo de leitura.
- `src/services/api.test.js` — corpo do login, envio do Bearer token, bloqueio sem sessão, propagação de erro da API e escape do termo de busca.
- `src/pages/Home.test.jsx` — renderização da lista, troca para o endpoint de busca ao digitar, estado vazio e mensagem de API fora do ar.
- `src/components/Comments.test.jsx` — listagem, convite ao login para visitantes, envio autenticado, recusa de texto curto demais e moderação restrita ao professor que publicou a aula.
- `src/pages/EditPost.test.jsx` — carregamento dos dados atuais, bloqueio de professor que não é o autor e autoria em modo leitura.

---

## Docker

O build é multi-stage: o Node compila o bundle e o Nginx serve os arquivos estáticos, já com `try_files` para as rotas do React Router e proxy de `/api` para o back-end. O destino desse proxy é a variável de ambiente `API_UPSTREAM`, resolvida na subida do container.

### Opção 1 — front-end e API juntos (recomendado)

O `docker-compose.yml` sobe os dois serviços. Ele precisa saber onde está a pasta do back-end da Fase 2. Crie um arquivo `.env` **nesta pasta** com o caminho:

```bash
# Linux/macOS
echo "BACKEND_PATH=../Tech-Challenge-Fase2-Final" > .env
```

```powershell
# Windows PowerShell
"BACKEND_PATH=../Tech-Challenge-Fase2-Final" | Out-File -Encoding utf8 .env
```

O caminho pode ser relativo a esta pasta ou absoluto. No Windows, use barras normais mesmo em caminho absoluto:

```
BACKEND_PATH=C:/Users/seu-usuario/Downloads/Tech-Challenge-Fase2-Final
```

Depois:

```bash
docker compose up --build
```

A aplicação fica em `http://localhost:8080` e a API em `http://localhost:3000`.

### Opção 2 — só o container do front-end

Útil quando o back-end já está rodando direto na máquina com `npm start`:

```bash
docker build -t blog-frontend .
docker run -p 8080:80 -e API_UPSTREAM=http://host.docker.internal:3000 blog-frontend
```

O `host.docker.internal` é como o container enxerga a máquina onde o Docker está rodando. Funciona no Docker Desktop (Windows e macOS). No Linux, acrescente `--add-host=host.docker.internal:host-gateway` ao comando.

### Se der errado

| Sintoma | Causa provável |
| :-- | :-- |
| `path ... not found` ao subir o compose | `BACKEND_PATH` aponta para uma pasta que não existe — confira o caminho no `.env` |
| `npm ci` falha no build da API | falta o `package-lock.json` na pasta do back-end |
| Site abre, mas a lista fica vazia com aviso de servidor | o container do front subiu sem a API acessível: confira `API_UPSTREAM` |
| `port is already allocated` | a porta 3000 ou 8080 já está ocupada — pare o `npm start` ou troque a porta no compose |
| `docker: command not found` | o Docker Desktop não está instalado ou não foi iniciado |

Para parar tudo e limpar: `docker compose down`.

---

## CI/CD

`.github/workflows/ci.yml` roda a cada push:

1. Instala as dependências com `npm ci`.
2. Executa a suíte de testes.
3. Gera o build de produção e publica `dist/` como artefato.
4. Na branch `main`, constrói a imagem Docker.
