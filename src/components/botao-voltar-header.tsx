// Atividade aplicada · Aula 7 — seta de voltar das telas fora do menu.
//
// O Drawer não empilha telas como o Stack: o header dele mostra o menu, nunca a seta. Sem
// este botão, `galeria` e `registrar-foto` ficariam sem caminho visível de volta.
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';

import { espaco } from '../theme';

export function BotaoVoltarHeader({ cor }: { cor?: string }) {
  const router = useRouter();

  return (
    <Pressable
      // Aberta por uma notificação com o app fechado, a tela não tem histórico para voltar.
      onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
      accessibilityRole="button"
      accessibilityLabel="Voltar"
      hitSlop={espaco.sm}
      style={{ paddingHorizontal: espaco.md }}
    >
      <MaterialIcons name="arrow-back" size={24} color={cor} />
    </Pressable>
  );
}
