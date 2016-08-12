import React from 'React';
import {Platform, BackAndroid, StatusBar} from 'react-native';
import {autobind} from 'core-decorators';

import Navigator from '../../navigation/Navigator';
import NavigationSetting from '../../navigation/NavigationSetting';

import NavigationBar from '../../components/AppBottomBar/Bar';

import PureComponent from '../../components/PureComponent';

import {search, feed, createPost, favourites, profile} from '../../routes';

export default class AppStack extends PureComponent {
  static propTypes = {};

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

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

  render() {
    return (
      <NavigationSetting
        onWillBlur={this.onWillBlur}
        onWillFocus={this.onWillFocus}
        style={{
          flex: 1,
          backgroundColor: 'transparent'
        }}
      >
        <Navigator
          initialRoute={search}
          initialRouteStack={[
            search, feed, createPost, favourites, profile
          ]}
          navigationBar={<NavigationBar />}
          ref={(navigator) => this._nav = navigator && navigator.navigator()}
        />
      </NavigationSetting>
    );
  }
}
