import { debounce, mixin } from 'core-decorators';
import _ from 'lodash';
import { observer } from 'mobx-react';
import React from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import whiteBack from '../../resources/img/nav_white_back.png';
import ServiceBackend from '../backend/ServiceBackend';
import NavigatorStyles from '../common/NavigatorStyles';
import BannerErrorContainer from '../components/BannerErrorContainer';
import HiddenInput from '../components/Form/HiddenInput';
import InlineTextInput from '../components/Form/InlineTextInput';
import MultilineTextInput from '../components/Form/MultilineTextInput';
import PickerInput from '../components/Form/PickerInput';
import KeyboardScrollView from '../components/KeyboardScrollView';
import LoadingContainer from '../components/LoadingContainer';
import { LOADING, LOADING_ERROR, READY } from '../constants';
import formMixin from '../mixins/form';
import UserStore from '../mobx/stores/UserStore';
import states from '../states.json';
import { COLORS, FONTS, SCALE } from '../style';
import { showLog, showAlert, windowHeight, windowWidth } from '../helpers';

@observer
@mixin(formMixin)
export default class StylistPlaceOfWork extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      autocompleteState: READY,
      isLoading: false,
      selected: {}
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentDidMount() {
    this.loadForm();
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
        id: 'done',
        title: 'Done',
        buttonFontSize: SCALE.h(30),
        buttonColor: COLORS.WHITE,
      }
    ],
  }

  onNavigatorEvent(event) {
    if (event.id == 'bottomTabSelected') {
      // this.props.navigator.pop({animated: true})
      this.props.navigator.resetTo({
        screen: 'hairfolio.Profile',
        animationType: 'fade',
        navigatorStyle: NavigatorStyles.tab
      });
    }
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'back') {
        this.props.navigator.pop({
          animated: true,
          animationStyle: 'fade',
        })
      }
      if (event.id == 'done') {

          var currentUser = UserStore.user;
        showLog("user ==>" + JSON.stringify(UserStore.user));
        // showAlert("user ==>" + JSON.stringify(UserStore.user));
        if (this.state.selected) {          
          if(currentUser.salon){
            this.state.selected['info'] = currentUser.salon.info;
          }
          showLog("state ==>"+JSON.stringify(this.state.selected))
          
          const formData = { salon_attributes: this.state.selected };
         
          showLog("BEFORE PLACE OF WORK UPDATED ==> " + JSON.stringify(formData));
         
          UserStore.editUser(formData, UserStore.user.account_type)
          .then((res) => {
            showLog("salon updated ==> " + JSON.stringify(res));
            })
            .catch((e) => {
              this.refs.ebc.error(e);
            });
        }

        this.props.navigator.pop({
          animated: true,
          animationStyle: 'fade',
        })
        
        
      }
    }
  }

  getValue() {
    var value = this.getFormValue();
    return !_.isEmpty(value) ? value : null;
  }

  setValue(value = {}) {
    if (value == null) {
      value = {};
    }

    this.setFormValue({
      ...value,
      // 'salon_user_id': value.salon_user_id || -1
      'id': value.salon_user_id || -1
    });
    this.setState({
      // selected: value.salon_user_id
      selected: value.id
    });
  }

  clear() {
    this.clearValues();
  }

  @debounce
  fetchAutocompleteList(value) {
    this.lastValue = value;
    if (!value)
      return this.setState({ autocompleteList: [] });
    this.setState({ autocompleteState: LOADING });
    ServiceBackend.get(`users?account_type=owner&q=${value/*.toLowerCase()*/}`)
      .then((autocompleteList) => {
        this.setState({
          autocompleteState: READY,
          autocompleteList: this.lastValue ? autocompleteList.users : []
        });
      }, () => {
        this.setState({ autocompleteState: LOADING_ERROR });
      });
  }

  loadForm = () => {
    this.setState({ isLoading: true });
    ServiceBackend.get(`users/${UserStore.user.id}`)
      .then((response) => {
        let user = response.user;
        showLog("user==>" + JSON.stringify(user));
        if (user.salon) {
          this.setFormValue({
            name: user.salon.name,
            // 'salon_user_id': user.salon.id,
            'id': user.salon.id,
            address: user.salon.address,
            city: user.salon.city,
            state: user.salon.state,
            zip: user.salon.zip,
            website: user.salon.website,
            phone: user.salon.phone,
          });
          var temp = {
            name: user.salon.name,
            // 'salon_user_id': user.salon.id,
            'id': user.salon.id,
            address: user.salon.address,
            city: user.salon.city,
            state: user.salon.state,
            zip: user.salon.zip,
            website: user.salon.website,
            phone: user.salon.phone,
          };
          this.setState({
            selected: temp,
            isLoading: false
          })
        }
        else {
          this.setState({
            selected: null,
            isLoading: false
          })
        }
      }).catch((e) => {
        this.refs.ebc.error(e);
        this.setState({ isLoading: false });
      });
  }

  renderLoadingScreen = () => {
    // let { windowHeight, windowWidth } = Dimensions.get('window');
    return (
      <View style={{
        height: windowHeight,
        width: windowWidth,
        marginTop: 20,
        backgroundColor: COLORS.WHITE,
        zIndex: 1,
      }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  render() {
    return (
      <BannerErrorContainer ref="ebc" style={{
        flex: 1,
        backgroundColor: COLORS.LIGHT,
      }}>
        {!this.state.isLoading || this.renderLoadingScreen()}
        <KeyboardScrollView
          scrollEnabled={false}
          scrollToTopOnBlur
          showsVerticalScrollIndicator={false}
          space={200}
          style={{ flex: 1 }}
        >
          <View style={{
            height: SCALE.h(34)
          }} />

          <HiddenInput
            // ref={(r) => this.addFormItem(r, 'salon_user_id')}
            ref={(r) => this.addFormItem(r, 'id')}
          />

          <InlineTextInput
            autoCorrect={false}
            onChangeText={(value) => {
              this.fetchAutocompleteList(value);
              if (this.state.selected)
                this.setFormValue({
                  name: value,
                  // 'salon_user_id': -1,
                  'id': -1,
                  address: '',
                  city: '',
                  state: '',
                  zip: null,
                  website: '',
                  phone: ''
                });
              this.setState({ selected: null });
            }}
            placeholder="Salon name"
            ref={(r) => this.addFormItem(r, 'name')}
            validation={(v) => !!v}
          />

          {/* <InlineTextInput
            autoCorrect={false}
            onChangeText={(value) => {
              this.fetchAutocompleteList(value)
              var temp = this.state.selected;
              temp.name = value;
              this.setState({ selected: temp });
              
            }}
            placeholder="Salon name"
            ref={(r) => this.addFormItem(r, 'name')}
            validation={(v) => !!v}
          /> */}

          <View style={{ height: StyleSheet.hairlineWidth }} />
          <View style={{
            backgroundColor: COLORS.WHITE
          }}>
            <LoadingContainer
              loadingStyle={{
                padding: 10,
                textAlign: 'center'
              }}
              state={[this.state.autocompleteState]}
            >
              {() => <View>
                {!this.state.selected ? _.map(this.state.autocompleteList, element => {

                  let salon = element.salon;

                  return (
                    <TouchableOpacity
                      key={salon.id}
                      onPress={() => {
                        this.setFormValue({
                          name: salon.name,
                          address: salon.address,
                          city: salon.city,
                          state: salon.state,
                          zip: salon.zip,
                          website: salon.website,
                          phone: salon.phone,
                          // 'salon_user_id': salon.id
                          'id': salon.id
                        });
                        this.setState({
                          selected: {
                            name: salon.name,
                            address: salon.address,
                            city: salon.city,
                            state: salon.state,
                            zip: salon.zip,
                            website: salon.website,
                            phone: salon.phone,
                            // 'salon_user_id': salon.id
                            'id': salon.id
                          },
                          autocompleteList: []
                        });
                      }}
                      style={{
                        backgroundColor: COLORS.WHITE,
                        padding: SCALE.w(25),
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Text style={{
                        fontFamily: FONTS.HEAVY,
                        fontSize: SCALE.h(30),
                        color: COLORS.DARK
                      }}>{salon.name}</Text>
                    </TouchableOpacity>
                  );
                }
                ) : null}
              </View>
              }
            </LoadingContainer>
          </View>

          <View style={{ height: 20 }} />

          <MultilineTextInput
            blocked={(!this.state.selected)?true:false}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Address"
            ref={(r) => this.addFormItem(r, 'address')}
            validation={(v) => !!v}
            onChangeText={(value) => {
              if(this.state.selected){
                var temp = this.state.selected;              
                temp.address = value;
                this.setState({ selected: temp });
              }              
            }}
          />

          <View style={{ height: StyleSheet.hairlineWidth }} />

          <InlineTextInput
            blocked={(!this.state.selected)?true:false}
            autoCorrect={false}
            placeholder="City"
            ref={(r) => this.addFormItem(r, 'city')}
            validation={(v) => !!v}
            onChangeText={(value) => {
              if(this.state.selected){
              var temp = this.state.selected;
              temp.city = value;
              this.setState({ selected: temp });
            }
            }}
          />
          <View style={{ height: StyleSheet.hairlineWidth }} />

          <View style={{
            flexDirection: 'row'
          }}>
            <View style={{ flex: 1 }}>
              <PickerInput
                blocked={(!this.state.selected)?true:false}
                choices={states}
                placeholder="State"
                ref={(r) => this.addFormItem(r, 'state')}
                validation={(v) => !!v}
                valueProperty="abbreviation"
                // selected={this.state.selected.state}
                onValueChange={(value) => {
                  if(this.state.selected){
                    var temp = this.state.selected;
                    temp.state = value;
                    this.setState({ selected: temp });
                  }
              }}
              />
            </View>
            <View style={{ width: StyleSheet.hairlineWidth }} />
            <View style={{ flex: 1 }}>
              <InlineTextInput
                blocked={(!this.state.selected)?true:false}
                autoCorrect={false}
                placeholder="Zip"
                keyboardType="numeric"
                max={10}
                ref={(r) => this.addFormItem(r, 'zip')}
                validation={(v) => !!v}
                onChangeText={(value) => {
                  if(this.state.selected){
                  var temp = this.state.selected;
                  temp.zip = value;
                  this.setState({ selected: temp });
                }
                }}
              />
            </View>
          </View>

          <View style={{ height: StyleSheet.hairlineWidth }} />

          <InlineTextInput
            blocked={(!this.state.selected)?true:false}
            autoCorrect={false}
            keyboardType="phone-pad"
            max={15}
            placeholder="Phone Number"
            ref={(r) => this.addFormItem(r, 'phone')}
            validation={(v) => true}
            onChangeText={(value) => {
              if(this.state.selected){
              var temp = this.state.selected;
              temp.phone = value;
              this.setState({ selected: temp });
            }
            }}
          />

          <View style={{ height: StyleSheet.hairlineWidth }} />

          <InlineTextInput
            blocked={(!this.state.selected)?true:false}
            autoCorrect={false}
            keyboardType="url"
            placeholder="Website"
            ref={(r) => this.addFormItem(r, 'website')}
            validation={(v) => !!v}
            onChangeText={(value) => {
              if(this.state.selected){
              var temp = this.state.selected;
              temp.website = value;
              this.setState({ selected: temp });
            }
            }}
          />
          <View style={{ height: StyleSheet.hairlineWidth }} />
        </KeyboardScrollView>
      </BannerErrorContainer>
    );
  }
};
