import React from 'react';
import {
  Alert,
  AsyncStorage,
  Button,
  Platform,
  ProgressBarAndroid,
  ProgressViewIOS,
  ScrollView,
  View,
} from 'react-native';
import { FileSystem } from 'expo';

export default class FileSystemScreen extends React.Component {
  state = {
    downloadProgress: 0,
  };

  _download = async () => {
    const url = 'http://ipv4.download.thinkbroadband.com/5MB.zip';
    const fileUri = FileSystem.documentDirectory + '5MB.zip';
    const callback = downloadProgress => {
      const progress =
        downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
      this.setState({
        downloadProgress: progress,
      });
    };
    const options = { md5: true };
    this.download = FileSystem.createDownloadResumable(url, fileUri, options, callback);

    try {
      await this.download.downloadAsync();
      if (this.state.downloadProgress === 1) {
        alert('Download complete!');
      }
    } catch (e) {
      console.log(e);
    }
  };

  _pause = async () => {
    if (this.download == null) {
      alert('Initiate a download first!');
      return;
    }
    try {
      const downloadSnapshot = await this.download.pauseAsync();
      await AsyncStorage.setItem('pausedDownload', JSON.stringify(downloadSnapshot));
      alert('Download paused...');
    } catch (e) {
      console.log(e);
    }
  };

  _resume = async () => {
    try {
      if (this.download) {
        await this.download.resumeAsync();
        if (this.state.downloadProgress === 1) {
          alert('Download complete!');
        }
      } else {
        this._fetchDownload();
      }
    } catch (e) {
      console.log(e);
    }
  };

  _fetchDownload = async () => {
    try {
      const downloadJson = await AsyncStorage.getItem('pausedDownload');
      if (downloadJson !== null) {
        const downloadFromStore = JSON.parse(downloadJson);
        const callback = downloadProgress => {
          const progress =
            downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          this.setState({
            downloadProgress: progress,
          });
        };
        this.download = new FileSystem.DownloadResumable(
          downloadFromStore.url,
          downloadFromStore.fileUri,
          downloadFromStore.options,
          callback,
          downloadFromStore.resumeData
        );
        await this.download.resumeAsync();
        if (this.state.downloadProgress === 1) {
          alert('Download complete!');
        }
      } else {
        alert('Initiate a download first!');
        return;
      }
    } catch (e) {
      console.log(e);
    }
  };

  _getInfo = async () => {
    if (this.download == null) {
      alert('Initiate a download first!');
      return;
    }
    try {
      let info = await FileSystem.getInfoAsync(this.download._fileUri);
      Alert.alert('File Info:', JSON.stringify(info), [{ text: 'OK', onPress: () => {} }]);
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    let progress = null;
    if (Platform.OS === 'ios') {
      progress = (
        <ProgressViewIOS
          style={{
            marginBottom: 10,
            marginRight: 10,
          }}
          progress={this.state.downloadProgress}
        />
      );
    } else {
      progress = (
        <ProgressBarAndroid
          style={{
            marginBottom: 10,
            marginRight: 10,
          }}
          styleAttr="Horizontal"
          indeterminate={false}
          progress={this.state.downloadProgress}
        />
      );
    }
    return (
      <ScrollView style={{ flex: 1, padding: 10 }}>
        <Button
          style={{ marginBottom: 10 }}
          onPress={this._download}
          title="Start Downloading file (5mb)"
        />
        <Button style={{ marginBottom: 10 }} onPress={this._pause} title="Pause Download" />
        <Button style={{ marginBottom: 10 }} onPress={this._resume} title="Resume Download" />
        {progress}
        <Button style={{ marginBottom: 10 }} onPress={this._getInfo} title="Get Info" />
      </ScrollView>
    );
  }
}
