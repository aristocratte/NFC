# Voz · Estrategia

Application React Native et Expo de l’équipe GIGN pour un callcenter de stratégies politiques. Connexion à l’API du professeur, crédentielle avec photo et numéro utilisateur, crédits et communication NFC Android.

## Installer sur Android

Télécharger [Voz-Estrategia.apk](./Voz-Estrategia.apk), installer le fichier puis ouvrir l’application. Il faut un téléphone Android 7 ou plus avec NFC et émulation de carte HCE. Activer NFC, se connecter avec son compte MonsterBallGo et présenter le téléphone déverrouillé au lecteur du professeur.

Le lecteur décide de l’accès. L’application signale seulement sa détection. L’APK fonctionne sans serveur Expo. Expo Go et le navigateur ne permettent pas l’échange NFC de cette application.

## Développer

```sh
cd expo-client
npm ci
npm run web
```

Pour compiler et installer sur un Android connecté en USB, avec un JDK et le SDK Android configurés :

```sh
npm run build:android
```

Pour compiler uniquement l’APK :

```sh
npx expo prebuild --platform android
cd android
./gradlew :app:assembleRelease -PreactNativeArchitectures=arm64-v8a,armeabi-v7a
```

Sous Windows, utiliser `gradlew.bat`. Le résultat se trouve dans `expo-client/android/app/build/outputs/apk/release/app-release.apk` depuis la racine du dépôt.

Le code des écrans est dans `expo-client/src/app/`. Le module NFC est dans `expo-client/modules/acceso-nfc/`. Il répond à l’AID `F012345678` avec le numéro utilisateur sur quatre octets little endian, suivis de `90 00`, comme l’attend le lecteur.

Équipe : Aristide Cordonnier, Mathis Gil et Oscar Buat.

La partie NFC est adaptée de l’[exemple du professeur](https://github.com/fmg2099/NFCAccesoFisico). Le serveur et le firmware de référence sont disponibles dans ce dépôt d’origine. Logos des technologies : [Devicon](https://github.com/devicons/devicon).
