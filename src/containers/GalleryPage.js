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

import {appStack, createPost, onPress, postFilter, albumPage, addServiceOne, filter, addLink, addServiceTwo, addServiceThree} from '../routes';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

var RCTUIManager = require('NativeModules').UIManager;

var ImageFilter = require('NativeModules').ImageFilter;

import MyPicker from 'components/MyPicker.js'


import ReactNative from 'react-native';

import ServiceBox from 'components/post/ServiceBox.js'

import AddTagModal from 'components/post/AddTagModal.js'


const ImagePreview = observer(({gallery, navigators}) => {

  if (gallery.selectedPicture == null) {
    return (
      <View
        style={{
          width: windowWidth,
          height: windowWidth,
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 30,
            textAlign: 'center'
          }}
        >
          No picture
        </Text>
      </View>
    );
  }

  let deletePicture = () => {
    AlertIOS.alert(
      'Delete Picture',
      'Are you sure you want to delete tis picture from the gallary?',
      [
        {text: 'Yes', onPress: () => gallery.deleteSelectedPicture()},

        {text: 'No', onPress: () => console.log('Cancel Pressed') },
      ],
    );

  };

  let filterPicture = () => {
    CreatePostStore.gallery.filterStore.reset();
    setTimeout(()=> CreatePostStore.gallery.filterStore.setMainImage(CreatePostStore.gallery.selectedPicture), 500);
    _.last(navigators).jumpTo(filter)
  };
  return (
    <View
      style={{
        width: windowWidth,
        height: windowWidth,
      }}
    >
      <TouchableWithoutFeedback
        onPress={(a, b) => {

          gallery.position.x = a.nativeEvent.locationX;
          gallery.position.y = a.nativeEvent.locationY;

          if (gallery.serviceTagSelected) {
            _.last(navigators).jumpTo(addServiceOne);
          } else if (gallery.linkTagSelected) {
            _.last(navigators).jumpTo(addLink);
          } else if (gallery.hashTagSelected) {
            StatusBar.setHidden(true);
            AddTagStore.show();
          }

        }}>
        <Image
          ref={(el) => window.img = el}
          style={{height: windowWidth, width: windowWidth}}
          source={gallery.selectedPicture.source}
        />
      </TouchableWithoutFeedback>
    <TouchableOpacity
      onPress={deletePicture}
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        padding: h(14)
      }}
    >
      <View>
        <Image
          source={require('img/post_close.png')}
        />
      </View>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={filterPicture}
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        padding: h(14)
      }}
    >
      <View>
        <Image
          style={{height: 35, width: 35}}
          source={require('img/post_filter.png')}
        />
      </View>
    </TouchableOpacity>
    {gallery.selectedPicture.tags.map((pic) => {
      return (
        <View
          key={pic.key}
          style={{
            position: 'absolute',
            top: pic.y - 13,
            left: pic.x - 13,
            height: 26,
            width: 26,
            backgroundColor: '#3E3E3E',
            borderRadius: 13,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <Text style={{fontSize: 15, backgroundColor: 'transparent', color: 'white'}}>{pic.abbrev}</Text>
        </View>
      );

    })}
  </View>
  );
});

const ActionRow = observer(({tagMenu, imageStyle}) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => tagMenu.select()}
    >
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', opacity: tagMenu.opacity}}>
        <Image
          style={{height: h(34), width: h(28), marginRight: 5, ...imageStyle}}
          source={tagMenu.source}
        />
        <Text>
          {tagMenu.title}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
});

const ActionMenu = observer(({gallery}) => {
  return (
    <View style={{height: h(82), flexDirection: 'row'}} >
      <ActionRow
        tagMenu={gallery.hashTagMenu} />
      <ActionRow imageStyle={{width: h(40), height: h(28)}} tagMenu={gallery.serviceTagMenu} />
      <ActionRow tagMenu={gallery.linkTagMenu} />

    </View>

  );
});

const PlusPicture = observer(({onPress}) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', paddingLeft: h(30)}}>
      <TouchableOpacity onPress={onPress} >
        <View
          style={{
            height: h(134),
            width: h(134),
            borderWidth: 1,
            borderColor: '#B4B4B4',
            alignItems: 'center'
          }}
        >
          <Text
            style={{
              fontSize: h(100),
              color: '#B4B4B4',
              fontFamily: FONTS.SF_MEDIUM
            }}
          >+</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
});

const Picture = observer(({picture}) => {


  console.log('Picture', picture.selected);

  let selectedBox;

  if (picture.selected) {
    selectedBox = (
      <View
        style = {{
          position: 'absolute',
          top: 0,
          left: 0,
          width: h(134),
          height: h(134),
          borderWidth: h(7),
          borderColor: '#3E3E3E'
        }} />
    );
  }

  return (
    <TouchableWithoutFeedback onPress={() => picture.select()}>
      <View
        style={{
          height: h(134),
          width: h(134),
          backgroundColor: 'blue',
          marginLeft: h(30),
        }}
      >
        <Image
          style={{height: h(134), width: h(134)}}
          source={picture.source}
        />
        {selectedBox}
      </View>
    </TouchableWithoutFeedback>

  );
});

const PictureView = observer(({gallery, onPlus}) => {


  return (
    <ScrollView
      horizontal
      style={{
        height: h(170)
      }}
    >
      <PlusPicture onPress={onPlus} />
      <View style={{flexDirection: 'row', alignItems: 'center', marginRight: h(30)}}>
        {gallery.pictures.map((el) => <Picture picture={el} key={el.key} />)}
    </View>
   </ScrollView>
  );
});

const TagInfo = observer(({gallery}) => {

  console.log('selectedTag', gallery.selectedTag);
  if (gallery.selectedTag == null) {
    return null;
  }

  return (
    <View
      style={{
        height: h(88),
        width: windowWidth,
        backgroundColor: '#3E3E3E',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Text
        style={{
          color: 'white',
          fontSize: h(35)
        }}
      >Tap where to add tag</Text>
    </View>

  );
});

@observer
@autobind
export default class GalleryPage extends Component {

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  scrollToElement(reactNode) {
    RCTUIManager.measure(ReactNative.findNodeHandle(reactNode), (x, y, width, height, pageX, pageY) => {
      RCTUIManager.measure(this.refs.scrollView.getInnerViewNode(), (x2, y2, width2, height2, pageX2, pageY2) => {
        console.log('pageY', pageY, pageY2, height, height2);
        // currentPos: 64
        var currentScroll = 64 - pageY2;
        var differenceY = -pageY - 240 + (windowHeight - 20 - h(88));

        console.log(differenceY);
        if (currentScroll - differenceY > 0) {
          this.refs.scrollView.scrollTo({y: currentScroll - differenceY});
        }
      });
    });
  }

  render() {


    let gal = CreatePostStore.gallery;

    let line = (
      <View
        style={{
          flex: 1,
          backgroundColor: '#D3D3D3',
          height: h(1)
        }}
      />
    );

    return (
        <View style={{paddingTop: 20, backgroundColor: 'white'}}>
          <SlimHeader
            leftText='Cancel'
            onLeft={() => {
              _.first(this.context.navigators).jumpTo(appStack)
              _.last(this.context.navigators).jumpTo(createPost)

              // only reset after view is gone
              setTimeout(() => CreatePostStore.reset(), 1000);
            }}
            title='Gallery'
            titleStyle={{fontFamily: FONTS.SF_MEDIUM}}
            rightText='Next'
          />
          <ScrollView
            ref='scrollView'
            bounces={false}
            style={{
              backgroundColor: 'white',
              height: windowHeight - 20 - h(88)
            }}
          >
            <AddTagModal />
            <ImagePreview
              navigators={this.context.navigators}
              gallery={CreatePostStore.gallery} />
            <TagInfo gallery={CreatePostStore.gallery} />

            <ActionMenu gallery={CreatePostStore.gallery} />
            {line}
            <PictureView
              onPlus={() => {
                CreatePostStore.reset(false)
                StatusBar.setHidden(true)
                _.last(this.context.navigators).jumpTo(createPost)
              }}
              gallery={CreatePostStore.gallery}
            />
            {line}
            <TextInput
              onFocus={(element) => this.scrollToElement(element.target)}
              onEndEditing={() => this.refs.scrollView.scrollTo({y: 0})}
              style={{
                height: 40,
                backgroundColor: 'white',
                paddingLeft: h(30),
                fontSize: h(28),
                color: '#3E3E3E'
              }}
              placeholder='Post description'
              value={CreatePostStore.gallery.description}
              onChangeText={(text) => CreatePostStore.gallery.description = text}
            />
          </ScrollView>
        </View>
    );
  }
}
