import React from 'react';
import {View, TextInput, Text} from 'react-native';
import PureComponent from '../PureComponent';

import {COLORS, FONTS, SCALE} from '../../style';

import focusEmitter from './focusEmitter';

// no animation here !

export default class FormInlineTextInput extends PureComponent {

  static propTypes = {
    getRefNode: React.PropTypes.func,
    onChangeText: React.PropTypes.func,
    onFocus: React.PropTypes.func,
    placeholder: React.PropTypes.string,
    validation: React.PropTypes.func
  };

  state = {};

  setInError() {
    this.setState({error: true});
  }

  getValue() {
    return this.state.value;
  }
  setValue(value) {
    this.setState({value});
  }

  isValide() {
    return this.props.validation(this.getValue());
  }

  clear() {
    this.setState({value: ''});
  }

  render() {
    return (<View style={{
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.WHITE
    }}>
      <Text style={{
        color: COLORS.DARK,
        fontFamily: FONTS.ROMAN,
        fontSize: SCALE.h(30),
        marginLeft: SCALE.w(26)
      }}>
        {this.props.placeholder}
      </Text>
      <TextInput
        {...this.props}
        onChangeText={(value) => {
          this.setState({value}, () => {
            if (this.state.error)
              this.setState({
                error: !this.isValide()
              });
          });

          if (this.props.onChangeText)
            this.props.onChangeText(value);
        }}
        onFocus={(e) => {
          focusEmitter.focus(this.props.getRefNode ? this.props.getRefNode() : null);
          if (this.props.onFocus)
            this.props.onFocus(e);
        }}
        placeholder=""
        ref="ti"
        selectionColor={COLORS.LIGHT2}
        style={{
          backgroundColor: 'white',
          paddingLeft: SCALE.w(26),
          paddingRight: SCALE.w(26),
          height: SCALE.h(80),
          flex: 1,
          borderWidth: 0,
          textAlignVertical: 'center',
          fontFamily: FONTS.ROMAN,
          fontSize: SCALE.h(30),
          color: this.state.error ? COLORS.RED : COLORS.TEXT,
          textAlign: 'right'
        }}
        underlineColorAndroid="transparent"
        value={this.state.value}
      />
    </View>);
  }
};
