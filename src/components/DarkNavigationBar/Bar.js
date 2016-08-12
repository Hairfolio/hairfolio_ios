import React from 'react';
import {Navigator} from 'react-native';
import ChannelResponder from '../Channel/ChannelResponder';
import TopNavigationIcon from './TopNavigationIcon';
import TopNavigationText from './TopNavigationText';
import TopNavigationTitle from './TopNavigationTitle';
import PureComponent from '../PureComponent';

import {COLORS} from '../../style';

export default class LoginNavigationbar extends PureComponent {

  updateProgress(progress, fromIndex, toIndex) {
    this.refs.navbar.updateProgress(progress, fromIndex, toIndex);
  }

  handleWillFocus(route) {}

  render() {
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
            <TopNavigationIcon index={index} navigator={navigator} type="left" />
          </ChannelResponder>),
        RightButton: (route, navigator, index) => (<ChannelResponder
            channel={route.navigationChannel}
            properties={{
              rightLabel: 'label',
              rightAction: 'action',
              rightDisabled: 'disabled'
            }}
          >
            <TopNavigationText index={index} navigator={navigator} type="right" />
          </ChannelResponder>)
      }}
      style={{
        backgroundColor: COLORS.DARK
      }}
      {...this.props}
    />);
  }
}
