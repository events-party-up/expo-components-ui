import { Permissions, Notifications } from 'expo';

// In this test app we contact the Expo push service directly. You *never*
// should do this in a real app. You should always store the push tokens on your
// own server or use the local notification API if you want to notify this user.
const PUSH_ENDPOINT = 'https://expo.io/--/api/v2/push/send';

export default async function registerForPushNotificationsAsync() {
  // Android remote notification permissions are granted during the app
  // install, so this will only ask on iOS
  let { status } = await Permissions.askAsync(Permissions.REMOTE_NOTIFICATIONS);

  // Stop here if the user did not grant permissions
  if (status !== 'granted') {
    console.log(
      `This device doesn't have permissions to show push notifications`
    );
    return;
  }

  // Get the token that uniquely identifies this device
  let token = await Notifications.getExpoPushTokenAsync();

  // Log it so we can easily copy it if we need to work with it
  console.log(`Got this device's push token: ${token}`);

  // POST the token to the Expo push server
  let receipts = await fetch(PUSH_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([
      {
        to: token,
        title: 'Welcome to Expo!',
        body: 'Native Component List is registered for push notifications.',
        data: { example: 'sample data' },
      },
    ]),
  });

  let receipt = receipts[0];
  if (receipt.status === 'error') {
    console.warn(
      `Expo push service reported an error sending a notification: ${error
        .details.error}`
    );
    if (receipt.__debug) {
      console.warn(receipt.__debug);
    }
  }
}
