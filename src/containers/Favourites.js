import React from 'react';
import PureComponent from '../components/PureComponent';
import {View, Text} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import {BOTTOMBAR_HEIGHT, STATUSBAR_HEIGHT} from '../constants';

import WhiteHeader from 'components/WhiteHeader'


import LinkTabBar from 'components/post/LinkTabBar.js'

import FavouritesList from 'components/favourites/FavouritesList.js'
import FavouritesGrid from 'components/favourites/FavouritesGrid.js'
import ScrollableTabView from 'react-native-scrollable-tab-view'

import ActivityYou from 'components/favourites/ActivityYou.js'
import ActivityFollowing from 'components/favourites/ActivityFollowing.js'


import ActivityYouStore from 'stores/ActivityYouStore'
import ActivityFollowingStore from 'stores/ActivityFollowingStore'


@connect(app)
export default class Favourites extends PureComponent {
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
          backgroundColor: COLORS.WHITE,
          paddingBottom: BOTTOMBAR_HEIGHT
        }}
        onWillFocus={
          () => {
            ActivityYouStore.load();
            ActivityFollowingStore.load();
          }
        }
      >
        <View style={{
          flex: 1
        }}>
        <WhiteHeader title='Activity' />

        <ScrollableTabView
          renderTabBar={() => <LinkTabBar />}
          initialPage={0}
        >
          <FavouritesGrid tabLabel="Favorites" />
          <ActivityYou tabLabel='You' />
          <ActivityFollowing tabLabel='Following' />
        </ScrollableTabView>
      </View>
    </NavigationSetting>
    );
  }
};
