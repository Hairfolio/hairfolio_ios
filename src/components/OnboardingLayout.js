import React from 'react';
import {View} from 'react-native';
import PureComponent from './PureComponent';
import Icon from './Icon';

import {SCALE, COLORS} from '../style';

export default class OnboardingLayout extends PureComponent {
  static propTypes = {
    children: React.PropTypes.node.isRequired
  };

  render() {
    return (<View
      style={{
        backgroundColor: 'transparent',
        flex: 1
      }}
    >
      <View style={{
        flex: 5,
        justifyContent: 'flex-end',
        alignItems: 'center'
      }}>
        <Icon
          color={COLORS.WHITE}
          name="logo"
          size={SCALE.h(172)}
        />
      </View>

      <View style={{
        flex: 7,
        paddingTop: SCALE.h(80),
        paddingLeft: SCALE.w(69),
        paddingRight: SCALE.w(69),
        paddingBottom: SCALE.h(42)
      }}>
        {this.props.children}
      </View>
    </View>);
  }
}
