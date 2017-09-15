import React from 'react';
import { StyleSheet } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';
import CustomTabBarBottom from './CustomTabBarBottom';
import { MaterialIcons } from '@expo/vector-icons';

import { Colors, Layout } from '../constants';
import NavigationEvents from '../utilities/NavigationEvents';

import BarCodeScannerScreen from '../screens/BarCodeScannerScreen';
import ExpoComponentsScreen from '../screens/ExpoComponentsScreen';
import ExpoApisScreen from '../screens/ExpoApisScreen';
import GestureHandlerScreen from '../screens/GestureHandlerScreen';
import SensorScreen from '../screens/SensorScreen';
import GeocodingScreen from '../screens/GeocodingScreen';
import GLViewScreen from '../screens/GLViewScreen';
import FacebookAdsScreen from '../screens/FacebookAdsScreen';
import ReactNativeCoreScreen from '../screens/ReactNativeCoreScreen';
import TextToSpeechScreen from '../screens/TextToSpeechScreen';
import SVGScreen from '../screens/SVGScreen';
import LottieScreen from '../screens/LottieScreen';
import MapsScreen from '../screens/MapsScreen';
import BasicMaskScreen from '../screens/BasicMaskScreen';
import MaskGLScreen from '../screens/MaskGLScreen';
import AdmobScreen from '../screens/AdmobScreen';

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    paddingTop: 5,
    paddingBottom: 1,
    paddingHorizontal: 28,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.tabIconDefault,
  },
  tabBarLabel: {
    fontSize: 10,
    letterSpacing: 0,
  },
  header: {
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fafafa',
  },
});

const StackConfig = {
  cardStyle: styles.card,
  navigationOptions: () => ({
    headerStyle: styles.header,
    headerPressColorAndroid: Colors.tintColor,
  }),
};

const ExpoComponentsStackNavigator = StackNavigator(
  {
    ExpoComponents: { screen: ExpoComponentsScreen },
    BarCodeScanner: { screen: BarCodeScannerScreen },
    GLView: { screen: GLViewScreen },
    GestureHandler: { screen: GestureHandlerScreen },
    FacebookAds: { screen: FacebookAdsScreen },
    SVG: { screen: SVGScreen },
    Lottie: { screen: LottieScreen },
    Maps: { screen: MapsScreen },
    Admob: { screen: AdmobScreen },
  },
  StackConfig
);

const ExpoApisStackNavigator = StackNavigator(
  {
    ExpoApis: { screen: ExpoApisScreen },
    Speech: { screen: TextToSpeechScreen },
    Sensor: { screen: SensorScreen },
    Geocoding: { screen: GeocodingScreen },
  },
  StackConfig
);

const ReactNativeCoreStackNavigator = StackNavigator(
  {
    ReactNativeCore: { screen: ReactNativeCoreScreen },
    BasicMaskExample: { screen: BasicMaskScreen },
    GLMaskExample: { screen: MaskGLScreen },
  },
  StackConfig
);

class TabIcon extends React.Component {
  render() {
    return (
      <MaterialIcons
        name={this.props.name}
        size={this.props.size || 26}
        color={
          this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault
        }
      />
    );
  }
}

const MainTabNavigator = TabNavigator(
  {
    ExpoApis: { screen: ExpoApisStackNavigator },
    ExpoComponents: { screen: ExpoComponentsStackNavigator },
    ReactNativeCore: { screen: ReactNativeCoreStackNavigator },
  },
  {
    navigationOptions: ({ navigation }) => ({
      header: null,
      tabBarLabel: () => {
        const { routeName } = navigation.state;
        if (routeName === 'ReactNativeCore') {
          return Layout.isSmallDevice ? 'RN Core' : 'React Native Core';
        } else if (routeName === 'ExpoComponents') {
          return Layout.isSmallDevice ? 'Components' : 'Expo Components';
        } else if (routeName === 'ExpoApis') {
          return Layout.isSmallDevice ? 'APIs' : 'Expo APIs';
        }
      },
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        if (routeName === 'ReactNativeCore') {
          return <TabIcon name="group-work" focused={focused} />;
        } else if (routeName === 'ExpoComponents') {
          return <TabIcon name="filter" focused={focused} size={25} />;
        } else if (routeName === 'ExpoApis') {
          return <TabIcon name="functions" focused={focused} size={28} />;
        }
      },
    }),
    tabBarComponent: CustomTabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
    lazy: true,
    tabBarOptions: {
      activeTintColor: Colors.tabIconSelected,
      inactiveTintColor: Colors.tabIconDefault,
      style: styles.tabBar,
      labelStyle: styles.tabBarLabel,
      onPressTab: (index, previousIndex, navigation, onComplete) => {
        if (previousIndex === index) {
          let route = navigation.state.routes[index];
          NavigationEvents.emit('selectedTabPressed', route);
        }

        onComplete();
      },
    },
  }
);

export default MainTabNavigator;
