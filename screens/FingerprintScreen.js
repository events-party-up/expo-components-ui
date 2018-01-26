import React from 'react';
import { Button, ScrollView, View } from 'react-native';
import { Fingerprint } from 'expo';

export default class FingerprintScreen extends React.Component {
  state = {
    waiting: false,
  };

  render() {
    let authFunction = async () => {
      this.setState({ waiting: true });
      try {
        let result = await Fingerprint.authenticateAsync('This message only shows up on iOS');
        if (result.success) {
          alert('Authenticated!');
        } else {
          alert('Failed to authenticate');
        }
      } finally {
        this.setState({ waiting: false });
      }
    };

    return (
      <ScrollView style={{ padding: 10 }}>
        <Button
          onPress={authFunction}
          title={
            this.state.waiting ? 'Waiting for fingerprint... ' : 'Authenticate with fingerprint'
          }
        />
      </ScrollView>
    );
  }
}
