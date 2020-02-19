'use strict';

import React, { PropTypes } from 'React';
import { Text, TouchableOpacity, View } from 'react-native';
import { FONTS, SCALE, COLORS } from '../../style';
import Icon from '../Icon';
import PureComponent from '../PureComponent';

export default class ProfileButton extends PureComponent {
  static propTypes = {
    color: PropTypes.string,
    disabled: PropTypes.bool,
    icon: PropTypes.string,
    label: PropTypes.string.isRequired,
    onPress: PropTypes.func
  };

  render() {
    return (<View style={{
      opacity: this.props.disabled ? 0.7 : 1
    }}>
      <TouchableOpacity
        disabled={this.props.disabled}
        onPress={this.props.onPress}
        style={{
          backgroundColor: this.props.color ? this.props.color : COLORS.TRANSPARENT,
          height: SCALE.h(60),
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          borderWidth: 1,
          borderColor: this.props.color ? this.props.color : COLORS.BLACK,
          paddingLeft: 5,
          paddingRight: 5
        }}
      >
        {this.props.icon && <Icon
          color={COLORS.BLACK}
          name={this.props.icon}
          size={SCALE.h(18)}
          style={{
            marginRight: SCALE.w(10)
          }}
        />}
        <Text style={{
          fontFamily: FONTS.HEAVY_OBLIQUE,
          fontSize: SCALE.h(26),
          color: COLORS.BLACK,
          textAlign: 'center'
        }}>{this.props.label}</Text>
      </TouchableOpacity>
    </View>);
  }
}
