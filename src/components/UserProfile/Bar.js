import React from 'react';
import _ from 'lodash';
import {View, TouchableWithoutFeedback, Text} from 'react-native';
import PureComponent from '../PureComponent';
import {USERPROFILEBAR_HEIGHT} from '../../constants';
import {COLORS, FONTS, SCALE} from '../../style';

export default class UserProfileBar extends PureComponent {

  static propTypes = {
    color: React.PropTypes.string.isRequired,
    navState: React.PropTypes.shape({
      routeStack: React.PropTypes.arrayOf(React.PropTypes.object),
      presentedIndex: React.PropTypes.number
    }),
    navigator: React.PropTypes.object
  };

  state = {};

  componentWillMount() {
    this.setup(this.props.navState);
  }

  componentWillReceiveProps(props) {
    if (props.navState !== this.props.navState)
      this.setup(props.navState);
  }

  setup(navState = {}) {
    this.setState({
      selected: _.map(navState.routeStack, (route, i) =>
        i === navState.presentedIndex
      )
    });
  }

  updateProgress(progress, fromIndex, toIndex) {
    this.setState({
      selected: _.map(this.state.selected, (color, i) =>
        i === toIndex
      )
    });
  }

  handleWillFocus(route) {}

  renderItems(navState = {}) {
    return _.map(navState.routeStack, route => this.renderItem(route));
  }

  renderItem(route) {
    return (<TouchableWithoutFeedback
      key={route.label}
      onPress={() => {
        this.props.navigator.jumpTo(route);
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.WHITE,
          height: USERPROFILEBAR_HEIGHT,
          alignItems: 'center',
          justifyContent: 'center',
          borderBottomWidth: 1,
          borderBottomColor: this.state.selected[this.props.navState.routeStack.indexOf(route)] ? this.props.color : COLORS.LIGHT
        }}
      >
        <Text style={{
          color: COLORS.SEARCH_LIST_ITEM_COLOR,
          fontSize: SCALE.h(30),
          fontFamily: FONTS.HEAVY,
          textAlign: 'center',
          opacity: this.state.selected[this.props.navState.routeStack.indexOf(route)] ? 1 : 0.5
        }}>{route.label}</Text>
      </View>
    </TouchableWithoutFeedback>);
  }

  render() {
    return (<View
      style={{
        backgroundColor: COLORS.WHITE,
        flexDirection: 'row'
      }}
    >
      {this.renderItems(this.props.navState)}
    </View>);
  }
}
