// Atividade aplicada · Aula 7 — Aba Estatísticas (placeholder pedido no enunciado)
// Onde: src/app/(tabs)/stats.tsx

import { StyleSheet, Text, View } from 'react-native';

import { cores, espaco, tipografia } from '../../theme';

export default function TelaEstatisticas() {
  return (
    <View style={estilos.tela}>
      <Text style={tipografia.titulo}>Estatísticas</Text>
      <Text style={[tipografia.corpo, { textAlign: 'center' }]}>Em breve, o progresso dos seus hábitos aparece aqui.</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: espaco.sm,
    padding: espaco.lg,
    backgroundColor: cores.fundo,
  },
});
