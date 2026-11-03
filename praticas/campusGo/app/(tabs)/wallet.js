
import { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Share,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';

import { useExpenses } from '../../store/expenses-context';

export default function WalletScreen() {
  const { expenses, addExpense } = useExpenses();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const total = expenses.reduce((sum, expense) => {
    return sum + Number(expense.amount || 0);
  }, 0);

  function handleAddExpense() {
    const cleanDescription = description.trim();
    const numericAmount = Number(amount.replace(',', '.'));

    if (!cleanDescription || !amount.trim()) {
      Alert.alert('Atenção', 'Preencha a descrição e o valor.');
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      Alert.alert('Valor inválido', 'Digite um valor maior que zero.');
      return;
    }

    addExpense({
      description: cleanDescription,
      amount: numericAmount,
    });

    setDescription('');
    setAmount('');

    Alert.alert('Sucesso', 'Despesa adicionada!');
  }

  async function shareExpenses() {
    try {
      await Share.share({
        message: `Gastei R$ ${total.toFixed(2)} neste semestre.`,
      });
    } catch (error) {
      console.log('Erro ao compartilhar:', error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meu bolso</Text>
        <Text style={styles.description}>
          Acompanhe seus gastos acadêmicos.
        </Text>
      </View>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>RESUMO FINANCEIRO</Text>
        <Text style={styles.totalDescription}>Total de despesas</Text>
        <Text style={styles.totalValue}>
          R$ {total.toFixed(2)}
        </Text>
        <Text style={styles.totalFooter}>
          Seus gastos neste semestre
        </Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.subtitle}>Adicionar despesa</Text>

        <Text style={styles.inputLabel}>Descrição</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: Material escolar"
          placeholderTextColor="#94A3B8"
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.inputLabel}>Valor (R$)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: 32,50"
          placeholderTextColor="#94A3B8"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
        />

        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleAddExpense}
        >
          <Text style={styles.buttonText}>+ Adicionar despesa</Text>
        </Pressable>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.subtitle}>Minhas despesas</Text>
        <Text style={styles.count}>
          {expenses.length} {expenses.length === 1 ? 'registro' : 'registros'}
        </Text>
      </View>

      <FlatList
        data={expenses}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>
              Nenhuma despesa ainda
            </Text>
            <Text style={styles.empty}>
              Cadastre sua primeira despesa acima.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.expenseCard}>
            <View style={styles.expenseInfo}>
              <Text style={styles.expenseTitle}>
                {item.description}
              </Text>
              <Text style={styles.expenseSubtitle}>
                Despesa registrada
              </Text>
            </View>

            <Text style={styles.expenseAmount}>
              R$ {Number(item.amount).toFixed(2)}
            </Text>
          </View>
        )}
      />

      <Pressable
        style={({ pressed }) => [
          styles.shareButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={shareExpenses}
      >
        <Text style={styles.buttonText}>
          Compartilhar resumo
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FC',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
  },
  header: {
    marginBottom: 15,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#173B80',
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 5,
  },
  totalCard: {
    backgroundColor: '#2563EB',
    padding: 20,
    borderRadius: 18,
    marginBottom: 16,
    elevation: 4,
  },
  totalLabel: {
    color: '#DBEAFE',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  totalDescription: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 12,
  },
  totalValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 4,
  },
  totalFooter: {
    color: '#DBEAFE',
    fontSize: 12,
    marginTop: 6,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    padding: 17,
    borderRadius: 16,
    marginBottom: 18,
    elevation: 2,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#173B80',
  },
  inputLabel: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#DCE5F2',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#1E293B',
  },
  addButton: {
    backgroundColor: '#2563EB',
    padding: 14,
    borderRadius: 11,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonPressed: {
    opacity: 0.75,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  count: {
    color: '#64748B',
    fontSize: 12,
  },
  list: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  expenseCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 13,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    color: '#1E293B',
    fontSize: 15,
    fontWeight: 'bold',
  },
  expenseSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
  },
  expenseAmount: {
    color: '#2563EB',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 14,
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#173B80',
    fontSize: 15,
    fontWeight: 'bold',
  },
  empty: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
  },
  shareButton: {
    backgroundColor: '#173B80',
    padding: 16,
    borderRadius: 13,
    alignItems: 'center',
    marginTop: 10,
  },
});
