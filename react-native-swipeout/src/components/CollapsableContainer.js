import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon2 from "react-native-vector-icons/Entypo";
import { COLORS, FONTS, SCALE } from '../style';
import Icon from './Icon';
import PureComponent from './PureComponent';
import { showLog } from '../helpers';

export default class CollapsableContainer extends PureComponent {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
    label: React.PropTypes.string.isRequired,
    noPadding: React.PropTypes.bool,
    renderFooter: React.PropTypes.func
  };

  state = {};

  updateState(){
    this.setState({
      open: !this.state.open
    });
  }

  render() {
    return (<View style={[{marginBottom: SCALE.h(4)}, this.props.collapseableContainerStyle]}>
      <TouchableOpacity
        onPress={() => {(this.props.onPress) ? (this.props.onPress()) : showLog('not received')}}
        style={[{
          backgroundColor: COLORS.COLLAPSABLE_COLOR,
          height: SCALE.h(80),
          paddingLeft: SCALE.w(18),
          paddingRight: SCALE.w(18),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },this.props.collapseableBackgroundStyle]}
      >
        <Text style={[{
          fontFamily: FONTS.ROMAN,
          color: COLORS.COLLAPSABLE_TEXT_COLOR,
          fontSize: SCALE.h(28)
        },this.props.collapseableTextStyle]}>{this.props.label}</Text>

        {
          (this.props.from_filter)
          ?

          <Icon2
          color={COLORS.COLLAPSABLE_TEXT_COLOR}
          name={this.props.status ? 'chevron-thin-up' : 'chevron-thin-down'}
          // name={this.state.open ? 'collapsable-line' : 'expand_button'}
          size={this.props.status ? SCALE.h(31) : SCALE.h(31)}
        />
          :
          <Icon
          color={COLORS.COLLAPSABLE_TEXT_COLOR}
          name={this.state.open ? 'collapsable-line' : 'collapsable-cross'}
          // name={this.state.open ? 'collapsable-line' : 'expand_button'}
          size={this.state.open ? SCALE.h(2) : SCALE.h(31)}
        />
        }
        {/* <Icon
          color={COLORS.COLLAPSABLE_TEXT_COLOR}
          name={this.state.open ? 'collapsable-line' : 'collapsable-cross'}
          // name={this.state.open ? 'collapsable-line' : 'expand_button'}
          size={this.state.open ? SCALE.h(2) : SCALE.h(31)}
        /> */}
      </TouchableOpacity>
      <View style={!this.props.status ? {height: 0, overflow: 'hidden'} : null}>
        <View style={[{padding: this.props.noPadding ? 0 : 10},this.props.collapseableStyle]}>
          {this.props.children}
        </View>
        {this.props.renderFooter && <View style={{
          borderTopWidth: StyleSheet.hairlineWidth,
          borderColor: COLORS.ABOUT_SEPARATOR,
          padding: 10,
        }}>
          {this.props.renderFooter()}
        </View>}
      </View>
    </View>);
  }
}
