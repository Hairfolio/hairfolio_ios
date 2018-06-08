import React, { Component } from 'react';
import _ from 'lodash';
import validator from 'validator';
import { observer } from 'mobx-react';
import {mixin} from 'core-decorators';
import {View, Text, StyleSheet,StatusBar} from 'react-native';
import {COLORS, FONTS, SCALE} from '../style';
import MultilineTextInput from '../components/Form/MultilineTextInput';
import PickerInput from '../components/Form/PickerInput';
import PageInput from '../components/Form/PageInput';
import BannerErrorContainer from '../components/BannerErrorContainer';
import UserStore from '../mobx/stores/UserStore';
import formMixin from '../mixins/form';
import App from '../App';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

@observer
@mixin(formMixin)
export default class StylistInfo extends React.Component {
  state = {};

  constructor(props) {
    super(props);
    StatusBar.setBarStyle('light-content');
    this.props.navigator.setOnNavigatorEvent((e) => {
      this.onNavigatorEvent(e);
    });
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
      // App.startApplication();
      this._save()
    }
  }

  _save = () => {
    this.setState({submitting: true});
    let formData = this.getFormValue();
    let business = {};
    if (UserStore.user.account_type == 'stylist') {
      // console.log("formData ==>"+JSON.stringify(formData))
      // formData.description = formData.business_info;
      // delete formData.business_info;
    }
   /*  for (let key in formData) {
      if (key == 'business') {
        for (let key2 in formData[key]) {
          business[key2] = formData[key][key2];
        }
      } else if (key.startsWith('business')) {
        business[key.substr(9)] = formData[key];
      }
    }
    formData['business'] = business; */
    UserStore.editUser(formData, UserStore.user.account_type)
      .then((r) => {
        this.setState({submitting: false});
        App.startApplication();
        return r;
      })
      .catch((e) => {
        App.startApplication();
        this.setState({submitting: false});
        this.refs.ebc.error(e);
      });
  }


  render() {
    return (
      <BannerErrorContainer ref="ebc" style={{
        flex: 1
      }}>

      <KeyboardAwareScrollView>

        <MultilineTextInput
          max={300}
          placeholder="Short professional description…"
          ref={(r) => this.addFormItem(r, 'description')}
          validation={(v) => !v || validator.isLength(v, {max: 300})}
          onChangeText={ (value)=>{
            UserStore.user.description = value
          }}
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
          onValueChange={(value) => {
            UserStore.user.years_exp = value;
          }}
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

        </KeyboardAwareScrollView>
      </BannerErrorContainer>
    );
  }
};
