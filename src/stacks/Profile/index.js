
import React from 'React';
import _ from 'lodash';
import {View} from 'react-native';

import Navigator from '../../navigation/Navigator';

import Service from 'hairfolio/src/services/index.js'
import ChannelEmitter from '../../components/Channel/ChannelEmitter';

import PureComponent from '../../components/PureComponent';

import {COLORS} from '../../style';
import {USERPROFILEBAR_HEIGHT, Dims, BOTTOMBAR_HEIGHT} from '../../constants';

import {UserAboutRoute, UserPostsRoute, UserHairfolioRoute, UserStylistsRoute} from '../../routes';

export default class BrandProfileStack extends PureComponent {
  static propTypes = {
    channel: React.PropTypes.object.isRequired,
    profile: React.PropTypes.object.isRequired,
    scrollToFakeTop: React.PropTypes.func.isRequired
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
      case 'ambassador':
        RoutesCtrs = [UserAboutRoute, UserPostsRoute, UserHairfolioRoute];
        break;
      case 'owner':
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

  componentDidMount() {
    this.listener = this.props.channel.onCommand('updateProgress', ([progress, fromIndex, toIndex]) => {
      // the idea is to do the scroll/height adjustement exactly
      // during the blank of the animation that is happening from 0.4 to 0.6
      if (progress >= 0.4)
        this.onNavWillFocus();
    });
  }

  componentWillUnmount() {
    this.listener.remove();
  }

  heights = {};

  onLayout(key, {nativeEvent: { layout: {x, y, width, height}}}) {
    this.heights[key] = height;
    this.setUpHeight();
  }

  setUpHeight() {
    if (!this._nav)
      return;

    this.refs.wrapper.setNativeProps({
      style: {
        height: Math.max(this.heights[this._nav.nextRoute.label], Dims.deviceHeight - USERPROFILEBAR_HEIGHT - BOTTOMBAR_HEIGHT - 10)
      }
    });
  }

  onNavWillFocus() {
    this.setUpHeight();

    this.props.scrollToFakeTop();
  }

  render() {
    return (
      <View
        onLayout={(e) => this.onLayout('base', e)}
        ref="wrapper"
        style={{
          backgroundColor: COLORS.WHITE
        }}
      >
        {this.routes.length ? <Navigator
          initialRoute={_.first(this.routes)}
          initialRouteStack={this.routes}
          navigationBar={<ChannelEmitter channel={this.props.channel} commands={[
            'updateProgress'
          ]} />}
        ref={(navigator) => {
          this._nav = navigator && navigator.navigator()
          requestAnimationFrame(() => {
            // this.props.profile.get('account_type')
            console.log('request animation');
            if (this.props.profile.get('id') == Service.fetch.store.getState().user.data.get('id')) {
              if (this._nav) {
                this._nav.jumpTo(this.routes[1], () => {
                  requestAnimationFrame(() => {
                    this._nav.jumpTo(this.routes[0]);
                  });
                });
              }
            }
          });

        }}
        /> : null}
      </View>
    );
  }
}
