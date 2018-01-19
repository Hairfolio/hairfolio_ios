import React from 'React';
import _ from 'lodash';
import {Platform, BackAndroid, StatusBar, InteractionManager} from 'react-native';
import {autobind} from 'core-decorators';

import UserStore from '../../mobx/stores/UserStore';
import EnvironmentStore from '../../mobx/stores/EnvironmentStore';
import Navigator from '../../navigation/Navigator';
import NavigationSetting from '../../navigation/NavigationSetting';

import NavigationBar from '../../components/AppBottomBar/Bar';

import PureComponent from '../../components/PureComponent';

import appEmitter from '../../appEmitter';
import utils from '../../utils';

import {COLORS} from '../../style';

import {search, feed, createPost, favourites, profile, profileExternal, createPostStack } from '../../routes';

import CreatePostStore from '../../mobx/stores/CreatePostStore';

export default class AppStack extends PureComponent {

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    EnvironmentStore.loadEnv();
  }

  componentWillMount() {
    this.listeners = [
      appEmitter.addListener('logout', () => this.onLogout())
    ];
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    _.each(this.listeners, l => l.remove());
  }

  @autobind
  onWillFocus() {
    StatusBar.setHidden(false, 'fade');
    StatusBar.setBarStyle('default', true);

    if (Platform.OS !== 'ios')
      BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
  }

  @autobind
  onWillBlur() {
    if (Platform.OS !== 'ios')
      BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
  }

  goToProfile(id) {
    if (UserStore.user.id === id) {
      return this._nav.jumpTo(profile);
    }

    profileExternal.scene().setUserId(id);
    this._nav.jumpTo(profileExternal);
  }

  goToFeed() {
    this._nav.jumpTo(feed);
  }

  onLogout() {
    InteractionManager.runAfterInteractions(() => this._nav.jumpTo(search));
  }

  jumpTo(route) {
    this._nav.jumpTo(route);
  }

  render() {
    var profilePic = utils.getUserProfilePicURI(UserStore.user, EnvironmentStore.environment);

    return (
      <NavigationSetting
        forceUpdateEvents={['login']}
        onWillBlur={this.onWillBlur}
        onWillFocus={this.onWillFocus}
        style={{
          flex: 1,
          backgroundColor: COLORS.WHITE
        }}
      >
        <Navigator
          initialRoute={feed}
          initialRouteStack={[
            search, feed, createPost, favourites, profile, profileExternal,
          ]}
          navigationBar={<NavigationBar profilePic={profilePic} />}
          ref={(navigator) => this._nav = navigator && navigator.navigator()}
        />
      </NavigationSetting>
    );
  }
}
