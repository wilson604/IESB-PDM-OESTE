import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configuração de como a notificação será exibida
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Solicitar permissão para notificações
export async function requestNotificationPermission() {
  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } =
      await Notifications.requestPermissionsAsync();

    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return false;
  }

  // Configurar canal de notificações no Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Lembretes',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return true;
}

// Agendar lembrete
export async function scheduleReminder(title, seconds = 10) {
  const hasPermission = await requestNotificationPermission();

  if (!hasPermission) {
    return null;
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: title || 'Lembrete CampusGo',
      body: 'Está na hora de conferir suas tarefas!',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      channelId: 'default',
    },
  });

  return notificationId;
}