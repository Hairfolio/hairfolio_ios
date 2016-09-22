import React from 'react';
import _ from 'lodash';
import validator from 'validator';
import {mixin} from 'core-decorators';
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

import states from '../states.json';

import {throwOnFail} from '../lib/reduxPromiseMiddleware';

import {registrationActions} from '../actions/registration';

import {salonStylists, salonSP, salonProductExperience} from '../routes';

import formMixin from '../mixins/form';

import {NAVBAR_HEIGHT} from '../constants';
import appEmitter from '../appEmitter';
import {appStack} from '../routes';

@connect(app)
@mixin(formMixin)
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
      onWillBlur={this.onWillBlur}
      onWillFocus={this.onWillFocus}
      rightAction={() => {
        if (this.checkErrors())
          return;

        this.setState({'submitting': true});
        this.props.dispatch(registrationActions.editUser(this.getFormValue()))
        .then((r) => {
          this.setState({submitting: false});
          return r;
        })
        .then(throwOnFail)
        .then(
          () => {
            appEmitter.emit('user-edited');
            _.first(this.context.navigators).jumpTo(appStack, () => this.clearValues());
          },
          (e) => {
            console.log(e);
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
                ref={(r) => this.addFormItem(r, 'business.zip')}
                validation={(v) => true}
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
            keyboardType="numeric"
            placeholder="Phone Number"
            ref={(r) => this.addFormItem(r, 'business.phone')}
            validation={(v) => true}
          />
          <View style={{height: StyleSheet.hairlineWidth}} />

          <PageInput
            page={salonStylists}
            placeholder="Stylists"
          />

          <View style={{height: StyleSheet.hairlineWidth}} />

          <PageInput
            page={salonProductExperience}
            placeholder="Products"
            ref={(r) => this.addFormItem(r, 'experience_ids')}
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
