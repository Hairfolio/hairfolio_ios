import React from 'react';
import {View, Text} from 'react-native';

import {COLORS, FONTS, SCALE} from '../../style';

import PureComponent from '../PureComponent';

export default class TopLoginNavigationButton extends PureComponent {
  static propTypes = {
    navigator: React.PropTypes.object,
    title: React.PropTypes.string
  };

  render() {
    return (<View style={{flex: 1, justifyContent: 'center'}}>
      <Text style={{
        color: COLORS.WHITE,
        fontSize: SCALE.h(34),
        fontFamily: FONTS.MEDIUM
      }}>{this.props.title}</Text>
    </View>);
  }
}
