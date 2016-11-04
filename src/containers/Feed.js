import PureComponent from '../components/PureComponent';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {user} from '../selectors/user';
import NavigationSetting from '../navigation/NavigationSetting';

import {BOTTOMBAR_HEIGHT, STATUSBAR_HEIGHT} from '../constants';

import SimpleButton from '../components/Buttons/Simple';

import FeedStore from 'stores/FeedStore.js'

import {profile, profileExternal, appStack} from '../routes';

import Post from 'components/feed/Post.js'
import WhiteHeader from 'components/WhiteHeader.js'

import {
  _, // lodash
  v4,
  observer, // mobx
  h,
  FONTS,
  COLORS,
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





@connect(app, user)
export default class Feed extends PureComponent {

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  render() {

    let store = FeedStore;

    return (<NavigationSetting
      style={{
        flex: 1,
        backgroundColor: COLORS.WHITE,
        paddingTop: STATUSBAR_HEIGHT,
        paddingBottom: BOTTOMBAR_HEIGHT
      }}
    >
      <View style={{
        flex: 1
      }}>

      <ScrollView>
        {store.elements.map(p => <Post key={p.key} post={p} />)}
      </ScrollView>

      </View>
    </NavigationSetting>);
  }
};
