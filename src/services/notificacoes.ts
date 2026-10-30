// Atividade aplicada · Aula 7 — a camada que fala com `expo-notifications`.
//
// Como em `localizacao.ts`, a tela NÃO chama a biblioteca diretamente: ela chama
// `agendarLembrete()` e recebe de volta um resultado que ou deu certo, ou tem o MOTIVO
// exato da falha.
//
// CONTRATO DE TRÊS TEMPOS DESTE ARQUIVO:
// 1. PEDIR   → `requestPermissionsAsync()`, só quando o usuário toca em "Agendar": é nesse
//              momento que ele entende para que serve a permissão.
// 2. LER     → `useObservadorNotificacoes()` assina a chegada e o toque da notificação.
// 3. PARAR   → o `useEffect` do observador chama `remove()` nas duas assinaturas.
//
// O import é o público (`expo-notifications`), e não `expo-notifications/build/...`: os
// caminhos de `build/` são internos e podem mudar a qualquer versão. No Expo Go ele só
// emite um aviso sobre push REMOTO; notificação local continua funcionando.

import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';

import type { Habito } from '../types/habito';

const CANAL_LEMBRETES = 'lembretes';
const SEGUNDOS_ATE_LEMBRETE = 5;

// Sem este handler, a notificação que chega com o app ABERTO não aparece na tela. Fica no
// escopo do módulo para valer antes de qualquer tela montar.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export type FalhaNotificacao = 'permissao-negada' | 'permissao-bloqueada' | 'agendamento-falhou';

export type ResultadoAgendamento = { ok: true } | { ok: false; falha: FalhaNotificacao };

export const MENSAGENS_FALHA_NOTIFICACAO: Record<FalhaNotificacao, string> = {
  'permissao-negada':
    'Sem a permissão de notificações não dá para lembrar você. Toque em "Agendar lembrete" de novo e escolha "Permitir".',
  'permissao-bloqueada':
    'As notificações estão bloqueadas para este app. Abra Configurações > Habit Tracker > Notificações e autorize — o diálogo não vai mais aparecer sozinho.',
  'agendamento-falhou':
    'Não foi possível agendar o lembrete neste aparelho. Tente de novo em instantes.',
};

export async function agendarLembrete(
  habito: Pick<Habito, 'id' | 'titulo'>
): Promise<ResultadoAgendamento> {
  try {
    // No Android 13+ o canal precisa existir ANTES do pedido de permissão, senão o diálogo
    // não aparece. A importância alta é o que faz o banner descer com o app aberto.
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CANAL_LEMBRETES, {
        name: 'Lembretes de hábitos',
        importance: Notifications.AndroidImportance.HIGH,
      });
    }

    // 1. PEDIR — `canAskAgain` separa "negou" de "bloqueou", como na localização.
    const permissao = await Notifications.requestPermissionsAsync();
    if (permissao.status !== 'granted') {
      return {
        ok: false,
        falha: permissao.canAskAgain ? 'permissao-negada' : 'permissao-bloqueada',
      };
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Hora do hábito!',
        body: habito.titulo,
        // O `id` viaja na notificação: é ele que diz qual detalhe abrir no toque.
        data: { habitoId: habito.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: SEGUNDOS_ATE_LEMBRETE,
        channelId: CANAL_LEMBRETES,
      },
    });

    return { ok: true };
  } catch {
    return { ok: false, falha: 'agendamento-falhou' };
  }
}

/**
 * Montado UMA vez, no layout raiz: o toque precisa abrir o detalhe a partir de qualquer
 * tela, e não só da tela que agendou.
 */
export function useObservadorNotificacoes() {
  const router = useRouter();

  useEffect(() => {
    function abrirDetalhe(resposta: Notifications.NotificationResponse) {
      const habitoId = resposta.notification.request.content.data?.habitoId;
      if (typeof habitoId === 'string') {
        router.push({ pathname: '/habit/[id]', params: { id: habitoId } });
      }
    }

    // App FECHADO: o toque que abriu o app aconteceu antes de qualquer listener existir.
    // A limpeza evita abrir o mesmo detalhe de novo quando o JS recarrega.
    const respostaInicial = Notifications.getLastNotificationResponse();
    if (respostaInicial) {
      Notifications.clearLastNotificationResponse();
      abrirDetalhe(respostaInicial);
    }

    // 2. LER
    const recebida = Notifications.addNotificationReceivedListener((notificacao) => {
      console.log('Notificação recebida', notificacao.request.content);
    });

    const tocada = Notifications.addNotificationResponseReceivedListener((resposta) => {
      console.log('Notificação tocada', resposta.notification.request.content);
      abrirDetalhe(resposta);
    });

    // 3. PARAR
    return () => {
      recebida.remove();
      tocada.remove();
    };
  }, [router]);
}
