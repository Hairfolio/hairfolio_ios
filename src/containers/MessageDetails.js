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
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {post} from '../selectors/post';
import {postActions} from '../actions/post';
import {COLORS, FONTS, h, SCALE} from 'hairfolio/src/style';
import NavigationSetting from '../navigation/NavigationSetting';
import {observer} from 'mobx-react/native';
import autobind from 'autobind-decorator'
import _ from 'lodash';

import FollowButton from 'components/FollowButton.js'

import WriteMessageStore from 'stores/WriteMessageStore'

import StarGiversStore from 'stores/StarGiversStore.js'

import {appStack, gallery, postFilter, albumPage} from '../routes';

import * as routes from 'hairfolio/src/routes.js'

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
    } else { // image

      let imageStyle = {};

      if (this.state.heightRatio) {
        imageStyle = {
          width: this.props.maxWidth,
          height: this.props.maxWidth * this.state.heightRatio
        };
      }

      return (
        <View >
          <Image
            style={imageStyle}
            onLayout={
              (event) => {
                let currentWidth  = event.nativeEvent.layout.width;
                let currentHeight = event.nativeEvent.layout.height;
                // console.log('layout pic', event.nativeEvent.layout);
                // console.log('size', currentWidth, currentHeight);

                let heightRatio = event.nativeEvent.layout.height / event.nativeEvent.layout.width;
                if (!this.state.heightRatio) {
                  this.setState({
                    heightRatio: heightRatio
                  });
                }

              }
            }
            resizeMode='contain'
            source={this.props.store.picture.getSource(this.props.maxWidth)}
          />
        </View>
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
        source={store.user.profilePicture.getSource(h(80))}
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
      <MessageContent store={store} maxWidth = {2 / 3 * windowWidth - h(35) - (store.isMe ? 0 : h(40 + 15))}

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
      <TouchableOpacity>
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

    console.log('render messages');

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
      </View>
    </NavigationSetting>);
  }
};
