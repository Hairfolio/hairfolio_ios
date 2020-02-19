import { observer } from 'mobx-react';
import React from 'react';
import { View } from 'react-native';
import NavigatorStyles from '../common/NavigatorStyles';
import GridList from '../components/GridList';
import PureComponent from '../components/PureComponent';
import WhiteHeader from '../components/WhiteHeader';
import TagPostStore from '../mobx/stores/TagPostStore';
import { showLog } from '../helpers';

const Content = observer(({ store, navigator }) => {
  return (
    <View style={{
      flex: 1,
    }}>
      <WhiteHeader
        onLeft={() => store.myBack()}
        title={store.title}
        numberOfLines={1}
      />
      <GridList
        navigator={navigator}
        noElementsText='There are no posts with this tag'
        store={store} from={'from_feed'} />
    </View>
  );
});

@observer
export default class TagPosts extends PureComponent {
  constructor(props) {
    super(props)
    this.props.navigator.setOnNavigatorEvent((e) => {
      this.onNavigatorEvent(e);
    });
  }

  onNavigatorEvent(event) {
    if (event.id == 'bottomTabSelected') {
      // if (this.props.from_feed) {
      //   this.props.navigator.resetTo({
      //     screen: 'hairfolio.Feed',
      //     animationType: 'fade',
      //     navigatorStyle: NavigatorStyles.tab
      //   });

      // }
      // if (this.props.from_search) {
      //   this.props.navigator.resetTo({
      //     screen: 'hairfolio.Search',
      //     animationType: 'fade',
      //     navigatorStyle: NavigatorStyles.tab
      //   });
      // }

    }
    if (event.id == 'bottomTabReselected') {
      showLog("bottomTabReselected ==>");
    }
  }

  render() {
    if (TagPostStore.isEmpty) {
      return null;
    }
    let currentStore = TagPostStore.currentStore;
    if (currentStore == null) return <View />;
    return (
      <Content
        store={currentStore}
        navigator={this.props.navigator}
      />
    );
  }
};
