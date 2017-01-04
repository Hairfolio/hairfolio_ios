import React from 'react';
import PureComponent from '../components/PureComponent';
import {View, TouchableOpacity, Text} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import {BOTTOMBAR_HEIGHT, STATUSBAR_HEIGHT} from '../constants';

import WhiteHeader from 'components/WhiteHeader'
import LinkTabBar from 'components/post/LinkTabBar.js'
import ScrollableTabView from 'react-native-scrollable-tab-view'

import ShareFollowers from 'components/ShareFollowers'
import ShareMessage from 'components/ShareMessage'
import AddBlackBookStore from 'stores/AddBlackBookStore'
import ServiceBackend from 'backend/ServiceBackend.js'
import LoadingScreen from 'components/LoadingScreen.js'
import CreatePostStore from 'stores/CreatePostStore.js'

import ShareStore from 'stores/ShareStore.js'
import {
  h
} from 'hairfolio/src/helpers.js';

@connect(app)
export default class Share extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  render() {
    return (
      <NavigationSetting
        style={{
          flex: 1,
          backgroundColor: COLORS.WHITE
        }}
        onWillFocus={
          () => {
            AddBlackBookStore.load();
            // ActivityYouStore.load();
            // ActivityFollowingStore.load();
          }
        }
      >
        <View style={{
          flex: 1
        }}>
        <WhiteHeader
          onLeft={
            () => {
              ShareStore.myBack();
            }
          }
          title='Share To'
          onRenderRight={
            () => <TouchableOpacity
              style = {{
                flexDirection: 'row',
                alignItems: 'center'
              }}
              onPress={() => {
               ServiceBackend.postPost();
                  }}
            >
              <Text
                style={{
                  flex: 1,
                  fontFamily: FONTS.Regular,
                  fontSize: h(34),
                  color: '#393939',
                  textAlign: 'right'
                }}
              >
                Post
              </Text>
            </TouchableOpacity>
          }
        />

        <ScrollableTabView
          renderTabBar={() => <LinkTabBar />}
          initialPage={0}
          refs={e => ShareStore.tabView = e}
        >
          <ShareFollowers tabLabel="Followers" />
          <ShareMessage tabLabel='Send Direct' />
        </ScrollableTabView>
        <LoadingScreen style={{opacity: 0.6}} store={CreatePostStore} />
      </View>
    </NavigationSetting>
    );
  }
};
