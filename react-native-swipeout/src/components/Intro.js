import React from 'react';
import {View} from 'react-native';
import PureComponent from './PureComponent';
import Spinner from 'react-native-spinkit';

import {SCALE, COLORS} from '../style';

// no animation here !

export default class Intro extends PureComponent {

  static propTypes = {
    onReady: React.PropTypes.func
  };

  render() {
    return (<View
      style={{flex: 1}}
    >
      <View style={{flex: 1}} />
      <View style={{flex: 1, alignItems: 'center', paddingTop: SCALE.h(144)}}>
        <Spinner
          color={COLORS.DARK}
          size={SCALE.h(46)}
          type="FadingCircleAlt"
        />
      </View>
    </View>);
  }
};
