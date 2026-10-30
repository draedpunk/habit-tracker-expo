// Atividade aplicada · Aula 7 — Layout Raiz (Drawer)
// Onde: src/app/_layout.tsx

import { MaterialIcons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { BotaoVoltarHeader } from '../components/botao-voltar-header';
import { HabitosProvider } from '../context/habitos-context';
import { useObservadorNotificacoes } from '../services/notificacoes';

// Rotas que existem, mas não são itens do menu: o Drawer lista toda rota irmã por padrão.
const OPCOES_FORA_DO_MENU = {
  drawerItemStyle: { display: 'none' },
  headerLeft: ({ tintColor }: { tintColor?: unknown }) => <BotaoVoltarHeader cor={tintColor as string | undefined} />,
} as const;

export default function LayoutRaiz() {
  useObservadorNotificacoes();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HabitosProvider>
        {/* `history` faz o voltar seguir o caminho percorrido. O padrão do Drawer pularia
            para a primeira rota, ignorando de onde o usuário veio. */}
        <Drawer
          backBehavior="history"
          screenOptions={{ headerTintColor: '#f26522', drawerActiveTintColor: '#f26522' }}
        >
          <Drawer.Screen
            name="(tabs)"
            options={{
              drawerLabel: 'Home',
              title: 'Meus hábitos',
              drawerIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color as string} />,
            }}
          />
          <Drawer.Screen
            name="about"
            options={{
              drawerLabel: 'Sobre',
              title: 'Sobre o app',
              drawerIcon: ({ color, size }) => <MaterialIcons name="info" size={size} color={color as string} />,
            }}
          />
          <Drawer.Screen
            name="settings"
            options={{
              drawerLabel: 'Configurações',
              title: 'Configurações',
              drawerIcon: ({ color, size }) => <MaterialIcons name="settings" size={size} color={color as string} />,
            }}
          />
          <Drawer.Screen
            name="habit/[id]"
            options={{ ...OPCOES_FORA_DO_MENU, title: 'Detalhe do hábito' }}
          />
          <Drawer.Screen
            name="registrar-foto"
            options={{ ...OPCOES_FORA_DO_MENU, title: 'Foto do hábito' }}
          />
          <Drawer.Screen
            name="galeria"
            options={{ ...OPCOES_FORA_DO_MENU, title: 'Galeria do hábito' }}
          />
        </Drawer>
      </HabitosProvider>
    </GestureHandlerRootView>
  );
}
