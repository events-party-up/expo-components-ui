import React from 'react';
import { Button, ScrollView, View } from 'react-native';
import { Notifications } from 'expo';

export default class LocalNotificationScreen extends React.Component {
  render() {
    return (
      <ScrollView style={{ padding: 10 }}>
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
}
