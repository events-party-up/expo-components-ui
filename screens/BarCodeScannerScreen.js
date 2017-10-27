import React from 'react';
import { Button, Platform, StyleSheet, View } from 'react-native';

import { BarCodeScanner } from 'expo';

const BUTTON_COLOR = Platform.OS === 'ios' ? '#fff' : '#666';

export default class BarcodeScannerExample extends React.Component {
  static navigationOptions = {
    title: '<BarCodeScanner />',
  };

  state = {
    torchMode: 'off',
    type: 'back',
  };

  render() {
    return (
      <View style={styles.container}>
        <BarCodeScanner
          onBarCodeRead={this._handleBarCodeRead}
          torchMode={this.state.torchMode}
          type={this.state.type}
          style={styles.preview}
        />

        <View style={styles.toolbar}>
          <Button color={BUTTON_COLOR} title="Toggle Flashlight" onPress={this._toggleTorch} />
          <Button color={BUTTON_COLOR} title="Toggle Direction" onPress={this._toggleType} />
        </View>
      </View>
    );
  }

  _toggleTorch = () => {
    this.setState({ torchMode: this.state.torchMode === 'off' ? 'on' : 'off' });
  };

  _toggleType = () => {
    this.setState({ type: this.state.type === 'back' ? 'front' : 'back' });
  };

  _handleBarCodeRead = data => {
    this.props.navigation.goBack();
    requestAnimationFrame(() => {
      alert(JSON.stringify(data));
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    ...StyleSheet.absoluteFillObject,
  },
  toolbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});
