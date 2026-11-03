import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

const ExpensesContext = createContext({
  expenses: [],
  addExpense: () => {},
  deleteExpense: () => {},
});

function expensesReducer(state, action) {
  switch (action.type) {
    case 'SET':
      return action.payload;

    case 'ADD':
      return [action.payload, ...state];

    case 'DELETE':
      return state.filter(
        (expense) => expense.id !== action.payload
      );

    default:
      return state;
  }
}

export function ExpensesContextProvider({ children }) {
  const [expensesState, dispatch] = useReducer(expensesReducer, []);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadExpenses() {
      try {
        const storedExpenses = await AsyncStorage.getItem('@campusgo-expenses');

        if (storedExpenses) {
          dispatch({
            type: 'SET',
            payload: JSON.parse(storedExpenses),
          });
        }
      } catch (error) {
        console.log('Erro ao carregar despesas:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadExpenses();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(
        '@campusgo-expenses',
        JSON.stringify(expensesState)
      ).catch((error) => {
        console.log('Erro ao salvar despesas:', error);
      });
    }
  }, [expensesState, isLoading]);

  function addExpense(expenseData) {
    dispatch({
      type: 'ADD',
      payload: {
        ...expenseData,
        id: Date.now().toString(),
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
    expenses: expensesState,
    addExpense,
    deleteExpense,
  };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses() {
  return useContext(ExpensesContext);
}