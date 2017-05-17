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
import {COLORS, FONTS, h, SCALE} from 'Hairfolio/src/style';
import NavigationSetting from '../navigation/NavigationSetting';
import {observer} from 'mobx-react/native';
import autobind from 'autobind-decorator'
import _ from 'lodash';

import FollowButton from 'components/FollowButton.js'

import StarGiversStore from 'stores/StarGiversStore.js'

import {appStack, gallery, postFilter, albumPage} from '../routes';

import {STATUSBAR_HEIGHT, POST_INPUT_MODE} from '../constants';

import LoadingScreen from 'components/LoadingScreen.js'
import BlackHeader from 'components/BlackHeader.js'


import GridList from 'components/GridList'
import HairfolioPostStore from 'stores/HairfolioPostStore.js'

import * as routes from 'Hairfolio/src/routes.js'

const Content = observer(({store}) => {
  return (
    <View style={{
      flex: 1,
    }}>
      <BlackHeader
        onLeft={() => store.back()}
        title={store.title} />
      <GridList
        onBack={
          () => window.navigators[0].jumpTo(routes.hairfolioPosts)
        }
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
        StatusBar.setHidden(false, 'fade');
        StatusBar.setBarStyle('light-content');
      }}
    >
      <Content store={HairfolioPostStore} />
  </NavigationSetting>);
  }
};
