import React from 'react';
import PureComponent from '../components/PureComponent';
import {
  CameraRoll,
  ScrollView,
  StatusBar,
  View, Text, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Image} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {post} from '../selectors/post';
import {postActions} from '../actions/post';
import {COLORS, FONTS, h, SCALE} from 'hairfolio/src/style';
import NavigationSetting from '../navigation/NavigationSetting';
import {observer} from 'mobx-react/native';
import autobind from 'autobind-decorator'
import _ from 'lodash';

import FollowButton from 'components/FollowButton.js'

import StarGiversStore from 'stores/StarGiversStore.js'

import {appStack, gallery, postFilter, albumPage} from '../routes';

import {STATUSBAR_HEIGHT, POST_INPUT_MODE} from '../constants';

import LoadingScreen from 'components/LoadingScreen.js'
import WhiteHeader from 'components/WhiteHeader.js'


import GridList from 'components/GridList'
import TagPostStore from 'stores/TagPostStore.js'

const Content = observer(({store}) => {
  return (
    <View style={{
      flex: 1,
    }}>
      <WhiteHeader
        onLeft={() => store.back()}
        title={store.title} />
      <GridList
        noElementsText='There are no posts with this tag'
        store={store} />
  </View>
  );
});

@connect(app)
export default class TagPosts extends PureComponent {

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  render() {

    return (<NavigationSetting
      style={{
        flex: 1,
      }}
      onWillFocus={() => {
        // StatusBar.setBarStyle('light-content');
        StatusBar.setHidden(false, 'fade');
        StatusBar.setBarStyle('default');
      }}
    >
      <Content store={TagPostStore} />
  </NavigationSetting>);
  }
};