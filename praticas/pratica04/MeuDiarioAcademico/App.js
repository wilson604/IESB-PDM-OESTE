import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  TITULO_APP,
  PLACEHOLDER_DISCIPLINA,
  TEXTO_BOTAO,
  TITULO_LISTA,
} from "./labels";

export default function App() {
  const [disciplina, setDisciplina] = useState("");

  const disciplinas = [
    "Programação para Dispositivos Móveis",
    "Construção de Backend",
    "Engenharia de Software",
    "Métodos Ágeis",
  ];

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.titulo}>{TITULO_APP}</Text>
      </View>

      {/* Área de cadastro */}
      <View style={styles.linhaCadastro}>
        <TextInput
          style={styles.input}
          placeholder={PLACEHOLDER_DISCIPLINA}
          value={disciplina}
          onChangeText={setDisciplina}
        />

        <Pressable
  style={({ pressed }) => [
    styles.botao,
    pressed && styles.botaoPressionado,
  ]}
  onPress={() => console.log("Disciplina:", disciplina)}
>
  <Text style={styles.textoBotao}>{TEXTO_BOTAO}</Text>
</Pressable>

      {/* Lista de disciplinas */}
      <View style={styles.listaContainer}>
        <Text style={styles.tituloLista}>{TITULO_LISTA}</Text>

        {disciplinas.map((item, index) => (
          <View key={index} style={styles.itemLista}>
            <Text style={styles.textoItem}>{item}</Text>
          </View>
        ))}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },

  header: {
    alignItems: "center",
    marginBottom: 25,
  },

  titulo: {
    fontSize: 26,
    fontWeight: "bold",
  },

  linhaCadastro: {
    flexDirection: "row",

    // Os elementos ficam centralizados verticalmente
    // para que input e botão fiquem alinhados.
    alignItems: "center",

    // Existe um pequeno espaço entre o input e o botão.
    justifyContent: "space-between",

    marginBottom: 25,
  },

  input: {
    width: "70%",
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },

 botao: {
  width: "27%",
  padding: 12,
  borderRadius: 8,
  backgroundColor: "#2196F3",
  alignItems: "center",
},

botaoPressionado: {
  opacity: 0.6,
},

textoBotao: {
  color: "#fff",
  fontWeight: "bold",
}, 

  tituloLista: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  itemLista: {
    marginVertical: 5,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
  },

  textoItem: {
    fontSize: 16,
  },
});