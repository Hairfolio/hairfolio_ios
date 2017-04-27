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
  PickerIOS, Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'Hairfolio/src/helpers.js';


const ColorInfo = observer(({color}) => {
  return (
    <View style={{
      paddingLeft: h(15),
      width: (windowWidth - h(15)) / 2,
      height: h(175),
      marginTop: h(12),
      flexDirection: 'row'
    }}>

    <LinearGradient
      colors={color.gradientColors}
      style={{
        width: (windowWidth - h(15)) / 4 - h(15),
        height: h(175),
        justifyContent: 'center',
        alignItems: 'center',
        ...color.borderStyle
      }}
    >
      <Text
        style={{
          color: color.textColor,
          fontFamily: FONTS.BOOK_OBLIQUE,
          fontSize: h(42),
          backgroundColor: 'transparent'
        }}
      >
        {color.name}
      </Text>
    </LinearGradient>
    <PickerBox
      selector={color.amountSelector2} />
  </View>
  );
});


export default ColorInfo;
