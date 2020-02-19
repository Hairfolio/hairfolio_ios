import { Component, FONTS, h, observer, React, Text, View, windowHeight } from 'Hairfolio/src/helpers';
import { ActivityIndicator, ListView } from 'react-native';
import InfiniteScroll from 'react-native-infinite-scroll';
import ServiceBackend from '../../backend/ServiceBackend';
import Activity from '../../mobx/stores/Activity';
import ActivityFollowingStore from '../../mobx/stores/ActivityFollowingStore';
import ActivityItem from './ActivityItem';
import { showLog, showAlert } from '../../helpers';

var rows = [];

@observer
export default class ActivityFollowing extends Component { 
  
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
      <View style={{flex:1}}>
        {/* <InfiniteScroll
        horizontal={false}  //true - if you want in horizontal
        > */}
        <View style={{height: (windowHeight/2)-20}}>
          <ListView
          onEndReached={() => { store.loadNextPage() }}
          onEndReachedThreshold={20}
          enableEmptySections={true}
          dataSource={store.dataSource}
          renderRow={(p) => 
            { return (p.user.name) ?
               <ActivityItem isMe={false} key={p.key} store={p} navigator={this.props.navigator} from={'from_star'} />
              :
              <View/>
            }
          }
          // renderRow={(p) => <ActivityItem isMe={true} key={p.key} store={p} navigator={this.props.navigator} from={'from_star'} />}
          renderFooter={
            () => {
              showLog("store.nextPage following==> " + store.nextPage);
              showLog("store.isLoadingNextPage ==> " + store.isLoadingNextPage);
              if (store.nextPage != null) {
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
        </View>
      {/* </InfiniteScroll> */}
      </View>
    );
  }

  // constructor(props) {
  //   super(props);
  //   const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

  //   this.state = {
  //     singleItem: {},
  //     next_page: null,
  //     nextPage: 1,
  //     isLoadingNextPage: false,
  //     refreshing: false,
  //     data: ["China","Korea","Singapore","Malaysia"],
  //     dataSource: ds
  //   };
    
  //   if (this.props.navigator) {
  //     this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  //   }

  //   this.loadMorePage = this.loadMorePage.bind(this,this.state.dataSource);
  //   this.fetchNextData = this.fetchNextData.bind(this,this.state.dataSource);
    
  // }

  // componentWillMount(){
  //   this.fetchNextData()
  // }

  // loadNotifications(){
  //   rows = [];
  //   let ds = new ListView.DataSource({
  //     rowHasChanged: (r1, r2) => r1 !== r2,
  //   }); 
  //   this.setState({
  //     nextPage:1,
  //     isLoadingNextPage: false,
  //     dataSource: ds.cloneWithRows(rows),
  //   });
  //   this.fetchNextData();
  // }

  // async fetchNextData() {
  //   showLog('nextPage ==> ' + this.state.nextPage)

  //   // if (this.state.nextPage != null) {
  //     if(!this.state.isLoadingNextPage && this.state.nextPage != null) {
  //     this.setState({
  //       isLoadingNextPage: true
  //     });

  //     let meta_obj = {};

  //     let result = (await ServiceBackend.get(`notifications?following=true&page=${this.state.nextPage}`));
  //     arr = result.notifications;
  //     if(result.meta){
  //       meta_obj = result.meta;
  //       this.setState({
  //         nextPage: meta_obj.next_page
  //       });
  //     } else {
  //       this.setState({
  //         nextPage: null
  //       });
  //     }
     
  //     showLog("Next page ==> " + this.state.nextPage)
  //     arr = arr.filter(e => e.notifiable_type != 'NilClass');
  //     let res = await Promise.all(
  //     arr.map(
  //       async e => {
  //         let a = new Activity();
  //         return await a.init(e);
  //       }
  //     )
  //     )
  //     if(res){

  //       if(rows.length > 0){
  //         rows.push.apply(rows, res);
  //       }else{
  //         rows = res;
  //       }        

  //       this.setState({
  //         dataSource: this.state.dataSource.cloneWithRows(rows),
  //         isLoadingNextPage: false
  //       });
  //     }
  //   }
  // }

  // onNavigatorEvent(event) {
  //   showLog("onNavigatorEvent Following==> " + event.id)
  //   if (event.id == 'willAppear') {
  //     // this.fetchNextData();
  //   }
  //   else if (event.id == 'didAppear') {
  //     this.loadNotifications();
  //   }
  // }  

  // loadMorePage(){
  //   this.fetchNextData();
  // }

  // render(){
  //   let store = ActivityFollowingStore;

  //   if (store.isLoading) {
  //     return (
  //       <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
  //         <ActivityIndicator size='large' />
  //       </View>
  //     );
  //   }
  
  //   if (store.elements.length == 0) {
  //     return (
  //       <View style={{flex: 1}}>
  //         <Text
  //           style= {{
  //             paddingTop: h(38),
  //             fontSize: h(34),
  //             textAlign: 'center',
  //             fontFamily: FONTS.BOOK_OBLIQUE
  //           }}
  //         >
  //           No Activity to show
  //         </Text>
  //       </View>
  //     );
  //   }

  //   return (
  //     <InfiniteScroll
  //       horizontal={false}
  //       >
  //         <ListView
  //         style={{height:windowHeight/2}}
  //         onEndReached={this.fetchNextData}
  //         onEndReachedThreshold={5}
  //         enableEmptySections={true}
  //         dataSource={this.state.dataSource}
  //         renderRow={(p) => {
  //           return (p.user.name) ?
  //              <ActivityItem isMe={false} key={p.key} store={p} navigator={this.props.navigator} from={'from_star'} />
  //             :
  //             null
  //         }}
  //         // renderRow={(p) => <ActivityItem isMe={false} key={p.key} store={p} navigator={this.props.navigator} from={'from_star'} />}
  //         renderFooter={
  //           () => {
  //             if (this.state.nextPage != null) {
  //               return (
  //                 <View style={{flex: 1, paddingVertical: 20, alignItems: 'center', justifyContent: 'center'}}>
  //                   <ActivityIndicator size='large' />
  //                 </View>
  //               )
  //             } else {
  //               return <View />;
  //             }
  //           }
  //         }
  //       />
  //     </InfiniteScroll>
  //   );
  // }
  
};
