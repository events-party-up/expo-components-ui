import React from 'react';
import { AppState, ScrollView, Text, View } from 'react-native';
import { Util } from 'expo';
import Button from '../components/Button';

export default class UtilScreen extends React.Component {
  static navigationOptions = {
    title: 'Util',
  };
  
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
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Locale: {this.state.locale}</Text>
        <Text>Device Country: {this.state.deviceCountry}</Text>
        <Text>Time Zone: {this.state.timeZone}</Text>
        <Button
          style={{ marginVertical: 10 }}
          onPress={async () => {
            Util.reload();
          }}
          title="Util.reload()"
        />
      </View>
    );
  }
}
