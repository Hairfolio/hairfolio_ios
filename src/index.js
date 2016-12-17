import React from 'react';
import {autobind} from 'core-decorators';
import _ from 'lodash';
import PureComponent from './components/PureComponent';
import {Provider} from 'react-redux';
import {View, TextInput, NativeModules, Animated, StatusBar} from 'react-native';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';

import Navigator from './navigation/Navigator';

import messages from './intl/messages';
import store from './store';
import storecache from './storecache';
import storecacheConfig from './storecache.config';
import services from './services';

import utils from './utils';

import Intro from './components/Intro';

import {getHairfolios} from 'backend/HairfolioBackend';

import {hello, comments, starGivers, oauthStack, loginStack, forgottenPasswordStack, signupConsumerStack, signupStylistStack, signupSalonStack, signupBrandStack, appStack, editCustomerStack, createPostStack, postDetails, share, addBlackBook,
  searchDetails, tagPosts, hairfolioPosts, messagesRoute, writeMessageRoute, messageDetailsRoute, blackBook, contactDetails
} from './routes';


import {appActions} from './actions/app';
import UserStore from 'stores/UserStore.js';
import FeedStore from 'stores/FeedStore.js';
import FavoriteStore from 'stores/FavoriteStore.js';

NativeModules.UIManager.setLayoutAnimationEnabledExperimental &&
  NativeModules.UIManager.setLayoutAnimationEnabledExperimental(true);

let PhotoAlbum = NativeModules.PhotoAlbum;

global.ENABLE_RENDER_DEBUG = false;

export default class Root extends PureComponent {

  static propTypes = {
    lng: React.PropTypes.string.isRequired
  };

  static childContextTypes = {
    intl: React.PropTypes.object.isRequired,
    scrolling: React.PropTypes.func.isRequired,
    services: React.PropTypes.object.isRequired
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

  componentDidMount() {
    StatusBar.setHidden(true);
  }

  appOpacity = new Animated.Value(/* Platform.OS === 'ios' ? 1 : */0);

  @autobind
  onReady() {
    NativeModules.StoreManager.get(initialState => {
      storecache(store, initialState, storecacheConfig, appActions.reviveState);

      // prepare services
      _.each(services, service => service.setStore(store));
      _.each(services, service => service.ready());
      this.initialRoute = loginStack;

      if (utils.isReady(store.getState().user.state)) {
        this.initialRoute = appStack;
      }

      // this.initialRoute = hello;

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
              {return;}
            const focusField = TextInput.State.currentlyFocusedField();
            if (focusField != null && target !== focusField)
              {dismissKeyboard();}
          }, 150);
        }}
        style={{flex: 1, position: 'relative'}}
      >
        {!this.state.introDone &&
          <Intro onReady={this.onReady} />
        }
        {this.state.ready && <Animated.View
            onLayout={() => setTimeout(() => requestAnimationFrame(() => {
              Animated.spring(this.appOpacity, {
                toValue: 1,
                duration: 300
              }).start(() => this.setState({introDone: true}));
            }), 300)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: this.appOpacity,
              backgroundColor: 'white'
            }}
          >
            <Provider store={store}>
              <Navigator
                ref='nav'
                backgroundStyle={{flex: 1}}
                initialRoute={this.initialRoute}
                initialRouteStack={[
                  postDetails,
                  hello,
                  loginStack,
                  forgottenPasswordStack,
                  signupConsumerStack,
                  signupBrandStack,
                  signupSalonStack,
                  signupStylistStack,
                  appStack,
                  oauthStack,
                  editCustomerStack,
                  createPostStack,
                  starGivers,
                  comments,
                  searchDetails,
                  tagPosts,
                  hairfolioPosts,
                  messagesRoute,
                  writeMessageRoute,
                  messageDetailsRoute,
                  blackBook,
                  contactDetails,
                  share,
                  addBlackBook
                ]}
              />
            </Provider>
          </Animated.View>
        }
      </View>
    );
  }
};
