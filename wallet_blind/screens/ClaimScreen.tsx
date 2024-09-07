import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useBalance} from '../context/BalanceContext';
import {useSpeak} from '../hooks/useSpeak';
import HapticFeedback from 'react-native-haptic-feedback'; // Haptic Feedback import edildi
import {MMKV} from 'react-native-mmkv'; // MMKV import edildi

// MMKV depolama oluşturuluyor
const storage = new MMKV();

type ClaimScreenProps = NativeStackScreenProps<RootStackParamList, 'Claim'>;

const ClaimScreen: React.FC<ClaimScreenProps> = ({route, navigation}) => {
  const {amount} = route.params;
  const {updateBalance} = useBalance();
  const {speak} = useSpeak();

  // Uygulama ilk açıldığında oluşturulan private key'i burada tutuyoruz
  const [privateKey, setPrivateKey] = useState<string>('');

  useEffect(() => {
    // App.tsx'de oluşturulmuş olan private key'i MMKV'den alıyoruz
    const storedPrivateKey = storage.getString('privateKey');
    if (storedPrivateKey) {
      setPrivateKey(storedPrivateKey); // Private key'i state'e kaydediyoruz
    }
  }, []);

  const handleClaim = () => {
    const claimAmount = parseFloat(amount as any);
    if (!isNaN(claimAmount)) {
      updateBalance(claimAmount);
    }
    navigation.navigate('ClaimSuccess', {amount: claimAmount});
  };

  // Haptic Feedback ve Sesli Geri Bildirim
  const handleVibrateAndSpeak = (message: string) => {
    HapticFeedback.trigger('impactLight'); // Haptic feedback tetikleniyor
    speak(message); // Sesli geri bildirim
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={styles.header}
        onLongPress={() => handleVibrateAndSpeak('Claim Your Funds')}>
        Claim Your Funds
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Your Wallet Address"
          placeholderTextColor="#999"
          style={styles.input}
          value={privateKey} // App.tsx'deki private key burada gösteriliyor
          editable={false} // Kullanıcı tarafından düzenlenemeyecek
          onFocus={() => speak(`Your Wallet Address is ${privateKey}`)} // Sesli geri bildirim
        />
      </View>

      <View style={styles.amountContainer}>
        <Text
          style={styles.amountLabel}
          onLongPress={() => handleVibrateAndSpeak('Amount')}>
          Amount:
        </Text>
        <Text
          style={styles.amountValue}
          onLongPress={() => handleVibrateAndSpeak(`Amount is ${amount}`)}>
          ${amount}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.claimButton}
        onPress={handleClaim}
        onLongPress={() => handleVibrateAndSpeak('Claim')}>
        <Text style={styles.claimButtonText}>CLAIM</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D8FF00',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  amountValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  claimButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  claimButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ClaimScreen;
