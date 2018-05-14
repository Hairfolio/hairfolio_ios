import React from 'react';
import _ from 'lodash';
import PureComponent from '../components/PureComponent';
import {List, OrderedMap} from 'immutable';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import UserStore from '../mobx/stores/UserStore';
import {COLORS, FONTS, SCALE} from '../style';
import SafeList from '../components/SafeList';
import LoadingContainer from '../components/LoadingContainer';
import whiteBack from '../../resources/img/nav_white_back.png';
import NavigatorStyles from '../common/NavigatorStyles';
import ServiceBackend from '../backend/ServiceBackend';


@observer
export default class StylistEducation extends PureComponent {
  state = {
    objEdu:[],
    singleItem:{},
    flag_firstTime:false
  };

  constructor(props) {
    super(props);

    if (this.props.navigator) {
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }
    console.log("user ==>"+JSON.stringify(UserStore.user))
    // this._changeState = this._changeState.bind(this);
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
        id: 'add',
        title: 'Add',
        buttonFontSize: SCALE.h(30),
        buttonColor: COLORS.WHITE,
      }
    ]
  };    

    async callApi() {
      const response = await ServiceBackend.get(`/users/${UserStore.user.id}/educations`);
      console.log("callApi result==>"+JSON.stringify(response.educations))
      this.setState({
        objEdu : response.educations
      })
      var educations = new OrderedMap(this.state.objEdu.map(education => [education.id, education]));
    this.setState({
      singleItem : educations.toObject()
    })
    }


  onNavigatorEvent(event) {
    if (event.id == 'willAppear') {

      this.callApi();
      // if(!this.state.flag_firstTime){
      //   this.setState({
      //     flag_firstTime : true
      //   })
      //   const user = UserStore.user;
      //   this.setState({
      //     objEdu : user.educations
      //   })
      //   console.log("callApi result 123==>"+JSON.stringify(UserStore.user))
      //   var educations = new OrderedMap(this.state.objEdu.map(education => [education.id, education]));
      //   this.setState({
      //   singleItem : educations.toObject()
      //   })
      
      // }else{
      //   this.callApi();
      // }      
    }
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'back') {
        this.props.navigator.pop({
          animated: true,
          animationStyle: 'fade',
        });
      } else if (event.id == 'add') {

        // this.props.navigation.navigate('EditSubCommunity', { updateSubCommunity: this.updateSubCommunity.bind(this), subCommunity: this.state.userSubCommunity })

        this.props.navigator.push({
          screen: 'hairfolio.StylistAddEducation',
          title: 'Add Education',
          navigatorStyle: NavigatorStyles.basicInfo
        });
      }
    }
  }

  getValue() {
    return null;
  }

  clear() {
  }

  renderEducation(education) {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigator.push({
            screen: 'hairfolio.StylistAddEducation',
            navigatorStyle: NavigatorStyles.basicInfo,
            passProps: {
              education: education,
            },
          });
        }}
        style={{
          backgroundColor: COLORS.WHITE,
          padding: SCALE.w(25)
        }}
      >
        <Text style={{
          fontFamily: FONTS.HEAVY,
          fontSize: SCALE.h(30),
          color: COLORS.DARK
        }}>{education.name}</Text>
        <Text style={{
          fontFamily: FONTS.ROMAN,
          fontSize: SCALE.h(30),
          color: COLORS.DARK2
        }}>{(education.degree) ?education.degree.name:''}</Text>
        <Text style={{
          fontFamily: FONTS.BOOK,
          fontSize: SCALE.h(30),
          color: COLORS.LIGHT3
        }}>{education.year_from} - {education.year_to}</Text>
      </TouchableOpacity>
    );
  }

  renderContent() {
    
    return (<View style={{
      flex: 1
    }}>
      {(this.state.objEdu.length <= 0) ?
        <Text style={{
          marginTop: SCALE.h(35),
          marginLeft: SCALE.w(25),
          marginRight: SCALE.w(25),
          fontFamily: FONTS.MEDIUM,
          fontSize: SCALE.h(26),
          color: COLORS.TEXT
        }}>No Education added</Text>
      :
      <SafeList
      dataSource={{education: this.state.singleItem}}
        pageSize={10}
        renderRow={(education) => this.renderEducation(education)}
        renderSeparator={(sId, rId) => <View key={`sep_${sId}_${rId}`} style={{height: StyleSheet.hairlineWidth, backgroundColor: 'transparent'}} />}
        style={{
          flex: 1,
          backgroundColor: 'transparent'
        }}
      />
       
      }
    </View>);
  }

  render() {
    return (
      <LoadingContainer state={[UserStore.userState]}>
        {() => this.renderContent()}
      </LoadingContainer>
    );
  }
};
