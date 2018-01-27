import React from 'react';
import { Alert, Button, Text, ScrollView, StyleSheet, View } from 'react-native';
import { Notifications } from 'expo';

import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';

export default class NotificationScreen extends React.Component {
  static navigationOptions = {
    title: 'Notifications',
  };
  
  render() {
    return (
      <ScrollView style={{ padding: 10 }}>
        <Text style={styles.heading}>Local Notifications</Text>
        <Button
          onPress={this._presentLocalNotification}
          title="Present a notification immediately"
        />
        <Button
          onPress={this._scheduleLocalNotification}
          title="Schedule notification for 10 seconds from now"
        />
        <Button
          onPress={Notifications.cancelAllScheduledNotificationsAsync}
          title="Cancel all scheduled notifications"
        />

        <Text style={styles.heading}>Push Notifications</Text>
        <Button onPress={this._sendNotification} title="Send me a push notification" />

        <Text style={styles.heading}>Badge Number</Text>
        <Button
          onPress={this._incrementIconBadgeNumberAsync}
          title="Increment the app icon's badge number"
        />
        <Button onPress={this._clearIconBadgeAsync} title="Clear the app icon's badge number" />
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

const styles = StyleSheet.create({
  heading: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 2,
  },
});
