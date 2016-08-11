import React from 'react';
import {Animated} from 'react-native';
import PureComponent from './PureComponent';
import fontelloConfig from '../../fontello.json';
import {createIconSetFromFontello} from 'react-native-vector-icons';

var Icon = createIconSetFromFontello(fontelloConfig, 'hairfolio', 'hairfolio.ttf');

export default class WrappedIcon extends PureComponent {
  setNativeProps(props) {
    this.refs.icon.setNativeProps(props);
  }
  render() {
    return <Icon {...this.props} ref="icon" />;
  }
}

export const AnimatedIcon = Animated.createAnimatedComponent(WrappedIcon);
