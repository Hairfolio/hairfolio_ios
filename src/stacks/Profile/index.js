import React from 'React';
import _ from 'lodash';
import {View} from 'react-native';

import Navigator from '../../navigation/Navigator';

import ChannelEmitter from '../../components/Channel/ChannelEmitter';

import PureComponent from '../../components/PureComponent';

import {COLORS} from '../../style';
import {USERPROFILEBAR_HEIGHT, Dims, BOTTOMBAR_HEIGHT} from '../../constants';

import {UserAboutRoute, UserPostsRoute, UserHairfolioRoute, UserStylistsRoute} from '../../routes';

export default class BrandProfileStack extends PureComponent {
  static propTypes = {
    channel: React.PropTypes.object.isRequired,
    profile: React.PropTypes.object.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  componentWillMount() {
    //
    var RoutesCtrs = [];
    switch (this.props.profile.get('account_type')) {
      case 'consumer':
        RoutesCtrs = [UserPostsRoute, UserHairfolioRoute];
        break;
      case 'stylist':
        RoutesCtrs = [UserAboutRoute, UserPostsRoute, UserHairfolioRoute];
        break;
      case 'brand':
        RoutesCtrs = [UserAboutRoute, UserPostsRoute, UserHairfolioRoute];
        break;
      case 'salon':
        RoutesCtrs = [UserAboutRoute, UserPostsRoute, UserHairfolioRoute, UserStylistsRoute];
        break;
    }

    this.routes = _.map(RoutesCtrs, Route => {
      var route = new Route({
        profile: this.props.profile,
        onLayout: (e) => this.onLayout.call(this, route.label,  e)
      });
      return route;
    });
  }

  heights = {};

  onLayout(key, {nativeEvent: { layout: {x, y, width, height}}}) {
    this.heights[key] = height;

    this.refs.wrapper.setNativeProps({
      style: {
        height: _.max(_.values(this.heights).concat([Dims.deviceHeight - USERPROFILEBAR_HEIGHT - BOTTOMBAR_HEIGHT]))
      }
    });
  }

  render() {
    return (
      <View
        onLayout={(e) => this.onLayout('base', e)}
        ref="wrapper"
        style={{
          flex: 1,
          backgroundColor: COLORS.LIGHT
        }}
      >
        <Navigator
          initialRoute={_.first(this.routes)}
          initialRouteStack={this.routes}
          navigationBar={<ChannelEmitter channel={this.props.channel} commands={[
            'updateProgress'
          ]} />}
          ref={(navigator) => this._nav = navigator && navigator.navigator()}
        />
      </View>
    );
  }
}
