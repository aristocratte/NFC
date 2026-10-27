# Voz · Estrategia — Acceso NFC

Application React Native / Expo de l’équipe **GIGN**, pour un **Callcenter de Estrategias Políticas**. Trois écrans en espagnol : connexion, crédentiel et crédits. Les dossiers d’origine `../app`, `../server` et `../firmware` sont conservés.

## Installer sur le téléphone du groupe

L’APK Android est fourni à la racine du projet : `../Voz-Estrategia.apk`. Le transférer au téléphone, autoriser l’installation depuis l’application utilisée pour ouvrir le fichier, puis l’installer. C’est un APK de démonstration signé avec la clé de développement, destiné à la pratique.

Il faut Android 7 ou plus, un processeur ARM, le NFC et l’émulation de carte HCE. Activer NFC, ouvrir l’app, se connecter avec son propre compte MonsterBallGo, puis présenter le téléphone déverrouillé au lecteur du professeur. Une connexion Internet est nécessaire pour le login. **Expo Go et le navigateur ne permettent pas de tester ce service NFC.**

Le lecteur doit sélectionner l’AID `F012345678`. Le service répond avec le numéro utilisateur sur **4 octets little endian**, puis `90 00`. Cet ordre correspond au `memcpy` vers un `uint32_t` utilisé par le firmware `ScannerHTTP` du professeur sur ESP32. Une vibration et « Lector detectado » signalent l’échange. Le lecteur et le serveur décident de l’accès ; l’app n’appelle pas l’endpoint du scanner et n’affiche aucune autorisation ou refus. Fermer la session avant de changer de compte. Après arrêt du processus, il faut se reconnecter.

Si l’application Android d’origine est également installée, les deux déclarent le même AID : choisir Voz · Estrategia si Android demande quel service utiliser.

## Lancer ou modifier le projet

Depuis `expo-client` :

```sh
npm ci
npm run web
```

Pour compiler et installer sur un Android connecté en USB, avec le débogage USB activé, un JDK compatible et le SDK Android configuré :

```sh
npm run build:android
```

Expo génère `android/`, distinct de `../app`. Pour construire uniquement le fichier APK :

```sh
npx expo prebuild --platform android
cd android
./gradlew :app:assembleRelease -PreactNativeArchitectures=arm64-v8a,armeabi-v7a
```

Résultat : `android/app/build/outputs/apk/release/app-release.apk` depuis `expo-client`. Sous Windows, utiliser `gradlew.bat`. Après une modification du module Kotlin, recompiler et réinstaller l’APK.

## Code

- `App.js` : utilisateur connecté en mémoire.
- `src/app/` : trois écrans et navigation Expo Router.
- `src/ui.jsx` : styles et composants partagés.
- `src/api.js` : connexion à l’API du professeur.
- `src/nfc.js` : raccord JavaScript vers Android.
- `modules/acceso-nfc/` : module Expo local, service HCE et conversion APDU.

Le login utilise `POST https://monsterballgo.com/api/login.php` avec `FormData` : `token=code37` (valeur publique de l’exemple du professeur), `user` et `pass` en SHA-256 hexadécimal. Le contrat vient de [expo-login-registro](https://github.com/fmg2099/expo-login-registro/blob/master/app/index.tsx). La réponse fournit `id`, `username`, `first_name`, `last_name` et `pfp_url`. Le numéro doit être compris entre 1 et 4294967295. Le mot de passe n’est pas sauvegardé.

## Vérification et remise

```sh
npm run lint
npm run typecheck
npx expo-doctor
```

La compilation Android release a réussi pour `arm64-v8a` et `armeabi-v7a`. La signature APK v2, le service HCE et l’AID embarqué ont été vérifiés dans le paquet. ESLint, TypeScript et les 20 contrôles Expo Doctor passent.

Les profils publics et les images des trois membres répondent en HTTP 200. Des appels directs à l’API du scanner depuis l’ordinateur ont obtenu `si` pour les trois IDs ; le vrai panel a affiché leurs noms et numéros en vert. Ces appels ont été faits pendant la vérification, pas par l’application mobile, et ne sont pas des scans NFC.

La vérification du navigateur couvre 20 cas : formulaire, rejet réel d’un compte fictif, erreurs simulées, trois crédentielles préparées avec leurs profils publics, navigation, déconnexion et six logos. La classe Kotlin compilée a passé 20 vérifications avec des fonctions Android remplacées pour l’exécution sur ordinateur. Le code du serveur et celui du panel ont aussi été vérifiés avec des données simulées. Les comptes réels n’ont pas été authentifiés, car leurs mots de passe n’étaient pas disponibles. L’installation sur téléphone, la radio NFC et la vibration physique restent à vérifier.

Sur le téléphone du groupe, vérifier successivement les trois comptes (`aristidecordonnier`, `mathisgil`, `oscarbuat`), dont celui bloqué par le professeur. Conserver la capture du panel web et une photo du montage avec le LED correspondant. Le rapport modifiable et le PDF sont dans `../reporte/` : y ajouter les résultats physiques et les preuves, puis relire les conclusions avec les mots de l’équipe. Le numéro de groupe exact reste à confirmer dans les crédits. Dépôt du groupe : [aristocratte/NFC](https://github.com/aristocratte/NFC).

Logos React et Expo repris de la tâche précédente ; Android, Kotlin, Arduino et Node.js proviennent de [Devicon](https://github.com/devicons/devicon). Les marques appartiennent à leurs propriétaires.
