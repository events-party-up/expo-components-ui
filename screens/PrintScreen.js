import React from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import { DangerZone, DocumentPicker } from 'expo';
import Button from '../components/Button';

export default class PrintScreen extends React.Component {
  static navigationOptions = {
    title: 'Print',
  };

  state = {
    selectedPrinter: null,
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        { Platform.OS === 'ios' && this._renderSelectPrinter() }
        <Button onPress={this._printHTMLAsync} style={styles.button} title="Print HTML" />
        <Button onPress={this._printPDFAsync} style={styles.button} title="Print PDF" />
      </View>
    );
  }

  _renderSelectPrinter() {
    let { selectedPrinter } = this.state;

    return (
      <View>
        <Text style={styles.text}>Selected printer: {selectedPrinter ? selectedPrinter.name : 'None'}</Text>
        <Button onPress={this._selectPrinterAsync} style={styles.button} title="Select Printer (iOS only)" />
      </View>
    );
  }

  _selectPrinterAsync = async () => {
    try {
      let selectedPrinter = await DangerZone.Print.selectPrinterAsync();
      this.setState({
        selectedPrinter,
      });
    } catch (e) {
      Alert.alert('Something went wrong: ', e.message);
    }
  };

  _printHTMLAsync = async () => {
    let { selectedPrinter } = this.state;

    try {
      await DangerZone.Print.printAsync({
        html: 'Dear Friend! <b>Happy</b> Birthday, enjoy your day! 🎈',
        printerUrl: selectedPrinter ? selectedPrinter.url : undefined,
      });
    } catch (e) {
      Alert.alert('Something went wrong: ', e.message);
    }
  };

  _printPDFAsync = async () => {
    let { selectedPrinter } = this.state;

    try {
      let document = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });
      if (document.type !== 'success') {
        throw new Error('User did not select a document');
      }
      await DangerZone.Print.printAsync({
        uri: document.uri,
        printerUrl: selectedPrinter ? selectedPrinter.url : undefined,
      });
    } catch (e) {
      Alert.alert('Something went wrong: ', e.message);
    }
  };
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
  text: {
    padding: 8,
  },
});
