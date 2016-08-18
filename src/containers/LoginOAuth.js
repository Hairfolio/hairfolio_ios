import React from 'react';
import {WebView} from 'react-native';
import PureComponent from '../components/PureComponent';
import NavigationSetting from '../navigation/NavigationSetting';

import {NAVBAR_HEIGHT} from '../constants';

export default class LoginOAuth extends PureComponent {
  state = {};

  i = 0;

  prepare({authorize, redirectUri, clientId, type, scope}, callback) {
    this.setState({
      authorize,
      redirectUri,
      clientId,
      callback: callback,
      scope,
      type,
      i: this.i++
    });
  }

  callback(err, token) {
    var callback = this.state.callback;
    if (!callback)
      return;
    this.setState({
      callback: null
    }, () => callback(err, token));
  }

  render() {
    return (<NavigationSetting
      leftAction={() => {
        this.callback('cancelled');
      }}
      leftIcon="back"
      ref="ns"
      style={{
        flex: 1,
        paddingTop: NAVBAR_HEIGHT
      }}
      title={this.state.type}
    >
      {this.state.callback ? <WebView
        key={this.state.i}
        onLoadStart={(e) => {
          var trigger = this.state.redirectUri + '#access_token=';
          var i = e.nativeEvent.url.indexOf(trigger);
          if (i > -1) {
            var token = e.nativeEvent.url.substr(trigger.length);

            var next = token.indexOf('&');
            next = next !== -1 ? token = token.substr(0, next) : token;

            return this.callback(null, token);
          }
        }}
        source={{
          uri: `${this.state.authorize}?client_id=${this.state.clientId}&redirect_uri=${this.state.redirectUri}&response_type=token&scope=${this.state.scope}`}}
        style={{flex: 1}}
      /> : null}
    </NavigationSetting>);
  }
};
