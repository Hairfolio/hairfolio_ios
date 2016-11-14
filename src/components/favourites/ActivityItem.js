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


const ActivityItem = observer(({store, isMe}) => {
  let postContent;

  if (store.post) {
    postContent = (
      <Image
        style={{marginLeft: h(120), marginBottom: h(20), height: h(100), width: h(100)}}
        source={store.post.picture.source}
      />
    )
  }

  let infoContent;

  if (store.type == 'follow') {
    if (isMe) {
      infoContent = <Text>started following you</Text>
    } else {
      infoContent = (
        <Text>started following
          <Text style={{fontFamily: FONTS.MEDIUM, color: '#3E3E3E'}}>
            {' ' + store.user2.name}
          </Text>

        </Text>
      );
    }
  } else if (store.type == 'star') {
    if (isMe) {
      infoContent = <Text>stared your post</Text>
    } else {
      infoContent = (
        <Text>starred a post of
          <Text style={{fontFamily: FONTS.MEDIUM, color: '#3E3E3E'}}>
            {' ' + store.user2.name}
          </Text>
        </Text>
      );
    }
  }


  return (
    <View
    >
      <View
        style = {{
          flexDirection: 'row',
          height: h(120),
          alignItems: 'center',
          paddingLeft: h(20)
        }}
      >

        <Image
          style={{height: h(80), width:h(80), borderRadius:h(40)}}
          source={store.user.profilePicture.source}
        />

      <Text
        style = {{
          fontSize: h(28),
          paddingLeft: h(20),
          flex: 1,
          color: '#3E3E3E',
          fontFamily:FONTS.ROMAN
        }}
      >
        <Text style={{fontFamily: FONTS.MEDIUM, color: '#3E3E3E'}}>
          {store.user.name + ' '}
        </Text>
          {infoContent}
      </Text>

      <View
        style = {{
          width: h(108),
          paddingTop: h(37),
          paddingRight: h(15)
        }}
      >
        <Text
          style = {{
            fontFamily: FONTS.ROMAN,
            color: '#D8D8D8',
            fontSize: h(24),
            flex: 1,
            textAlign: 'right'
          }}

        >
          {store.timeDifference()}
        </Text>
      </View>
    </View>
    {postContent}
    <View
      style = {{
        height: h(1),
        marginLeft: h(120),
        flex: 1,
        backgroundColor: '#D8D8D8'
      }}
    />
  </View>
  );
});

export default ActivityItem;
