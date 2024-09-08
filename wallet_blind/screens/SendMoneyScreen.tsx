import React, {useEffect, useState} from 'react';
import {Text, ActivityIndicator, StyleSheet, Alert} from 'react-native';
import Contacts from 'react-native-contacts';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import {SafeAreaView} from 'react-native-safe-area-context';
import HapticFeedback from 'react-native-haptic-feedback';
import {useSpeak} from '../hooks/useSpeak';
import {sendTransaction} from '../lib/eth';

type SendMoneyScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SendMoney'
>;

const SendMoneyScreen: React.FC<SendMoneyScreenProps> = ({navigation}) => {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const {speak} = useSpeak();

  const pickContact = async () => {
    try {
      const permission = await Contacts.requestPermission();
      if (permission === 'authorized') {
        const contacts = await Contacts.getAll();
        if (contacts.length > 0) {
          const firstContact = contacts[0];
          const contactName = `${firstContact.givenName || ''} ${
            firstContact.familyName || ''
          }`.trim();

          const phoneNumber =
            firstContact.phoneNumbers.length > 0
              ? firstContact.phoneNumbers[0].number
              : 'Phone number not found';

          const displayName = contactName || phoneNumber;

          setSelectedContact(displayName);
          handleVibrateAndSpeak(`You are sending money to ${displayName} `);
        } else {
          handleVibrateAndSpeak('No contacts found');
        }
      } else {
        handleVibrateAndSpeak('Contact permission denied');
        Alert.alert(
          'Permission Required',
          'You need to allow access to contacts.',
        );
      }
    } catch (error) {
      console.log('Error fetching contacts:', error);
      handleVibrateAndSpeak('Error fetching contacts');
      Alert.alert('Error', 'An error occurred while fetching contacts.');
    }
  };

  useEffect(() => {
    pickContact();

    sendTransaction(1).then(() => {
      navigation.navigate('Wallet');
    });

    // const timeout = setTimeout(() => {
    //   handleVibrateAndSpeak('Transaction completed');
    //   navigation.navigate('Wallet');
    // }, 7000);

    // return () => clearTimeout(timeout); // Clear the timeout when component unmounts
  }, []);

  const handleVibrateAndSpeak = (message: string) => {
    HapticFeedback.trigger('impactLight');
    speak(message);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Spinner */}
      <ActivityIndicator size="large" color="#fff" />

      {/* Display the status of sending money to the selected contact */}
      <Text style={styles.text}>
        {selectedContact
          ? `Sending money to ${selectedContact}...`
          : 'Selecting contact...'}
      </Text>

      {/* Cancel button 
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => {
          handleVibrateAndSpeak('Transaction cancelled');
          navigation.goBack();
        }}
        onLongPress={() => handleVibrateAndSpeak('Cancel')}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#632CA9',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: 'white',
  },
  /* cancelButton: {
    marginTop: 30,
    padding: 10,
    backgroundColor: '#FF0000',
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },*/
});

export default SendMoneyScreen;
