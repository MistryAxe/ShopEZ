import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AppNavigator from './src/navigation/AppNavigator';
import { LogBox, ActivityIndicator, View, Text } from 'react-native';
import { colors } from './src/theme';

LogBox.ignoreLogs(['Setting a timer for a long period of time']);

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          
          <AppNavigator />
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
