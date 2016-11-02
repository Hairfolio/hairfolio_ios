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

const Header = observer(() => {
  return (
    <View
      style={{
        backgroundColor: '#393939',
        height: h(86) + 20,
        paddingTop: 20,
        paddingHorizontal: h(26),
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
      <TouchableOpacity
        style={{
          width: 80
        }}
        onPress={() => window.navigators[0].jumpTo(appStack)}
      >
        <Image
          style={{height: h(18), width: h(30)}}
          source={require('img/nav_white_back.png')}
        />
      </TouchableOpacity>
      <Text
        style={{
          flex: 1,
          fontFamily: FONTS.Regular,
          fontSize: h(34),
          color: 'white',
          textAlign: 'center',
        }}
      >
        Starrers
      </Text>

      <View
        style={{
          width: 80,
          backgroundColor: 'blue'
        }}
      >
      </View>
    </View>
  );
});

const StarGiverRow = observer(({store}) => {
  return (
    <View
      style={{
        paddingLeft: h(20),
        alignItems: 'center',
        flexDirection: 'row',

      }}
    >
      <Image
        style={{height: h(80), width:h(80)}}
        source={store.profilePicture.source}
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

        <FollowButton store={store} />
      </View>

    </View>


  );
});

const StarGiversContent = observer(() => {

  if (StarGiversStore.isLoading) {
    return (
      <LoadingScreen store={StarGiversStore} />
    );
  }

  if (StarGiversStore.isEmpty) {
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
          There have been no starrers yet.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView>
      {StarGiversStore.starGivers.map(e => (
        <StarGiverRow
          store={e}
          key={e.key} />
      ))}
    </ScrollView>

  );
});

@connect(app)
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
      <Header />
      <StarGiversContent />




      </View>
    </NavigationSetting>);
  }
};
