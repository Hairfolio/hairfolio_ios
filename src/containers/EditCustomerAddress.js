import React from 'react';
import _ from 'lodash';
import validator from 'validator';
import {mixin} from 'core-decorators';
import PureComponent from '../components/PureComponent';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS, FONTS, SCALE} from '../style';
import { observer } from 'mobx-react';
import MultilineTextInput from '../components/Form/MultilineTextInput';
import InlineTextInput from '../components/Form/InlineTextInput';
import PickerInput from '../components/Form/PickerInput';
import BannerErrorContainer from '../components/BannerErrorContainer';
import states from '../states.json';
import UserStore from '../mobx/stores/UserStore';
import formMixin from '../mixins/form';
import whiteBack from '../../resources/img/nav_white_back.png';

@observer
@mixin(formMixin)
export default class EditCustomerAddress extends PureComponent {
  state = {};

  constructor(props) {
    super(props);
    if (this.props.currentValue) {
      console.log("EditCustomerAddress ==>"+JSON.stringify(this.props.currentValue))
      this.setValue(this.props.currentValue);
      // if(UserStore.user.brand){
      //   this.setValue(UserStore.user.brand);
      // }
      // if(UserStore.user.salon){
      //   this.setValue(UserStore.user.salon);
      // }
      
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
    /* console.log("setValue ==>"+JSON.stringify(value))
    
    this.setFormValue({
      "address": value.address,
      "city" : value.city,
      "state":value.state,
      "zip":value.zip
   }); */
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
