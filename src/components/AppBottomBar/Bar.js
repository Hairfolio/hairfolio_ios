import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import PureComponent from '../PureComponent';
import {BOTTOMBAR_HEIGHT} from '../../constants';
import {COLORS, FONTS, SCALE} from '../../style';

import Icon from '../Icon';

import {search, feed, createPost, favourites, profile} from '../../routes';

export default class LoginNavigationbar extends PureComponent {

  static propTypes = {
    profilePic: React.PropTypes.string.isRequired
  };

  static defaultProps = {
    profilePic: 'http://www.disneyclips.com/imagesnewb/images/clipdonhead.gif'
  };

  updateProgress(progress, fromIndex, toIndex) {
  }

  handleWillFocus(route) {}

  renderItem(route, opts = {}) {
    opts.borders = opts.borders || {};
    opts.height = opts.height || BOTTOMBAR_HEIGHT;

    return (<View style={{
      flex: 1,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderLeftWidth: opts.borders.left ? StyleSheet.hairlineWidth : 0,
      borderRightWidth: opts.borders.right ? StyleSheet.hairlineWidth : 0,
      borderColor: COLORS.BOTTOMBAR_BORDER,
      height: opts.height,
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <TouchableOpacity
        onPress={() => {}}
      >
        {!opts.picture ?
          <Icon
            color={COLORS.BOTTOMBAR_SELECTED}
            name={route.icon}
            size={SCALE.h(54)}
          />
        :
          <Image
            resizeMode="contain"
            source={{uri: opts.picture}}
            style={{
              height: SCALE.h(54),
              width: SCALE.h(54),
              borderRadius: SCALE.h(54) / 2
            }}
          />
        }
      </TouchableOpacity>
    </View>);
  }

  render() {
    return (<View
      style={{
        position: 'absolute',
        height: SCALE.h(120),
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
        alignItems: 'flex-end',
        flexDirection: 'row'
      }}
    >
      {this.renderItem(feed)}
      {this.renderItem(search, {borders: {left: true}})}
      {this.renderItem(createPost, {borders: {left: true, right: true}, height: SCALE.h(120)})}
      {this.renderItem(favourites, {borders: {right: true}})}
      {this.renderItem(profile, {picture: this.props.profilePic})}
    </View>);
  }
}
