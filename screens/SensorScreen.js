import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Accelerometer, Gyroscope, Magnetometer, MagnetometerUncalibrated } from 'expo';

export default class SensorScreen extends React.Component {
  static navigationOptions = {
    title: 'Sensors',
  };

  render() {
    return (
      <View style={styles.container}>
        <GyroscopeSensor />
        <AccelerometerSensor />
        <MagnetometerSensor />
        <MagnetometerUncalibratedSensor />
      </View>
    );
  }
}

function createSensorBlock(name, Sensor) {
  return class SensorBlock extends React.Component {
    state = {
      data: {},
    };

    componentWillUnmount() {
      this._unsubscribe();
    }

    _toggle = () => {
      if (this._subscription) {
        this._unsubscribe();
      } else {
        this._subscribe();
      }
    };

    _slow = () => {
      Sensor.setUpdateInterval(1000);
    };

    _fast = () => {
      Sensor.setUpdateInterval(16);
    };

    _subscribe = () => {
      this._subscription = Sensor.addListener(result => {
        this.setState({ data: result });
      });
    };

    _unsubscribe = () => {
      this._subscription && this._subscription.remove();
      this._subscription = null;
    };

    render() {
      let { x, y, z } = this.state.data;

      return (
        <View style={styles.sensor}>
          <Text>{name}:</Text>
          <Text>
            x: {round(x)} y: {round(y)} z: {round(z)}
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={this._toggle} style={styles.button}>
              <Text>Toggle</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._slow} style={[styles.button, styles.middleButton]}>
              <Text>Slow</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._fast} style={styles.button}>
              <Text>Fast</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };
}

const GyroscopeSensor = createSensorBlock('Gyroscope', Gyroscope);
const AccelerometerSensor = createSensorBlock('Accelerometer', Accelerometer);
const MagnetometerSensor = createSensorBlock('Magnetometer', Magnetometer);
const MagnetometerUncalibratedSensor = createSensorBlock(
  'Magnetometer (Uncalibrated)',
  MagnetometerUncalibrated
);

function round(n) {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100) / 100;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  sensor: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
});
