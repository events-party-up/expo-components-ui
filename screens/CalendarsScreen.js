import React from 'react';
import { Alert, Button, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Calendar, Permissions } from 'expo';

class CalendarRow extends React.Component {
  render() {
    const { calendar } = this.props;
    const calendarTypeName =
      calendar.entityType === Calendar.EntityTypes.REMINDER ? 'Reminders' : 'Events';
    return (
      <View style={styles.calendarRow}>
        <Text style={styles.calendarName}>{calendar.title}</Text>
        <Text style={styles.calendarData}>{JSON.stringify(calendar)}</Text>
        <Button
          onPress={() => this.props.navigation.navigate(calendarTypeName, { calendar })}
          title={`View ${calendarTypeName}`}
        />
        {calendar.allowsModifications && (
          <Button onPress={() => this.props.updateCalendar(calendar.id)} title="Update Calendar" />
        )}
        {calendar.allowsModifications && (
          <Button onPress={() => this.props.deleteCalendar(calendar)} title="Delete Calendar" />
        )}
      </View>
    );
  }
}

export default class CalendarsScreen extends React.Component {
  static navigationOptions = {
    title: 'Calendars',
  };

  state = {
    haveCalendarPermissions: false,
    haveReminderPermissions: false,
    calendars: [],
    activeCalendarId: null,
    activeCalendarEvents: [],
    showAddNewEventForm: false,
    editingEvent: null,
  };

  _askForCalendarPermissions = async () => {
    const response = await Permissions.askAsync('calendar');
    const granted = response.status === 'granted';
    this.setState({
      haveCalendarPermissions: granted,
    });
    return granted;
  };

  _askForReminderPermissions = async () => {
    if (Platform.OS === 'android') return true;
    const response = await Permissions.askAsync('reminders');
    const granted = response.status === 'granted';
    this.setState({
      haveReminderPermissions: granted,
    });
    return granted;
  };

  _findCalendars = async () => {
    const calendarGranted = await this._askForCalendarPermissions();
    const reminderGranted = await this._askForReminderPermissions();
    if (calendarGranted && reminderGranted) {
      const eventCalendars = await Calendar.getCalendarsAsync('event');
      const reminderCalendars =
        Platform.OS === 'ios' ? await Calendar.getCalendarsAsync('reminder') : [];
      this.setState({ calendars: [...eventCalendars, ...reminderCalendars] });
    }
  };

  _addCalendar = async recurring => {
    const newCalendar = {
      title: 'cool new calendar',
      entityType: Calendar.EntityTypes.EVENT,
      color: '#c0ff33',
      sourceId:
        Platform.OS === 'ios'
          ? this.state.calendars.find(cal => cal.source && cal.source.name === 'Default').source.id
          : undefined,
      source:
        Platform.OS === 'android'
          ? {
              name: this.state.calendars.find(
                cal => cal.accessLevel == Calendar.CalendarAccessLevel.OWNER
              ).source.name,
              isLocalAccount: true,
            }
          : undefined,
      name: 'coolNewCalendar',
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
      ownerAccount:
        Platform.OS === 'android'
          ? this.state.calendars.find(cal => cal.accessLevel == Calendar.CalendarAccessLevel.OWNER)
              .ownerAccount
          : undefined,
    };
    try {
      await Calendar.createCalendarAsync(newCalendar);
      Alert.alert('Calendar saved successfully');
      this._findCalendars();
    } catch (e) {
      Alert.alert('Calendar not saved successfully', e.message);
    }
  };

  _updateCalendar = async calendarId => {
    const newCalendar = {
      title: 'cool updated calendar',
    };
    try {
      await Calendar.updateCalendarAsync(calendarId, newCalendar);
      Alert.alert('Calendar saved successfully');
      this._findCalendars();
    } catch (e) {
      Alert.alert('Calendar not saved successfully', e.message);
    }
  };

  _deleteCalendar = async calendar => {
    Alert.alert(`Are you sure you want to delete ${calendar.title}?`, 'This cannot be undone.', [
      {
        text: 'Cancel',
        onPress: () => {},
      },
      {
        text: 'OK',
        onPress: async () => {
          try {
            await Calendar.deleteCalendarAsync(calendar.id);
            Alert.alert('Calendar deleted successfully');
            this._findCalendars();
          } catch (e) {
            Alert.alert('Calendar not deleted successfully', e.message);
          }
        },
      },
    ]);
  };

  render() {
    if (this.state.calendars.length) {
      return (
        <ScrollView style={styles.container}>
          <Button onPress={this._addCalendar} title="Add New Calendar" />
          {this.state.calendars.map(calendar => (
            <CalendarRow
              calendar={calendar}
              key={calendar.id}
              navigation={this.props.navigation}
              updateCalendar={this._updateCalendar}
              deleteCalendar={this._deleteCalendar}
            />
          ))}
        </ScrollView>
      );
    }

    return (
      <View style={{ padding: 10 }}>
        <Button onPress={this._findCalendars} title="Find my Calendars" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 16,
    flex: 1,
  },
  calendarRow: {
    marginBottom: 12,
  },
  calendarName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  calendarData: {},
});
