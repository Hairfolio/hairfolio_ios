import { h } from 'Hairfolio/src/helpers';
import { observer } from 'mobx-react';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import NavigatorStyles from '../common/NavigatorStyles';
import LoadingScreen from '../components/LoadingScreen';
import LinkTabBar from '../components/post/LinkTabBar';
import PureComponent from '../components/PureComponent';
import ShareFollowers from '../components/ShareFollowers';
import ShareMessage from '../components/ShareMessage';
import WhiteHeader from '../components/WhiteHeader';
import AddBlackBookStore from '../mobx/stores/AddBlackBookStore';
import CreatePostStore from '../mobx/stores/CreatePostStore';
import ShareStore from '../mobx/stores/ShareStore';
import { COLORS, FONTS } from '../style';
import { showAlert } from '../helpers';

@observer
export default class Share extends PureComponent {
  constructor(props) {
    super(props);
    AddBlackBookStore.load();
    ShareStore.resetButtons();
    this.state={
      active_index:0
    }

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    switch(event.id) {
      case 'bottomTabSelected':   
        CreatePostStore.reset();
        CreatePostStore.resetEdit();

        this.props.navigator.resetTo({
          screen: 'hairfolio.CreatePost',
          animationType: 'fade',
          navigatorStyle: NavigatorStyles.tab
        }); 
            
        break;
      default:
        break;
    }
  }

  handleChangeScreen = ({ i }) => {
    this.setState({
      active_index : i
    })
  }

  render() {
    return (
      
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.WHITE
        }}
      >
        <WhiteHeader
          onLeft={
            () => {
              this.props.navigator.pop({ animated: true });
            }
          }
          title='Share To'
          onRenderRight={
            () => <TouchableOpacity
              style = {{
                flexDirection: 'row',
                alignItems: 'center'
              }}
              onPress={() => {
                console.log('this.props.fromScreen==>' + JSON.stringify(this.props.fromScreen))
                console.log('this.props.fromScreen==>1 ' + JSON.stringify(CreatePostStore.postId))
                // return;
                if(CreatePostStore.gallery.description.length > 0)
                {
                  if (this.state.active_index == 1) {
                    if (ShareStore.sendStore.selectedItems.length > 0) {
                      CreatePostStore.arrWaterMarkedImages = []
                      CreatePostStore.arrCloudUrl = []
                      CreatePostStore.postPost(this.props.navigator);
                    } else {
                      alert('Please select atleast one user to continue');
                    }
                  } else {
                    CreatePostStore.arrWaterMarkedImages = []
                    CreatePostStore.arrCloudUrl = []
                    if (this.props.fromScreen || CreatePostStore.postId) {
                      CreatePostStore.editPost(this.props.navigator);
                      return;
                    }
                    CreatePostStore.postPost(this.props.navigator);
                  }
                }
                else
                {
                  showAlert("Please add post description")
                }
                
              }}
            >
              <Text
                style={{
                  flex: 1,
                  fontFamily: FONTS.Regular,
                  fontSize: h(34),
                  color: COLORS.DARK,
                  textAlign: 'right'
                }}
              >
                Post
              </Text>
            </TouchableOpacity>
          }
        />

        <ScrollableTabView
          renderTabBar={() => <LinkTabBar />}
          initialPage={0}
          onChangeTab={this.handleChangeScreen}
          refs={e => ShareStore.tabView = e}
        >
          <ShareFollowers tabLabel="Followers" navigator={this.props.navigator} />
          <ShareMessage tabLabel='Send Direct' navigator={this.props.navigator} />
        </ScrollableTabView>
        <LoadingScreen style={{opacity: 0.6}} store={CreatePostStore} />
      </View>
    );
  }
};
