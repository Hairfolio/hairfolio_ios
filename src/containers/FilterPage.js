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
} from 'hairfolio/src/helpers.js';

import SlimHeader from 'components/SlimHeader.js'
import AlbumStore from 'stores/AlbumStore.js'
import CreatePostStore from 'stores/CreatePostStore.js'
import AddTagStore from 'stores/AddTagStore.js'

import {appStack, gallery, createPost, onPress, postFilter, albumPage, addServiceOne, addLink, addServiceTwo, addServiceThree} from '../routes';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

var RCTUIManager = require('NativeModules').UIManager;

var ImageFilter = require('NativeModules').ImageFilter;

import MyPicker from 'components/MyPicker.js'


import ReactNative from 'react-native';

import ServiceBox from 'components/post/ServiceBox.js'

import AddTagModal from 'components/post/AddTagModal.js'

const FilterImage = observer(({item}) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => item.select()}
    >
      <View style={{marginLeft: h(20), paddingTop: h(20)}}>

        <Image
          style={{height: h(200), width: h(200)}}
          source={item.source}
        />
        <Text style={{paddingTop: h(5), width: h(200), textAlign: 'center'}}>{item.filterName}</Text>
      </View>
    </TouchableWithoutFeedback>

  );
});

const FilterSelector = observer(({store}) => {
  return (
    <ScrollView horizontal={true} style={{height: h(270)}}>

      {store.filteredImages.map((el) => <FilterImage key={el.key} item={el} />)}


    </ScrollView>

  );
});

@observer
@autobind
export default class FilterPage extends Component {

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  render() {

    let store = CreatePostStore.gallery.filterStore;

    return <View style={{paddingTop: 20, backgroundColor: 'white', flex: 1}}>
      <SlimHeader
        leftText='Cancel'
        onLeft={() => {
          _.last(this.context.navigators).jumpTo(gallery)
        }}
        title='Filter'
        titleStyle={{fontFamily: FONTS.SF_MEDIUM}}
        rightText='Apply'
        onRight={() => {
          CreatePostStore.gallery.applyFilter();
          _.last(this.context.navigators).jumpTo(gallery)
        }}
      />
      <Image
        style={{height: windowWidth, width:windowWidth}}
        source={store.mainPicture && store.mainPicture.source}
      />
      <FilterSelector store={store}/>
      </View>
  ;
  }
}
