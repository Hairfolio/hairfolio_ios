import React from 'react';
import PureComponent from '../components/PureComponent';
import {View, Text,StatusBar} from 'react-native';
import {COLORS, FONTS, SCALE} from '../style';
import FavoriteStore from '../mobx/stores/FavoriteStore';
import { observer } from 'mobx-react';
import {STATUSBAR_HEIGHT} from '../constants';
import WhiteHeader from '../components/WhiteHeader'
import LinkTabBar from '../components/post/LinkTabBar';
import FavouritesList from '../components/favourites/FavouritesList';
import FavouritesGrid from '../components/favourites/FavouritesGrid';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ActivityYou from '../components/favourites/ActivityYou';
import ActivityFollowing from '../components/favourites/ActivityFollowing';
import ActivityYouStore from '../mobx/stores/ActivityYouStore';
import ActivityFollowingStore from '../mobx/stores/ActivityFollowingStore';
import NavigatorStyles from '../common/NavigatorStyles';

@observer
export default class Favourites extends PureComponent {
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    switch(event.id) {
      case 'willAppear':
      StatusBar.setBarStyle('dark-content');
        this.props.navigator.toggleTabs({
          to: 'shown',
        });
        ActivityYouStore.load();
        ActivityFollowingStore.load();
        FavoriteStore.load();
        break;
      case 'bottomTabSelected':
      this.props.navigator.resetTo({
        screen: 'hairfolio.Favourites',
        animationType: 'fade',
        navigatorStyle: NavigatorStyles.tab
      });  
      
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: COLORS.WHITE
      }}>
      <WhiteHeader title='Activity' />
      <ScrollableTabView
        renderTabBar={() => <LinkTabBar />}
        initialPage={0}
      >
        <FavouritesGrid tabLabel="Favorites" navigator={this.props.navigator} from={'from_star'}/>
        <ActivityYou tabLabel='You' navigator={this.props.navigator} from={'from_star'}/>
        <ActivityFollowing tabLabel='Following' navigator={this.props.navigator} from={'from_star'}/>
      </ScrollableTabView>
    </View>
    );
  }
};
