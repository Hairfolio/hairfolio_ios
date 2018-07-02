import {
  _, // lodash
  v4,
  observable,
  computed,
  moment,
  action,
  observer, // mobx
  h,
  FONTS,
  autobind,
  React, // react
  Component,
  windowWidth,
  windowHeight,
  // react-native components
  AlertIOS,
  Modal,  
  ScrollView,  
  PickerIOS, Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'Hairfolio/src/helpers';

import {ActivityIndicator,ListView,} from 'react-native';
import ServiceBackend from '../../backend/ServiceBackend';
import Activity from '../../mobx/stores/Activity';
import ActivityItem from './ActivityItem';
import ActivityFollowingStore from '../../mobx/stores/ActivityFollowingStore';
import InfiniteScroll from 'react-native-infinite-scroll';
var rows = [];

@observer
export default class ActivityFollowing extends Component {  

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      singleItem: {},
      next_page: null,
      nextPage: 1,
      isLoadingNextPage: false,
      refreshing: false,
      data: ["China","Korea","Singapore","Malaysia"],
      dataSource: ds
    };
    
    if (this.props.navigator) {
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    this.loadMorePage = this.loadMorePage.bind(this,this.state.dataSource);
    this.fetchNextData = this.fetchNextData.bind(this,this.state.dataSource);
    
  }

  componentWillMount(){
    console.log("componentWillMount ==>");
    this.fetchNextData()
  }

  componentWillUnmount(){
    console.log("componentWillUnmount ==>")
  }

  async fetchNextData() {


    if (!this.state.isLoadingNextPage && this.state.nextPage != null) {

      this.setState({
        isLoadingNextPage: true
      });

      var meta_obj = {};

      console.log(`link ==> notifications?following=true&page=${this.state.nextPage}`);

      let result = (await ServiceBackend.get(`notifications?following=true&page=${this.state.nextPage}`));
      
      arr = result.notifications;
      meta_obj = result.meta;
      arr = arr.filter(e => e.notifiable_type != 'NilClass');

      let res = await Promise.all(
      arr.map(
        async e => {
          let a = new Activity();
          return await a.init(e);
        }
      )
      )
      if(res){

        if(rows.length > 0){
          rows.push.apply(rows, res);
        }else{
          rows = res;
        }        

        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(rows),
          nextPage: meta_obj.next_page,
          isLoadingNextPage: false
        });
      }
    }
  }

  onNavigatorEvent(event) {
    if (event.id == 'willAppear') {
      this.fetchNextData();
    }
  }  

  loadMorePage(){
    this.fetchNextData();
  }

  render(){

    let store = ActivityFollowingStore;

    if (store.isLoading) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size='large' />
        </View>
      );
    }
  
    if (store.elements.length == 0) {
      return (
        <View style={{flex: 1}}>
          <Text
            style= {{
              paddingTop: h(38),
              fontSize: h(34),
              textAlign: 'center',
              fontFamily: FONTS.BOOK_OBLIQUE
            }}
          >
            No Activity to show
          </Text>
        </View>
      );
    }

    return (
      <InfiniteScroll
        horizontal={false}  //true - if you want in horizontal
        >
          <ListView
          style={{height:windowHeight}}
          onEndReached={this.fetchNextData}
          onEndReachedThreshold={10}
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={(p) => <ActivityItem isMe={false} key={p.key} store={p} navigator={this.props.navigator} from={'from_star'} />}
          renderFooter={
            () => {
              if (this.state.nextPage != null) {
                return (
                  <View style={{flex: 1, paddingVertical: 20, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator size='large' />
                  </View>
                )
              } else {
                return <View />;
              }
            }
          }
        />
      </InfiniteScroll>
    );
  }
  
};
