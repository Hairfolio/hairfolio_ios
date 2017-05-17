import React from 'react';
import {Navigator} from 'react-native-deprecated-custom-components';
import {View, InteractionManager} from 'react-native';
import _ from 'lodash';
import PureComponent from '../components/PureComponent';

export default class CustomNavigator extends PureComponent {
  static propTypes = {
    backgroundStyle: View.propTypes.style,
    initialRoute: React.PropTypes.object,
    onFocusHandler: React.PropTypes.func,
    onWillFocusHandler: React.PropTypes.func
  };

  static contextTypes = {
    currentRoutes: React.PropTypes.array,
    navigators: React.PropTypes.array,
    navigationChannels: React.PropTypes.array
  };

  static defaultProps = {
    onFocusHandler(infos, callback) {
      InteractionManager.runAfterInteractions(callback);
    },
    onWillFocusHandler(infos, callback) {
      callback();
    }
  };

  state = {};

  componentDidMount() {
    var old = this.refs.nav.immediatelyResetRouteStack;
    this.refs.nav.immediatelyResetRouteStack = (stack) => {
      old(stack);
      this.forceEventsForRoute(stack[stack.length - 1]);
    };

    var _jumpTo = this.refs.nav.jumpTo;
    this.refs.nav.jumpTo = (route) => {
      if (this.refs.nav.nextRoute === route)
        return;
      return _jumpTo.call(this.refs.nav, route);
    };

    _.each([
      'push',
      'jumpTo',
      'jumpBack',
    ], action =>
      this.refs.nav[action] = _.wrap(this.refs.nav[action], (action, ...args) => {
        if (this.refs.nav.isCurrentlyFocusing)
          return;
        requestAnimationFrame(() => {
          action.apply(this.refs.nav, args);
          if (_.isFunction(_.last(args)))
            InteractionManager.runAfterInteractions(_.last(args));
        });
      })
    );

    this.l1 = this.refs.nav.navigationContext.addListener('willfocus', (e) => {
      this.refs.nav.nextRoute = e.target.currentRoute;
      this.refs.nav.isCurrentlyFocusing = true;
      this.refs.nav.isCurrentlyWillFocusing = true;
      setImmediate(() => {
        this.props.onWillFocusHandler({data: e.data, navigator: this.refs.nav}, () => {
          if (!this.refs.nav)
            return;
          this.refs.nav.isCurrentlyWillFocusing = false;
          this.refs.nav.navigationContext.emit('willcustomfocus', e.data);
        });
      });
    });

    this.l2 = this.refs.nav.navigationContext.addListener('didfocus', (e) => {
      this.props.onFocusHandler({data: e.data, navigator: this.refs.nav}, () => {
        if (!this.refs.nav)
          return;
        this.refs.nav.isCurrentlyFocusing = false;
        this.refs.nav.navigationContext.emit('didcustomfocus', e.data);
      });
    });

    this.forceEventsForRoute(this.props.initialRoute);
  }

  componentWillUnmount() {
    this.l1.remove();
    this.l2.remove();
  }

  static SceneConfigs = Navigator.SceneConfigs;
  static NavigationBar = Navigator.NavigationBar;

  forceEventsForRoute(route) {
    this.refs.nav.nextRoute = route;
    var data = {route};
    this.refs.nav.isCurrentlyWillFocusing = true;
    this.props.onWillFocusHandler({data: data, navigator: this.refs.nav}, () => {
      if (!this.refs.nav)
        return;
      this.refs.nav.isCurrentlyWillFocusing = false;
      this.refs.nav.navigationContext.emit('willcustomfocus', data);
    });

    this.refs.nav.isCurrentlyFocusing = true;
    this.props.onFocusHandler({data: data, navigator: this.refs.nav}, () => {
      if (!this.refs.nav)
        return;
      this.refs.nav.isCurrentlyFocusing = false;
      this.refs.nav.navigationContext.emit('didcustomfocus', data);
    });
  }

  navigator() {
    return this.refs.nav;
  }

  render() {
    return (<Navigator
      configureScene={(route, routeStack) => {
        // console.log('route', route, routeStack);
        // console.log('route', routeStack);
        console.log('route', 'changed');
        return route.configureScene();
      }}
      renderScene={(route, navigator) => {
        return route.renderScene({
        currentRoutes: (this.context.currentRoutes || []).concat([route]),
        navigators: (this.context.navigators || []).concat([navigator]),
        navigationChannels: (this.context.navigationChannels || []).concat([route.navigationChannel])
        })}
      }

      {...this.props}

      ref="nav"

      sceneStyle={this.props.backgroundStyle}
    />);
  }
}
