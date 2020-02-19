import MyImage from '../components/MyImage';
import { windowWidth } from 'Hairfolio/src/helpers';
import { FONTS, h } from 'Hairfolio/src/style';
import { observer } from 'mobx-react';
import React from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import whiteBack from '../../resources/img/nav_white_back.png';
import NavigatorStyles from '../common/NavigatorStyles';
import LoadingPage from '../components/LoadingPage';
import LoadingScreen from '../components/LoadingScreen';
import PureComponent from '../components/PureComponent';
import VideoPreview from '../components/VideoPreview';
import MessageDetailsStore from '../mobx/stores/MessageDetailsStore';
import PostDetailStore from '../mobx/stores/PostDetailStore';
import ImageCropPicker from 'react-native-image-crop-picker';
import { showLog, windowHeight } from '../helpers';

// const objMessageDetails={};
@observer
class MessageContent extends React.Component {

  constructor(props) {
    super(props);

    this.store = props.store;

    this.state = {
      width: null,
      
    };
  }

  render() {
    let textStyle = {
      padding: h(15),
      borderWidth: h(1),
      borderColor: '#E2DEDE',
      borderStyle: 'solid',
      borderRadius: 8,
      color: '#868686'
    };



    if (this.state.width) {
      textStyle['width'] = this.state.width;
    }

    if (this.props.store.type == 'text') {
      return (
        <View>
          <Text
            onLayout={
              (event) => {
                let currentWidth = event.nativeEvent.layout.width;

                if (currentWidth > this.props.maxWidth) {
                  this.setState({ width: this.props.maxWidth });
                }
              }
            }
            style={textStyle}
          >{this.props.store.text}</Text>
        </View>
      );
    } else if (this.props.store.type == 'picture') {
      if (this.props.store.picture.isVideo) {
        return (
          <VideoPreview post={this.store.post}  width={this.props.maxWidth} picture={(this.props.store.picture) ? this.props.store.picture : null} />
        );
      } else {
        return (
          <MyImage
            source={(this.props.store.picture) ? this.props.store.picture.getSource(2 * this.props.maxWidth, 2 * this.props.maxWidth) : null}
            width={this.props.maxWidth}
          />
        );
      }


    } else {
      // post
      let store = this.props.store;

      return (
        <TouchableOpacity
          style={{
            borderRadius: 8,
            borderWidth: h(1),
            borderStyle: 'solid',
            borderColor: '#E2DEDE',
            width: this.props.maxWidth
          }}
          onPress={
            () => {
              PostDetailStore.jump(
                false,
                store.post,
                this.props.navigator,
                'from_feed'
              )
            }
          }
        >
          <View
            style={{
              height: h(92),
              alignItems: 'center',
              paddingHorizontal: h(15),
              flexDirection: 'row',
            }}
          >
            <Image
              style={{ height: h(32), width: h(32), borderRadius: h(16) }}
              source={store.post.creator.profilePicture.getSource(32, 32)}
            />

            <Text
              style={{
                color: '#393939',
                fontSize: h(26),
                fontFamily: FONTS.MEDIUM,
                marginHorizontal: h(10),
                flex: 1
              }}
              numberOfLines={1}
            >
              {store.post.creator.name}
            </Text>

            <Image
              style={{ height: h(18), width: h(30) }}
              source={require('img/message_arrow.png')}
            />


          </View>

          <MyImage
            source={store.post.currentImage.getSource(2 * this.props.maxWidth, 2 * this.props.maxWidth)}
            width={this.props.maxWidth}
          />

          <View
            style={{
              paddingHorizontal: h(24),

            }}
          >
            <Text
              style={{
                fontSize: h(26),
                fontFamily: FONTS.MEDIUM,
                marginTop: h(18)
              }}
              numberOfLines={1}
            >
              {store.post.creator.name}
            </Text>
            <Text
              style={{
                fontSize: h(24),
                fontFamily: FONTS.ROMAN,
                color: '#868686',
                marginBottom: h(24)
              }}
              numberOfLines={1}
            >
              {store.post.description}
            </Text>
          </View>

        </TouchableOpacity>
      );

    }
  }
}

const Message = observer(({ store, navigator }) => {

  let userImage;

  if (store.user != null) {
    userImage = (
      <Image
        style={{ height: h(80), width: h(80), borderRadius: h(40), marginRight: h(15) }}
        source={(store.user.profilePicture) ? store.user.profilePicture.getSource(80, 80) : null}
      />
    );
  }



  let leftSpace;

  if (store.isMe) {
    leftSpace = <View style={{ flex: 1 }} />;
  }


  return (
    <View
      style={{
        width: 2 / 3 * windowWidth,
        marginTop: h(15),
        alignSelf: store.isMe ? 'flex-end' : 'flex-start',
        flexDirection: 'row',
        paddingLeft: store.isMe ? 0 : h(15),
        paddingRight: store.isMe ? h(15) : 0,
      }}
    >
      {userImage}
      {leftSpace}
      <MessageContent store={store} navigator={navigator} maxWidth={Math.round(2 / 3 * windowWidth - h(35) - (store.isMe ? 0 : h(40 + 15)))}

      />
      <View style={{ flex: 0 }} />
    </View>

  );
});

@observer
class MessagesContent extends React.Component {

  componentDidMount() {
    setTimeout(() => {
      this.props.store.scrollToBottom();
    }, 100);
  }

  render() {
    let store = this.props.store;

    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{
            flex: 1
          }}
          ref={el => { store.scrollView = el }}
          onContentSizeChange={(w, h) => store.contentHeight = h}
          onLayout={ev => store.scrollViewHeight = ev.nativeEvent.layout.height}
        >
          {store.messages.map((e, index) => <Message key={index} store={e} navigator={this.props.navigator}/>)}
          <View style={{ height: h(35) }} />
        </ScrollView>
      </View>
    );
  }
}


const MessageInput = observer((method) => {

  let store = MessageDetailsStore;

  return (
    <View
      style={{
        height: h(90),
        backgroundColor: '#E7E7E7',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: h(15)
      }}
    >
      <TouchableOpacity
        onPress={
          () => {

            ImagePicker.showImagePicker({
              title: 'Select Photo or Video',
              takePhotoButtonTitle: 'Take Photo or Video',
              mediaType: 'mixed',
              videoQuality: 'medium',
              durationLimit: 60,
              noData: true
            }, (response) => {
              if (response.error) {
                alert(response.error);
              }
              if (response.uri) {
                if (response.uri.endsWith('MOV')) {
                  MessageDetailsStore.sendVideo(response);
                } else {
                  // MessageDetailsStore.sendPicture(response);

                  ImageCropPicker.openCropper({
                    path: response.uri,
                    // width: windowWidth,
                    // height: windowWidth + 100,
                    // width: windowWidth*2,
                    // height: (windowWidth + 100)*2,
                    width: windowWidth + (windowWidth/2),
                    height: windowHeight,
                    cropping: true,
                    compressImageQuality:1
                  }).then(response => {
                    if (response.error) {
                      alert(response.error);
                    }
                    if (response.path) {
                      response.uri = response.path;
                      MessageDetailsStore.sendPicture(response);
                    }

                  });
                }
              }
            });

          }
        }

      >
        <Image
          style={{ height: h(53), width: h(63) }}
          source={require('img/message_camera.png')}
        />
      </TouchableOpacity>

      <TextInput
        onFocus={
          () => {
            setTimeout(() => method, 100);
          }
        }

        onEndEditing={
          () => {
            setTimeout(() => method, 100);
          }
        }

        style={{
          flex: 1,
          backgroundColor: 'white',
          borderRadius: h(9),
          marginTop: h(15),
          marginHorizontal: h(15),
          height: h(60),
          paddingHorizontal: h(15)
        }}

        value={store.inputText}
        onChangeText={t => store.inputText = t}
        placeholder='Write something'
      />

      <TouchableOpacity
        disabled={(store.inputText.length > 0) ? false : true}
        onPress={
          () => {
            store.sendText();
          }
        }

      >
        <View
          style={{
            backgroundColor: '#3E3E3E',
            borderRadius: h(9),
            alignItems: 'center',
            justifyContent: 'center',
            width: h(111),
            height: h(60),
            opacity: store.sendBtnOpacity
          }}
        >
          <Text
            style={{
              fontSize: h(30),
              fontFamily: FONTS.ROMAN,
              color: 'white'
            }}
          >
            Send
      </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
});

@observer
export default class MessageDetails extends PureComponent {
  static navigatorButtons = {
    leftButtons: [
      {
        id: 'back',
        icon: whiteBack,
      }
    ],
  };

  constructor(props) {
    super(props);
    this.scrollToBottomList = this.scrollToBottomList.bind(this);
    if (this.props.navigator) {
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }
  }

  onNavigatorEvent(event) {
    if (event.id == 'back') {
      this.props.navigator.pop({
        animated: true,
      });
    }
    if (event.id == 'bottomTabSelected') {
      showLog("bottomTabSelected ==>");
      // if (this.props.from_star) {

      //   this.props.navigator.resetTo({
      //     screen: 'hairfolio.Favourites',
      //     animationType: 'fade',
      //     navigatorStyle: NavigatorStyles.tab
      //   });

      // } else {
      //   this.props.navigator.resetTo({
      //     screen: 'hairfolio.Feed',
      //     animationType: 'fade',
      //     navigatorStyle: NavigatorStyles.tab
      //   });
      // }
    }
    if (event.id == 'bottomTabReselected') {
      showLog("bottomTabReselected ==>");

    }
  }

  scrollToBottomList() {
    this.refs.refScrollView.scrollToEnd({ animated: true })
  }

  render() {

    let store = MessageDetailsStore;
    let Content = LoadingPage(
      MessagesContent,
      store,
      { navigator: this.props.navigator }
    );

    return (
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          onKeyboardWillShow={() => { setTimeout(() => { this.scrollToBottomList() }, 150) }}
          alwaysBounceVertical={false}
          ref='refScrollView'
          onContentSizeChange={() => this.scrollToBottomList()}>
          <Content />
        </KeyboardAwareScrollView>
        <MessageInput method={this.scrollToBottomList} />
        <KeyboardSpacer onToggle={() => {
          this.scrollToBottomList();
        }} />
        <LoadingScreen style={{ opacity: 0.6 }} store={MessageDetailsStore.loadingStore} />
      </View>
    );
  }
};
