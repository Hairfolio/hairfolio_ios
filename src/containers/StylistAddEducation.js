import React, { Component } from 'react';
import _ from 'lodash';
import { View, StyleSheet } from 'react-native';
import validator from 'validator';
import { COLORS, FONTS, SCALE } from '../style';
import UserStore from '../mobx/stores/UserStore';
import EnvironmentStore from '../mobx/stores/EnvironmentStore';
import EducationStore from '../mobx/stores/EducationStore';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { mixin, autobind } from 'core-decorators';
import InlineTextInput from '../components/Form/InlineTextInput';
import PickerInput from '../components/Form/PickerInput';
import BannerErrorContainer from '../components/BannerErrorContainer';
import KeyboardScrollView from '../components/KeyboardScrollView';
import LoadingContainer from '../components/LoadingContainer';
import DeleteButton from '../components/Buttons/Delete';
import whiteBack from '../../resources/img/nav_white_back.png';
import NavigatorStyles from '../common/NavigatorStyles';
import formMixin from '../mixins/form';

var flag_service = false;

@observer
@mixin(formMixin)
export default class StylistAddEducation extends React.Component {
  state = {
    editing: false,
    schoolName:'',
    websiteName:''
  };

  constructor(props) {
    super(props);

    EnvironmentStore.getDegrees();
    if (this.props.education) {
      this.setState({
        editing: true
      });
      this.setEditing(this.props.education);
    }
    if (this.props.navigator) {
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));      
    }
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
        this.submit();
      }
    }
  }

  getValue() {
    return null;
  }

  clear() {
  }

  setEditing(education) {
    if (this.state.editing !== education)
      EnvironmentStore.getDegrees().then(() => {
        // this.setState({
        //   schoolName:education.name,
        //   websiteName:education.website
        // })
        this.setFormValue({
          'name':education.name,
          'year_from': education.year_from.toString(),
          'year_to': education.year_to.toString(),
          'degree_id': education.degree.id,
          'website':education.website
        });
        // this.setFormValue({
        //   ...education.toJS(),
        //   'year_from': education.year_from.toString(),
        //   'year_to': education.year_to.toString(),
        //   'degree_id': education.degree.id
        // });

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

  submit = () => {
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
      EducationStore.addEducation(this.getFormValue()) :
      EducationStore.editEducation(this.state.editing.id, this.getFormValue());
    action
      .then((r) => {           
        this.setState({submitting: false});
        return r;
      })
      .then(
        () => {
          setTimeout(()=>{
            flag_service = false;
          },500)
          this.props.navigator.pop({
            animated: true,
            animationStyle: 'fade',
          });
        },
        (e) => {
          setTimeout(()=>{
            flag_service = false;
          },500)
          this.refs.ebc.error(e);
        }
      );

    }

    
    
    
  }

  render() {
    const degrees = toJS(EnvironmentStore.degrees);
    return (
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
          <LoadingContainer state={[EnvironmentStore.degreesState]}>
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
                choices={
                  degrees.map(degree => ({
                    id: degree.id,
                    label: degree.name
                  }))
                }
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
                    EducationStore.deleteEducation(this.state.editing.id)
                      .then((r) => {
                        this.setState({submitting: false});
                        return r;
                      })
                      .then(
                        () => {
                          this.props.navigator.pop({
                            animated: true,
                            animationStyle: 'fade',
                          });
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
