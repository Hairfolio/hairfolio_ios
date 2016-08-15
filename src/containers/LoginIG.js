import React from 'react';
import {WebView} from 'react-native';
import PureComponent from '../components/PureComponent';
import NavigationSetting from '../navigation/NavigationSetting';

import {NAVBAR_HEIGHT} from '../constants';

export default class LoginIG extends PureComponent {

  state = {};

  i = 0;

  prepare(callback) {
    this.setState({
      callback: callback,
      i: this.i++
    });
    this.refs.ns.forceUpdateContent();
  }

  callback(err, token) {
    var callback = this.state.callback;
    this.setState({
      callback: null
    }, () => callback(err, token));
  }

  redirect_uri = 'http://hairfolio.com/login-ig';

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
      title="Instagram"
    >
      {this.state.callback ? <WebView
        key={this.state.i}
        onLoadStart={(e) => {
          var trigger = this.redirect_uri + '#access_token=';
          var i = e.nativeEvent.url.indexOf(trigger);
          if (i > -1)
            return this.callback(null, e.nativeEvent.url.substr(trigger.length));
        }}
        source={{uri: `https://api.instagram.com/oauth/authorize/?client_id=d1138d5c6e0a4dfd95974e9506be921b&redirect_uri=${this.redirect_uri}&response_type=token`}}
        style={{flex: 1}}
      /> : null}
    </NavigationSetting>);
  }
};
