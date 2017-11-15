import Expo from 'expo';
import React from 'react';
import { View, ScrollView, Text, StyleSheet, Platform } from 'react-native';
import Touchable from 'react-native-platform-touchable';

import { Colors, Layout } from '../../constants';

const GLWrap = (title, onContextCreate) => {
  const wrapped = props => (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: 'white',
        },
        props.style,
      ]}>
      <Expo.GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
    </View>
  );
  wrapped.title = title;
  return wrapped;
};

const GLScreens = {
  ClearToBlue: {
    screen: GLWrap('Clear to blue', gl => {
      gl.clearColor(0, 0, 1, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.endFrameEXP();
    }),
  },
};

export class GLMainScreen extends React.Component {
  static navigationOptions = {
    title: 'Examples of GL use',
  };

  render() {
    return (
      <ScrollView style={{ flex: 1 }}>
        {Object.keys(GLScreens).map(screenName => (
          <View key={screenName} style={{ padding: 10 }}>
            <Button onPress={() => this.props.navigation.navigate(screenName)}>
              {GLScreens[screenName].screen.title}
            </Button>
          </View>
        ))}
      </ScrollView>
    );
  }
}

const Button = props => (
  <Touchable onPress={props.onPress} style={[styles.button, props.style]}>
    <Text style={styles.buttonText}>{props.children}</Text>
  </Touchable>
);

export default GLScreens;

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 30 : 30,
    flex: 1,
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 3,
    backgroundColor: Colors.tintColor,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
  },
});
