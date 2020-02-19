// file that includes all the standard things i generally load in one file
import autobind from "autobind-decorator";
import _ from "lodash";
import { action, computed, observable } from "mobx";
import { observer } from "mobx-react";
import moment from "moment";
import React, { Component } from "react";
import { ActionSheetIOS, ActivityIndicator, Alert, AlertIOS, Animated, Dimensions, FlatList, Image, ListView, Modal, Picker, PickerIOS, Platform, ScrollView, Share, StatusBar, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, View, WebView } from "react-native";
import { v4 } from "uuid";
import UserStore from "./mobx/stores/UserStore";
import { COLORS, FONTS, h } from "./style";

let getUserId = () => UserStore.user.id;

moment.locale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "seconds",
    ss: "%ss",
    m: "a minute",
    mm: "%dm",
    h: "an hour",
    hh: "%dh",
    d: "a day",
    dd: "%dd",
    M: "a month",
    MM: "%dM",
    y: "a year",
    yy: "%dY"
  }
});

let windowWidth = Dimensions.get("window").width;
let windowHeight = Dimensions.get("window").height;

let s = el => a => (el = a);

let jpg = url => url.substr(0, url.lastIndexOf(".")) + ".jpg";

let ozConv = n => {
  if (n == 0) {
    return "0";
  } else {
    let whole = Math.floor(n / 8);
    let rem = n % 8;
    let down = 8;

    if (rem == 0) {
      return `${whole}`;
    }

    for (let k = 7; k > 1; k--) {
      if (rem % k == 0 && down % k == 0) {
        rem = Math.floor(rem / k);
        down = Math.floor(down / k);
      }
    }

    if (whole == 0) {
      return `${rem}/${down}`;
    }

    return `${whole} ${rem}/${down}`;
  }
};

let convertFraction = (unit, amount) => {
  if (unit == "oz") {
    let help = amount.replace(" oz", "").split(" ");

    let num = 0;

    for (let el of help) {
      let s = el.split("/");
      if (s.length == 1) {
        num += parseInt(el, 10) * 8;
      } else {
        num += parseInt(s[0], 10) * Math.floor(8 / parseInt(s[1], 10));
      }
    }

    return num;
  } else {
    return parseInt(amount.split(" ")[0], 10);
  }
};

let showLog = msg => {
  console.log(msg);
};

let showAlert = msg => {
  Alert.alert(
    "",
    "" + msg,
    [
      {
        text: "OK",
        onPress: () => {
          showLog("OK Pressed");
        }
      }
    ],
    {
      cancelable: false
    }
  );
};

let showAlertWithCallback = (msg, press) => {
  Alert.alert(
    "",
    "" + msg,
    [
      {
        text: "OK",
        onPress: () => {
          showLog("OK Pressed");
          if(press) {
            press();
          }
        }
      }
    ],
    {
      cancelable: false
    }
  );
};

let showCustomAlertWithCallback = (msg, okMsg,cancelMsg ,onPressOk,onPressCancel) => {
  Alert.alert(
    "",
    "" + msg,
    [
      {
        text: okMsg,
        onPress: () => {
          showLog("OK Pressed");
          if(onPressOk) {
            onPressOk();
          }
        }
      },
      {
        text: cancelMsg,
        onPress: () => {
          showLog("CANCEL Pressed");
          if(onPressCancel) {
            onPressCancel();
          }
        }
      }
    ],
    {
      cancelable: false
    }
  );
};

export {
_, // lodash
  observer, // mobx
  h, s, FONTS, autobind, React, // react
  Component, convertFraction, AlertIOS, Alert, COLORS, windowWidth, windowHeight, moment, v4, ozConv,
  // mobx
  observable, computed, action,
  // react-native components
  ActionSheetIOS, PickerIOS, ActivityIndicator, WebView, Picker, Animated, Modal, StatusBar, ScrollView, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Dimensions, getUserId, ListView, FlatList, jpg, showLog, showAlert, Share, showAlertWithCallback,showCustomAlertWithCallback
};
