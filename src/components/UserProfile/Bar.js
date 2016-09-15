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
    this.setState({
      selected: _.map(this.props.navState.routeStack, (route, i) =>
        i === this.props.navState.presentedIndex
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
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        backgroundColor: COLORS.WHITE,
        flexDirection: 'row'
      }}
    >
      {_.map(this.props.navigator.getCurrentRoutes(), route => this.renderItem(route))}
    </View>);
  }
}
