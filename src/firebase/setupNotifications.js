import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AuthorizationStatus,
} from '@notifee/react-native';

// Request permission for receiving notifications (if not already granted)
async function requestNotificationPermission() {
  const authStatus = await messaging().requestPermission();

  const aa = await notifee.requestPermission();

  return authStatus === messaging.AuthorizationStatus.AUTHORIZED;
}

// Initialize notification listeners
async function initializeNotificationListeners() {
  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    vibration: true,
    vibrationPattern: [300, 500],
    sound: 'ambulance_notification',
    importance: AndroidImportance.HIGH,
  });

  // Handle foreground notifications
  const unsubscribe1 = messaging().onMessage(async remoteMessage => {
    // Handle the notification payload here
    const {title, body} = remoteMessage.notification;
    console.log('remoteMessage.notification', remoteMessage);
    const {image} = remoteMessage.data;

    // Display a notification
    await notifee.displayNotification({
      title,
      body,

      android: {
        channelId,
        sound: 'ambulance_notification',
        vibrationPattern: [300, 500],
        pressAction: {
          id: 'default',
        },
      },

      ios: {
        sound: 'ambulance_notification.mp3',
        attachments: [
          {
            // Remote image
            url: image,
          },
        ],
        foregroundPresentationOptions: {
          badge: true,
          sound: true,
          banner: true,
          list: true,
        },
      },
    });
  });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    // Handle the notification payload here
    const {title, body} = remoteMessage.notification;

    // Display a notification using Notifee
    await notifee.displayNotification({
      title,
      body,

      android: {
        channelId,
        sound: 'ambulance_notification',
        vibrationPattern: [300, 500],
        pressAction: {
          id: 'default',
        },
      },

      ios: {
        sound: 'ambulance_notification.mp3',
        foregroundPresentationOptions: {
          badge: true,
          sound: true,
          banner: true,
          list: true,
        },
      },
    });
  });
}

// Call this function to initialize notification handling
async function setupNotifications() {
  const permissionGranted = await requestNotificationPermission();

  console.log(permissionGranted);

  if (permissionGranted) {
    // Initialize notification listeners
    initializeNotificationListeners();
  }
}

export default setupNotifications;
