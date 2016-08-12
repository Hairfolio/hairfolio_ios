import React from 'react';
import {Navigator} from 'react-native';
import ChannelResponder from '../Channel/ChannelResponder';
import TopNavigationButton from './TopNavigationButton';
import PureComponent from '../PureComponent';

export default class LoginNavigationbar extends PureComponent {

  updateProgress(progress, fromIndex, toIndex) {
    this.refs.navbar.updateProgress(progress, fromIndex, toIndex);
  }

  handleWillFocus(route) {}

  render() {
    return (<Navigator.NavigationBar
      ref="navbar"
      routeMapper={{
        Title: (route, navigator) => null,
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
      style={{backgroundColor: 'transparent'}}
      {...this.props}
    />);
  }
}
