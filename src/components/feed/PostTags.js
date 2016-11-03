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
} from 'hairfolio/src/helpers.js';

const PostTags  = observer(({store}) => {

  if (!store.showTags) {
    return null;
  }

  return (
    <View
      style = {{
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    >
      {store.selectedPicture.tags.map((pic) => {

        let style = {
          position: 'absolute',
          top: pic.y - 13,
          left: pic.x - 13,
          height: 26,
          width: 26,
          backgroundColor: '#3E3E3E',
          borderRadius: 13,
          justifyContent: 'center',
          alignItems: 'center'
        };

        if (pic.imageSource) {
          return (
            <TouchableWithoutFeedback
              onPress={() => alert('service clicked')}
              key={pic.key}>
              <Image
                style={style}
                source={pic.imageSource}
              />
            </TouchableWithoutFeedback>
          );
        }

        return (
          <View
            key={pic.key}
            style={style}>
            <Text style={{fontSize: 15, backgroundColor: 'transparent', color: 'white'}}>{pic.abbrev}</Text>
          </View>
        );

      })}
    </View>
  );
});

export default PostTags;
