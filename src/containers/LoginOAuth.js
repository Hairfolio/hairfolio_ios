import React from 'react';
import {WebView} from 'react-native';
import PureComponent from '../components/PureComponent';
import NavigationSetting from '../navigation/NavigationSetting';

import {NAVBAR_HEIGHT} from '../constants';

export default class LoginOAuth extends PureComponent {
  state = {};

  i = 0;

  prepare({authorize, redirectUri, clientId, type}, callback) {
    this.setState({
      authorize,
      redirectUri,
      clientId,
      callback: callback,
      type,
      i: this.i++
    });
  }

  callback(err, token) {
    var callback = this.state.callback;
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
          if (i > -1)
            return this.callback(null, e.nativeEvent.url.substr(trigger.length));
        }}
        source={{
          uri: `${this.state.authorize}?client_id=${this.state.clientId}&redirect_uri=${this.state.redirectUri}&response_type=token`}}
        style={{flex: 1}}
      /> : null}
    </NavigationSetting>);
  }
};
