import React from 'react';
import PureComponent from '../components/PureComponent';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {
  CameraRoll,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableHighlight,
  View, Text, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Image} from 'react-native';
import {COLORS, FONTS, h, SCALE} from 'Hairfolio/src/style';
import NavigationSetting from '../navigation/NavigationSetting';
import {observer} from 'mobx-react/native';
import autobind from 'autobind-decorator'
import _ from 'lodash';

import ContactDetailsStore from '../mobx/stores/ContactDetailsStore';

import FollowButton from '../components/FollowButton';


import {appStack, gallery, postFilter, albumPage} from '../routes';

import * as routes from 'Hairfolio/src/routes';

import {STATUSBAR_HEIGHT, POST_INPUT_MODE} from '../constants';

import LoadingScreen from '../components/LoadingScreen';
import BlackHeader from '../components/BlackHeader';

import BlackBookStore from '../mobx/stores/BlackBookStore';

import Swipeout from 'Hairfolio/react-native-swipeout/index';


import LoadingPage from '../components/LoadingPage';

import BlackBookContent from '../components/blackbook/BlackBookContent';

@observer
export default class BlackBook extends PureComponent {

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };


  render() {

    let store = BlackBookStore;

    if (!store.show) {
      return false;
    }

    let Content = LoadingPage(
      BlackBookContent,
      store
    );

    return (<NavigationSetting
      style={{
        flex: 1,
      }}
      onWillFocus={() => {
        StatusBar.setBarStyle('light-content');
        BlackBookStore.reset();
      }}
    >
       <View style={{flex: 1}}>
        <BlackHeader
          onLeft={() => BlackBookStore.myBack()}
          title='My Black Book'

          onRenderLeft = {() => (
            <View
              style = {{
                height: h(60),
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Image
                style={{height: h(18), width: h(30)}}
                source={require('img/white_x.png')}
              />
            </View>
          )}
          onRenderRight={() =>
            <TouchableOpacity
              onPress={
                () => {
                  ContactDetailsStore.reset();
                  ContactDetailsStore.myBack = () => {
                    window.navigators[0].jumpTo(routes.blackBook);
                  }
                  window.navigators[0].jumpTo(routes.contactDetails);
                }
              }
            >
              <Image
                style = {{
                  width: h(28),
                  height: h(28),
                  alignSelf: 'flex-end',
                  marginRight: 10
                }}
                source={require('img/message_plus.png')}
              />
            </TouchableOpacity>
          }
        />
        <Content />
      </View>
    </NavigationSetting>
    );
  }
};
