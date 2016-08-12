import React from 'react';
import {Animated, View, TouchableOpacity, Text} from 'react-native';
import PureComponent from './PureComponent';

import {COLORS, FONTS, SCALE} from '../style';

export default class BannerErrorContainer extends PureComponent {
  static propTypes = {
    children: React.PropTypes.node.isRequired
  };

  static childContextTypes = {
    setBannerError: React.PropTypes.func.isRequired
  };

  state = {};

  getChildContext() {
    return {
      setBannerError: (err) => this.error(err)
    };
  }

  errorHeight = new Animated.Value(0);

  error(err) {
    this.err = err;

    if (err)
      this.setState({
        err
      }, () =>
        Animated.spring(this.errorHeight, {
          toValue: SCALE.h(70),
          duration: 300
        }).start()
      );
    else
      Animated.spring(this.errorHeight, {
        toValue: 0,
        duration: 300
      }).start(() => this.setState({err: this.err}));
  }

  render() {
    return (<View {...this.props} pointerEvents="box-none">
      <TouchableOpacity
        onPress={() => this.error()}
      >
        <Animated.View style={{
          height: this.errorHeight,
          backgroundColor: COLORS.RED,
          position: 'relative'
        }}>
          <View style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: SCALE.h(70),
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text style={{
              fontFamily: FONTS.ROMAN,
              color: COLORS.WHITE,
              fontSize: SCALE.h(30)
            }}>{this.state.err}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
      <View pointerEvents="box-none" style={{flex: 1, position: 'relative'}}>
        {this.props.children}
      </View>
    </View>);
  }
}
