import React from 'React';
import {Platform, BackAndroid, StatusBar} from 'react-native';
import {autobind} from 'core-decorators';

import Navigator from '../navigation/Navigator';
import NavigationSetting from '../navigation/NavigationSetting';

import NavigationBar from '../components/DarkNavigationBar/Bar';

import PureComponent from '../components/PureComponent';

import * as routes from 'hairfolio/src/routes';

export default class CommentsStack extends PureComponent {
  static propTypes = {};

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };
  render() {
    return (
      <NavigationSetting
        style={{
          flex: 1,
        }}
      >
        <Navigator
          initialRoute={
            routes.comments
          }
          initialRouteStack={[
            routes.comments
          ]}
        />
      </NavigationSetting>
    );
  }
}
