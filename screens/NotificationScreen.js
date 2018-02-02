import React from 'react';
import { Alert, Text, ScrollView, StyleSheet, View } from 'react-native';
import { Notifications } from 'expo';
import HeadingText from '../components/HeadingText';
import ListButton from '../components/ListButton';

import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';

export default class NotificationScreen extends React.Component {
  static navigationOptions = {
    title: 'Notifications',
  };
  
  render() {
    return (
      <ScrollView style={{ padding: 10 }}>
        <HeadingText>Local Notifications</HeadingText>
        <ListButton
          onPress={this._presentLocalNotification}
          title="Present a notification immediately"
        />
        <ListButton
          onPress={this._scheduleLocalNotification}
          title="Schedule notification for 10 seconds from now"
        />
        <ListButton
          onPress={Notifications.cancelAllScheduledNotificationsAsync}
          title="Cancel all scheduled notifications"
        />

        <HeadingText>Push Notifications</HeadingText>
        <ListButton onPress={this._sendNotification} title="Send me a push notification" />

        <HeadingText>Badge Number</HeadingText>
        <ListButton
          onPress={this._incrementIconBadgeNumberAsync}
          title="Increment the app icon's badge number"
        />
        <ListButton onPress={this._clearIconBadgeAsync} title="Clear the app icon's badge number" />
      </ScrollView>
    );
  }

  _presentLocalNotification = () => {
    Notifications.presentLocalNotificationAsync({
      title: 'Here is a local notification!',
      body: 'This is the body',
      data: {
        hello: 'there',
      },
      ios: {
        sound: true,
      },
      android: {
        vibrate: true,
      },
    });
  };

  _scheduleLocalNotification = () => {
    Notifications.scheduleLocalNotificationAsync(
      {
        title: 'Here is a scheduled notifiation!',
        body: 'This is the body',
        data: {
          hello: 'there',
          future: 'self',
        },
        ios: {
          sound: true,
        },
        android: {
          vibrate: true,
        },
      },
      {
        time: new Date().getTime() + 10000,
      }
    );
  };

  _incrementIconBadgeNumberAsync = async () => {
    let currentNumber = await Notifications.getBadgeNumberAsync();
    await Notifications.setBadgeNumberAsync(currentNumber + 1);
    let actualNumber = await Notifications.getBadgeNumberAsync();
    Alert.alert(`Set the badge number to ${actualNumber}`);
  };

  _clearIconBadgeAsync = async () => {
    await Notifications.setBadgeNumberAsync(0);
    Alert.alert(`Cleared the badge`);
  };

  _sendNotification = async () => {
    registerForPushNotificationsAsync().done();
  };
}
