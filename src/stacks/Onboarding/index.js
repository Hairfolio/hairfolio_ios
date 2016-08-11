import React from 'React';
import {Platform, BackAndroid} from 'react-native';
import {autobind} from 'core-decorators';

import Navigator from '../../navigation/Navigator';
import NavigationSetting from '../../navigation/NavigationSetting';

import NavigationBar from '../../components/OnboardingNavigationBar/Bar';

import PureComponent from '../../components/PureComponent';

import {COLORS} from '../../style';
import {register, login} from '../../routes';

export default class OnboardingStack extends PureComponent {
  static propTypes = {};

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  @autobind
  onWillFocus() {
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
          backgroundColor: COLORS.PRIMARY.BLUE
        }}
      >
        <Navigator
          initialRoute={register}
          initialRouteStack={[
            register,
            login
          ]}
          navigationBar={<NavigationBar />}
          ref={(navigator) => this._nav = navigator && navigator.navigator()}
        />
      </NavigationSetting>
    );
  }
}
