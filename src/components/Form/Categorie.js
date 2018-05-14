import React from 'react';
import {Text, View} from 'react-native';
import PureComponent from '../PureComponent';

import {COLORS, FONTS, SCALE} from '../../style';

// no animation here !

export default class FormCategory extends PureComponent {

  static propTypes = {
    name: React.PropTypes.string.isRequired
  };

  render() {
    return (<View style={{
      height: SCALE.h(86),
      paddingLeft: SCALE.w(22),
      justifyContent: 'center'
    }}>
      <Text style={{
        color: COLORS.TEXT,
        fontSize: SCALE.h(28),
        fontFamily: FONTS.HEAVY
      }}>
        {this.props.name}
      </Text>
    </View>);
  }
};
