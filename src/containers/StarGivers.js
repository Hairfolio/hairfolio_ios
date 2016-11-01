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

import {appStack, gallery, postFilter, albumPage} from '../routes';

import {STATUSBAR_HEIGHT, POST_INPUT_MODE} from '../constants';

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

      <ScrollView>
        <Text
          style= {{
            paddingTop: h(38),
            fontSize: h(34),
            textAlign: 'center',
            fontFamily: FONTS.BOOK_OBLIQUE
          }}
        >
          There heave been no starrers yet.
        </Text>
      </ScrollView>

      </View>
    </NavigationSetting>);
  }
};
