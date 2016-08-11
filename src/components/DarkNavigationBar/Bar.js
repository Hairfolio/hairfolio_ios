import React from 'react';
import {Navigator, Platform} from 'react-native';
import ChannelResponder from '../Channel/ChannelResponder';
import TopNavigationButton from './TopNavigationButton';
import TopNavigationTitle from './TopNavigationTitle';
import PureComponent from '../PureComponent';

import {COLORS} from '../../style';

export default class LoginNavigationbar extends PureComponent {
  static contextTypes = {
    focusEmitter: React.PropTypes.object.isRequired
  };

  state = {
    ready: Platform.OS === 'ios'
  };

  componentWillMount() {
    this.l = this.context.focusEmitter.addListener('willfocus', () =>
      this.setState({ready: true})
    );
  }

  componentWillUnmount() {
    this.l.remove();
  }

  updateProgress(progress, fromIndex, toIndex) {
    this.refs.navbar.updateProgress(progress, fromIndex, toIndex);
  }

  handleWillFocus(route) {}

  render() {
    if (!this.state.ready)
      return null;

    return (<Navigator.NavigationBar
      ref="navbar"
      routeMapper={{
        Title: (route, navigator) => (<ChannelResponder
            channel={route.navigationChannel}
            properties={{
              title: 'title'
            }}
          >
            <TopNavigationTitle navigator={navigator} />
          </ChannelResponder>),
        LeftButton: (route, navigator, index) => (<ChannelResponder
            channel={route.navigationChannel}
            properties={{
              leftIcon: 'icon',
              leftAction: 'action',
              leftDisabled: 'disabled'
            }}
          >
            <TopNavigationButton index={index} navigator={navigator} type="left" />
          </ChannelResponder>),
        RightButton: (route, navigator, index) => null
      }}
      style={{
        backgroundColor: COLORS.PRIMARY.WHITE,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.SEMIDARK2
      }}
      {...this.props}
    />);
  }
}
