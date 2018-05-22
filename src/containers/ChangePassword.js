import React from 'react';
import _ from 'lodash';
import validator from 'validator';
import {mixin} from 'core-decorators';
import PureComponent from '../components/PureComponent';
import RN, {View, Text} from 'react-native';
import {COLORS, FONTS, SCALE} from '../style';
import { observer } from 'mobx-react';
import InlineTextInput from '../components/Form/InlineTextInput';
import BannerErrorContainer from '../components/BannerErrorContainer';
import KeyboardScrollView from '../components/KeyboardScrollView';
import SimpleButton from '../components/Buttons/Simple';
import Categorie from '../components/Form/Categorie';
import UserStore from '../mobx/stores/UserStore';
import formMixin from '../mixins/form';
import whiteBack from '../../resources/img/nav_white_back.png';

@observer
@mixin(formMixin)
export default class ForgottenPassword extends PureComponent {
  state = {
    old_pass:null,
    new_pass:null,
    confirm_pass:null,
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

    if(event.id == 'willAppear'){
      this.setFormValue({
        'old_password':'123456',
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
    // alert(input_val.length)
    // var iChars = " ";
    //     for (var i = 0; i < input_val.length; i++) {
    //         if (iChars.indexOf(input_val.charAt(i)) == -1) {
    //             return false;
    //         }
    //     }
    //     return true;
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
            value={this.state.old_pass}
            onChangeText={(value) => {
              this.setState({
                old_pass:value
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
            validation={(v) => !!v && validator.isLength(v, {min: 6})}
            value={this.state.new_pass}
            onChangeText={(value) => {
              this.setState({
                new_pass:value
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
            validation={(v) => !!v && validator.isLength(v, {min: 6})}
            value={this.state.confirm_pass}
            onChangeText={(value) => {
              this.setState({
                confirm_pass:value
              });    
              
            }}
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

                
                if(this.state.old_pass)
                if(!this.hasValidPassword(this.state.old_pass)){
                  alert('Old Password should not contain space');
                  return;
                }

                if(this.state.new_pass)
                if(!this.hasValidPassword(this.state.new_pass)){
                  alert('New password should not contain space');
                  return;
                }

                if(this.state.confirm_pass)
                if(this.state.new_pass !== this.state.confirm_pass){
                  alert('New Password and Confirm password doesnt match ');
                  return;
                }

                

                if (this.checkErrors())
                  return;

                this.setState({'submitting': true});

                console.log("on submit ==>"+JSON.stringify(this.getFormValue()))
                UserStore.changePassword(this.getFormValue())
                  .then((r) => {
                    this.setState({submitting: false});
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
