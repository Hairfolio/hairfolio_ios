import React from 'react';
import _ from 'lodash';
import validator from 'validator';
import {mixin, debounce} from 'core-decorators';
import PureComponent from '../components/PureComponent';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import MultilineTextInput from '../components/Form/MultilineTextInput';
import InlineTextInput from '../components/Form/InlineTextInput';
import PickerInput from '../components/Form/PickerInput';
import HiddenInput from '../components/Form/HiddenInput';
import BannerErrorContainer from '../components/BannerErrorContainer';
import KeyboardScrollView from '../components/KeyboardScrollView';
import LoadingContainer from '../components/LoadingContainer';
import states from '../states.json';

import {throwOnFail} from '../lib/reduxPromiseMiddleware';

import formMixin from '../mixins/form';

import {NAVBAR_HEIGHT, LOADING, READY, LOADING_ERROR} from '../constants';

@mixin(formMixin)
export default class StylistPlaceOfWork extends PureComponent {
  static propTypes = {
    backTo: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired,
    services: React.PropTypes.object.isRequired
  };

  state = {
    blocked: false,
    autocompleteState: READY
  };

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
      'salon_user_id': value.salon_user_id || -1
    });
    this.setState({
      selected: value.salon_user_id
    });
  }

  clear() {
    this.clearValues();
  }

  @debounce
  fetchAutocompleteList(value) {
    this.lastValue = value;
    if (!value)
      return this.setState({autocompleteList: []});
    this.setState({autocompleteState: LOADING});
    this.context.services.fetch.fetch(`/users?account_type=owner&q=${value/*.toLowerCase()*/}`)
      .then((autocompleteList) => {

        this.setState({
          autocompleteState: READY,
          autocompleteList: this.lastValue ? autocompleteList.users : []
        });
      }, () => {
        this.setState({autocompleteState: LOADING_ERROR});
      });
  }

  render() {
    return (<NavigationSetting
      leftAction={() => {
        _.last(this.context.navigators).jumpTo(this.props.backTo);
      }}
      leftDisabled={this.state.submitting}
      leftIcon="back"
      onWillBlur={this.onWillBlur}
      onWillFocus={this.onWillFocus}
      style={{
        flex: 1,
        backgroundColor: COLORS.LIGHT,
        paddingTop: NAVBAR_HEIGHT
      }}
      title="Place of Work"
    >
      <BannerErrorContainer ref="ebc" style={{
        flex: 1
      }}>
        <KeyboardScrollView
          scrollEnabled={false}
          scrollToTopOnBlur
          showsVerticalScrollIndicator={false}
          space={200}
          style={{flex: 1}}
        >
          <View style={{
            height: SCALE.h(34)
          }} />

          <HiddenInput
            ref={(r) => this.addFormItem(r, 'salon_user_id')}
          />

          <InlineTextInput
            autoCorrect={false}
            onChangeText={(value) => {
              this.fetchAutocompleteList(value);
              if (this.state.selected)
                this.setFormValue({
                  name: value,
                  'salon_user_id': -1,
                  address: '',
                  city: '',
                  state: '',
                  zip: null,
                  website: '',
                  phone: ''
                });
              this.setState({blocked: false, selected: null});
            }}
            placeholder="Salon name"
            ref={(r) => this.addFormItem(r, 'name')}
            validation={(v) => !!v}
          />
          <View style={{height: StyleSheet.hairlineWidth}} />
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
                {!this.state.selected ? _.map(this.state.autocompleteList, element=> {

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
                          'salon_user_id': salon.id
                        });
                        this.setState({
                          selected: salon.id,
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

          <View style={{height: 20}} />

          <MultilineTextInput
            autoCapitalize="none"
            autoCorrect={false}
            blocked={!!this.state.selected}
            placeholder="Address"
            ref={(r) => this.addFormItem(r, 'address')}
            validation={(v) => !!v}
          />

          <View style={{height: StyleSheet.hairlineWidth}} />

          <InlineTextInput
            autoCorrect={false}
            blocked={!!this.state.selected}
            placeholder="City"
            ref={(r) => this.addFormItem(r, 'city')}
            validation={(v) => !!v}
          />
          <View style={{height: StyleSheet.hairlineWidth}} />

          <View style={{
            flexDirection: 'row'
          }}>
            <View style={{flex: 1}}>
              <PickerInput
                choices={states}
                blocked={!!this.state.selected}
                placeholder="State"
                ref={(r) => this.addFormItem(r, 'state')}
                validation={(v) => !!v}
                valueProperty="abbreviation"
              />
            </View>
            <View style={{width: StyleSheet.hairlineWidth}} />
            <View style={{flex: 1}}>
              <InlineTextInput
                autoCorrect={false}
                blocked={!!this.state.selected}
                placeholder="Zip"
                ref={(r) => this.addFormItem(r, 'zip')}
                validation={(v) => !!v}
              />
            </View>
          </View>

          <View style={{height: StyleSheet.hairlineWidth}} />

          <InlineTextInput
            autoCorrect={false}
            blocked={!!this.state.selected}
            keyboardType="numeric"
            placeholder="Phone Number"
            ref={(r) => this.addFormItem(r, 'phone')}
            validation={(v) => true}
          />

          <View style={{height: StyleSheet.hairlineWidth}} />

          <InlineTextInput
            autoCorrect={false}
            blocked={!!this.state.selected}
            keyboardType="url"
            placeholder="Website"
            ref={(r) => this.addFormItem(r, 'website')}
            validation={(v) => !!v}
          />
          <View style={{height: StyleSheet.hairlineWidth}} />
        </KeyboardScrollView>
      </BannerErrorContainer>
    </NavigationSetting>);
  }
};
