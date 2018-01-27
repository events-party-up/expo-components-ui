import React from 'react';
import { Button, ScrollView, View } from 'react-native';
import { ImagePicker } from 'expo';

export default class ImagePickerScreen extends React.Component {
  static navigationOptions = {
    title: 'ImagePicker',
  };
  state = {
    selection: null,
  };

  render() {
    const showCamera = async () => {
      let result = await ImagePicker.launchCameraAsync({});
      if (result.cancelled) {
        this.setState({ selection: null });
      } else {
        this.setState({ selection: result });
      }
      alert(JSON.stringify(result));
    };

    const showPicker = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({});
      if (result.cancelled) {
        this.setState({ selection: null });
      } else {
        this.setState({ selection: result });
      }
      alert(JSON.stringify(result));
    };

    const showPickerWithEditing = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true });
      if (result.cancelled) {
        this.setState({ selection: null });
      } else {
        this.setState({ selection: result });
      }
      alert(JSON.stringify(result));
    };

    return (
      <ScrollView style={{ padding: 10 }}>
        <View style={{ flexDirection: 'row' }}>
          <Button onPress={showCamera} title="Open camera" />
          <Button onPress={showPicker} title="Pick photo or video" />
        </View>
        <View style={{ flexDirection: 'row', paddingTop: 10 }}>
          <Button onPress={showPickerWithEditing} title="Pick photo and edit" />
        </View>

        {this._maybeRenderSelection()}
      </ScrollView>
    );
  }

  _maybeRenderSelection = () => {
    const { selection } = this.state;

    if (!selection) {
      return;
    }

    let media =
      selection.type === 'video' ? (
        <Video
          source={{ uri: selection.uri }}
          style={{ width: 300, height: 300 }}
          resizeMode="contain"
          shouldPlay
          isLooping
        />
      ) : (
        <Image
          source={{ uri: selection.uri }}
          style={{ width: 300, height: 300, resizeMode: 'contain' }}
        />
      );

    return (
      <View style={{ marginVertical: 10, alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        {media}
      </View>
    );
  };
}
