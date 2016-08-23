'use strict';

import React, {PropTypes} from 'React';
import {
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {COLORS, FONTS, SCALE} from '../../style';
import PureComponent from '../PureComponent';

export default class DeleteButton extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
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
          backgroundColor: COLORS.WHITE,
          height: SCALE.h(86),
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text style={{
          fontFamily: FONTS.MEDIUM,
          fontSize: SCALE.h(28),
          color: COLORS.RED_DELETE,
          textAlign: 'center'
        }}>{this.props.label}</Text>
      </TouchableOpacity>
    </View>);
  }
}
