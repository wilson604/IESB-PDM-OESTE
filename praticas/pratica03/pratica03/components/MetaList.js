import { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

function MetaInput(props) {
  const [texto, setTexto] = useState('');

  function adicionarMeta() {
    if (texto.trim().length === 0) {
      return;
    }

    props.onAddMeta(texto);
    setTexto('');
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite uma meta"
        value={texto}
        onChangeText={setTexto}
      />

      <Button
        title="Adicionar"
        onPress={adicionarMeta}
      />
    </View>
  );
}

export default MetaInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    marginBottom: 10,
  },
});
