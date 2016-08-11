'use strict';

import React, {PropTypes} from 'React';
import {
  Text,
  TouchableOpacity
} from 'react-native';
import {COLORS, FONTS, SCALE} from '../../style';
import PureComponent from '../PureComponent';
import Icon from '../Icon';

export default class SimpleButton extends PureComponent {
  static propTypes = {
    color: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    icon: PropTypes.string,
    label: PropTypes.string.isRequired,
    onPress: PropTypes.func
  };

  render() {
    return (<TouchableOpacity
      disabled={this.props.disabled}
      onPress={this.props.onPress}
      style={{
        backgroundColor: this.props.color,
        height: SCALE.h(17 * 2 + 48),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
      }}
    >
      {this.props.icon && <Icon
        color={COLORS.WHITE}
        name={this.props.icon}
        size={SCALE.h(48)}
        style={{
          marginRight: SCALE.w(20)
        }}
      />}
      <Text style={{
        fontFamily: FONTS.MEDIUM,
        fontSize: SCALE.h(30),
        color: COLORS.WHITE
      }}>{this.props.label}</Text>
    </TouchableOpacity>);
  }
}
