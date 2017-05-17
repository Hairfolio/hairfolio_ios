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
} from 'Hairfolio/src/helpers.js';

const LoadingScreen = observer(({store, style = {}}) => {
  if (!store.isLoading) {
    return null;
  }
  return (
    <View style={[loadingStyle, style]}>
      <ActivityIndicator size='large' />
      <Text style={{color: 'white', marginTop: 20}}>{store.loadingText}</Text>
    </View>
  );
});

const loadingStyle = {
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


export default LoadingScreen;
