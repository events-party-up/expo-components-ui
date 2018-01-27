import React from 'react';
import { Button, ScrollView, View } from 'react-native';
import { KeepAwake } from 'expo';

export default class KeepAwakeScreen extends React.Component {
  static navigationOptions = {
    title: 'KeepAwake',
  };
  
  _activate = () => {
    KeepAwake.activate();
  };

  _deactivate = () => {
    KeepAwake.deactivate();
  };

  render() {
    return (
      <ScrollView style={{ padding: 10 }}>
        <Button style={{ marginBottom: 10 }} onPress={this._activate} title="Activate" />
        <Button onPress={this._deactivate} title="Deactivate" />
      </ScrollView>
    );
  }
}
