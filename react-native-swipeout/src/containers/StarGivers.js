import { observer } from 'mobx-react';
import React from 'react';
import { View } from 'react-native';
import NavigatorStyles from '../common/NavigatorStyles';
import BlackHeader from '../components/BlackHeader';
import FollowUserList from '../components/FollowUserList';
import PureComponent from '../components/PureComponent';
import StarGiversStore from '../mobx/stores/StarGiversStore';
import { showLog } from '../helpers';

@observer
export default class StarGivers extends PureComponent {
  constructor(props){
    super(props);
    this.props.navigator.setOnNavigatorEvent((e) => {
      this.onNavigatorEvent(e);
    });
  }

  onNavigatorEvent(event) {
    if (event.id == 'bottomTabSelected') {
      // if(this.props.from_feed){
      //   this.props.navigator.resetTo({
      //     screen: 'hairfolio.Feed',
      //     animationType: 'fade',
      //     navigatorStyle: NavigatorStyles.tab
      //   });  

      // }else if(this.props.from_search){
      //   this.props.navigator.resetTo({
      //     screen: 'hairfolio.Search',
      //     animationType: 'fade',
      //     navigatorStyle: NavigatorStyles.tab
      //   });  
      // }else if(this.props.from_profile){
      //   this.props.navigator.resetTo({
      //     screen: 'hairfolio.Profile',
      //     animationType: 'fade',
      //     navigatorStyle: NavigatorStyles.tab
      //   });  
      // }else if(this.props.from_star){          
      //   this.props.navigator.resetTo({
      //     screen: 'hairfolio.Favourites',
      //     animationType: 'fade',
      //     navigatorStyle: NavigatorStyles.tab
      //   });  
      // }           
    } 
    if (event.id == 'bottomTabReselected') {
      showLog("bottomTabReselected ==>");
    }
  }
  
  render() {

    return (
      <View style={{
        flex: 1,
      }}>
        <BlackHeader
          onLeft={() => this.props.navigator.pop({ animated: true })}
          title='Starrers'/>
        <FollowUserList
          store={StarGiversStore}
          navigator={this.props.navigator}
        />
      </View>
    );
  }
};
