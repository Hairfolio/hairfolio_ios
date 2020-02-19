import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';
import GalleryPage from './containers/GalleryPage';
import { windowHeight, windowWidth } from './helpers';

// var {width: windowWidth, height: windowHeight} = Dimensions.get('window');

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
