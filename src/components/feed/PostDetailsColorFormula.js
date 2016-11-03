import {
  _, // lodash
  v4,
  observer, // mobx
  h,
  FONTS,
  COLORS,
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

import PostDetailStore from 'stores/PostDetailStore.js'


const PostDetailsColorFormula = observer(() => {

  let store = PostDetailStore;

  return (
    <View>
      <View
        style = {{
          flex: 1,
          height: h(80),
          backgroundColor: '#F3F3F3',
          flexDirection: 'row',
          paddingLeft: 24,
          alignItems: 'center'
        }}
      >
        <Text
          style = {{
            fontFamily: FONTS.ROMAN,
            fontSize: h(28),
            color: '#BFBFBF'
          }}
        >
          COLOR FORMULA
        </Text>
      </View>
    </View>
  );
});


export default PostDetailsColorFormula;
