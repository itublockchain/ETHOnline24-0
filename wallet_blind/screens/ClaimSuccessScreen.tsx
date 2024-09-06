import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import {useSpeak} from '../hooks/useSpeak';

type ClaimSuccessScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ClaimSuccess'
>;

const ClaimSuccessScreen: React.FC<ClaimSuccessScreenProps> = ({
  navigation,
  route,
}) => {
  const {amount} = route.params;
  const {speak} = useSpeak();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.successContainer}>
        <TouchableOpacity onLongPress={() => speak('Claim Successful')}>
          <Text style={styles.successText}>Claim Successful!</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.messageContainer}>
        <TouchableOpacity
          onLongPress={() => speak(`You have claimed ${amount} dollars`)}>
          <Text style={styles.messageText}>
            You have successfully claimed ${amount}.
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Wallet')}
        onLongPress={() => speak('Back to Wallet')}>
        <Text style={styles.buttonText}>Back to Wallet</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D8FF00',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContainer: {
    marginBottom: 20,
  },
  successText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  messageContainer: {
    marginBottom: 40,
  },
  messageText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
});

export default ClaimSuccessScreen;
