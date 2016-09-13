import React from 'react';
import _ from 'lodash';
import PureComponent from '../components/PureComponent';
import {View, StyleSheet} from 'react-native';
import validator from 'validator';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {environment} from '../selectors/environment';
import {offeringsActions} from '../actions/offerings';
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
export default class SalonAddSP extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired,
    categories: React.PropTypes.object.isRequired,
    categoriesState: React.PropTypes.string.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    services: React.PropTypes.object.isRequired,
    servicesState: React.PropTypes.string.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  state = {
    editing: false
  };

  loadData() {
    return Promise.all([
      this.props.dispatch(offeringsActions.getServices()).then(throwOnFail),
      this.props.dispatch(offeringsActions.getCategories()).then(throwOnFail)
    ]);
  }

  @autobind
  onWillFocus() {
    this.loadData();
  }

  getValue() {
    return null;
  }

  clear() {
  }

  setEditing(sp) {
    if (this.state.editing !== sp)
      this.loadData().then(() => {
        this.setFormValue({
          ...sp.toJS(),
          'category_id': sp.get('category').get('id'),
          'service_id': sp.get('service').get('id')
        });

        if (this._deleteButton)
          this._deleteButton.setNativeProps({
            style: {
              opacity: 1
            }
          });

        this.setState({
          editing: sp
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
          offeringsActions.addOffer(this.getFormValue()) :
          offeringsActions.editOffer(this.state.editing.get('id'), this.getFormValue());

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
              console.log(e);
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
      title={(this.state.editing ? 'Edit' : 'Add') + ' Service'}
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
          <LoadingContainer state={[this.props.servicesState, this.props.categoriesState]}>
            {() => (<View>
              <PickerInput
                choices={this.props.categories.map(category => ({
                  id: category.get('id'),
                  label: category.get('name')}
                )).toJS()}
                placeholder="Category"
                ref={(r) => this.addFormItem(r, 'category_id')}
                validation={(v) => !!v}
                valueProperty="id"
              />
              <View style={{height: StyleSheet.hairlineWidth}} />
              <PickerInput
                choices={this.props.services.map(service => ({
                  id: service.get('id'),
                  label: service.get('name')}
                )).toJS()}
                placeholder="Service"
                ref={(r) => this.addFormItem(r, 'service_id')}
                validation={(v) => !!v}
                valueProperty="id"
              />

              <View style={{height: StyleSheet.hairlineWidth}} />

              <InlineTextInput
                keyboardType="numeric"
                placeholder="Price"
                ref={(r) => this.addFormItem(r, 'price')}
                validation={(v) => !!v}
              />

              <View style={{height: 30}} />
              <View ref={r => this._deleteButton = r} style={{opacity: this.state.editing ? 1 : 0}}>
                <DeleteButton
                  disabled={this.state.submitting || !this.state.editing}
                  label="DELETE"
                  onPress={() => {
                    this.setState({submitting: true});

                    this.props.dispatch(offeringsActions.deleteOffer(this.state.editing.get('id')))
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
                          console.log(e);
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
