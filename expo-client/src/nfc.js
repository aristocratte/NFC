import { requireOptionalNativeModule } from 'expo';
import { Platform } from 'react-native';

// Ausente en Expo Go, web e iOS. La interfaz sigue disponible para probarla.
const nfc = Platform.OS === 'android' ? requireOptionalNativeModule('AccesoNfc') : null;

export function setCredential(id) {
  nfc?.setCredential(id);
}

export function clearCredential() {
  nfc?.clearCredential();
}

export function getNfcStatus() {
  if (!nfc) return 'El NFC real requiere la compilación Android de esta app; no funciona en Expo Go ni en el navegador.';
  if (!nfc.isSupported()) return 'Este dispositivo no admite NFC con emulación de tarjeta (HCE).';
  if (!nfc.isEnabled()) return 'Activa NFC en los ajustes de tu teléfono.';
  return 'Acerca tu teléfono desbloqueado al lector NFC.';
}

export function onScannerDetected(callback) {
  return nfc?.addListener('onScannerDetected', callback);
}
