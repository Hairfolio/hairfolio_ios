import { Map, OrderedMap } from 'immutable';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { View } from 'react-native';
import whiteBack from '../../resources/img/nav_white_back.png';
import NavigatorStyles from '../common/NavigatorStyles';
import SearchList from '../components/SearchList';
import EnvironmentStore from '../mobx/stores/EnvironmentStore';
import UserStore from '../mobx/stores/UserStore';
import { COLORS, SCALE } from '../style';

@observer
export default class StylistCertificates extends React.Component {
  static defaultProps = {
    title: 'Product Experience'
  };

  state = {};

  constructor(props) {
    super(props);
    setTimeout(()=>{
      EnvironmentStore.getCertificates(EnvironmentStore.certificatesNextPage);
    },250);
    
    this.state = {
      selectedIds: toJS(UserStore.user.certificates.map(exp => exp.id)),
    }
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

  fetchServices() {
    setTimeout(() => {
      EnvironmentStore.getCertificates(EnvironmentStore.certificatesNextPage);
      this.state = {
        selectedIds: toJS(UserStore.user.certificates.map(exp => exp.id)),
      }
    }, 250)
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
      this.fetchServices()
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
          this.refs.ebc.error(e);
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

  getNextPage() {
    if (EnvironmentStore.certificatesNextPage) {
      EnvironmentStore.getCertificates(EnvironmentStore.certificatesNextPage);
    }
  }

  updateProductExperience = (selectedIds) => {
    this.setState({
      selectedIds: selectedIds,
    });
  }

  render() {
    let newExperiences = EnvironmentStore.certificates
      .filter((certificate) => certificate.id !== null)
      .map((obsExperience) => {
        let certificate = toJS(obsExperience);
        if (this.state.selectedIds.find(currUsrExpId =>  currUsrExpId === certificate.id)) {
          certificate.selected = true;
        }
        return [certificate.id, new Map(certificate)];
      });
    let certificates = new OrderedMap(newExperiences);

    if(certificates){

      return (
        <SearchList
            items={certificates}
            placeholder="Search for products"
            updateSelectedIds = {this.updateProductExperience}
            loaderView={
              () => {
                return <View />;
              }
            }
            ref={sL => {
              this._searchList = sL;
  
              if (!this.selectedIds)
                return;
  
            }}
            style={{
              flex: 1,
              backgroundColor: COLORS.LIGHT,
            }}
            onEndReached={this.getNextPage.bind(this)}
          />
      );

    }else{
      return null;
    }
    
  }
};
