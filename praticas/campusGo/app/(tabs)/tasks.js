
import { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Link } from 'expo-router';

import { getCurrentPlace } from '../../services/location';
import { scheduleReminder } from '../../services/notifications';

export default function TasksScreen() {
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(false);

  // Registrar localização
  async function handleLocation() {
    try {
      setLoading(true);

      const currentPlace = await getCurrentPlace();

      if (!currentPlace) {
        Alert.alert(
          'Permissão necessária',
          'Permita o acesso à localização para registrar onde você estudou.'
        );
        return;
      }

      setPlace(currentPlace);
    } catch (error) {
      Alert.alert(
        'Erro de localização',
        'Não foi possível obter sua localização. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  }

  // Agendar lembrete em 10 segundos
  async function handleReminder() {
    try {
      const id = await scheduleReminder('Lembrete CampusGo', 10);

      if (!id) {
        Alert.alert(
          'Permissão necessária',
          'Ative as notificações para receber lembretes.'
        );
        return;
      }

      Alert.alert(
        'Lembrete agendado!',
        'Você receberá uma notificação em aproximadamente 10 segundos.'
      );
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível agendar o lembrete.'
      );
    }
  }

  // Concluir tarefa com retorno tátil
  async function handleComplete() {
    try {
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );
    } catch (error) {
      console.log('Vibração indisponível:', error);
    }

    Alert.alert(
      'Parabéns!',
      'Tarefa concluída com sucesso!'
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="school-outline" size={28} color="#2563EB" />
        </View>

        <Text style={styles.title}>Minhas tarefas</Text>

        <Text style={styles.description}>
          Organize seus estudos e acompanhe suas atividades acadêmicas.
        </Text>
      </View>

      {/* Painel de atividades */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Atividades acadêmicas</Text>

        <Link href="/new-task" asChild>
          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="add-circle-outline" size={27} color="#2563EB" />
            </View>

            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Nova tarefa</Text>
              <Text style={styles.actionDescription}>
                Acesse o formulário de nova tarefa.
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={22} color="#94A3B8" />
          </Pressable>
        </Link>

        <Link href="/task/42" asChild>
          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="clipboard-outline" size={27} color="#2563EB" />
            </View>

            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Consultar tarefa</Text>
              <Text style={styles.actionDescription}>
                Visualize os detalhes da tarefa número 42.
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={22} color="#94A3B8" />
          </Pressable>
        </Link>
      </View>

      {/* Recursos de estudo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recursos de estudo</Text>

        {/* Localização */}
        <View style={styles.featureCard}>
          <View style={styles.featureHeader}>
            <View style={styles.featureIcon}>
              <Ionicons name="location-outline" size={24} color="#2563EB" />
            </View>

            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>Check-in de estudo</Text>
              <Text style={styles.featureDescription}>
                Registre o local onde você está estudando.
              </Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressed,
              loading && styles.disabledButton,
            ]}
            onPress={handleLocation}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="navigate-outline" size={19} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Estudei aqui</Text>
              </>
            )}
          </Pressable>

          {place && (
            <View style={styles.placeCard}>
              <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
              <View style={styles.placeInfo}>
                <Text style={styles.placeTitle}>Local registrado</Text>
                <Text style={styles.placeText}>{place.label}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Notificação */}
        <View style={styles.featureCard}>
          <View style={styles.featureHeader}>
            <View style={styles.featureIcon}>
              <Ionicons name="notifications-outline" size={24} color="#2563EB" />
            </View>

            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>Lembrete de estudos</Text>
              <Text style={styles.featureDescription}>
                Receba uma notificação para lembrar de estudar.
              </Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.pressed,
            ]}
            onPress={handleReminder}
          >
            <Ionicons name="alarm-outline" size={19} color="#2563EB" />
            <Text style={styles.secondaryButtonText}>
              Lembrar em 10 segundos
            </Text>
          </Pressable>
        </View>

        {/* Conclusão */}
        <View style={styles.featureCard}>
          <View style={styles.featureHeader}>
            <View style={[styles.featureIcon, styles.successIcon]}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#16A34A" />
            </View>

            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>Finalizar atividade</Text>
              <Text style={styles.featureDescription}>
                Marque sua atividade como concluída.
              </Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.completeButton,
              pressed && styles.pressed,
            ]}
            onPress={handleComplete}
          >
            <Ionicons name="checkmark-done-outline" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Concluir atividade</Text>
          </Pressable>
        </View>
      </View>

      {/* Rodapé */}
      <View style={styles.footer}>
        <Ionicons name="book-outline" size={18} color="#64748B" />
        <Text style={styles.footerText}>
          Organize sua rotina. Evolua nos estudos.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FC',
  },

  content: {
    padding: 20,
    paddingBottom: 35,
  },

  header: {
    marginBottom: 25,
  },

  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: 7,
    lineHeight: 21,
  },

  section: {
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#173B80',
    marginBottom: 14,
  },

  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 13,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  actionInfo: {
    flex: 1,
  },

  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#173B80',
  },

  actionDescription: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 5,
    lineHeight: 18,
  },

  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 17,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  featureIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  successIcon: {
    backgroundColor: '#DCFCE7',
  },

  featureInfo: {
    flex: 1,
  },

  featureTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#173B80',
  },

  featureDescription: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 5,
    lineHeight: 18,
  },

  primaryButton: {
    backgroundColor: '#2563EB',
    padding: 14,
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  secondaryButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    padding: 14,
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  secondaryButtonText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: 'bold',
  },

  completeButton: {
    backgroundColor: '#16A34A',
    padding: 14,
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  disabledButton: {
    opacity: 0.7,
  },

  pressed: {
    opacity: 0.75,
  },

  placeCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 11,
    padding: 12,
    marginTop: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  placeInfo: {
    flex: 1,
  },

  placeTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#166534',
  },

  placeText: {
    fontSize: 12,
    color: '#166534',
    marginTop: 3,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 5,
    marginBottom: 10,
  },

  footerText: {
    color: '#64748B',
    fontSize: 12,
  },
});
