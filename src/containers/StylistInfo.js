import React from 'react';
import _ from 'lodash';
import validator from 'validator';
import {mixin} from 'core-decorators';
import PureComponent from '../components/PureComponent';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import MultilineTextInput from '../components/Form/MultilineTextInput';
import PickerInput from '../components/Form/PickerInput';
import PageInput from '../components/Form/PageInput';
import BannerErrorContainer from '../components/BannerErrorContainer';

import UserStore from '../mobx/stores/UserStore';
import {stylistEducation, stylistCertificates, stylistPlaceOfWork, stylistProductExperience, appStack, stylistSP} from '../routes';

import formMixin from '../mixins/form';

import {NAVBAR_HEIGHT} from '../constants';
import appEmitter from '../appEmitter';

@mixin(formMixin)
export default class StylistInfo extends PureComponent {
  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  state = {};

  render() {
    return (<NavigationSetting
      onWillBlur={this.onWillBlur}
      onWillFocus={this.onWillFocus}
      rightAction={() => {
        if (this.checkErrors())
          return;

        this.setState({'submitting': true});
        UserStore.editUser(this.getFormValue(), 'stylist')
        .then((r) => {
          this.setState({submitting: false});
          return r;
        })
        .then(
          () => {
            appEmitter.emit('user-edited');
            _.first(this.context.navigators).jumpTo(appStack, () => this.clearValues());
          },
          (e) => {
            this.refs.ebc.error(e);
          }
        );
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
          max={300}
          placeholder="Short professional description…"
          ref={(r) => this.addFormItem(r, 'description')}
          validation={(v) => !v || validator.isLength(v, {max: 300})}
        />

        <View style={{height: StyleSheet.hairlineWidth}} />

        <PickerInput
          choices={_.map(_.range(0, 46), i => ({
            label: i.toString(),
            value: i
          }))}
          placeholder="Years of experience"
          ref={(r) => this.addFormItem(r, 'years_exp')}
          validation={(v) => true}
          valueProperty="value"
        />

        <View style={{height: StyleSheet.hairlineWidth}} />

        <PageInput
          page={stylistEducation}
          placeholder="Education"
        />

        <View style={{height: StyleSheet.hairlineWidth}} />

        <PageInput
          page={stylistCertificates}
          placeholder="Certificates"
          ref={(r) => this.addFormItem(r, 'certificate_ids')}
          validation={(v) => true}
        />

        <View style={{height: StyleSheet.hairlineWidth}} />

        <PageInput
          page={stylistPlaceOfWork}
          placeholder="Place of work"
          ref={(r) => this.addFormItem(r, 'business')}
          validation={(v) => true}
        />

        <View style={{height: StyleSheet.hairlineWidth}} />

        <PageInput
          page={stylistProductExperience}
          placeholder="Product experience"
          ref={(r) => this.addFormItem(r, 'experience_ids')}
          validation={(v) => true}
        />

        <View style={{height: StyleSheet.hairlineWidth}} />

        <PageInput
          page={stylistSP}
          placeholder="Services &  Prices"
          ref={(r) => this.addFormItem(r, 'services')}
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
