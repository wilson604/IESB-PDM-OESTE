
import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  useColorScheme,
  Platform,
} from 'react-native';

import { useExpenses } from '../store/expenses-context';
import theme from '../constants/theme';

export default function DespesasRecentes({ navigation }) {
  const { expenses, isLoaded } = useExpenses();

  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? theme.dark : theme.light;

  const recentExpenses = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    return expenses.filter((expense) => {
      // Interpreta a data como data local, evitando problemas de fuso horário.
      const expenseDate = new Date(`${expense.date}T12:00:00`);

      return (
        !Number.isNaN(expenseDate.getTime()) &&
        expenseDate >= new Date(
          sevenDaysAgo.getFullYear(),
          sevenDaysAgo.getMonth(),
          sevenDaysAgo.getDate()
        ) &&
        expenseDate <= now
      );
    });
  }, [expenses]);

  const total = recentExpenses.reduce(
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
        <View style={styles.info}>
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
        Despesas dos últimos 7 dias
      </Text>

      <View style={styles.summary}>
        <Text style={{ color: colors.text }}>
          {recentExpenses.length} despesa(s)
        </Text>

        <Text style={[styles.total, { color: colors.text }]}>
          Total: R$ {total.toFixed(2).replace('.', ',')}
        </Text>
      </View>

      <FlatList
        data={recentExpenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderExpense}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Nenhuma despesa recente
            </Text>

            <Text style={{ color: colors.secondary, textAlign: 'center' }}>
              Cadastre uma despesa para vê-la nesta lista.
            </Text>
          </View>
        }
      />

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('GerenciarDespesa')}
      >
        <Text style={styles.buttonText}>+ Nova despesa</Text>
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
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  total: {
    fontWeight: 'bold',
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
  info: {
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  details: {
    marginTop: 5,
    fontSize: 13,
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
  button: {
    backgroundColor: '#4B7BEC',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
