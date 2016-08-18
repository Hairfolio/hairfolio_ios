import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import PureComponent from '../components/PureComponent';

export default class CustomTouchableOpacity extends PureComponent {
  static propTypes = {
    children: React.PropTypes.node,
    disabled: React.PropTypes.bool
  };

  render() {
    return (
      <TouchableOpacity
        {...this.props}
      >
        <View style={{
          opacity: this.props.disabled ? 0.7 : 1
        }}>
          {this.props.children}
        </View>
      </TouchableOpacity>
    );
  }
}
