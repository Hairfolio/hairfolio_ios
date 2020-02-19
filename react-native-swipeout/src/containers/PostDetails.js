import { observer } from 'mobx-react';
import React from 'react';
import { StatusBar, View } from 'react-native';
import ServiceBackend from '../backend/ServiceBackend';
import NavigatorStyles from '../common/NavigatorStyles';
import PostDetailsContent from '../components/feed/PostDetailsContent';
import PureComponent from '../components/PureComponent';
import { showLog } from '../helpers';
import PostDetailStore from '../mobx/stores/PostDetailStore';
import TempCommonStore from '../mobx/stores/TempCommonStore';
let postDetails;

@observer
export default class PostDetails extends PureComponent {
  static navigatorStyle = {
    drawUnderTabBar: true,
  }

  constructor(props) {
    super(props);
    this.props.navigator.toggleTabs({
      to: 'shown',
    });
    StatusBar.setBarStyle('dark-content');
  }

  componentDidMount(props) {
    this.props.navigator.setOnNavigatorEvent((e) => {
      this.onNavigatorEvent(e);
    });


    this.callApi();
  }

  onNavigatorEvent(event) {
    switch (event.id) {

      case 'willDisappear':
        this.props.navigator.toggleTabs({
          to: 'shown',
        });
        break;
      case 'willAppear':
        this.callApi();
        break;
      case 'bottomTabSelected':
        showLog("bottomTabSelected ==>");
        // if (this.props.from_search) {
        //   this.props.navigator.resetTo({
        //     screen: 'hairfolio.Search',
        //     animationType: 'fade',
        //     navigatorStyle: NavigatorStyles.tab
        //   });
        // } else if (this.props.from_feed) {
        //   this.props.navigator.resetTo({
        //     screen: 'hairfolio.Feed',
        //     animationType: 'fade',
        //     navigatorStyle: NavigatorStyles.tab
        //   });
        // } else if (this.props.from_profile) {
        //   this.props.navigator.resetTo({
        //     screen: 'hairfolio.Profile',
        //     animationType: 'fade',
        //     navigatorStyle: NavigatorStyles.tab
        //   });
        // } else if (this.props.from_star) {
        //   this.props.navigator.resetTo({
        //     screen: 'hairfolio.Favourites',
        //     animationType: 'fade',
        //     navigatorStyle: NavigatorStyles.tab
        //   });
        // }

        break;
      case 'bottomTabReselected':
        showLog("bottomTabReselected ==>");
        break;
      default:
        break;
    }
  }

  async callApi() {
    
    // alert("POST DETAIL STORE ==> "+JSON.stringify(PostDetailStore.unique_code))

    let store = PostDetailStore.currentStore;
    PostDetailStore.unique_code = this.props.unique_code
    postDetails = await ServiceBackend.get(`posts/${store.post.id}`);
    TempCommonStore.actualServerProducts = postDetails.post.products;
  }

  checkVal() {

    if (this.props.from_search) {
      return 'from_search';
    } else if (this.props.from_feed) {
      return 'from_feed';
    } else if (this.props.from_profile) {
      return 'from_profile';
    } else if (this.props.from_star) {
      return 'from_star';
    }

  }

  render() {   
    return (
      <View style={{
        flex: 1,
      }}>
        <PostDetailsContent navigator={this.props.navigator} value={postDetails} from={"undefined"} />
      </View>
    );
  }
};
