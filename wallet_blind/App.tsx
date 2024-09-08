import React, {useEffect, useRef} from 'react';
import {MMKV} from 'react-native-mmkv';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import {ethers} from 'ethers';
import {Linking, LogBox} from 'react-native';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {
  WalletScreen,
  ClaimScreen,
  ActivityScreen,
  ClaimSuccessScreen,
  SendMoneyScreen,
} from './screens/index';
import {BalanceProvider} from './context/BalanceContext';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

LogBox.ignoreAllLogs(); //Ignore all log notifications
export type RootStackParamList = {
  Wallet: undefined;
  Activity: undefined;
  Claim: {amount: number};
  ClaimSuccess: {amount: number};
  SendMoney: {recipient: string};
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

const storage = new MMKV();

const App: React.FC = () => {
  const navigationRef =
    useRef<NavigationContainerRef<RootStackParamList>>(null);

  useEffect(() => {
    const existingPrivateKey = storage.getString('walletAddress');
    if (!existingPrivateKey) {
      const wallet = ethers.Wallet.createRandom();
      const newWalletAddress = wallet.privateKey;
      storage.set('walletAddress', newWalletAddress);
      console.log('New Wallet Address Generated:', newWalletAddress);
    } else {
      console.log('Wallet Address Already Exists:', existingPrivateKey);
      const wallet = new ethers.Wallet(existingPrivateKey);
      console.log('CÜZDANNNNN:', wallet);
    }
  }, []);

  useEffect(() => {
    const handleDeepLink = (event: {url: string}) => {
      const url = event.url;
      if (url.startsWith('myapp://claim')) {
        const amount = url.split('/')[2];
        if (navigationRef.current) {
          navigationRef.current.navigate('Claim', {amount: parseFloat(amount)});
        }
      }
    };

    const linkingSubscription = Linking.addListener('url', handleDeepLink);

    Linking.getInitialURL().then(url => {
      if (url && url.startsWith('myapp://claim')) {
        const amount = url.split('/')[2];
        if (navigationRef.current) {
          navigationRef.current.navigate('Claim', {amount: parseFloat(amount)});
        }
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
          <Stack.Screen name="SendMoney" component={SendMoneyScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </BalanceProvider>
  );
};

export default App;
