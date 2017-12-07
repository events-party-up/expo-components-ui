import React from 'react';
import { Button, ScrollView, View } from 'react-native';
import { ScreenOrientation } from 'expo';

export default class ScreenOrientationScreen extends React.Component {
  render() {
    return (
      <ScrollView style={{ padding: 10 }}>
        {Object.keys(ScreenOrientation.Orientation).map(orientation => (
          <Button
            key={orientation}
            style={{ marginBottom: 10 }}
            onPress={() => {
              ScreenOrientation.allow(orientation);
            }}
            title={orientation}
          />
        ))}
      </ScrollView>
    );
  }
}
