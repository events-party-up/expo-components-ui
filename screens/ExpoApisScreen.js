import React from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
  AsyncStorage,
  Image,
  ListView,
  Platform,
  ProgressBarAndroid,
  ProgressViewIOS,
  StyleSheet,
  Text,
  TextInput,
  View,
  ToastAndroid,
} from 'react-native';
import Expo, {
  Constants,
  Contacts,
  DangerZone,
  DocumentPicker,
  FileSystem,
  Font,
  Fingerprint,
  KeepAwake,
  Location,
  ImagePicker,
  IntentLauncherAndroid,
  Notifications,
  Pedometer,
  Permissions,
  ScreenOrientation,
  SecureStore,
  WebBrowser,
} from 'expo';
import Touchable from 'react-native-platform-touchable';
import { withNavigation } from 'react-navigation';
import { MaterialIcons } from '@expo/vector-icons';

import NavigationEvents from '../utilities/NavigationEvents';
import Colors from '../constants/Colors';
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';

DangerZone.Branch.subscribe(bundle => {
  if (bundle && bundle.params && !bundle.error) {
    Alert.alert('Opened Branch link', JSON.stringify(bundle.params, null, 2));
  }
});

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
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );

    this._tabPressedListener = NavigationEvents.addListener(
      'selectedTabPressed',
      route => {
        if (route.key === 'ExpoApis') {
          this._scrollToTop();
        }
      }
    );
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
        message = `Push notification ${origin} with data: ${JSON.stringify(
          data
        )}`;
      } else {
        message = `Local notification ${origin} with data: ${JSON.stringify(
          data
        )}`;
      }
    }

    // Calling alert(message) immediately fails to show the alert on Android
    // if after backgrounding the app and then clicking on a notification
    // to foreground the app
    setTimeout(() => alert(message), 1000);
  };

  componentDidMount() {
    let dataSource = this.state.dataSource.cloneWithRowsAndSections({
      Constants: [this._renderConstants],
      Contacts: [this._renderContacts],
      DocumentPicker: [this._renderDocumentPicker],
      Facebook: [this._renderFacebook],
      FileSystem: [this._renderFileSystem],
      Font: [this._renderFont],
      Geocoding: [this._renderGeocoding],
      Google: [this._renderGoogle],
      ImagePicker: [this._renderImagePicker],
      KeepAwake: [this._renderKeepAwake],
      LocalNotification: [this._renderLocalNotification],
      Location: [this._renderLocation],
      'navigator.geolocation Polyfill (using Location)': [
        this._renderLocationPolyfill,
      ],
      NotificationBadge: [this._renderNotificationBadge],
      Pedometer: [this._renderPedometer],
      PushNotification: [this._renderPushNotification],
      ScreenOrientation: [this._renderScreenOrientation],
      ...Platform.select({
        android: {
          Settings: [this._renderSettings],
        },
        ios: {},
      }),
      Sensors: [this._renderSensors],
      SecureStore: [this._renderSecureStore],
      Speech: [this._renderSpeech],
      TouchID: [this._renderTouchID],
      Util: [this._renderUtil],
      WebBrowser: [this._renderWebBrowser],
    });

    this.setState({ dataSource });
  }

  _renderImagePicker = () => {
    const showCamera = async () => {
      let result = await ImagePicker.launchCameraAsync({});
      alert(JSON.stringify(result));
    };

    const showPhotos = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({});
      alert(JSON.stringify(result));
    };

    return (
      <View style={{ flexDirection: 'row', padding: 10 }}>
        <Button onPress={showCamera}>Open camera</Button>

        <Button onPress={showPhotos}>Open photos</Button>
      </View>
    );
  };

  _renderScreenOrientation = () => {
    return (
      <View style={{ padding: 10 }}>
        {Object.keys(ScreenOrientation.Orientation).map(orientation =>
          <Button
            key={orientation}
            style={{ marginBottom: 10 }}
            onPress={() => {
              ScreenOrientation.allow(orientation);
            }}>
            {orientation}
          </Button>
        )}
      </View>
    );
  };

  _renderPedometer = () => {
    return <PedometerExample />;
  };

  _renderDocumentPicker = () => {
    return <DocumentPickerExample />;
  };

  _renderConstants = () => {
    return <ConstantsExample />;
  };

  _renderContacts = () => {
    return <ContactsExample />;
  };

  _renderFacebook = () => {
    return <FacebookLoginExample />;
  };

  _renderGoogle = () => {
    return <GoogleLoginExample />;
  };

  _renderFileSystem = () => {
    return <FileSystemExample />;
  };

  _renderFont = () => {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            paddingVertical: 10,
            paddingHorizontal: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
            flex: 1,
          }}>
          <MaterialIcons name="airplay" size={25} />
          <MaterialIcons name="airport-shuttle" size={25} />
          <MaterialIcons name="alarm" size={25} />
          <MaterialIcons name="alarm-add" size={25} />
          <MaterialIcons name="alarm-off" size={25} />
          <MaterialIcons name="all-inclusive" size={25} />
        </View>

        <View style={{ paddingVertical: 10, paddingHorizontal: 15 }}>
          <Text style={[Font.style('space-mono'), { fontSize: 16 }]}>
            Font icons sets and other custom fonts can be loaded from the web
          </Text>
        </View>
      </View>
    );
  };

  _renderKeepAwake = () => {
    return <KeepAwakeExample />;
  };

  _renderNotificationBadge = () => {
    return <NotificationBadgeExample />;
  };

  _renderPushNotification = () => {
    return <PushNotificationExample />;
  };

  _renderLocalNotification = () => {
    return <LocalNotificationExample />;
  };

  _renderSensors = () => {
    return <SensorsExample />;
  };

  _renderTouchID = () => {
    return <TouchIDExample />;
  };

  _renderLocation = () => {
    return <LocationExample />;
  };

  _renderLocationPolyfill = () => {
    return <LocationExample polyfill={true} />;
  };

  _renderSettings = () => {
    return <SettingsExample />;
  };

  _renderGeocoding = () => {
    return (
      <View style={{ padding: 10 }}>
        <Button onPress={() => this.props.navigation.navigate('Geocoding')}>
          Go to Geocoding example
        </Button>
      </View>
    );
  };

  _renderSpeech = () => {
    return (
      <View style={{ padding: 10 }}>
        <Button onPress={() => this.props.navigation.navigate('Speech')}>
          Go to Text to Speech example
        </Button>
      </View>
    );
  };

  _renderSecureStore = () => {
    return <SecureStoreExample />;
  };

  _renderWebBrowser = () => {
    return (
      <View style={{ padding: 10 }}>
        <Button
          onPress={async () => {
            const result = await WebBrowser.openBrowserAsync(
              'https://www.google.com'
            );
            setTimeout(
              () => Alert.alert('Result', JSON.stringify(result, null, 2)),
              1000
            );
          }}>
          Open web url
        </Button>
      </View>
    );
  };

  _renderUtil = () => {
    return <UtilExample />;
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

const ExponentConstant = ({ name, object }) => {
  let value = Constants[name];

  if (object) {
    value = JSON.stringify(value);
  } else if (typeof value === 'boolean') {
    value = value ? 'true' : 'false';
  }

  return (
    <View style={{ flexDirection: 'row', flex: 1 }}>
      <Text numberOfLines={1} ellipsizeMode="tail" style={{ flex: 1 }}>
        <Text style={{ fontWeight: 'bold' }}>{name}</Text>: {value}
      </Text>
    </View>
  );
};

class ConstantsExample extends React.Component {
  state = {
    webViewUserAgent: null,
  };

  componentWillMount() {
    this._update();
  }

  _update = async () => {
    let webViewUserAgent = await Constants.getWebViewUserAgentAsync();
    this.setState({ webViewUserAgent });
  };

  render() {
    return (
      <View style={{ padding: 10 }}>
        <ExponentConstant name="expoVersion" />
        <ExponentConstant name="deviceId" />
        <ExponentConstant name="deviceName" />
        <ExponentConstant name="deviceYearClass" />
        <ExponentConstant name="sessionId" />
        <ExponentConstant name="linkingUri" />
        <ExponentConstant name="statusBarHeight" />
        <ExponentConstant name="isDevice" />
        <ExponentConstant name="appOwnership" />
        {Platform.OS === 'ios' && <ExponentConstant name="platform" object />}
        <Text>
          <Text style={{ fontWeight: 'bold' }}>getWebViewUserAgentAsync</Text>:{' '}
          {this.state.webViewUserAgent}
        </Text>
      </View>
    );
  }
}

const CONTACT_PAGE_SIZE = 4;

class ContactsExample extends React.Component {
  state = {
    contacts: null,
    page: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.page !== prevState.page) {
      this._findContacts();
    }
  }

  _findContacts = async page => {
    let permission = await Permissions.askAsync(Permissions.CONTACTS);
    if (permission.status !== 'granted') {
      setTimeout(
        () => Alert.alert('Contacts permission was not granted.'),
        100
      );
      return;
    }
    let result = await Contacts.getContactsAsync({
      fields: [Contacts.EMAILS, Contacts.PHONE_NUMBERS, Contacts.ADDRESSES],
      pageSize: CONTACT_PAGE_SIZE,
      pageOffset: this.state.page * CONTACT_PAGE_SIZE,
    });

    let contacts = result.data.map(contact => {
      return {
        id: contact.id,
        firstName: contact.firstName,
        name: contact.name,
        emails: contact.emails,
        phoneNumbers: contact.phoneNumbers,
        addresses: contact.addresses,
      };
    });

    this.setState({
      contacts,
      hasPreviousPage: result.hasPreviousPage,
      hasNextPage: result.hasNextPage,
    });
  };

  _nextPage = () => {
    this.setState(state => ({ page: state.page + 1 }));
  };

  _previousPage = () => {
    this.setState(state => ({ page: state.page - 1 }));
  };

  render() {
    if (this.state.contacts) {
      return (
        <View style={{ padding: 10 }}>
          <Text>
            {JSON.stringify(this.state.contacts)}
          </Text>
          {this.state.hasNextPage
            ? <Button onPress={this._nextPage} style={{ marginVertical: 10 }}>
                Next page
              </Button>
            : null}
          {this.state.hasPreviousPage
            ? <Button onPress={this._previousPage}>Previous page</Button>
            : null}
        </View>
      );
    }

    return (
      <View style={{ padding: 10 }}>
        <Button onPress={this._findContacts}>Find my contacts</Button>
      </View>
    );
  }
}

class DocumentPickerExample extends React.Component {
  state = {
    document: null,
  };

  _openPicker = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (result.type === 'success') {
      this.setState({ document: result });
    } else {
      setTimeout(() => {
        Alert.alert('Document picked', JSON.stringify(result, null, 2));
      }, 100);
    }
  };

  _renderDocument() {
    if (this.state.document === null) {
      return null;
    }
    return (
      <View>
        {this.state.document.uri.match(/\.(png|jpg)$/gi)
          ? <Image
              source={{ uri: this.state.document.uri }}
              resizeMode="cover"
              style={{ width: 100, height: 100 }}
            />
          : null}
        <Text>
          {this.state.document.name} ({this.state.document.size / 1000} KB)
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={{ padding: 10 }}>
        <Button onPress={this._openPicker}>Open document picker</Button>
        {this._renderDocument()}
      </View>
    );
  }
}

class LocationExample extends React.Component {
  state = {
    singleLocation: null,
    singleHeading: null,
    searching: false,
    watchLocation: null,
    watchHeading: null,
    providerStatus: null,
    subscription: null,
    headingSubscription: null,
    checkingProviderStatus: false,
  };

  _findSingleLocationWithPolyfill = () => {
    this.setState({ searching: true });
    navigator.geolocation.getCurrentPosition(
      location => {
        this.setState({ singleLocation: location, searching: false });
      },
      err => {
        console.log({ err });
        this.setState({ searching: false });
      },
      { enableHighAccuracy: true }
    );
  };

  _startWatchingLocationWithPolyfill = () => {
    let watchId = navigator.geolocation.watchPosition(
      location => {
        console.log(`Got location: ${JSON.stringify(location.coords)}`);
        this.setState({ watchLocation: location });
      },
      err => {
        console.log({ err });
      },
      {
        enableHighAccuracy: true,
        timeInterval: 1000,
        distanceInterval: 1,
      }
    );

    let subscription = {
      remove() {
        navigator.geolocation.clearWatch(watchId);
      },
    };

    this.setState({ subscription });
  };

  _findSingleLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      return;
    }

    try {
      this.setState({ searching: true });
      let result = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      });
      this.setState({ singleLocation: result });
    } finally {
      this.setState({ searching: false });
    }
  };

  _startWatchingLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      return;
    }

    let subscription = await Location.watchPositionAsync(
      {
        enableHighAccuracy: true,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      location => {
        console.log(`Got location: ${JSON.stringify(location.coords)}`);
        this.setState({ watchLocation: location });
      }
    );

    this.setState({ subscription });
  };

  _stopWatchingLocation = async () => {
    this.state.subscription.remove();
    this.setState({ subscription: null, watchLocation: null });
  };

  _getSingleHeading = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      return;
    }

    const heading = await Location.getHeadingAsync();
    this.setState({ singleHeading: heading });
  };

  _startWatchingHeading = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      return;
    }

    let subscription = await Location.watchHeadingAsync(heading => {
      this.setState({ watchHeading: heading });
    });
    this.setState({ headingSubscription: subscription });
  };

  _stopWatchingHeading = async () => {
    this.state.headingSubscription.remove();
    this.setState({ headingSubscription: null, watchHeading: null });
  };

  _checkProviderStatus = async () => {
    this.setState({
      checkingProviderStatus: true,
    });
    const status = await Location.getProviderStatusAsync();
    console.log(JSON.stringify(status));
    this.setState({
      providerStatus: status,
      checkingProviderStatus: false,
    });
  };

  renderSingleLocation() {
    if (this.state.searching) {
      return (
        <View style={{ padding: 10 }}>
          <ActivityIndicator />
        </View>
      );
    }

    if (this.state.singleLocation) {
      return (
        <View style={{ padding: 10 }}>
          <Text>
            {this.props.polyfill
              ? 'navigator.geolocation.getCurrentPosition'
              : 'Location.getCurrentPositionAsync'}
            :
          </Text>
          <Text>
            Latitude: {this.state.singleLocation.coords.latitude}
          </Text>
          <Text>
            Longitude: {this.state.singleLocation.coords.longitude}
          </Text>
        </View>
      );
    }

    return (
      <View style={{ padding: 10 }}>
        <Button
          onPress={
            this.props.polyfill
              ? this._findSingleLocationWithPolyfill
              : this._findSingleLocation
          }>
          Find my location once
        </Button>
      </View>
    );
  }

  renderProviderStatus() {
    if (this.state.checkingProviderStatus) {
      return (
        <View style={{ padding: 10 }}>
          <ActivityIndicator />
        </View>
      );
    }

    if (this.state.providerStatus) {
      return (
        <View style={{ padding: 10 }}>
          <Text>
            Enabled: {String(this.state.providerStatus.locationServicesEnabled)}
          </Text>
          <Text>
            GPS Available: {String(this.state.providerStatus.gpsAvailable)}
          </Text>
          <Text>
            Network Available:{' '}
            {String(this.state.providerStatus.networkAvailable)}
          </Text>
          <Text>
            Passive Available:{' '}
            {String(this.state.providerStatus.passiveAvailable)}
          </Text>
        </View>
      );
    }

    return (
      <View style={{ padding: 10 }}>
        <Button onPress={this._checkProviderStatus}>
          Check provider status
        </Button>
      </View>
    );
  }

  renderWatchLocation() {
    if (this.state.watchLocation) {
      return (
        <View style={{ padding: 10 }}>
          <Text>
            {this.props.polyfill
              ? 'navigator.geolocation.watchPosition'
              : 'Location.watchPositionAsync'}
            :
          </Text>
          <Text>
            Latitude: {this.state.watchLocation.coords.latitude}
          </Text>
          <Text>
            Longitude: {this.state.watchLocation.coords.longitude}
          </Text>
          <View style={{ padding: 10 }}>
            <Button onPress={this._stopWatchingLocation}>
              Stop Watching Location
            </Button>
          </View>
        </View>
      );
    } else if (this.state.subscription) {
      return (
        <View style={{ padding: 10 }}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={{ padding: 10 }}>
        <Button
          onPress={
            this.props.polyfill
              ? this._startWatchingLocationWithPolyfill
              : this._startWatchingLocation
          }>
          Watch my location
        </Button>
      </View>
    );
  }

  renderWatchCompass() {
    if (this.state.watchHeading) {
      return (
        <View style={{ padding: 10 }}>
          <Text>Location.watchHeadingAsync:</Text>
          <Text>
            Magnetic North: {this.state.watchHeading.magHeading}
          </Text>
          <Text>
            True North: {this.state.watchHeading.trueHeading}
          </Text>
          <Text>
            Accuracy: {this.state.watchHeading.accuracy}
          </Text>
          <View style={{ padding: 10 }}>
            <Button onPress={this._stopWatchingHeading}>
              Stop Watching Heading
            </Button>
          </View>
        </View>
      );
    }

    return (
      <View style={{ padding: 10 }}>
        <Button onPress={this._startWatchingHeading}>
          Watch my heading (compass)
        </Button>
      </View>
    );
  }

  renderSingleCompass() {
    if (this.state.singleHeading) {
      return (
        <View style={{ padding: 10 }}>
          <Text>Location.getHeadingAsync:</Text>
          <Text>
            Magnetic North: {this.state.singleHeading.magHeading}
          </Text>
          <Text>
            True North: {this.state.singleHeading.trueHeading}
          </Text>
          <Text>
            Accuracy: {this.state.singleHeading.accuracy}
          </Text>
        </View>
      );
    }

    return (
      <View style={{ padding: 10 }}>
        <Button onPress={this._getSingleHeading}>
          Find my heading (compass) heading
        </Button>
      </View>
    );
  }

  render() {
    return (
      <View>
        {this.props.polyfill ? null : this.renderProviderStatus()}
        {this.renderSingleLocation()}
        {this.renderWatchLocation()}
        {this.renderSingleCompass()}
        {this.renderWatchCompass()}
      </View>
    );
  }
}

class SettingsExample extends React.Component {
  renderSettingsLink(title, activity) {
    return (
      <View style={{ padding: 10 }}>
        <Button
          onPress={async () => {
            try {
              await IntentLauncherAndroid.startActivityAsync(activity);
              ToastAndroid.show(`Activity finished`, ToastAndroid.SHORT);
            } catch (e) {
              ToastAndroid.show(
                `An error occurred: ${e.message}`,
                ToastAndroid.SHORT
              );
            }
          }}>
          {title}
        </Button>
      </View>
    );
  }

  render() {
    return (
      <View>
        {this.renderSettingsLink(
          'Location Settings',
          IntentLauncherAndroid.ACTION_LOCATION_SOURCE_SETTINGS
        )}
      </View>
    );
  }
}

@withNavigation
class SensorsExample extends React.Component {
  render() {
    return (
      <View style={{ padding: 10 }}>
        <Button onPress={() => this.props.navigation.navigate('Sensor')}>
          Try out sensors (Gyroscope, Accelerometer)
        </Button>
      </View>
    );
  }
}

class PedometerExample extends React.Component {
  state = { stepCount: null };
  _listener: { remove: () => void } = null;

  render() {
    return (
      <View style={{ padding: 10 }}>
        <Button
          style={{ marginBottom: 10 }}
          onPress={async () => {
            const result = await Pedometer.isAvailableAsync();
            Alert.alert('Pedometer result', `Is available: ${result}`);
          }}>
          Is available
        </Button>
        <Button
          style={{ marginBottom: 10 }}
          onPress={async () => {
            const end = new Date();
            const start = new Date();
            start.setDate(end.getDate() - 1);
            const result = await Pedometer.getStepCountAsync(start, end);
            Alert.alert(
              'Pedometer result',
              `Number of steps for the last day: ${result.steps}`
            );
          }}>
          Get steps count
        </Button>
        <Button
          style={{ marginBottom: 10 }}
          onPress={async () => {
            this._listener = Pedometer.watchStepCount(data => {
              this.setState({ stepCount: data.steps });
            });
          }}>
          Listen for step count updates
        </Button>
        <Button
          style={{ marginBottom: 10 }}
          onPress={async () => {
            if (this._listener) {
              this._listener.remove();
              this._listener = null;
            }
          }}>
          Stop listening for step count updates
        </Button>
        {this.state.stepCount !== null
          ? <Text>
              Total steps {this.state.stepCount}
            </Text>
          : null}
      </View>
    );
  }
}

class FileSystemExample extends React.Component {
  state = {
    downloadProgress: 0,
  };

  _download = async () => {
    const url = 'http://ipv4.download.thinkbroadband.com/5MB.zip';
    const fileUri = FileSystem.documentDirectory + '5MB.zip';
    const callback = downloadProgress => {
      const progress =
        downloadProgress.totalBytesWritten /
        downloadProgress.totalBytesExpectedToWrite;
      this.setState({
        downloadProgress: progress,
      });
    };
    const options = { md5: true };
    this.download = FileSystem.createDownloadResumable(
      url,
      fileUri,
      options,
      callback
    );

    try {
      const info = await FileSystem.getInfoAsync(fileUri);
      if (info) {
        await FileSystem.deleteAsync(fileUri);
      }
    } catch (e) {
      console.log(e);
    }

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
      await this.download.pauseAsync();
      await this._saveDownload();
      alert('Download paused...');
    } catch (e) {
      console.log(e);
    }
  };

  _saveDownload = async () => {
    try {
      await AsyncStorage.setItem(
        'pausedDownload',
        JSON.stringify(this.download.savable())
      );
    } catch (e) {
      console.log(e);
    }
  };

  _resume = async () => {
    if (this.download == null) {
      alert('Initiate a download first!');
      return;
    }
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
      const downloadFromStore = JSON.parse(downloadJson);
      if (downloadFromStore !== null) {
        const callback = downloadProgress => {
          const progress =
            downloadProgress.totalBytesWritten /
            downloadProgress.totalBytesExpectedToWrite;
          this.setState({
            downloadProgress: progress,
          });
        };
        this.download = new FileSystem.downloadResumable(
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
      Alert.alert('File Info:', JSON.stringify(info), [
        { text: 'OK', onPress: () => {} },
      ]);
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
      <View style={{ padding: 10 }}>
        <Button
          style={{ marginBottom: 10 }}
          onPress={this._download}
          title="Start">
          Start Downloading file (5mb)
        </Button>
        <Button
          style={{ marginBottom: 10 }}
          onPress={this._pause}
          title="Pause">
          Pause Download
        </Button>
        <Button
          style={{ marginBottom: 10 }}
          onPress={this._resume}
          title="Resume">
          Resume Download
        </Button>
        {progress}
        <Button
          style={{ marginBottom: 10 }}
          onPress={this._getInfo}
          title="Info">
          Get Info
        </Button>
      </View>
    );
  }
}

class TouchIDExample extends React.Component {
  state = {
    waiting: false,
  };

  render() {
    let authFunction = async () => {
      this.setState({ waiting: true });
      try {
        let result = await Fingerprint.authenticateAsync(
          'This message only shows up on iOS'
        );
        if (result.success) {
          alert('Authenticated!');
        } else {
          alert('Failed to authenticate');
        }
      } finally {
        this.setState({ waiting: false });
      }
    };

    return (
      <View style={{ padding: 10 }}>
        <Button onPress={authFunction}>
          {this.state.waiting
            ? 'Waiting for fingerprint... '
            : 'Authenticate with fingerprint'}
        </Button>
      </View>
    );
  }
}

class NotificationBadgeExample extends React.Component {
  render() {
    return (
      <View style={{ padding: 10 }}>
        <Button onPress={this._incrementIconBadgeNumberAsync}>
          Increment the app icon's badge number
        </Button>

        <View style={{ height: 10 }} />

        <Button onPress={this._clearIconBadgeAsync}>
          Clear the app icon's badge number
        </Button>
      </View>
    );
  }

  _incrementIconBadgeNumberAsync = async () => {
    let currentNumber = await Notifications.getBadgeNumberAsync();
    await Notifications.setBadgeNumberAsync(currentNumber + 1);
    let actualNumber = await Notifications.getBadgeNumberAsync();
    global.alert(`Set the badge number to ${actualNumber}`);
  };

  _clearIconBadgeAsync = async () => {
    await Notifications.setBadgeNumberAsync(0);
    global.alert(`Cleared the badge`);
  };
}

class PushNotificationExample extends React.Component {
  render() {
    return (
      <View style={{ padding: 10 }}>
        <Button onPress={this._sendNotification}>
          Send me a push notification!
        </Button>
      </View>
    );
  }

  _sendNotification = async () => {
    registerForPushNotificationsAsync();
  };
}

class KeepAwakeExample extends React.Component {
  _activate = () => {
    KeepAwake.activate();
  };

  _deactivate = () => {
    KeepAwake.deactivate();
  };

  render() {
    return (
      <View style={{ padding: 10 }}>
        <Button style={{ marginBottom: 10 }} onPress={this._activate}>
          Activate
        </Button>
        <Button onPress={this._deactivate}>Deactivate</Button>
      </View>
    );
  }
}

class LocalNotificationExample extends React.Component {
  render() {
    return (
      <View style={{ padding: 10 }}>
        <Button onPress={this._presentLocalNotification}>
          Present a notification immediately
        </Button>

        <View style={{ height: 10 }} />

        <Button onPress={this._scheduleLocalNotification}>
          Schedule notification for 10 seconds from now
        </Button>
      </View>
    );
  }

  _presentLocalNotification = () => {
    Notifications.presentLocalNotificationAsync({
      title: 'Here is a local notification!',
      body: 'This is the body',
      data: {
        hello: 'there',
      },
      ios: {
        sound: true,
      },
      android: {
        vibrate: true,
      },
    });
  };

  _scheduleLocalNotification = () => {
    Notifications.scheduleLocalNotificationAsync(
      {
        title: 'Here is a scheduled notifiation!',
        body: 'This is the body',
        data: {
          hello: 'there',
          future: 'self',
        },
        ios: {
          sound: true,
        },
        android: {
          vibrate: true,
        },
      },
      {
        time: new Date().getTime() + 10000,
      }
    );
  };
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

class GoogleLoginExample extends React.Component {
  render() {
    return (
      <View style={{ padding: 10 }}>
        <Button onPress={() => this._testGoogleLogin()}>
          Authenticate with Google
        </Button>
      </View>
    );
  }

  _testGoogleLogin = async () => {
    try {
      const result = await Expo.Google.logInAsync({
        androidStandaloneAppClientId:
          '603386649315-87mbvgc739sec2gjtptl701ha62pi98p.apps.googleusercontent.com',
        androidClientId:
          '603386649315-9rbv8vmv2vvftetfbvlrbufcps1fajqf.apps.googleusercontent.com',
        iosStandaloneAppClientId:
          '603386649315-1b2o2gole94qc6h4prj6lvoiueq83se4.apps.googleusercontent.com',
        iosClientId:
          '603386649315-vp4revvrcgrcjme51ebuhbkbspl048l9.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });

      const { type } = result;

      if (type === 'success') {
        // Avoid race condition with the WebView hiding when using web-based sign in
        setTimeout(() => {
          Alert.alert('Logged in!', JSON.stringify(result), [
            {
              text: 'OK!',
              onPress: () => {
                console.log({ result });
              },
            },
          ]);
        }, 1000);
      }
    } catch (e) {
      Alert.alert('Error!', e.message, [{ text: 'OK :(', onPress: () => {} }]);
    }
  };
}

class UtilExample extends React.Component {
  state = {
    locale: null,
    deviceCountry: null,
    timeZone: null,
  };

  componentWillMount() {
    this._update();
    AppState.addEventListener('change', this._update);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._update);
  }

  _update = async () => {
    let locale = await Expo.Util.getCurrentLocaleAsync();
    let deviceCountry = await Expo.Util.getCurrentDeviceCountryAsync();
    let timeZone = await Expo.Util.getCurrentTimeZoneAsync();
    this.setState({ locale, deviceCountry, timeZone });
  };

  render() {
    return (
      <View style={{ padding: 10 }}>
        <Text>
          Locale: {this.state.locale}
        </Text>
        <Text>
          Device Country: {this.state.deviceCountry}
        </Text>
        <Text>
          Time Zone: {this.state.timeZone}
        </Text>
        <Button
          onPress={async () => {
            Expo.Util.reload();
          }}>
          Util.reload()
        </Button>
      </View>
    );
  }
}

class SecureStoreExample extends React.Component {
  state = {
    key: null,
    value: null,
  };

  _setValue = async (value, key) => {
    try {
      console.log('securestore: ' + SecureStore);
      await SecureStore.setValueWithKeyAsync(value, key, {});
      Alert.alert(
        'Success!',
        'Value: ' + value + ', stored successfully for key: ' + key,
        [{ text: 'OK', onPress: () => {} }]
      );
    } catch (e) {
      Alert.alert('Error!', e.message, [{ text: 'OK', onPress: () => {} }]);
    }
  };

  _getValue = async key => {
    try {
      const fetchedValue = await SecureStore.getValueWithKeyAsync(key, {});
      Alert.alert('Success!', 'Fetched value: ' + fetchedValue, [
        { text: 'OK', onPress: () => {} },
      ]);
    } catch (e) {
      Alert.alert('Error!', e.message, [{ text: 'OK', onPress: () => {} }]);
    }
  };

  _deleteValue = async key => {
    try {
      await SecureStore.deleteValueWithKeyAsync(key, {});
      Alert.alert('Success!', 'Value deleted', [
        { text: 'OK', onPress: () => {} },
      ]);
    } catch (e) {
      Alert.alert('Error!', e.message, [{ text: 'OK', onPress: () => {} }]);
    }
  };

  render() {
    return (
      <View
        style={{
          padding: 10,
        }}>
        <TextInput
          style={{
            marginBottom: 10,
            padding: 10,
            height: 40,
            borderColor: '#000000',
            borderWidth: 1,
          }}
          placeholder="Enter a value to store (ex. pw123!)"
          value={this.state.value}
          onChangeText={text =>
            this.setState({
              value: text,
            })}
        />
        <TextInput
          style={{
            marginBottom: 10,
            padding: 10,
            height: 40,
            borderColor: '#000000',
            borderWidth: 1,
          }}
          placeholder="Enter a key for the value (ex. password)"
          value={this.state.key}
          onChangeText={text =>
            this.setState({
              key: text,
            })}
        />
        <Button
          style={{ marginBottom: 10 }}
          onPress={() => {
            this._setValue(this.state.value, this.state.key);
          }}
          title="Store value with key">
          Store value with key
        </Button>
        <Button
          style={{ marginBottom: 10 }}
          onPress={() => {
            this._getValue(this.state.key);
          }}
          title="Get value with key">
          Get value with key
        </Button>
        <Button
          style={{ marginBottom: 10 }}
          onPress={() => {
            this._deleteValue(this.state.key);
          }}
          title="Delete value with key">
          Delete value with key
        </Button>
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
