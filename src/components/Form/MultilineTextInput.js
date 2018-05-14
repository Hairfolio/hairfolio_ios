import React, { Component } from 'react';
import { View, TextInput, Text } from 'react-native';

import { COLORS, FONTS, SCALE } from '../../style';

import focusEmitter from './focusEmitter';

// no animation here !

export default class FormMultilineTextInput extends React.Component {

  static propTypes = {
    blocked: React.PropTypes.bool,
    getRefNode: React.PropTypes.func,
    max: React.PropTypes.number,
    onChangeText: React.PropTypes.func,
    onFocus: React.PropTypes.func,
    validation: React.PropTypes.func
  };

  state = {
    value: ''
  };

  setInError() {
    this.setState({ error: true });
  }

  getValue() {
    return this.state.value || '';
  }

  isValide() {
    return this.props.validation(this.getValue());
  }

  setValue(value) {
    this.setState({ value: value || '' });
  }

  clear() {
    this.setState({ value: '' });
  }

  render() {
    return (
      <View style={{
        position: 'relative',
        height: SCALE.h(200),
      }}>
        <TextInput
          maxLength={this.props.max}
          editable={!this.props.blocked}
          {...this.props}
          multiline
          onChangeText={(value) => {
            this.setState({ value }, () => {
              if (this.state.error)
                this.setState({
                  error: !this.isValide()
                });
            });

            if (this.props.onChangeText)
              this.props.onChangeText(value);
          }}
          // onFocus={(e) => {
          //   focusEmitter.focus(this.props.getRefNode ? this.props.getRefNode() : null);
          //   if (this.props.onFocus)
          //     this.props.onFocus(e);
          // }}
          placeholderTextColor={this.state.error ? COLORS.RED : COLORS.TEXT}
          ref="ti"
          selectionColor={COLORS.LIGHT2}
          style={{
            backgroundColor: this.props.blocked ? 'rgba(0, 0, 0, 0.1)' : 'white',
            paddingLeft: SCALE.w(26),
            paddingRight: SCALE.w(26),
            paddingTop: 5,
            paddingBottom: 5,
            height: SCALE.h(172),
            flex: 1,
            borderWidth: 0,
            fontFamily: FONTS.ROMAN,
            fontSize: SCALE.h(30),
            color: this.state.error ? COLORS.RED : COLORS.DARK,
            textAlignVertical: 'top'
          }}
          underlineColorAndroid="transparent"
          value={this.state.value}
        />
        {this.props.max &&
          <View style={{
            position: 'absolute',
            backgroundColor: 'transparent',
            right: SCALE.w(26),
            bottom: 5
          }}>
            <Text
              style={{
                textAlign: 'right',
                fontFamily: FONTS.ROMAN,
                fontSize: SCALE.h(28),
                color: COLORS.TEXT
              }}
            >
              {this.props.max - this.state.value.length}
            </Text>
          </View>
        }
      </View>);
  }
};
