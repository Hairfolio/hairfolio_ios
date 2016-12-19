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
  ActivityIndicator,
  PickerIOS, Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'hairfolio/src/helpers.js';


const PeopleRow = observer(({store}) => {
  let checkElement;

  if (store.isSelected) {
    checkElement = (
      <Image
        style = {{
          marginRight: h(32),
          marginTop: h(12)
        }}
        source={require('img/message_check.png')}
      />
    );
  }

  return (
    <TouchableWithoutFeedback
      onPress={
        () => store.flip()
      }
    >
        <View
          style = {{
            flexDirection: 'row',
            paddingTop: h(16),
            backgroundColor: store.background()
          }}
        >
          <View
            style = {{
              width: h(121),
              paddingLeft: h(16)
            }}
          >
            <Image
              style={{height: h(80), width: h(80), borderRadius: h(40)}}
              source={store.user.profilePicture ? store.user.profilePicture.getSource(80) : null}
            />
          </View>
          <View
            style = {{
              flexDirection: 'row',
              flex: 1,
              height: h(100),
              paddingTop: h(8),
              borderBottomWidth: h(1),
              borderBottomColor: '#D8D8D8'
            }}
          >
            <View
              style = {{
                flex: 1
              }}
            >
              <Text
                style = {{
                  fontFamily: FONTS.MEDIUM,
                  fontSize: h(28),
                  color: '#393939'
                }}>
                {store.user.name}
              </Text>
            </View>
            {checkElement}
          </View>
        </View>
      </TouchableWithoutFeedback>
  );
});


const SelectPeople = observer(({store}) => {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <ScrollView
        ref={el => {store.scrollView = el}}
        onContentSizeChange={(w, h) => store.contentHeight = h}
        onLayout={ev => store.scrollViewHeight = ev.nativeEvent.layout.height}
      >
      {
        store.items.map(e => <PeopleRow key={e.key} store={e} />)}
      </ScrollView>
    </View>
  );
});


const ToInput = observer(({store}) => {
  return (
    <View
      style = {{
        height: h(95),
        paddingHorizontal: h(28),
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: h(1),
        borderBottomColor: '#D8D8D8'
      }}
    >
      <Text
        style = {{
          color: '#393939',
          fontSize: h(30),
          fontFamily: FONTS.MEDIUM,
          marginRight: h(15)
        }}

      >To: </Text>
      <TextInput
        style = {{
          fontSize: h(30),
          fontFamily: FONTS.MEDIUM
        }}
        text={store.inputText}
        onChangeText={
          text => {
            store.inputText = text;
          }}
        placeholder='Search'
        style={{
          flex: 1
        }}
      />
    </View>

  );
})

export {SelectPeople, ToInput};
