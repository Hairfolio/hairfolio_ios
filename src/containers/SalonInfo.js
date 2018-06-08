import React, { Component } from 'react';
import _ from 'lodash';
import validator from 'validator';
import {mixin} from 'core-decorators';
import {View, Text, StyleSheet, StatusBar} from 'react-native';
import {COLORS, FONTS, SCALE} from '../style';
import { observer } from 'mobx-react';
import MultilineTextInput from '../components/Form/MultilineTextInput';
import InlineTextInput from '../components/Form/InlineTextInput';
import PickerInput from '../components/Form/PickerInput';
import PageInput from '../components/Form/PageInput';
import BannerErrorContainer from '../components/BannerErrorContainer';
import KeyboardScrollView from '../components/KeyboardScrollView';
import states from '../states.json';
import App from '../App';
import formMixin from '../mixins/form';
import UserStore from '../mobx/stores/UserStore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

@observer
@mixin(formMixin)
export default class SalonInfo extends React.Component {
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
        id: 'next',
        title: 'Next',
        buttonFontSize: SCALE.h(30),
        buttonColor: COLORS.WHITE,
      }
    ]
  };

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'next') {
        if (!this.checkErrors()) {
          let formData = this.getFormValue();
          if(UserStore.user.salon){
            formData.business.name = UserStore.user.salon.name;
          }else{
            formData.business.name = "";
          }
          
          this.setState({'submitting': true});
          UserStore.editUser(formData)
          .then((r) => {
            this.setState({submitting: false});
            return r;
          })
          .then(
            () => {
              UserStore.needsMoreInfo = false;
              App.startApplication();
            },
            (e) => {
              this.refs.ebc.error(e);
            }
          );
        } else {
          UserStore.needsMoreInfo = false;
          App.startApplication();
        }
      }
    }
  }

  render() {
    return (
      <BannerErrorContainer ref="ebc" style={{
        flex: 1
      }}>
        <KeyboardAwareScrollView
          scrollToTopOnBlur
          showsVerticalScrollIndicator={false}
          space={200}
          style={{flex: 1}}
        >

          <MultilineTextInput
            autoCapitalize="none"
            autoCorrect={false}
            max={300}
            placeholder="Short professional description…"
            ref={(r) => this.addFormItem(r, 'business.info')}
            validation={(v) => !v || validator.isLength(v, {max: 300})}
          />

          <View style={{height: StyleSheet.hairlineWidth}} />

          <MultilineTextInput
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Address"
            ref={(r) => this.addFormItem(r, 'business.address')}
            validation={(v) => true}
          />

          <View style={{height: StyleSheet.hairlineWidth}} />

          <InlineTextInput
            autoCorrect={false}
            placeholder="City"
            ref={(r) => this.addFormItem(r, 'business.city')}
            validation={(v) => true}
          />
          <View style={{height: StyleSheet.hairlineWidth}} />

          <View style={{
            flexDirection: 'row'
          }}>
            <View style={{flex: 1}}>
              <PickerInput
                choices={states}
                placeholder="State"
                ref={(r) => this.addFormItem(r, 'business.state')}
                validation={(v) => true}
                valueProperty="abbreviation"
              />
            </View>
            <View style={{width: StyleSheet.hairlineWidth}} />
            <View style={{flex: 1}}>
              <InlineTextInput
                autoCorrect={false}
                placeholder="Zip"
                keyboardType="numeric"
                ref={(r) => this.addFormItem(r, 'business.zip')}
                validation={(v) => true}
                max={10}
              />
            </View>
          </View>

          <View style={{height: StyleSheet.hairlineWidth}} />

          <InlineTextInput
            autoCorrect={false}
            keyboardType="url"
            placeholder="Website"
            ref={(r) => this.addFormItem(r, 'business.website')}
            validation={(v) => true}
          />
          <View style={{height: StyleSheet.hairlineWidth}} />

          <InlineTextInput
            autoCorrect={false}
            keyboardType="phone-pad" 
            max={15}
            placeholder="Phone Number"
            ref={(r) => this.addFormItem(r, 'business.phone')}
            validation={(v) => true}
          />
          <View style={{height: StyleSheet.hairlineWidth}} />

          <PageInput
            page={'hairfolio.SalonStylists'}
            navigator={this.props.navigator}
            title={'Stylist'}
            placeholder="Stylists"
          />

          <View style={{height: StyleSheet.hairlineWidth}} />

          <PageInput
            page={'hairfolio.StylistProductExperience'}
            navigator={this.props.navigator}
            title={'Products'}
            placeholder="Products"
            ref={(r) => this.addFormItem(r, 'experience_ids')}
            validation={(v) => true}
          />

          <View style={{height: StyleSheet.hairlineWidth}} />

          <PageInput
            page={'hairfolio.SalonSP'}
            navigator={this.props.navigator}
            title={'Services &  Prices'}
            placeholder="Services &  Prices"
            ref={(r) => this.addFormItem(r, 'services')}
            validation={(v) => true}
          />

          <View style={{height: StyleSheet.hairlineWidth}} />

          <MultilineTextInput
            autoCapitalize="none"
            autoCorrect={false}
            max={300}
            placeholder="Career opportunities"
            ref={(r) => this.addFormItem(r, 'career_opportunity')}
            validation={(v) => !v || validator.isLength(v, {max: 300})}
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
