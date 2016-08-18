import React from 'react';
import _ from 'lodash';
import reactMixin from 'react-mixin';
import PureComponent from '../../components/PureComponent';
import RN, {View, StyleSheet} from 'react-native';
import connect from '../../lib/connect';
import {app} from '../../selectors/app';
import {COLORS, SCALE} from '../../style';
import NavigationSetting from '../../navigation/NavigationSetting';

import InlineTextInput from '../../components/Form/InlineTextInput';
import PictureInput from '../../components/Form/Picture';
import KeyboardScrollView from '../../components/KeyboardScrollView';
import BannerErrorContainer from '../../components/BannerErrorContainer';

import {loginStack, appStack} from '../../routes';

import {throwOnFail} from '../../lib/reduxPromiseMiddleware';

import formMixin from '../../mixins/form';

import {user} from '../../selectors/user';
import {environment} from '../../selectors/environment';

import {registrationActions} from '../../actions/registration';

import {NAVBAR_HEIGHT} from '../../constants';

@connect(app, user, environment)
@reactMixin.decorate(formMixin)
export default class BasicInfoConsumer extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    environment: React.PropTypes.object.isRequired,
    environmentState: React.PropTypes.string.isRequired,
    userState: React.PropTypes.string.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  state = {};

  render() {
    return (<NavigationSetting
      leftAction={() => {
        _.first(this.context.navigators).jumpTo(loginStack);
      }}
      leftIcon="back"
      onWillBlur={this.onWillBlur}
      onWillFocus={this.onWillFocus}
      rightAction={() => {
        if (!this.checkErrors()) {
          var value = this.getFormValue();
          value['password_confirmation'] = value.password;

          this.props.dispatch(registrationActions.getEnvironment()).then(throwOnFail)
            .then(() => this.props.dispatch(registrationActions.signupWithEmail(value, 'consumer')).then(throwOnFail))
            .then(() => {
              //_.first(this.context.navigators).jumpTo(appStack);
            }, (e) => {
              console.log(e);
              this.refs.ebc.error('Signup failed');
            });
        }
      }}
      rightLabel="Next"
      style={{
        flex: 1,
        backgroundColor: COLORS.LIGHT,
        paddingTop: NAVBAR_HEIGHT
      }}
      title="Consumer Account"
    >
      <BannerErrorContainer ref="ebc">
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
            alignSelf: 'center'
          }}>
            <PictureInput
              onError={(error) => {
                this.refs.ebc.error(error);
              }}
              ref={(r) => this.addFormItem(r, 'avatar_cloudinary_id')}
              validation={(v) => !!v}
            />
          </View>
          <InlineTextInput
            getRefNode={() => {
              return RN.findNodeHandle(this.fields.password);
            }}
            placeholder="First Name"
            ref={(r) => this.addFormItem(r, 'first_name')}
            validation={(v) => !!v}
          />
          <View style={{height: StyleSheet.hairlineWidth}} />
          <InlineTextInput
            getRefNode={() => {
              return RN.findNodeHandle(this.fields.password);
            }}
            placeholder="Last Name"
            ref={(r) => this.addFormItem(r, 'last_name')}
            validation={(v) => !!v}
          />
          <View style={{height: StyleSheet.hairlineWidth}} />
          <InlineTextInput
            getRefNode={() => {
              return RN.findNodeHandle(this.fields.password);
            }}
            placeholder="Email"
            ref={(r) => this.addFormItem(r, 'email')}
            validation={(v) => !!v}
          />
          <View style={{height: StyleSheet.hairlineWidth}} />
          <InlineTextInput
            getRefNode={() => {
              return RN.findNodeHandle(this.fields.password);
            }}
            help="At least 6 characters"
            placeholder="Password"
            ref={(r) => this.addFormItem(r, 'password')}
            validation={(v) => v && v.length >= 6}
          />
        </KeyboardScrollView>
      </BannerErrorContainer>
    </NavigationSetting>);
  }
};
