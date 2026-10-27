
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Modal,
  Alert,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { useExpenses } from '../store/expenses-context';
import theme from '../constants/theme';

const CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Outros',
];

function toDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function validate(values) {
  const errors = {};
  const description = values.description.trim();
  const amount = Number(values.amount.replace(',', '.'));
  const selectedDate = new Date(`${values.date}T12:00:00`);
  const today = new Date();

  today.setHours(23, 59, 59, 999);

  if (description.length < 3) {
    errors.description = 'Digite pelo menos 3 caracteres.';
  }

  if (
    !values.amount.trim() ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    errors.amount = 'Informe um valor maior que zero.';
  }

  if (
    !values.date ||
    Number.isNaN(selectedDate.getTime()) ||
    selectedDate > today
  ) {
    errors.date = 'Selecione uma data válida que não seja futura.';
  }

  if (!values.category) {
    errors.category = 'Selecione uma categoria.';
  }

  return errors;
}

export default function GerenciarDespesa({ route, navigation }) {
  const { expenses, addExpense, updateExpense, deleteExpense } =
    useExpenses();

  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? theme.dark : theme.light;

  const expenseId = route.params?.expenseId;
  const isEditing = Boolean(expenseId);
  const existingExpense = expenses.find(
    (expense) => expense.id === expenseId
  );

  const [form, setForm] = useState({
    description: '',
    amount: '',
    date: toDateString(new Date()),
    category: '',
  });

  const [errors, setErrors] = useState({});
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    if (existingExpense) {
      setForm({
        description: existingExpense.description ?? '',
        amount: String(existingExpense.amount ?? ''),
        date: existingExpense.date ?? toDateString(new Date()),
        category: existingExpense.category ?? '',
      });
    }
  }, [existingExpense]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Editar despesa' : 'Nova despesa',
    });
  }, [navigation, isEditing]);

  function handleChange(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  function handleSave() {
    const newErrors = validate(form);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const expenseData = {
      description: form.description.trim(),
      amount: Number(form.amount.replace(',', '.')),
      date: form.date,
      category: form.category,
    };

    if (isEditing) {
      if (!existingExpense) {
        Alert.alert('Erro', 'Não foi possível localizar esta despesa.');
        return;
      }

      updateExpense(expenseId, expenseData);
    } else {
      addExpense(expenseData);
    }

    navigation.goBack();
  }

  function handleDelete() {
    Alert.alert(
      'Excluir despesa',
      'Tem certeza de que deseja excluir esta despesa?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            deleteExpense(expenseId);
            navigation.goBack();
          },
        },
      ]
    );
  }

  function renderError(field) {
    if (!errors[field]) {
      return null;
    }

    return <Text style={styles.error}>{errors[field]}</Text>;
  }

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.label, { color: colors.text }]}>
          Descrição
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              backgroundColor: colors.card,
              borderColor: errors.description
                ? colors.danger
                : colors.border,
            },
          ]}
          placeholder="Ex.: Almoço"
          placeholderTextColor={colors.secondary}
          value={form.description}
          onChangeText={(value) => handleChange('description', value)}
          maxLength={100}
        />

        {renderError('description')}

        <Text style={[styles.label, { color: colors.text }]}>
          Valor (R$)
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              backgroundColor: colors.card,
              borderColor: errors.amount ? colors.danger : colors.border,
            },
          ]}
          placeholder="0,00"
          placeholderTextColor={colors.secondary}
          value={form.amount}
          keyboardType="decimal-pad"
          onChangeText={(value) => {
            const normalized = value.replace(',', '.');

            if (/^\d*\.?\d{0,2}$/.test(normalized)) {
              handleChange('amount', normalized);
            }
          }}
        />

        {renderError('amount')}

        <Text style={[styles.label, { color: colors.text }]}>
          Data
        </Text>

        <Pressable
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: errors.date ? colors.danger : colors.border,
            },
          ]}
          onPress={() => setDatePickerVisible(true)}
        >
          <Text style={{ color: colors.text }}>{form.date}</Text>
        </Pressable>

        {renderError('date')}

        {datePickerVisible && (
          <DateTimePicker
            value={new Date(`${form.date}T12:00:00`)}
            mode="date"
            maximumDate={new Date()}
            onChange={(event, selectedDate) => {
              if (Platform.OS !== 'ios') {
                setDatePickerVisible(false);
              }

              if (selectedDate) {
                handleChange('date', toDateString(selectedDate));
              }
            }}
          />
        )}

        {Platform.OS === 'ios' && datePickerVisible && (
          <Pressable
            style={styles.cancelButton}
            onPress={() => setDatePickerVisible(false)}
          >
            <Text style={{ color: colors.primary }}>Concluir seleção da data</Text>
          </Pressable>
        )}

        <Text style={[styles.label, { color: colors.text }]}>
          Categoria
        </Text>

        <Pressable
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: errors.category ? colors.danger : colors.border,
            },
          ]}
          onPress={() => setCategoryModalVisible(true)}
        >
          <Text style={{ color: colors.text }}>
            {form.category || 'Selecione uma categoria'}
          </Text>
        </Pressable>

        {renderError('category')}

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>
            {isEditing ? 'Salvar alterações' : 'Salvar despesa'}
          </Text>
        </Pressable>

        {isEditing && (
          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.buttonText}>Excluir despesa</Text>
          </Pressable>
        )}
      </ScrollView>

      <Modal
        visible={categoryModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.card },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Escolha uma categoria
            </Text>

            {CATEGORIES.map((category) => (
              <Pressable
                key={category}
                style={[
                  styles.categoryOption,
                  { borderBottomColor: colors.border },
                ]}
                onPress={() => {
                  handleChange('category', category);
                  setCategoryModalVisible(false);
                }}
              >
                <Text style={[styles.categoryText, { color: colors.text }]}>
                  {category}
                </Text>
              </Pressable>
            ))}

            <Pressable
              style={styles.cancelButton}
              onPress={() => setCategoryModalVisible(false)}
            >
              <Text style={{ color: colors.primary }}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  error: {
    color: '#D32F2F',
    marginTop: 4,
    fontSize: 13,
  },
  saveButton: {
    backgroundColor: '#4B7BEC',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  categoryOption: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  categoryText: {
    fontSize: 16,
  },
  cancelButton: {
    alignItems: 'center',
    padding: 12,
    marginTop: 8,
  },
});
