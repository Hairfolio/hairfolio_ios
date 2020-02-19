import { Map, OrderedMap } from 'immutable';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import whiteBack from '../../resources/img/nav_white_back.png';
import ServiceBackend from '../backend/ServiceBackend';
import NavigatorStyles from '../common/NavigatorStyles';
import LoadingContainer from '../components/LoadingContainer';
import SearchList from '../components/SearchList';
import EnvironmentStore from '../mobx/stores/EnvironmentStore';
import UserStore from '../mobx/stores/UserStore';
import { COLORS, SCALE } from '../style';
import { showLog } from '../helpers';
var loadingState = "READY";
var rows = [];
@observer
export default class StylistCertificates extends React.Component {
  state = {
    objEdu:[],
    certiItem:null,
    next_page:null,
    nextPage:1,
    isLoadingNextPage:false
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.fetchNextData = this.fetchNextData.bind(this,this.state.isLoadingNextPage);
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

  async fetchNextData() {

    var user = UserStore.user;

    if (!this.state.isLoadingNextPage && this.state.nextPage != null) {

      this.setState({
        isLoadingNextPage: true
      });

      var meta_obj = {};
      var res = null;
      
      ServiceBackend.get(`certificates?page=${this.state.nextPage}`)
      .then(response => {   
        res = response.certificates;
        meta_obj = response.meta;   
     
        if (rows.length > 0) {
          rows.push.apply(rows, res);
        } else {
          rows = res;
        }
      
        this.setState({
          objEdu: rows,
          selectedIds: toJS(UserStore.user.certificates.map(cert => cert.id)),
          nextPage: meta_obj.next_page,
          isLoadingNextPage: false
        });

        let certificates = new OrderedMap(
          rows.map((certificate) => {
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
      })
      .catch(error => {
        showLog(error);
      });
    }
  }

  async callApi() {
    EnvironmentStore.getCertificates();
    const response = await ServiceBackend.get(`users/${UserStore.user.id}`);
    showLog("callApi result==>"+JSON.stringify(response));
    var user = response.user;
    this.setState({
      objEdu:user.certificates,
      selectedIds: toJS(user.certificates.map(cert => cert.id))   
    })
   
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
    if (event.id == 'bottomTabSelected') {
      this.props.navigator.resetTo({
        screen: 'hairfolio.Profile',
        animationType: 'fade',
        navigatorStyle: NavigatorStyles.tab
      });
    }

    if (event.id == 'willAppear') {
      this.fetchNextData();
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
          showLog(JSON.stringify(e))
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
    showLog("updateCertificates ==>"+JSON.stringify(selectedIds))
    this.setState({
      selectedIds: selectedIds,
    });
  }

  renderContent(){
    return(
      <SearchList 
          items={this.state.certiItem}
          placeholder="Search for certificates"
          updateSelectedIds = {this.updateCertificates}
          xyz = {() => {this.fetchNextData()}}
          loaderView={
            () => {
              if (this.state.nextPage != null) {
                return (
                  <View style={{flex: 1, paddingVertical: 20, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator size='large' />
                  </View>
                )
              } else {
                return <View />;
              }
            }
          }
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
        />
    )
  }

  render() {
    return (
      (this.state.certiItem) ?
    
      <LoadingContainer state={loadingState}>
        {() => this.renderContent()}
      </LoadingContainer>
      :
      <View><Text></Text></View>
    );
  }
};
