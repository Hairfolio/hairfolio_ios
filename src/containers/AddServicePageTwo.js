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
} from 'Hairfolio/src/helpers';
import LinearGradient from 'react-native-linear-gradient';
import SlimHeader from '../components/SlimHeader';
import AlbumStore from '../mobx/stores/AlbumStore';
import CreatePostStore from '../mobx/stores/CreatePostStore';
import AddServiceStore from '../mobx/stores/AddServiceStore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import MyPicker from '../components/MyPicker';
import ReactNative, { NativeModules } from 'react-native';
const RCTUIManager = NativeModules.UIManager;
import NavigatorStyles from '../common/NavigatorStyles';

const ColorItem = observer(({colorField}) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (colorField.isSelected) {
          colorField.isSelected = false;
        } else if (colorField.canSelect) {
          colorField.isSelected = true;
        } else if (!colorField.isBlank) {
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
          }}>{colorField.isBlank ? '' : '#'}</Text>
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
    >
      <ScrollView horizontal
        bounces={false}
      >
        <View style={{flexDirection: 'row'}}>
          {colorGrid.colors.map((arr, index) => <ColorColumn key={index} arr={arr} />) }
        </View>
      </ScrollView>
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
            titleWidth={140}
            leftText='Back'
            onLeft={() => {
              this.props.navigator.pop({ animated: true });
            }}
            title='Add Service (2/3)'
            titleStyle={{fontFamily: FONTS.SF_MEDIUM}}
            rightText='Next'
            rightStyle={{opacity: AddServiceStore.canMoveToPageTwo ? 1 : 0.5}}
            onRight={() => {
              if (AddServiceStore.canMoveToPageTwo) {
                this.props.navigator.push({
                  screen: 'hairfolio.AddServicePageThree',
                  navigatorStyle: NavigatorStyles.tab,
                });
              } else {
                alert('You need to select colors first');
              }
            }}
          />
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <Text
            style={{fontSize: h(40), textAlign: 'center', marginVertical: h(30), fontFamily: FONTS.SF_MEDIUM}}
          > {AddServiceStore.descriptionPageTwo} </Text>
          <View
            style={{
              flex: 1
            }}
          >
          <ColorGrid colorGrid={AddServiceStore.colorGrid} />
        </View>
        </View>

        </View>
    );
  }
}
