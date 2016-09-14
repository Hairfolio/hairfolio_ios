import React from 'React';
import _ from 'lodash';
import {View} from 'react-native';

import Navigator from '../../navigation/Navigator';

import NavigationBar from '../../components/UserProfile/Bar';

import PureComponent from '../../components/PureComponent';

import {COLORS} from '../../style';
import {USERPROFILEBAR_HEIGHT} from '../../constants';

import {UserPostsRoute, UserHairfolioRoute} from '../../routes';

export default class ConsumerProfileStack extends PureComponent {
  static propTypes = {
    profile: React.PropTypes.object.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  componentWillMount() {
    this.routes = [new UserPostsRoute({profile: this.props.profile}), new UserHairfolioRoute({profile: this.props.profile})];
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
          initialRoute={_.first(this.routes)}
          initialRouteStack={this.routes}
          navigationBar={<NavigationBar color={COLORS.SEARCH_LIST_ITEM_COLOR} />}
          ref={(navigator) => this._nav = navigator && navigator.navigator()}
        />
      </View>
    );
  }
}
