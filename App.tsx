import React, {useEffect} from 'react';
import Notifications from './notifications';
import {SafeAreaView, StyleSheet, View, Button} from 'react-native';

export const App = () => {
  useEffect(() => {
    Notifications.configure();
  }, []);

  Notifications.wasOpenedByNotification();

  const sendLocalNotification = delay_seconds => {
    const date = new Date();
    date.setSeconds(date.getSeconds() + delay_seconds);
    Notifications.scheduleNotification(date);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Button
          onPress={() => sendLocalNotification(1)}
          title="Scheduled notification for now"
        />
        <Button
          onPress={() => sendLocalNotification(10)}
          title="Scheduled notification for 10 seconds from now"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 8,
  },
});

export default App;
