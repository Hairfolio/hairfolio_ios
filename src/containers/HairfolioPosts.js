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
import GridList from '../components/GridList'
import HairfolioPostStore from '../mobx/stores/HairfolioPostStore';

const Content = observer(({store, navigator}) => {
  return (
    <View style={{
      flex: 1,
    }}>
      <BlackHeader
        onLeft={() => navigator.pop({ animated: true })}
        title={store.title} />
      <GridList
        navigator={navigator}
        noElementsText='There are no posts with this tag'
        store={store} />
  </View>
  );
});

export default class TagPosts extends PureComponent {
  render() {
    return (
      <Content store={HairfolioPostStore} navigator={this.props.navigator}/>
    );
  }
};
