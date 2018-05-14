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

@observer
export default class StarGivers extends PureComponent {
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
