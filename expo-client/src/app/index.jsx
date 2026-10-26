import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { useSession } from '../../App';
import { login } from '../api';
import { setCredential } from '../nfc';
import { Brand, Button, Screen, styles } from '../ui';

export default function Login() {
  const { user, setUser } = useSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (user) return <Redirect href="/credential" />;

  async function signIn() {
    if (busy) return;
    if (!username.trim() || !password) {
      setError('Escribe tu usuario y contraseña.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const data = await login(username, password);
      setCredential(data.id);
      setPassword('');
      setUser(data);
      router.replace('/credential');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen>
        <Brand />
        <Text style={styles.eyebrow}>IDENTIFICACIÓN DIGITAL · NFC</Text>
        <Text style={styles.title}>Tu acceso{ '\n' }empieza aquí.</Text>
        <Text style={styles.subtitle}>Inicia sesión para consultar tu credencial y utilizar tu teléfono como identificación NFC.</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#EDF3FF', borderColor: '#CBDCFF', borderWidth: 1, borderRadius: 16, padding: 14 }}>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#2864F0', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#FFFFFF', fontSize: 19, fontWeight: '800' }}>)))</Text>
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={{ color: '#101D65', fontSize: 14, fontWeight: '800' }}>Credencial digital NFC</Text>
            <Text style={{ color: '#526182', fontSize: 12, lineHeight: 17 }}>Tu cuenta vincula tu identidad con el sistema de acceso físico.</Text>
          </View>
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>Usuario</Text>
          <TextInput accessibilityLabel="Usuario" value={username} onChangeText={setUsername}
            autoCapitalize="none" autoCorrect={false} autoComplete="username" editable={!busy}
            placeholder="Tu nombre de usuario" placeholderTextColor="#7a8390" style={styles.input} />
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.passwordRow}>
            <TextInput accessibilityLabel="Contraseña" value={password} onChangeText={setPassword}
              secureTextEntry={!visible} autoComplete="current-password" editable={!busy}
              placeholder="Tu contraseña" placeholderTextColor="#7a8390" style={[styles.input, styles.password]}
              onSubmitEditing={signIn} returnKeyType="go" />
            <Pressable accessibilityRole="button" accessibilityLabel={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              onPress={() => setVisible(!visible)}>
              <Text style={styles.textLink}>{visible ? 'Ocultar' : 'Ver'}</Text>
            </Pressable>
          </View>
          {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
          <Button title={busy ? 'Conectando…' : 'Iniciar sesión  →'} onPress={signIn} disabled={busy} />
        </View>
        <Text style={styles.note}>¿Olvidaste tus datos? Solicítalos al profesor.</Text>
        <View style={styles.footer}>
          <Button title="Créditos" onPress={() => router.push('/credits')} secondary disabled={busy} />
          <Text style={styles.note}>Acceso NFC · Aplicaciones Móviles · 2026</Text>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
