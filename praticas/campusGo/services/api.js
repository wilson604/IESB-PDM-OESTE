
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function get(endpoint) {
  if (!API_URL) {
    throw new Error('A URL da API não foi configurada no arquivo .env');
  }

  const response = await fetch(`${API_URL}/${endpoint}`);

  if (!response.ok) {
    throw new Error('Não foi possível carregar os dados.');
  }

  return response.json();
}

export async function create(endpoint, data) {
  if (!API_URL) {
    throw new Error('A URL da API não foi configurada no arquivo .env');
  }

  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Não foi possível enviar os dados.');
  }

  return response.json();
}
