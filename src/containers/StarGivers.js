import React from 'react';
import PureComponent from '../components/PureComponent';
import {
  CameraRoll,
  ScrollView,
  StatusBar,
  View, Text, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Image} from 'react-native';
import {COLORS, FONTS, h, SCALE} from 'Hairfolio/src/style';
import NavigationSetting from '../navigation/NavigationSetting';
import {observer} from 'mobx-react';
import autobind from 'autobind-decorator';
import _ from 'lodash';

import FollowButton from '../components/FollowButton';

import StarGiversStore from '../mobx/stores/StarGiversStore';

import {appStack, gallery, postFilter, albumPage} from '../routes';

import {STATUSBAR_HEIGHT, POST_INPUT_MODE} from '../constants';

import LoadingScreen from '../components/LoadingScreen';
import BlackHeader from '../components/BlackHeader';

import FollowUserList from '../components/FollowUserList';

export default class StarGivers extends PureComponent {

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };


  render() {

    return (<NavigationSetting
      style={{
        flex: 1,
      }}
      onWillFocus={() => {
        StatusBar.setBarStyle('light-content');
      }}
    >

      <View style={{
        flex: 1,
      }}>
      <BlackHeader
        onLeft={() => StarGiversStore.back()}
        title='Starrers'/>
      <FollowUserList store={StarGiversStore} />


      </View>
    </NavigationSetting>);
  }
};
