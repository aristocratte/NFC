import * as Crypto from 'expo-crypto';

export const API_URL = 'https://monsterballgo.com/api/login.php';

// Mismo contrato que el ejemplo expo-login-registro del profesor.
export async function login(username, password) {
  const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
  const form = new FormData();
  form.append('token', 'code37');
  form.append('user', username.trim());
  form.append('pass', digest);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(API_URL, { method: 'POST', body: form, signal: controller.signal });
    if (!response.ok) throw new Error('El servidor no está disponible. Intenta de nuevo.');
    const data = await response.json();
    if (data.error) throw new Error('Usuario o contraseña incorrectos.');
    const id = Number(data.id);
    if (!Number.isInteger(id) || id < 1 || id > 0xffffffff) {
      throw new Error('La API no devolvió un número de usuario válido.');
    }
    return {
      id,
      username: data.username,
      first_name: data.firstname ?? data.first_name ?? '',
      last_name: data.lastname ?? data.last_name ?? '',
      pfp_url: data.pfp_url,
    };
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('La conexión tardó demasiado. Intenta de nuevo.');
    if (error instanceof TypeError) throw new Error('No se pudo conectar. Revisa tu conexión a Internet.');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
