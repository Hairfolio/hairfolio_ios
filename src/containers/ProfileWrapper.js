import React from 'react';
import {autobind} from 'core-decorators';
import PureComponent from '../components/PureComponent';
import {StatusBar, Text, View} from 'react-native';
import {COLORS} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import Profile from './Profile';

import LoadingContainer from '../components/LoadingContainer';

import UserStore from '../mobx/stores/UserStore';
import UsersStore from '../mobx/stores/UsersStore';

import {BOTTOMBAR_HEIGHT} from '../constants';
import utils from '../utils';

@observer
export default class ProfileWrapper extends PureComponent {
  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  state = {};

  @autobind
  onWillFocus() {
    var style = 'light-content';
    if (this.refs.profile)
      style = this.refs.profile.getStyle();
    StatusBar.setHidden(false, 'fade');
    StatusBar.setBarStyle(style, true);
  }

  setUserId(userId) {
    this.setState({userId}, () => {
      this.refs.ns.forceUpdateContent();
    });
    UsersStore.getUser(userId);
  }

  render() {
    const users = toJS(UsersStore.users);
    const states = toJS(UsersStore.usersStates);
    window.p = users;
    return (<NavigationSetting
      forceUpdateEvents={!this.state.userId ? ['login', 'user-edited'] : null}
      onWillFocus={this.onWillFocus}
      ref="ns"
      style={{
        flex: 1,
        backgroundColor: COLORS.WHITE,
        paddingBottom: BOTTOMBAR_HEIGHT
      }}
    >
      {!this.state.userId ?
        <Profile profile={UserStore.user} ref="profile" />
      :
        <View style={{
          flex: 1,
          justifyContent: 'center'
        }}>
          <LoadingContainer loadingStyle={{
            textAlign: 'center'
          }} ref="loadingC" state={[states[this.state.userId]]}>
            {() => <Profile profile={users[this.state.userId]} ref="profile" />}
          </LoadingContainer>
        </View>
      }
    </NavigationSetting>);
  }
};
