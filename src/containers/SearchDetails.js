import PureComponent from '../components/PureComponent';
import {COLORS, FONTS, SCALE} from '../style';
import {STATUSBAR_HEIGHT} from '../constants';
import SimpleButton from '../components/Buttons/Simple';
import SearchDetailsElement from '../components/search/SearchDetailsElement';
import SearchStore from '../mobx/stores/SearchStore';
import SearchDetailsStore from '../mobx/stores/search/SearchDetailsStore';

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
} from 'Hairfolio/src/helpers';

const SampleActions = observer(() => {
  return (
    <View>
    <SimpleButton
      color={COLORS.DARK}
      label="Go to a consumer profile"
      onPress={() => {
        // appStack.scene().goToProfile(118);
        //118 / consumerext@hairfolio.com / 123456
      }}
    />
    <View style={{height: 20}} />
    <SimpleButton
      color={COLORS.DARK}
      label="Go to a stylist profile"
      onPress={() => {
        //120 / stylistext@hairfolio.com / 123456
        // appStack.scene().goToProfile(120);
      }}
    />
    <View style={{height: 20}} />
    <SimpleButton
      color={COLORS.DARK}
      label="Go to a salon profile"
      onPress={() => {
        //121 / salonext@hairfolio.com / 123456
        // appStack.scene().goToProfile(121);
      }}
    />
    <View style={{height: 20}} />
    <SimpleButton
      color={COLORS.DARK}
      label="Go to a brand profile"
      onPress={() => {
        //122 / brandext@hairfolio.com / 123456
        // appStack.scene().goToProfile(122);
      }} />

    </View>
  );
});

export default class SearchDetails extends PureComponent {
  constructor(props) {
    super(props);
    StatusBar.setBarStyle('light-content')
    if (SearchDetailsStore.dontReset) {
      // SearchDetailsStore.dontReset = true;
    } else {
      SearchDetailsStore.reset();
    }
  }

  componentDidMount() {
    if (SearchDetailsStore.dontReset) {
      SearchDetailsStore.dontReset = false;
    } else {
      setTimeout(() => SearchDetailsStore.input.focus());
    }
  }

  render() {
    return (
      <View style={{
        flex: 1
      }}>
        <SearchDetailsElement navigator={this.props.navigator}/>
      </View>
    );
  }
};
