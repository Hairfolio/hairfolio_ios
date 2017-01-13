import React from 'react';
import PureComponent from '../components/PureComponent';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {
  CameraRoll,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableHighlight,
  View, Text, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Image} from 'react-native';

import VideoPreview from 'components/VideoPreview.js'
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {post} from '../selectors/post';
import {postActions} from '../actions/post';
import {COLORS, FONTS, h, SCALE} from 'hairfolio/src/style';
import NavigationSetting from '../navigation/NavigationSetting';
import {observer} from 'mobx-react/native';
import autobind from 'autobind-decorator'
import _ from 'lodash';
import * as routes from '../routes'
import PostDetailStore from 'stores/PostDetailStore.js'

import ImagePicker from 'react-native-image-picker'
import MyImage from 'hairfolio/src/components/MyImage.js'

import FollowButton from 'components/FollowButton.js'

import WriteMessageStore from 'stores/WriteMessageStore'

import StarGiversStore from 'stores/StarGiversStore.js'

import {appStack, gallery, postFilter, albumPage} from '../routes';


import {STATUSBAR_HEIGHT, POST_INPUT_MODE} from '../constants';

import LoadingScreen from 'components/LoadingScreen.js'
import BlackHeader from 'components/BlackHeader.js'

import CommentsStore from 'stores/CommentsStore.js'

import MessageDetailsStore from 'stores/MessageDetailsStore.js'

import {
  windowWidth,
  windowHeight,
} from 'hairfolio/src/helpers.js';

import Swipeout from 'hairfolio/react-native-swipeout/index.js';


@observer
class MessageContent  extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      width: null
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
                let currentWidth  = event.nativeEvent.layout.width;

                if (currentWidth >  this.props.maxWidth) {
                  this.setState({width: this.props.maxWidth});
                }
              }
            }
            style={textStyle}
          >{this.props.store.text}</Text>
        </View>
      );
    } else if (this.props.store.type == 'picture') {
      console.log('msg img');


      if (this.props.store.picture.isVideo) {
        return (
          <VideoPreview picture={this.props.store.picture} />
        );
      } else {
        return (
          <MyImage
            source={this.props.store.picture.getSource(2 * this.props.maxWidth)}
            width={this.props.maxWidth}
          />
        );
      }


    } else {
      // post
      let store = this.props.store;

      return (
        <TouchableOpacity
          style = {{
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
                () => window.navigators[0].jumpTo(routes.messageDetailsRoute)
              )
            }
          }
        >
          <View
            style = {{
              height: h(92),
              alignItems: 'center',
              paddingHorizontal: h(15),
              flexDirection: 'row',
            }}
          >
            <Image
              style={{height: h(32), width: h(32), borderRadius: h(16)}}
              source={store.post.creator.profilePicture.getSource(32)}
            />

          <Text
            style = {{
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
            style={{height: h(18), width: h(30)}}
            source={require('img/message_arrow.png')}
          />


      </View>

      <MyImage
        source={store.post.currentImage.getSource(2 * this.props.maxWidth)}
        width={this.props.maxWidth}
      />

    <View
      style = {{
        paddingHorizontal: h(24),

      }}
    >
      <Text
        style = {{
          fontSize: h(26),
          fontFamily: FONTS.MEDIUM,
          marginTop: h(18)
        }}
        numberOfLines={1}
      >
        {store.post.creator.name}
      </Text>
      <Text
        style = {{
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

const Message = observer(({store}) => {

  let userImage;

  if (store.user != null) {
    userImage = (
      <Image
        style={{height: h(80), width: h(80), borderRadius: h(40), marginRight: h(15)}}
        source={store.user.profilePicture.getSource(80)}
      />
    );
  }



  let leftSpace;

  if (store.isMe) {
    leftSpace = <View style={{flex: 1}} />;
  }


  return (
    <View
      style = {{
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
      <MessageContent store={store} maxWidth = {Math.round(2 / 3 * windowWidth - h(35) - (store.isMe ? 0 : h(40 + 15)))}

      />
      <View style={{flex: 0}} />
    </View>

  );
});

const MessagesContent = observer(({store}) => {
  return (
    <View style={{flex: 1}}>
      <ScrollView
        style = {{
          flex: 1
        }}
        ref={el => {store.scrollView = el}}
        onContentSizeChange={(w, h) => store.contentHeight = h}
        onLayout={ev => store.scrollViewHeight = ev.nativeEvent.layout.height}
      >
        {store.messages.map((e, index) => <Message key={index} store={e} />)}
        <View style={{height: h(35)}} />
      </ScrollView>
    </View>
  );
});

import LoadingPage from 'components/LoadingPage'

const MessageInput = observer(() => {

  let store = MessageDetailsStore;

  return (
    <View
      style = {{
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

            StatusBar.setHidden(true);

            ImagePicker.showImagePicker({
              title: 'Select Photo or Video',
              takePhotoButtonTitle: 'Take Photo or Video',
              mediaType: 'mixed',
              noData: true,
              allowsEditing: true,
              videoQuality: 'high'
            }, (response) => {
              StatusBar.setHidden(false);
              console.log('response', response);
              if (response.error) {
                alert(response.error);
              }
              if (response.uri) {
                if (response.uri.endsWith('MOV')) {
                  MessageDetailsStore.sendVideo(response);
                } else {
                  MessageDetailsStore.sendPicture(response);
                }
              }
            });
          }
        }

      >
        <Image
          style={{height: h(53), width: h(63)}}
          source={require('img/message_camera.png')}
        />
      </TouchableOpacity>

      <TextInput
        onFocus={
          () => {
            setTimeout(() => store.scrollToBottom(), 100);
          }
        }

        onEndEditing={
          () => {
            setTimeout(() => store.scrollToBottom(), 100);
          }
        }

        style = {{
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
      onPress={
        () => {
          store.sendText();
        }
      }

    >
      <View
        style = {{
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
        style = {{
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


@connect(app)
@observer
export default class MesageDetails extends PureComponent {

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };


  render() {

    let store = MessageDetailsStore;

    let Content = LoadingPage(
      MessagesContent,
      store
    );


    return (<NavigationSetting
      style={{
        flex: 1,
      }}
      onWillFocus={() => {
        StatusBar.setBarStyle('light-content');
      }}
    >
       <View style={{flex: 1}}>
        <BlackHeader
          onLeft={() => MessageDetailsStore.myBack()}
          title={store.title}
        />
        <Content />
        <MessageInput />
        <KeyboardSpacer/>
        <LoadingScreen style={{opacity: 0.6}} store={MessageDetailsStore.loadingStore} />
      </View>
    </NavigationSetting>);
  }
};
