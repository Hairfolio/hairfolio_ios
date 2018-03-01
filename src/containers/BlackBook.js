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
import ContactDetailsStore from '../mobx/stores/ContactDetailsStore';
import FollowButton from '../components/FollowButton';
import {STATUSBAR_HEIGHT, POST_INPUT_MODE} from '../constants';
import LoadingScreen from '../components/LoadingScreen';
import BlackHeader from '../components/BlackHeader';
import BlackBookStore from '../mobx/stores/BlackBookStore';
import Swipeout from 'Hairfolio/react-native-swipeout/index';
import LoadingPage from '../components/LoadingPage';
import BlackBookContent from '../components/blackbook/BlackBookContent';
import NavigatorStyles from '../common/NavigatorStyles';

@observer
export default class BlackBook extends PureComponent {
  constructor(props) {
    super(props);

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    switch(event.id) {
      case 'willAppear':
        StatusBar.setBarStyle('light-content');
        BlackBookStore.reset();
        break;
      default:
        break;
    }
  }

  render() {
    let store = BlackBookStore;
    if (!store.show) {
      return false;
    }
    let Content = LoadingPage(
      BlackBookContent,
      store,
      { navigator: this.props.navigator },
    );
    return (
      <View style={{flex: 1}}>
        <BlackHeader
          onLeft={() => this.props.navigator.pop({ animated: true })}
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
                  this.props.navigator.push({
                    screen: 'hairfolio.ContactDetails',
                    navigatorStyle: NavigatorStyles.tab,
                  });
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
    );
  }
};
