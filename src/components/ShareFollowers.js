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
  ActivityIndicator,
  ScrollView,
  PickerIOS, Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'hairfolio/src/helpers.js';

import ShareStore from 'stores/ShareStore.js'

const Hairfolio  = observer(({store}) => {

  if (store.isInEdit) {
    return (
      <TextInput
        ref={input => ShareStore.input = input}
        value={store.name}
        onChangeText={t => store.name = t}
        onEndEditing={
          () => ShareStore.saveHairfolio(store)
        }
        style = {{
          backgroundColor: 'white',
          height: h(86),
          marginBottom: 3,
          alignItems: 'center',
          paddingLeft: h(21),
          fontSize: h(30),
        }}
      />
    );
  }

  let checkImage;

  if (store.isSelected) {
    checkImage = (
      <Image
        style={{height: h(34), width: h(48), marginRight: h(30)}}
        source={require('img/share_check.png')}
      />
    );
  }


  return (
    <TouchableWithoutFeedback
      onPress={
        () => { store.isSelected = !store.isSelected}
      }
    >
      <View
        style = {{
          flexDirection: 'row',
          backgroundColor: 'white',
          height: h(86),
          marginBottom: 3,
          alignItems: 'center'
        }}
      >
        <Text
          style = {{
            marginLeft: h(21),
            fontSize: h(30),
            fontFamily: FONTS.ROMAN,
            flex: 1
          }}
        >
          {store.name}
        </Text>
        {checkImage}
      </View>
    </TouchableWithoutFeedback>
  );
});

const Hairfolios = observer(() => {
  return (
    <View>
      {
        ShareStore.hairfolios.map(
          el => <Hairfolio key={el.key} store={el} />
        )
      }
    </View>

  );
});

const ShareHairfolio = observer(() => {
  return (
    <View>
      <View
        style = {{
          backgroundColor: '#F8F8F8',
          flexDirection: 'row',
        }}
      >
        <Text style = {styles.headerStyleLeft}>
          Add to Hairfolio
        </Text>

        <TouchableOpacity
          onPress={
            () => ShareStore.newHairfolio()
          }
        >
          <Text style = {styles.headerStyleRight}>
            Create New
          </Text>
        </TouchableOpacity>
      </View>
      <Hairfolios />
    </View>

  );
});

const ShareBlackBook = observer(() => {
  return (
    <View>
      <View
        style = {{
          backgroundColor: '#F8F8F8',
          flexDirection: 'row',
        }}
      >
        <Text style = {styles.headerStyleLeft}>
          Add To Blackbook
        </Text>
      </View>
      <TouchableOpacity
        style = {{
          height: h(86),
          flexDirection: 'row',
          paddingLeft: h(21),
          backgroundColor: '#3E3E3E',
          alignItems: 'center'
        }}
      >
        <Image
          style={{height: h(49), width: h(37)}}
          source={require('img/black_book_white.png')}
        />
        <Text
          style = {{
            fontSize: h(28),
            color: 'white',
            marginLeft: h(30),
            flex: 1
          }}
        >
          {ShareStore.blackBookHeader}
        </Text>
        <Image
          style={{marginRight: h(30), height: 1.3 * h(13), width: 1.3 * h(27)}}
          source={require('img/white_arrow.png')}
        />
      </TouchableOpacity>
    </View>
  );
});

let styles = {
  headerStyleLeft: {
    fontSize: h(30),
    color: '#868686',
    left: h(21),
    marginBottom: h(15),
    marginTop: h(44),
    fontFamily: FONTS.MEDIUM,
    flex: 1
  },
  headerStyleRight: {
    fontSize: h(30),
    color: '#B5B5B5',
    left: h(21),
    marginBottom: h(15),
    marginTop: h(44),
    fontFamily: FONTS.ROMAN,
    marginRight: h(40),
  }
};


const ShareFollowers = observer(() => {

  return (
    <ScrollView
      style = {{
        backgroundColor: '#F8F8F8'
      }}
    >
      <ShareHairfolio />
      <ShareBlackBook />
    </ScrollView>
  );
});

export default ShareFollowers;
