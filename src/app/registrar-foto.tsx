// GALERIA → PEDIR: nada — o seletor é do sistema e só entrega ao app a foto escolhida
//           LER: launchImageLibraryAsync → `canceled` ou `assets[0].uri`
//           PARAR: nada a encerrar — o seletor fecha sozinho ao escolher ou cancelar
// CÂMERA  → PEDIR: requestCameraPermissionsAsync → `granted` e `canAskAgain` (negada x bloqueada)
//           LER: launchCameraAsync → `canceled` ou `assets[0].uri`
//           PARAR: nada a encerrar — a câmera do sistema fecha sozinha após capturar/cancelar
//
// Atividade 1 — Registrar Foto do Hábito (Galeria + Câmera)
// Onde: src/app/registrar-foto.tsx
//
// Requisitos:
//   1. Preencha o contrato de três tempos acima (vale nota).
//   2. Opção de escolher da galeria OU tirar com a câmera.
//   3. Prévia com expo-image (contentFit="cover", transition={300}).
//   4. Tratar cancelamento SEM mensagem de erro.
//   5. Tratar câmera negada e bloqueada com mensagens distintas.
//   6. Manter galeria sempre disponível.
//   7. Botão "Concluir" volta para a tela anterior (desabilitado sem foto).

import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

type Falha = 'camera-negada' | 'camera-bloqueada';

// Duas mensagens DIFERENTES, cada uma dizendo ao usuário o que ELE pode fazer.
const MENSAGENS: Record<Falha, string> = {
  'camera-negada':
    'Sem acesso à câmera não dá para tirar a foto do hábito. Toque em "Tirar foto" de novo e autorize — ou, se preferir, escolha uma foto da galeria.',
  'camera-bloqueada':
    'A câmera está bloqueada para este app. Para liberar, abra as Configurações do aparelho, entre no app habit-tracker-expo e ative a Câmera (no iPhone: Ajustes → habit-tracker-expo → Câmera). Enquanto isso, a galeria continua disponível.',
};

// Declaradas uma vez só, tipadas, e reaproveitadas na câmera e na galeria.
const OPCOES: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [4, 3],
  quality: 0.7,
};

export default function TelaRegistrarFoto() {
  const router = useRouter();
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [falha, setFalha] = useState<Falha | null>(null);

  async function tirarFoto() {
    setFalha(null);

    // canAskAgain separa a negada (o sistema ainda mostra o pedido) da bloqueada
    // (só o próprio usuário, nas Configurações, consegue liberar).
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) {
      setFalha(permissao.canAskAgain ? 'camera-negada' : 'camera-bloqueada');
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync(OPCOES);
    // Cancelar não é erro: sai sem mensagem e sem apagar a foto anterior.
    if (resultado.canceled) return;
    setFotoUri(resultado.assets[0].uri);
  }

  async function escolherDaGaleria() {
    setFalha(null);

    // Sem permissão prévia: quem mostra as fotos é o sistema.
    const resultado = await ImagePicker.launchImageLibraryAsync(OPCOES);
    if (resultado.canceled) return;
    setFotoUri(resultado.assets[0].uri);
  }

  function concluir() {
    // Nas abas, o histórico (backBehavior="history") leva de volta à aba anterior.
    // Se o usuário abriu o app direto aqui (deep link), não há para onde voltar.
    if (router.canGoBack()) {
      router.back();
    } else {
      router.navigate('/');
    }
  }

  return (
    <View style={estilos.tela}>
      {fotoUri ? (
        <Image
          source={{ uri: fotoUri }}
          style={estilos.previa}
          contentFit="cover"
          transition={300}
        />
      ) : (
        <View style={[estilos.previa, estilos.semFoto]}>
          <Text>Nenhuma foto ainda</Text>
        </View>
      )}

      <Pressable onPress={tirarFoto} style={estilos.botao}>
        <Text style={estilos.textoBotao}>Tirar foto</Text>
      </Pressable>

      <Pressable onPress={escolherDaGaleria} style={estilos.botaoSecundario}>
        <Text style={estilos.textoBotaoSecundario}>Escolher da galeria</Text>
      </Pressable>

      {falha && <Text style={estilos.erro}>{MENSAGENS[falha]}</Text>}

      <Pressable
        onPress={concluir}
        disabled={!fotoUri}
        style={[estilos.botao, !fotoUri && estilos.desligado]}
      >
        <Text style={estilos.textoBotao}>Concluir</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, padding: 24, gap: 16 },
  previa: { width: '100%', aspectRatio: 4 / 3, borderRadius: 12 },
  semFoto: { backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' },
  botao: { backgroundColor: '#f26522', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  botaoSecundario: { borderWidth: 2, borderColor: '#f26522', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  textoBotao: { color: '#fff', fontWeight: '700', fontSize: 16 },
  textoBotaoSecundario: { color: '#f26522', fontWeight: '700', fontSize: 16 },
  desligado: { opacity: 0.4 },
  erro: { fontSize: 15, color: '#b00020' },
});
