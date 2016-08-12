import React from 'react';
import PureComponent from '../PureComponent';
import _ from 'lodash';

// this is the component used to wrap nav bar buttons and titles
// it listen for changes in the navigationChannel and reactively
// update buttons and titles properties.

export default class ChannelResponder extends PureComponent {
  static propTypes = {
    channel: React.PropTypes.object.isRequired,
    children: React.PropTypes.node.isRequired,
    properties: React.PropTypes.object.isRequired
  };

  state = {};

  componentWillMount() {
    this.channel = this.props.channel;

    var set = (property, value) => {
      var s = {};
      s[property] = value;
      this.setState(s);
    };

    this.listeners = _.map(this.props.properties, (property, key) => {
      set(property, this.channel.get(key));

      return this.channel.addListener(key, (value) => {
        set(property, value);
      });
    });
  }

  componentWillUnmount() {
    this.props.channel.set('ref', null);
    _.each(this.listeners, l => l.remove());
  }

  render() {
    if (!this.props.children)
      return null;

    return React.cloneElement(this.props.children, {...this.state, ref: (r) => this.props.channel.set('ref', r)});
  }
}