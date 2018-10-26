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
import {observer} from 'mobx-react';
import autobind from 'autobind-decorator'
import _ from 'lodash';
import FollowButton from '../components/FollowButton';
import ShareStore from '../mobx/stores/ShareStore';
import StarGiversStore from '../mobx/stores/StarGiversStore';
import LoadingPage from '../components/LoadingPage';
import MessageDetailsStore from '../mobx/stores/MessageDetailsStore';
import {STATUSBAR_HEIGHT, POST_INPUT_MODE} from '../constants';
import LoadingScreen from '../components/LoadingScreen';
import BlackHeader from '../components/BlackHeader';
import AddBlackBookStore from '../mobx/stores/AddBlackBookStore';
import Swipeout from 'Hairfolio/react-native-swipeout/index';
import {SelectPeople, ToInput} from '../components/SelectPeople';

@observer
export default class AddBlackBook extends PureComponent {

  render() {
    let store = AddBlackBookStore;
    let Content = LoadingPage(
      SelectPeople,
      store
    );


    return (
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
              this.props.navigator.pop({ animated: true });
            }
          }

          title='Black Book'
          onRenderRight={() =>
            <TouchableOpacity
              onPress={
                () => {
                  ShareStore.contacts = AddBlackBookStore.selectedItems.map(e => e);
                  this.props.navigator.pop({ animated: true });
                }
              }
            >
              <Text
                style = {{
                  fontSize: h(34),
                  color: 'white',
                  fontFamily: FONTS.MEDIUM,
                  textAlign: 'right',
                  paddingRight: 10,
                }}
              >
                Add
              </Text>
            </TouchableOpacity>
          }
        />
        {/* <ToInput store={store} /> */}
        <Content />
      </View>
    );
  }
};
