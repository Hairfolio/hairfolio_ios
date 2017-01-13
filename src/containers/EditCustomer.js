import React from 'react';
import _ from 'lodash';
import PureComponent from '../components/PureComponent';
import {mixin, autobind} from 'core-decorators';
import {View, Text, StyleSheet, InteractionManager} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {user} from '../selectors/user';
import {cloudinary} from '../selectors/cloudinary';
import {environment} from '../selectors/environment';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';
import validator from 'validator';

import Communications from 'react-native-communications'

import appEmitter from '../appEmitter';

import {registrationActions} from '../actions/registration';
import {cloudinaryActions} from '../actions/cloudinary';

import {NAVBAR_HEIGHT} from '../constants';

import {loginStack, appStack, changePassword, salonStylistsEU, salonSPEU, editCustomerAddress, stylistCertificatesEU, stylistPlaceOfWorkEU, stylistProductExperienceEU, stylistEducationEU, salonProductExperienceEU} from '../routes';

import {throwOnFail} from '../lib/reduxPromiseMiddleware';

import formMixin from '../mixins/form';
import utils from '../utils';

import DeleteButton from '../components/Buttons/Delete';

import MultilineTextInput from '../components/Form/MultilineTextInput';
import PickerInput from '../components/Form/PickerInput';
import InlineTextInput from '../components/Form/InlineTextInput';
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

  componentWillMount() {
    this.listeners = [
      appEmitter.addListener('login', this.onLogin),
      appEmitter.addListener('user-edited', (page) => {
        if (page !== 'edit-page')
          this.onLogin();
      })
    ];
  }

  componentDidMount() {
    if (utils.isReady(this.props.userState))
      this.onLogin();
  }

  componentWillUnmount() {
    _.each(this.listeners, l => l.remove());
  }

  initValues() {
    var rawValues = {...this.props.user.toJS()};


    let business;
    let salonUserId;
    if (this.props.user.get('account_type') === 'ambassador') {
      business = rawValues.brand;
    } else {
      business = rawValues.salon;
      if (business != null) {
        salonUserId = business.id;
      }
    }


    if (business != null) {
      rawValues.business_info = business.info;
      rawValues.business_name = business.name;
      rawValues.business_address = business.address;
      rawValues.business_city = business.city;
      rawValues.business_state = business.state;
      rawValues.business_zip = business.zip;
      rawValues.business_website = business.website;
      rawValues.business_phone = business.phone;
      rawValues.salon_user_id = salonUserId;


      rawValues.business = {
        name: business.name,
        address: business.address,
        city: business.city,
        state: business.state,
        zip: business.zip,
        website: business.website,
        phone: business.phone,
        'salon_user_id': salonUserId
      };
    }


    if (this.props.user.get('account_type') === 'stylist') {
      rawValues.business_info = rawValues.description;
    }

    rawValues['certificate_ids'] = _.map(rawValues.certificates, 'id');
    rawValues['experience_ids'] = _.map(rawValues.experiences, 'id');

    this.setFormValue(rawValues);
  }

  @autobind
  onLogin() {
    this.refs.scrollView.scrollToTop();
    this.onFormReady(() => this.initValues());
  }

  renderSalonSpecifics() {
    return (<View>
      <Categorie name="SALON INFORMATION" />

      <MultilineTextInput
        autoCapitalize="none"
        autoCorrect={false}
        max={300}
        placeholder="Short professional description…"
        ref={(r) => this.addFormItem(r, 'business_info')}
        validation={(v) => !v || validator.isLength(v, {max: 300})}
      />

      <View style={{height: StyleSheet.hairlineWidth}} />

      <PageInput
        page={editCustomerAddress}
        placeholder="Address"
        ref={(r) => this.addFormItem(r, 'business')}
        validation={(v) => true}
      />

      <View style={{height: StyleSheet.hairlineWidth}} />

      <InlineTextInput
        autoCorrect={false}
        keyboardType="url"
        placeholder="Website"
        ref={(r) => this.addFormItem(r, 'business_website')}
        validation={(v) => true}
      />
      <View style={{height: StyleSheet.hairlineWidth}} />

      <InlineTextInput
        autoCorrect={false}
        keyboardType="numeric"
        placeholder="Phone Number"
        ref={(r) => this.addFormItem(r, 'business_phone')}
        validation={(v) => true}
      />
      <View style={{height: StyleSheet.hairlineWidth}} />

      <PageInput
        page={salonStylistsEU}
        placeholder="Stylists"
      />

      <View style={{height: StyleSheet.hairlineWidth}} />

      <PageInput
        page={salonProductExperienceEU}
        placeholder="Products"
        ref={(r) => this.addFormItem(r, 'experience_ids')}
        validation={(v) => true}
      />

      <View style={{height: StyleSheet.hairlineWidth}} />

      <PageInput
        page={salonSPEU}
        placeholder="Services &  Prices"
      />

      <View style={{height: StyleSheet.hairlineWidth}} />
      <MultilineTextInput
        autoCapitalize="none"
        autoCorrect={false}
        max={300}
        placeholder="Career opportunities"
        ref={(r) => this.addFormItem(r, 'career_opportunity')}
        validation={(v) => !v || validator.isLength(v, {max: 300})}
      />
    </View>);
  }

  renderBrandSpecifics() {
    return (<View>
      <Categorie name="BRAND INFORMATION" />

      <MultilineTextInput
        autoCapitalize="none"
        autoCorrect={false}
        max={300}
        placeholder="Short professional description…"
        ref={(r) => this.addFormItem(r, 'business_info')}
        validation={(v) => !v || validator.isLength(v, {max: 300})}
      />

      <View style={{height: StyleSheet.hairlineWidth}} />

      <PageInput
        page={editCustomerAddress}
        placeholder="Address"
        ref={(r) => this.addFormItem(r, 'business')}
        validation={(v) => true}
      />

      <View style={{height: StyleSheet.hairlineWidth}} />

      <InlineTextInput
        autoCorrect={false}
        keyboardType="url"
        placeholder="Website"
        ref={(r) => this.addFormItem(r, 'business_website')}
        validation={(v) => true}
      />
      <View style={{height: StyleSheet.hairlineWidth}} />

      <InlineTextInput
        autoCorrect={false}
        keyboardType="numeric"
        placeholder="Phone Number"
        ref={(r) => this.addFormItem(r, 'business_phone')}
        validation={(v) => true}
      />
    </View>);
  }

  renderStylistSpecifics() {
    return (<View>
      <Categorie name="BRAND INFORMATION" />

      <MultilineTextInput
        autoCapitalize="none"
        autoCorrect={false}
        max={300}
        placeholder="Short professional description…"
        ref={(r) => this.addFormItem(r, 'business_info')}
        validation={(v) => !v || validator.isLength(v, {max: 300})}
      />

      <View style={{height: StyleSheet.hairlineWidth}} />

      <PickerInput
        choices={_.map(_.range(0, 46), i => ({
          label: i.toString(),
          value: i
        }))}
        placeholder="Years of experience"
        ref={(r) => this.addFormItem(r, 'years_exp')}
        validation={(v) => true}
        valueProperty="value"
      />

      <View style={{height: StyleSheet.hairlineWidth}} />

      <PageInput
        page={stylistEducationEU}
        placeholder="Education"
      />

      <View style={{height: StyleSheet.hairlineWidth}} />

      <PageInput
        page={stylistCertificatesEU}
        placeholder="Certificates"
        ref={(r) => this.addFormItem(r, 'certificate_ids')}
        validation={(v) => true}
      />

      <View style={{height: StyleSheet.hairlineWidth}} />

      <PageInput
        page={stylistPlaceOfWorkEU}
        placeholder="Place of work"
        ref={(r) => this.addFormItem(r, 'business')}
        validation={(v) => true}
      />

      <View style={{height: StyleSheet.hairlineWidth}} />

      <PageInput
        page={stylistProductExperienceEU}
        placeholder="Product experience"
        ref={(r) => this.addFormItem(r, 'experience_ids')}
        validation={(v) => true}
      />

      <View style={{height: StyleSheet.hairlineWidth}} />

      <PageInput
        page={salonSPEU}
        placeholder="Services &  Prices"
      />
    </View>);
  }

  renderIndividualBasics() {
    return (<View>
      <ProfileTextInput
        autoCorrect={false}
        placeholder="First name"
        ref={(r) => this.addFormItem(r, 'first_name')}
        validation={(v) => !!v}
      />
      <View style={{height: StyleSheet.hairlineWidth}} />
      <ProfileTextInput
        autoCorrect={false}
        placeholder="Last name"
        ref={(r) => this.addFormItem(r, 'last_name')}
        validation={(v) => !!v}
      />
    </View>);
  }

  renderBusinessBasics() {
    return (<View>
      <ProfileTextInput
        autoCorrect={false}
        placeholder={(this.props.user.get('account_type' === 'ambassador') ? 'Brand' : 'Salon') + ' name'}
        ref={(r) => this.addFormItem(r, 'business_name')}
        validation={(v) => !!v}
      />
    </View>);
  }

  render() {
    var isLoading = this.state.submitting || utils.isLoading([this.props.cloudinaryStates.get('edit-user-pick')]);

    return (<NavigationSetting
      forceUpdateEvents={['login', 'user-edited']}
      leftAction={() => {
        this.initValues();
        _.first(this.context.navigators).jumpTo(appStack);
      }}
      leftDisabled={isLoading}
      leftIcon="back"
      onWillFocus={this.onWillFocus}
      rightAction={() => {
        if (this.checkErrors())
          return;

        let formData = this.getFormValue();

        let business = {};

        if (this.props.user.get('account_type') == 'stylist') {
          formData.description = formData.business_info;
          delete formData.business_info;
        }

        for (let key in formData) {
          // console.log('key', key);

          if (key == 'business') {
            for (let key2 in formData[key]) {
              business[key2] = formData[key][key2];
            }
          } else if (key.startsWith('business')) {
            // console.log('key set', key);
            business[key.substr(9)] = formData[key];
          }
        }

        // console.log('business', business);
        formData['business'] = business;

        this.setState({'submitting': true});
        this.props.dispatch(registrationActions.editUser(formData, this.props.user.get('account_type')))
        .then((r) => {
          this.setState({submitting: false});
          return r;
        })
        .then(throwOnFail)
        .then(
          () => {
            appEmitter.emit('user-edited', 'edit-page');
          },
          (e) => {
            console.log(e);
            this.refs.ebc.error(e);
          }
        );
      }}
      rightDisabled={isLoading}
      rightLabel="Save"
      style={{
        flex: 1,
        backgroundColor: COLORS.LIGHT,
        paddingTop: NAVBAR_HEIGHT
      }}
      title="Settings"
    >
      <BannerErrorContainer ref="ebc" style={{flex: 1}}>
        <KeyboardScrollView
          ref="scrollView"
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
              disabled={isLoading}
              emptyStatePictureURI={utils.getUserProfilePicURI(this.props.user, this.props.environment)}
              getPictureURIFromValue={(value) => {
                return utils.getCloudinaryPicFromId(value, this.props.environment);
              }}
              onError={(error) => {
                this.refs.ebc.error(error);
              }}
              ref={(r) => this.addFormItem(r, 'avatar_cloudinary_id')}
              transform={(uri, metas) =>
                this.props.dispatch(registrationActions.getEnvironment())
                  .then(throwOnFail)
                  .then(() => this.props.dispatch(cloudinaryActions.upload(uri, metas, {maxHW: 512}, 'edit-user-pick')))
                  .then(throwOnFail)
                  .then(({public_id}) => public_id)
              }
              validation={(v) => !!v || this.props.user.get('instagram_id') || this.props.user.get('facebook_id')}
            />
          </View>

          <Categorie name="BASIC" />

          {(this.props.user.get('account_type') === 'consumer' || this.props.user.get('account_type') === 'stylist') ?
            this.renderIndividualBasics() : null
          }
          {(this.props.user.get('account_type') === 'owner' || this.props.user.get('account_type') === 'ambassador') ?
            this.renderBusinessBasics() : null
          }

          <View style={{height: StyleSheet.hairlineWidth}} />
          <ProfileTextInput
            autoCapitalize="none"
            autoCorrect={false}
            editable={!this.props.user.get('facebook_id') && !this.props.user.get('instagram_id')}
            keyboardType="email-address"
            placeholder="Email"
            ref={(r) => this.addFormItem(r, 'email')}
            validation={(v) => !!v && validator.isEmail(v)}
          />
          <View style={{height: StyleSheet.hairlineWidth}} />
          <PageInput
            page={changePassword}
            placeholder="Change Password"
          />

          {this.props.user.get('account_type') === 'owner' ?
            this.renderSalonSpecifics() : null
          }

          {this.props.user.get('account_type') === 'ambassador' ?
            this.renderBrandSpecifics() : null
          }

          {this.props.user.get('account_type') === 'stylist' ?
            this.renderStylistSpecifics() : null
          }

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
              if (r)
                r.setValue('Metric');
            }}
          />
          <View style={{height: StyleSheet.hairlineWidth}} />

          <PageInput
            placeholder="Feedback"
            onPress={() => {
              Communications.email(['stephen@hairfolioapp.com'], null, null, 'Feedback', '');
            }}
          />
          <View style={{height: StyleSheet.hairlineWidth}} />
          <PageInput
            onPress={
              () => {
                Communications.web('http://hairfolioapp.com/terms-conditions/')
              }
            }
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
              appEmitter.emit('logout', {destroy: true});
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
