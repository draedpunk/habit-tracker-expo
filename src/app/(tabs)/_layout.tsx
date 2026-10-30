// Atividade aplicada · Aula 7 — Layout das abas
// Onde: src/app/(tabs)/_layout.tsx

import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function LayoutAbas() {
  return (
    // `headerShown: false` porque o Drawer já desenha um header: com os dois, a tela ficaria
    // com duas barras empilhadas.
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#f26522' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Estatísticas',
          tabBarIcon: ({ color, size }) => <Feather name="bar-chart-2" size={size} color={color as string} />,
        }}
      />
    </Tabs>
  );
}
