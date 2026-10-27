
import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';

import theme from '../../constants/theme';

export default function DespesaItem({
  despesa,
  onPress,
  darkMode = false,
}) {
  const colors = darkMode ? theme.dark : theme.light;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.info}>
        <Text style={[styles.description, { color: colors.text }]}>
          {despesa.description}
        </Text>

        <Text style={[styles.details, { color: colors.secondary }]}>
          {despesa.category} · {despesa.date}
        </Text>
      </View>

      <Text style={[styles.amount, { color: colors.primary }]}>
        R$ {Number(despesa.amount).toFixed(2).replace('.', ',')}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 13,
    marginTop: 5,
  },
  amount: {
    fontWeight: 'bold',
  },
});
