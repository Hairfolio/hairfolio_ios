import React from 'react';
import _ from 'lodash';
import PureComponent from '../components/PureComponent';
import {View, StyleSheet} from 'react-native';
import validator from 'validator';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {environment} from '../selectors/environment';
import {educationActions} from '../actions/education';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import {mixin, autobind} from 'core-decorators';
import InlineTextInput from '../components/Form/InlineTextInput';
import PickerInput from '../components/Form/PickerInput';
import BannerErrorContainer from '../components/BannerErrorContainer';
import KeyboardScrollView from '../components/KeyboardScrollView';
import LoadingContainer from '../components/LoadingContainer';

import {NAVBAR_HEIGHT} from '../constants';

import formMixin from '../mixins/form';

@connect(app, environment)
@mixin(formMixin)
export default class StylistAddEducation extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired,
    degrees: React.PropTypes.object.isRequired,
    degreesState: React.PropTypes.string.isRequired,
    dispatch: React.PropTypes.func.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  state = {};

  @autobind
  onWillFocus() {
    this.props.dispatch(educationActions.getDegrees());
  }

  getValue() {
    return null;
  }

  clear() {
  }

  render() {
    return (<NavigationSetting
      leftAction={() => {
        _.last(this.context.navigators).jumpBack();
      }}
      leftIcon="back"
      onWillBlur={this.onWillBlur}
      onWillFocus={this.onWillFocus}
      rightAction={() => {
        console.log(this.getFormValue());
      }}
      rightLabel="Done"
      style={{
        flex: 1,
        backgroundColor: COLORS.LIGHT,
        paddingTop: NAVBAR_HEIGHT
      }}
      title="Add Education"
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
          <LoadingContainer state={[this.props.degreesState]}>
            <InlineTextInput
              autoCorrect={false}
              placeholder="School Name"
              ref={(r) => this.addFormItem(r, 'school_name')}
              validation={(v) => !!v}
            />
            <View style={{height: StyleSheet.hairlineWidth}} />
            <View style={{
              flexDirection: 'row'
            }}>
              <View style={{flex: 1}}>
                <PickerInput
                  choices={_.map(_.range((new Date()).getFullYear() - 70, (new Date()).getFullYear() + 1), (year) =>
                    ({label: year.toString()})
                  ).reverse()}
                  placeholder="From"
                  ref={(r) => this.addFormItem(r, 'year_from')}
                  validation={(v) => !!v}
                />
              </View>
              <View style={{width: StyleSheet.hairlineWidth}} />
              <View style={{flex: 1}}>
                <PickerInput
                  choices={_.map(_.range((new Date()).getFullYear() - 70, (new Date()).getFullYear() + 1), (year) =>
                    ({label: year.toString()})
                  ).reverse()}
                  placeholder="To"
                  ref={(r) => this.addFormItem(r, 'year_to')}
                  validation={(v) => !!v}
                />
              </View>
            </View>
            <View style={{height: StyleSheet.hairlineWidth}} />

            <PickerInput
              choices={this.props.degrees.map(degree => ({
                id: degree.get('id'),
                label: degree.get('name')}
              )).toJS()}
              placeholder="Degree"
              ref={(r) => this.addFormItem(r, 'degree_id')}
              validation={(v) => !!v}
              valueProperty="id"
            />

            <View style={{height: StyleSheet.hairlineWidth}} />

            <InlineTextInput
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Website"
              ref={(r) => this.addFormItem(r, 'website')}
              validation={(v) => !!v}
            />
          </LoadingContainer>
        </KeyboardScrollView>
      </BannerErrorContainer>
    </NavigationSetting>);
  }
};
