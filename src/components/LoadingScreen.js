import {
  _, // lodash
  observer, // mobx
  h,
  FONTS,
  autobind,
  React, // react
  Component,
  windowWidth,
  windowHeight,
  // react-native components
  AlertIOS,
  Modal,
  ScrollView,
  ActivityIndicator,
  StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'hairfolio/src/helpers.js';

const LoadinScreen = observer(({store}) => {
  if (!store.isLoading) {
    return null;
  }
  return (
    <View style={style}>
      <ActivityIndicator size='large' />
    </View>
  );
});

const style = {
  position: 'absolute',
  backgroundColor: 'black',
  opacity: 0.4,
  top: 0,
  left: 0,
  height: windowHeight,
  width: windowWidth,
  alignItems: 'center',
  justifyContent: 'center'
};


export default LoadinScreen;
