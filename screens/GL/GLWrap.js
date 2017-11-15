import Expo from 'expo';
import React from 'react';
import { View } from 'react-native';

import { Colors } from '../../constants';

// Given a `title` and a `GLView` `onContextCreate` callback, return a
// component displaying a `GLView` that calls that callback and has that
// navigator title. Allows quick and easy creation of `GLView`-using components.

export default (title, onContextCreate) => {
  const wrapped = props => (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: Colors.tintColor,
        },
        props.style,
      ]}>
      <Expo.GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
    </View>
  );
  wrapped.title = title;
  return wrapped;
};
