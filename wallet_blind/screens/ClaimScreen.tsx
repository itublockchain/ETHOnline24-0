import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useBalance} from '../context/BalanceContext';
import {useSpeak} from '../hooks/useSpeak';
import HapticFeedback from 'react-native-haptic-feedback';
import {MMKV} from 'react-native-mmkv';

const storage = new MMKV();

type ClaimScreenProps = NativeStackScreenProps<RootStackParamList, 'Claim'>;

const ClaimScreen: React.FC<ClaimScreenProps> = ({route, navigation}) => {
  const {amount} = route.params;
  const {updateBalance} = useBalance();
  const {speak} = useSpeak();

  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [isEditable, setIsEditable] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const storedWalletAddress = storage.getString('walletAddress');
    if (storedWalletAddress) {
      setWalletAddress(storedWalletAddress);
    }
  }, []);

  const handleClaim = () => {
    setIsProcessing(true);
    setIsEditable(false);

    // Parametreyi temizle
    const cleanedAmount = (amount || '').replace(/[^\d.-]/g, '');

    // Temizlenmiş değeri sayıya çevir
    const claimAmount = parseFloat(cleanedAmount);

    if (isNaN(claimAmount)) {
      handleVibrateAndSpeak('Invalid amount provided');
      setIsProcessing(false);
      return;
    }

    updateBalance(claimAmount); // Bakiyeyi güncelle

    setTimeout(() => {
      setIsProcessing(false);
      setIsClaimed(true);
      const message = `Successfully claimed ${claimAmount} dollars!`;
      handleVibrateAndSpeak(message);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        navigation.navigate('Wallet');
      }, 3000);
    }, 7000);
  };

  const handleVibrateAndSpeak = (message: string) => {
    HapticFeedback.trigger('impactLight');
    speak(message);
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
          value={walletAddress}
          onChangeText={setWalletAddress}
          editable={isEditable}
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

      {isProcessing ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
        <TouchableOpacity
          style={styles.claimButton}
          onPress={handleClaim}
          onLongPress={() => handleVibrateAndSpeak('Claim')}>
          <Text style={styles.claimButtonText}>CLAIM</Text>
        </TouchableOpacity>
      )}

      {isClaimed && (
        <Animated.View style={[styles.successMessage, {opacity: fadeAnim}]}>
          <Text style={styles.successText}>
            Successfully claimed {amount} dollars!
          </Text>
          <Text style={styles.successText}>✓</Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#632CA9',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff',
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
    color: '#ffffff',
  },
  amountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
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
  successMessage: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default ClaimScreen;
