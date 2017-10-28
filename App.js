import './LegacyReact';

import Expo from 'expo';
import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import RootNavigation from './navigation/RootNavigation';
import cacheAssetsAsync from './utilities/cacheAssetsAsync';

export default class AppContainer extends React.Component {
  state = {
    appIsReady: false,
  };

  componentWillMount() {
    this._loadAssetsAsync();
  }

  async _loadAssetsAsync() {
    try {
      await cacheAssetsAsync({
        images: [require('./assets/images/exponent-icon.png')],
        fonts: [
          { 'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf') },
          MaterialIcons.font,
        ],
        videos: [require('./assets/videos/ace.mp4')],
      });
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
