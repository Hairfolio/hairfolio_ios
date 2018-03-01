import React from 'react';
import _ from 'lodash';
import {Text, TouchableOpacity} from 'react-native';
import PureComponent from '../PureComponent';
import Icon from '../Icon';
import NavigatorStyles from '../../common/NavigatorStyles';
import {COLORS, FONTS, SCALE} from '../../style';

export default class FormPageInput extends PureComponent {
  static propTypes = {
    disabled: React.PropTypes.bool,
    page: React.PropTypes.object,
    placeholder: React.PropTypes.string,
    validation: React.PropTypes.func,
    navigator: React.PropTypes.object,
    title: React.PropTypes.string,
  };

  state = {};

  setInError() {
    this.setState({
      error: true,
      value: null
    });
  }

  getValue() {
    return this.state.value;
  }

  setValue(value) {
    return this.setState({
      ...this.sate,
      value
    });
  }

  isValide() {
    return this.props.validation(this.getValue());
  }

  clear() {
    this.setState({ value: null });
  }

  render() {
    return (
      <TouchableOpacity
        disabled={this.props.disabled}
        onPress={() => {
          if (this.props.onPress) {
            this.props.onPress();
          }
          if (!this.props.page)
            return;
          this.props.navigator.push({
            screen: this.props.page,
            title: this.props.title || '',
            passProps: {
              onBack: (value) => this.setValue(value),
              currentValue: this.state.value,
            },
            navigatorStyle: NavigatorStyles.basicInfo,
          });
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
      </TouchableOpacity>
      );
  }
};
