import React from 'react';
import {View, TextInput} from 'react-native';
import PureComponent from '../PureComponent';
import Icon from '../Icon';

import {COLORS, FONTS} from '../../style';

import focusEmitter from './focusEmitter';

// no animation here !

export default class FormTextInput extends PureComponent {

  static propTypes = {
    icon: React.PropTypes.string.isRequired,
    onFocus: React.PropTypes.func
  };

  render() {
    return (<View style={{
      height: 51,
      flexDirection: 'row'
    }}>
      <View style={{
        width: 30,
        alignItems: 'flex-start',
        justifyContent: 'center'
      }}>
        <Icon
          color={COLORS.PRIMARY.RED}
          name={this.props.icon}
          size={19}
        />
      </View>
      <TextInput
        {...this.props}
        onFocus={(e) => {
          focusEmitter.focus();
          if (this.props.onFocus)
            this.props.onFocus(e);
        }}
        placeholderTextColor={COLORS.LIGHT}
        ref="ti"
        selectionColor={COLORS.LIGHT}
        style={{
          flex: 1,
          borderWidth: 0,
          textAlignVertical: 'center',
          fontFamily: FONTS.MEDIUM,
          fontSize: 12.8,
          color: COLORS.DARK
        }}
        underlineColorAndroid="transparent"
      />
    </View>);
  }
};
