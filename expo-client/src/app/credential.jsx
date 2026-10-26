import { useEffect, useState } from 'react';
import { AppState, Image, Pressable, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { useSession } from '../../App';
import { clearCredential, getNfcStatus, onScannerDetected } from '../nfc';
import { Brand, Button, Screen, styles } from '../ui';

export default function Credential() {
  const { user, setUser } = useSession();
  const [status, setStatus] = useState(getNfcStatus);
  const [detected, setDetected] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);

  useEffect(() => {
    const scanner = onScannerDetected(() => setDetected(true));
    const app = AppState.addEventListener('change', (state) => {
      if (state === 'active') setStatus(getNfcStatus());
    });
    return () => { scanner?.remove(); app.remove(); };
  }, []);

  if (!user) return <Redirect href="/" />;
  const name = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username;
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('');
  const photo = typeof user.pfp_url === 'string' ? user.pfp_url.replace(/^http:\/\//, 'https://') : '';

  function signOut() {
    clearCredential();
    setUser(null);
    router.replace('/');
  }

  return (
    <Screen>
      <Brand />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <Text style={{ color: '#526182', fontSize: 13 }}>Sistema de acceso físico</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: '#e8f9f1', borderRadius: 20, paddingVertical: 9, paddingHorizontal: 12 }}>
          <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: '#16b981' }} />
          <Text style={{ color: '#146c50', fontSize: 11, fontWeight: '700' }}>NFC</Text>
        </View>
      </View>
      <View style={{ gap: 5, marginTop: 8 }}>
        <Text style={styles.title}>Hola, {user.first_name || user.username}.</Text>
        <Text style={styles.subtitle}>Bienvenido al sistema de acceso físico.</Text>
      </View>
      <View style={[styles.card, { padding: 0, backgroundColor: '#fff', overflow: 'hidden', gap: 0, borderRadius: 22, borderWidth: 1, borderColor: '#e0e8f7', elevation: 3 }]}>
        <View style={{ backgroundColor: '#17286f', paddingHorizontal: 20, paddingVertical: 19, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: 0.5 }}>MI CREDENCIAL</Text>
          <Text style={{ color: '#78aaff', fontSize: 30, fontWeight: '800' }}>)))</Text>
        </View>
        <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center', gap: 15, backgroundColor: '#fff' }}>
          {photo && !photoFailed ?
            <Image accessibilityLabel="Foto de perfil" source={{ uri: photo }} style={[styles.avatar, { width: 82, height: 82, borderRadius: 41 }]} onError={() => setPhotoFailed(true)} /> :
            <View style={[styles.avatar, { width: 82, height: 82, borderRadius: 41, backgroundColor: '#dce8ff' }]}><Text style={[styles.avatarText, { color: '#17286f' }]}>{initials}</Text></View>}
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={{ color: '#101d65', fontSize: 21, fontWeight: '800' }}>{name}</Text>
            <Text style={{ color: '#526182', fontSize: 13 }}>Usuario registrado</Text>
            <Text style={{ color: '#647397', fontSize: 15 }}>ID · {String(user.id).padStart(8, '0')}</Text>
          </View>
        </View>
      </View>
      <View style={{ alignItems: 'center', gap: 13, paddingVertical: 5 }}>
        <View style={{ width: 164, height: 164, borderRadius: 82, backgroundColor: '#e9f0ff', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 128, height: 128, borderRadius: 64, backgroundColor: '#2864f0', alignItems: 'center', justifyContent: 'center' }}>
            <Text accessibilityLabel="Símbolo de comunicación NFC" style={{ color: '#fff', fontSize: 43, fontWeight: '800' }}>)))</Text>
          </View>
        </View>
        <Text style={{ color: '#101d65', fontSize: 22, fontWeight: '800', textAlign: 'center' }}>
          {detected ? 'Lector detectado' : 'Acerca tu celular al lector'}
        </Text>
      </View>
      <View style={{ backgroundColor: '#edf4ff', borderWidth: 1, borderColor: '#cbdcff', borderRadius: 17, padding: 17, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Text style={{ fontSize: 32, color: '#17286f' }}>⌁</Text>
        <View style={{ flex: 1, gap: 5 }}>
          <Text style={{ color: '#101d65', fontSize: 16, fontWeight: '800' }}>Estado del lector</Text>
          <Text accessibilityLiveRegion="polite" style={{ color: detected ? '#16835b' : '#2864f0', fontSize: 13, lineHeight: 19 }}>
            {detected ? 'Comunicación iniciada. Consulta el resultado en el sistema físico.' : status}
          </Text>
        </View>
      </View>
      <View style={{ backgroundColor: '#f0f3f9', borderRadius: 15, padding: 15, flexDirection: 'row', gap: 10 }}>
        <Text style={{ color: '#526182', fontWeight: '900', fontSize: 18 }}>i</Text>
        <Text style={[styles.note, { flex: 1 }]}>La autorización se verifica en el sistema de acceso físico.</Text>
      </View>
      <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#e0e6f1', paddingTop: 15 }}>
        {[
          { icon: '⌂', label: 'Inicio', action: () => router.replace('/credential') },
          { icon: '▤', label: 'Credencial', action: () => router.replace('/credential') },
          { icon: 'ⓘ', label: 'Acerca de', action: () => router.push('/credits') },
        ].map((tab, index) => (
          <Pressable key={tab.label} accessibilityRole="button" onPress={tab.action} style={{ flex: 1, alignItems: 'center', gap: 5, paddingVertical: 5 }}>
            <Text style={{ fontSize: 26, color: index === 0 ? '#2864f0' : '#526182', fontWeight: '700' }}>{tab.icon}</Text>
            <Text style={{ fontSize: 11, color: index === 0 ? '#2864f0' : '#526182', fontWeight: index === 0 ? '800' : '600' }}>{tab.label}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.footer}>
        <Button title="Cerrar sesión" onPress={signOut} secondary />
      </View>
    </Screen>
  );
}
