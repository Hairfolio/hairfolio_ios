import React from 'react';
import {View} from 'react-native';
import PureComponent from './PureComponent';

// no animation here !

export default class Intro extends PureComponent {

  static propTypes = {
    onReady: React.PropTypes.func
  };

  componentDidMount() {
    this.props.onReady();
  }

  render() {
    return <View />;
  }
};
