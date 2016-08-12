import React from 'react';
import {View, TextInput, Text} from 'react-native';
import PureComponent from '../PureComponent';

import {COLORS, FONTS, SCALE} from '../../style';

import focusEmitter from './focusEmitter';

// no animation here !

export default class FormInlineTextInput extends PureComponent {

  static propTypes = {
    error: React.PropTypes.bool,
    getRefNode: React.PropTypes.func,
    help: React.PropTypes.string,
    onFocus: React.PropTypes.func
  };

  render() {
    return (<View style={{position: 'relative'}}>
      <TextInput
        {...this.props}
        onFocus={(e) => {
          focusEmitter.focus(this.props.getRefNode ? this.props.getRefNode() : null);
          if (this.props.onFocus)
            this.props.onFocus(e);
        }}
        placeholderTextColor={COLORS.LIGHT2}
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
          color: this.props.error ? COLORS.RED : COLORS.DARK
        }}
        underlineColorAndroid="transparent"
      />
      {this.props.help &&
        <View style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          paddingRight: 10,
          justifyContent: 'center'
        }}>
          <Text
            style={{
              textAlign: 'right'
            }}
          >
            {this.props.help}
          </Text>
        </View>
      }
    </View>);
  }
};
