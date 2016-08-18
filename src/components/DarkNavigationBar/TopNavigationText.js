import React from 'react';
import {View, Text} from 'react-native';

import PureComponent from '../PureComponent';
import CustomTouchableOpacity from '../CustomTouchableOpacity';

import {COLORS, SCALE, FONTS} from '../../style';

export default class TopLoginNavigationText extends PureComponent {
  static propTypes = {
    action: React.PropTypes.func,
    disabled: React.PropTypes.bool,
    index: React.PropTypes.number,
    label: React.PropTypes.string,
    navigator: React.PropTypes.object,
    type: React.PropTypes.string
  };

  render() {
    if (!this.props.label)
      return null;

    return (<View style={{flex: 1}}>
      <CustomTouchableOpacity
        disabled={this.props.disabled}
        onPress={this.props.action}
        style={[{
          flex: 1,
          justifyContent: 'center'
        }, this.props.type === 'left' ? {paddingLeft: 12} : {paddingRight: 12}]}
      >
        <Text style={{
          fontFamily: FONTS.ROMAN,
          fontSize: SCALE.h(34),
          color: COLORS.WHITE
        }}>{this.props.label}</Text>
      </CustomTouchableOpacity>
    </View>);
  }
}
