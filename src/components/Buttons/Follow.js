'use strict';

import React, {PropTypes} from 'React';
import {
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {COLORS, FONTS, SCALE} from '../../style';
import PureComponent from '../PureComponent';
import Icon from '../Icon';

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
          backgroundColor: this.props.color ? this.props.color : 'transparent',
          height: SCALE.h(60),
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          borderWidth: 1,
          borderColor: this.props.color ? this.props.color : 'black',
          paddingLeft: 5,
          paddingRight: 5
        }}
      >
        {this.props.icon && <Icon
          color={'black'}
          name={this.props.icon}
          size={SCALE.h(18)}
          style={{
            marginRight: SCALE.w(10)
          }}
        />}
        <Text style={{
          fontFamily: FONTS.HEAVY_OBLIQUE,
          fontSize: SCALE.h(26),
          color: 'black',
          textAlign: 'center'
        }}>{this.props.label}</Text>
      </TouchableOpacity>
    </View>);
  }
}
