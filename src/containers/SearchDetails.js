import PureComponent from '../components/PureComponent';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import {BOTTOMBAR_HEIGHT, STATUSBAR_HEIGHT} from '../constants';

import {profile, profileExternal, appStack} from '../routes';

import SimpleButton from '../components/Buttons/Simple';

import SearchDetailsElement from 'components/search/SearchDetailsElement.js'
import SearchStore from 'stores/SearchStore.js'

import SearchDetailsStore from 'stores/search/SearchDetailsStore.js';

import {
  _, // lodash
  v4,
  observable,
  computed,
  moment,
  action,
  observer, // mobx
  ActivityIndicator,
  h,
  autobind,
  React, // react
  Component,
  windowWidth,
  windowHeight,
  // react-native components
  AlertIOS,
  Modal,
  ScrollView,
  PickerIOS, Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'Hairfolio/src/helpers.js';

const SampleActions = observer(() => {
  return (
    <View>

    <SimpleButton
      color={COLORS.DARK}
      label="Go to a consumer profile"
      onPress={() => {
        appStack.scene().goToProfile(118);
        //118 / consumerext@hairfolio.com / 123456
      }}
    />

    <View style={{height: 20}} />

    <SimpleButton
      color={COLORS.DARK}
      label="Go to a stylist profile"
      onPress={() => {
        //120 / stylistext@hairfolio.com / 123456
        appStack.scene().goToProfile(120);
      }}
    />

    <View style={{height: 20}} />

    <SimpleButton
      color={COLORS.DARK}
      label="Go to a salon profile"
      onPress={() => {
        //121 / salonext@hairfolio.com / 123456
        appStack.scene().goToProfile(121);
      }}
    />

    <View style={{height: 20}} />

    <SimpleButton
      color={COLORS.DARK}
      label="Go to a brand profile"
      onPress={() => {
        //122 / brandext@hairfolio.com / 123456
        appStack.scene().goToProfile(122);
      }} />

    </View>
  );
});

export default class SearchDetails extends PureComponent {
  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  render() {
    return (<NavigationSetting
      style={{
        flex: 1,
        backgroundColor: COLORS.WHITE
      }}
      onWillFocus={
        () => {
          StatusBar.setBarStyle('light-content')
          if (SearchDetailsStore.dontReset) {
            // SearchDetailsStore.dontReset = true;
          } else {
            SearchDetailsStore.reset();
          }
        }
      }
      onFocus={
        ()  => {
          if (SearchDetailsStore.dontReset) {
            SearchDetailsStore.dontReset = false;
          } else {
            setTimeout(() => SearchDetailsStore.input.focus());
          }
        }
      }
    >
      <View style={{
        flex: 1
      }}>
        <SearchDetailsElement />
      </View>
    </NavigationSetting>);
  }
};
