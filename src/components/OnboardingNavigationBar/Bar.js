import React from 'react';
import {Navigator, View} from 'react-native';
import ChannelResponder from '../Channel/ChannelResponder';
import TopNavigationButton from './TopNavigationButton';
import PureComponent from '../PureComponent';
import BannerErrorContainer from '../BannerErrorContainer';

export default class LoginNavigationbar extends PureComponent {

  updateProgress(progress, fromIndex, toIndex) {
    this.refs.navbar.updateProgress(progress, fromIndex, toIndex);
  }

  handleWillFocus(route) {}

  error(err) {
    this.refs.bec.error(err);
  }

  render() {
    return (<View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}>
        <BannerErrorContainer ref="bec" style={{flex: 1}}>
          <Navigator.NavigationBar
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
          />
        </BannerErrorContainer>
      </View>);
  }
}
