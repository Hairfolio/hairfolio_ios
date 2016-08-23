import React from 'React';
import _ from 'lodash';
import {InteractionManager, View} from 'react-native';
import connect from '../../lib/connect';

import Navigator from '../../navigation/Navigator';

import NavigationBar from '../../components/UserProfile/Bar';

import PureComponent from '../../components/PureComponent';

import appEmitter from '../../appEmitter';

import {COLORS} from '../../style';
import {USERPROFILEBAR_HEIGHT} from '../../constants';

import {userPosts, userHairfolio} from '../../routes';

import {user} from '../../selectors/user';
import {environment} from '../../selectors/environment';

@connect(user, environment)
export default class ConsumerProfileStack extends PureComponent {
  static propTypes = {
    environment: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  componentWillMount() {
    this.listeners = [
      appEmitter.addListener('logout', () => this.onLogout())
    ];
  }

  componentWillUnmount() {
    _.each(this.listeners, l => l.remove());
  }

  onLogout() {
    InteractionManager.runAfterInteractions(() => this._nav.jumpTo(userPosts));
  }

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: COLORS.LIGHT
      }}>
        <Navigator
          backgroundStyle={{
            paddingTop: USERPROFILEBAR_HEIGHT
          }}
          initialRoute={userPosts}
          initialRouteStack={[
            userPosts, userHairfolio
          ]}
          navigationBar={<NavigationBar color={COLORS.SEARCH_LIST_ITEM_COLOR} />}
          ref={(navigator) => this._nav = navigator && navigator.navigator()}
        />
      </View>
    );
  }
}
