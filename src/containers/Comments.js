import React from 'react';
import PureComponent from '../components/PureComponent';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {
  CameraRoll,
  ScrollView,
  StatusBar,
  TextInput,
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

import {appStack, gallery, postFilter, albumPage} from '../routes';

import {STATUSBAR_HEIGHT, POST_INPUT_MODE} from '../constants';

import LoadingScreen from 'components/LoadingScreen.js'
import BlackHeader from 'components/BlackHeader.js'

import CommentsStore from 'stores/CommentsStore.js'


const InputBar = observer(({inputStore, onAction}) => {
  return (
    <View
      style = {{
        height: h(90),
        backgroundColor: '#E6E6E6',
        flexDirection: 'row'
      }}>
      <View
        style={{
          flex: 1,
          padding: h(15)
        }}
      >
        <TextInput
          style={{
            flex: 1,
            backgroundColor: 'white',
            paddingLeft: h(20),
            fontSize: h(28),
            borderRadius: h(9)
          }}
          value={inputStore.value}
          onChangeText={v => inputStore.value = v}
          placeholder='Add comment...'
        />
      </View>
      <View
        style={{
          width: h(160),
          padding: h(16),
          paddingLeft: 0,
        }}
      >
        <TouchableOpacity
          onPress={() => inputStore.isEmpty ? null : onAction()}
          style={{
            flex: 1,
            backgroundColor: inputStore.isEmpty ? '#8D8D8D' : '#3E3E3E',
            borderRadius: h(9),
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text
            style={{
              color: inputStore.isEmpty ? '#E6E6E6' : 'white',
            }}
          >
           Send
          </Text>
        </TouchableOpacity>

      </View>

    </View>

  );
});

const CommentsContent = observer(() => {

  if (CommentsStore.isLoading) {
    return (
      <LoadingScreen
        store={CommentsStore}
        onAction={() => alert('send')}
      />
    );
  }

  return (
    <View style={{flex: 1}}>
      <Text
        style= {{
          paddingTop: h(38),
          fontSize: h(34),
          textAlign: 'center',
          fontFamily: FONTS.BOOK_OBLIQUE
        }}
      >
    There have been no comments yet.
    </Text>
    </View>
  );
});

const CommentInput = observer(() => {
  let store = CommentsStore;
  return (
    <View>
      <InputBar
        inputStore={store.inputStore}
        onAction={() => {
          store.inputStore.value = '';
        }}
      />
      <KeyboardSpacer />
    </View>
  );
});


@connect(app)
export default class Comments extends PureComponent {

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };


  render() {

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
          onLeft={() => window.navigators[0].jumpTo(appStack)}
          title='Comments'/>
        <CommentsContent />
        <CommentInput />
      </View>
    </NavigationSetting>);
  }
};
