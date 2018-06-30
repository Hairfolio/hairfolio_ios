import React from 'react';
import PureComponent from '../components/PureComponent';
import {
  CameraRoll,
  ScrollView,
  StatusBar,
  View, Text, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Image} from 'react-native';
import {COLORS, FONTS, h, SCALE} from 'Hairfolio/src/style';
import {observer} from 'mobx-react';
import autobind from 'autobind-decorator';
import _ from 'lodash';
import FollowButton from '../components/FollowButton';
import StarGiversStore from '../mobx/stores/StarGiversStore';
import {STATUSBAR_HEIGHT, POST_INPUT_MODE} from '../constants';
import LoadingScreen from '../components/LoadingScreen';
import BlackHeader from '../components/BlackHeader';
import FollowUserList from '../components/FollowUserList';
import NavigatorStyles from '../common/NavigatorStyles';

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
      if(this.props.from_feed){
        this.props.navigator.resetTo({
          screen: 'hairfolio.Feed',
          animationType: 'fade',
          navigatorStyle: NavigatorStyles.tab
        });  

      }else if(this.props.from_search){
        this.props.navigator.resetTo({
          screen: 'hairfolio.Search',
          animationType: 'fade',
          navigatorStyle: NavigatorStyles.tab
        });  
      }else if(this.props.from_profile){
        this.props.navigator.resetTo({
          screen: 'hairfolio.Profile',
          animationType: 'fade',
          navigatorStyle: NavigatorStyles.tab
        });  
      }
           
    } 
    if (event.id == 'bottomTabReselected') {
      console.log("bottomTabReselected ==>");
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
