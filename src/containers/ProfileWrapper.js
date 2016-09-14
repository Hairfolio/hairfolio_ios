import React from 'react';
import {autobind} from 'core-decorators';
import PureComponent from '../components/PureComponent';
import {StatusBar, Text} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {user, users} from '../selectors/user';
import {environment} from '../selectors/environment';
import {usersActions} from '../actions/users';
import {COLORS} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import Profile from './Profile';

import LoadingContainer from '../components/LoadingContainer';

import {BOTTOMBAR_HEIGHT} from '../constants';
import utils from '../utils';

@connect(app, user, environment, users)
export default class ProfileWrapper extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    environment: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired,
    users: React.PropTypes.object.isRequired,
    usersStates: React.PropTypes.object.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  state = {};

  @autobind
  onWillFocus() {
    StatusBar.setHidden(false, 'fade');
    StatusBar.setBarStyle('light-content', true);
  }

  setUserId(userId) {
    this.setState({userId}, () => {
      this.refs.ns.forceUpdateContent();
    });
    if (!utils.isReady(this.props.usersStates.get(userId)))
      this.props.dispatch(usersActions.getUser(userId));
  }

  render() {
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
        <Profile profile={this.props.user} />
      :
        <LoadingContainer state={[this.props.usersStates.get(this.state.userId)]}>
          {() => <Profile profile={this.props.users.get(this.state.userId)} />}
        </LoadingContainer>
      }
    </NavigationSetting>);
  }
};
