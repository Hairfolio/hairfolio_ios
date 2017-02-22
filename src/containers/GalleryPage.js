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
  ActivityIndicator,
  PickerIOS, Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'hairfolio/src/helpers.js';

import SlimHeader from 'components/SlimHeader.js'
import AlbumStore from 'stores/AlbumStore.js'
import CreatePostStore from 'stores/CreatePostStore.js'
import AddTagStore from 'stores/AddTagStore.js'
import AddServiceStore from 'stores/AddServiceStore.js'

import ShareStore from 'stores/ShareStore.js'

import ServiceBackend from 'backend/ServiceBackend.js'
import LoadingScreen from 'components/LoadingScreen.js'
import Video from 'react-native-video'


import LinearGradient from 'react-native-linear-gradient';

import {appStack, createPost, onPress, postFilter, albumPage, addServiceOne, filter, addLink, addServiceTwo, addServiceThree} from '../routes';

import * as routes from '../routes.js'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

var RCTUIManager = require('NativeModules').UIManager;

var ImageFilter = require('NativeModules').ImageFilter;

import MyPicker from 'components/MyPicker.js'

import {Dimensions} from 'react-native';

import ReactNative from 'react-native';

import ServiceBox from 'components/post/ServiceBox.js'

import AddTagModal from 'components/post/AddTagModal.js'

import VideoPreview from 'components/VideoPreview.js'

import Triangle from 'react-native-triangle';

class HashTag extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      top: -100,
      left: -100,
      width: null,
    };
  }

  componentDidMount() {
    setTimeout(() =>  {
      this.refs.hashView.measure((a, b, width, height, px, py) => {
        console.log('myWidth', width);
        console.log('myWidth', height);
        this.setState({
          width: width + 10,
          left: this.props.pic.x - width / 2 - 5,
          top: this.props.pic.y - h(25)
        });
      });
    });
  }
  render() {
    return (
     <View
          ref='hashView'
          onLayout={(a, b, c, d) => console.log('hash', a, b, c, d)}
          style={{
            top: this.state.top,
            left: this.state.left,
            width: this.state.width,
            height: 25,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}
        >
          <Triangle
            width={10}
            height={25}
            color={'#3E3E3E'}
            direction={'left'}
          />

        <Text style={{paddingLeft: 5, paddingTop: 3, paddingRight: 5, backgroundColor: '#3E3E3E', fontSize: 15, height:25, color: 'white'}}>#{this.props.pic.hashtag}</Text>
      </View>
    );
  }
}


const ImagePreview = observer(({gallery, navigators}) => {

  if (CreatePostStore.loadGallery) {
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
        <ActivityIndicator size='large' />
      </View>
    );
  }



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
      gallery.selectedPicture.isVideo ? 'Delete Video' : 'Delete Picture',
      'Are you sure you want to delete this item from the gallery?',

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

  window.picture = gallery.selectedPicture;

  let closeBtn = (
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
  );

  if (gallery.selectedPicture.isVideo) {
    return (
      <View>
        <VideoPreview picture={gallery.selectedPicture} />
        {closeBtn}
      </View>
    );
  }


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
            AddServiceStore.reset();

            AddServiceStore.posX = a.nativeEvent.locationX;
            AddServiceStore.posY = a.nativeEvent.locationY;

            AddServiceStore.myBack = () => {
              navigators[0].jumpTo(routes.createPostStack);
            };

            AddServiceStore.save = (obj) => {
              CreatePostStore.gallery.addServicePicture(
                AddServiceStore.posX,
                AddServiceStore.posY,
                obj
              );
              AddServiceStore.myBack();
            };

            navigators[0].jumpTo(addServiceOne);
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
          onError={(e) => alert(e.nativeEvent.error)}
          source={gallery.selectedPicture.source}
        />
      </TouchableWithoutFeedback>
      {closeBtn}

    {gallery.selectedPicture.isVideo ?  <View /> :
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
      }
    {gallery.selectedPicture.tags.map((pic) => {

      let style = {
        position: 'absolute',
        top: pic.y - 13,
        left: pic.x - 13,
        height: 26,
        width: 26,
        backgroundColor: '#3E3E3E',
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center'
      };

      if (pic.type == 'hashtag') {
        return (
          <HashTag key={pic.key} pic={pic} />
        );
      }


      if (pic.imageSource) {
        return (
          <Image
            style={style}
            key={pic.key}
            source={pic.imageSource}
          />
        );
      }

      return (
        <View
          key={pic.key}
          style={style}>
            <Text style={{fontSize: 15, backgroundColor: 'transparent', color: 'white'}}>{pic.abbrev}</Text>
        </View>
      );

    })}
  </View>
  );
});

const ActionRow = observer(({tagMenu, imageStyle}) => {

  let backgroundColor = tagMenu.selected ? '#3E3E3E' : 'white';
  let fontColor = tagMenu.selected ? 'white' : '#424242';


  return (
    <TouchableWithoutFeedback
      onPress={() => tagMenu.select()}
    >
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: backgroundColor}}>
        <Image
          style={{height: h(34), width: h(28), marginRight: 5, ...imageStyle}}
          source={tagMenu.source}
        />
        <Text
          style={{
            fontSize: h(24),
            color: fontColor
          }}
        >
          {tagMenu.title}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
});

const ActionMenu = observer(({gallery}) => {

  if (gallery.selectedPicture == null) {
    return <View />;
  }

  if (gallery.selectedPicture.isVideo) {
    return (
      <View
        style={{height: h(82), backgroundColor: 'white', flexDirection: 'row'}}
      />
    );
  }

  return (
    <View style={{height: h(82), flexDirection: 'row'}} >
      <ActionRow
        imageStyle={{
          width: h(19),
          height: h(27)
        }}
        tagMenu={gallery.hashTagMenu}
      />
      <ActionRow
        imageStyle={{
          width: h(33),
          height: h(34)
        }}
        tagMenu={gallery.serviceTagMenu}
      />
      <ActionRow
        imageStyle={{
          width: h(26),
          height: h(27)
        }}
        tagMenu={gallery.linkTagMenu}
      />

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

              CreatePostStore.gallery.unselectTag();

              // only reset after view is gone
              setTimeout(() => CreatePostStore.reset(), 1000);
            }}
            title='Gallery'
            titleStyle={{fontFamily: FONTS.SF_MEDIUM}}
            rightText='Next'
            onRight={() => {
              if (!CreatePostStore.gallery.description ||  CreatePostStore.gallery.description.length == 0) {
                alert('Description cannot be blank');
              } else {
                CreatePostStore.gallery.unselectTag();
                ShareStore.reset();
                _.last(this.context.navigators).jumpTo(routes.share)

                ShareStore.myBack = () => _.last(this.context.navigators).jumpTo(routes.gallery);
              }
            }}
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
                CreatePostStore.reset(false);
                CreatePostStore.gallery.unselectTag();
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
          <LoadingScreen style={{opacity: 0.6}} store={CreatePostStore} />
        </View>
    );
  }
}
