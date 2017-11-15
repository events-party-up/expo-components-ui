import Expo from 'expo';
import React from 'react';
import { View } from 'react-native';

export default (title, onContextCreate) => {
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
