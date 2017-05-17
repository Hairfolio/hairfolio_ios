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
} from 'Hairfolio/src/helpers.js';

import ShareStore from 'stores/ShareStore.js'
import * as routes from 'Hairfolio/src/routes.js'
import AddBlackBookStore from 'stores/AddBlackBookStore.js'
import CreatePostStore from 'stores/CreatePostStore.js'

import ModalPicker from 'Hairfolio/react-native-modal-picker'

import Prompt from 'react-native-prompt';

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
          {store.name == 'Inspiration' ? 'Inspo' : store.name}
        </Text>
        {checkImage}
      </View>
    </TouchableWithoutFeedback>
  );
});

const Hairfolios = observer(() => {

  let store = ShareStore.hairfolioStore;

  if (store.isLoading) {
    return <View>
      <ActivityIndicator size='large' />
    </View>
  }
  return (
    <View>
      {
        store.hairfolios.map(
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
        onPress={
          () => {
            AddBlackBookStore.select(ShareStore.contacts);
            AddBlackBookStore.myBack = () => _.last(window.navigators).jumpTo(routes.share);
            _.last(window.navigators).jumpTo(routes.addBlackBook);
          }
        }
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


const ShareSummary = observer(() => {

  let img = <View />;


  if (CreatePostStore.gallery.selectedPicture) {
    img = (
      <Image
        style={{
          height: h(120),
          width: h(120),
          margin: h(14),
        }}
        source={CreatePostStore.gallery.selectedPicture.source}
      />
    )
  }


  return (
    <View
      style={{
        marginVertical: h(20),
        height: h(150),
        backgroundColor: 'white',
        flexDirection: 'row'
      }}
    >
      <View>
        {img}
      </View>
      <View
        style={{
          flex: 1
        }}
      >
        <Text
          numberOfLines={3}
          style={{
            marginTop: h(14),
            marginRight: h(14),
            fontSize: h(28),
            color: '#868686',
            fontFamily: 'Avenir-Roman'
          }}
        >{CreatePostStore.gallery.description}

        <Text
          style={{
            fontFamily: 'Avenir-Medium',
            color: '#3E3E3E'
          }}
        >
          {CreatePostStore.hashTagsText}
        </Text>

      </Text>
      </View>


    </View>
  );
});

const ShareButton = observer(({color, store, isLeft = true, imageSource, text}) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => store.enableDisable()}
    >
      <View
        style={{
          opacity: store.opacity,
          flex: 1,
        }}
      >
        <View
          style={{
            backgroundColor: color,
            flex: 1,
            marginRight: isLeft ? 1 : 0,
            marginBottom: 1,
            height: h(100),
            flexDirection: 'row'
          }}
        >

        <View
          style={{
            width: h(100),
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Image
            source={imageSource}
          />
        </View>

        <View
          style={{
            justifyContent: 'center'
          }}
        >
          <Text
            style={{
              fontSize: h(34),
              color: 'white',
              fontFamily: 'Avenir-Roman'
            }}
          >
            {text}
          </Text>
        </View>
      </View>
    </View>
  </TouchableWithoutFeedback>
  );
});

const ShareNetworks = observer(() => {
  return (
    <View>
      <View
        style = {{
          backgroundColor: '#F8F8F8',
          flexDirection: 'row',
        }}
      >
        <Text style = {styles.headerStyleLeft}>
          Share on
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row'
        }}
      >
        <ShareButton
          store={ShareStore.shareTwitterStore}
          text='Twitter'
          color='#55ACEE'
          imageSource={require('img/share_twitter.png')} />

        <ShareButton
          text='Instagram'
          store={ShareStore.shareInstagramStore}
          isLeft={false}
          color='#CF1662'
          imageSource={require('img/share_instagram.png')} />
      </View>

      <View
        style={{
          flexDirection: 'row'
        }}
      >
        <ShareButton
          text='Pinterest'
          store={ShareStore.sharePinterestStore}
          color='#BD081C'
          imageSource={require('img/share_pinterest.png')} />

        <ShareButton
          text='Facebook'
          store={ShareStore.shareFacebookStore}
          isLeft={false}
          color='#3B5997'
          imageSource={require('img/share_facebook.png')} />
      </View>

    </View>
  );
});

const BoardPicker = observer(() => {

  if (ShareStore.showBoard) {
    return (
      <ModalPicker
        ref = {res => ShareStore.pinterestSelector = res}
        data={ShareStore.boardData}
        initValue="SelectsharePinterestStore something yummy!"
        onChange={(option)=>{
          ShareStore.sharePinterestStore.setBoardName(option.label);
        }}
      >
        <View />
      </ModalPicker>
    );
  } else {
    return <View />;
  }
});

const ShareFollowers = observer(() => {
  return (
    <ScrollView
      style = {{
        backgroundColor: '#F8F8F8'
      }}
    >
      <BoardPicker />
      <ShareSummary />
      <ShareHairfolio />
      <ShareBlackBook />
      <ShareNetworks />
    </ScrollView>
  );
});

export default ShareFollowers;
