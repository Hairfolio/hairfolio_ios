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
  ActivityIndicator,
  ScrollView,
  PickerIOS, Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'hairfolio/src/helpers.js';

import WriteMessageStore from 'stores/WriteMessageStore.js'
import LoadingPage from 'components/LoadingPage'
import {SelectPeople, ToInput} from 'components/SelectPeople.js'

import ShareStore from 'stores/ShareStore.js'

const ShareMessage = observer(() => {

  let store = ShareStore.sendStore;

  let Content = LoadingPage(
    SelectPeople,
    store
  );

  return (
    <View style={{flex: 1, backgroundColor: '#F8F8F8'}}>
      <ToInput store={store} />
      <Content />
    </View>
  );
});

export default ShareMessage;
