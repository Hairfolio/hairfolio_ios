import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';

import PureComponent from '../PureComponent';

import {COLORS, SCALE, FONTS} from '../../style';

export default class TopLoginNavigationText extends PureComponent {
  static propTypes = {
    action: React.PropTypes.func,
    index: React.PropTypes.number,
    label: React.PropTypes.string,
    navigator: React.PropTypes.object,
    type: React.PropTypes.string
  };

  render() {
    if (!this.props.label)
      return null;

    return (<View style={{flex: 1}}>
      <TouchableOpacity
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
      </TouchableOpacity>
    </View>);
  }
}
