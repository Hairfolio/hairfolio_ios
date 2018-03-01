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
} from 'Hairfolio/src/helpers';
import SlimHeader from '../components/SlimHeader';
import AlbumStore from '../mobx/stores/AlbumStore';
import CreatePostStore from '../mobx/stores/CreatePostStore';
import AddTagStore from '../mobx/stores/AddTagStore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ReactNative, { NativeModules } from 'react-native';
const RCTUIManager = NativeModules.UIManager;
const ImageFilter = NativeModules.ImageFilter;
import MyPicker from '../components/MyPicker';
import ServiceBox from '../components/post/ServiceBox';

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
        <Text style={{paddingTop: h(5), width: h(200), textAlign: 'center'}}>{item.displayName}</Text>
      </View>
    </TouchableWithoutFeedback>

  );
});

const FilterSelector = observer(({store}) => {
  return (
    <ScrollView
      horizontal
      style={{height: h(270)}}
    >
      {store.filteredImages.map((el) => <FilterImage key={el.key} item={el} />)}
    </ScrollView>

  );
});

@observer
@autobind
export default class FilterPage extends Component {
  render() {
    let store = CreatePostStore.gallery.filterStore;
    if (!store) {
      return <View />;
    }
    return (
      <View style={{paddingTop: 20, backgroundColor: 'white', flex: 1}}>
        <SlimHeader
          leftText='Cancel'
          onLeft={() => {
            this.props.navigator.pop({ animated: true });
          }}
          title='Filter'
          titleStyle={{fontFamily: FONTS.SF_MEDIUM}}
          rightText='Apply'
          onRight={() => {
            CreatePostStore.gallery.applyFilter();
            this.props.navigator.pop({ animated: true });
          }}
        />
        <Image
          style={{height: windowWidth, width:windowWidth}}
          source={store.mainPicture && store.mainPicture.source}
        />
        <FilterSelector store={store}/>
      </View>
    );
  }
}
