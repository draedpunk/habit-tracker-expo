// Atividade aplicada · Aula 7 — Tela Sobre do Drawer
// Onde: src/app/about.tsx

import { StyleSheet, Text, View } from 'react-native';

export default function TelaSobre() {
  return (
    <View style={estilos.tela}>
      <Text style={estilos.titulo}>Rastreador de Micro-hábitos</Text>
      <Text style={estilos.subtitulo}>Versão: Aula 7 (Drawer, Tabs e Notificações)</Text>

      <Text style={estilos.limitacao}>
        A foto escolhida em "Registrar foto" e na galeria ainda não volta para a lista de hábitos.
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, padding: 24, gap: 16, justifyContent: 'center' },
  titulo: { fontSize: 22, fontWeight: '700', color: '#333' },
  subtitulo: { fontSize: 16, color: '#666' },
  limitacao: { fontSize: 14, color: '#999', fontStyle: 'italic', lineHeight: 20 },
});
