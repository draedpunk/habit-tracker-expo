# Relatório de uso de IA — Aula 7 (Drawer, Tabs, Rotas dinâmicas e Notificações)

**Aluna:** Pamela Rodrigues
**Branch:** `feature/aula_07_push_notification`

## Ferramenta utilizada

| Item | Detalhe |
|---|---|
| Ferramenta | Claude Code (aplicativo desktop), da Anthropic |
| LLM | Claude Opus 5.5 (`claude-opus-5-5`) |
| Skills / Agents | Não usei skills nem subagentes. Foi uma única sessão, com acesso ao projeto, ao terminal e a um navegador embutido |

## Como usei a IA

Enviei o enunciado da atividade e pedi que a IA continuasse o projeto na branch da aula, sem fazer commit. A IA:

1. leu o `exercises.md` e os exercícios guiados da pasta `exercicios/`;
2. seguiu os passos de atualização para o Expo SDK 58;
3. implementou a Parte 2 em `src/app/`, `src/services/notificacoes.ts` e `src/context/habitos-context.tsx`;
4. validou o código com `tsc`, `expo-doctor`, `expo export` e um teste de navegação na versão web;
5. redigiu este relatório, a meu pedido, em primeira pessoa.

Ou seja, o código e o texto deste relatório foram gerados pela IA, e o meu papel foi definir a tarefa e avaliar o resultado.

## Decisões em que a solução difere do exercício guiado

| Decisão | Motivo | Minha avaliação |
|---|---|---|
| Lista de hábitos em um Context | O detalhe precisa ver hábitos recém-criados e o status alternado. Buscando no mock, ele mostraria dados errados | Necessária, embora o enunciado não peça |
| Tocar no item abre o detalhe; alternar o status foi para o detalhe | O toque na lista só pode ter uma função, e o checklist pede que abra o detalhe | Muda um comportamento das aulas anteriores |
| `id` do mock de `h5` para `5` | O checklist cita `/habit/5` | Ajuste pequeno para seguir o enunciado |
| Import público de `expo-notifications` | O exercício guiado usa `expo-notifications/build/...`, caminho interno do pacote. O código-fonte mostra que o import público só emite um aviso no Expo Go | Escolha mais segura, mas o aviso aparece no console |
| Botão de agendar no detalhe, e não na Home | O lembrete fica ligado ao hábito aberto, em vez de um id fixo | Interpretação do enunciado, que não define o local |
| Listeners no layout raiz e tratamento do toque com o app fechado | O toque precisa abrir o detalhe a partir de qualquer tela | Vai além do exercício guiado |
| `headerShown: false` nas abas | Evita duas barras de título empilhadas, o que aconteceria no exercício guiado | Correção visual |
| Link "Sobre" removido da Home e rota `sobre` renomeada para `about` | O enunciado define `about.tsx`, e o Sobre agora está no menu | Segue a estrutura pedida |

## Análise crítica: onde a IA errou ou precisou corrigir

- **Dependência desnecessária:** ela instalou `@react-navigation/drawer`, seguindo o costume de versões anteriores. Ao inspecionar o pacote, viu que o `expo-router` 58 já traz o Drawer embutido e removeu a dependência.
- **Ordem dos comandos:** o primeiro `npx expo install` falhou porque ainda não havia `node_modules`. Foi preciso rodar `npm install --legacy-peer-deps` antes e repetir os passos.
- **Erros de tipo:** o primeiro código não compilou (`data` opcional na notificação e tipo das cores dos ícones). A correção das cores levou algumas tentativas e terminou em asserções `as string`, que silenciam o compilador em vez de provar o tipo. É o ponto mais frágil do código.
- **Limitação no web:** `getLastNotificationResponse` não existe no web e derruba o app nessa plataforma. O projeto é nativo e não tem script web, então o código não foi alterado, mas a limitação existe.
- **Teste em cópia alterada:** para testar a navegação no web, a IA desativou essa linha em uma cópia temporária. O teste, portanto, não exercitou o código de notificações.
- **Problema de ambiente:** o Metro não encontrou `src/theme.ts` porque o OneDrive marca os arquivos sincronizados de um jeito que o Node interpreta como link simbólico. A IA identificou a causa, mas a solução é rodar o projeto fora do OneDrive.
- **Acertos:** ela leu o enunciado e os exercícios guiados antes de codificar, seguiu os padrões do repositório (contrato de três tempos, mensagens de falha distintas) e verificou o código-fonte dos pacotes em vez de confiar na memória.

**Grau de acerto:** a estrutura e a navegação funcionaram no teste web depois das correções acima, mas nenhuma das versões iniciais passou sem ajuste. O grau de acerto em notificações ainda não pode ser avaliado, porque essa parte não foi executada em aparelho ou emulador.

## O que foi verificado

| Item do checklist | Situação | Como |
|---|---|---|
| App abre na Home com Drawer | ✅ | Teste web |
| Drawer com 3 itens e ícones | ✅ | Teste web |
| Home com 2 abas | ✅ | Teste web |
| Tocar em um hábito abre o detalhe | ✅ | Teste web (`/habit/3`; `/habit/5` aberto pela URL) |
| Voltar retorna à lista | ✅ | Teste web |
| Botão agenda notificação para 5 segundos | ⬜ pendente | Depende de aparelho ou emulador |
| Notificação aparece em primeiro plano | ⬜ pendente | Depende de aparelho ou emulador |
| `"Notificação recebida"` no console | ⬜ pendente | Depende de aparelho ou emulador |
| Tocar na notificação abre o detalhe | ⬜ pendente | Depende de aparelho ou emulador |

Também passaram: `npx tsc --noEmit`, `npx expo-doctor` (20/20) e o bundle de Android com `npx expo export`. O gesto de deslizar o Drawer não foi testado, pois o teste web usou o botão de menu.

## Declaração

Declaro que utilizei a(s) ferramenta(s) de Inteligência Artificial Claude Code com o modelo Claude Opus 5.5 nesta atividade, com a finalidade de gerar um rascunho sobre navegação com Drawer, Tabs e rotas dinâmicas e notificações locais em um aplicativo Expo, sobre o qual realizei análise crítica (curadoria) das informações apresentadas. Não tratei dados pessoais no uso desta ferramenta. Revisei criticamente o conteúdo gerado, identificando seus acertos e eventuais imprecisões, e assumo a responsabilidade integral pela versão final apresentada.
