import {
  _, // lodash
  v4,
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
  PickerIOS, Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'hairfolio/src/helpers.js';

const WhiteHeader = observer(({title, onLeft}) => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        height: h(86) + 20,
        paddingTop: 20,
        paddingHorizontal: h(26),
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#CBCBCB'
      }}
    >
      <TouchableOpacity
        style={{
          width: 80
        }}
        onPress={onLeft}
      >
        {onLeft ?  <Image
          style={{height: h(18), width: h(30)}}
          source={require('img/nav_black_back.png')}
        /> : null}
      </TouchableOpacity>
      <Text
        style={{
          flex: 1,
          fontFamily: FONTS.MEDIUM,
          fontSize: h(34),
          color: '#393939',
          textAlign: 'center',
        }}
      >
        {title}
      </Text>

      <View
        style={{
          width: 80,
          backgroundColor: 'blue'
        }}
      >
      </View>
    </View>
  );
});

export default WhiteHeader;
