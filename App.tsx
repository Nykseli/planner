import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from '@/hooks/useCachedResources';
import useColorScheme from '@/hooks/useColorScheme';
import Navigation from '@/navigation';
import UserAlert from '@/components/UserAlert';
import { store } from '@/data/redux/store'

const App = () => {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider store={store}>
        <SafeAreaProvider>
          <UserAlert>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </UserAlert>
        </SafeAreaProvider>
      </Provider>
    );
  }
}

export default App;
