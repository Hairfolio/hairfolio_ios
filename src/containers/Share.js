import React from 'react';
import PureComponent from '../components/PureComponent';
import {View, TouchableOpacity, Text} from 'react-native';
import { observer } from 'mobx-react';
import {COLORS, FONTS, SCALE} from '../style';
import {STATUSBAR_HEIGHT} from '../constants';
import WhiteHeader from '../components/WhiteHeader';
import LinkTabBar from '../components/post/LinkTabBar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ShareFollowers from '../components/ShareFollowers';
import ShareMessage from '../components/ShareMessage';
import AddBlackBookStore from '../mobx/stores/AddBlackBookStore';
import LoadingScreen from '../components/LoadingScreen';
import CreatePostStore from '../mobx/stores/CreatePostStore';
import ShareStore from '../mobx/stores/ShareStore';
import { h } from 'Hairfolio/src/helpers';
import BannerErrorContainer from '../components/BannerErrorContainer';

@observer
export default class Share extends PureComponent {
  constructor(props) {
    super(props);
    AddBlackBookStore.load();
    ShareStore.resetButtons();
    this.state={
      active_index:0
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

                if(this.state.active_index == 1){
                  if(ShareStore.sendStore.selectedItems.length > 0){
                    CreatePostStore.postPost(this.props.navigator);                  
                  }else{                  
                    alert('Please select atleast one user to continue');
                  }
                }else{
                  CreatePostStore.postPost(this.props.navigator);    
                }
              }}
            >
              <Text
                style={{
                  flex: 1,
                  fontFamily: FONTS.Regular,
                  fontSize: h(34),
                  color: '#393939',
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
