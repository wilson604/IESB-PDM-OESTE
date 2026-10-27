
import { TemaProvider } from './src/store/tema-context';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { ExpensesContextProvider } from './src/store/expenses-context';
import TodasDespesas from './src/screens/TodasDespesas';
import DespesasRecentes from './src/screens/DespesasRecentes';
import GerenciarDespesa from './src/screens/GerenciarDespesa';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function DespesasOverview() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#4B7BEC',
        tabBarInactiveTintColor: '#888888',
        tabBarIcon: ({ color, size }) => {
          const iconName =
            route.name === 'Recentes'
              ? 'calendar-outline'
              : 'list-outline';

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Recentes"
        component={DespesasRecentes}
        options={{ title: 'Recentes' }}
      />

      <Tab.Screen
        name="Todas"
        component={TodasDespesas}
        options={{ title: 'Todas as despesas' }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DespesasOverview"
        component={DespesasOverview}
        options={{
          title: 'Gerenciador de Despesas',
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="GerenciarDespesa"
        component={GerenciarDespesa}
        options={{
          title: 'Nova despesa',
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <TemaProvider>
      <ExpensesContextProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <RootNavigator />
        </NavigationContainer>
      </ExpensesContextProvider>
    </TemaProvider>
  );
}
