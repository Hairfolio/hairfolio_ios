import React from 'react';
import _ from 'lodash';
import {View, StyleSheet, TouchableWithoutFeedback, Image} from 'react-native';
import PureComponent from '../PureComponent';
import {BOTTOMBAR_HEIGHT} from '../../constants';
import {COLORS, FONTS, SCALE} from '../../style';

import Icon from '../Icon';

import {search, feed, gallery, createPost, createPostStack, editCustomerStack, favourites, profile} from '../../routes';

import CreatePostStore from '../../mobx/stores/CreatePostStore.js'


export default class LoginNavigationbar extends PureComponent {

  static propTypes = {
    navState: React.PropTypes.shape({
      routeStack: React.PropTypes.arrayOf(React.PropTypes.object),
      presentedIndex: React.PropTypes.number
    }),
    navigator: React.PropTypes.object,
    profilePic: React.PropTypes.string.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  static defaultProps = {
    profilePic: 'http://www.disneyclips.com/imagesnewb/images/clipdonhead.gif'
  };

  state = {};

  componentWillMount() {
    this.setState({
      selected: _.map(this.props.navState.routeStack, (route, i) =>
        i === this.props.navState.presentedIndex
      )
    });
  }

  componentDidMount() {
      /*setTimeout(() =>  {
      CreatePostStore.isOpen = true;
      CreatePostStore.gallery.addSamplePicture();
      _.first(this.context.navigators).jumpTo(createPostStack);
    });
    */
  }

  updateProgress(progress, fromIndex, toIndex) {
    this.setState({
      selected: _.map(this.state.selected, (color, i) =>
        i === toIndex
      )
    });
  }

  handleWillFocus(route) {}

  renderItem(route, opts = {}, onPress) {
    opts.borders = opts.borders || {};
    opts.height = opts.height || BOTTOMBAR_HEIGHT;
    opts.itemSize = opts.itemSize || SCALE.h(54);

    return (<TouchableWithoutFeedback
      onPress={() => {
        if (onPress) {
          onPress();
        } else {
          this.props.navigator.jumpTo(route);
        }
      }}
    >
      <View style={{
        flex: 1,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderLeftWidth: opts.borders.left ? StyleSheet.hairlineWidth : 0,
        borderRightWidth: opts.borders.right ? StyleSheet.hairlineWidth : 0,
        borderColor: COLORS.BOTTOMBAR_BORDER,
        height: opts.height,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.WHITE
      }}>
        {!opts.picture ?
          <Icon
            color={this.state.selected[this.props.navState.routeStack.indexOf(route)] ? COLORS.BOTTOMBAR_SELECTED : COLORS.BOTTOMBAR_NOTSELECTED}
            name={route.icon}
            size={opts.itemSize}
          />
        :
          <Image
            key={opts.picture}
            resizeMode="cover"
            source={{uri: opts.picture}}
            style={{
              backgroundColor: 'black',
              height: opts.itemSize,
              width: opts.itemSize,
              borderRadius: opts.itemSize / 2,
              opacity: this.state.selected[this.props.navState.routeStack.indexOf(route)] ? 1 : 0.7
            }}
          />
        }
      </View>
    </TouchableWithoutFeedback>);
  }

  render() {
    return (<View
      style={{
        position: 'absolute',
        height: SCALE.h(120),
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
        alignItems: 'flex-end',
        flexDirection: 'row'
      }}
    >
      {this.renderItem(feed)}
      {this.renderItem(search, {borders: {left: true}})}
      {this.renderItem(createPost, {
        borders: {left: true, right: true},
        height: SCALE.h(120),
        itemSize: SCALE.h(65)
      },
        () => {

          CreatePostStore.isOpen = true;

          _.first(this.context.navigators).jumpTo(
            createPostStack
          );

        }


      )}
      {this.renderItem(favourites, {borders: {right: true}})}
      {this.renderItem(profile, {picture: this.props.profilePic})}
    </View>);
  }
}
