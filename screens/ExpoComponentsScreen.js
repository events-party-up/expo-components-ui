import React from 'react';
import {
  Alert,
  Animated,
  Image,
  ListView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Expo, {
  BlurView,
  Constants,
  LinearGradient,
  Permissions,
  Video,
} from 'expo';
import Touchable from 'react-native-platform-touchable';

import NavigationEvents from '../utilities/NavigationEvents';
import { Colors, Layout } from '../constants';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: Layout.isSmallDevice
      ? 'Expo SDK Components'
      : 'Components in Expo SDK',
  };

  state = {
    dataSource: new ListView.DataSource({
      rowHasChanged: () => false,
      sectionHeaderHasChanged: () => false,
    }),
  };

  componentWillMount() {
    this._tabPressedListener = NavigationEvents.addListener(
      'selectedTabPressed',
      route => {
        if (route.key === 'ExpoComponents') {
          this._scrollToTop();
        }
      }
    );
  }

  componentWillUnmount() {
    this._tabPressedListener.remove();
  }

  componentDidMount() {
    let dataSource = this.state.dataSource.cloneWithRowsAndSections({
      ...Platform.select({
        ios: {
          BlurView: [this._renderBlurView],
        },
        android: {},
      }),
      Admob: [this._renderAdmob],
      GestureHandler: [this._renderGestureHandler],
      BarCodeScanner: [this._renderBarCodeScanner],
      WebGL: [this._renderWebGL],
      FacebookAds: [this._renderFacebookAds],
      Lottie: [this._renderLottie],
      Map: [this._renderMap],
      LinearGradient: [this._renderLinearGradient],
      Svg: [this._renderSvg],
      Video: [this._renderVideo],
      Gif: [this._renderGif],
    });

    this.setState({ dataSource });
  }

  _renderAdmob = () => {
    let _maybeNavigateToAdmob = async () => {
      this.props.navigation.navigate('Admob');
    };

    return (
      <View style={{ padding: 10 }}>
        <Button onPress={_maybeNavigateToAdmob}> Open Admob example </Button>
      </View>
    );
  };

  _renderMap = () => {
    return (
      <View style={{ padding: 10 }}>
        <Button
          onPress={() => {
            this.props.navigation.navigate('Maps');
          }}>
          Open Maps Example
        </Button>
      </View>
    );
  };

  _renderSvg = () => {
    return (
      <View style={{ padding: 10 }}>
        <Button
          onPress={() => {
            this.props.navigation.navigate('SVG');
          }}>
          Open Svg example
        </Button>
      </View>
    );
  };

  _renderLottie = () => {
    return (
      <View style={{ padding: 10 }}>
        <Button
          onPress={() => {
            this.props.navigation.navigate('Lottie');
          }}>
          Open Lottie example
        </Button>
      </View>
    );
  };

  _renderBarCodeScanner = () => {
    let _maybeNavigateToBarCodeScanner = async () => {
      let { status } = await Permissions.askAsync(Permissions.CAMERA);

      if (status === 'granted') {
        this.props.navigation.navigate('BarCodeScanner');
      } else {
        alert('Denied access to camera!');
      }
    };

    return (
      <View style={{ padding: 10 }}>
        <Button onPress={_maybeNavigateToBarCodeScanner}>
          Open bar code scanner
        </Button>
      </View>
    );
  };

  _renderGestureHandler = () => {
    return (
      <View style={{ padding: 10 }}>
        <Button
          onPress={() => this.props.navigation.navigate('GestureHandlerPinch')}>
          Open GestureHandler pinch example
        </Button>
        <View style={{ marginTop: 10 }} />
        <Button
          onPress={() => this.props.navigation.navigate('GestureHandlerList')}>
          Open GestureHandler list example
        </Button>
      </View>
    );
  };

  _renderWebGL = () => {
    return (
      <View style={{ padding: 10 }}>
        <Button onPress={() => this.props.navigation.navigate('GLView')}>
          Open WebGL Example
        </Button>
      </View>
    );
  };

  _renderFacebookAds = () => {
    return (
      <View style={{ padding: 10 }}>
        <Button onPress={() => this.props.navigation.navigate('FacebookAds')}>
          Open Facebook Ads Example
        </Button>
      </View>
    );
  };

  _renderBlurView = () => {
    return <BlurViewExample />;
  };

  _renderLinearGradient = () => {
    return <LinearGradientExample />;
  };

  _renderVideo = () => {
    return (
      <View
        style={{
          flex: 1,
          padding: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Video
          source={require('../assets/videos/ace.mp4')}
          resizeMode="cover"
          style={{ width: 300, height: 300 }}
          isMuted={true}
          shouldPlay
          isLooping
        />
      </View>
    );
  };

  _renderGif = () => {
    return (
      <View
        style={{
          flex: 1,
          padding: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/cat.gif' }}
          style={{ height: 140, width: 200 }}
        />
      </View>
    );
  };

  render() {
    return (
      <ListView
        ref={view => {
          this._listView = view;
        }}
        stickySectionHeadersEnabled={true}
        removeClippedSubviews={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ backgroundColor: '#fff' }}
        dataSource={this.state.dataSource}
        renderRow={this._renderRow}
        renderSectionHeader={this._renderSectionHeader}
      />
    );
  }

  _scrollToTop = () => {
    this._listView.scrollTo({ x: 0, y: 0 });
  };

  _renderRow = renderRowFn => {
    return (
      <View>
        {renderRowFn && renderRowFn()}
      </View>
    );
  };

  _renderSectionHeader = (_, sectionTitle) => {
    return (
      <View style={styles.sectionHeader}>
        <Text>
          {sectionTitle}
        </Text>
      </View>
    );
  };
}
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
class BlurViewExample extends React.Component {
  state = {
    intensity: new Animated.Value(0),
  };

  componentDidMount() {
    this._animate();
  }

  _animate = () => {
    let { intensity } = this.state;
    let animateInConfig = {
      duration: 2500,
      toValue: 100,
      isInteraction: false,
    };
    let animateOutconfig = { duration: 2500, toValue: 0, isInteraction: false };

    Animated.timing(intensity, animateInConfig).start(value => {
      Animated.timing(intensity, animateOutconfig).start(this._animate);
    });
  };

  render() {
    const uri =
      'https://s3.amazonaws.com/exp-brand-assets/ExponentEmptyManifest_192.png';

    return (
      <View
        style={{
          flex: 1,
          padding: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image style={{ width: 180, height: 180 }} source={{ uri }} />

        <AnimatedBlurView
          tint="default"
          intensity={this.state.intensity}
          style={StyleSheet.absoluteFill}
        />
      </View>
    );
  }
}

class FacebookLoginExample extends React.Component {
  render() {
    let permissions = ['public_profile', 'email', 'user_friends'];

    return (
      <View style={{ padding: 10 }}>
        <Button
          onPress={() =>
            this._testFacebookLogin('1201211719949057', permissions)}>
          Authenticate with Facebook
        </Button>
      </View>
    );
  }

  _testFacebookLogin = async (id, perms, behavior = 'web') => {
    try {
      if (
        Platform.OS === 'android' ||
        Constants.appOwnership === 'standalone'
      ) {
        // iOS supports system too, native jumps over to the app though and people
        // seem to like that effect. I maybe prefer system.
        behavior = Platform.OS === 'ios' ? 'native' : 'system';
      }

      const result = await Expo.Facebook.logInWithReadPermissionsAsync(id, {
        permissions: perms,
        behavior,
      });

      const { type, token } = result;

      if (type === 'success') {
        Alert.alert('Logged in!', JSON.stringify(result), [
          {
            text: 'OK!',
            onPress: () => {
              console.log({ type, token });
            },
          },
        ]);
      }
    } catch (e) {
      Alert.alert('Error!', e.message, [{ text: 'OK', onPress: () => {} }]);
    }
  };
}

function incrementColor(color, step) {
  const intColor = parseInt(color.substr(1), 16);
  const newIntColor = (intColor + step).toString(16);
  return `#${'0'.repeat(6 - newIntColor.length)}${newIntColor}`;
}

class LinearGradientExample extends React.Component {
  state = {
    count: 0,
    colorTop: '#000000',
    colorBottom: '#cccccc',
  };

  componentDidMount() {
    this._interval = setInterval(() => {
      this.setState({
        count: this.state.count + 1,
        colorTop: incrementColor(this.state.colorTop, 1),
        colorBottom: incrementColor(this.state.colorBottom, -1),
      });
    }, 100);
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 10,
        }}>
        <LinearGradient
          colors={[this.state.colorTop, this.state.colorBottom]}
          style={{ width: 200, height: 200 }}
        />
        <Text style={{ color: this.state.colorTop }}>
          {this.state.colorTop}
        </Text>
        <Text style={{ color: this.state.colorBottom }}>
          {this.state.colorBottom}
        </Text>
      </View>
    );
  }
}

function Button(props) {
  return (
    <Touchable onPress={props.onPress} style={[styles.button, props.style]}>
      <Text style={styles.buttonText}>
        {props.children}
      </Text>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
  },
  sectionHeader: {
    backgroundColor: 'rgba(245,245,245,1)',
    paddingVertical: 5,
    paddingHorizontal: 10,
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
