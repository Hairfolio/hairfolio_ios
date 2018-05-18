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
} from 'Hairfolio/src/helpers';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

let LoadingPage = (Class, store, props) => observer(() => {

  if (store.isLoading) {
    return (
      <View style={{flex: 1}}>
        <ActivityIndicator size='large'/>
      </View>
    );
  }

  if (store.isEmpty) {
    return (
      <KeyboardAwareScrollView>
      <View style={{flex: 1}}>
        <Text
          style= {{
            paddingTop: h(38),
            fontSize: h(34),
            textAlign: 'center',
            fontFamily: FONTS.BOOK_OBLIQUE
          }}
        >
          {store.noElementsText}
        </Text>
      </View>
      </KeyboardAwareScrollView>
    );
  } else {
    return   <KeyboardAwareScrollView><Class store={store} {...props} /></KeyboardAwareScrollView>
  }
})


export default LoadingPage;
