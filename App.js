import './LegacyReact';

import Expo from 'expo';
import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';

import RootNavigation from './navigation/RootNavigation';

export default class AppContainer extends React.Component {
  state = {
    appIsReady: false,
  };

  componentWillMount() {
    this._loadAssetsAsync();
  }

  async _loadAssetsAsync() {
    try {
      await Expo.Font.loadAsync({ 'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf') });
    } catch (e) {
      console.log({ e });
    } finally {
      this.setState({ appIsReady: true });
    }
  }

  render() {
    if (this.state.appIsReady) {
      return (
        <View style={styles.container} testID="native_component_list">
          {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}
          <RootNavigation />

          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        </View>
      );
    } else {
      return <Expo.AppLoading />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});

Expo.registerRootComponent(AppContainer);
