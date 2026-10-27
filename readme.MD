# Voz · Estrategia — GIGN

App de acceso NFC para un callcenter de estrategias políticas, hecha con React Native y Expo.

Equipo: Aristide Cordonnier, Mathis Gil y Oscar Buat.

- [APK para Android](Voz-Estrategia.apk)
- [Código e instrucciones de la app](expo-client/README.md)
- [Reporte PDF](reporte/Reporte_Practica4_GIGN.pdf)
- [Reporte Word](reporte/Reporte_Practica4_GIGN.docx)

Instalar el APK, activar NFC e iniciar sesión con la cuenta de MonsterBallGo. Acercar el teléfono desbloqueado al lector. La app envía el ID; el lector y el servidor deciden el acceso. El login real funcionó con las tres cuentas en el navegador. Sus autorizaciones se comprobaron con consultas directas a la API y al panel. La instalación en Android y la lectura NFC aún requieren una prueba.

El código original de Android, el servidor y el firmware se conservan a partir de [NFCAccesoFisico del profesor](https://github.com/fmg2099/NFCAccesoFisico).

## Proyecto original: Android NFC + Arduino + PN532

Este proyecto contiene una aplicación Android y un sketch de Arduino para demostrar el uso de Android HCE (Host Card Emulation) como sistema de identificación y acceso en un sistema físico. 

Mediante  el protocolo APDU establece una comunicación de bajo nivel para intercambiar un ID de 4 bytes representando a un usuario. 

## Hardware

* Arduino Nano ESP32
* Elechouse PN532 v3 en modo HSU (MUY importante)
* Dispositivo móvil Android mayor a API 24

## Bibliotecas

Utiliza una versión modificada específicamente para funcionar en Arduino Nano ESP32 de las bibliotecas de [Elechouse PN532](https://github.com/elechouse/PN532).

*pegar el link del repo conlas biblotecas modificadas*

## Referencias

Manual de usuario de la placa PN532

https://www.elechouse.com/elechouse/images/product/PN532_module_V3/PN532_%20Manual_V3.pdf

Tutorial para crear una aplicación APDU

https://medium.com/@androidcrypto/how-to-use-host-based-card-emulation-hce-in-android-a-beginner-tutorial-java-32974dd89529

Protocolo APDU

https://en.wikipedia.org/wiki/Smart_card_application_protocol_data_unit

Lista de Application Identifiers ISO14443A

https://www.eftlab.com/knowledge-base/complete-list-of-application-identifiers-aid

## Licencia

TBD
