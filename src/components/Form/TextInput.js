import React from 'react';
import {View, TextInput} from 'react-native';
import PureComponent from '../PureComponent';

import {COLORS, FONTS, SCALE} from '../../style';

import Icon from '../Icon';

import focusEmitter from './focusEmitter';

// no animation here !

export default class FormTextInput extends PureComponent {

  static propTypes = {
    check: React.PropTypes.bool,
    error: React.PropTypes.bool,
    getRefNode: React.PropTypes.func,
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
        placeholderTextColor={COLORS.TEXT}
        ref="ti"
        selectionColor={COLORS.LIGHT2}
        style={{
          backgroundColor: 'white',
          paddingLeft: SCALE.w(26),
          paddingRight: SCALE.w(26),
          height: SCALE.h(17 * 2 + 48),
          borderRadius: 1,
          flex: 1,
          borderWidth: 0,
          textAlignVertical: 'center',
          fontFamily: FONTS.ROMAN,
          fontSize: SCALE.h(30),
          color: this.props.error ? COLORS.RED : COLORS.DARK
        }}
        underlineColorAndroid="transparent"
      />
      {this.props.check &&
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
