import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from '@/hooks/useCachedResources';
import Navigation from '@/navigation';
import UserAlert from '@/components/UserAlert';
import { store } from '@/data/redux/store'
import { initNotificationBackgroundTask, initNotificationForegroundTask } from '@/util/notifications';

const App = () => {
  const isLoadingComplete = useCachedResources();
  initNotificationBackgroundTask();
  initNotificationForegroundTask();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider store={store}>
        <SafeAreaProvider>
          <UserAlert>
            <Navigation />
            <StatusBar />
          </UserAlert>
        </SafeAreaProvider>
      </Provider>
    );
  }
}

export default App;
