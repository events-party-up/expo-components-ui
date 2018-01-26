import React from 'react';
import { AppState, Button, ScrollView, Text, View } from 'react-native';
import { Util } from 'expo';

export default class UtilScreen extends React.Component {
  state = {
    locale: null,
    deviceCountry: null,
    timeZone: null,
  };

  componentWillMount() {
    this._update();
    AppState.addEventListener('change', this._update);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._update);
  }

  _update = async () => {
    let locale = await Util.getCurrentLocaleAsync();
    let deviceCountry = await Util.getCurrentDeviceCountryAsync();
    let timeZone = await Util.getCurrentTimeZoneAsync();
    this.setState({ locale, deviceCountry, timeZone });
  };

  render() {
    return (
      <ScrollView style={{ padding: 10 }}>
        <Text>Locale: {this.state.locale}</Text>
        <Text>Device Country: {this.state.deviceCountry}</Text>
        <Text>Time Zone: {this.state.timeZone}</Text>
        <Button
          onPress={async () => {
            Util.reload();
          }}
          title="Util.reload()"
        />
      </ScrollView>
    );
  }
}
