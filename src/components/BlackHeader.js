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
} from 'Hairfolio/src/helpers.js';



const BlackHeader = observer(({title, onLeft, onRenderRight, onRenderLeft}) => {

  let renderRight = () => null;
  if (onRenderRight) {
    renderRight = onRenderRight;
  }

  let renderLeft = () => (
    <View
      style = {{
        height: h(60),
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
      <Image
        style={{height: h(18), width: h(30)}}
        source={require('img/nav_white_back.png')}
      />
    </View>
  );

  if (onRenderLeft) {
    renderLeft = onRenderLeft;
  }


  return (
    <View
      style={{
        backgroundColor: '#393939',
        height: h(86) + 20,
        paddingTop: 20,
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
      <TouchableOpacity
        style={{
          width: 80,
          paddingLeft: h(26),
        }}
        onPress={onLeft}
      >
        {renderLeft()}
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
          backgroundColor: 'transparent'
        }}
      >
        {renderRight()}
      </View>
    </View>
  );
});

export default BlackHeader;
