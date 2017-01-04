import React from 'React';
import {Platform, BackAndroid, StatusBar} from 'react-native';
import {autobind} from 'core-decorators';

import Navigator from '../../navigation/Navigator';
import NavigationSetting from '../../navigation/NavigationSetting';

import NavigationBar from '../../components/DarkNavigationBar/Bar';

import PureComponent from '../../components/PureComponent';

import {COLORS, SCALE} from '../../style';
import {
  createPost,
  postFilter,
  gallery,
  albumPage,
  addLink,
  addServiceOne,
  addServiceTwo,
  addServiceThree,
  filter,
  share,
  addBlackBook
} from '../../routes';

import CreatePostStore from 'stores/CreatePostStore.js'

export default class EditCustomerStack extends PureComponent {
  static propTypes = {};

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  @autobind
  onWillFocus() {
    // hide the status bar for this element
    StatusBar.setHidden(true);
    // StatusBar.setBarStyle('light-content', true);
  }

  @autobind
  onWillBlur() {
  }

  @autobind
  onBackAndroid() {
  }

  render() {
    return (
      <NavigationSetting
        onWillBlur={this.onWillBlur}
        onWillFocus={this.onWillFocus}
        onFocus={
          () => {
          }
        }
        style={{
          flex: 1,
          backgroundColor: COLORS.LIGHT
        }}
      >
        <Navigator
          initialRoute={
            // addLink
            createPost
            // gallery
            // addServiceOne
            // addLink
            //filter
            // addServiceThree
          }
          initialRouteStack={[
            createPost,
            postFilter,
            filter,
            albumPage,
            addLink,
            gallery,
            addServiceOne,
            addServiceTwo,
            addServiceThree,
            share,
            addBlackBook
          ]}
          ref={(navigator) => this._nav = navigator && navigator.navigator()}
        />
      </NavigationSetting>
    );
  }
}
