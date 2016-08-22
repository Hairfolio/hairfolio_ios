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
import InlineTextInput from '../components/Form/InlineTextInput';
import PickerInput from '../components/Form/PickerInput';
import PageInput from '../components/Form/PageInput';
import BannerErrorContainer from '../components/BannerErrorContainer';
import KeyboardScrollView from '../components/KeyboardScrollView';

import {throwOnFail} from '../lib/reduxPromiseMiddleware';

import {registrationActions} from '../actions/registration';

import {salonStylists, salonSP} from '../routes';

import formMixin from '../mixins/form';

import {NAVBAR_HEIGHT} from '../constants';

@connect(app)
@reactMixin.decorate(formMixin)
export default class SalonInfo extends PureComponent {
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
        <KeyboardScrollView
          scrollEnabled={false}
          scrollToTopOnBlur
          showsVerticalScrollIndicator={false}
          space={200}
          style={{flex: 1}}
        >
          <View style={{
            height: SCALE.h(34)
          }} />

          <MultilineTextInput
            autoCapitalize="none"
            autoCorrect={false}
            max={300}
            placeholder="Short professional description…"
            ref={(r) => this.addFormItem(r, 'email')}
            validation={(v) => !!v && validator.isLength(v, {max: 300})}
          />

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
                choices={_.map(_.range(0, 20), i => ({label: i.toString()}))}
                placeholder="State"
                ref={(r) => this.addFormItem(r, 'state')}
                validation={(v) => !!v}
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

          <View style={{height: StyleSheet.hairlineWidth}} />

          <InlineTextInput
            autoCorrect={false}
            placeholder="Website"
            ref={(r) => this.addFormItem(r, 'website')}
            validation={(v) => !!v}
          />
          <View style={{height: StyleSheet.hairlineWidth}} />

          <InlineTextInput
            autoCorrect={false}
            placeholder="Phone Number"
            ref={(r) => this.addFormItem(r, 'phone')}
            validation={(v) => !!v}
          />
          <View style={{height: StyleSheet.hairlineWidth}} />

          <PageInput
            page={salonStylists}
            placeholder="Stylists"
            ref={(r) => this.addFormItem(r, 'stylist')}
            validation={(v) => true}
          />

          <View style={{height: StyleSheet.hairlineWidth}} />

          <PageInput
            page={salonSP}
            placeholder="Services &  Prices"
            ref={(r) => this.addFormItem(r, 'services')}
            validation={(v) => true}
          />

          <View style={{height: StyleSheet.hairlineWidth}} />

          <Text style={{
            marginTop: SCALE.h(35),
            marginLeft: SCALE.w(25),
            marginRight: SCALE.w(25),
            fontFamily: FONTS.MEDIUM,
            fontSize: SCALE.h(26),
            color: COLORS.TEXT
          }}>You can fill all this in later, if you’re feeling lazy.</Text>
        </KeyboardScrollView>
      </BannerErrorContainer>
    </NavigationSetting>);
  }
};
