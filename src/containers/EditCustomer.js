import React from 'react';
import _ from 'lodash';
import PureComponent from '../components/PureComponent';
import {mixin, autobind} from 'core-decorators';
import {View, Text, StyleSheet, InteractionManager} from 'react-native';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import {COLORS, FONTS, SCALE} from '../style';
import validator from 'validator';
import FeedStore from '../mobx/stores/FeedStore';
import UserStore from '../mobx/stores/UserStore';
import Communications from 'react-native-communications'
import EnvironmentStore from '../mobx/stores/EnvironmentStore';
import CloudinaryStore from '../mobx/stores/CloudinaryStore';
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
import whiteBack from '../../resources/img/nav_white_back.png';
import AppStore from '../mobx/stores/AppStore';

@observer
@mixin(formMixin)
export default class EditCustomer extends PureComponent {
  state = {};

  componentDidMount() {
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  static navigatorButtons = {
    leftButtons: [
      {
        id: 'cancel',
        icon: whiteBack,
      }
    ],
    rightButtons: [
      {
        id: 'save',
        title: 'Save',
        buttonFontSize: SCALE.h(30),
        buttonColor: COLORS.WHITE,
      }
    ]
  };

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'cancel') {
        this.props.navigator.pop({
          animated: true,
        });
      } else if (event.id == 'save') {
        this._save();
      }
    }
  }

  _save = () => {
    if (this.checkErrors()) {
      this.refs.ebc.error('Invalid information');
      return;
    }
    let formData = this.getFormValue();
    let business = {};
    if (UserStore.user.account_type == 'stylist') {
      formData.description = formData.business_info;
      delete formData.business_info;
    }
    for (let key in formData) {
      if (key == 'business') {
        for (let key2 in formData[key]) {
          business[key2] = formData[key][key2];
        }
      } else if (key.startsWith('business')) {
        business[key.substr(9)] = formData[key];
      }
    }
    formData['business'] = business;
    this.setState({'submitting': true});
    UserStore.editUser(formData, UserStore.user.account_type)
      .then((r) => {
        this.setState({submitting: false});
        return r;
      })
      .catch((e) => {
        this.refs.ebc.error(e);
      });
  }

  initValues() {
    var rawValues = toJS(UserStore.user);
    let business;
    let salonUserId;
    if (UserStore.user.account_type === 'ambassador') {
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
    if (UserStore.user.account_type === 'stylist') {
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
        ref={(r) => {
          this.addFormItem(r, 'business_info');
          if (r) {
            r.setValue(UserStore.user.business_info || UserStore.user.description);
          }
        }}
        validation={(v) => !v || validator.isLength(v, {max: 300})}
      />

      <View style={{height: StyleSheet.hairlineWidth}} />

      <PageInput
        page={'hairfolio.EditCustomerAddress'}
        navigator={this.props.navigator}
        placeholder="Address"
        title="Address"
        onBack={(r) => {
          this.addFormItem(r, 'business');
          if (r) {
            r.setValue(UserStore.user.business);
          }
        }}
        validation={(v) => true}
      />

      <View style={{height: StyleSheet.hairlineWidth}} />

      <InlineTextInput
        autoCorrect={false}
        keyboardType="url"
        placeholder="Website"
        ref={(r) => {
          this.addFormItem(r, 'business_website');
          if (r) {
            r.setValue(UserStore.user.business_website);
          }
        }}
        validation={(v) => true}
      />
      <View style={{height: StyleSheet.hairlineWidth}} />

      <InlineTextInput
        autoCorrect={false}
        keyboardType="numeric"
        placeholder="Phone Number"
        ref={(r) => {
          this.addFormItem(r, 'business_phone');
          if (r) {
            r.setValue(UserStore.user.business_phone);
          }
        }}
        validation={(v) => true}
      />
      <View style={{height: StyleSheet.hairlineWidth}} />

      <PageInput
        page={'hairfolio.SalonStylists'}
        placeholder="Stylists"
        title="Stylists"
        navigator={this.props.navigator}
      />

      <View style={{height: StyleSheet.hairlineWidth}} />

      <PageInput
        page={'hairfolio.StylistProductExperience'}
        placeholder="Products"
        ref={(r) => {
          this.addFormItem(r, 'experience_ids');
          if (r) {
            r.setValue(UserStore.user.experiences.map(exp => exp.id));
          }
        }}
        validation={(v) => true}
        title="Products"
        navigator={this.props.navigator}
      />

      <View style={{height: StyleSheet.hairlineWidth}} />

      <PageInput
        page={'hairfolio.SalonSP'}
        placeholder="Services &  Prices"
        title="Services &  Prices"
        navigator={this.props.navigator}
      />

      <View style={{height: StyleSheet.hairlineWidth}} />
      <MultilineTextInput
        autoCapitalize="none"
        autoCorrect={false}
        max={300}
        placeholder="Career opportunities"
        ref={(r) => {
          this.addFormItem(r, 'career_opportunity');
          if (r) {
            r.setValue(UserStore.user.career_opportunity);
          }
        }}
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
        ref={(r) => {
          this.addFormItem(r, 'business_info');
          if (r) {
            r.setValue(UserStore.user.business_info || UserStore.user.description);
          }
        }}
        validation={(v) => !v || validator.isLength(v, {max: 300})}
      />

      <View style={{height: StyleSheet.hairlineWidth}} />

      <PageInput
        page={'hairfolio.EditCustomerAddress'}
        placeholder="Address"
        ref={(r) => {
          this.addFormItem(r, 'business');
          if (r) {
            r.setValue(UserStore.user.business);
          }
        }}
        validation={(v) => true}
        title="Address"
        navigator={this.props.navigator}
      />

      <View style={{height: StyleSheet.hairlineWidth}} />

      <InlineTextInput
        autoCorrect={false}
        keyboardType="url"
        placeholder="Website"
        ref={(r) => {
          this.addFormItem(r, 'business_website');
          if (r) {
            r.setValue(UserStore.user.business_website);
          }
        }}
        validation={(v) => true}
      />
      <View style={{height: StyleSheet.hairlineWidth}} />

      <InlineTextInput
        autoCorrect={false}
        keyboardType="numeric"
        placeholder="Phone Number"
        ref={(r) => {
          this.addFormItem(r, 'business_phone');
          if (r) {
            r.setValue(UserStore.user.business_phone);
          }
        }}
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
        ref={(r) => {
          this.addFormItem(r, 'business_info');
          if (r) {
            r.setValue(UserStore.user.business_info || UserStore.user.description);
          }
        }}
        validation={(v) => !v || validator.isLength(v, {max: 300})}
      />
      <View style={{height: StyleSheet.hairlineWidth}} />
      <PickerInput
        choices={_.map(_.range(0, 46), i => ({
          label: i.toString(),
          value: i
        }))}
        placeholder="Years of experience"
        ref={(r) => {
          this.addFormItem(r, 'years_exp');
          if (r) {
            r.setValue(UserStore.user.years_exp);
          }
        }}
        validation={(v) => true}
        valueProperty="value"
      />
      <View style={{height: StyleSheet.hairlineWidth}} />
      <PageInput
        page={'hairfolio.StylistEducation'}
        placeholder="Education"
        title="Education"
        navigator={this.props.navigator}
      />
      <View style={{height: StyleSheet.hairlineWidth}} />
      <PageInput
        page={'hairfolio.StylistCertificates'}
        placeholder="Certificates"
        ref={(r) => {
          this.addFormItem(r, 'certificate_ids');
          if (r) {
            r.setValue(UserStore.user.certificates.map(cert => cert.id));
          }
        }}
        validation={(v) => true}
        title="Certificates"
        navigator={this.props.navigator}
      />
      <View style={{height: StyleSheet.hairlineWidth}} />
      <PageInput
        page={'hairfolio.StylistPlaceOfWork'}
        placeholder="Place of work"
        ref={(r) => this.addFormItem(r, 'business')}
        validation={(v) => true}
        title="Place of work"
        navigator={this.props.navigator}
      />
      <View style={{height: StyleSheet.hairlineWidth}} />
      <PageInput
        page={'hairfolio.StylistProductExperience'}
        placeholder="Product experience"
        ref={(r) => {
          this.addFormItem(r, 'experience_ids');
          if (r) {
            r.setValue(UserStore.user.experiences.map(exp => exp.id));
          }
        }}
        validation={(v) => true}
        navigator={this.props.navigator}
        title="Product Experience"
      />
      <View style={{height: StyleSheet.hairlineWidth}} />
      <PageInput
        page={'hairfolio.SalonSP'}
        placeholder="Services &  Prices"
        title="Services &  Prices"
        navigator={this.props.navigator}
      />
    </View>);
  }

  renderIndividualBasics() {
    return (<View>
      <ProfileTextInput
        autoCorrect={false}
        placeholder="First name"
        ref={(r) => {
          this.addFormItem(r, 'first_name');
          if (r) {
            r.setValue(UserStore.user.first_name);
          }
        }}
        validation={(v) => !!v}
      />
      <View style={{height: StyleSheet.hairlineWidth}} />
      <ProfileTextInput
        autoCorrect={false}
        placeholder="Last name"
        ref={(r) => {
          this.addFormItem(r, 'last_name');
          if (r) {
            r.setValue(UserStore.user.last_name);
          }
        }}
        validation={(v) => !!v}
      />
    </View>);
  }

  renderBusinessBasics() {
    return (<View>
      <ProfileTextInput
        autoCorrect={false}
        placeholder={(UserStore.user.account_type === 'ambassador') ? 'Brand' : 'Salon' + ' name'}
        ref={(r) => this.addFormItem(r, 'business_name')}
        validation={(v) => !!v}
      />
    </View>);
  }

  render() {
    var isLoading = this.state.submitting || utils.isLoading(CloudinaryStore.cloudinaryStates.get('edit-user-pick'));
    const userProfileUri = utils.getUserProfilePicURI(UserStore.user, EnvironmentStore.getEnv());
    return (
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
            backgroundColor: COLORS.LIGHT,
            alignSelf: 'center'
          }}>
            <PictureInput
              disabled={isLoading}
              emptyStatePictureURI={userProfileUri}
              getPictureURIFromValue={(value) => {
                return utils.getCloudinaryPicFromId(value, EnvironmentStore.getEnv());
              }}
              onError={(error) => {
                this.refs.ebc.error(error);
              }}
              ref={(r) => this.addFormItem(r, 'avatar_cloudinary_id')}
              transform={(uri, metas) =>
                 CloudinaryStore.upload(uri, metas, {maxHW: 512}, 'edit-user-pick')
                  .then(({public_id}) => public_id)
              }
              validation={(v) => userProfileUri || UserStore.user.instagram_id || UserStore.user.facebook_id}
            />
          </View>

          <Categorie name="BASIC" />

          {(UserStore.user.account_type === 'consumer' || UserStore.user.account_type === 'stylist') ?
            this.renderIndividualBasics() : null
          }
          {(UserStore.user.account_type === 'owner' || UserStore.user.account_type === 'ambassador') ?
            this.renderBusinessBasics() : null
          }

          <View style={{height: StyleSheet.hairlineWidth}} />
          <ProfileTextInput
            autoCapitalize="none"
            autoCorrect={false}
            editable={!UserStore.user.facebook_id && !UserStore.user.instagram_id}
            keyboardType="email-address"
            placeholder="Email"
            ref={(r) => {
              this.addFormItem(r, 'email');
              if (r) {
                r.setValue(UserStore.user.email);
              }
            }}
            validation={(v) => !!v && validator.isEmail(v)}
          />
          <View style={{height: StyleSheet.hairlineWidth}} />
          <PageInput
            page={'hairfolio.ChangePassword'}
            placeholder="Change Password"
            title="Change Password"
            navigator={this.props.navigator}
          />

          {UserStore.user.account_type === 'owner' ?
            this.renderSalonSpecifics() : null
          }

          {UserStore.user.account_type === 'ambassador' ?
            this.renderBrandSpecifics() : null
          }

          {UserStore.user.account_type === 'stylist' ?
            this.renderStylistSpecifics() : null
          }

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
              FeedStore.reset();
              UserStore.logout();
            }}
          />
          <View style={{height: 10}} />
          <DeleteButton
            label="DESTROY"
            onPress={() => {
              FeedStore.reset();
              UserStore.logout();
              UserStore.destroy();
            }}
          />
          <View style={{height: 20}} />
          <Text style={{
            textAlign: 'center',
            fontFamily: FONTS.ROMAN,
            color: COLORS.TEXT,
            fontSize: SCALE.h(28)
          }}>
            V.{AppStore.appVersion}
          </Text>
          <View style={{height: 20}} />
        </KeyboardScrollView>
      </BannerErrorContainer>
    );
  }
};
