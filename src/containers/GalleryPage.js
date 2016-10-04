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
  ScrollView,
  StatusBar,  Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'hairfolio/src/helpers.js';

import SlimHeader from 'components/SlimHeader.js'
import AlbumStore from 'stores/AlbumStore.js'
import CreatePostStore from 'stores/CreatePostStore.js'

import {appStack, createPost, onPress, postFilter, albumPage} from '../routes';

const ImagePreview = observer(({gallery}) => {

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
  return (
    <View
      style={{
        width: windowWidth,
        height: windowWidth,
      }}
    >
    <Image
      style={{height: windowWidth, width: windowWidth}}
      source={gallery.selectedPicture.source}
    />
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

const PlusPicture = observer(() => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', paddingLeft: h(30)}}>
      <TouchableOpacity>
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
          style={{height: h(134), width:h(134)}}
          source={picture.source}
        />
        {selectedBox}
      </View>
    </TouchableWithoutFeedback>

  );
});

const PictureView = observer(({gallery}) => {





  return (
    <ScrollView
      horizontal
      style={{
        height: h(170)
      }}
    >
      <PlusPicture />
      <View style={{flexDirection: 'row', alignItems: 'center', marginRight: h(30)}}>
        {gallery.pictures.map((el) => <Picture picture={el} key={el.key} />)}
    </View>
   </ScrollView>
  );
});

@observer
@autobind
export default class GalleryPage extends Component {

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  render() {
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
          onLeft={() =>{
            _.first(this.context.navigators).jumpTo(appStack)
            _.last(this.context.navigators).jumpTo(createPost)
            CreatePostStore.reset();
          }}
          title='Gallery'
          titleStyle={{fontFamily: FONTS.SF_MEDIUM}}
          rightText='Next'
        />
        <ImagePreview gallery={CreatePostStore.gallery} />
        <ActionMenu gallery={CreatePostStore.gallery} />
        {line}
        <PictureView gallery={CreatePostStore.gallery} />
        {line}
      </View>
    );
  }
}
