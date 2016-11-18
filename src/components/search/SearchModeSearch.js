import {
  _, // lodash
  v4,
  observable,
  computed,
  moment,
  action,
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
  PickerIOS, Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'hairfolio/src/helpers.js';

import {BOTTOMBAR_HEIGHT, STATUSBAR_HEIGHT} from 'hairfolio/src/constants.js';

const SearchModeSearch = observer(() => {
  return (
    <View style={{height: windowHeight - BOTTOMBAR_HEIGHT}}>
      <View
        style = {{
          backgroundColor: '#3E3E3E',
          height: h(136)
        }}
      >
        <Text>This is a text</Text>
      </View>
    </View>
  );
});

export default SearchModeSearch;