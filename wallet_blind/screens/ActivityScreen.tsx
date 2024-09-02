import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import {useSpeak} from '../hooks/useSpeak';

type ActivityScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Activity'
>;

const ActivityScreen: React.FC = () => {
  const navigation = useNavigation<ActivityScreenNavigationProp>();
  const {speak} = useSpeak();

  return (
    <View style={styles.container}>
      <TouchableOpacity onLongPress={() => speak('Activity Page')}>
        <Text style={styles.activityText}>Activity Page</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        onLongPress={() => speak('Go Back')}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D8FF00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#000',
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ActivityScreen;
