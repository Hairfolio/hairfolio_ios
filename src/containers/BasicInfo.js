import React from 'react';
import _ from 'lodash';
import {mixin} from 'core-decorators';
import { observer } from 'mobx-react';
import validator from 'validator';
import PureComponent from '../components/PureComponent';
import RN, {View, StyleSheet} from 'react-native';
import {COLORS, SCALE} from '../style';
import InlineTextInput from '../components/Form/InlineTextInput';
import PictureInput from '../components/Form/Picture';
import KeyboardScrollView from '../components/KeyboardScrollView';
import BannerErrorContainer from '../components/BannerErrorContainer';
import Icon from '../components/Icon';
import utils from '../utils';
import formMixin from '../mixins/form';
import UserStore from '../mobx/stores/UserStore';
import EnvironmentStore from '../mobx/stores/EnvironmentStore';
import CloudinaryStore from '../mobx/stores/CloudinaryStore';
import whiteBack from '../../resources/img/nav_white_back.png';
import NavigatorStyles from '../common/NavigatorStyles';

@observer
@mixin(formMixin)
export default class BasicInfo extends PureComponent {
  static propTypes = {
    accountType: React.PropTypes.string.isRequired,
    detailFields: React.PropTypes.array.isRequired,
  };

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
        id: 'next',
        title: 'Next',
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
          animationStyle: 'fade',
        });
      } else if (event.id == 'next') {
        if (!this.checkErrors()) {
          var value = this.getFormValue();
          value['password_confirmation'] = value.password;
          UserStore.signUpWithEmail(value, this.props.accountType)
            .then(() => {
              this.clearValues();
              this._navigateToNextStep();
            })
            .catch((e) => {
              console.log(e);
              this.refs.ebc.error(e);
            });
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
              disabled={utils.isLoading([EnvironmentStore.environmentState, UserStore.userState, CloudinaryStore.cloudinaryStates.get('register-pick')])}
              getPictureURIFromValue={() => {}}
              onError={(error) => {
                this.refs.ebc.error(error);
              }}
              ref={(r) => this.addFormItem(r, 'avatar_cloudinary_id')}
              transform={(uri, metas) =>
                EnvironmentStore.loadEnv()
                  .then(() => CloudinaryStore.upload(uri, metas, {maxHW: 512}, 'register-pick'))
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
    );
  }
};
