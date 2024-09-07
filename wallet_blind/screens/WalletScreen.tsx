import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSpeak} from '../hooks/useSpeak';
import {useColorScheme} from 'react-native';
import {useBalance} from '../context/BalanceContext';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

type WalletScreenProps = NativeStackScreenProps<RootStackParamList, 'Wallet'>;

const WalletScreen: React.FC<WalletScreenProps> = ({navigation}) => {
  const {speak} = useSpeak();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [activeTab, setActiveTab] = useState<'Wallet' | 'Activity'>('Wallet');
  const {balance} = useBalance();

  const handlePress = (message: string) => {
    speak(message);
    ReactNativeHapticFeedback.trigger('impactHeavy', options);
  };

  useEffect(() => {
    navigation.navigate('SendMoney', {});
  }, [navigation]);

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: '#5F259F'}]}>
      <View style={styles.header}>
        <Image
          source={require('../assets/logo.jpeg')}
          style={styles.logoImage}
        />

        <TouchableOpacity onLongPress={() => handlePress('Domino Wallet')}>
          <Text style={[styles.logo, {color: '#FFFFFF'}]}>Domino</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.networkContainer}>
        <TouchableOpacity onLongPress={() => handlePress('Mainnet')}>
          <Text style={styles.networkText}>Testnet</Text>
        </TouchableOpacity>
      </View>

      {/* Sekme menüsü */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab('Wallet')}
          onLongPress={() => handlePress('Wallet')}
          style={[
            styles.tabButton,
            activeTab === 'Wallet' && styles.activeTab,
          ]}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'Wallet' && styles.activeTabText,
            ]}>
            Wallet
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('Activity')}
          onLongPress={() => handlePress('Activity')}
          style={[
            styles.tabButton,
            activeTab === 'Activity' && styles.activeTab,
          ]}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'Activity' && styles.activeTabText,
            ]}>
            Activity
          </Text>
        </TouchableOpacity>
      </View>

      {/* Wallet veya Activity Ekranı */}
      {activeTab === 'Wallet' ? (
        <View style={styles.walletContainer}>
          <View style={styles.balanceBackground}>
            <TouchableOpacity
              onLongPress={() =>
                handlePress(`Balance: ${balance?.toFixed(2) || '0.00'} dollars`)
              }>
              <Text
                style={styles.balanceText}
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                ellipsizeMode="tail">
                ${balance?.toFixed(2) || '0.00'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.activityContainer}>
          <Text style={styles.activityText}>Transaction History</Text>
          <Text style={styles.transactionText}>→ $20</Text>
          <Text style={styles.transactionText}>← $25</Text>
          <Text style={styles.transactionText}>→ $35</Text>
          <Text style={styles.transactionText}>← $5</Text>
          <Text style={styles.transactionText}>← $50</Text>
        </View>
      )}

      {/* Alt Butonlar */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.depositButton}
          onLongPress={() => handlePress('Deposit money')}>
          <Text
            style={
              (styles.buttonText,
              {color: '#ffffff', fontWeight: 'bold', fontSize: 20})
            }>
            DEPOSIT +
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.requestButton}
          onLongPress={() => handlePress('Request money')}>
          <Text style={styles.buttonText}>REQUEST -</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  networkContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  networkText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    backgroundColor: '#D1C4E9',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: '#000000',
  },
  tabText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  walletContainer: {
    flex: 1,
    alignItems: 'center',
  },
  balanceBackground: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 50,
    marginTop: 20,
    paddingVertical: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  balanceText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'left',
  },
  activityContainer: {
    flex: 1,

    alignItems: 'center',
  },
  activityText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  transactionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'left',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  depositButton: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  requestButton: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default WalletScreen;
