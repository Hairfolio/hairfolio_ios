'use strict';

import React, {PropTypes} from 'React';
import {
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {COLORS, FONTS, SCALE} from '../../style';
import PureComponent from '../PureComponent';

export default class ProfileButton extends PureComponent {
  static propTypes = {
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
          backgroundColor: 'transparent',
          height: SCALE.h(60),
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: COLORS.WHITE
        }}
      >
        <Text style={{
          fontFamily: FONTS.HEAVY_OBLIQUE,
          fontSize: SCALE.h(26),
          color: COLORS.WHITE,
          textAlign: 'center',
          marginLeft: 5,
          marginRight: 5
        }}>{this.props.label}</Text>
      </TouchableOpacity>
    </View>);
  }
}
