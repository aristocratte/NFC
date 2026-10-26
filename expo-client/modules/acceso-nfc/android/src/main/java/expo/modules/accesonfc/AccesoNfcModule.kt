package expo.modules.accesonfc

import android.content.Context
import android.content.pm.PackageManager
import android.nfc.NfcAdapter
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

// Mismo proceso Android que el servicio HCE; comunica únicamente la detección.
internal object ScannerEvents {
  @Volatile var onDetected: (() -> Unit)? = null
  @Volatile var sessionActive = false
}

class AccesoNfcModule : Module() {
  private val context get() = requireNotNull(appContext.reactContext)
  private val prefs get() = context.getSharedPreferences("CREDENCIAL_ID", Context.MODE_PRIVATE)

  override fun definition() = ModuleDefinition {
    Name("AccesoNfc")
    Events("onScannerDetected")

    OnCreate {
      // Una nueva sesión JavaScript siempre debe iniciar sesión otra vez.
      prefs.edit().clear().commit()
      ScannerEvents.sessionActive = false
      ScannerEvents.onDetected = { sendEvent("onScannerDetected", emptyMap<String, Any>()) }
    }
    OnDestroy {
      ScannerEvents.sessionActive = false
      ScannerEvents.onDetected = null
      appContext.reactContext?.getSharedPreferences("CREDENCIAL_ID", Context.MODE_PRIVATE)
        ?.edit()?.clear()?.commit()
    }
    Function("setCredential") { id: Double ->
      require(id.isFinite() && id >= 1 && id <= 4294967295.0 && id == id.toLong().toDouble())
      check(prefs.edit().putLong("ID", id.toLong()).commit())
      ScannerEvents.sessionActive = true
    }
    Function("clearCredential") {
      ScannerEvents.sessionActive = false
      check(prefs.edit().clear().commit())
    }
    Function("isSupported") {
      context.packageManager.hasSystemFeature(PackageManager.FEATURE_NFC_HOST_CARD_EMULATION)
        && NfcAdapter.getDefaultAdapter(context) != null
    }
    Function("isEnabled") {
      NfcAdapter.getDefaultAdapter(context)?.isEnabled == true
    }
  }
}
