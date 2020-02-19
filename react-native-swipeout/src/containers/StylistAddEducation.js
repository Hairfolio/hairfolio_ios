import { mixin } from 'core-decorators';
import _ from 'lodash';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import whiteBack from '../../resources/img/nav_white_back.png';
import NavigatorStyles from '../common/NavigatorStyles';
import BannerErrorContainer from '../components/BannerErrorContainer';
import DeleteButton from '../components/Buttons/Delete';
import InlineTextInput from '../components/Form/InlineTextInput';
import PickerInput from '../components/Form/PickerInput';
import KeyboardScrollView from '../components/KeyboardScrollView';
import LoadingContainer from '../components/LoadingContainer';
import formMixin from '../mixins/form';
import EducationStore from '../mobx/stores/EducationStore';
import EnvironmentStore from '../mobx/stores/EnvironmentStore';
import { COLORS, SCALE } from '../style';
import { showLog } from '../helpers';

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

  isUrlValid(userInput) {
    
    var res = userInput.match('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i');



    // var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(res == null)
        return false;
    else
        return true;
}

  onNavigatorEvent(event) {
    if (event.id == 'bottomTabSelected') {
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
        });
      } else if (event.id == 'done') {
        var selectedValue = this.getFormValue();

        selectedValue.name = selectedValue.name.trim()

        let isValid = this.isUrlValid(selectedValue.website)
       
        
        if(selectedValue.name.length < 1)
        {
          this.refs.ebc.error("Please enter school name."); 
        }
        else if (parseInt(selectedValue.year_from) >= parseInt(selectedValue.year_to)) {
          this.refs.ebc.error("To year should be greater than from year."); 
        }
        // else if(!isValid)
        // {
        //   this.refs.ebc.error("Please enter valid website URL."); 
        // }
        else {
          this.submit();
        }
      }
    }
  }

  getValue() {
    return null;
  }

  setEditing(education) {
    if (this.state.editing !== education)
    
      EnvironmentStore.getDegrees().then(() => {
        this.setFormValue({
          'name':education.name,
          'year_from': education.year_from.toString(),
          'year_to': education.year_to.toString(),
          'degree_id': education.degree.id,
          'website':education.website
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

  submit = () => {
    if(!flag_service){
      flag_service = true;

      if (this.checkErrors()){
        setTimeout(()=>{
          flag_service = false;
        },500)
        return;
      }
      
      showLog("on submit ==>"+JSON.stringify(this.getFormValue()))

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
                // validation={(v) => !!v}
                validation={(v) => true}
                
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
