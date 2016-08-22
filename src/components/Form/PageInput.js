import React from 'react';
import _ from 'lodash';
import {Text, TouchableOpacity} from 'react-native';
import PureComponent from '../PureComponent';
import Icon from '../Icon';

import {COLORS, FONTS, SCALE} from '../../style';

// no animation here !

export default class FormPageInput extends PureComponent {

  static propTypes = {
    disabled: React.PropTypes.bool,
    page: React.PropTypes.object,
    placeholder: React.PropTypes.string,
    validation: React.PropTypes.func
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  state = {};

  setInError() {
    this.setState({error: true});
  }

  getValue() {
    return this.props.page.scene().getValue();
  }

  isValide() {
    return this.props.validation(this.getValue());
  }

  clear() {
    this.props.page.scene().clear();
  }

  render() {
    return (<TouchableOpacity
      disabled={this.props.disabled}
      onPress={() => {
        _.last(this.context.navigators).jumpTo(this.props.page);
      }}
      style={{
        position: 'relative',
        flexDirection: 'row',
        paddingLeft: SCALE.w(26),
        paddingRight: SCALE.w(26),
        height: SCALE.h(80),
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white'
      }}
    >
      <Text
        style={{
          fontFamily: FONTS.ROMAN,
          fontSize: SCALE.h(30),
          color: this.state.error ? COLORS.RED : COLORS.DARK
        }}
      >{this.props.placeholder}</Text>

      <Icon
        color={this.state.error ? COLORS.RED : COLORS.DARK}
        name="down"
        size={SCALE.h(10)}
        style={{
          transform: [
            {rotate: '-90deg'}
          ]
        }}
      />
    </TouchableOpacity>);
  }
};