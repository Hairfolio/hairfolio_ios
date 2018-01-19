import React from 'react';
import _ from 'lodash';
import validator from 'validator';
import {mixin} from 'core-decorators';
import PureComponent from '../components/PureComponent';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';
import { observer } from 'mobx-react';
import MultilineTextInput from '../components/Form/MultilineTextInput';
import InlineTextInput from '../components/Form/InlineTextInput';
import PickerInput from '../components/Form/PickerInput';
import BannerErrorContainer from '../components/BannerErrorContainer';
import states from '../states.json';

import UserStore from '../mobx/stores/UserStore';
import {editCustomer} from '../routes';

import formMixin from '../mixins/form';

import {NAVBAR_HEIGHT} from '../constants';

@observer
@mixin(formMixin)
export default class EditCustomerAddress extends PureComponent {
  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  state = {};

  getValue() {
    var value = this.getFormValue();
    return !_.isEmpty(value) ? value : null;
  }

  clear() {
    this.clearValues();
  }

  setValue(value) {
    this.setFormValue(value);
  }

  render() {
    return (<NavigationSetting
      leftAction={() => {
        _.last(this.context.navigators).jumpTo(editCustomer);
      }}
      leftDisabled={this.state.submitting}
      leftIcon="back"
      onWillBlur={this.onWillBlur}
      onWillFocus={this.onWillFocus}
      style={{
        flex: 1,
        backgroundColor: COLORS.LIGHT,
        paddingTop: NAVBAR_HEIGHT
      }}
      title="Address"
    >
      <BannerErrorContainer ref="ebc" style={{
        flex: 1
      }}>
        <View style={{
          height: SCALE.h(34)
        }} />

        <View style={{height: StyleSheet.hairlineWidth}} />

        <MultilineTextInput
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Address"
          ref={(r) => this.addFormItem(r, 'address')}
          validation={(v) => !!v}
        />

        <View style={{height: StyleSheet.hairlineWidth}} />

        <InlineTextInput
          autoCorrect={false}
          placeholder="City"
          ref={(r) => this.addFormItem(r, 'city')}
          validation={(v) => !!v}
        />
        <View style={{height: StyleSheet.hairlineWidth}} />

        <View style={{
          flexDirection: 'row'
        }}>
          <View style={{flex: 1}}>
            <PickerInput
              choices={states}
              placeholder="State"
              ref={(r) => this.addFormItem(r, 'state')}
              validation={(v) => !!v}
              valueProperty="abbreviation"
            />
          </View>
          <View style={{width: StyleSheet.hairlineWidth}} />
          <View style={{flex: 1}}>
            <InlineTextInput
              autoCorrect={false}
              placeholder="Zip"
              ref={(r) => this.addFormItem(r, 'zip')}
              validation={(v) => !!v}
            />
          </View>
        </View>
      </BannerErrorContainer>
    </NavigationSetting>);
  }
};
