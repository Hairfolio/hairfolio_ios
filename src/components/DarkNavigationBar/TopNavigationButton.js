import React from 'react';
import {View, TouchableOpacity} from 'react-native';

import Icon from '../Icon';
import PureComponent from '../PureComponent';

import {COLORS} from '../../style';

export default class TopLoginNavigationButton extends PureComponent {
  static propTypes = {
    action: React.PropTypes.func,
    icon: React.PropTypes.string,
    index: React.PropTypes.number,
    navigator: React.PropTypes.object,
    type: React.PropTypes.string
  };

  render() {
    if (!this.props.icon)
      return null;

    return (<View style={{flex: 1}}>
      <TouchableOpacity
        onPress={this.props.action}
        style={[{
          flex: 1,
          justifyContent: 'center'
        }, this.props.type === 'left' ? {paddingLeft: 12} : {paddingRight: 12}]}
      >
        <Icon
          color={COLORS.PRIMARY.RED}
          name={this.props.icon}
          size={18}
        />
      </TouchableOpacity>
    </View>);
  }
}
