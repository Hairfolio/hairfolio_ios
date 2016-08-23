import React from 'react';
import _ from 'lodash';
import PureComponent from '../components/PureComponent';
import {mixin} from 'core-decorators';
import {View, Text, StyleSheet} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {user} from '../selectors/user';
import {cloudinary} from '../selectors/cloudinary';
import {environment} from '../selectors/environment';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';
import validator from 'validator';

import appEmitter from '../appEmitter';

import {registrationActions} from '../actions/registration';
import {cloudinaryActions} from '../actions/cloudinary';

import {NAVBAR_HEIGHT} from '../constants';

import {loginStack, login, appStack, editCustomer} from '../routes';

import {throwOnFail} from '../lib/reduxPromiseMiddleware';

import formMixin from '../mixins/form';
import utils from '../utils';

import DeleteButton from '../components/Buttons/Delete';

import PageInput from '../components/Form/PageInput';
import ToggleInput from '../components/Form/Toggle';
import PictureInput from '../components/Form/Picture';
import ProfileTextInput from '../components/Form/ProfileTextInput';
import Categorie from '../components/Form/Categorie';
import KeyboardScrollView from '../components/KeyboardScrollView';
import BannerErrorContainer from '../components/BannerErrorContainer';

@connect(app, user, cloudinary, environment)
@mixin(formMixin)
export default class EditCustomer extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired,
    cloudinaryStates: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    environment: React.PropTypes.object.isRequired,
    environmentState: React.PropTypes.string.isRequired,
    user: React.PropTypes.object.isRequired,
    userState: React.PropTypes.string.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  state = {};

  render() {
    return (<NavigationSetting
      forceUpdateEvents={['login']}
      leftAction={() => {
        _.first(this.context.navigators).jumpTo(appStack);
      }}
      leftDisabled={this.state.submitting}
      leftIcon="back"
      style={{
        flex: 1,
        backgroundColor: COLORS.LIGHT,
        paddingTop: NAVBAR_HEIGHT
      }}
      title="Settings"
    >
      <BannerErrorContainer ref="ebc" style={{flex: 1}}>
        <KeyboardScrollView
          scrollToTopOnBlur
          showsVerticalScrollIndicator={false}
          space={90}
          style={{flex: 1}}
        >
          <View style={{
            marginTop: SCALE.h(34),
            marginBottom: SCALE.h(34),
            alignSelf: 'center'
          }}>
            <PictureInput
              disabled={utils.isLoading([this.props.environmentState, this.props.userState, this.props.cloudinaryStates.get('register-pick')])}
              onError={(error) => {
                this.refs.ebc.error(error);
              }}
              ref={(r) => this.addFormItem(r, 'avatar_cloudinary_id')}
              transform={(uri, metas) =>
                this.props.dispatch(registrationActions.getEnvironment())
                  .then(throwOnFail)
                  .then(() => this.props.dispatch(cloudinaryActions.upload(uri, metas, {maxHW: 512}, 'register-pick')))
                  .then(throwOnFail)
                  .then(({public_id}) => public_id)
              }
              validation={(v) => !!v}
            />
          </View>

          <Categorie name="BASIC" />

          <ProfileTextInput
            autoCorrect={false}
            placeholder="First name"
            ref={(r) => this.addFormItem(r, 'first_name')}
            validation={(v) => !!v && validator.isEmail(v)}
          />
          <View style={{height: StyleSheet.hairlineWidth}} />
          <ProfileTextInput
            autoCorrect={false}
            placeholder="Last name"
            ref={(r) => this.addFormItem(r, 'last_name')}
            validation={(v) => !!v && validator.isEmail(v)}
          />
          <View style={{height: StyleSheet.hairlineWidth}} />
          <ProfileTextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="Email"
            ref={(r) => this.addFormItem(r, 'email')}
            validation={(v) => !!v && validator.isEmail(v)}
          />
          <View style={{height: StyleSheet.hairlineWidth}} />
          <PageInput
            page={editCustomer}
            placeholder="Change Password"
          />

          <Categorie name="SOCIAL SHARING" />

          <ToggleInput
            placeholder="Facebook"
            ref={(r) => this.addFormItem(r, 'share_facebook')}
            validation={(v) => true}
          />
          <View style={{height: StyleSheet.hairlineWidth}} />
          <ToggleInput
            placeholder="Twitter"
            ref={(r) => this.addFormItem(r, 'share_twitter')}
            validation={(v) => true}
          />
          <View style={{height: StyleSheet.hairlineWidth}} />
          <ToggleInput
            placeholder="Instagram"
            ref={(r) => this.addFormItem(r, 'share_instagram')}
            validation={(v) => true}
          />
          <View style={{height: StyleSheet.hairlineWidth}} />
          <ToggleInput
            placeholder="Pinterest"
            ref={(r) => this.addFormItem(r, 'share_pinterest')}
            validation={(v) => true}
          />
          <View style={{height: StyleSheet.hairlineWidth}} />
          <ToggleInput
            placeholder="Tumblr"
            ref={(r) => this.addFormItem(r, 'share_tumblr')}
            validation={(v) => true}
          />

          <Categorie name="APP" />
          <ProfileTextInput
            editable={false}
            placeholder="Units"
            ref={(r) => {
              r.setValue('Metric');
            }}
          />
          <View style={{height: StyleSheet.hairlineWidth}} />

          <PageInput
            page={editCustomer}
            placeholder="Feedback"
          />
          <View style={{height: StyleSheet.hairlineWidth}} />
          <PageInput
            page={editCustomer}
            placeholder="Terms & Conditions"
          />

          <View style={{height: 30}} />
          <DeleteButton
            label="LOG OUT"
            onPress={() => {
              this.props.dispatch(registrationActions.logout());
              appEmitter.emit('logout');
              _.first(this.context.navigators).jumpTo(loginStack);
            }}
          />
          <View style={{height: 10}} />
          <DeleteButton
            label="DESTROY"
            onPress={() => {
              this.props.dispatch(registrationActions.destroy());
              appEmitter.emit('logout');
              _.first(this.context.navigators).jumpTo(loginStack);
            }}
          />
          <View style={{height: 20}} />

          <Text style={{
            textAlign: 'center',
            fontFamily: FONTS.ROMAN,
            color: COLORS.TEXT,
            fontSize: SCALE.h(28)
          }}>
            V.{this.props.appVersion}
          </Text>

          <View style={{height: 20}} />
        </KeyboardScrollView>
      </BannerErrorContainer>
    </NavigationSetting>);
  }
};