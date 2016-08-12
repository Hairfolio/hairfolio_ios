import React from 'react';
import {ScrollView, Keyboard, TextInput, Platform} from 'react-native';
import {autobind} from 'core-decorators';
import _ from 'lodash';
import focusEmitter from './Form/focusEmitter';
import PureComponent from './PureComponent';
import EventEmitter from 'EventEmitter';

// handles automatically scrolling to the textInput
// support multiple instance in multiple views

export default class KeyboardScrollView extends PureComponent {
  static propTypes = {
    onScroll: React.PropTypes.func,
    scrollEnabled: React.PropTypes.bool,
    scrollToTopOnBlur: React.PropTypes.bool,
    space: React.PropTypes.number
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired,
    currentRoutes:  React.PropTypes.array.isRequired,
    scrolling:  React.PropTypes.func.isRequired
  };

  static childContextTypes = {
    kbScrollViewEmitter: React.PropTypes.object
  };

  getChildContext() {
    return {
      kbScrollViewEmitter: this.ee
    };
  }

  componentDidMount() {
    var verb = Platform.OS === 'ios' ? 'Will' : 'Did';
    this.listeners = [
      focusEmitter.onFocus(this.onTextInputFocus),
      Keyboard.addListener(`keyboard${verb}Hide`, this.onTextInputBlur)
    ];
  }

  componentWillUnmount() {
    clearTimeout(this.scrollTimeout);

    _.each(this.listeners, l => l.remove());
  }

  ee = new EventEmitter();

  @autobind
  onTextInputBlur() {
    if (!this.focus)
      return;

    this.focus = false;

    this.ee.emit('blur');

    if (this.props.scrollToTopOnBlur)
      this.refs.scrollview.getScrollResponder().scrollTo({x: 0, y: 0, animated: true});

    this.refs.scrollview.setNativeProps({
      scrollEnabled: this.props.scrollEnabled
    });
  }

  @autobind
  onTextInputFocus({refNode}) {
    const node = TextInput.State.currentlyFocusedField();
    if (!node)
      return;

    var eligible = _.every(this.context.currentRoutes, (route, i) => {
      return route === this.context.navigators[i].nextRoute;
    });
    if (!eligible)
      return;

    this.focus = true;

    this.ee.emit('focus');

    const scrollView = this.refs.scrollview.getScrollResponder();
    this.scrollTimeout = setTimeout(() => {
      scrollView.scrollResponderScrollNativeHandleToKeyboard(
        refNode || node, this.props.space || 100, true
      );
    }, 220);
    this.refs.scrollview.setNativeProps({
      scrollEnabled: true
    });
  }

  render() {
    return (
      <ScrollView
        keyboardShouldPersistTaps
        {...this.props}
        onScroll={(e) => {
          // see src/index for the necessity of this
          this.context.scrolling(true);
          setTimeout(() => {
            this.context.scrolling(false);
          }, 300);

          if (this.props.onScroll)
            return this.props.onScroll(e);
        }}
        ref="scrollview"
      />
    );
  }
}
