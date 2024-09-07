import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSpeak} from '../hooks/useSpeak';
import {useColorScheme} from 'react-native';
import {useBalance} from '../context/BalanceContext';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'; // Haptic feedback importu

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

type WalletScreenProps = NativeStackScreenProps<RootStackParamList, 'Wallet'>;

const WalletScreen: React.FC<WalletScreenProps> = ({navigation}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const {speak} = useSpeak();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const {balance} = useBalance();

  const handlePress = (message: string) => {
    speak(message);
    ReactNativeHapticFeedback.trigger('impactHeavy', options); // Titreşim geri bildirimi
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? '#000000' : '#D8FF00'},
      ]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setMenuVisible(true)}
          onLongPress={() => handlePress('Blind-Wallet')}>
          <Text
            style={[styles.logo, {color: isDarkMode ? '#FFFFFF' : '#000000'}]}>
            domino
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMenuVisible(true)}
          onLongPress={() => handlePress('Menu')}>
          <Text
            style={[styles.menu, {color: isDarkMode ? '#FFFFFF' : '#000000'}]}>
            Menu
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.networkContainer}>
        <TouchableOpacity onLongPress={() => handlePress('Mainnet')}>
          <Text
            style={[
              styles.networkText,
              {
                backgroundColor: '#FFFFFF',
                color: isDarkMode ? '#000000' : '#000000',
              },
            ]}>
            Mainnet
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Wallet')}
          onLongPress={() => handlePress('Wallet')}
          style={styles.tabButton}>
          <Text style={[styles.tabText, styles.activeTab]}>Wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Activity')}
          onLongPress={() => handlePress('Activity')}
          style={styles.tabButton}>
          <Text style={styles.tabText}>Activity</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.balanceContainer}>
        <TouchableOpacity
          style={styles.balanceWrapper}
          onLongPress={() => handlePress(`Balance: ${balance} dollars`)}>
          <Text style={styles.dollarSign}>$</Text>
          <Text style={styles.balanceText}>
            {balance !== undefined && typeof balance === 'number'
              ? balance.toFixed(2)
              : '0.00'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.depositButton]}
          onPress={() => console.log('Deposit Pressed')}
          onLongPress={() => handlePress('Deposit')}>
          <Text style={styles.buttonText}>DEPOSIT +</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.requestButton]}
          onPress={() => console.log('Request Pressed')}
          onLongPress={() => handlePress('Request')}>
          <Text style={styles.requestButtonText}>REQUEST +</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  menu: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  networkContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  networkText: {
    fontSize: 18,
    fontWeight: '600',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  tabButton: {
    paddingHorizontal: 20,
  },
  tabText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#AAAAAA',
  },
  activeTab: {
    color: '#000000',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    padding: 10,
    borderRadius: 15,
  },
  dollarSign: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#AAAAAA',
    marginRight: 5,
  },
  balanceWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#000000',
  },
  buttonContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    flex: 1,
    paddingVertical: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  depositButton: {
    backgroundColor: '#000000',
  },
  requestButton: {
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  requestButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
});

export default WalletScreen;
