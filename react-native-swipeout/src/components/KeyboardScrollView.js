import React, { Component } from 'react';
import {ScrollView, Keyboard, TextInput, Platform} from 'react-native';
import {autobind} from 'core-decorators';
import _ from 'lodash';
import focusEmitter from './Form/focusEmitter';
import EventEmitter from 'EventEmitter';

// handles automatically scrolling to the textInput
// support multiple instance in multiple views

export default class KeyboardScrollView extends React.Component {
  static propTypes = {
    onScroll: React.PropTypes.func,
    onLayout: React.PropTypes.func,
    scrollEnabled: React.PropTypes.bool,
    scrollToTopOnBlur: React.PropTypes.bool,
    space: React.PropTypes.number
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

    this.focus = refNode || node;

    this.ee.emit('focus');

    const scrollView = this.refs.scrollview.getScrollResponder();
    this.scrollTimeout = setTimeout(() => {
      scrollView.scrollResponderScrollNativeHandleToKeyboard(
        this.focus, this.props.space || 100, true
      );
    }, 220);
    this.refs.scrollview.setNativeProps({
      scrollEnabled: true
    });
  }

  scrollToTop() {
    this.refs.scrollview.scrollTo({x: 0, y: 0, animated: false});
  }

  render() {
    return (
      <ScrollView
        keyboardShouldPersistTaps="always"
        {...this.props}
        // ensure compatibility with KeyboardPaddingView
        onLayout={(e) => {
          if (this.focus)
            this.refs.scrollview.getScrollResponder().scrollResponderScrollNativeHandleToKeyboard(
              this.focus, this.props.space || 100, true
            );

          if (this.props.onLayout)
            this.props.onLayout(e);
        }}
        onScroll={(e) => {
          if (this.props.onScroll)
            return this.props.onScroll(e);
        }}
        ref="scrollview"
      />
    );
  }
}
