import React from 'react';
import {View, TextInput} from 'react-native';
import PureComponent from '../PureComponent';

import {COLORS, FONTS, SCALE} from '../../style';

import Icon from '../Icon';

import focusEmitter from './focusEmitter';

// no animation here !

export default class FormTextInput extends PureComponent {

  static propTypes = {
    getRefNode: React.PropTypes.func,
    onChangeText: React.PropTypes.func,
    onFocus: React.PropTypes.func,
    validation: React.PropTypes.func
  };

  state = {};

  setInError() {
    this.setState({error: true});
  }

  getValue() {
    return this.state.value;
  }

  isValide() {
    return this.props.validation(this.getValue());
  }

  clear() {
    this.setState({value: ''});
  }

  render() {
    return (<View style={{position: 'relative'}}>
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
        placeholderTextColor={this.state.error ? COLORS.RED : COLORS.TEXT}
        ref="ti"
        selectionColor={COLORS.LIGHT2}
        style={{
          backgroundColor: 'white',
          paddingLeft: SCALE.w(26),
          paddingRight: SCALE.w(26),
          height: SCALE.h(17 * 2 + 48),
          borderRadius: 1,
          borderWidth: 0,
          textAlignVertical: 'center',
          fontFamily: FONTS.ROMAN,
          fontSize: SCALE.h(30),
          color: this.state.error ? COLORS.RED : COLORS.DARK
        }}
        underlineColorAndroid="transparent"
        value={this.state.value}
      />
      {this.state.check &&
        <View style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: SCALE.w(90),
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon
            color={COLORS.DARK}
            name="check"
            size={SCALE.h(28)}
          />
        </View>
      }
    </View>);
  }
};
