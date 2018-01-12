import React from 'react';
import { Alert, Button, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'expo';

class EventRow extends React.Component {
  render() {
    const { event } = this.props;
    return (
      <View style={styles.eventRow}>
        <Text style={styles.eventName}>{event.title}</Text>
        <Text style={styles.eventData}>{JSON.stringify(event)}</Text>
        <Button onPress={() => this.props.getEvent(event)} title="Get Event Using ID" />
        <Button onPress={() => this.props.getAttendees(event)} title="Get Attendees for Event" />
        <Button onPress={() => this.props.updateEvent(event)} title="Update Event" />
        <Button onPress={() => this.props.deleteEvent(event)} title="Delete Event" />
        {Platform.OS === 'android' && (
          <Button
            onPress={() => this.props.openEventInCalendar(event)}
            title="Open in Calendar App"
          />
        )}
      </View>
    );
  }
}

export default class EventsScreen extends React.Component {
  static navigationOptions = {
    title: 'Events',
  };

  state = {
    events: [],
  };

  componentDidMount() {
    const { params } = this.props.navigation.state;
    const { id } = params.calendar;
    if (id) {
      this._findEvents(id);
    }
  }

  _findEvents = async id => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const events = await Calendar.getEventsAsync([id], yesterday, nextYear);
    this.setState({ events });
  };

  _addEvent = async recurring => {
    const { calendar } = this.props.navigation.state.params;
    if (!calendar.allowsModifications) {
      Alert.alert('This calendar does not allow modifications');
      return;
    }
    const timeInOneHour = new Date();
    timeInOneHour.setHours(timeInOneHour.getHours() + 1);
    const newEvent = {
      title: 'Celebrate Expo',
      location: '420 Florence St',
      startDate: new Date(),
      endDate: timeInOneHour,
      notes: "It's cool",
      timeZone: 'America/Los_Angeles',
    };
    if (recurring) {
      newEvent.recurrenceRule = {
        occurrence: 5,
        frequency: 'daily',
      };
    }
    try {
      await Calendar.createEventAsync(calendar.id, newEvent);
      Alert.alert('Event saved successfully');
      this._findEvents(calendar.id);
    } catch (e) {
      Alert.alert('Event not saved successfully', e.message);
    }
  };

  _getEvent = async event => {
    try {
      const newEvent = await Calendar.getEventAsync(event.id, {
        futureEvents: false,
        instanceStartDate: event.startDate,
      });
      Alert.alert('Event found using getEventAsync', JSON.stringify(newEvent));
    } catch (e) {
      Alert.alert('Error finding event', e.message);
    }
  };

  _getAttendees = async event => {
    try {
      const attendees = await Calendar.getAttendeesForEventAsync(event.id, {
        futureEvents: false,
        instanceStartDate: event.startDate,
      });
      Alert.alert('Attendees found using getAttendeesForEventAsync', JSON.stringify(attendees));
    } catch (e) {
      Alert.alert('Error finding attendees', e.message);
    }
  };

  _updateEvent = async event => {
    const { calendar } = this.props.navigation.state.params;
    if (!calendar.allowsModifications) {
      Alert.alert('This calendar does not allow modifications');
      return;
    }
    const newEvent = {
      title: 'update test',
    };
    try {
      await Calendar.updateEventAsync(event.id, newEvent, {
        futureEvents: false,
        instanceStartDate: event.startDate,
      });
      Alert.alert('Event saved successfully');
      this._findEvents(calendar.id);
    } catch (e) {
      Alert.alert('Event not saved successfully', e.message);
    }
  };

  _deleteEvent = async event => {
    try {
      const { calendar } = this.props.navigation.state.params;
      await Calendar.deleteEventAsync(event.id, {
        futureEvents: false,
        instanceStartDate: event.recurrenceRule ? event.startDate : undefined,
      });
      Alert.alert('Event deleted successfully');
      this._findEvents(calendar.id);
    } catch (e) {
      Alert.alert('Event not deleted successfully', e.message);
    }
  };

  _openEventInCalendar = event => {
    Calendar.openEventInCalendar(event.id);
  };

  render() {
    if (this.state.events.length) {
      return (
        <ScrollView style={styles.container}>
          <Button onPress={() => this._addEvent(false)} title="Add New Event" />
          <Button onPress={() => this._addEvent(true)} title="Add New Recurring Event" />
          {this.state.events.map(event => (
            <EventRow
              event={event}
              key={`${event.id}${event.startDate}`}
              getEvent={this._getEvent}
              getAttendees={this._getAttendees}
              updateEvent={this._updateEvent}
              deleteEvent={this._deleteEvent}
              openEventInCalendar={this._openEventInCalendar}
            />
          ))}
        </ScrollView>
      );
    }

    return (
      <View style={{ padding: 10 }}>
        <Text>This calendar has no events.</Text>
        <Button onPress={() => this._addEvent(false)} title="Add New Event" />
        <Button onPress={() => this._addEvent(true)} title="Add New Recurring Event" />
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
  eventRow: {
    marginBottom: 12,
  },
  eventName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventData: {},
});
