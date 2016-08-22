import React from 'react';
import _ from 'lodash';
import validator from 'validator';
import reactMixin from 'react-mixin';
import PureComponent from '../components/PureComponent';
import {View, Text, StyleSheet} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import MultilineTextInput from '../components/Form/MultilineTextInput';
import PickerInput from '../components/Form/PickerInput';
import PageInput from '../components/Form/PageInput';
import BannerErrorContainer from '../components/BannerErrorContainer';

import {throwOnFail} from '../lib/reduxPromiseMiddleware';

import {registrationActions} from '../actions/registration';

import {stylistEducation, stylistCertificates, stylistPlaceOfWork, stylistProductExperience} from '../routes';

import formMixin from '../mixins/form';

import {NAVBAR_HEIGHT} from '../constants';

@connect(app)
@reactMixin.decorate(formMixin)
export default class StylistInfo extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired,
    dispatch: React.PropTypes.func.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  state = {};

  render() {
    return (<NavigationSetting
      leftAction={() => {
        _.last(this.context.navigators).jumpBack();
      }}
      leftDisabled={this.state.submitting}
      leftIcon="back"
      onWillBlur={this.onWillBlur}
      onWillFocus={this.onWillFocus}
      rightAction={() => {
        if (this.checkErrors())
          return;

        console.log(this.getFormValue());
      }}
      rightDisabled={this.state.submitting}
      rightLabel="Next"
      style={{
        flex: 1,
        backgroundColor: COLORS.LIGHT,
        paddingTop: NAVBAR_HEIGHT
      }}
      title="Professional Info"
    >
      <BannerErrorContainer ref="ebc" style={{
        flex: 1
      }}>
        <View style={{
          height: SCALE.h(34)
        }} />

        <MultilineTextInput
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          max={300}
          placeholder="Short professional description…"
          ref={(r) => this.addFormItem(r, 'email')}
          validation={(v) => !!v && validator.isLength(v, {max: 300})}
        />

        <View style={{height: StyleSheet.hairlineWidth}} />

        <PickerInput
          choices={_.map(_.range(0, 20), i => ({label: i.toString()}))}
          placeholder="Years of experience"
          ref={(r) => this.addFormItem(r, 'experience')}
          validation={(v) => !!v}
        />

        <View style={{height: StyleSheet.hairlineWidth}} />

        <PageInput
          page={stylistEducation}
          placeholder="Education"
          ref={(r) => this.addFormItem(r, 'education')}
          validation={(v) => true}
        />

        <View style={{height: StyleSheet.hairlineWidth}} />

        <PageInput
          page={stylistCertificates}
          placeholder="Certificates"
          ref={(r) => this.addFormItem(r, 'certificates')}
          validation={(v) => true}
        />

        <View style={{height: StyleSheet.hairlineWidth}} />

        <PageInput
          page={stylistPlaceOfWork}
          placeholder="Place of work"
          ref={(r) => this.addFormItem(r, 'place_of_work')}
          validation={(v) => true}
        />

        <View style={{height: StyleSheet.hairlineWidth}} />

        <PageInput
          page={stylistPlaceOfWork}
          placeholder="Product experience"
          ref={(r) => this.addFormItem(r, 'product_experience')}
          validation={(v) => true}
        />

        <Text style={{
          marginTop: SCALE.h(35),
          marginLeft: SCALE.w(25),
          marginRight: SCALE.w(25),
          fontFamily: FONTS.MEDIUM,
          fontSize: SCALE.h(26),
          color: COLORS.TEXT
        }}>You can fill all this in later, if you’re feeling lazy.</Text>
      </BannerErrorContainer>
    </NavigationSetting>);
  }
};
