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
import LoadingPage from 'components/LoadingPage'

import {appStack, gallery, postFilter, albumPage} from '../routes';

import * as routes from 'Hairfolio/src/routes.js'

import MessageDetailsStore from 'stores/MessageDetailsStore.js';

import {STATUSBAR_HEIGHT, POST_INPUT_MODE} from '../constants';

import LoadingScreen from 'components/LoadingScreen.js'
import BlackHeader from 'components/BlackHeader.js'

import WriteMessageStore from 'stores/WriteMessageStore.js'


import Swipeout from 'Hairfolio/react-native-swipeout/index.js';
;

import {SelectPeople, ToInput} from 'components/SelectPeople.js'


@connect(app)
@observer
export default class WriteMessage extends PureComponent {

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };


  render() {

    let store = WriteMessageStore;

    let Content = LoadingPage(
      SelectPeople,
      store
    );


    return (<NavigationSetting
      style={{
        flex: 1,
      }}
      onWillFocus={() => {
        StatusBar.setBarStyle('light-content');
        WriteMessageStore.load();
      }}
    >
       <View style={{flex: 1}}>
        <BlackHeader
          onLeft={() => WriteMessageStore.myBack()}
          title={WriteMessageStore.title}
          onRenderRight={() =>
            <TouchableOpacity
              onPress={
                () => {
                  WriteMessageStore.actionBtnAction();
                }
              }
            >
              <Text
                style = {{
                  fontSize: h(34),
                  color: 'white',
                  fontFamily: FONTS.MEDIUM,
                  textAlign: 'right',
                  opacity: WriteMessageStore.selectedNumber == 0 ? 0.5 : 1,
                  paddingRight: h(28),
                }}
              >
                {WriteMessageStore.actionBtnText}
              </Text>
            </TouchableOpacity>
          }
        />
        <ToInput store={WriteMessageStore} />

        <Content />
      </View>
    </NavigationSetting>);
  }
};
