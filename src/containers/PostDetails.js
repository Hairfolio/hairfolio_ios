import React from 'react';
import PureComponent from '../components/PureComponent';
import {
  CameraRoll,
  ScrollView,
  StatusBar,
  View, Text, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Image} from 'react-native';
import {COLORS, FONTS, h, SCALE} from 'Hairfolio/src/style';
import {observer} from 'mobx-react';
import autobind from 'autobind-decorator'
import _ from 'lodash';
import FollowButton from '../components/FollowButton';
import StarGiversStore from '../mobx/stores/StarGiversStore';
import {STATUSBAR_HEIGHT, POST_INPUT_MODE} from '../constants';
import LoadingScreen from '../components/LoadingScreen';
import BlackHeader from '../components/BlackHeader';
import PostDetailsContent from '../components/feed/PostDetailsContent';

@observer
export default class PostDetails extends PureComponent {
  static navigatorStyle = {
    drawUnderTabBar: true,
  }

  constructor(props) {
    super(props);
    this.props.navigator.toggleTabs({
      to: 'hidden',
    });
    StatusBar.setBarStyle('light-content');
  }

  render() {
    return (
      <View style={{
        flex: 1,
      }}>
        <PostDetailsContent navigator={this.props.navigator} />
      </View>
    );
  }
};
