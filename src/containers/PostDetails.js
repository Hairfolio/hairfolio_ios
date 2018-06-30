import React from 'react';
import PureComponent from '../components/PureComponent';
import {
  CameraRoll,
  ScrollView,
  StatusBar,
  View, Text, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Image} from 'react-native';
import {COLORS, FONTS, h, SCALE} from 'Hairfolio/src/style';
import {observer} from 'mobx-react';
import autobind from 'autobind-decorator'
import _ from 'lodash';
import FollowButton from '../components/FollowButton';
import StarGiversStore from '../mobx/stores/StarGiversStore';
import {STATUSBAR_HEIGHT, POST_INPUT_MODE} from '../constants';
import LoadingScreen from '../components/LoadingScreen';
import BlackHeader from '../components/BlackHeader';
import PostDetailsContent from '../components/feed/PostDetailsContent';
import ServiceBackend from '../backend/ServiceBackend';
import PostDetailStore from '../mobx/stores/PostDetailStore';
import NavigatorStyles from '../common/NavigatorStyles';
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
    StatusBar.setBarStyle('light-content');
  }

  componentDidMount(props) {
    this.props.navigator.setOnNavigatorEvent((e) => {
      this.onNavigatorEvent(e);
    });
    this.callApi();
  }

  onNavigatorEvent(event) {
    switch(event.id) {
      case 'willDisappear':
        this.props.navigator.toggleTabs({
          to: 'shown',
        });
        break;
      case 'willAppear':
        // alert("hi")
        this.callApi();
        break;
      case 'bottomTabSelected':
        console.log("bottomTabSelected ==>");
        if(this.props.from_search){          
          this.props.navigator.resetTo({
            screen: 'hairfolio.Search',
            animationType: 'fade',
            navigatorStyle: NavigatorStyles.tab
          });  
        }else if(this.props.from_feed){          
          this.props.navigator.resetTo({
            screen: 'hairfolio.Feed',
            animationType: 'fade',
            navigatorStyle: NavigatorStyles.tab
          });  
        }else if(this.props.from_profile){          
          this.props.navigator.resetTo({
            screen: 'hairfolio.Profile',
            animationType: 'fade',
            navigatorStyle: NavigatorStyles.tab
          });  
        }
              
        break;
      case 'bottomTabReselected':
        console.log("bottomTabReselected ==>");
        break;
      default:
        break;
    }
  }

  async callApi(){
    // let store = PostDetailStore.currentStore;
    // console.log("")
    let store = PostDetailStore.currentStore;
    postDetails = await ServiceBackend.get(`posts/${store.post.id}`);
    // console.log('postDetails==>'+JSON.stringify(postDetails))
    // alert('postDetails==>'+postDetails)
  }

  checkVal(){

    if(this.props.from_search){          
      return 'from_search';
    }else if(this.props.from_feed){          
      return 'from_feed';
    }else if(this.props.from_profile){          
      return 'from_profile';
    }

  }

  render() {
    return (
      <View style={{
        flex: 1,
      }}>
      <PostDetailsContent navigator={this.props.navigator} value={postDetails} from={this.checkVal()}/>
      </View>
    );
  }
};
