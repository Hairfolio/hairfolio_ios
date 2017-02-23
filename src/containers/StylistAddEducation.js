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
import DeleteButton from '../components/Buttons/Delete';

import {NAVBAR_HEIGHT} from '../constants';

import {throwOnFail} from '../lib/reduxPromiseMiddleware';
import appEmitter from '../appEmitter';

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

  state = {
    editing: false
  };

  @autobind
  onWillFocus() {
    this.props.dispatch(educationActions.getDegrees());
  }

  getValue() {
    return null;
  }

  clear() {
  }

  setEditing(education) {
    if (this.state.editing !== education)
      this.props.dispatch(educationActions.getDegrees()).then(throwOnFail).then(() => {
        this.setFormValue({
          ...education.toJS(),
          'year_from': education.get('year_from').toString(),
          'year_to': education.get('year_to').toString(),
          'degree_id': education.get('degree').get('id')
        });

        if (this._deleteButton)
          this._deleteButton.setNativeProps({
            style: {
              opacity: 1
            }
          });

        this.setState({
          editing: education
        });
      });
  }

  setNew() {
    if (this.state.editing !== false)
      this.clearValues();

    if (this._deleteButton)
      this._deleteButton.setNativeProps({
        style: {
          opacity: 0
        }
      });

    this.setState({
      editing: false
    });
  }

  render() {
    return (<NavigationSetting
      leftAction={() => {
        _.last(this.context.navigators).jumpBack();
      }}
      leftDisabled={this.state.submitting}
      leftIcon="back"
      onWillBlur={this.onWillBlur}
      onWillFocus={this.onWillFocus}
      rightAction={() => {
        if (this.checkErrors())
          return;

        this.setState({'submitting': true});

        var action = this.state.editing === false ?
          educationActions.addEducation(this.getFormValue()) :
          educationActions.editEducation(this.state.editing.get('id'), this.getFormValue());

        this.props.dispatch(action)
          .then((r) => {
            this.setState({submitting: false});
            return r;
          })
          .then(throwOnFail)
          .then(
            () => {
              appEmitter.emit('user-edited');
              _.last(this.context.navigators).jumpBack();
            },
            (e) => {
              this.refs.ebc.error(e);
            }
          );
      }}
      rightDisabled={this.state.submitting}
      rightLabel="Done"
      style={{
        flex: 1,
        backgroundColor: COLORS.LIGHT,
        paddingTop: NAVBAR_HEIGHT
      }}
      title={(this.state.editing ? 'Edit' : 'Add') + ' Education'}
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
            {() => (<View>
              <InlineTextInput
                autoCorrect={false}
                placeholder="School Name"
                ref={(r) => this.addFormItem(r, 'name')}
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

              <View style={{height: 30}} />
              <View ref={r => this._deleteButton = r} style={{opacity: this.state.editing ? 1 : 0}}>
                <DeleteButton
                  disabled={this.state.submitting || !this.state.editing}
                  label="DELETE"
                  onPress={() => {
                    this.setState({submitting: true});

                    this.props.dispatch(educationActions.deleteEducation(this.state.editing.get('id')))
                      .then((r) => {
                        this.setState({submitting: false});
                        return r;
                      })
                      .then(throwOnFail)
                      .then(
                        () => {
                          appEmitter.emit('user-edited');
                          _.last(this.context.navigators).jumpBack();
                        },
                        (e) => {
                          this.refs.ebc.error(e);
                        }
                      );
                  }}
                />
              </View>
            </View>)}
          </LoadingContainer>
        </KeyboardScrollView>
      </BannerErrorContainer>
    </NavigationSetting>);
  }
};
