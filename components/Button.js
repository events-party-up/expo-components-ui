import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import Colors from '../constants/Colors';

export default class Button extends React.Component {
  render() {
    let style = [styles.button];
    if (this.props.disabled) {
      style.push(styles.disabledButton);
    }
    return (
      <View style={[styles.container, this.props.style]}>
        <TouchableHighlight
          style={style}
          disabled={this.props.disabled}
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
  disabledButton: {
    backgroundColor: '#bbbbbb',
  },
  label: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
