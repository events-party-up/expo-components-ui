import React from 'react';
import { Alert, Button, ScrollView, View } from 'react-native';
import { Facebook } from 'expo';

export default class FacebookLoginScreen extends React.Component {
  render() {
    let permissions = ['public_profile', 'email', 'user_friends'];

    return (
      <ScrollView style={{ padding: 10 }}>
        <Button
          onPress={() => this._testFacebookLogin('1201211719949057', permissions, 'web')}
          title="Authenticate with Facebook (web)"
        />
        <View style={{ marginBottom: 10 }} />
        <Button
          onPress={() => this._testFacebookLogin('1201211719949057', permissions, 'browser')}
          title="Authenticate with Facebook (browser)"
        />
        <View style={{ marginBottom: 10 }} />
        <Button
          onPress={() => this._testFacebookLogin('1201211719949057', permissions, 'native')}
          title="Authenticate with Facebook (native)"
        />
        <View style={{ marginBottom: 10 }} />
        <Button
          onPress={() => this._testFacebookLogin('1201211719949057', permissions, 'system')}
          title="Authenticate with Facebook (system)"
        />
      </ScrollView>
    );
  }

  _testFacebookLogin = async (id, perms, behavior = 'web') => {
    try {
      const result = await Facebook.logInWithReadPermissionsAsync(id, {
        permissions: perms,
        behavior,
      });

      const { type, token } = result;

      if (type === 'success') {
        Alert.alert('Logged in!', JSON.stringify(result), [
          {
            text: 'OK!',
            onPress: () => {
              console.log({ type, token });
            },
          },
        ]);
      }
    } catch (e) {
      Alert.alert('Error!', e.message, [{ text: 'OK', onPress: () => {} }]);
    }
  };
}
