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



const BlackHeader = observer(({title, onLeft}) => {
  return (
    <View
      style={{
        backgroundColor: '#393939',
        height: h(86) + 20,
        paddingTop: 20,
        paddingHorizontal: h(26),
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
      <TouchableOpacity
        style={{
          width: 80
        }}
        onPress={onLeft}
      >
        <Image
          style={{height: h(18), width: h(30)}}
          source={require('img/nav_white_back.png')}
        />
      </TouchableOpacity>
      <Text
        style={{
          flex: 1,
          fontFamily: FONTS.Regular,
          fontSize: h(34),
          color: 'white',
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

export default BlackHeader;
