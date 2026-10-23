# Relatório de uso de IA — Aula 6 (Navegação & Fotos)

**Aluna:** Pamela Rodrigues
**Disciplina:** Desenvolvimento Mobile (2026.2.DM) — CESAR School
**Projeto:** `habit-tracker-expo` — branch `feature/aula_06_navigation`
**Atividade:** Parte 2 — Atividades aplicadas (Atividades 1 e 2) + troca do Stack Navigation por Tabs

---

## 1. Ferramenta utilizada

| Item | Detalhe |
|---|---|
| Ferramenta | **Claude Code** (aba *Code* do aplicativo Claude Desktop, Windows) |
| Modelo (LLM) | **Claude Opus 5.5** (`claude-opus-5-5`), da Anthropic |
| Modo de uso | Agente de código: lê os arquivos do projeto, executa comandos no terminal (git, npm, `tsc`) e edita os arquivos |
| Skills / Agents | Nenhuma skill ou subagente específico foi acionado; o trabalho foi feito pelo agente principal |
| MCP / integrações | Nenhuma integração externa além da leitura do enunciado público (`exercises.md`) no GitHub |

## 2. Como a IA foi usada

Passei para o Claude Code o enunciado da atividade e pedi que ele implementasse o código. O fluxo foi:

1. **Preparação do repositório** — a IA buscou a branch `feature/aula_06_navigation` do repositório do professor, criou a branch local e rodou `npm install` (o `node_modules` era de uma branch antiga, do SDK anterior).
2. **Leitura do enunciado** — baixou o `exercises.md` da Aula 6 e leu a *Parte 2*, além das resoluções dos guiados em `exercicios/`, para seguir o mesmo padrão de código visto em sala.
3. **Resolução dos TODOs** da Parte 2:
   - `src/components/miniatura-foto.tsx` (A2.1) — `Image` do `expo-image` com `recyclingKey` e `maxWidth: '33%'`;
   - `src/app/galeria.tsx` (A2.2 a A2.6) — seleção múltipla com limite de 6, `FlatList` de 3 colunas, lista vazia e o comentário sobre seleção múltipla × recorte;
   - `src/app/registrar-foto.tsx` (A1.1 a A1.8 + contrato de três tempos) — galeria e câmera, negada × bloqueada via `canAskAgain`, cancelamento silencioso, prévia e Concluir desabilitado sem foto;
   - `src/app/sobre.tsx` (A1.9) — texto da limitação declarada;
   - `src/screens/tela-habitos.tsx` — um `router.push('/registrar-foto')` e dois `Link` (`/galeria` e `/sobre`);
   - `app.json` — textos do config plugin do `expo-image-picker` (TODO A2 e A3);
   - passo 6 da migração: remoção de `App.tsx` e `index.ts`.
4. **Troca do Stack por Tabs** em `src/app/_layout.tsx`, com ícones em emoji e `backBehavior="history"`.
5. **Verificação** com `npx tsc --noEmit` (checagem de tipos do TypeScript, sem erros) e `npx expo export --platform android` (o bundle Android foi gerado, o que confirma que as rotas e o `Tabs` resolvem).
6. **README.md** — seção nova descrevendo a entrega e as decisões da troca para Tabs.

## 3. Análise crítica do código gerado

### O que a IA acertou

- **Seguiu o padrão da disciplina.** Em vez de inventar uma solução própria, a IA leu as resoluções dos exercícios guiados (`exercicios/registrar-foto.tsx`, `galeria.tsx`, `foto-camera.tsx`) e reaproveitou a mesma estrutura: opções do picker declaradas uma vez e tipadas com `ImagePicker.ImagePickerOptions`, `renderItem` fora do componente, `canceled` checado antes de ler `assets[0]`.
- **Respeitou a regra de arquitetura do Expo Router**: a miniatura ficou em `src/components/` e nenhum componente auxiliar foi colocado em `src/app/` (onde todo arquivo vira rota).
- **Usou `Link` e `router.push` onde cada um faz sentido**, como o enunciado pede: `router.push` no botão (navegação como consequência de uma ação) e `Link` para destinos fixos.
- **Percebeu um problema que a troca para Tabs cria.** O comportamento padrão de "voltar" nas abas é ir sempre para a primeira aba, o que deixaria o botão **Concluir** sem sentido. A IA configurou `backBehavior="history"` para manter o comportamento parecido com o Stack, e ainda tratou o caso de abrir a tela direto por deep link (sem histórico) com `router.canGoBack()`.
- **Explicou as decisões em comentários curtos**, no mesmo estilo dos arquivos do professor, sem exagerar.

### Imprecisões e pontos que precisei revisar

- **Ícones das abas — a primeira versão não compilava.** A IA assumiu que o `@expo/vector-icons` já vinha com o Expo, o que não é verdade neste projeto (SDK 57). O `tsc` acusou o módulo ausente e também um erro de tipo (a cor do ícone é `ColorValue`, não `string`). A tentativa de instalar o pacote com `npx expo install` falhou por um conflito de *peer dependencies* que já existia na árvore do projeto. Em vez de forçar a instalação (`--legacy-peer-deps`) e mexer nas dependências do repositório, a solução final usa **emoji** como ícone, sem nenhuma biblioteca nova. Esse foi o maior erro da IA: ela escreveu o import antes de conferir o que estava instalado.
- **Mensagem da câmera bloqueada.** A primeira versão indicava um caminho de Configurações específico do Android (“Apps → … → Permissões → Câmera”). Como o enunciado pede para indicar o caminho nas Configurações e o app roda em Android e iOS, a mensagem foi ajustada para um texto que serve para os dois, citando o caminho do iPhone (“Ajustes → app → Câmera”). Ainda assim, o nome exato do menu varia por fabricante no Android — é uma aproximação.
- **`headerBackTitle` sumiu.** O enunciado do TODO A1 pede `headerBackTitle: 'Hábitos'`, mas essa opção é do Stack (texto ao lado da seta, no iOS). Com Tabs não existe seta de voltar no cabeçalho, então a opção deixou de fazer sentido. Foi uma consequência da troca de navegação pedida na atividade, e deixei isso registrado no README.
- **Abas ficam montadas.** Com Tabs, a tela de foto não é desmontada ao trocar de aba, então a foto escolhida continua lá quando o usuário volta. Isso é diferente do Stack (onde a tela some ao voltar). Não é um erro, mas é uma mudança de comportamento que a IA só apontou no README; não foi implementada nenhuma "limpeza" da foto ao concluir.
- **Os TODOs da Aula 5** (`5.x`) que ainda aparecem como comentário em outros arquivos não foram mexidos, porque estão fora do escopo da Parte 2 da Aula 6. O código deles já estava implementado; ficaram só os comentários.
- **A IA não roda o app no celular.** A verificação feita por ela foi de tipos (`tsc`) e de bundle (`expo export`). Câmera, permissões negada/bloqueada e a galeria dependem de aparelho físico e do Expo Go, então esses comportamentos precisaram ser testados por mim.

### Grau de acerto

Avalio o grau de acerto como **alto (cerca de 80–85%)**. O código final compila, seguiu os padrões vistos em sala e resolveu todos os TODOs da Parte 2. A lógica das telas veio certa na primeira versão; os ajustes foram de ambiente (a dependência de ícones que não existia no projeto) e de contexto (texto da mensagem bloqueada, efeitos da troca de Stack para Tabs). O erro dos ícones mostra que a IA precisa ser verificada — se eu não tivesse rodado o `tsc`, o app quebraria ao abrir. O ponto mais importante — o `backBehavior` das abas — foi algo que eu provavelmente não teria percebido sozinha antes de testar, e a IA tratou já na primeira versão. Por outro lado, a IA não substitui o teste em aparelho real: as partes que dependem de permissão e de hardware só podem ser validadas rodando o app.

## 4. Testes manuais (Expo Go)

- [ ] O app abre na lista de hábitos (aba **Hábitos**)
- [ ] As quatro abas aparecem com título e ícone
- [ ] **Foto do hábito** (`router.push`) abre a aba Foto; **Concluir** volta para a aba anterior
- [ ] Links **Galeria do hábito** e **Sobre o app** funcionam
- [ ] Cancelar a câmera/galeria não mostra erro
- [ ] Câmera negada e câmera bloqueada mostram mensagens diferentes
- [ ] Galeria aceita até 6 fotos e a última foto da grade não estica
- [ ] Botão voltar do Android volta para a aba anterior

## 5. Declaração

"Declaro que utilizei a(s) ferramenta(s) de Inteligência Artificial **Claude Code com o modelo Claude Opus 5.5 (Anthropic)** nesta atividade, com a finalidade de gerar um rascunho sobre **a implementação da navegação com Expo Router (troca do Stack por Tabs) e das telas de foto e galeria com expo-image-picker no app habit-tracker-expo**, sobre o qual realizei análise crítica (curadoria) das informações apresentadas. Não tratei dados pessoais no uso desta ferramenta. Revisei criticamente o conteúdo gerado, identificando seus acertos e eventuais imprecisões, e assumo a responsabilidade integral pela versão final apresentada."
