import React, {useEffect, useRef} from 'react';
import {MMKV} from 'react-native-mmkv';
import 'react-native-get-random-values'; // Rastgele değerler için
import {v4 as uuidv4} from 'uuid'; // UUID ile unique değer oluşturma
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {
  WalletScreen,
  ClaimScreen,
  ActivityScreen,
  ClaimSuccessScreen,
} from './screens/index';
import {BalanceProvider} from './context/BalanceContext';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Linking} from 'react-native'; // React Native'den doğru Linking importu

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

// MMKV depolama
const storage = new MMKV();

const App: React.FC = () => {
  const navigationRef =
    useRef<NavigationContainerRef<RootStackParamList>>(null);

  // Uygulama açıldığında bir private key oluşturma ve kaydetme
  useEffect(() => {
    const existingPrivateKey = storage.getString('privateKey');

    // Eğer private key yoksa oluştur ve sakla
    if (!existingPrivateKey) {
      const newPrivateKey = uuidv4(); // Rastgele bir private key oluştur
      storage.set('privateKey', newPrivateKey);
      console.log('New Private Key Generated:', newPrivateKey);
    } else {
      console.log('Private Key Already Exists:', existingPrivateKey);
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

    // React Native Linking API'sini kullanarak deep link event handler'ı ekliyoruz
    const linkingSubscription = Linking.addEventListener('url', handleDeepLink);

    // Uygulama ilk açıldığında deep link ile başlatıldıysa URL'yi alıyoruz
    Linking.getInitialURL().then(url => {
      if (url && url.startsWith('myapp://claim')) {
        const amount = url.split('/')[2];
        if (navigationRef.current) {
          navigationRef.current.navigate('Claim', {amount: parseFloat(amount)});
        }
      }
    });

    // Component kaldırılırken event handler'ı temizliyoruz
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
