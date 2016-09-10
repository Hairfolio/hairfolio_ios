import React from 'react';
import {ListView} from 'react-native';
import _ from 'lodash';
import PureComponent from './PureComponent';

// list with a workaround for bad rerenders and white renders
// when jumping between views

export default class SafeList extends PureComponent {
  static propTypes = {
    contentOffset: React.PropTypes.object,
    dataSource: React.PropTypes.object.isRequired,
    dataSourceRowIdentities: React.PropTypes.array,
    onScroll: React.PropTypes.func,
    pageSize: React.PropTypes.number.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired,
    currentRoutes: React.PropTypes.array.isRequired,
    focusEmitter: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    var ds = new ListView.DataSource({
      rowHasChanged: props.rowHasChanged || ((r1, r2) => {
        return r1 !== r2;
      }),
      sectionHeaderHasChanged: () => false
    });

    var dataSource = ds.cloneWithRowsAndSections(props.dataSource, props.dataSourceSectionIdentities, props.dataSourceRowIdentities);

    this.state = {
      nbRows: dataSource.getRowCount(),
      dataSource,
      nb: 0
    };
  }

  componentWillMount() {
    this.listeners = [
      this.context.focusEmitter.addListener('focus', () => {
        this.isActive();
      }),
      this.context.focusEmitter.addListener('willblur', () => {
        this.isInactive();
      })
    ];
  }

  componentDidMount() {
    if (_.last(this.context.navigators).nextRoute === _.last(this.context.currentRoutes))
      this.isActive();
  }

  componentWillReceiveProps(props) {
    var dataSource = this.state.dataSource.cloneWithRowsAndSections(props.dataSource, props.dataSourceSectionIdentities, props.dataSourceRowIdentities);
    var nbRows = dataSource.getRowCount();

    if (nbRows !== this.state.nbRows)
      this.refs.listView.getScrollResponder().scrollTo({
        y: 0,
        x: 0,
        animated: false
      });

    this.setState({
      nbRows,
      dataSource
    });
  }

  componentWillUnmount() {
    this.isInactive();
    _.each(this.listeners, l => l.remove());
  };

  blankWorkaround() {
    if (this.refs.listView) {
      let listViewScrollView = this.refs.listView.getScrollResponder();

      var offset = this.refs.listView.scrollProperties.offset;
      if (!this.firstScrolled)
        offset = offset - (this.props.contentOffset || {y: 0}).y;

      listViewScrollView.scrollTo({
        y: offset - 1,
        x: 0,
        animated: false
      });
      listViewScrollView.scrollTo({
        y: offset,
        x: 0,
        animated: false
      });
    }
  }

  isActive() {
    if (this.active)
      return;

    this.active = true;
    this.blankWorkaround();
  }

  isInactive() {
    this.active = false;
  }

  setNativeProps(props) {
    this.refs.listView.setNativeProps(props);
  }

  scrollToTop() {
    this.refs.listView.getScrollResponder().scrollTo({
      y: 0,
      x: 0,
      animated: true
    });
  }

  render() {
    return (<ListView
      {...this.props}
      dataSource={this.state.dataSource}
      enableEmptySections
      onScroll={(e) => {
        this.firstScrolled = true;

        if (this.props.onScroll)
          this.props.onScroll(e);
      }}
      ref="listView"
    />);
  }

}
