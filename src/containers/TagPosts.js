import React from 'react';
import PureComponent from '../components/PureComponent';
import {
  CameraRoll,
  ScrollView,
  StatusBar,
  View, Text, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Image} from 'react-native';
import {COLORS, FONTS, h, SCALE} from 'Hairfolio/src/style';
import NavigationSetting from '../navigation/NavigationSetting';
import {observer} from 'mobx-react/native';
import autobind from 'autobind-decorator'
import _ from 'lodash';

import * as routes from 'Hairfolio/src/routes';
import FollowButton from '../components/FollowButton';

import StarGiversStore from '../mobx/stores/StarGiversStore';

import {appStack, gallery, postFilter, albumPage} from '../routes';

import {STATUSBAR_HEIGHT, POST_INPUT_MODE} from '../constants';

import LoadingScreen from '../components/LoadingScreen';
import WhiteHeader from '../components/WhiteHeader';


import GridList from '../components/GridList'
import TagPostStore from '../mobx/stores/TagPostStore';

const Content = observer(({store}) => {
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
        onBack={
          () => window.navigators[0].jumpTo(routes.tagPosts)
        }
        noElementsText='There are no posts with this tag'
        store={store} />
  </View>
  );
});

@observer
export default class TagPosts extends PureComponent {

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  render() {


    if (TagPostStore.isEmpty) {
      return null;
    }

    let currentStore = TagPostStore.currentStore;


    if (currentStore == null) return <View />;

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
      <Content store={currentStore} />
  </NavigationSetting>);
  }
};
