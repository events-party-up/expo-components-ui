import React from 'react';
import { Alert, Button, ScrollView, View } from 'react-native';
import { MailComposer } from 'expo';

export default class MailComposerScreen extends React.Component {
  render() {
    return (
      <ScrollView style={{ padding: 10 }}>
        <Button onPress={this._sendMailAsync} title="Send birthday wishes" />
      </ScrollView>
    );
  }

  _sendMailAsync = async () => {
    try {
      const { status } = await MailComposer.composeAsync({
        subject: 'Wishes',
        body: 'Dear Friend! <b>Happy</b> Birthday, enjoy your day! 🎈',
        recipients: ['sample.mail@address.com'],
        isHtml: true,
      });
      if (status === 'sent') {
        Alert.alert('Mail sent!');
      } else {
        throw new Error(`composeAsync() returned status: ${status}`);
      }
    } catch (e) {
      Alert.alert('Something went wrong: ', e.message);
    }
  };
}
