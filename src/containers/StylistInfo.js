import React from 'react';
import _ from 'lodash';
import validator from 'validator';
import { observer } from 'mobx-react';
import {mixin} from 'core-decorators';
import PureComponent from '../components/PureComponent';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS, FONTS, SCALE} from '../style';
import MultilineTextInput from '../components/Form/MultilineTextInput';
import PickerInput from '../components/Form/PickerInput';
import PageInput from '../components/Form/PageInput';
import BannerErrorContainer from '../components/BannerErrorContainer';
import UserStore from '../mobx/stores/UserStore';
import formMixin from '../mixins/form';
import App from '../App';

@observer
@mixin(formMixin)
export default class StylistInfo extends PureComponent {
  state = {};

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  static navigatorButtons = {
    rightButtons: [
      {
        id: 'submit',
        title: 'Next',
        buttonFontSize: SCALE.h(30),
        buttonColor: COLORS.WHITE,
      }
    ]
  };

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') {
      UserStore.needsMoreInfo = false
      App.startApplication();
    }
  }

  render() {
    return (
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
          page={'hairfolio.StylistEducation'}
          navigator={this.props.navigator}
          title={'Education'}
          placeholder="Education"
        />

        <View style={{height: StyleSheet.hairlineWidth}} />

        <PageInput
          page={'hairfolio.StylistCertificates'}
          placeholder="Certificates"
          ref={(r) => this.addFormItem(r, 'certificate_ids')}
          validation={(v) => true}
          title='Certificates'
          navigator={this.props.navigator}
        />

        <View style={{height: StyleSheet.hairlineWidth}} />

        <PageInput
          page={'hairfolio.StylistPlaceOfWork'}
          placeholder="Place of work"
          title='Place of work'
          navigator={this.props.navigator}
          ref={(r) => this.addFormItem(r, 'business')}
          validation={(v) => true}
        />

        <View style={{height: StyleSheet.hairlineWidth}} />

        <PageInput
          page={'hairfolio.StylistProductExperience'}
          placeholder="Product experience"
          ref={(r) => this.addFormItem(r, 'experience_ids')}
          validation={(v) => true}
          title='Product Experience'
          navigator={this.props.navigator}
        />

        <View style={{height: StyleSheet.hairlineWidth}} />

        <PageInput
          page={'hairfolio.SalonSP'}
          placeholder="Services &  Prices"
          ref={(r) => this.addFormItem(r, 'services')}
          title="Services &  Prices"
          navigator={this.props.navigator}
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
    );
  }
};
