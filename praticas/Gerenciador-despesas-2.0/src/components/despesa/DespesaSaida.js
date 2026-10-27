
import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function DespesaSaida({ valor, color }) {
  const valorNumerico = Number(valor) || 0;

  const valorFormatado = valorNumerico.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <Text
      style={[
        styles.valor,
        color ? { color } : null,
      ]}
    >
      {valorFormatado}
    </Text>
  );
}

const styles = StyleSheet.create({
  valor: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
