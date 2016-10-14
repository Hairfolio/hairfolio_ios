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
  ActivityIndicator,
  Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
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
import LoadingScreen from 'components/LoadingScreen.js'


const BoxSelector = observer(({selector}) => {

  let picker;

  if (selector.isOpen) {

    if (selector.isLoaded) {
      picker = <Picker
        selectedValue={selector.value}
        style={{marginTop: h(20), backgroundColor: 'white'}}
        itemStyle={{fontSize: h(32)}}
        onValueChange={val => selector.value = val}>
        {selector.data.map(data =>
            <Picker.Item key={data.id} label={data.name} value={data.name} />
        )}
      </Picker>;
    } else {
      picker = <View style={{
        marginTop: h(20),
        height: 200,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <ActivityIndicator size="large" />
      </View>
    }
  }


  return (
    <View>
      <TouchableWithoutFeedback
        onPress={
          () => {
            if (selector.isEnabled) {
              if (!selector.isOpen) {
                selector.open();
              } else {
                selector.close()
              }
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
      {picker}
    </View>
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
            onRight={async () => {
              if (store.colorNameSelector.hasValue) {

                let res = await store.loadColors();

                if (res.length > 0) {
                  _.last(this.context.navigators).jumpTo(addServiceTwo)
                } else {
                  CreatePostStore.gallery.addServicePicture(
                    CreatePostStore.gallery.position.x,
                    CreatePostStore.gallery.position.y
                  );
                  _.last(this.context.navigators).jumpTo(
                    gallery
                  );
                }
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

          <LoadingScreen store={store} />

        </View>
    );
  }
}
