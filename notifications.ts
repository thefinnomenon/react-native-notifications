import firebase from 'react-native-firebase';
import {Alert} from 'react-native';

export class NotificationService {
  onTokenRefreshListener = null;
  messageListener = null;
  notificationDisplayedListener = null;
  onNotificationListener = null;
  onNotificationOpenedListener = null;

  async getToken() {
    const fcmToken = await firebase.messaging().getToken();
    console.log(`Retrieved new token: ${fcmToken}`);
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      console.log('Messaging permissions enabled');
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  async requestPermission() {
    console.log('Requesting messaging permissions');
    try {
      await firebase.messaging().requestPermission();
      this.getToken();
    } catch (error) {
      console.log('Messaging permission rejected');
    }
  }

  async createListeners() {
    this.onTokenRefreshListener = firebase
      .messaging()
      .onTokenRefresh(async fcmToken => {
        console.log(`Retrieved new token: ${fcmToken}`);
      });

    this.messageListener = firebase.messaging().onMessage(message => {
      console.log('on Message');
      console.log(message);
    });

    this.notificationDisplayedListener = firebase
      .notifications()
      .onNotificationDisplayed(notification => {
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        console.log('onNotificationDisplayed');
        console.log(notification);
      });

    this.onNotificationListener = firebase
      .notifications()
      .onNotification(notification => {
        console.log('onNotification');
        console.log(notification);

        // UNCOMMENT IF YOU WANT ANDROID TO DISPLAY THE NOTIFICATION
        notification.android.setChannelId('default').setSound('default');
        firebase.notifications().displayNotification(notification);

        Alert.alert(
          'Push Notification',
          notification.body,
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          {cancelable: false},
        );
      });

    this.onNotificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notification => {
        console.log('onNotificationOpened');
        console.log(notification);

        Alert.alert(
          'Push Notification',
          `${notification.action},${notification.notification},${notification.results}`,
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          {cancelable: false},
        );
      });
  }

  async scheduleNotification(date) {
    const notification = new firebase.notifications.Notification()
      .setNotificationId('1')
      .setTitle('Test notification')
      .setBody('This is a test notification')
      .android.setPriority(firebase.notifications.Android.Priority.High)
      .android.setChannelId('default')
      .android.setAutoCancel(true);

    firebase
      .notifications()
      .scheduleNotification(notification, {
        fireDate: date.getTime(),
      })
      .catch(err => console.error(err));
  }

  configure() {
    const channel = new firebase.notifications.Android.Channel(
      'default',
      'default channel',
      firebase.notifications.Android.Importance.Max,
    );
    firebase.notifications().android.createChannel(channel);
    this.checkPermission();
    this.createListeners();
  }

  wasOpenedByNotification() {
    firebase
      .notifications()
      .getInitialNotification()
      .then(notificationOpen => {
        if (notificationOpen) {
          // App was opened by a notification
          // Get the action triggered by the notification being opened
          const action = notificationOpen.action;
          // Get information about the notification that was opened
          const notification = notificationOpen.notification;

          console.log('App was opened by a notification');
          console.log(action);
          console.log(notification);

          Alert.alert(
            'Push Notification',
            `${action},${notification}`,
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );
        } else {
          console.log('App was NOT opened by a notification');
        }
      });
  }
}

const Notification = new NotificationService();
export default Notification;
