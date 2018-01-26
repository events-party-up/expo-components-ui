import React from 'react';
import { StyleSheet, View, NativeModules, Platform } from 'react-native';
import Expo, { AdMobBanner } from 'expo';
import Button from '../components/Button';
import { Colors } from '../constants';

const AdMobRewarded = NativeModules.RNAdMobRewarded;
const AdMobInterstitial = Expo.AdMobInterstitial;

export default class AdMobScreen extends React.Component {
  constructor() {
    super();
    AdMobRewarded.setTestDeviceID('EMULATOR');
    AdMobRewarded.setAdUnitID('ca-app-pub-3940256099942544/1033173712');
    AdMobInterstitial.setAdUnitID('ca-app-pub-3940256099942544/1033173712');
    AdMobInterstitial.setTestDeviceID('EMULATOR');
  }

  componentDidMount() {
    AdMobRewarded.requestAd(error => error && console.log(error));
    AdMobInterstitial.requestAd(error => error && console.log(error));
  }

  onPress() {
    AdMobRewarded.showAd(error => error && console.log(error));
  }

  onInterstitialPress() {
    AdMobInterstitial.showAd(error => error && console.log(error));
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <Button style={styles.button} onPress={this.onPress} title="Show Rewarded Interstitial Ad" />
          <Button style={styles.button} onPress={this.onInterstitialPress} title="Show Interstitial Ad" />
          <AdMobBanner
            bannerSize="banner"
            adUnitID="ca-app-pub-3940256099942544/6300978111"
            testDeviceID="EMULATOR"
            didFailToReceiveAdWithError={this.bannerError}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 30 : 30,
    flex: 1,
    alignItems: 'center',
  },
  button: {
    marginVertical: 10,
  },
});
