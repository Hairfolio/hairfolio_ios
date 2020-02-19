import { mixin } from 'core-decorators';
import { observer } from 'mobx-react';
import React from 'react';
import RN, { View } from 'react-native';
import validator from 'validator';
import whiteBack from '../../resources/img/nav_white_back.png';
import NavigatorStyles from '../common/NavigatorStyles';
import BannerErrorContainer from '../components/BannerErrorContainer';
import SimpleButton from '../components/Buttons/Simple';
import Categorie from '../components/Form/Categorie';
import InlineTextInput from '../components/Form/InlineTextInput';
import KeyboardScrollView from '../components/KeyboardScrollView';
import PureComponent from '../components/PureComponent';
import formMixin from '../mixins/form';
import UserStore from '../mobx/stores/UserStore';
import { COLORS } from '../style';
import { showLog } from '../helpers';

@observer
@mixin(formMixin)
export default class ForgottenPassword extends PureComponent {
  state = {
    old_pass: null,
    new_pass: null,
    confirm_pass: null,
  };

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
  };

  onNavigatorEvent(event) {

    if (event.id == 'bottomTabSelected') {
      this.props.navigator.resetTo({
        screen: 'hairfolio.Profile',
        animationType: 'fade',
        navigatorStyle: NavigatorStyles.tab
      });
    }

    if (event.id == 'willAppear') {
      this.setFormValue({
        'old_password': '',
        'new_password': '',
        'new_password_confirmation': '',
      });
    }

    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'back') {
        this.props.navigator.pop({
          animated: true,
        });
      }
    }
  }

  hasValidPassword(input_val) {
    /* validation which do not allow space */
    var letters = /^[a-zA-Z0-9!@~`#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
    if (input_val.match(letters)) {
      return true;
    } else {
      return false;
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
        <KeyboardScrollView
          scrollEnabled={false}
          scrollToTopOnBlur
          showsVerticalScrollIndicator={false}
          space={70}
          style={{ flex: 1 }}
        >
          <Categorie name="OLD PASSWORD" />
          <InlineTextInput
            autoCapitalize="none"
            autoCorrect={false}
            /*help="At least 6 characters"*/
            placeholder="Enter Old Password"
            ref={(r) => this.addFormItem(r, 'old_password')}
            secureTextEntry
            validation={(v) => !!v && validator.isLength(v, { min: 6 })}
            value={this.state.old_pass}
            maxLength={16}
            onChangeText={(value) => {
              this.setState({
                old_pass: value
              });

            }}

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
            ref={(r) => this.addFormItem(r, 'new_password')}
            secureTextEntry
            validation={(v) => !!v && validator.isLength(v, { min: 6 })}
            value={this.state.new_pass}
            maxLength={16}
            onChangeText={(value) => {
              this.setState({
                new_pass: value
              });

            }}
          />
          <InlineTextInput
            autoCapitalize="none"
            autoCorrect={false}
            getRefNode={() => {
              return RN.findNodeHandle(this.refs.submit);
            }}
            /*help="At least 6 characters"*/
            placeholder="Confirm New Password"
            ref={(r) => this.addFormItem(r, 'new_password_confirmation')}
            secureTextEntry
            validation={(v) => !!v && validator.isLength(v, { min: 6 })}
            value={this.state.confirm_pass}
            maxLength={16}
            onChangeText={(value) => {
              this.setState({
                confirm_pass: value
              });

            }}
          />
          <View style={{ height: 20 }} />
          <View style={{
            marginLeft: 10,
            marginRight: 10
          }}>
            <SimpleButton
              color={COLORS.DARK}
              disabled={this.state.submitting}
              label="Save"
              onPress={() => {


                if (this.state.old_pass)
                  if (!this.hasValidPassword(this.state.old_pass)) {
                    alert('Old Password should not contain space');
                    return;
                  }

                if (this.state.new_pass)
                  if (!this.hasValidPassword(this.state.new_pass)) {
                    alert('New password should not contain space');
                    return;
                  }

                if (this.state.confirm_pass)
                  if (this.state.new_pass !== this.state.confirm_pass) {
                    alert('New Password and Confirm password doesnt match ');
                    return;
                  }



                if (this.checkErrors())
                  return;

                this.setState({ 'submitting': true });

                showLog("on submit ==>" + JSON.stringify(this.getFormValue()))
                UserStore.changePassword(this.getFormValue())
                  .then((r) => {
                    this.setState({ submitting: false });
                    return r;
                  })
                  .then(
                    () => {
                      this.clearValues();
                      this.props.navigator.pop({ animated: true });
                    },
                    (e) => {
                      this.refs.ebc.error(e);
                    });
              }}
              ref="submit"
              rounded
            />
          </View>
        </KeyboardScrollView>
      </BannerErrorContainer>
    );
  }
};
