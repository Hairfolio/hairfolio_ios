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


const PostDescription = observer(({post, style = {}}) => {
  return (
    <View
      style={{
        paddingHorizontal: h(22),
        paddingTop: h(14),
        paddingBottom: h(28),
        ...style
      }}
    >
      <Text
        style = {{
          fontSize: h(28),
          color: '#868686',
          fontFamily: FONTS.ROMAN,
        }}
      >
        {post.description}
      </Text>

      <Text
        style = {{
          flexWrap: 'wrap',
          flexDirection: 'row',
        }}
      >
        {
          post.hashTags.map(e =>
              <Text
                key={e.key}
                onPress={() => alert('you clicked ' + e.hashtag)}
                style = {{
                  fontSize: h(28),
                  color: '#3E3E3E',
                  fontFamily: FONTS.MEDIUM,
                  textAlign: 'left'
                }}
              >
                {`#${e.hashtag} `}
              </Text>
          )
        }
      </Text>

    </View>

  );
});


export default PostDescription ;
