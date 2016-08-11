import React from 'react';
import {autobind} from 'core-decorators';
import _ from 'lodash';
import PureComponent from './components/PureComponent';
import {Provider} from 'react-redux';
import {View, Image, TextInput, NativeModules, Animated, Platform, LayoutAnimation} from 'react-native';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';

import Navigator from './navigation/Navigator';

import messages from './intl/messages';
import store from './store';
import storecache from './storecache';
import storecacheConfig from './storecache.config';
import services from './services';

import Intro from './components/Intro';

import {hello, loginStack, forgottenPasswordStack} from './routes';

import {appActions} from './actions/app';

NativeModules.UIManager.setLayoutAnimationEnabledExperimental &&
  NativeModules.UIManager.setLayoutAnimationEnabledExperimental(true);

export default class Root extends PureComponent {

  static propTypes = {
    lng: React.PropTypes.string.isRequired
  };

  static childContextTypes = {
    intl: React.PropTypes.object.isRequired,
    scrolling:  React.PropTypes.func.isRequired,
    services:  React.PropTypes.object.isRequired
  };

  state = {};

  getChildContext() {
    return {
      intl: messages[this.props.lng] || messages[_.keys(messages)[0]],
      scrolling: (b) => {
        this.keyboardScrollViewScrolling = b;
      },
      services
    };
  }

  appOpacity = new Animated.Value(Platform.OS === 'ios' ? 1 : 0);

  @autobind
  onReady() {
    NativeModules.StoreManager.get(initialState => {
      storecache(store, initialState, storecacheConfig, appActions.reviveState);

      // prepare services
      _.each(services, service => service.setStore(store));
      _.each(services, service => service.ready());

      // android need workaround because of https://github.com/facebook/react-native/issues/7367
      if (Platform.OS === 'ios')
        LayoutAnimation.easeInEaseOut();
      this.setState({ready: true});
    });
  }

  render() {
    return (
      <View
        onStartShouldSetResponderCapture={(e, gestureState) => {
          var target = e.nativeEvent.target;
          setTimeout(() => {
            if (this.keyboardScrollViewScrolling)
              return;
            const focusField = TextInput.State.currentlyFocusedField();
            if (focusField != null && target !== focusField)
              dismissKeyboard();
          }, 150);
        }}
        style={{flex: 1}}
      >
        {!this.state.ready ?
          <Intro onReady={this.onReady} />
        :
          <Animated.View
            onLayout={() => setTimeout(() => requestAnimationFrame(() => {
              if (Platform.OS === 'ios')
                return;

              Animated.spring(this.appOpacity, {
                toValue: 1,
                duration: 300
              }).start();
            }), 300)}
            style={{
              opacity: this.appOpacity,
              flex: 1
            }}
          >
            <Image
              source={require('./images/onboarding.jpg')}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
              }}
            />
            <Provider store={store}>
              <Navigator
                backgroundStyle={{flex: 1}}
                initialRoute={hello}
                initialRouteStack={[
                  hello,
                  loginStack,
                  forgottenPasswordStack
                ]}
              />
            </Provider>
          </Animated.View>
        }
      </View>
    );
  }
};
