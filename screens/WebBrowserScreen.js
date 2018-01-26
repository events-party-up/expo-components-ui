import React from 'react';
import { Alert, Button, View } from 'react-native';
import { WebBrowser } from 'expo';

export default class WebBrowserScreen extends React.Component {
  render() {
    return (
      <View>
        <Button
          onPress={async () => {
            const result = await WebBrowser.openBrowserAsync('https://www.google.com');
            setTimeout(() => Alert.alert('Result', JSON.stringify(result, null, 2)), 1000);
          }}
          title="Open web url"
        />
      </View>
    );
  }
}
