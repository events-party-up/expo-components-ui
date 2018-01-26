import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class MonoText extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.monoText}>{this.props.children}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 6,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#666666',
  },
  monoText: {
    fontFamily: 'space-mono',
    fontSize: 10,
  },
});
