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
} from 'Hairfolio/src/helpers';

const WhiteHeader = observer(({title, numberOfLines, onLeft, onRenderRight}) => {

  let renderRight = () => null;
  if (onRenderRight) {
    renderRight = onRenderRight;
  }

  return (
    <View
      style={{
        backgroundColor: 'white',
        height: h(86) + 20,
        paddingTop: 20,
        paddingHorizontal: 0,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#CBCBCB'
      }}
    >
      <TouchableOpacity
        style={{
          width: 100
        }}
        onPress={onLeft}
      >
      {onLeft ?
          <View
            style = {{
              height: h(60),
              paddingLeft: h(26),
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Image
              style={{height: 16, width: 28}}
              source={require('img/nav_black_back.png')}
            />
        </View>
          : null
      }

    </TouchableOpacity>
      <Text
        style={{
          flex: 1,
          fontFamily: FONTS.MEDIUM,
          fontSize: h(34),
          color: '#393939',
          textAlign: 'center',
        }}
        numberOfLines={numberOfLines}
      >
        {title}
      </Text>

      <View
        style={{
          width: 80,
          paddingRight: h(26)
        }}
      >
        {renderRight()}
      </View>
    </View>
  );
});

export default WhiteHeader;
