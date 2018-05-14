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
  ActionSheetIOS,
  Modal,
  ScrollView,
  PickerIOS, Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'Hairfolio/src/helpers';

import TagPostStore from '../../mobx/stores/TagPostStore';

const PostDescription = observer(({post, navigator, limitLinesNumbers, style = {}}) => {
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
          flexWrap: 'wrap',
          flexDirection: 'row',
        }}
        numberOfLines={limitLinesNumbers ? 2 : null}
      >
        <Text
          style = {{
            fontSize: h(28),
            color: '#868686',
            fontFamily: FONTS.ROMAN,
          }}
        >
          {post.description + ' '}
        </Text>
        {
          post.hashTags.map(e =>
              <Text
                key={e.key}
                onPress={() => {
                  TagPostStore.jump(
                    e.hashtag,
                    `#${e.hashtag}`,
                    navigator
                  );
                }}
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


export default PostDescription;
