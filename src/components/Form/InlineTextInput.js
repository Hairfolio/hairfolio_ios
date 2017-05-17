import React from 'react';
import {View, TextInput, Text} from 'react-native';
import PureComponent from '../PureComponent';

import {COLORS, FONTS, SCALE} from '../../style';

import focusEmitter from './focusEmitter';

// no animation here !

export default class FormInlineTextInput extends PureComponent {

  static propTypes = {
    blocked: React.PropTypes.bool,
    getRefNode: React.PropTypes.func,
    help: React.PropTypes.string,
    onChangeText: React.PropTypes.func,
    onFocus: React.PropTypes.func,
    validation: React.PropTypes.func
  };

  state = {};

  setInError() {
    this.setState({error: true});
  }

  getValue() {
    return this.state.value || '';
  }

  isValide() {
    return this.props.validation(this.getValue());
  }

  setValue(value) {
    this.setState({value});
  }

  clear() {
    this.setState({value: ''});
  }

  render() {
    return (<View style={{position: 'relative'}}>
      <TextInput
        editable={!this.props.blocked}
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
        placeholderTextColor={this.state.error ? COLORS.RED : COLORS.TEXT}
        ref="ti"
        selectionColor={COLORS.LIGHT2}
        style={{
          backgroundColor: this.props.blocked ? 'rgba(0, 0, 0, 0.1)' : 'white',
          paddingLeft: SCALE.w(26),
          paddingRight: SCALE.w(26),
          height: SCALE.h(80),
          borderWidth: 0,
          textAlignVertical: 'center',
          fontFamily: FONTS.ROMAN,
          fontSize: SCALE.h(30),
          color: this.state.error ? COLORS.RED : COLORS.DARK
        }}
        underlineColorAndroid="transparent"
        value={this.state.value}
      />
      {this.props.help &&
        <View style={{
          position: 'absolute',
          backgroundColor: 'transparent',
          right: 0,
          top: 0,
          bottom: 0,
          paddingRight: 10,
          justifyContent: 'center'
        }}>
          <Text
            style={{
              textAlign: 'right',
              fontFamily: FONTS.ROMAN,
              fontSize: SCALE.h(28),
              color: COLORS.TEXT
            }}
          >
            {this.props.help}
          </Text>
        </View>
      }
    </View>);
  }
};
