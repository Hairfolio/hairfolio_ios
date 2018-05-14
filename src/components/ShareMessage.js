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
} from 'Hairfolio/src/helpers';

import WriteMessageStore from '../mobx/stores/WriteMessageStore';
import LoadingPage from './LoadingPage'
import {SelectPeople, ToInput} from './SelectPeople';

import ShareStore from '../mobx/stores/ShareStore';

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
