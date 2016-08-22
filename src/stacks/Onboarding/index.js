import React from 'React';
import _ from 'lodash';
import {Platform, BackAndroid, View, StatusBar, Image, InteractionManager} from 'react-native';
import {autobind} from 'core-decorators';

import Navigator from '../../navigation/Navigator';
import NavigationSetting from '../../navigation/NavigationSetting';

import NavigationBar from '../../components/OnboardingNavigationBar/Bar';

import PureComponent from '../../components/PureComponent';
import Icon from '../../components/Icon';
import KeyboardScrollView from '../../components/KeyboardScrollView';

import appEmitter from '../../appEmitter';

import store from '../../store';
import utils from '../../utils';

import {COLORS, SCALE} from '../../style';
import {register, login, register2, loginEmail} from '../../routes';
import {Dims} from '../../constants';

export default class OnboardingStack extends PureComponent {
  static propTypes = {};

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  static childContextTypes = {
    setBannerError: React.PropTypes.func.isRequired
  };

  getChildContext() {
    return {
      setBannerError: (err) => this._navBar.error(err)
    };
  }

  componentWillMount() {
    this.initialRoute = utils.isReady(store.getState().user.state) ? login : register;

    this.listeners = [
      appEmitter.addListener('login', () => this.onLogin())
    ];
  }

  componentWillUnmount() {
    _.each(this.listeners, l => l.remove());
  }

  @autobind
  onWillFocus() {
    StatusBar.setHidden(true, 'fade');

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

  onLogin() {
    requestAnimationFrame(() => InteractionManager.runAfterInteractions(() => this._nav.jumpTo(login)));
  }

  jumpTo(route) {
    this._nav.jumpTo(route);
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
        <Image
          resizeMode="cover"
          source={require('../../images/onboarding.jpg')}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: Dims.deviceHeight,
            width: Dims.deviceWidth
          }}
        >
          <KeyboardScrollView
            scrollEnabled={false}
            scrollToTopOnBlur
            showsVerticalScrollIndicator={false}
            space={Platform.OS === 'ios' ? 60 : 90}
            style={{flex: 1}}
          >
            <View style={{height: Dims.deviceHeight}}>
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 9 / 24 * Dims.deviceHeight,
                justifyContent: 'flex-end',
                alignItems: 'center'
              }}>
                <Icon
                  color={COLORS.WHITE}
                  name="logo"
                  size={SCALE.h(172)}
                />
              </View>
              <Navigator
                backgroundStyle={{
                  paddingTop: 9 / 24 * Dims.deviceHeight + SCALE.h(80),
                  paddingLeft: SCALE.w(69),
                  paddingRight: SCALE.w(69),
                  paddingBottom: SCALE.h(42)
                }}
                initialRoute={this.initialRoute}
                initialRouteStack={[
                  register,
                  register2,
                  login,
                  loginEmail
                ]}
                navigationBar={<NavigationBar ref={(navBar) => this._navBar = navBar} />}
                ref={(navigator) => this._nav = navigator && navigator.navigator()}
              />
            </View>
          </KeyboardScrollView>
        </Image>
      </NavigationSetting>
    );
  }
}
