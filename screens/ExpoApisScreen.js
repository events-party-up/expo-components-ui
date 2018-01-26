import React from 'react';
import { Alert, Image, ListView, Platform, StyleSheet, Text, View } from 'react-native';
import Expo, { DangerZone, Notifications, Video, WebBrowser } from 'expo';
import Touchable from 'react-native-platform-touchable';
import { withNavigation } from 'react-navigation';

import NavigationEvents from '../utilities/NavigationEvents';
import Colors from '../constants/Colors';

DangerZone.Branch.subscribe(bundle => {
  if (bundle && bundle.params && !bundle.error) {
    Alert.alert('Opened Branch link', JSON.stringify(bundle.params, null, 2));
  }
});

@withNavigation
class GoToExampleButton extends React.Component {
  render() {
    return (
      <View style={{ padding: 10 }}>
        <Button onPress={() => this.props.navigation.navigate(this.props.name)}>
          Go to {this.props.name} example
        </Button>
      </View>
    );
  }
}

export default class ExpoApisScreen extends React.Component {
  static navigationOptions = {
    title: 'APIs in Expo SDK',
  };

  state = {
    dataSource: new ListView.DataSource({
      rowHasChanged: () => false,
      sectionHeaderHasChanged: () => false,
    }),
  };

  componentWillMount() {
    this._notificationSubscription = Notifications.addListener(this._handleNotification);

    this._tabPressedListener = NavigationEvents.addListener('selectedTabPressed', route => {
      if (route.key === 'ExpoApis') {
        this._scrollToTop();
      }
    });
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
    this._tabPressedListener.remove();
  }

  _handleNotification = notification => {
    let { data, origin, remote } = notification;
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }

    /**
     * Currently on Android this will only fire when selected for local
     * notifications, and there is no way to distinguish between local
     * and remote notifications
     */

    let message;
    if (Platform.OS === 'android') {
      message = `Notification ${origin} with data: ${JSON.stringify(data)}`;
    } else {
      if (remote) {
        message = `Push notification ${origin} with data: ${JSON.stringify(data)}`;
      } else {
        message = `Local notification ${origin} with data: ${JSON.stringify(data)}`;
      }
    }

    // Calling alert(message) immediately fails to show the alert on Android
    // if after backgrounding the app and then clicking on a notification
    // to foreground the app
    setTimeout(() => alert(message), 1000);
  };

  componentDidMount() {
    let dataSource = this.state.dataSource.cloneWithRowsAndSections({
      AuthSession: [this._renderAuthSession],
      Calendars: [this._renderCalendars],
      Constants: [this._renderConstants],
      Contacts: [this._renderContacts],
      DocumentPicker: [this._renderDocumentPicker],
      FacebookLogin: [this._renderFacebookLogin],
      FileSystem: [this._renderFileSystem],
      Fingerprint: [this._renderFingerprint],
      Font: [this._renderFont],
      Geocoding: [this._renderGeocoding],
      GoogleLogin: [this._renderGoogleLogin],
      ImagePicker: [this._renderImagePicker],
      ImageManipulator: [this._renderImageManipulator],
      IntentLauncher: [this._renderIntentLauncher],
      KeepAwake: [this._renderKeepAwake],
      Notification: [this._renderNotification],
      Location: [this._renderLocation],
      MailComposer: [this._renderMailComposer],
      NotificationBadge: [this._renderNotificationBadge],
      Pedometer: [this._renderPedometer],
      PushNotification: [this._renderPushNotification],
      ScreenOrientation: [this._renderScreenOrientation],
      Sensors: [this._renderSensors],
      SecureStore: [this._renderSecureStore],
      Speech: [this._renderSpeech],
      Util: [this._renderUtil],
      WebBrowser: [this._renderWebBrowser],
    });

    this.setState({ dataSource });
  }

  _renderScreenOrientation = () => {
    return <GoToExampleButton name="ScreenOrientation" />;
  };

  _renderImagePicker = () => {
    return <GoToExampleButton name="ImagePicker" />;
  };

  _renderImageManipulator = () => {
    return <GoToExampleButton name="ImageManipulator" />;
  };

  _renderPedometer = () => {
    return <GoToExampleButton name="Pedometer" />;
  };

  _renderDocumentPicker = () => {
    return <GoToExampleButton name="DocumentPicker" />;
  };

  _renderAuthSession = () => {
    return <GoToExampleButton name="AuthSession" />;
  };

  _renderCalendars = () => {
    return <GoToExampleButton name="Calendars" />;
  };

  _renderConstants = () => {
    return <GoToExampleButton name="Constants" />;
  };

  _renderContacts = () => {
    return <GoToExampleButton name="Contacts" />;
  };

  _renderFacebookLogin = () => {
    return <GoToExampleButton name="FacebookLogin" />;
  };

  _renderGoogleLogin = () => {
    return <GoToExampleButton name="GoogleLogin" />;
  };

  _renderFileSystem = () => {
    return <GoToExampleButton name="FileSystem" />;
  };

  _renderFont = () => {
    return <GoToExampleButton name="Font" />;
  };

  _renderKeepAwake = () => {
    return <GoToExampleButton name="KeepAwake" />;
  };

  _renderNotification = () => {
    return <GoToExampleButton name="Notification" />;
  };

  _renderSensors = () => {
    return <GoToExampleButton name="Sensor" />;
  };

  _renderFingerprint = () => {
    return <GoToExampleButton name="Fingerprint" />;
  };

  _renderLocation = () => {
    return <GoToExampleButton name="Location" />;
  };

  _renderIntentLauncher = () => {
    return <GoToExampleButton name="IntentLauncher" />;
  };

  _renderGeocoding = () => {
    return <GoToExampleButton name="Geocoding" />;
  };

  _renderSpeech = () => {
    return <GoToExampleButton name="Speech" />;
  };

  _renderSecureStore = () => {
    return <GoToExampleButton name="SecureStore" />;
  };

  _renderMailComposer = () => {
    return <GoToExampleButton name="MailComposer" />;
  };

  _renderWebBrowser = () => {
    return <GoToExampleButton name="WebBrowser" />;
  };

  _renderUtil = () => {
    return <GoToExampleButton name="Util" />;
  };

  render() {
    return (
      <ListView
        ref={view => {
          this._listView = view;
        }}
        stickySectionHeadersEnabled
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
    return <View>{renderRowFn && renderRowFn()}</View>;
  };

  _renderSectionHeader = (_, sectionTitle) => {
    return (
      <View style={styles.sectionHeader}>
        <Text>{sectionTitle}</Text>
      </View>
    );
  };
}

function Button(props) {
  return (
    <Touchable onPress={props.onPress} style={[styles.button, props.style]}>
      <Text style={styles.buttonText}>{props.children}</Text>
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
