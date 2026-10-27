import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Screen({ children }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function Brand() {
  return (
    <View style={styles.brand}>
      <View style={styles.logo} accessibilityElementsHidden>
        <Text style={styles.logoText}>NFC</Text>
      </View>
      <View>
        <Text style={styles.brandName}>Voz · Estrategia</Text>
      </View>
    </View>
  );
}

export function Button({ title, onPress, secondary = false, disabled = false }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled}
      onPress={onPress} style={({ pressed }) => [styles.button, secondary && styles.secondary,
        (pressed || disabled) && styles.dim]}>
      <Text style={[styles.buttonText, secondary && styles.secondaryText]}>{title}</Text>
    </Pressable>
  );
}

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#ffffff' },
  page: { width: '100%', maxWidth: 460, alignSelf: 'center', paddingHorizontal: 22, paddingTop: 18, paddingBottom: 28, gap: 20, flexGrow: 1 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  logo: { backgroundColor: '#17286f', width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  logoText: { color: '#fff', fontSize: 14, letterSpacing: 0.5, fontWeight: '900' },
  brandName: { color: '#101d65', fontSize: 23, fontWeight: '800' },
  small: { color: '#677180', fontSize: 10, letterSpacing: 1, marginTop: 4 },
  eyebrow: { color: '#2864f0', fontSize: 12, fontWeight: '800', letterSpacing: 1.5 },
  title: { color: '#101d65', fontSize: 36, fontWeight: '800', lineHeight: 41 },
  subtitle: { color: '#526182', fontSize: 15, lineHeight: 23 },
  form: { gap: 12, marginTop: 8 },
  label: { fontSize: 14, fontWeight: '700', color: '#17234f' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d9e1f0', borderRadius: 14, padding: 16, fontSize: 16, color: '#17234f' },
  passwordRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  password: { flex: 1 },
  textLink: { color: '#2864f0', fontWeight: '700', fontSize: 14, paddingVertical: 14 },
  button: { minHeight: 52, backgroundColor: '#2864f0', borderRadius: 16, padding: 15, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '700', textAlign: 'center' },
  secondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#cbd7ef' },
  secondaryText: { color: '#17286f' },
  dim: { opacity: 0.5 },
  note: { color: '#677180', fontSize: 12, lineHeight: 19 },
  error: { color: '#a02e2e', fontSize: 14, lineHeight: 21 },
  card: { backgroundColor: '#17286f', borderRadius: 26, padding: 24, gap: 22, shadowColor: '#17286f', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.14, shadowRadius: 18, elevation: 4 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  cardLabel: { color: '#c4cbd5', fontSize: 10, letterSpacing: 2, fontWeight: '600' },
  cardName: { color: '#fff', fontSize: 27, fontWeight: '800', lineHeight: 34 },
  cardId: { color: '#fff', fontSize: 30, fontWeight: '300', letterSpacing: 2, marginTop: 6 },
  avatar: { width: 76, height: 76, borderRadius: 24, backgroundColor: '#3b4b60', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 27, fontWeight: '600' },
  tag: { backgroundColor: '#efe2cb', color: '#58401a', fontSize: 11, fontWeight: '700', borderRadius: 8, overflow: 'hidden', padding: 8 },
  divider: { borderTopWidth: 1, borderTopColor: '#485568', paddingTop: 16 },
  whiteNote: { color: '#d2d8e0', fontSize: 12, lineHeight: 19 },
  panel: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0e8f7', padding: 20, borderRadius: 20, gap: 10, shadowColor: '#18316d', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.06, shadowRadius: 14, elevation: 2 },
  heading: { color: '#101d65', fontSize: 19, fontWeight: '800' },
  footer: { marginTop: 'auto', paddingTop: 12, gap: 10 },
  creditName: { color: '#17234f', fontSize: 17, fontWeight: '600', paddingVertical: 8 },
  techRow: { flexDirection: 'row', gap: 14, alignItems: 'center', paddingVertical: 8 },
  techLogo: { width: 32, height: 32, resizeMode: 'contain' },
});
