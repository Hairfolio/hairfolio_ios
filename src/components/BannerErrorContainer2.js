import React from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS, SCALE } from '../style';
import { windowHeight } from '../helpers';


export default class BannerErrorContainer2 extends React.Component {
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
        err: err.toString()
      }, () =>
        Animated.spring(this.errorHeight, {
          toValue: (windowHeight > 800 ? SCALE.h(120) : SCALE.h(70)),
          duration: 300
        }).start(() => {
          setTimeout(() => this.error(), 2000);
        })
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
            justifyContent: 'center',
            overflow: 'hidden',
            zIndex: 999,
          }}>
            <Text style={{
              fontFamily: FONTS.ROMAN,
              color: COLORS.WHITE,
              fontSize: SCALE.h(30)
            }}>{this.state.err}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
      <View pointerEvents="box-none" style={{flex: 1, position: 'relative', alignSelf: 'stretch'}}>
        {this.props.children}
      </View>
    </View>);
  }
}
