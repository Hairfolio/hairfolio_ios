import React from 'react';
import _ from 'lodash';

import PureComponent from '../PureComponent';


export default class ChannelEmitter extends PureComponent {
  static propTypes = {
    channel: React.PropTypes.object,
    commands: React.PropTypes.array
  };

  componentWillMount() {
    this.updateNavigationChannel(this.props);

    _.each(this.props.commands, command => {
      this[command] = (...args) => this.props.channel.sendCommand(command, args);
    });
  }

  componentWillReceiveProps(nextProps) {
    this.updateNavigationChannel(nextProps);
  }

  componentWillUnmount() {
    this.props.channel.reset();
  }

  updateNavigationChannel(props) {
    _.each(props, (value, key) => {
      props.channel.set(key, value);
    });

    _.each(this.props, (value, key) => {
      if (_.isUndefined(props[key]))
        props.channel.set(key, undefined);
    });
  }

  render() {
    return null;
  }
}
