import React from 'react';
import _ from 'lodash';
import PureComponent from '../components/PureComponent';
import {View, StyleSheet} from 'react-native';
import validator from 'validator';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';
import { observer } from 'mobx-react';
import EnvironmentStore from '../mobx/stores/EnvironmentStore';
import EducationStore from '../mobx/stores/EducationStore';
import OfferingStore from '../mobx/stores/OfferingStore';

import {mixin, autobind} from 'core-decorators';
import InlineTextInput from '../components/Form/InlineTextInput';
import PickerInput from '../components/Form/PickerInput';
import BannerErrorContainer from '../components/BannerErrorContainer';
import KeyboardScrollView from '../components/KeyboardScrollView';
import LoadingContainer from '../components/LoadingContainer';
import DeleteButton from '../components/Buttons/Delete';

import {NAVBAR_HEIGHT} from '../constants';

import appEmitter from '../appEmitter';

import formMixin from '../mixins/form';

@observer
@mixin(formMixin)
export default class SalonAddSP extends PureComponent {

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  state = {
    editing: false
  };

  async loadData() {
    await EnvironmentStore.getServices();
    await EnvironmentStore.getCategories();
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
          'category_id': sp.category.id,
          'service_id': sp.service.id
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

    window.services = this.props.services;
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
          OfferingStore.addOffer(this.getFormValue()) :
          OfferingStore.editOffer(this.state.editing.get('id'), this.getFormValue());

        action
          .then((r) => {
            this.setState({submitting: false});
            return r;
          })
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
          <LoadingContainer state={[EnvironmentStore.servicesState, EnvironmentStore.categoriesState]}>
            {() => (<View>
              <PickerInput
                choices={EnvironmentStore.categories.map(category => ({
                  id: category.id,
                  label: category.name}
                )).toJS()}
                placeholder="Category"
                ref={(r) => this.addFormItem(r, 'category_id')}
                validation={(v) => !!v}
                valueProperty="id"
              />
              <View style={{height: StyleSheet.hairlineWidth}} />
              <PickerInput
                choices={EnvironmentStore.services.map(service => {
                  return {
                    id: service.id,
                    label: service.name
                  };
                }).toJS()}
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

                    OfferingStore.deleteOffer(this.state.editing.id)
                      .then((r) => {
                        this.setState({submitting: false});
                        return r;
                      })
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
