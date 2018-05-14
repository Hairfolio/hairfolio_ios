import React from 'react';
import _ from 'lodash';
import PureComponent from '../components/PureComponent';
import {List, OrderedMap} from 'immutable';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import UserStore from '../mobx/stores/UserStore';
import {COLORS, FONTS, SCALE} from '../style';
import SafeList from '../components/SafeList';
import LoadingContainer from '../components/LoadingContainer';
import whiteBack from '../../resources/img/nav_white_back.png';
import NavigatorStyles from '../common/NavigatorStyles';
import ServiceBackend from '../backend/ServiceBackend';

@observer
export default class SalonSP extends PureComponent {
  state = {
    userOfferings:[],
    singleItem:{}
  };

  componentDidMount(props) {
    this.props.navigator.setOnNavigatorEvent((e) => {
      this.onNavigatorEvent(e);
    });
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
  
  async callApi(){
    const response = await ServiceBackend.get(`/users/${UserStore.user.id}/offerings`);    
    this.setState({
      userOfferings:toJS(response.offerings)
    });
    console.log("callApi ==>"+JSON.stringify(this.state.userOfferings))
    // window.myuser = UserStore.user;
    var offerings = new OrderedMap(this.state.userOfferings.map(offerings => [offerings.id, offerings]));
    console.log("offerings ==>"+JSON.stringify(offerings))
    this.setState({
      singleItem : offerings.toObject()
    })
  }

  onNavigatorEvent(event) {
    if (event.id == 'willAppear') {
      this.callApi()
    }
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'back') {
        this.props.navigator.pop({
          animated: true,
        });
      } else if (event.id == 'add') {
        this.props.navigator.push({
          screen: 'hairfolio.SalonAddSP',
          title:"Services &  Prices",
          navigatorStyle: NavigatorStyles.basicInfo,
        });
      }
    }
  }

  getValue() {
    return null;
  }

  clear() {
  }

  renderSP(sp) {
    window.sp = sp;
    console.log("sp ==>"+JSON.stringify(sp))
    return (<TouchableOpacity
      onPress={() => {
        this.props.navigator.push({
          screen: 'hairfolio.SalonAddSP',
          title:"Services &  Prices",
          navigatorStyle: NavigatorStyles.basicInfo,
          passProps: { offering: sp }
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
      }}>{sp.service.name}</Text>
      <Text style={{
        fontFamily: FONTS.ROMAN,
        fontSize: SCALE.h(30),
        color: COLORS.DARK2
      }}>${sp.price}</Text>
    </TouchableOpacity>);
  }

  renderContent(userOfferings) {
    // window.myuser = UserStore.user;
    // var offerings = new OrderedMap(userOfferings.map(offerings => [offerings.id, offerings]));

    return (<View style={{
      flex: 1,
      backgroundColor: COLORS.LIGHT,
      paddingTop: SCALE.h(15),
    }}>
      { (this.state.userOfferings.length <= 0) ?
        <Text style={{
          marginTop: SCALE.h(35),
          marginLeft: SCALE.w(25),
          marginRight: SCALE.w(25),
          fontFamily: FONTS.MEDIUM,
          fontSize: SCALE.h(26),
          color: COLORS.TEXT
        }}>No Services added yet</Text>
      :
        <SafeList
          dataSource={{offerings: this.state.singleItem}}
          pageSize={10}
          renderRow={(sp) => this.renderSP(sp)}
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
    // const userOfferings = toJS(UserStore.user.offerings);
    return (
      <LoadingContainer state={[UserStore.userState]}>
        {() => this.renderContent(this.state.userOfferings)}
      </LoadingContainer>
    );
  }
};
