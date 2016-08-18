import React from 'react';
import {View, TouchableOpacity} from 'react-native';

import Icon from '../Icon';
import CustomTouchableOpacity from '../CustomTouchableOpacity';
import PureComponent from '../PureComponent';

import {COLORS, SCALE} from '../../style';

export default class TopLoginNavigationIcon extends PureComponent {
  static propTypes = {
    action: React.PropTypes.func,
    disabled: React.PropTypes.bool,
    icon: React.PropTypes.string,
    index: React.PropTypes.number,
    navigator: React.PropTypes.object,
    type: React.PropTypes.string
  };

  render() {
    if (!this.props.icon)
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
        <Icon
          color={COLORS.WHITE}
          name={this.props.icon}
          size={SCALE.h(18)}
        />
      </CustomTouchableOpacity>
    </View>);
  }
}
