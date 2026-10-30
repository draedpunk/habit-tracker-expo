// Atividade aplicada · Aula 7 — Detalhe do hábito (rota dinâmica)
// Onde: src/app/habit/[id].tsx

import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { BotaoAcao } from '../../components/botao-acao';
import { useHabitos } from '../../context/habitos-context';
import { formatarLocal } from '../../lib/formatar-local';
import { agendarLembrete, MENSAGENS_FALHA_NOTIFICACAO } from '../../services/notificacoes';
import { cores, espaco, tipografia } from '../../theme';
import { corDoStatus, rotuloDoStatus } from '../../utils/status-habito';

export default function RotaDetalheHabito() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // O Drawer mantém a tela montada entre navegações. A `key` recomeça o estado local a cada
  // hábito: sem ela, o aviso do lembrete do hábito 5 continuaria na tela do hábito 3.
  return <DetalheHabito key={id} id={id} />;
}

function DetalheHabito({ id }: { id: string }) {
  const router = useRouter();
  const { habitos, alternar } = useHabitos();
  const [aviso, setAviso] = useState<string | null>(null);

  const habito = habitos.find((h) => h.id === id);

  function voltar() {
    // Aberta por uma notificação com o app fechado, a tela não tem histórico para voltar.
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }

  // Um lembrete agendado pode tocar depois de o hábito ter sido removido da lista.
  if (!habito) {
    return (
      <View style={[estilos.tela, estilos.centralizado]}>
        <Text style={tipografia.corpo}>Hábito {id} não encontrado.</Text>
        <BotaoAcao rotulo="Voltar" onPressionar={voltar} />
      </View>
    );
  }

  async function agendar() {
    if (!habito) return;

    const resultado = await agendarLembrete(habito);
    setAviso(
      resultado.ok
        ? 'Lembrete agendado para daqui a 5 segundos.'
        : MENSAGENS_FALHA_NOTIFICACAO[resultado.falha]
    );
  }

  return (
    <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
      {habito.fotoUri && (
        <Image
          source={{ uri: habito.fotoUri }}
          style={estilos.foto}
          contentFit="cover"
          accessibilityLabel={`Foto do hábito ${habito.titulo}`}
        />
      )}

      <Text style={tipografia.titulo}>{habito.titulo}</Text>
      <Text style={tipografia.legenda}>Hábito ID: {habito.id}</Text>
      <Text style={[estilos.status, { color: corDoStatus(habito.status) }]}>
        {habito.categoria} · {rotuloDoStatus(habito.status)}
      </Text>
      <Text style={tipografia.corpo}>Sequência: {habito.streakDias} dias</Text>
      {habito.local && <Text style={tipografia.legenda}>{formatarLocal(habito.local)}</Text>}

      <View style={estilos.acoes}>
        <BotaoAcao
          rotulo={habito.status === 'pendente' ? 'Marcar como concluído' : 'Marcar como pendente'}
          onPressionar={() => alternar(habito.id)}
        />
        <BotaoAcao rotulo="Agendar lembrete (5s)" onPressionar={agendar} />
        <BotaoAcao rotulo="Voltar" onPressionar={voltar} />
      </View>

      {aviso && <Text style={tipografia.corpo}>{aviso}</Text>}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  centralizado: { justifyContent: 'center', alignItems: 'center', gap: espaco.md, padding: espaco.lg },
  conteudo: { padding: espaco.lg, gap: espaco.sm },
  foto: { width: '100%', aspectRatio: 4 / 3, borderRadius: espaco.sm },
  status: { fontSize: 16, fontWeight: '600', textTransform: 'capitalize' },
  acoes: { marginTop: espaco.md, gap: espaco.xs },
});
