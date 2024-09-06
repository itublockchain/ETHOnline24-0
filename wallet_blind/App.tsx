import React, {useEffect, useRef} from 'react';
import {Linking} from 'react-native';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  WalletScreen,
  ClaimScreen,
  ActivityScreen,
  ClaimSuccessScreen,
} from './screens/index';
import {BalanceProvider} from './context/BalanceContext';

export type RootStackParamList = {
  Wallet: undefined;
  Activity: undefined;
  Claim: {amount: number};
  ClaimSuccess: {amount: number};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking = {
  prefixes: ['myapp://'],
  config: {
    screens: {
      Claim: 'claim/:amount',
    },
  },
};

const App: React.FC = () => {
  const navigationRef =
    useRef<NavigationContainerRef<RootStackParamList>>(null);

  useEffect(() => {
    const handleDeepLink = (event: {url: string}) => {
      const url = event.url;
      if (url.startsWith('myapp://claim')) {
        const amount = url.split('/')[2];
        navigationRef.current?.navigate('Claim', {amount: parseFloat(amount)});
      }
    };

    const linkingSubscription = Linking.addListener('url', handleDeepLink);

    Linking.getInitialURL().then(url => {
      if (url && url.startsWith('myapp://claim')) {
        const amount = url.split('/')[2];
        navigationRef.current?.navigate('Claim', {amount: parseFloat(amount)});
      }
    });

    return () => {
      linkingSubscription.remove();
    };
  }, []);

  return (
    <BalanceProvider>
      <NavigationContainer linking={linking} ref={navigationRef}>
        <Stack.Navigator
          initialRouteName="Wallet"
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="Wallet" component={WalletScreen} />
          <Stack.Screen name="Activity" component={ActivityScreen} />
          <Stack.Screen name="Claim" component={ClaimScreen} />
          <Stack.Screen name="ClaimSuccess" component={ClaimSuccessScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </BalanceProvider>
  );
};

export default App;
