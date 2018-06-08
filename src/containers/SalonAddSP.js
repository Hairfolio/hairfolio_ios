import React from 'react';
import _ from 'lodash';
import PureComponent from '../components/PureComponent';
import {View, StyleSheet} from 'react-native';
import validator from 'validator';
import {COLORS, FONTS, SCALE} from '../style';
import { toJS } from 'mobx';
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
import formMixin from '../mixins/form';
import whiteBack from '../../resources/img/nav_white_back.png';

var flag_service = false;

@observer
@mixin(formMixin)
export default class SalonAddSP extends PureComponent {
  state = {
    editing: false,
    servicePrice:null
  };

  constructor(props) {
    super(props);
    // alert('Hii')
    if (this.props.offering) {
      this.setState({
        editing: true
      });
      console.log("HELLO ==>"+JSON.stringify(this.props.offering))
      // this.setFormValue(this.props.offering);
      this.setEditing(this.props.offering)
    }
    this.loadData();
  }

  componentDidMount(props) {
    this.props.navigator.setOnNavigatorEvent((e) => {
      this.onNavigatorEvent(e);
    });
    console.log("componentDidMount ==>")
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
    ]
  };

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'back') {
        this.props.navigator.pop({
          animated: true,
        });
      } else if (event.id == 'done') {
        if(!flag_service){
          flag_service = true;

          if (this.checkErrors()){
            setTimeout(()=>{
              flag_service = false;
            },500)
            return;
          }
          
          console.log("on submit ==>"+JSON.stringify(this.getFormValue()))

        this.setState({'submitting': true});

        var action = this.state.editing === false ?
          OfferingStore.addOffering(this.getFormValue()) :
          OfferingStore.editOffering(this.state.editing.id, this.getFormValue());
        action
          .then((r) => {
            setTimeout(()=>{
              flag_service = false;
            },500)
            this.setState({submitting: false});
            this.props.navigator.pop({ animated: true });                      
            return r;
          })
          .catch((e) => {
            setTimeout(()=>{
              flag_service = false;
            },500)
            this.refs.ebc.error(e);
          });
        }       

      }
    }
  }

  async loadData() {
    await EnvironmentStore.getServices();
    await EnvironmentStore.getCategories();
  }

  getValue() {
    return null;
  }

  clear() {
  }

  setEditing(sp) {
    if (this.state.editing !== sp)
      console.log("setEditing ==>"+JSON.stringify(toJS(sp)))
      this.loadData().then(() => {
        console.log("loadData ==>"+sp.price)
        
        this.setFormValue({
          'category_id': sp.category.id,
          'service_id': sp.service.id,
          'price': sp.price
        });

        this.setState({
          servicePrice:""+sp.price
        })
        // this.setFormValue({
        //   ...sp.toJS(),
        //   'category_id': sp.category.id,
        //   'service_id': sp.service.id
        // });

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
    return (
      <BannerErrorContainer ref="ebc" style={{
        flex: 1,
        backgroundColor: COLORS.LIGHT,
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
                choices={toJS(EnvironmentStore.categories).map(category => ({
                  id: category.id,
                  label: category.name}
                ))}
                placeholder="Category"
                ref={(r) => this.addFormItem(r, 'category_id')}
                validation={(v) => !!v}
                valueProperty="id"
              />
              <View style={{height: StyleSheet.hairlineWidth}} />
              <PickerInput
                choices={toJS(EnvironmentStore.services).map(service => {
                  return {
                    id: service.id,
                    label: service.name
                  };
                })}
                placeholder="Service"
                ref={(r) => this.addFormItem(r, 'service_id')}
                validation={(v) => !!v}
                valueProperty="id"
              />

              <View style={{height: StyleSheet.hairlineWidth}} />

              <InlineTextInput
                keyboardType="numeric"
                placeholder="Price"
                maxLength={7}
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
                          this.props.navigator.pop({ animated: true });
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
    );
  }
};
