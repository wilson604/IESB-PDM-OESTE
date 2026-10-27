
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import theme from '../../constants/theme';

export default function DespesaSumario({
  despesas,
  darkMode = false,
}) {
  const colors = darkMode ? theme.dark : theme.light;

  const total = despesas.reduce(
    (soma, despesa) => soma + Number(despesa.amount || 0),
    0
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.label, { color: colors.secondary }]}>
        TOTAL DE DESPESAS
      </Text>

      <Text style={[styles.total, { color: colors.primary }]}>
        R$ {total.toFixed(2).replace('.', ',')}
      </Text>

      <Text style={[styles.quantity, { color: colors.text }]}>
        {despesas.length}{' '}
        {despesas.length === 1 ? 'despesa cadastrada' : 'despesas cadastradas'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  total: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 6,
    marginBottom: 4,
  },
  quantity: {
    fontSize: 14,
  },
});
