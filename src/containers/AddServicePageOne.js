import {
  _, // lodash
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

import {appStack, createPost, onPress, postFilter, albumPage, addServiceTwo, gallery} from '../routes';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

var RCTUIManager = require('NativeModules').UIManager;

import MyPicker from 'components/MyPicker.js'

import AddServiceStore from 'stores/AddServiceStore.js'


import ReactNative from 'react-native';


const BoxSelector = observer(({selector}) => {
  return (
    <TouchableWithoutFeedback
      onPress={
        () => {
          if (selector.isEnabled) {
            selector.open();
          }
        }
      }
    >
      <View
        style={{
          height: h(80),
          backgroundColor: 'white',
          marginHorizontal: h(20),
          marginTop: h(20),
          flexDirection: 'row',
        }}>
        <View style={{flex: 1, paddingLeft: h(40), justifyContent: 'center' }}>
          <Text
            style={{
              fontSize: h(28),
              opacity: selector.opacity
            }}
          >{selector.value}</Text>
        </View>
        <View style={{width: h(81), flexDirection: 'row'}}>
          <View style={{width: h(1), height: h(80), backgroundColor: '#C5C5C5'}} />
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Image
              style={{opacity: selector.opacity}}
              source={selector.arrowImage}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
});


@observer
@autobind
export default class AddServicePageOne extends Component {

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  render() {

    let store = AddServiceStore;

    return (
        <View style={{paddingTop: 20, flex: 1, backgroundColor: 'white'}}>
          <SlimHeader
            leftText='Back'
            onLeft={() => {
              _.last(this.context.navigators).jumpTo(gallery)
            }}
            title='Add Service (1/3)'
            titleStyle={{fontFamily: FONTS.SF_MEDIUM}}
            rightText={'Next'}
            rightStyle={{opacity: store.nextOpacity}}
            onRight={() => {
              if (store.colorNameSelector.hasValue) {
                _.last(this.context.navigators).jumpTo(addServiceTwo)
              } else {
                alert('Please fill out all the fields first');
              }
            }}
          />
          <View style={{flex: 1, backgroundColor: '#F3F3F3'}}>
            <BoxSelector selector={store.serviceSelector} />

            <BoxSelector selector={store.brandSelector} />

            <BoxSelector selector={store.colorNameSelector} />

          </View>
          <MyPicker
            onValueChange={(val) => store.selector.value = val}
            title={store.selector.title}
            value={store.selector.value}
            data={store.selector.data}
            isShown={store.selector.isOpen}
            onConfirm={() => store.confirmSelector()}
            onCancel={() => store.cancelSelector()}
          />
        </View>
    );
  }
}
