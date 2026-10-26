import { Image, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Brand, Button, Screen, styles } from '../ui';
import reactLogo from '../../assets/react-logo.png';
import expoLogo from '../../assets/expo-logo.png';
import androidLogo from '../../assets/android-logo.png';
import kotlinLogo from '../../assets/kotlin-logo.png';
import arduinoLogo from '../../assets/arduino-logo.png';
import nodeLogo from '../../assets/nodejs-logo.png';

// Datos del equipo de la práctica anterior. Confirmar antes de la entrega.
const members = ['Aristide Cordonnier', 'Mathis Gil', 'Oscar Buat'];
const technologies = [
  { name: 'React Native', use: 'Interfaz móvil', logo: reactLogo },
  { name: 'Expo', use: 'Desarrollo y compilación', logo: expoLogo },
  { name: 'Android', use: 'Emulación de tarjeta NFC', logo: androidLogo },
  { name: 'Kotlin', use: 'Servicio APDU', logo: kotlinLogo },
  { name: 'Arduino', use: 'Lector físico', logo: arduinoLogo },
  { name: 'Node.js', use: 'Servidor de referencia', logo: nodeLogo },
];

export default function Credits() {
  return (
    <Screen>
      <Brand />
      <Text style={styles.eyebrow}>PROYECTO ACADÉMICO</Text>
      <Text style={styles.title}>Acceso físico inteligente.</Text>
      <Text style={styles.subtitle}>Sistema de acceso con Arduino, NFC y Android.</Text>
      <View style={styles.panel}>
        <Text style={styles.heading}>Equipo GIGN</Text>
        {members.map((name) => <Text key={name} style={styles.creditName}>{name}</Text>)}
        <Text style={styles.note}>Aplicaciones Móviles · 900CIB{ '\n' }Octubre de 2026</Text>
      </View>
      <View style={styles.panel}>
        <Text style={styles.heading}>Tecnologías</Text>
        {technologies.map((technology) => (
          <View key={technology.name} style={styles.techRow}>
            <Image source={technology.logo} accessibilityLabel={`Logotipo de ${technology.name}`}
              style={[styles.techLogo, technology.name === 'Expo' && { backgroundColor: '#202e41', borderRadius: 6 }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{technology.name}</Text>
              <Text style={styles.note}>{technology.use}</Text>
            </View>
          </View>
        ))}
        <Text style={styles.note}>API MonsterBallGo · Inicio de sesión</Text>
      </View>
      <Text style={styles.note}>Proyecto dirigido por el Mtro. Felipe Mandujano. La aplicación móvil se integra con el sistema de acceso físico y la tecnología NFC.</Text>
      <View style={styles.footer}>
        <Button title="← Volver" onPress={() => router.canGoBack() ? router.back() : router.replace('/')} secondary />
      </View>
    </Screen>
  );
}
