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
import WhiteHeader from '../components/WhiteHeader';
import GridList from '../components/GridList'
import TagPostStore from '../mobx/stores/TagPostStore';

const Content = observer(({store, navigator}) => {
  return (
    <View style={{
      flex: 1,
    }}>
      <WhiteHeader
        onLeft={() => store.myBack()}
        title={store.title}
        numberOfLines={1}
      />
      <GridList
        navigator={navigator}
        noElementsText='There are no posts with this tag'
        store={store} />
  </View>
  );
});

@observer
export default class TagPosts extends PureComponent {
  render() {
    if (TagPostStore.isEmpty) {
      return null;
    }
    let currentStore = TagPostStore.currentStore;
    if (currentStore == null) return <View />;
    return (
      <Content
        store={currentStore}
        navigator={this.props.navigator}
      />
    );
  }
};
