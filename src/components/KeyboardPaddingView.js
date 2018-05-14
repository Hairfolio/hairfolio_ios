import React from 'react';
import {KeyboardAvoidingView, Platform, View} from 'react-native';
import PureComponent from './PureComponent';

export default class KeyboardPaddingView extends PureComponent {
  // see https://github.com/facebook/react-native/issues/2852
  // + android:windowSoftInputMode in android manifest
  render() {
    if (Platform.OS !== 'ios')
      return <View {...this.props} />;

    return (<KeyboardAvoidingView
      behavior="padding"
      {...this.props}
    />);
  }
}
