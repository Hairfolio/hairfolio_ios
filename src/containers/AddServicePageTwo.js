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


import LinearGradient from 'react-native-linear-gradient';

import SlimHeader from 'components/SlimHeader.js'
import AlbumStore from 'stores/AlbumStore.js'
import CreatePostStore from 'stores/CreatePostStore.js'
import AddServiceStore from 'stores/AddServiceStore.js'

import {appStack, createPost, onPress, postFilter, albumPage, addServiceOne, addServiceThree} from '../routes';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

var RCTUIManager = require('NativeModules').UIManager;

import MyPicker from 'components/MyPicker.js'


import ReactNative from 'react-native';

const ColorItem = observer(({colorField}) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (colorField.isSelected) {
          colorField.isSelected = false;
        } else if (colorField.canSelect) {
          console.log('set selected');
          colorField.isSelected = true;
        } else {
          alert('You already selected 4 colors!');
        }
      }}

    >
      <LinearGradient
        colors={colorField.gradientColors}
        style={{
          width: h(150),
          height: h(106),
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: colorField.borderColor,
          borderWidth: colorField.borderWidth
        }}
      >
        <Text
          style={{
            fontSize: h(35),
            color: 'white',
            backgroundColor: 'transparent'
          }}
        >
          {colorField.name}
        </Text>
        <Text
          style={{
            color: '#CDC1B4',
            position: 'absolute',
            backgroundColor: 'transparent',
            top: 0,
            left: 3
          }}>#</Text>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
});

const ColorColumn = observer(({arr}) => {
  return (
    <View>
      {arr.map((el) => <ColorItem key={el.key} colorField={el} />) }
    </View>

  );
});

const ColorGrid = observer(({colorGrid}) => {
  return (
    <ScrollView
      bounces={false}
      horizontal
    >
      <View style={{flexDirection: 'row'}}>
        {colorGrid.colors.map((arr, index) => <ColorColumn key={index} arr={arr} />) }
      </View>

    </ScrollView>

  );
});


@observer
@autobind
export default class AddServicePageTwo extends Component {

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  render() {

    return (
        <View style={{paddingTop: 20, flex: 1, backgroundColor: 'white'}}>
          <SlimHeader
            leftText='Back'
            onLeft={() => {
              _.last(this.context.navigators).jumpTo(addServiceOne)
            }}
            title='Add Service (2/3)'
            titleStyle={{fontFamily: FONTS.SF_MEDIUM}}
            rightText='Next'
            rightStyle={{opacity: AddServiceStore.canMoveToPageTwo ? 1 : 0.5}}
            onRight={() => {
              if (AddServiceStore.canMoveToPageTwo) {
                _.last(this.context.navigators).jumpTo(addServiceThree)
              } else {
                alert('You need to select colors first');
              }
            }}

          />

        <View style={{flex: 1, backgroundColor: 'white'}}>
          <Text
            style={{fontSize: h(40), textAlign: 'center', marginVertical: h(30), fontFamily: FONTS.SF_MEDIUM}}
          > {AddServiceStore.descriptionPageTwo} </Text>
          <ColorGrid colorGrid={AddServiceStore.colorGrid} />
        </View>

        </View>
    );
  }
}
