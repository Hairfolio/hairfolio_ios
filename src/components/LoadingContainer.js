import React from 'react';
import {Text, View} from 'react-native';
import PureComponent from './PureComponent';
import Spinner from 'react-native-spinkit';

import utils from '../utils';

// no animation here !

export default class LoadingContainer extends PureComponent {

  static propTypes = {
    children: React.PropTypes.node.isRequired,
    state: React.PropTypes.array.isRequired,
    style: View.propTypes.style
  };

  render() {
    if (utils.isLoadingError(this.props.state))
      return <Text>The loading failed</Text>;

    if (utils.isReady(this.props.state))
      return <View style={this.props.style}>{this.props.children}</View>;

    return <Text>Loading</Text>;
  }
};
