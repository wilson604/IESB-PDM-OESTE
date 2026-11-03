import { useState, useCallback } from 'react';

import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Alert,
  Linking,
  ScrollView,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

import { pickImage, takePhoto } from '../../services/media';

const PHOTO_KEY = '@profile-photo';

export default function ProfileScreen() {
  const [photo, setPhoto] = useState(null);

  // Carregar foto sempre que a tela abrir
  useFocusEffect(
    useCallback(() => {
      async function loadPhoto() {
        try {
          const savedPhoto = await AsyncStorage.getItem(PHOTO_KEY);
          setPhoto(savedPhoto);
        } catch (error) {
          console.log('Erro ao carregar foto:', error);
        }
      }

      loadPhoto();
    }, [])
  );

  // Salvar foto escolhida
  async function savePhoto(uri) {
    if (!uri) return;

    try {
      await AsyncStorage.setItem(PHOTO_KEY, uri);
      setPhoto(uri);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a foto.');
    }
  }

  // Selecionar foto da galeria
  async function handleGallery() {
    const uri = await pickImage();

    if (!uri) {
      Alert.alert(
        'Permissão necessária',
        'É necessário permitir o acesso à galeria para escolher uma foto.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Abrir ajustes',
            onPress: () => Linking.openSettings(),
          },
        ]
      );
      return;
    }

    await savePhoto(uri);
  }

  // Tirar foto com a câmera
  async function handleCamera() {
    const uri = await takePhoto();

    if (!uri) {
      Alert.alert(
        'Permissão necessária',
        'É necessário permitir o acesso à câmera para tirar uma foto.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Abrir ajustes',
            onPress: () => Linking.openSettings(),
          },
        ]
      );
      return;
    }

    await savePhoto(uri);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Meu perfil</Text>

      {photo ? (
        <Image source={{ uri: photo }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.placeholderText}>Sem foto</Text>
        </View>
      )}

      <Text style={styles.subtitle}>Foto de perfil</Text>

      <Pressable style={styles.button} onPress={handleGallery}>
        <Text style={styles.buttonText}>Escolher da galeria</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={handleCamera}>
        <Text style={styles.buttonText}>Tirar uma foto</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F5F7FA',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 25,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#DCE6F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderText: {
    color: '#1E3A8A',
    fontSize: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 15,
    borderRadius: 8,
    width: 230,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});