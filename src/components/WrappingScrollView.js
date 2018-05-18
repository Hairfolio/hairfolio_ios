import React from 'react';
import { ScrollView } from 'react-native';
import EventEmitter from 'EventEmitter';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default class WrappingScrollView extends React.Component {

  static childContextTypes = {
    onWrappingScrollViewContentSizeChange: React.PropTypes.func.isRequired,
    onWrappingScrollViewLayout: React.PropTypes.func.isRequired,
    onWrappingScrollViewScroll: React.PropTypes.func.isRequired,
    getWrappingScrollView: React.PropTypes.func.isRequired,
  };

  state = {};

  getChildContext() {
    return {
      getWrappingScrollView: () => this._sv,
      onWrappingScrollViewLayout: (handler) => {
        return this.ee.addListener('layout', handler);
      },
      onWrappingScrollViewContentSizeChange: (handler) => {
        return this.ee.addListener('contentSize', handler);
      },
      onWrappingScrollViewScroll: (handler) => {
        return this.ee.addListener('scroll', handler);
      },
    };
  }

  ee = new EventEmitter();

  scrollTo(...args) {
    this._sv.scrollTo(...args);
  }

  render() {
    return (<KeyboardAwareScrollView
      {...this.props}
      onContentSize={(...args) => {
        if (this.props.onContentSize) {
          this.props.onContentSize(...args);
        }
        this.ee.emit('contentSize', ...args);
      }}
      onLayout={(...args) => {
        if (this.props.onLayout) {
          this.props.onLayout(...args);
        }
        this.ee.emit('layout', ...args);
      }}
      onScroll={(...args) => {
        if (this.props.onScroll) {
          this.props.onScroll(...args);
        }
        this.ee.emit('scroll', ...args);
      }}
      ref={(_sv) => { this._sv = _sv; }}

      scrollEventThrottle={128}
    >
      {this.props.children}
    </KeyboardAwareScrollView>);
  }
};
