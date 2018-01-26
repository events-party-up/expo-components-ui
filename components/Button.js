import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import Colors from '../constants/Colors';

export default class Button extends React.Component {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <TouchableHighlight
          style={styles.button}
          onPress={this.props.onPress}
          underlayColor={Colors.highlightColor}>
          <Text style={styles.label}>{this.props.title}</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.tintColor,
  },
  label: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
