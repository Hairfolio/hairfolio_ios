import React from 'react';
import _ from 'lodash';
import {Text, View, Switch} from 'react-native';
import PureComponent from '../PureComponent';
import Icon from '../Icon';

import {COLORS, FONTS, SCALE} from '../../style';

// no animation here !

export default class ToggleInput extends PureComponent {

  static propTypes = {
    disabled: React.PropTypes.bool,
    placeholder: React.PropTypes.string,
    validation: React.PropTypes.func
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  state = {
    value: false
  };

  setInError() {
    this.setState({error: true});
  }

  getValue() {
    return this.state.value;
  }
  setValue(value) {
    this.setState({value: !!value});
  }

  isValide() {
    return this.props.validation(this.getValue());
  }

  clear() {
    this.state.setValue({value: false});
  }

  render() {
    return (<View
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

      <Switch
        disabled={this.props.disabled}
        onValueChange={(value) => {
          this.setState({value});
        }}
        value={!!this.state.value}
      />
    </View>);
  }
};
