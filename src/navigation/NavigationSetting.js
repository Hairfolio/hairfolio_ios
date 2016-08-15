import React from 'react';
import {View, InteractionManager} from 'react-native';
import EventEmitter from 'EventEmitter';
import _ from 'lodash';
import PureComponent from '../components/PureComponent';

import StaticContainer from '../components/StaticContainer';
import ChannelEmitter from '../components/Channel/ChannelEmitter';

import appEmitter from '../appEmitter';


export default class NavigationSetting extends PureComponent {
  static propTypes = {
    children: React.PropTypes.node,
    forceUpdateEvents: React.PropTypes.array,
    onBlur: React.PropTypes.func,
    onFocus: React.PropTypes.func,
    onWillBlur: React.PropTypes.func,
    onWillFocus: React.PropTypes.func,
    style: View.propTypes.style,
    updateOnWillFocus: React.PropTypes.bool,
    waitForFocus: React.PropTypes.bool
  };

  static contextTypes = {
    navigationChannels: React.PropTypes.array.isRequired,
    onBlurRegistrations: React.PropTypes.array.isRequired,
    onFocusRegistrations: React.PropTypes.array.isRequired,
    onWillBlurRegistrations: React.PropTypes.array.isRequired,
    onWillFocusRegistrations: React.PropTypes.array.isRequired
  };

  static childContextTypes = {
    focusEmitter: React.PropTypes.object.isRequired
  };

  static defaultProps = {
    onBlur: () => {},
    onFocus: () => {},
    onWillBlur: () => {},
    onWillFocus: () => {},
    updateOnWillFocus: false,
    waitForFocus: false
  };

  constructor(props) {
    super(props);

    this.emitter = new EventEmitter();

    this.state = {
      display: !props.waitForFocus
    };
  }

  getChildContext() {
    return {
      focusEmitter: this.emitter
    };
  }

  componentWillMount() {
    this.listeners = [
      _.last(this.context.onFocusRegistrations)(() => {
        this.isFocused = true;
        this.setState({isFocused: true, display: true});
        this.props.onFocus();
        this.emitter.emit('focus');
      }),
      _.last(this.context.onWillFocusRegistrations)(() => {
        this.isFocused = false;
        this.props.onWillFocus();
        this.emitter.emit('willfocus');

        if (!this.props.updateOnWillFocus)
          return this.setState({isFocused: false});

        this.setState({isFocused: true});

        InteractionManager.runAfterInteractions(() => {
          requestAnimationFrame(() => {
            if (!this.mounted)
              return;

            this.setState({isFocused: this.isFocused});
          });
        });

      }),
      _.last(this.context.onBlurRegistrations)(() => {
        this.isFocused = false;
        this.setState({isFocused: false});
        this.props.onBlur();
        this.emitter.emit('blur');
      }),
      _.last(this.context.onWillBlurRegistrations)(() => {
        this.isFocused = false;
        this.setState({isFocused: false});
        this.props.onWillBlur();
        this.emitter.emit('willblur');
      })
    ];

    this.listeners.concat(_.map(this.props.forceUpdateEvents, event =>
      appEmitter.addListener(event, () => this.refs.sc.forceUpdate())
    ));
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
    _.each(this.listeners, l => l.remove());
  }

  forceUpdateContent() {
    this.refs.sc.forceUpdate();
  }

  render() {
    return (
      <View style={this.props.style}>
        <ChannelEmitter
          channel={_.last(this.context.navigationChannels)}
          {..._.omit(this.props, _.keys(this.constructor.propTypes))}
        />
        <StaticContainer ref="sc" shouldUpdate={this.state.isFocused}>
          {this.state.display && this.props.children}
        </StaticContainer>
      </View>
    );
  }
}
