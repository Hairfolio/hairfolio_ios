import PureComponent from '../components/PureComponent';
import NavigationSetting from '../navigation/NavigationSetting';
import {BOTTOMBAR_HEIGHT, STATUSBAR_HEIGHT} from '../constants';

import SimpleButton from '../components/Buttons/Simple';

import FeedStore from 'stores/FeedStore.js'
import MessagesStore from 'stores/MessagesStore.js'

import {profile, profileExternal, appStack} from '../routes';

import * as routes from '../routes'

import Post from 'components/feed/Post.js'
import WhiteHeader from 'components/WhiteHeader.js'

import CreatePostStore from 'stores/CreatePostStore.js'

import {
  _, // lodash
  v4,
  observer, // mobx
  h,
  FONTS,
  COLORS,
  autobind,
  ListView,
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
} from 'Hairfolio/src/helpers.js';


import NewMessageStore from 'stores/NewMessageStore.js'

const NewMessageNumber = observer(() => {

  const store = NewMessageStore;

  if (store.newMessageNumber == 0) return null;

  return (
    <View
      style = {{
        backgroundColor: '#E62727',
        width: h(26),
        height: h(26),
        borderRadius: h(13),
        position: 'absolute',
        top: 0,
        left: -h(7),
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Text
        style = {{
          fontSize: h(16),
          fontFamily: FONTS.HEAVY,
          color: 'white',
          backgroundColor: 'transparent'
        }}

      >{store.newMessageNumber}</Text>
    </View>
  );
});

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
          height: h(25),
          width: h(231)
        }}
        source={require('img/feed_header.png')}
      />
      <TouchableOpacity
        onPress={
          () => {
            MessagesStore.myBack = () => {
              window.navigators[0].jumpTo(routes.appStack)
            }

            window.navigators[0].jumpTo(routes.messagesRoute)
          }
        }
        style={{width: h(150), flex: 1}} >
        <View
          style={{alignSelf: 'flex-end', marginRight: h(28), height: h(32), width: h(44)}}
        >
          <Image
            style={{height: h(32), width: h(44)}}
            source={require('img/feed_mail.png')}
          />
          <NewMessageNumber />

        </View>
      </TouchableOpacity>

    </View>
  );
});


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

    if (store.isLoading) {
      content = (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size='large' />
        </View>
      );
    } else  if (store.elements.length == 0) {
      content =  (
        <View style={{flex: 1}}>
          <Text
            style= {{
              paddingTop: h(38),
              fontSize: h(34),
              textAlign: 'center',
              fontFamily: FONTS.BOOK_OBLIQUE
            }}
          >
            There are no posts in the feed yet.
          </Text>
        </View>
      );
    } else {
      content = (
        <ListView
          dataSource={store.dataSource}
          renderRow={(p, i) => <Post key={p.key} post={p} />}
          renderFooter={
            () => {
              if (store.nextPage != null) {
                return (
                  <View style={{flex: 1, paddingVertical: 20, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator size='large' />
                  </View>
                )
              } else {
                return <View />;
              }
            }
          }
          onEndReached={() => {
            store.loadNextPage();
          }}
        />
      );
    }

    return (<NavigationSetting
      onFocus={() => {
        NewMessageStore.load();
        // initial loading

        if (!FeedStore.hasLoaded) {
          FeedStore.hasLoaded = true;
          FeedStore.load();
        }
      }}
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
