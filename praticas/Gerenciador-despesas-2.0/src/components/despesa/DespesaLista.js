
import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';

import DespesaItem from './DespesaItem';
import theme from '../../constants/theme';

export default function DespesaLista({
  despesas,
  onSelecionarDespesa,
  darkMode = false,
}) {
  const colors = darkMode ? theme.dark : theme.light;

  if (!despesas || despesas.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          Nenhuma despesa encontrada
        </Text>

        <Text style={[styles.emptyMessage, { color: colors.secondary }]}>
          Cadastre uma despesa para ela aparecer nesta lista.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={despesas}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <DespesaItem
          despesa={item}
          onPress={() => onSelecionarDespesa(item)}
          darkMode={darkMode}
        />
      )}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: 'center',
  },
});
