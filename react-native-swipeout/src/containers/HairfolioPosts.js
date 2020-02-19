import { observer } from 'mobx-react';
import React from 'react';
import { View } from 'react-native';
import NavigatorStyles from '../common/NavigatorStyles';
import BlackHeader from '../components/BlackHeader';
import GridList from '../components/GridList';
import PureComponent from '../components/PureComponent';
import HairfolioPostStore from '../mobx/stores/HairfolioPostStore';
var temp = '';
const Content = observer(({ store, navigator, from }) => {
  if (from) {
    temp = 'from_star';
  } else {
    temp = 'from_profile';
  }


  return (
    <View style={{
      flex: 1,
    }}>
      <BlackHeader
        onLeft={() => navigator.pop({ animated: true })}
        title={store.title} />
      <GridList
        navigator={navigator}
        noElementsText='There are no posts with this tag'
        store={store}
        from={temp} />
    </View>
  );
});

export default class TagPosts extends PureComponent {
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'bottomTabSelected':

        // if (this.props.from_star) {
        //   this.props.navigator.resetTo({
        //     screen: 'hairfolio.Favourites',
        //     animationType: 'fade',
        //     navigatorStyle: NavigatorStyles.tab
        //   });

        // } else {
        //   this.props.navigator.resetTo({
        //     screen: 'hairfolio.Profile',
        //     animationType: 'fade',
        //     navigatorStyle: NavigatorStyles.tab
        //   });
        // }

        break;
      default:
        break;
    }
  }
  render() {
    return (
      <Content store={HairfolioPostStore} navigator={this.props.navigator} from={(this.props.from_star) ? this.props.from_star : null} />
    );
  }
};
