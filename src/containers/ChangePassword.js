import React from 'react';
import _ from 'lodash';
import validator from 'validator';
import {mixin} from 'core-decorators';
import PureComponent from '../components/PureComponent';
import RN, {View, Text} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import InlineTextInput from '../components/Form/InlineTextInput';
import BannerErrorContainer from '../components/BannerErrorContainer';
import KeyboardScrollView from '../components/KeyboardScrollView';
import SimpleButton from '../components/Buttons/Simple';

import {editCustomer} from '../routes';

import Categorie from '../components/Form/Categorie';


import {throwOnFail} from '../lib/reduxPromiseMiddleware';

import {registrationActions} from '../actions/registration';

import formMixin from '../mixins/form';

import {NAVBAR_HEIGHT} from '../constants';

@connect(app)
@mixin(formMixin)
export default class ForgottenPassword extends PureComponent {
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
        _.last(this.context.navigators).jumpTo(editCustomer);
      }}
      leftDisabled={this.state.submitting}
      leftIcon="back"
      onWillBlur={this.onWillBlur}
      onWillFocus={this.onWillFocus}
      style={{
        flex: 1,
        backgroundColor: COLORS.LIGHT,
        paddingTop: NAVBAR_HEIGHT
      }}
      title="Change Password"
    >
      <BannerErrorContainer ref="ebc" style={{
        flex: 1
      }}>
        <KeyboardScrollView
          scrollEnabled={false}
          scrollToTopOnBlur
          showsVerticalScrollIndicator={false}
          space={70}
          style={{flex: 1}}
        >

          <Categorie name="OLD PASSWORD" />
          <InlineTextInput
            autoCapitalize="none"
            autoCorrect={false}
            /*help="At least 6 characters"*/
            placeholder="Enter Old Password"
            ref={(r) => this.addFormItem(r, 'old_password')}
            secureTextEntry
            validation={(v) => !!v && validator.isLength(v, {min: 6})}
          />
          <Categorie name="NEW PASSWORD" />
          <InlineTextInput
            autoCapitalize="none"
            autoCorrect={false}
            getRefNode={() => {
              return RN.findNodeHandle(this.refs.submit);
            }}
            help="At least 6 characters"
            placeholder="Enter New Password"
            ref={(r) => this.addFormItem(r, 'password')}
            secureTextEntry
            validation={(v) => !!v && validator.isLength(v, {min: 6})}
          />
          <InlineTextInput
            autoCapitalize="none"
            autoCorrect={false}
            getRefNode={() => {
              return RN.findNodeHandle(this.refs.submit);
            }}
            /*help="At least 6 characters"*/
            placeholder="Confirm New Password"
            ref={(r) => this.addFormItem(r, 'password_confirmation')}
            secureTextEntry
            validation={(v) => !!v && validator.isLength(v, {min: 6})}
          />
          <View style={{height: 20}} />
          <View style={{
            marginLeft: 10,
            marginRight: 10
          }}>
            <SimpleButton
              color={COLORS.DARK}
              disabled={this.state.submitting}
              label="Save"
              onPress={() => {
                if (this.checkErrors())
                  return;

                this.setState({'submitting': true});
                this.props.dispatch(registrationActions.changePassword(this.getFormValue()))
                  .then((r) => {
                    this.setState({submitting: false});
                    return r;
                  })
                  .then(throwOnFail)
                  .then(
                    () => {
                      this.clearValues();
                      _.last(this.context.navigators).jumpTo(editCustomer);
                    },
                    (e) => {
                      console.log(e);
                      this.refs.ebc.error(e);
                    });
              }}
              ref="submit"
              rounded
            />
          </View>
        </KeyboardScrollView>
      </BannerErrorContainer>
    </NavigationSetting>);
  }
};
