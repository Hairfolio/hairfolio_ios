import React from 'react';
import { WebView } from 'react-native';
import whiteBack from '../../resources/img/nav_white_back.png';
import PureComponent from '../components/PureComponent';
import { LOADING_ERROR, READY } from '../constants';
import OAuthStore from '../mobx/stores/OAuthStore';
import { showLog } from '../helpers';

export default class LoginOAuth extends PureComponent {
  state = {};

  static navigatorButtons = {
    leftButtons: [
      {
        id: 'back',
        icon: whiteBack,
      }
    ]
  };

  i = 0;

  _callback(err, token) {

    showLog("loginoauth callback ==>"+token)
    
    if (token) {
      OAuthStore.updateOatuhStatus(READY);
      OAuthStore.setOatuhToken(token);
    } else {
      showLog(err);
      OAuthStore.updateOatuhStatus(LOADING_ERROR);
    }
    this.props.navigator.pop({
      animated: true,
      animationStyle: 'fade',
    });
  }

  render() {
    this.i = this.i + 1;
    return (
      <WebView
        thirdPartyCookiesEnabled={false}
        key={this.i}
        onLoadStart={(e) => {
          var trigger = OAuthStore.config.redirectUri + '#access_token=';
          var i = e.nativeEvent.url.indexOf(trigger);
          if (i > -1) {
            var token = e.nativeEvent.url.substr(trigger.length);

            var next = token.indexOf('&');
            next = next !== -1 ? token = token.substr(0, next) : token;

            return this._callback(null, token);
          }
        }}
        source={{
          uri: `${OAuthStore.config.authorize}?client_id=${OAuthStore.config.clientId}&redirect_uri=${OAuthStore.config.redirectUri}&response_type=token&scope=${OAuthStore.config.scope}`
        }}
        style={{ flex: 1 }}
      />
    );
  }
};
