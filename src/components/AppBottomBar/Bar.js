import React from 'react';
import {View} from 'react-native';
import PureComponent from '../PureComponent';
import {BOTTOMBAR_HEIGHT} from '../../constants';
import {COLORS, FONTS, SCALE} from '../../style';

export default class LoginNavigationbar extends PureComponent {

  updateProgress(progress, fromIndex, toIndex) {
  }

  handleWillFocus(route) {}

  render() {
    return (<View
      style={{
        position: 'absolute',
        height: BOTTOMBAR_HEIGHT,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.WHITE,
        borderTopWidth: 1
      }} />
    );
  }
}
