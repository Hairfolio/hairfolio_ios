import React from 'react';
import _ from 'lodash';
import { View } from 'react-native';

export default class ScrollViewProxy extends React.Component {
  static contextTypes = {
    onWrappingScrollViewContentSizeChange: React.PropTypes.func.isRequired,
    onWrappingScrollViewLayout: React.PropTypes.func.isRequired,
    onWrappingScrollViewScroll: React.PropTypes.func.isRequired,
    getWrappingScrollView: React.PropTypes.func.isRequired,
    navigators: React.PropTypes.array.isRequired,
    currentRoutes: React.PropTypes.array.isRequired,
    focusEmitter: React.PropTypes.object.isRequired,
  };

  componentWillMount() {
    this.listeners = [
      this.context.onWrappingScrollViewContentSizeChange((...args) => {
        if (this.focused) {
          this.props.onContentSizeChange(...args);
        }
      }),
      this.context.onWrappingScrollViewLayout((...args) => {
        if (this.focused) {
          this.props.onLayout(...args);
        }
      }),
      this.context.onWrappingScrollViewScroll((...args) => {
        if (this.focused) {
          // todo add the correct offset
          this.props.onScroll(...args);
        }
      }),
      this.context.focusEmitter.addListener('focus', () => {
        this.focused = true;
      }),
      this.context.focusEmitter.addListener('willblur', () => {
        this.focused = false;
      }),
    ];
    this.props.onChildrenLength(this.getChildrenLength(this.props));
  }

  componentWillReceiveProps(newProps) {
    if (this.getChildrenLength(this.props) !== this.getChildrenLength(newProps)) {
      this.props.onChildrenLength(this.getChildrenLength(newProps));
    }
  }

  componentWillUnmount() {
    _.each(this.listeners, l => l.remove());
  }

  getChildrenLength(props) {
    return ((props.children || [[], [], []])[1] || []).length;
  }

  getInnerViewNode(...args) {
    return this.context.getWrappingScrollView().getInnerViewNode(...args);
  }
  getScrollResponder(...args) {
    return this.context.getWrappingScrollView().getScrollResponder(...args);
  }
  setNativeProps(...args) {
    return this.context.getWrappingScrollView().setNativeProps(...args);
  }
  scrollTo(...args) {
    return this.context.getWrappingScrollView().scrollTo(...args);
  }

  render() {
    return <View
      onLayout={(e) => {
        this.props.onLayout(e);
      }}
    >
      {this.props.children}
    </View>;
  }
}