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

import FollowButton from './FollowButton';

import StarGiversStore from '../mobx/stores/StarGiversStore';

import {appStack, gallery, postFilter, albumPage} from '../routes';

import {STATUSBAR_HEIGHT, POST_INPUT_MODE} from '../constants';

import LoadingScreen from './LoadingScreen';
import BlackHeader from './BlackHeader';

import PostDetailStore from '../mobx/stores/PostDetailStore';
import CommentsStore from '../mobx/stores/CommentsStore';
import TagPostStore from '../mobx/stores/TagPostStore';


import {
  ActivityIndicator
} from 'Hairfolio/src/helpers';

const FollowUserRow = observer(({store}) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        appStack.scene().goToProfile(store.user.id);
        window.navigators[0].jumpTo(appStack);
        PostDetailStore.clear();
        TagPostStore.clear();
        CommentsStore.clear();
      }}
    >
      <View
        style={{
          paddingLeft: h(20),
          alignItems: 'center',
          flexDirection: 'row',

        }}
      >
        <Image
          style={{height: h(80), width: h(80), borderRadius: h(40)}}
          source={store.profilePicture.getSource(80)}
        />
        <View
          style={{
            marginLeft: 20,
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: h(1),
            borderBottomColor: '#D8D8D8',
            height: h(122),
            flex: 1,
            paddingRight: h(20),
          }}
        >
          <Text
            style={{
              color: '#3E3E3E',
              fontFamily: FONTS.MEDIUM,
              fontSize: h(28),
              flex: 1
            }}
          >{store.name}
          </Text>

          {store.showFollowButton ? <FollowButton store={store} /> : null}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
});

const FollowUserList = observer(({store, style = {}, noResultText = 'There have been no starrers yet.'}) => {
  if (store.isLoading) {
    return (
      <View style = {{ marginTop: 20 }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  if (store.isEmpty) {
    return (
      <View>
        <Text
          style= {{
            paddingTop: h(38),
            fontSize: h(34),
            textAlign: 'center',
            fontFamily: FONTS.BOOK_OBLIQUE
          }}
        >
          {noResultText}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{
        ...style
      }}
    >
      {store.users.map(e => (
        <FollowUserRow
          store={e}
          key={e.key} />
      ))}
    </ScrollView>

  );
});

export default FollowUserList;
