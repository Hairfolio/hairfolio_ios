import { autobind, mixin } from 'core-decorators';
import _ from 'lodash';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Communications from 'react-native-communications';
import { LoginManager } from 'react-native-fbsdk';
import validator from 'validator';
import whiteBack from '../../resources/img/nav_white_back.png';
import NavigatorStyles from '../common/NavigatorStyles';
import BannerErrorContainer from '../components/BannerErrorContainer';
import DeleteButton from '../components/Buttons/Delete';
import Categorie from '../components/Form/Categorie';
import InlineTextInput from '../components/Form/InlineTextInput';
import MultilineTextInput from '../components/Form/MultilineTextInput';
import PageInput from '../components/Form/PageInput';
import PickerInput from '../components/Form/PickerInput';
import PictureInput from '../components/Form/Picture';
import ProfileTextInput from '../components/Form/ProfileTextInput';
import KeyboardScrollView from '../components/KeyboardScrollView';
import PureComponent from '../components/PureComponent';
import formMixin from '../mixins/form';
import AppStore from '../mobx/stores/AppStore';
import CloudinaryStore from '../mobx/stores/CloudinaryStore';
import EnvironmentStore from '../mobx/stores/EnvironmentStore';
import FeedStore from '../mobx/stores/FeedStore';
import UserStore from '../mobx/stores/UserStore';
import { COLORS, FONTS, SCALE } from '../style';
import utils from '../utils';
import { showLog, showAlert } from '../helpers';
import OAuthStore from '../mobx/stores/OAuthStore';


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

  setInitValue() {

    this.initValues()
  }

  onNavigatorEvent(event) {

    if (event.id == 'willAppear') {
      this.setInitValue()
    }
    if (event.id == 'didDisappear') {
    }
    if (event.id == 'bottomTabSelected') {
      this.props.navigator.resetTo({
        screen: 'hairfolio.Profile',
        animationType: 'fade',
        navigatorStyle: NavigatorStyles.tab
      });
    }
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

  _saveNew = () => {
    this.setState({ submitting: false });
    if (this.checkErrors()) {
      this.refs.ebc.error('Invalid information');
      return;
    }
    let formData = this.getFormValue();
    let business = {};


    showLog("form Data save new =>" + JSON.stringify(formData))

    UserStore.editUser(formData, UserStore.user.account_type)
      .then((r) => {
        this.setState({ submitting: false });
        return r;
      })
      .catch((e) => {
        this.setState({ submitting: false });
        this.refs.ebc.error(e);
      });
  }

  _save = () => {

    showLog("EDIT CUSTOMER JS User =>" + JSON.stringify(UserStore.user))
    
    
    this.setState({ submitting: false });
    if (this.checkErrors()) {
      this.refs.ebc.error('Invalid information');
      return;
    }

    let formData = this.getFormValue();
    showLog("form Data save =>" + JSON.stringify(formData))

     
    if(UserStore.user.salon)
    {
      showLog("IN TO SALON ADDRESS CONDITION =>" + JSON.stringify(formData))
      showLog("IN TO SALON ADDRESS USER  =>" + JSON.stringify(UserStore.user.salon))
      formData.business.name = UserStore.user.salon.name
      formData.business.address = UserStore.user.salon.address
      formData.business.city = UserStore.user.salon.city
      formData.business.state = UserStore.user.salon.state
      formData.business.zip = UserStore.user.salon.zip
      formData.business.phone = UserStore.user.salon.phone
      formData.business.website = UserStore.user.salon.website
      formData.business.id = UserStore.user.salon.id
      showLog("IN TO SALON UPDATED ADDRESS" + JSON.stringify(formData))
    }


    // showLog("form Data save =>" + JSON.stringify(formData))
    let business = {};
    if (UserStore.user.account_type == 'stylist') {
      showLog("form Data ACCOUNT TYPE STYLIST =>" + JSON.stringify(formData))
      formData.description = formData.business_info;
      delete formData.business_info;
    }
    for (let key in formData) {
      if (key == 'business') {
        showLog("form Data ACCOUNT TYPE BUSINESS =>" + JSON.stringify(formData))
        formData.business.name = formData.business_name;
        formData.business.info = formData.business_info;
        for (let key2 in formData[key]) {
          business[key2] = formData[key][key2];
        }
      } else if (key.startsWith('business')) {
        business[key.substr(9)] = formData[key];
      }
    }
    formData['business'] = business;


    // alert("EDIT CUSTOMER ==>  " + JSON.stringify(formData))

    if(formData.first_name)
    {
       if(formData.first_name.trim().length > 1)
       {
          if(formData.last_name.trim().length > 1)
          {
            this.updateData(formData, UserStore.user.account_type)
          }
          else
          {
            this.refs.ebc.error("Last name must contain atleast 2 letters");
          }
       }
       else
       {
        this.refs.ebc.error("First name must contain atleast 2 letters");
       }
    }
    else
    {
      this.updateData(formData, UserStore.user.account_type)
    }

   
  }

  updateData(formData,account_type){
    UserStore.editUser(formData,account_type)
    .then((r) => {
      this.setState({ submitting: false });
      //On successful save profile re-direct user to previous screen
      this.props.navigator.pop({ animated: true });
      return r;
    })
    .catch((e) => {
      this.setState({ submitting: false });
      this.refs.ebc.error(e);
    });
  }

  initValues() {
    var rawValues = toJS(UserStore.user);
    // var rawValues = UserStore.user;
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

      rawValues.business = {
        name: business.name,
        address: business.address,
        city: business.city,
        state: business.state,
        zip: business.zip,
        website: business.website,
        phone: business.phone,
      };
      if (salonUserId) {
        // rawValues.business['salon_user_id'] = salonUserId;
        // rawValues.salon_user_id = salonUserId;
        rawValues.business['id'] = salonUserId;
        rawValues.id = salonUserId;
      } else {
        rawValues.business['id'] = business.id;
      }
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
        }}
        validation={(v) => !v || validator.isLength(v, { max: 300 })}
      />

      <View style={{ height: StyleSheet.hairlineWidth }} />

      <PageInput
        page={'hairfolio.StylistPlaceOfWork'}
        placeholder="Address"
        ref={(r) => this.addFormItem(r, 'business')}
        validation={(v) => true}
        title="Address"
        navigator={this.props.navigator}
      />

      <View style={{ height: StyleSheet.hairlineWidth }} />

      <InlineTextInput
        autoCorrect={false}
        keyboardType="url"
        placeholder="Website"
        ref={(r) => {
          this.addFormItem(r, 'business_website');
        }}
        validation={(v) => true}
      />

      <View style={{ height: StyleSheet.hairlineWidth }} />

      <InlineTextInput
        autoCorrect={false}
        keyboardType="phone-pad"
        max={15}
        placeholder="Phone Number"
        ref={(r) => {
          this.addFormItem(r, 'business_phone');
        }}
        validation={(v) => true}
      />

      <View style={{ height: StyleSheet.hairlineWidth }} />

      <PageInput
        page={'hairfolio.SalonStylists'}
        placeholder="Stylists"
        title="Stylists"
        navigator={this.props.navigator}
      />

      <View style={{ height: StyleSheet.hairlineWidth }} />
      <PageInput
        page={'hairfolio.StylistProductExperience'}
        placeholder="Products"
        ref={(r) => {
          this.addFormItem(r, 'experience_ids');
        }}
        validation={(v) => true}
        title="Products"
        navigator={this.props.navigator}
      />

      <View style={{ height: StyleSheet.hairlineWidth }} />

      <PageInput
        page={'hairfolio.SalonSP'}
        placeholder="Services &  Prices"
        title="Services &  Prices"
        navigator={this.props.navigator}
      />

      <View style={{ height: StyleSheet.hairlineWidth }} />

      <MultilineTextInput
        autoCapitalize="none"
        autoCorrect={false}
        max={300}
        placeholder="Career opportunities"
        ref={(r) => {
          this.addFormItem(r, 'career_opportunity');
        }}
        validation={(v) => !v || validator.isLength(v, { max: 300 })}
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
        ref={(r) => { this.addFormItem(r, 'business_info'); }}
        validation={(v) => !v || validator.isLength(v, { max: 300 })}
      />

      <View style={{ height: StyleSheet.hairlineWidth }} />
      <PageInput
        page={'hairfolio.BrandAddress'}
        placeholder="Address"
        ref={(r) => this.addFormItem(r, 'business')}
        validation={(v) => true}
        title="Address"
        navigator={this.props.navigator}
      />

      <View style={{ height: StyleSheet.hairlineWidth }} />

      <InlineTextInput
        autoCorrect={false}
        keyboardType="url"
        placeholder="Website"
        ref={(r) => { this.addFormItem(r, 'business_website'); }}
        validation={(v) => true}
      />

      <View style={{ height: StyleSheet.hairlineWidth }} />
      <InlineTextInput
        autoCorrect={false}
        keyboardType="numeric"
        placeholder="Phone Number"
        ref={(r) => { this.addFormItem(r, 'business_phone'); }}
        validation={(v) => true}
      />


    </View>);
  }

  renderStylistSpecifics() {
    return (<View>
      <Categorie name="PROFESSIONAL INFORMATION" />
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
        validation={(v) => !v || validator.isLength(v, { max: 300 })}
        onChangeText={(value) => {
          if (UserStore.user.business_info) {
            UserStore.user.business_info = value;
          } else {
            UserStore.user.description = value;
          }

        }}
      />
      <View style={{ height: StyleSheet.hairlineWidth }} />
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

      <View style={{ height: StyleSheet.hairlineWidth }} />
      <PageInput
        page={'hairfolio.StylistEducation'}
        placeholder="Education"
        title="Education"
        navigator={this.props.navigator}
      />
      <View style={{ height: StyleSheet.hairlineWidth }} />
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
      <View style={{ height: StyleSheet.hairlineWidth }} />
      <PageInput
        page={'hairfolio.StylistPlaceOfWork'}
        placeholder="Place of work"
        ref={(r) => this.addFormItem(r, 'business')}
        validation={(v) => true}
        title="Place of work"
        navigator={this.props.navigator}
      />
      <View style={{ height: StyleSheet.hairlineWidth }} />
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
      <View style={{ height: StyleSheet.hairlineWidth }} />
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
        ref={(r) => this.addFormItem(r, 'first_name')}
        validation={(v) => !!v}
        maxLength={50}
      />

      <View style={{ height: StyleSheet.hairlineWidth }} />
      <ProfileTextInput
        autoCorrect={false}
        placeholder="Last name"
        ref={(r) => this.addFormItem(r, 'last_name')}
        validation={(v) => !!v}
        maxLength={50}
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
        onChangeText={(value) => {

          if (value.trim().length > 1) {
            if (UserStore.user.salon) {
              showLog("UserStore.user.salon==>" + JSON.stringify(UserStore.user.salon))
              UserStore.user.salon.name = value;
            }
            if (UserStore.user.brand) {
              showLog("UserStore.user.brand==>" + JSON.stringify(UserStore.user.brand))
              UserStore.user.brand.name = value;
            }
          }
          else
          {
            if(UserStore.user.brand)
            {
              this.refs.ebc.error("Brand name cannot be blank");
            }
            else
            {
              this.refs.ebc.error("Salon name cannot be blank"); 
            }
          }
         
        }}
      />
    </View>);
  }

  render() {
    var isLoading = this.state.submitting || utils.isLoading(CloudinaryStore.cloudinaryStates.get('edit-user-pick'));
    showLog('isLoading' + isLoading);
    showLog('FACEBOOK TOKEN ==> ' + UserStore.facebookToken);
    showLog('AUTH TOKEN ==> ' + OAuthStore.token);
    const userProfileUri = utils.getUserProfilePicURI(UserStore.user, EnvironmentStore.getEnv());
    showLog("userProfileUri ==>")
    showLog(JSON.stringify(userProfileUri))
    return (
      <BannerErrorContainer ref="ebc" style={{ flex: 1 }}>
        <KeyboardScrollView
          ref="scrollView"
          showsVerticalScrollIndicator={false}
          space={90}
          style={{ flex: 1 }}
        >
          <View style={{
            marginTop: SCALE.h(34),
            marginBottom: SCALE.h(34),
            backgroundColor: COLORS.LIGHT,
            alignSelf: 'center'
          }}>
            <PictureInput
              disabled={false}
              emptyStatePictureURI={userProfileUri}
              // getPictureURIFromValue={(value) => {
              //   showLog("value12 ==>"+JSON.stringify(value))
              //   return utils.getCloudinaryPicFromId(value, EnvironmentStore.getEnv());
              // }}
              getPictureURIFromValue={(value) => {
                showLog("value12 ==>"+JSON.stringify(value))
                return utils.getCloudinaryPicFromId(value, EnvironmentStore.getEnv());
              }}
              onError={(error) => {
                this.refs.ebc.error(error);
              }}
              ref={(r) => this.addFormItem(r, 'avatar_cloudinary_id')}
              transform={(uri, metas) =>                   
                  CloudinaryStore.upload(uri, metas, {maxHW: 512}, 'edit-user-pick','user')
                  .then(({public_id}) =>public_id)                                
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

          <View style={{ height: StyleSheet.hairlineWidth }} />
          <ProfileTextInput
            autoCapitalize="none"
            autoCorrect={false}
            editable={false}//{!UserStore.user.facebook_id && !UserStore.user.instagram_id}
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
          <View style={{ height: StyleSheet.hairlineWidth }} />
          {( UserStore.user.instagram_id || UserStore.user.facebook_id)
            ?
            null
            :
            <PageInput
            page={'hairfolio.ChangePassword'}
            placeholder="Change Password"
            title="Change Password"
            navigator={this.props.navigator}
          />

          } 

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
          <View style={{ height: StyleSheet.hairlineWidth }} />

          <PageInput
            placeholder="Feedback"
            onPress={() => {
              Communications.email(['stephen@hairfolioapp.com'], null, null, 'Feedback', '');
            }}
          />
          <View style={{ height: StyleSheet.hairlineWidth }} />
          <PageInput
            onPress={
              () => {
                Communications.web('http://hairfolioapp.com/terms-conditions/')
              }
            }
            placeholder="Terms & Conditions"
          />

          <View style={{ height: 30 }} />
          <DeleteButton
            label="LOG OUT"
            onPress={() => {

              Alert.alert(
                'Hairfolio',
                'Do you really want to logout ?', [{
                  text: 'Yes',
                  onPress: () => {
                    LoginManager.logOut();
                    FeedStore.reset();
                    UserStore.logout();
                    OAuthStore.reset();
                  }
                }, {
                  text: 'No',
                  onPress: () => {

                  }
                }], {
                  cancelable: false
                }
              )
            }}
          />
          <View style={{ height: 10 }} />
          <DeleteButton
            label="DESTROY"
            onPress={() => {

              Alert.alert(
                'Hairfolio',
                'Do you really want to destroy account ?', [{
                  text: 'Yes',
                  onPress: () => {

                    UserStore.destroy(UserStore.user.id).then((success) => {
                      if(success && success.error){
                        showAlert(success.error)
                      } else {
                        FeedStore.reset();
                        LoginManager.logOut();
                        OAuthStore.reset();
                      }
                    }, (error) => {
                      showLog("error => " + JSON.stringify(error))
                    })                    
                  }
                }, {
                  text: 'No',
                  onPress: () => {

                  }
                }], {
                  cancelable: false
                }
              )

            }}
          />
          <View style={{ height: 20 }} />
          <Text style={{
            textAlign: 'center',
            fontFamily: FONTS.ROMAN,
            color: COLORS.TEXT,
            fontSize: SCALE.h(28)
          }}>
            V.{AppStore.appVersion}
          </Text>
          <View style={{ height: 20 }} />
        </KeyboardScrollView>
      </BannerErrorContainer>
    );
  }
};
