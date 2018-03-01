import PureComponent from '../components/PureComponent';
import {COLORS, FONTS, SCALE} from '../style';
import {STATUSBAR_HEIGHT} from '../constants';
import SimpleButton from '../components/Buttons/Simple';
import SearchElement from '../components/search/Search';
import SearchStore from '../mobx/stores/SearchStore';

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
import NavigatorStyles from '../common/NavigatorStyles';

const SampleActions = observer(() => {
  return (
    <View>

    <SimpleButton
      color={COLORS.DARK}
      label="Go to a consumer profile"
      onPress={() => {
        navigator.push({
          screen: 'hairfolio.Profile',
          navigatorStyle: NavigatorStyles.tab,
          passProps: {
            userId: 118,
          }
        });
      }}
    />

    <View style={{height: 20}} />

    <SimpleButton
      color={COLORS.DARK}
      label="Go to a stylist profile"
      onPress={() => {
        navigator.push({
          screen: 'hairfolio.Profile',
          navigatorStyle: NavigatorStyles.tab,
          passProps: {
            userId: 120,
          }
        });
      }}
    />

    <View style={{height: 20}} />

    <SimpleButton
      color={COLORS.DARK}
      label="Go to a salon profile"
      onPress={() => {
        navigator.push({
          screen: 'hairfolio.Profile',
          navigatorStyle: NavigatorStyles.tab,
          passProps: {
            userId: 121,
          }
        });
      }}
    />

    <View style={{height: 20}} />

    <SimpleButton
      color={COLORS.DARK}
      label="Go to a brand profile"
      onPress={() => {
        navigator.push({
          screen: 'hairfolio.Profile',
          navigatorStyle: NavigatorStyles.tab,
          passProps: {
            userId: 122,
          }
        });
      }} />

    </View>
  );
});

@observer
export default class Search extends PureComponent {
  constructor(props) {
    super(props);
    SearchStore.load();
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.WHITE,
        }}
      >
        <SearchElement navigator={this.props.navigator}/>
      </View>
    );
  }
};
