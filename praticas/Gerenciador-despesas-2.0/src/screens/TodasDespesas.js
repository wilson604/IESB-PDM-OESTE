
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Pressable,
  useColorScheme,
  Platform,
} from 'react-native';

import useDebounce from '../hooks/useDebounce';
import { useExpenses } from '../store/expenses-context';
import theme from '../constants/theme';

export default function TodasDespesas({ navigation }) {
  const { expenses, isLoaded } = useExpenses();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? theme.dark : theme.light;

  const filteredExpenses = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();

    return expenses.filter((expense) =>
      String(expense.description ?? '').toLowerCase().includes(term)
    );
  }, [expenses, debouncedSearch]);

  const total = filteredExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0
  );

  function renderExpense({ item }) {
    return (
      <Pressable
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
        onPress={() =>
          navigation.navigate('GerenciarDespesa', {
            expenseId: item.id,
          })
        }
      >
        <View style={styles.expenseInfo}>
          <Text style={[styles.description, { color: colors.text }]}>
            {item.description}
          </Text>

          <Text style={[styles.details, { color: colors.secondary }]}>
            {item.category} · {item.date}
          </Text>
        </View>

        <Text style={[styles.amount, { color: colors.primary }]}>
          R$ {Number(item.amount).toFixed(2).replace('.', ',')}
        </Text>
      </Pressable>
    );
  }

  if (!isLoaded) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Carregando despesas...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Todas as despesas
      </Text>

      <TextInput
        style={[
          styles.search,
          {
            color: colors.text,
            borderColor: colors.border,
            backgroundColor: colors.card,
          },
        ]}
        placeholder="Buscar despesa..."
        placeholderTextColor={colors.secondary}
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.summary}>
        <Text style={[styles.summaryText, { color: colors.text }]}>
          {filteredExpenses.length} despesa(s)
        </Text>

        <Text style={[styles.total, { color: colors.text }]}>
          Total: R$ {total.toFixed(2).replace('.', ',')}
        </Text>
      </View>

      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderExpense}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Nenhuma despesa encontrada
            </Text>
            <Text style={{ color: colors.secondary, textAlign: 'center' }}>
              Toque no botão abaixo para cadastrar uma despesa.
            </Text>
          </View>
        }
      />

      <Pressable
        style={styles.addButton}
        onPress={() => navigation.navigate('GerenciarDespesa')}
      >
        <Text style={styles.addButtonText}>+ Nova despesa</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  search: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 15,
  },
  total: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  list: {
    flexGrow: 1,
    paddingBottom: 12,
  },
  card: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      default: {},
    }),
  },
  expenseInfo: {
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 13,
    marginTop: 5,
  },
  amount: {
    fontWeight: 'bold',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  addButton: {
    backgroundColor: '#4B7BEC',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
