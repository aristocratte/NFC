package expo.modules.accesonfc

import android.content.Context
import android.nfc.cardemulation.HostApduService
import android.os.Bundle
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator

// Adaptado de app/.../MainActivity.kt del repositorio original.
// ScannerHTTP copia los bytes a un uint32_t del ESP32 (little endian).
// SELECT AID F012345678 -> ID de 4 bytes, seguido de 90 00.
class AccesoApduService : HostApduService() {
  private val selectAid = byteArrayOf(0x00, 0xA4.toByte(), 0x04, 0x00, 0x05,
    0xF0.toByte(), 0x12, 0x34, 0x56, 0x78)

  override fun processCommandApdu(commandApdu: ByteArray?, extras: Bundle?): ByteArray {
    if (commandApdu == null) return byteArrayOf(0x6F, 0x00)
    val validLength = commandApdu.size == selectAid.size ||
      (commandApdu.size == selectAid.size + 1 && commandApdu.last() == 0.toByte())
    if (!validLength || !commandApdu.take(selectAid.size).toByteArray().contentEquals(selectAid)) {
      return byteArrayOf(0x6A, 0x82.toByte())
    }
    val id = getSharedPreferences("CREDENCIAL_ID", Context.MODE_PRIVATE).getLong("ID", 0)
    if (!ScannerEvents.sessionActive || id < 1) return byteArrayOf(0x69, 0x85.toByte())
    val vibrator = getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
    if (Build.VERSION.SDK_INT >= 26) {
      vibrator?.vibrate(VibrationEffect.createOneShot(100, VibrationEffect.DEFAULT_AMPLITUDE))
    } else {
      @Suppress("DEPRECATION")
      vibrator?.vibrate(100)
    }
    ScannerEvents.onDetected?.invoke()
    return byteArrayOf(id.toByte(), (id shr 8).toByte(),
      (id shr 16).toByte(), (id shr 24).toByte(), 0x90.toByte(), 0x00)
  }

  override fun onDeactivated(reason: Int) = Unit
}
