import React from 'react';
import { View, Text } from 'react-native';
import PureComponent from './PureComponent';
import Spinner from 'react-native-spinkit';
import { COLORS, SCALE } from '../style';
import utils from '../utils';

export default class LoadingContainer extends PureComponent {

  static propTypes = {
    children: React.PropTypes.func,
    state: React.PropTypes.array.isRequired
  };

  render() {
    if (utils.isLoadingError(this.props.state))
      return <Text>The loading failed</Text>;

    if (utils.isReady(this.props.state))
      return this.props.children();

    return (
      <View
        style={{
          flex: 1,
          alignSelf: 'stretch',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Spinner
          color={COLORS.DARK}
          size={SCALE.h(46)}
          type="FadingCircleAlt"
        />
      </View>
    );
  }
};
