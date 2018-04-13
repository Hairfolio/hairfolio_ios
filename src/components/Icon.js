import React, { Component } from 'react';
import {Animated, Image} from 'react-native';
import PureComponent from './PureComponent';
import fontelloConfig from '../../fontello.json';
import {createIconSetFromFontello} from 'react-native-vector-icons';

var Icon = createIconSetFromFontello(fontelloConfig, 'hairfolio', 'hairfolio.ttf');

export default class WrappedIcon extends React.Component {
  setNativeProps(props) {
    this.refs.icon.setNativeProps(props);
  }
  render() {

    if (this.props.name == 'white_x') {
      return (
        <Image
          style={{height: 13, width: 13}}
          source={require('img/white_x.png')}
        />
      );
    } else {
      return <Icon {...this.props} ref="icon" />;
    }
  }
}

export const AnimatedIcon = Animated.createAnimatedComponent(WrappedIcon);
