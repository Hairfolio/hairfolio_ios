import React, { Component } from 'react';

import AlbumPage from './containers/AlbumPage';
import GalleryPage from './containers/GalleryPage';

import {Navigator} from 'react-native-deprecated-custom-components';
import {
  AppRegistry,
  Text,
  Dimensions
} from 'react-native';


var {width: windowWidth, height: windowHeight} = Dimensions.get('window');


window.width = windowWidth;
window.height = windowHeight;

export default class Player extends Component {
  renderScene(route, navigator) {
    window.nav = navigator;
    return <route.component {...route.passProps} navigator={navigator} />
  }
  configureScene(route, routeStack) {
    if (route.type === 'Modal') {
      return Navigator.SceneConfigs.FloatFromBottom
    }
    return Navigator.SceneConfigs.PushFromRight
  }
  render() {

    let initialRoute = {
      component: GalleryPage,
    };

    return (
      <Navigator
        configureScene={this.configureScene.bind(this)}
        renderScene={this.renderScene.bind(this)}
        initialRoute={initialRoute} />
    );
  }
}
