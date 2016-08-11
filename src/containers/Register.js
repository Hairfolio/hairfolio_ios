import React from 'react';
import _ from 'lodash';
import PureComponent from '../components/PureComponent';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {COLORS, FONTS} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import FormButton from '../components/Buttons/Form';
import TextInput from '../components/Form/TextInput';
import KeyboardScrollView from '../components/KeyboardScrollView';
import KeyboardPaddingView from '../components/KeyboardPaddingView';

import {login, hello} from '../routes';

import {Dims} from '../constants';

@connect(app)
export default class Register extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  render() {
    return (<NavigationSetting
      leftAction={() => {
        _.first(this.context.navigators).jumpTo(hello);
      }}
      leftIcon="back_arrow"
      onWillBlur={this.onWillBlur}
      onWillFocus={this.onWillFocus}
      style={{
        flex: 1,
        backgroundColor: COLORS.PRIMARY.BLUE
      }}
    >
      <KeyboardPaddingView
        style={{flex: 1}}
      >
        <KeyboardScrollView
          scrollEnabled={false}
          scrollToTopOnBlur
          showsVerticalScrollIndicator={false}
          space={Platform.OS === 'ios' ? 60 : 90}
          style={{flex: 1}}
        >
          <View style={{
            height: Dims.deviceHeight,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <View style={{
              height: 368
            }}>
              <Text style={{
                fontFamily: FONTS.REGULAR,
                color: COLORS.PRIMARY.WHITE,
                fontSize: 16.2,
                textAlign: 'center',
                marginBottom: 17
              }}>REGISTRATION</Text>
              <View style={{
                borderRadius: 14,
                backgroundColor: COLORS.PRIMARY.WHITE,
                paddingTop: 4,
                paddingBottom: 4,
                width: 273
              }}>
                <View style={{
                  paddingLeft: 15,
                  paddingRight: 15
                }}>
                  <TextInput
                    icon="registration_name_icon"
                    placeholder="Name"
                  />
                </View>
                <View style={{height: 1, backgroundColor: COLORS.LIGHT}}/>
                <View style={{
                  paddingLeft: 15,
                  paddingRight: 15
                }}>
                  <TextInput
                    icon="modal_medical_adherence_icon"
                    placeholder="Prescription  Number"
                  />
                </View>
                <View style={{height: 1, backgroundColor: COLORS.LIGHT}}/>
                <View style={{
                  paddingLeft: 15,
                  paddingRight: 15
                }}>
                  <TextInput
                    icon="log_in_email_address_icon"
                    placeholder="Email Address"
                  />
                </View>
                <View style={{height: 1, backgroundColor: COLORS.LIGHT}}/>
                <View style={{
                  paddingLeft: 15,
                  paddingRight: 15
                }}>
                  <TextInput
                    icon="registration_create_password_icon"
                    placeholder="Create a Password"
                  />
                </View>
                <View style={{
                  paddingLeft: 4,
                  paddingRight: 4
                }}>
                  <FormButton
                    label="SIGN UP"
                    onPress={() => {

                    }}
                  />
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  _.last(this.context.navigators).jumpTo(login);
                }}
                style={{marginTop: 24}}
              >
                <Text style={{
                  fontFamily: FONTS.REGULAR,
                  fontSize: 12.8,
                  color: COLORS.PRIMARY.WHITE,
                  textAlign: 'center'
                }}>Aready Registered? <Text style={{fontFamily: FONTS.BOLD}}>Log in</Text>.</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardScrollView>
      </KeyboardPaddingView>
    </NavigationSetting>);
  }
};
