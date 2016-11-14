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
import BlackHeader from 'components/BlackHeader.js'




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
        style={{height: h(80), width:h(80), borderRadius:h(40)}}
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

        {store.showFollowButton ?  <FollowButton store={store} /> : null}
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
      <BlackHeader
        onLeft={() => StarGiversStore.back()}
        title='Starrers'/>
      <StarGiversContent />


      </View>
    </NavigationSetting>);
  }
};
