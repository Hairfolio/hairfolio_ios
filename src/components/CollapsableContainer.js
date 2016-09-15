import React from 'react';
import {Animated, View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import PureComponent from './PureComponent';
import Icon from './Icon';

import {COLORS, FONTS, SCALE} from '../style';

export default class CollapsableContainer extends PureComponent {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
    label: React.PropTypes.string.isRequired,
    renderFooter: React.PropTypes.func
  };

  state = {};

  render() {
    return (<View style={{marginBottom: SCALE.h(4)}}>
      <TouchableOpacity
        onPress={() => {
          this.setState({
            open: !this.state.open
          });
        }}
        style={{
          backgroundColor: COLORS.COLLAPSABLE_COLOR,
          height: SCALE.h(80),
          paddingLeft: SCALE.w(18),
          paddingRight: SCALE.w(18),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Text style={{
          fontFamily: FONTS.ROMAN,
          color: COLORS.COLLAPSABLE_TEXT_COLOR,
          fontSize: SCALE.h(28)
        }}>{this.props.label}</Text>
        <Icon
          color={COLORS.COLLAPSABLE_TEXT_COLOR}
          name={this.state.open ? 'collapsable-line' : 'collapsable-cross'}
          size={this.state.open ? SCALE.h(2) : SCALE.h(31)}
        />
      </TouchableOpacity>
      <View style={!this.state.open ? {height: 0, overflow: 'hidden'} : null}>
        <View style={{padding: 10}}>
          {this.props.children}
        </View>
        {this.props.renderFooter && <View style={{
          borderTopWidth: StyleSheet.hairlineWidth,
          borderColor: COLORS.ABOUT_SEPARATOR,
          padding: 10
        }}>
          {this.props.renderFooter()}
        </View>}
      </View>
    </View>);
  }
}
