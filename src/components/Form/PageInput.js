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
    if (!this.props.page)
      return;
    return this.props.page.scene().getValue();
  }
  setValue(value) {
    if (!this.props.page)
      return;
    return this.props.page.scene().setValue(value);
  }

  isValide() {
    return this.props.validation(this.getValue());
  }

  clear() {
    if (!this.props.page)
      return;
    this.props.page.scene().clear();
  }

  onReady() {
    return new Promise((resolve) => this.props.page.onReady(resolve));
  }

  render() {
    return (<TouchableOpacity
      disabled={this.props.disabled}
      onPress={() => {
        if (this.props.onPress) {
          this.props.onPress();
        }
        if (!this.props.page)
          return;
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
