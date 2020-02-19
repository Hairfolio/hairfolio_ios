import { mixin } from 'core-decorators';
import _ from 'lodash';
import { observer } from 'mobx-react';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import whiteBack from '../../resources/img/nav_white_back.png';
import BannerErrorContainer from '../components/BannerErrorContainer';
import InlineTextInput from '../components/Form/InlineTextInput';
import MultilineTextInput from '../components/Form/MultilineTextInput';
import PickerInput from '../components/Form/PickerInput';
import PureComponent from '../components/PureComponent';
import formMixin from '../mixins/form';
import states from '../states.json';
import { SCALE } from '../style';
import { showLog } from '../helpers';

@observer
@mixin(formMixin)
export default class EditCustomerAddress extends PureComponent {
  state = {};

  constructor(props) {
    super(props);
    if (this.props.currentValue) {
      showLog("EditCustomerAddress ==>"+JSON.stringify(this.props.currentValue))
      this.setValue(this.props.currentValue);
      
    }
    if (this.props.navigator) {
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }
  }

  static navigatorButtons = {
    leftButtons: [
      {
        id: 'back',
        icon: whiteBack,
      }
    ],
  };

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'back') {
        this.props.onBack(this.getValue());
        this.props.navigator.pop({
          animated: true,
        });
      }
    }
  }
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
    return (
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
              keyboardType="numeric"
              max={10}
            />
          </View>
        </View>
      </BannerErrorContainer>
    );
  }
};
