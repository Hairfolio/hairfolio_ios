import React from 'react';
import _ from 'lodash';
import {mixin} from 'core-decorators';
import validator from 'validator';
import PureComponent from '../components/PureComponent';
import RN, {View, StyleSheet} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {COLORS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import InlineTextInput from '../components/Form/InlineTextInput';
import PictureInput from '../components/Form/Picture';
import KeyboardScrollView from '../components/KeyboardScrollView';
import BannerErrorContainer from '../components/BannerErrorContainer';
import Icon from '../components/Icon';

import {loginStack} from '../routes';

import {throwOnFail} from '../lib/reduxPromiseMiddleware';

import utils from '../utils';
import appEmitter from '../appEmitter';
import formMixin from '../mixins/form';

import {user} from '../selectors/user';
import {environment} from '../selectors/environment';
import {cloudinary} from '../selectors/cloudinary';

import {registrationActions} from '../actions/registration';
import {cloudinaryActions} from '../actions/cloudinary';

import {NAVBAR_HEIGHT} from '../constants';

@connect(app, user, environment, cloudinary)
@mixin(formMixin)
export default class BasicInfo extends PureComponent {
  static propTypes = {
    accountType: React.PropTypes.string.isRequired,
    appVersion: React.PropTypes.string.isRequired,
    cloudinaryStates: React.PropTypes.object.isRequired,
    detailFields: React.PropTypes.array.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    environment: React.PropTypes.object.isRequired,
    environmentState: React.PropTypes.string.isRequired,
    nextRoute: React.PropTypes.object,
    title: React.PropTypes.string.isRequired,
    userState: React.PropTypes.string.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  state = {};

  jumpToNext(callback) {
    if (!this.props.nextRoute)
      return callback();

    var firstNavigator = _.first(this.context.navigators);
    var lastNavigator = _.last(this.context.navigators);

    var navigator = (firstNavigator.getCurrentRoutes().indexOf(this.props.nextRoute) !== -1) ? firstNavigator : lastNavigator;

    navigator.jumpTo(this.props.nextRoute, callback);
  }

  renderAccountIcon() {
    var icon, iconColor, iconSize;
    switch (this.props.accountType) {
      case 'stylist':
        icon = 'stylist';
        iconColor = COLORS.STYLIST;
        iconSize = SCALE.h(32);
        break;
      case 'salon':
        icon = 'salon';
        iconColor = COLORS.SALON;
        iconSize = SCALE.h(18);
        break;
      case 'brand':
        icon = 'brand';
        iconColor = COLORS.BRAND;
        iconSize = SCALE.h(25);
        break;
    }

    if (!icon)
      return null;

    return (<Icon
      color={iconColor}
      name={icon}
      size={iconSize}
    />);
  }

  render() {
    return (<NavigationSetting
      leftAction={() => {
        _.first(this.context.navigators).jumpTo(loginStack);
      }}
      leftDisabled={utils.isLoading([this.props.environmentState, this.props.userState, this.props.cloudinaryStates.get('register-pick')])}
      leftIcon="back"
      onWillBlur={this.onWillBlur}
      onWillFocus={this.onWillFocus}
      rightAction={() => {
        if (!this.checkErrors()) {
          var value = this.getFormValue();
          value['password_confirmation'] = value.password;

          this.props.dispatch(registrationActions.getEnvironment()).then(throwOnFail)
            .then(() => this.props.dispatch(registrationActions.signupWithEmail(value, this.props.accountType)).then(throwOnFail))
            .then(() => {
              appEmitter.emit('login');
              this.jumpToNext(() => this.clearValues());
            }, (e) => {
              console.log(e);
              this.refs.ebc.error(e);
            });
        }
      }}
      rightDisabled={utils.isLoading([this.props.environmentState, this.props.userState, this.props.cloudinaryStates.get('register-pick')])}
      rightLabel="Next"
      style={{
        flex: 1,
        backgroundColor: COLORS.LIGHT,
        paddingTop: NAVBAR_HEIGHT
      }}
      title={this.props.title}
    >
      <BannerErrorContainer style={{flex: 1}} ref="ebc">
        <KeyboardScrollView
          scrollEnabled={false}
          scrollToTopOnBlur
          showsVerticalScrollIndicator={false}
          space={90}
          style={{flex: 1}}
        >
          <View style={{
            marginTop: SCALE.h(34),
            marginBottom: SCALE.h(34),
            alignSelf: 'center',
            position: 'relative'
          }}>
            <PictureInput
              disabled={utils.isLoading([this.props.environmentState, this.props.userState, this.props.cloudinaryStates.get('register-pick')])}
              // not used here
              // because we never setValue on this input
              getPictureURIFromValue={() => {}}
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
            {this.props.accountType !== 'consumer' ? <View style={{
              height: SCALE.h(46),
              width: SCALE.h(46),
              borderRadius: SCALE.h(23),
              backgroundColor: COLORS.WHITE,
              borderWidth: 2,
              borderColor: COLORS.LIGHT,
              position: 'absolute',
              right: 0,
              bottom: 0,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {this.renderAccountIcon()}
            </View> : null}
          </View>

          {_.map(this.props.detailFields, ({placeholder, ppte}, i) =>
            <View key={`detailField${i}`}>
              <InlineTextInput
                autoCorrect={false}
                getRefNode={() => {
                  return RN.findNodeHandle(this.fields.password);
                }}
                placeholder={placeholder}
                ref={(r) => this.addFormItem(r, ppte)}
                validation={(v) => !!v}
              />
              <View style={{height: StyleSheet.hairlineWidth}} />
            </View>
          )}

          <InlineTextInput
            autoCapitalize="none"
            autoCorrect={false}
            getRefNode={() => {
              return RN.findNodeHandle(this.fields.password);
            }}
            keyboardType="email-address"
            placeholder="Email"
            ref={(r) => this.addFormItem(r, 'email')}
            validation={(v) => !!v && validator.isEmail(v)}
          />
          <View style={{height: StyleSheet.hairlineWidth}} />
          <InlineTextInput
            autoCapitalize="none"
            autoCorrect={false}
            getRefNode={() => {
              return RN.findNodeHandle(this.fields.password);
            }}
            help="At least 6 characters"
            placeholder="Password"
            ref={(r) => this.addFormItem(r, 'password')}
            secureTextEntry
            validation={(v) => !!v && validator.isLength(v, {min: 6})}
          />
        </KeyboardScrollView>
      </BannerErrorContainer>
    </NavigationSetting>);
  }
};
