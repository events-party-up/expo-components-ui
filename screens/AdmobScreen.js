import React from 'react';
import { StyleSheet, Text, View, NativeModules, Platform, TouchableHighlight } from 'react-native';
import Expo, { AdMobBanner } from 'expo';
import { Colors } from '../constants';

const AdMobRewarded = NativeModules.RNAdMobRewarded;
const AdMobInterstitial = Expo.AdMobInterstitial;

export default class AdmobScreen extends React.Component {
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
          <TouchableHighlight style={styles.button}>
            <Text onPress={this.onPress} style={styles.buttonText}>
              Show Rewarded Interstitial Ad
            </Text>
          </TouchableHighlight>

          <TouchableHighlight style={styles.button}>
            <Text onPress={this.onInterstitialPress} style={styles.buttonText}>
              Show Interstitial Ad
            </Text>
          </TouchableHighlight>
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
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 3,
    backgroundColor: Colors.tintColor,
    marginRight: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
  },
});
