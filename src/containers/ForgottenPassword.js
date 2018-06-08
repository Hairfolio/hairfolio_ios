import React from 'react';
import _ from 'lodash';
import validator from 'validator';
import {mixin} from 'core-decorators';
import PureComponent from '../components/PureComponent';
import {View, Text} from 'react-native';
import {COLORS, FONTS, SCALE} from '../style';
import { observer } from 'mobx-react';
import InlineTextInput from '../components/Form/InlineTextInput';
import BannerErrorContainer from '../components/BannerErrorContainer';
import UserStore from '../mobx/stores/UserStore';
import formMixin from '../mixins/form';
import whiteBack from '../../resources/img/nav_white_back.png';

@observer
@mixin(formMixin)
export default class ForgottenPassword extends PureComponent {
  state = {};

  constructor(props) {
    super(props);
    if (this.props.navigator) {
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }
  }

  static navigatorButtons = {
    leftButtons: [
      {
        id: 'back',
        icon: whiteBack,
      }
    ],
    rightButtons: [
      {
        id: 'send',
        title: 'Send',
        buttonFontSize: SCALE.h(30),
        buttonColor: COLORS.WHITE,
      }
    ]
  };

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'back') {
        this.props.navigator.pop({
          animated: true,
        });
      } else if (event.id == 'send') {
        if (this.checkErrors())
          return;
        this.setState({'submitting': true});
        UserStore.forgotPassword(this.getFormValue().email)
        .then((r) => {
          this.clearValues();
          this.setState({submitting: false});
          return r;
        })
        .then(
          (k) => {
            if(k.status == "422" || k.status == 422){
              this.refs.ebc.error(k.errors);
            }else{
              this.setState({success: true});
            setTimeout(() => {
              this.setState({success: false});
            }, 3000);

            }
            
          },
          (e) => {
            this.refs.ebc.error(e);
          }
          );
      }
    }
  }

  render() {
    return (
      <BannerErrorContainer
        ref="ebc"
        style={{
          flex: 1,
          backgroundColor: COLORS.LIGHT,
        }}
      >
        <View style={{
          height: SCALE.h(34)
        }} />

        {this.state.success ?
          <View style={{
            height: SCALE.h(80),
            justifyContent: 'center',
            backgroundColor: COLORS.WHITE
          }}>
            <Text style={{
              fontFamily: FONTS.MEDIUM,
              color: COLORS.DARK,
              textAlign: 'center'
            }}>Success !</Text>
          </View>
        :
          <InlineTextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="Email"
            ref={(r) => this.addFormItem(r, 'email')}
            validation={(v) => !!v && validator.isEmail(v)}
          />
        }
        <Text
          style={{
            marginTop: SCALE.h(35),
            marginLeft: SCALE.w(25),
            marginRight: SCALE.w(25),
            fontFamily: FONTS.MEDIUM,
            fontSize: SCALE.h(26),
            color: COLORS.TEXT
          }}
        >
          An email with information on how to reset your password will be sent to you
        </Text>
      </BannerErrorContainer>
    );
  }
};
