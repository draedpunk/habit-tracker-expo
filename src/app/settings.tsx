// Atividade aplicada · Aula 7 — Tela Configurações do Drawer
// Onde: src/app/settings.tsx

import { StyleSheet, Text, View } from 'react-native';

import { cores, espaco, tipografia } from '../theme';

export default function TelaConfiguracoes() {
  return (
    <View style={estilos.tela}>
      <Text style={tipografia.titulo}>Configurações</Text>
      <Text style={[tipografia.corpo, { textAlign: 'center' }]}>Em breve, as preferências de lembrete aparecem aqui.</Text>
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
