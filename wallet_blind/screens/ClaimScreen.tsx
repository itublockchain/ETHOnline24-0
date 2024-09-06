import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useBalance} from '../context/BalanceContext';
import {useSpeak} from '../hooks/useSpeak';

type ClaimScreenProps = NativeStackScreenProps<RootStackParamList, 'Claim'>;

const ClaimScreen: React.FC<ClaimScreenProps> = ({route, navigation}) => {
  const {amount} = route.params;
  const {updateBalance} = useBalance();
  const {speak} = useSpeak();

  const handleClaim = () => {
    const claimAmount = parseFloat(amount as any);
    if (!isNaN(claimAmount)) {
      updateBalance(claimAmount);
    }
    navigation.navigate('ClaimSuccess', {amount: claimAmount});
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header} onLongPress={() => speak('Claim Your Funds')}>
        Claim Your Funds
      </Text>

      <TouchableWithoutFeedback
        onLongPress={() => speak('Your Wallet Address 1234abc...xyz')}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Your Wallet Address"
            placeholderTextColor="#999"
            style={styles.input}
            defaultValue="1234abc...xyz"
          />
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel} onLongPress={() => speak('Amount')}>
          Amount:
        </Text>
        <Text
          style={styles.amountValue}
          onLongPress={() => speak(`Amount is ${amount}`)}>
          ${amount}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.claimButton}
        onPress={handleClaim}
        onLongPress={() => speak('Claim')}>
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
