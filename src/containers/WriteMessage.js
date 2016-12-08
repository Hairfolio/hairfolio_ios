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

import StarGiversStore from 'stores/StarGiversStore.js'
import LoadingPage from 'components/LoadingPage'

import {appStack, gallery, postFilter, albumPage} from '../routes';

import * as routes from 'hairfolio/src/routes.js'

import MessageDetailsStore from 'stores/MessageDetailsStore.js';

import {STATUSBAR_HEIGHT, POST_INPUT_MODE} from '../constants';

import LoadingScreen from 'components/LoadingScreen.js'
import BlackHeader from 'components/BlackHeader.js'

import WriteMessageStore from 'stores/WriteMessageStore.js'


import Swipeout from 'hairfolio/react-native-swipeout/index.js';

const PeopleRow = observer(({store}) => {
  let checkElement;

  if (store.isSelected) {
    checkElement = (
      <Image
        style = {{
          marginRight: h(32),
          marginTop: h(12)
        }}
        source={require('img/message_check.png')}
      />
    );
  }

  return (
    <TouchableWithoutFeedback
      onPress={
        () => store.flip()
      }
    >
        <View
          style = {{
            flexDirection: 'row',
            paddingTop: h(16),
            backgroundColor: 'white',
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
              height: h(100),
              paddingTop: h(8),
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
                  fontFamily: FONTS.MEDIUM,
                  fontSize: h(28),
                  color: '#393939'
                }}>
                {store.user.name}
              </Text>
            </View>
            {checkElement}
          </View>
        </View>
      </TouchableWithoutFeedback>
  );
});




const WriteMessageContent  = observer(({store}) => {
  return (
    <View style={{flex: 1}}>
      <ScrollView
        ref={el => {store.scrollView = el}}
        onContentSizeChange={(w, h) => store.contentHeight = h}
        onLayout={ev => store.scrollViewHeight = ev.nativeEvent.layout.height}
      >
      {
        store.items.map(e => <PeopleRow key={e.key} store={e} />)}
      </ScrollView>
    </View>
  );
});


const ToInput = observer(({store}) => {
  return (
    <View
      style = {{
        height: h(95),
        paddingHorizontal: h(28),
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: h(1),
        borderBottomColor: '#D8D8D8'
      }}
    >
      <Text
        style = {{
          color: '#393939',
          fontSize: h(30),
          fontFamily: FONTS.MEDIUM,
          marginRight: h(15)
        }}

      >To: </Text>
      <TextInput
        style = {{
          fontSize: h(30),
          fontFamily: FONTS.MEDIUM
        }}
        text={store.inputText}
        onChangeText={
          text => {
            store.inputText = text;
          }}
        placeholder='Search'
        style={{
          flex: 1
        }}
      />
    </View>

  );
});


@connect(app)
@observer
export default class WriteMessage extends PureComponent {

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };


  render() {

    let store = WriteMessageStore;

    let Content = LoadingPage(
      WriteMessageContent,
      store
    );


    return (<NavigationSetting
      style={{
        flex: 1,
      }}
      onWillFocus={() => {
        StatusBar.setBarStyle('light-content');
        WriteMessageStore.load();
      }}
    >
       <View style={{flex: 1}}>
        <BlackHeader
          onLeft={() => WriteMessageStore.myBack()}
          title='New Message'
          onRenderRight={() =>
            <TouchableOpacity
              onPress={
                () => {
                  MessageDetailsStore.myBack = () => window.navigators[0].jumpTo(routes.messagesRoute);
                  MessageDetailsStore.title = WriteMessageStore.titleNames;
                  window.navigators[0].jumpTo(routes.messageDetailsRoute);
                }
              }
            >
              <Text
                style = {{
                  fontSize: h(34),
                  color: 'white',
                  fontFamily: FONTS.MEDIUM,
                  textAlign: 'right',
                  opacity: WriteMessageStore.selectedNumber == 0 ? 0.5 : 1
                }}
              >
                Start
              </Text>
            </TouchableOpacity>
          }
        />
        <ToInput store={WriteMessageStore} />

        <Content />
      </View>
    </NavigationSetting>);
  }
};
