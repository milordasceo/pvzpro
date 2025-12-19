import "./global.css";
import { StatusBar } from 'expo-status-bar';
import { HeroUINativeProvider } from 'heroui-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { logger } from './src/shared/lib/logger';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <HeroUINativeProvider>
          <NavigationContainer
            onStateChange={(state) => {
              const currentRouteName = state?.routes[state.index].name;
              logger.action('Navigation', 'Navigate', { to: currentRouteName });
            }}
          >
            <RootNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </HeroUINativeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
