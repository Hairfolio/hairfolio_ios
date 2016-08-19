import React from 'React';
import _ from 'lodash';
import {Platform, BackAndroid, StatusBar, InteractionManager} from 'react-native';
import {autobind} from 'core-decorators';
import connect from '../../lib/connect';

import Navigator from '../../navigation/Navigator';
import NavigationSetting from '../../navigation/NavigationSetting';

import NavigationBar from '../../components/AppBottomBar/Bar';

import PureComponent from '../../components/PureComponent';

import appEmitter from '../../appEmitter';

import {COLORS} from '../../style';

import {search, feed, createPost, favourites, profile} from '../../routes';

import {user} from '../../selectors/user';
import {environment} from '../../selectors/environment';

@connect(user, environment)
export default class AppStack extends PureComponent {
  static propTypes = {
    environment: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  componentWillMount() {
    this.listeners = [
      appEmitter.addListener('logout', () => this.onLogout())
    ];
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

  @autobind
  onBackAndroid() {
    /*
    var scene = this._nav.getCurrentRoutes()[this._nav.state.presentedIndex].scene();
    scene = scene.getWrappedInstance ? scene.getWrappedInstance() : scene;

    if (scene.backAndroidDisabled && scene.backAndroidDisabled())
      return true;

    // on est au top du stack
    if (!this._nav.state.presentedIndex)
      return false;
    else
      this._nav.jumpBack();

    if (scene.onBackAndroidExecuted)
      scene.onBackAndroidExecuted();

    return true;
    */
  }

  onLogout() {
    InteractionManager.runAfterInteractions(() => this._nav.jumpTo(search));
  }

  jumpTo(route) {
    this._nav.jumpTo(route);
  }

  render() {
    var profilePic;

    if (this.props.user.get('avatar_cloudinary_id'))
      profilePic = `http://res.cloudinary.com/${this.props.environment.get('cloud_name')}/image/upload/${this.props.user.get('avatar_cloudinary_id')}.jpg`;
    else if (this.props.user.get('facebook_id'))
      profilePic = `http://res.cloudinary.com/${this.props.environment.get('cloud_name')}/image/facebook/${this.props.user.get('facebook_id')}.jpg`;
    else if (this.props.user.get('insta_id'))
      profilePic = `http://res.cloudinary.com/${this.props.environment.get('cloud_name')}/image/instagram/${this.props.user.get('insta_id')}.jpg`;

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
          initialRoute={search}
          initialRouteStack={[
            search, feed, createPost, favourites, profile
          ]}
          navigationBar={<NavigationBar profilePic={profilePic} />}
          ref={(navigator) => this._nav = navigator && navigator.navigator()}
        />
      </NavigationSetting>
    );
  }
}
