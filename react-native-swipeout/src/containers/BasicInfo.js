import { mixin } from 'core-decorators';
import _ from 'lodash';
import { observer } from 'mobx-react';
import React from 'react';
import RN, { StatusBar, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import validator from 'validator';
import whiteBack from '../../resources/img/nav_white_back.png';
import App from '../App';
import NavigatorStyles from '../common/NavigatorStyles';
import BannerErrorContainer from '../components/BannerErrorContainer';
import InlineTextInput from '../components/Form/InlineTextInput';
import PictureInput from '../components/Form/Picture';
import Icon from '../components/Icon';
import PureComponent from '../components/PureComponent';
import { showLog } from '../helpers';
import formMixin from '../mixins/form';
import CloudinaryStore from '../mobx/stores/CloudinaryStore';
import EnvironmentStore from '../mobx/stores/EnvironmentStore';
import UserStore from '../mobx/stores/UserStore';
import { COLORS, SCALE } from '../style';
import utils from '../utils';

@observer
@mixin(formMixin)
export default class BasicInfo extends PureComponent {
  static propTypes = {
    accountType: React.PropTypes.string.isRequired,
    detailFields: React.PropTypes.array.isRequired,
  };

  state = {
    f_name: null,
    l_name: null,
    salon_name: null,
    brand_name: null,
    email: null,
    pass: null
  };

  constructor(props) {
    super(props);
    StatusBar.setBarStyle('light-content');
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
        id: 'next',
        title: 'Next',
        buttonFontSize: SCALE.h(30),
        buttonColor: COLORS.WHITE,
      }
    ]
  };

  callBasicApi(value,accountType){
    UserStore.signUpWithEmail(value, accountType)
    .then(() => {
      this.clearValues();
      this._navigateToNextStep();
    })
    .catch((e) => {
      showLog(e);

      this.refs.ebc.error(e);
    });
  }

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'back') {
        this.props.navigator.pop({
          animated: true,
          animationStyle: 'fade',
        });
      } else if (event.id == 'next') {

        if (!this.checkErrors()) {
          var value = this.getFormValue();

          value['password_confirmation'] = value.password;
           
          if (value.business) {
           
            if (value.business.name.trim().length > 1) {

              if (value.password.trim().length > 1) {
                this.callBasicApi(value, this.props.accountType)
              }
              else {
                this.refs.ebc.error("Password field cannot contain blank space");
              }
            }

            else {
              if(this.props.accountType == 'salon')
              {
                this.refs.ebc.error("Salon name must contain atleast 2 letters");
              }
              else
              {
                this.refs.ebc.error("Brand name must contain atleast 2 letters");
              }
            }
          }
          else {
            value['first_name'] = value.first_name.trim()
            value['last_name'] = value.last_name.trim()

            if ((value.first_name).trim().length > 1) {
              if ((value.last_name).trim().length > 1) {

                if (value.password.trim().length > 1) {
                  this.callBasicApi(value, this.props.accountType)
                }
                else {
                  this.refs.ebc.error("Password field cannot contain blank space");
                }
              }
              else {
                this.refs.ebc.error("Last name must contain atleast 2 letters");
              }

            }
            else {
              this.refs.ebc.error("First name must contain atleast 2 letters");
            }
          }
        }
      }
    }
  }

  _navigateToNextStep = () => {
    switch (this.props.accountType) {
      case 'stylist':
        this.props.navigator.resetTo({
          screen: 'hairfolio.StylistInfo',
          animationType: 'fade',
          title: 'Professional Info',
          navigatorStyle: NavigatorStyles.basicInfo,
        });
        break;
      case 'salon':
        this.props.navigator.resetTo({
          screen: 'hairfolio.SalonInfo',
          animationType: 'fade',
          title: 'Professional Info',
          navigatorStyle: NavigatorStyles.basicInfo,
        });
        break;
      case 'brand':
        this.props.navigator.resetTo({
          screen: 'hairfolio.BrandInfo',
          animationType: 'fade',
          title: 'Professional Info',
          navigatorStyle: NavigatorStyles.basicInfo,
        });
        break;
      case 'consumer':
        App.startApplication();
        break;
      default:
        break;
    }
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
    return (
      <BannerErrorContainer style={{ flex: 1 }} ref="ebc">
        <KeyboardAwareScrollView
          scrollEnabled={false}
          scrollToTopOnBlur
          showsVerticalScrollIndicator={false}
          space={90}
          style={{ flex: 1 }}
        >
          <View style={{
            marginTop: SCALE.h(34),
            marginBottom: SCALE.h(34),
            alignSelf: 'center',
            position: 'relative'
          }}>
            <PictureInput
              disabled={utils.isLoading([EnvironmentStore.environmentState, UserStore.userState, CloudinaryStore.cloudinaryStates.get('register-pick')])}
              getPictureURIFromValue={() => { }}
              onError={(error) => {
                this.refs.ebc.error(error);
              }}
              ref={(r) => this.addFormItem(r, 'avatar_cloudinary_id')}
              transform={(uri, metas) =>
                EnvironmentStore.loadEnv()
                  .then(() => CloudinaryStore.upload(uri, metas, { maxHW: 512 }, 'register-pick','user'))
                  .then(({ public_id }) => public_id)
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

          {_.map(this.props.detailFields, ({ placeholder, ppte }, i) =>
          // showLog("PLaceholders ==> "+JSON.stringify(placeholder))
            <View key={`detailField${i}`}>
              <InlineTextInput
                autoCorrect={false}
                getRefNode={() => {
                  return RN.findNodeHandle(this.fields.password);
                }}
                maxLength={50}
                placeholder={placeholder}
                ref={(r) => this.addFormItem(r, ppte)}
                validation={(v) => !!v}
              />
              <View style={{ height: StyleSheet.hairlineWidth }} />
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
          <View style={{ height: StyleSheet.hairlineWidth }} />
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
            maxLength={16}
            validation={(v) => !!v && validator.isLength(v, { min: 6 })}
          />
        </KeyboardAwareScrollView>
      </BannerErrorContainer>
    );
  }
};
