
import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
} from 'react-native';
import { useTema } from '../../store/tema-context';

export default function BotaoTema() {
  const { temaEscuro, alternarTema } = useTema();

  return (
    <Pressable
      onPress={alternarTema}
      style={[
        styles.botao,
        {
          backgroundColor: temaEscuro
            ? '#333333'
            : '#E8EEFF',
        },
      ]}
    >
      <Text
        style={[
          styles.texto,
          {
            color: temaEscuro
              ? '#FFFFFF'
              : '#244A9B',
          },
        ]}
      >
        {temaEscuro
          ? 'Ativar tema claro'
          : 'Ativar tema escuro'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  texto: {
    fontWeight: 'bold',
    fontSize: 15,
  },
});
