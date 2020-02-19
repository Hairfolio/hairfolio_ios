import { Platform } from "react-native";
import firebase from "react-native-firebase";
import { showLog } from "./helpers";

const iosConfig = {
  clientId: "375699502310-5jvbdhtvvlkg756cer6nm4d6i9nkob7b.apps.googleusercontent.com",
  appId: "1:375699502310:ios:cdc2d786e5fe7bf1",
  apiKey: "AIzaSyD2RgOQA0WPglm22jzaYTDYzrME6Bee8No",
  databaseURL: "https://hairfolio-5e3ab.firebaseio.com",
  storageBucket: "hairfolio-5e3ab.appspot.com",
  messagingSenderId: "375699502310",
  projectId: "hairfolio-5e3ab",
  persistence: true
};

const FB = {
  initialize: () => {
    if (firebase.app()) {
      return firebase.app();
    } else {
      return firebase.initializeApp(
        iosConfig,
        "HairFolio"
      );
    }
  },
  onReady: () => {
    return new Promise((resolve, reject) => {
      firebase
        .app()
        .onReady()
        .then(
          app => {
            resolve(true);
          },
          error => {
            reject(false);
          }
        );
    });
  },
  onMessageReceived: () => {
    firebase.notifications().onNotification(notification => {
      showLog("onMessageReceived ==>")
      if (Platform.OS == "ios") {
        firebase
          .notifications()
          .displayNotification(notification)
          .catch(err => console.error(err));
      } else {
        notification.android
          .setChannelId("test-channel")
          .android.setSmallIcon("ic_launcher")
          .android.setPriority(firebase.notifications.Android.Priority.High);
        firebase
          .notifications()
          .displayNotification(notification)
          .catch(err => alert(err));
        //console.error(err));
      }
    });
  },
  clearBadge: () => {
    const localNotification = new firebase.notifications.Notification()
    
    if (Platform.OS == "ios") {
      localNotification.ios.setBadge(0);
    } else {
      localNotification.android.setBadge(0);
    }

        firebase
        .notifications()
        .displayNotification(localNotification)
        .catch(err => console.error(err));

        firebase
          .notifications()
          .removeAllDeliveredNotifications()
          .catch(error => utility.showLog(error));
  },
  setBadge: () => {
    const localNotification = new firebase.notifications.Notification()
    
    if (Platform.OS == "ios") {
      localNotification.ios.setBadge(55);
    } else {
      localNotification.android.setBadge(0);
    }

        firebase
        .notifications()
        .displayNotification(localNotification)
        .catch(err => console.error(err));

        firebase
          .notifications()
          .removeAllDeliveredNotifications()
          .catch(error => utility.showLog(error));
  }
  
};
export default FB;