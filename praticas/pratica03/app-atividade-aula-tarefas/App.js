import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { titulo } from './util';
import titulo_padrao from './util'; 
import {
    rotulo_input_meta,
    rotulo_btn_cadastro_meta,
    rotulo_lista_metas
} from "./mensagens";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{titulo}</Text>
       <Text>{titulo_padrao}</Text>  
       <Text style={{margin: 20}}>{titulo_padrao}</Text>
       <Text style={styles.Text}>AAA</Text>
       <Button title='Clique Aqui' />

       <Text>{rotulo_btn_cadastro_meta}</Text>
       <Button title={rotulo_btn_cadastro_meta} />
       <TextInput style={styles.edit1} placeholder={rotulo_input_meta} /> 
       <Text>{rotulo_lista_metas}</Text>
       <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    margin: 20,
  },
  edit1: {
    margin: 25,
    borderColor: '#cccccc',
    borderWidth: 1,
  }
});
