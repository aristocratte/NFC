import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import App from '../../App';

export default function Layout() {
  return (
    <App>
      <StatusBar style="dark" />
      <Stack id={undefined} screenOptions={{ headerShown: false }} />
    </App>
  );
}
