import React from 'react';
import {Text} from 'react-native';
import PureComponent from './PureComponent';
import Spinner from 'react-native-spinkit';

import utils from '../utils';

// no animation here !

export default class LoadingContainer extends PureComponent {

  static propTypes = {
    children: React.PropTypes.func.isRequired,
    loadingStyle: Text.propTypes.style,
    state: React.PropTypes.array.isRequired
  };

  render() {
    if (utils.isLoadingError(this.props.state))
      return <Text>The loading failed</Text>;

    if (utils.isReady(this.props.state))
      return this.props.children();

    return <Text style={this.props.loadingStyle}>Loading</Text>;
  }
};
