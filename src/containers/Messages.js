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
import MessageDetailsStore from 'stores/MessageDetailsStore.js'

import WriteMessageStore from 'stores/WriteMessageStore'

import StarGiversStore from 'stores/StarGiversStore.js'

import {appStack, gallery, postFilter, albumPage} from '../routes';

import * as routes from 'hairfolio/src/routes.js'

import {STATUSBAR_HEIGHT, POST_INPUT_MODE} from '../constants';

import LoadingScreen from 'components/LoadingScreen.js'
import BlackHeader from 'components/BlackHeader.js'

import CommentsStore from 'stores/CommentsStore.js'

import MessagesStore from 'stores/MessagesStore.js'


import Swipeout from 'hairfolio/react-native-swipeout/index.js';

const MessageRow = observer(({store}) => {
  let pictureElement;

  if (store.picture) {
    pictureElement = (
      <Image
        style={{height: 40, width:40, marginRight: h(15)}}
        source={store.picture.getSource(40)}
      />
    );
  }

  var swipeoutBtns = [
    {
      height: h(120),
      width: h(120),
      onPress: () => MessagesStore.delete(store),
      component:
      <View style={{
        backgroundColor: '#E62727',
        alignItems: 'center',
        justifyContent: 'center',
        width: h(120),
        height: h(120),
      }}
    >
      <Image
        style={{height: h(48), width: h(46)}}
        source={require('img/profile_trash.png')}
      />
    </View>
    }
  ]


  return (
    <Swipeout
      btnWidth={h(120)}
      right={swipeoutBtns}>
      <TouchableHighlight
        underlayColor='#ccc'
        onPress={
          () => {
            MessageDetailsStore.myBack = () => window.navigators[0].jumpTo(routes.messagesRoute);
            window.navigators[0].jumpTo(routes.messageDetailsRoute);
          }
        }
      >
        <View
          style = {{
            flexDirection: 'row',
            paddingTop: h(16),
            backgroundColor: 'white'
          }}
        >
          <View
            style = {{
              width: h(121),
              paddingLeft: h(16)
            }}
          >
            <Image
              style={{height: h(80), width: h(80), borderRadius: h(40)}}
              source={store.user.profilePicture.getSource(80)}
            />
          </View>
          <View
            style = {{
              flexDirection: 'row',
              flex: 1,
              paddingBottom: h(23),
              borderBottomWidth: h(1),
              borderBottomColor: '#D8D8D8'
            }}
          >
            <View
              style = {{
                flex: 1
              }}
            >
              <Text
                style = {{
                  fontFamily: store.isNew ? FONTS.HEAVY : FONTS.MEDIUM,
                  fontSize: h(26),
                  color: '#393939'
                }}>
                {store.user.name}
              </Text>
              <Text
                numberOfLines={1}
                style = {{
                  fontSize: h(24),
                  color:  store.isNew ? '#393939' : '#868686',
                  fontFamily:  store.isNew ? FONTS.HEAVY : FONTS.ROMAN
                }}
              >
                {store.text}
              </Text>
            </View>

            <View
              style = {{
                paddingLeft: h(15),
                paddingTop: h(37),
                paddingRight: h(15)
              }}
            >
              <Text
                style = {{
                  fontFamily: store.isNew ? FONTS.HEAVY : FONTS.ROMAN,
                  color: store.isNew ? '#393939' : '#D8D8D8',
                  fontSize: h(24),
                  flex: 1,
                  textAlign: 'right'
                }}

              >
                {store.timeDifference}
              </Text>
            </View>
            {pictureElement}
          </View>
        </View>
      </TouchableHighlight>
    </Swipeout>
  );
});




const MessagesContent = observer(({store}) => {
  return (
    <View style={{flex: 1}}>
      <ScrollView
        ref={el => {store.scrollView = el}}
        onContentSizeChange={(w, h) => store.contentHeight = h}
        onLayout={ev => store.scrollViewHeight = ev.nativeEvent.layout.height}
      >
      {
        store.messages.map(e => <MessageRow key={e.key} store={e} />)}
      </ScrollView>
    </View>
  );
});

import LoadingPage from 'components/LoadingPage'


@connect(app)
@observer
export default class Messages extends PureComponent {

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };


  render() {

    let store = MessagesStore;

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
        MessagesStore.load();
      }}
    >
       <View style={{flex: 1}}>
        <BlackHeader
          onLeft={() => MessagesStore.myBack()}
          title='Messages'
          onRenderRight={() =>
            <TouchableOpacity
              onPress={
                () => {
                  window.navigators[0].jumpTo(routes.writeMessageRoute);
                  WriteMessageStore.myBack = () => window.navigators[0].jumpTo(routes.messagesRoute);
                }
              }
            >
              <Image
                style = {{
                  width: h(28),
                  height: h(28),
                  alignSelf: 'flex-end'
                }}
                source={require('img/message_plus.png')}
              />
            </TouchableOpacity>
          }
        />
        <Content />
      </View>
    </NavigationSetting>);
  }
};
