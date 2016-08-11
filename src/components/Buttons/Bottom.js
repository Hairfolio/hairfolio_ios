'use strict';

import React, {PropTypes} from 'React';
import {
  Text,
  TouchableOpacity
} from 'react-native';
import {COLORS, FONTS} from '../../style';
import PureComponent from '../PureComponent';

export default class FormButton extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    label: PropTypes.string.isRequired,
    onPress: PropTypes.func
  };

  render() {
    return (<TouchableOpacity
      disabled={this.props.disabled}
      onPress={this.props.onPress}
      style={{
        backgroundColor: COLORS.PRIMARY.RED,
        padding: 19,
        alignItems: 'center'
      }}
    >
      <Text style={{
        fontFamily: FONTS.REGULAR,
        fontSize: 16,
        color: COLORS.PRIMARY.WHITE
      }}>{this.props.label.toUpperCase()}</Text>
    </TouchableOpacity>);
  }
}
