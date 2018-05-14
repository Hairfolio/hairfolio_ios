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
import FollowButton from './FollowButton';
import StarGiversStore from '../mobx/stores/StarGiversStore';
import {STATUSBAR_HEIGHT, POST_INPUT_MODE} from '../constants';
import LoadingScreen from './LoadingScreen';
import PostDetailStore from '../mobx/stores/PostDetailStore';
import CommentsStore from '../mobx/stores/CommentsStore';
import TagPostStore from '../mobx/stores/TagPostStore';
import NavigatorStyles from '../common/NavigatorStyles';

import {
  ActivityIndicator
} from 'Hairfolio/src/helpers';

const FollowUserRow = observer(({store, navigator}) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigator.push({
          screen: 'hairfolio.Profile',
          navigatorStyle: NavigatorStyles.tab,
          passProps: {
            userId: store.user.id,
          }
        });
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
          source={store.profilePicture.getSource(80, 80)}
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

const FollowUserList = observer(({store, style = {}, noResultText = 'There have been no starrers yet.', navigator}) => {
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
          key={e.key}
          navigator={navigator}
        />
      ))}
    </ScrollView>

  );
});

export default FollowUserList;
