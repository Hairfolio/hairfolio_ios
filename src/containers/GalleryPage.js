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
} from 'Hairfolio/src/helpers';
import NavigatorStyles from '../common/NavigatorStyles';
import SlimHeader from '../components/SlimHeader';
import AlbumStore from '../mobx/stores/AlbumStore';
import CreatePostStore from '../mobx/stores/CreatePostStore';
import AddTagStore from '../mobx/stores/AddTagStore';
import AddServiceStore from '../mobx/stores/AddServiceStore';
import ShareStore from '../mobx/stores/ShareStore';
import ServiceBackend from '../backend/ServiceBackend';
import LoadingScreen from '../components/LoadingScreen';
import Video from 'react-native-video'
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ReactNative, { NativeModules } from 'react-native';
const RCTUIManager = NativeModules.UIManager;
const ImageFilter = NativeModules.ImageFilter;
import MyPicker from '../components/MyPicker';
import {Dimensions} from 'react-native';
import ServiceBox from '../components/post/ServiceBox';
import AddTagModal from '../components/post/AddTagModal';
import VideoPreview from '../components/VideoPreview';
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
          style={{
            position: 'absolute',
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

const ImagePreview = observer(({gallery, navigator}) => {
  if (CreatePostStore.loadGallery) {
    return (
      <View
        style={{
          width: windowWidth,
          height: windowWidth * (4/3),
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
          height: windowWidth * (4/3),
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
    navigator.push({
      screen: 'hairfolio.FilterPage',
      navigatorStyle: NavigatorStyles.tab,
    });
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
        height: windowWidth * (4/3),
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
            AddServiceStore.save = (obj) => {
              CreatePostStore.gallery.addServicePicture(
                AddServiceStore.posX,
                AddServiceStore.posY,
                obj
              );
              navigator.dismissModal({ animationType: 'slide-down' });
            };
            navigator.showModal({
              screen: 'hairfolio.AddServicePageOne',
              navigatorStyle: NavigatorStyles.tab,
              passProps:{goBack:this.props}
            });
          } else if (gallery.linkTagSelected) {
            navigator.push({
              screen: 'hairfolio.AddLink',
              navigatorStyle: NavigatorStyles.tab,
            })
          } else if (gallery.hashTagSelected) {
            StatusBar.setHidden(true);
            AddTagStore.show();
          }
        }}>
        <Image
          ref={(el) => window.img = el}
          style={{height: windowWidth * (4/3), width: windowWidth}}
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
  constructor(props) {
    super(props);
    this.props.navigator.toggleTabs({
      to: 'shown',
    });
  }

  static navigatorStyle = {
    drawUnderTabBar: true,
  }

  scrollToElement(reactNode) {
    RCTUIManager.measure(ReactNative.findNodeHandle(reactNode), (x, y, width, height, pageX, pageY) => {
      RCTUIManager.measure(this.refs.scrollView.getInnerViewNode(), (x2, y2, width2, height2, pageX2, pageY2) => {
        var currentScroll = 64 - pageY2;
        var differenceY = -pageY - 320 + (windowHeight - 20 - h(88));
        if (currentScroll - differenceY > 0) {
          this.refs.scrollView.scrollTo({y: currentScroll - differenceY});
        }
      });
    });
  }

  render() {

    let gal = CreatePostStore.gallery;

    let line = (key) => (
      <View
        key={key}
        style={{
          flex: 1,
          backgroundColor: '#D3D3D3',
          height: h(1)
        }}
      />
    );

    let bottomContent = [
      line('line1'),
      <PictureView
        key='preview'
        onPlus={() => {
          CreatePostStore.reset(false);
          CreatePostStore.gallery.unselectTag();
          StatusBar.setHidden(true)
          this.props.navigator.pop({ animated: true });
        }}
        gallery={CreatePostStore.gallery}
      />,
      line('line2'),
      <TextInput
        key='description'
        onFocus={(element) => this.scrollToElement(element.target)}
        onEndEditing={() => this.refs.scrollView.scrollTo({y: 0})}
        style={{
          height: 40,
          backgroundColor: 'white',
          paddingLeft: h(30),
          fontSize: h(28),
          color: '#3E3E3E'
        }}
        multiline = {true}
        placeholder='Post description'
        value={CreatePostStore.gallery.description}
        onChangeText={(text) => CreatePostStore.gallery.description = text}
      />
    ];

    if (CreatePostStore.gallery.selectedTag != null) {
      bottomContent = (
        <View
          style={{
            height: windowHeight - 20 - h(88) - windowWidth - h(82),
            width: windowWidth,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text
            style={{
              color: '#424242',
              fontSize: h(33),
              fontFamily: FONTS.OBLIQUE,
              fontWeight: '400'
            }}
          >Tap where to add tag</Text>
        </View>
      );
    }

    return (
      <View style={{paddingTop: 20, paddingBottom: 50, backgroundColor: 'white', marginBottom: 45,}}>
          <SlimHeader
            leftText='Cancel'
            onLeft={() => {
              this.props.navigator.toggleTabs({
                to: 'shown',
              });
              this.props.navigator.popToRoot({ animated: true });
              this.props.navigator.switchToTab({
                tabIndex: 0,
              });
              CreatePostStore.gallery.unselectTag();
              // only reset after view is gone
              setTimeout(() => CreatePostStore.reset(), 1000);
            }}
            title='Gallery'
            titleStyle={{fontFamily: FONTS.SF_MEDIUM}}
            rightText='Next'
            onRight={() => {
              if (!CreatePostStore.gallery.description ||  CreatePostStore.gallery.description.trim().length == 0) {
                CreatePostStore.gallery.description = CreatePostStore.gallery.description.trim()
                alert('Post description cannot be blank');
              } else {
                CreatePostStore.gallery.unselectTag();
                ShareStore.reset();
                this.props.navigator.push({
                  screen: 'hairfolio.Share',
                  navigatorStyle: NavigatorStyles.tab,
                })
              }
            }}
          />
          <ScrollView
            ref='scrollView'
            bounces={false}
            scrollEventThrottle={16}
            onScroll={(e) => {
              const offset = e.nativeEvent.contentOffset.y;
              // if (offset < 50) {
              //   this.props.navigator.toggleTabs({
              //     to: 'shown',
              //   });
              // } else {
              //   this.props.navigator.toggleTabs({
              //     to: 'hidden',
              //   });
              // }
            }}
            style={{
              backgroundColor: 'white',
            }}
          >
            <AddTagModal />
            <ImagePreview
              navigator={this.props.navigator}
              gallery={CreatePostStore.gallery} />

            <ActionMenu gallery={CreatePostStore.gallery} />
            {bottomContent}
          </ScrollView>
          <LoadingScreen style={{opacity: 0.6}} store={CreatePostStore} />
        </View>
    );
  }
}
