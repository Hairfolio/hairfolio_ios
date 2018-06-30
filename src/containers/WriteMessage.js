import React from 'react';
import PureComponent from '../components/PureComponent';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {
  CameraRoll,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableHighlight,
  View, Text, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Image} from 'react-native';
import {COLORS, FONTS, h, SCALE} from 'Hairfolio/src/style';
import {observer} from 'mobx-react';
import autobind from 'autobind-decorator';
import _ from 'lodash';
import FollowButton from '../components/FollowButton';
import StarGiversStore from '../mobx/stores/StarGiversStore';
import LoadingPage from '../components/LoadingPage';
import MessageDetailsStore from '../mobx/stores/MessageDetailsStore';
import {STATUSBAR_HEIGHT, POST_INPUT_MODE} from '../constants';
import LoadingScreen from '../components/LoadingScreen';
import BlackHeader from '../components/BlackHeader';
import WriteMessageStore from '../mobx/stores/WriteMessageStore';
import Swipeout from 'Hairfolio/react-native-swipeout/index';
import {SelectPeople} from '../components/SelectPeople';
import whiteBack from '../../resources/img/nav_white_back.png';
import NavigatorStyles from '../common/NavigatorStyles';
import BannerErrorContainer from '../components/BannerErrorContainer';
import ServiceBackend from '../backend/ServiceBackend';

@observer
export default class WriteMessage extends PureComponent {
  constructor(props) {
    super(props);
    StatusBar.setBarStyle('light-content');
    WriteMessageStore.load();
    // if (this.props.navigator) {
    //   this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    // }
    this.props.navigator.setOnNavigatorEvent((e) => {
      this.onNavigatorEvent(e);
    });
    this.props.navigator.setButtons({
      leftButtons: [
        {
          id: 'back',
          icon: whiteBack,
        }
      ],
      rightButtons: [
        {
          id: 'right',
          title: WriteMessageStore.actionBtnText,
          buttonFontSize: SCALE.h(30),
          buttonColor: COLORS.WHITE,
        }
      ]
    })
  }

  static navigatorButtons = {
    leftButtons: [
      {
        id: 'back',
        icon: whiteBack,
      }
    ],
  };

  onNavigatorEvent(event) {
    if (event.id == 'bottomTabSelected') {
      if(this.props.from_feed){
        this.props.navigator.resetTo({
          screen: 'hairfolio.Feed',
          animationType: 'fade',
          navigatorStyle: NavigatorStyles.tab
        });
      }

      if(this.props.from_search){
        this.props.navigator.resetTo({
          screen: 'hairfolio.Search',
          animationType: 'fade',
          navigatorStyle: NavigatorStyles.tab
        });
      }

      if(this.props.from_profile){
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
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'back') {
        this.props.navigator.pop({
          animated: true,
          animationStyle: 'fade',
        });
      } else if (event.id == 'right') {
        if(WriteMessageStore.selectedItems.length > 0){
          WriteMessageStore.navigator = this.props.navigator;
          WriteMessageStore.actionBtnAction();
        }else{
          this.refs.ebc.error('Please select atleast one user to continue');
        }
      } 
      
    }
  }

  render() {
    let store = WriteMessageStore;
    
    let Content = LoadingPage(
      SelectPeople,
      store
    );

    return (
      <BannerErrorContainer ref="ebc" style={{
        flex: 1
      }}>
      <View style={{flex: 1}}>
        {/* <ToInput store={WriteMessageStore} /> */}
        <Content />
      </View>
      </BannerErrorContainer>
    );
  }
};
