// Atividades 1 e 2 — Layout Raiz
// Onde: src/app/_layout.tsx
//
// Navegação por ABAS (Tabs) no lugar do Stack: as quatro rotas são destinos do
// mesmo nível — nenhuma é "filha" da outra —, então cada uma ganha uma aba fixa
// na barra inferior, sempre a um toque de distância.
//
// backBehavior="history": o "voltar" (router.back() e o botão do Android) retorna
// para a aba visitada ANTES, como num Stack. Sem isso, o padrão das abas é sempre
// voltar para a primeira, e o "Concluir" da foto perderia o sentido.

import { Tabs } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

// Ícone em emoji: dispensa instalar uma biblioteca de ícones só para a barra de abas.
// Fora do componente: cria a função do ícone de cada aba uma única vez.
function icone(emoji: string) {
  return ({ focused, size }: { focused: boolean; size: number }) => (
    <Text style={[estilos.icone, { fontSize: size - 4 }, !focused && estilos.iconeInativo]}>
      {emoji}
    </Text>
  );
}

export default function LayoutRaiz() {
  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        headerTintColor: '#f26522',
        tabBarActiveTintColor: '#f26522',
        tabBarInactiveTintColor: '#7A7A7A',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Meus hábitos', tabBarLabel: 'Hábitos', tabBarIcon: icone('📋') }}
      />
      <Tabs.Screen
        name="registrar-foto"
        options={{ title: 'Foto do hábito', tabBarLabel: 'Foto', tabBarIcon: icone('📷') }}
      />
      <Tabs.Screen
        name="galeria"
        options={{ title: 'Galeria do hábito', tabBarLabel: 'Galeria', tabBarIcon: icone('🖼️') }}
      />
      <Tabs.Screen
        name="sobre"
        options={{ title: 'Sobre o app', tabBarLabel: 'Sobre', tabBarIcon: icone('ℹ️') }}
      />
    </Tabs>
  );
}

const estilos = StyleSheet.create({
  icone: { textAlign: 'center' },
  // A aba inativa fica "apagada", como a cor tabBarInactiveTintColor faz no rótulo.
  iconeInativo: { opacity: 0.45 },
});
