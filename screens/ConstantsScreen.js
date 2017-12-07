import React from 'react';
import { Platform, ScrollView, Text, View } from 'react-native';
import { Constants } from 'expo';

const ExpoConstant = ({ name, object }) => {
  let value = Constants[name];

  if (object) {
    value = JSON.stringify(value);
  } else if (typeof value === 'boolean') {
    value = value ? 'true' : 'false';
  }

  return (
    <View style={{ flexDirection: 'row', flex: 1, marginBottom: 10 }}>
      <Text ellipsizeMode="tail" style={{ flex: 1 }}>
        <Text style={{ fontWeight: 'bold' }}>{name}</Text>: {value}
      </Text>
    </View>
  );
};

export default class ConstantsScreen extends React.Component {
  static navigationOptions = {
    title: 'Constants',
  };

  state = {
    webViewUserAgent: null,
  };

  componentWillMount() {
    this._update();
  }

  _update = async () => {
    let webViewUserAgent = await Constants.getWebViewUserAgentAsync();
    this.setState({ webViewUserAgent });
  };

  render() {
    return (
      <ScrollView style={{ padding: 10, flex: 1 }}>
        <ExpoConstant name="expoVersion" />
        <ExpoConstant name="deviceId" />
        <ExpoConstant name="deviceName" />
        <ExpoConstant name="deviceYearClass" />
        <ExpoConstant name="sessionId" />
        <ExpoConstant name="linkingUri" />
        <ExpoConstant name="statusBarHeight" />
        <ExpoConstant name="isDevice" />
        <ExpoConstant name="appOwnership" />
        {Platform.OS === 'ios' && <ExpoConstant name="platform" object />}
        <ExpoConstant name="manifest" object />
        <Text>
          <Text style={{ fontWeight: 'bold' }}>getWebViewUserAgentAsync</Text>:{' '}
          {this.state.webViewUserAgent}
        </Text>
      </ScrollView>
    );
  }
}
