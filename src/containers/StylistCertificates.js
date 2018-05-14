import React, { Component } from 'react';
import _ from 'lodash';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import {Map, OrderedMap} from 'immutable';
import {autobind} from 'core-decorators';
import {View, Text} from 'react-native';
import {COLORS, FONTS, SCALE} from '../style';
import EnvironmentStore from '../mobx/stores/EnvironmentStore';
import UserStore from '../mobx/stores/UserStore';
import LoadingContainer from '../components/LoadingContainer';
import SearchList from '../components/SearchList';
import whiteBack from '../../resources/img/nav_white_back.png';
import User from '../mobx/stores/User';
import ServiceBackend from '../backend/ServiceBackend';
var loadingState = "READY";
@observer
export default class StylistCertificates extends React.Component {
  state = {
    objEdu:[],
    certiItem:null
  };

  constructor(props) {
    super(props);
    // EnvironmentStore.getCertificates();
    // this.tempCerts = EnvironmentStore.certificates;
    // this.tempUser = toJS(UserStore.user);
    // this.state = {
    //   selectedIds: toJS(UserStore.user.certificates.map(cert => cert.id)),
    // }
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
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
    ],
  }

  async callApi() {
    EnvironmentStore.getCertificates();
    const response = await ServiceBackend.get(`/users/${UserStore.user.id}`);
    console.log("callApi result==>"+JSON.stringify(response));
    var user = response.user;
    this.setState({
      objEdu:user.certificates,
      selectedIds: toJS(user.certificates.map(cert => cert.id))   
    })

    // loadingState = "READY";

   
    let certificates = new OrderedMap(
      EnvironmentStore.certificates.map((certificate) => {
        if (this.state.selectedIds.find(currUsrCertId =>  currUsrCertId === certificate.id)) {
          certificate.selected = true;
        } else {
          certificate.selected = false;
        }
        return [certificate.id, new Map(certificate)];
      })
    );

    this.setState({
      certiItem:certificates
    })
 
  }

  onNavigatorEvent(event) {
    if (event.id == 'willAppear') {
      this.callApi();
    }

    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'back') {
        this.props.navigator.pop({
          animated: true,
          animationStyle: 'fade',
        })
      }
      if (event.id == 'done') {
        const formData = { certificate_ids: this.state.selectedIds };
        UserStore.editUser(formData, UserStore.user.account_type)
        .catch((e) => {
          console.log(JSON.stringify(e))
          // this.refs.ebc.error(e);
        });
        this.props.navigator.pop({
          animated: true,
          animationStyle: 'fade',
        })
      }
    }
  }

  getValue() {
    if (!this._searchList)
      return '';
    return this._searchList.getValue().join(',');
  }

  setValue(selectedIds) {
    if (this._searchList)
      return this._searchList.setSelected(selectedIds);

    this.selectedIds = selectedIds;
  }

  clear() {
    if (this._searchList)
      this._searchList.clear();
  }

  updateCertificates = (selectedIds) => {
    console.log("updateCertificates ==>"+JSON.stringify(selectedIds))
    this.setState({
      selectedIds: selectedIds,
    });
  }

  render() {
    // var temp = EnvironmentStore.certificates;
    // console.log("temp ==>"+JSON.stringify(temp))
    // let certificates = new OrderedMap(
    //   EnvironmentStore.certificates.map((certificate) => {
    //     if (this.state.selectedIds.find(currUsrCertId =>  currUsrCertId === certificate.id)) {
    //       certificate.selected = true;
    //     } else {
    //       certificate.selected = false;
    //     }
    //     return [certificate.id, new Map(certificate)];
    //   })
    // );

    // const loadingState = [EnvironmentStore.certificatesState];
    return (
      (this.state.certiItem) ?
    
      <LoadingContainer state={loadingState}>
        {() => <SearchList 
          items={this.state.certiItem}
          placeholder="Search for certificates"
          updateSelectedIds = {this.updateCertificates}
          ref={sL => {
            this._searchList = sL;
            if (!this.selectedIds)
              return;
            this._searchList.setSelected(this.selectedIds);
            delete this.selectedIds;
          }}
          style={{
            flex: 1,
            backgroundColor: COLORS.LIGHT,
          }}
        />}
      </LoadingContainer>
      :
      <View><Text></Text></View>
    );
  }
};
