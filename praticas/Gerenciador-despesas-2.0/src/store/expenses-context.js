
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

const ExpensesContext = createContext(null);

const initialExpensesState = [];

function expensesReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [action.payload, ...state];

    case 'UPDATE':
      return state.map((expense) =>
        expense.id === action.payload.id
          ? action.payload
          : expense
      );

    case 'DELETE':
      return state.filter(
        (expense) => expense.id !== action.payload
      );

    case 'SET':
      return action.payload;

    default:
      return state;
  }
}

function ExpensesContextProvider({ children }) {
  const [expenses, dispatch] = useReducer(
    expensesReducer,
    initialExpensesState
  );

  const [isLoaded, setIsLoaded] = useState(false);

  // Carrega as despesas salvas ao iniciar o aplicativo.
  useEffect(() => {
    async function loadExpenses() {
      try {
        const storedExpenses = await AsyncStorage.getItem(
          '@expenses'
        );

        if (storedExpenses !== null) {
          const parsedExpenses = JSON.parse(storedExpenses);

          if (Array.isArray(parsedExpenses)) {
            dispatch({
              type: 'SET',
              payload: parsedExpenses,
            });
          }
        }
      } catch (error) {
        console.error('Erro ao carregar despesas:', error);
      } finally {
        setIsLoaded(true);
      }
    }

    loadExpenses();
  }, []);

  // Salva somente depois que o carregamento inicial terminar.
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    async function saveExpenses() {
      try {
        await AsyncStorage.setItem(
          '@expenses',
          JSON.stringify(expenses)
        );
      } catch (error) {
        console.error('Erro ao salvar despesas:', error);
      }
    }

    saveExpenses();
  }, [expenses, isLoaded]);

  function addExpense(expenseData) {
    dispatch({
      type: 'ADD',
      payload: {
        ...expenseData,
        id: expenseData.id ?? Date.now().toString(),
      },
    });
  }

  function updateExpense(id, expenseData) {
    dispatch({
      type: 'UPDATE',
      payload: {
        ...expenseData,
        id,
      },
    });
  }

  function deleteExpense(id) {
    dispatch({
      type: 'DELETE',
      payload: id,
    });
  }

  const value = {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    isLoaded,
  };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
}

function useExpenses() {
  const context = useContext(ExpensesContext);

  if (context === null) {
    throw new Error(
      'useExpenses deve ser usado dentro de ExpensesContextProvider.'
    );
  }

  return context;
}

export { ExpensesContextProvider, useExpenses };
