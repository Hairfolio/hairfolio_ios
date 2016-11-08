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
  ActivityIndicator,
  PickerIOS, Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'hairfolio/src/helpers.js';


const FeedHeader = observer(() => {
  return (
    <View
      style = {{
        height: h(92),
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
      <View style={{
        width: h(150),
        flex: 1,
      }} />
      <Image
        style = {{
          height: h(36),
          width: h(172)
        }}
        source={require('img/feed_header.png')}
      />
      <View style={{width: h(150), flex: 1}} >
        <Image
          style={{alignSelf: 'flex-end', marginRight: h(28), height: h(32), width: h(44)}}
          source={require('img/feed_mail.png')}
        />
      </View>

    </View>

  );
});



@connect(app, user)
@observer
export default class Feed extends PureComponent {

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  render() {

    let store = FeedStore;

    let content = (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size='large' />
      </View>
    );

    if (!store.isLoading) {
      content = (
        <ScrollView>
          {store.elements.map(p => <Post key={p.key} post={p} />)}
        </ScrollView>
      );
    }

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
      <FeedHeader />
      {content}
    </View>
  </NavigationSetting>);
  }
};
