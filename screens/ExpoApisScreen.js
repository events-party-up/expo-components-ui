import React from 'react';
import {
  Alert,
  ListView,
  PixelRatio,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import Expo, { DangerZone, Notifications } from 'expo';
import { Entypo } from '@expo/vector-icons';
import NavigationEvents from '../utilities/NavigationEvents';

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
    let dataSource = this.state.dataSource.cloneWithRowsAndSections(
      this._getSections().reduce((sections, name) => {
        sections[name] = [() => this._renderExampleSection(name)];
        return sections;
      }, {})
    );

    this.setState({ dataSource });
  }

  _renderExampleSection = exampleName => {
    return (
      <TouchableHighlight
        underlayColor="#dddddd"
        style={styles.rowTouchable}
        onPress={() => this.props.navigation.navigate(exampleName)}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>{exampleName}</Text>
          <Text style={styles.rowDecorator}>
            <Entypo name="chevron-right" size={16} color="#aaaaaa" />
          </Text>
        </View>
      </TouchableHighlight>
    );
  };

  _getSections = () => {
    return [
      'AuthSession',
      'Calendars',
      'Constants',
      'Contacts',
      'DocumentPicker',
      'FacebookLogin',
      'FileSystem',
      'Fingerprint',
      'Font',
      'Geocoding',
      'GoogleLogin',
      'ImagePicker',
      'ImageManipulator',
      'IntentLauncher',
      'KeepAwake',
      'Notification',
      'Location',
      'MailComposer',
      'Pedometer',
      'ScreenOrientation',
      'Sensor',
      'SecureStore',
      'Speech',
      'Util',
      'WebBrowser',
    ];
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
      />
    );
  }

  _scrollToTop = () => {
    this._listView.scrollTo({ x: 0, y: 0 });
  };

  _renderRow = renderRowFn => {
    return <View>{renderRowFn && renderRowFn()}</View>;
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowDecorator: {
    alignSelf: 'flex-end',
    paddingRight: 4,
  },
  rowTouchable: {
    paddingHorizontal: 10,
    paddingVertical: 14,
    borderBottomWidth: 1.0 / PixelRatio.get(),
    borderBottomColor: '#dddddd',
  },
  rowLabel: {
    flex: 1,
  },
});
