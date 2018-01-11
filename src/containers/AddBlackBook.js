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

import FollowButton from 'components/FollowButton.js'
import ShareStore from 'stores/ShareStore.js'

import StarGiversStore from 'stores/StarGiversStore.js'
import LoadingPage from 'components/LoadingPage'

import {appStack, gallery, postFilter, albumPage} from '../routes';

import * as routes from 'Hairfolio/src/routes.js'

import MessageDetailsStore from 'stores/MessageDetailsStore.js';

import {STATUSBAR_HEIGHT, POST_INPUT_MODE} from '../constants';

import LoadingScreen from 'components/LoadingScreen.js'
import BlackHeader from 'components/BlackHeader.js'

import AddBlackBookStore from 'stores/AddBlackBookStore.js'


import Swipeout from 'Hairfolio/react-native-swipeout/index.js';
;

import {SelectPeople, ToInput} from 'components/SelectPeople.js'

@observer
export default class AddBlackBook extends PureComponent {

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };


  render() {

    let store = AddBlackBookStore;

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
      }}
    >
       <View style={{flex: 1}}>
        <BlackHeader
          onRenderLeft= {() => (
            <View
              style = {{
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  flex: 1,
                  fontFamily: FONTS.Regular,
                  fontSize: h(34),
                  color: 'white',
                  alignSelf: 'center'
                }}
              >
                Cancel
              </Text>
            </View>
          )}

          onLeft={
            () => {
              AddBlackBookStore.myBack();
            }
          }

          title='Black Book'
          onRenderRight={() =>
            <TouchableOpacity
              onPress={
                () => {
                  ShareStore.contacts = AddBlackBookStore.selectedItems.map(e => e);
                  AddBlackBookStore.myBack();
                }
              }
            >
              <Text
                style = {{
                  fontSize: h(34),
                  color: 'white',
                  fontFamily: FONTS.MEDIUM,
                  textAlign: 'right'
                }}
              >
                Add
              </Text>
            </TouchableOpacity>
          }
        />
        <ToInput store={store} />
        <Content />
      </View>
    </NavigationSetting>);
  }
};
