import { mixin } from 'core-decorators';
import _ from 'lodash';
import { observer } from 'mobx-react';
import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import validator from 'validator';
import App from '../App';
import BannerErrorContainer from '../components/BannerErrorContainer';
import MultilineTextInput from '../components/Form/MultilineTextInput';
import PageInput from '../components/Form/PageInput';
import PickerInput from '../components/Form/PickerInput';
import formMixin from '../mixins/form';
import UserStore from '../mobx/stores/UserStore';
import { COLORS, FONTS, SCALE } from '../style';

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
      this._save()
    }
  }

  _save = () => {
    this.setState({submitting: true});
    let formData = this.getFormValue();
    let business = {};
    if (UserStore.user.account_type == 'stylist') {
    }

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
