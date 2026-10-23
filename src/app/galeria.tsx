// Atividade 2 — A Galeria do Hábito
// Onde: src/app/galeria.tsx
//
// Por que a seleção múltipla e o recorte (allowsEditing) NÃO convivem:
// o recorte é uma tela de edição do sistema que trabalha sobre UMA imagem por vez —
// o usuário ajusta o enquadramento daquela foto e confirma. Com várias fotos
// escolhidas de uma vez, não existe um fluxo nativo para recortar cada uma em
// sequência, então o sistema simplesmente ignora o allowsEditing quando
// allowsMultipleSelection está ligado (no iOS e no Android). Por isso aqui não
// pedimos recorte: a grade usa contentFit="cover" para enquadrar as miniaturas.

import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
// Regra de ouro da arquitetura: o componente de miniatura mora em src/components/,
// NUNCA declarado dentro de src/app/ para não gerar rotas fantasmas.
import { MiniaturaFoto } from '../components/miniatura-foto';

// Fora do componente: a FlatList recebe sempre a mesma referência a cada render.
function renderFoto({ item }: { item: ImagePicker.ImagePickerAsset }) {
  return <MiniaturaFoto item={item} />;
}

function ListaVazia() {
  return <Text style={estilos.vazio}>Nenhuma foto escolhida ainda.</Text>;
}

export default function TelaGaleria() {
  const [fotos, setFotos] = useState<ImagePicker.ImagePickerAsset[]>([]);

  async function escolherFotos() {
    // A galeria do sistema não precisa de permissão prévia: o app só recebe
    // as fotos que o usuário escolheu.
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 6,
      quality: 0.7,
    });

    // Cancelar não é erro: mantém as fotos que já estavam na grade.
    if (resultado.canceled) return;
    setFotos(resultado.assets);
  }

  return (
    <View style={estilos.tela}>
      <Pressable onPress={escolherFotos} style={estilos.botao}>
        <Text style={estilos.textoBotao}>Escolher até 6 fotos</Text>
      </Pressable>

      <FlatList
        data={fotos}
        keyExtractor={(foto) => foto.uri}
        renderItem={renderFoto}
        numColumns={3}
        columnWrapperStyle={estilos.linha}
        contentContainerStyle={estilos.grade}
        ListEmptyComponent={ListaVazia}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, padding: 24, gap: 16 },
  botao: { backgroundColor: '#f26522', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  textoBotao: { color: '#fff', fontWeight: '700', fontSize: 16 },
  grade: { gap: 8 },
  linha: { gap: 8 },
  vazio: { fontSize: 15, color: '#666', textAlign: 'center', marginTop: 24 },
});
