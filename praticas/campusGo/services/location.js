
import * as Location from 'expo-location';

export async function getCurrentPlace() {
  try {
    // Solicitar permissão de localização
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      return null;
    }

    // Obter coordenadas atuais
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const { latitude, longitude } = location.coords;

    // Converter coordenadas em endereço
    const addresses = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (!addresses || addresses.length === 0) {
      return {
        label: `Coordenadas: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
        latitude,
        longitude,
      };
    }

    const address = addresses[0];

    // Montar endereço utilizando os campos disponíveis
    const street = [
      address.street,
      address.streetNumber,
    ]
      .filter(Boolean)
      .join(', ');

    const neighborhood =
      address.district || address.subregion;

    const city =
      address.city || address.subregion;

    const region = address.region;

    const label = [
      address.name && address.name !== street
        ? address.name
        : null,
      street,
      neighborhood,
      city,
      region,
    ]
      .filter(Boolean)
      .filter((value, index, array) => array.indexOf(value) === index)
      .join(', ');

    return {
      label: label || `Coordenadas: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
      latitude,
      longitude,
    };

  } catch (error) {
    console.log('Erro ao obter localização:', error);
    return null;
  }
}
