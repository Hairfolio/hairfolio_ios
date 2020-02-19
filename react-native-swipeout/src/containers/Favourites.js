import { observer } from 'mobx-react';
import React from 'react';
import { StatusBar, View, ActivityIndicator, ListView } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import whiteBack from '../../resources/img/nav_white_back.png';
import NavigatorStyles from '../common/NavigatorStyles';
import ActivityFollowing from '../components/favourites/ActivityFollowing';
import ActivityYou from '../components/favourites/ActivityYou';
import LinkTabBar from '../components/post/LinkTabBar';
import PureComponent from '../components/PureComponent';
import ActivityFollowingStore from '../mobx/stores/ActivityFollowingStore';
import ActivityYouStore from '../mobx/stores/ActivityYouStore';
import { COLORS } from '../style';
import InfiniteScroll from 'react-native-infinite-scroll';
import ActivityItem from '../components/favourites/ActivityItem';
import { Component, FONTS, h, Text, windowHeight, showLog } from '../helpers';


@observer
export default class Favourites extends Component {
  constructor(props) {
    super(props);
    this.props.navigator.addOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'willAppear':
        ActivityYouStore.load();
        ActivityFollowingStore.load();
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: COLORS.WHITE
      }}>

        <ScrollableTabView
          locked={true}
          renderTabBar={() => <LinkTabBar />}
          initialPage={0}
        >
          {/* <FavouritesGrid tabLabel="Favorites" navigator={this.props.navigator} from={'from_star'}/> */}
          <ActivityYou tabLabel='You' navigator={this.props.navigator} from={'from_star'} />
          <ActivityFollowing tabLabel='Following' navigator={this.props.navigator} from={'from_star'} />
        </ScrollableTabView>
      </View>
    );
  }
};

// export class ActivityFollowing extends Component {  
//   render(){
//     let store = ActivityFollowingStore;

//     if (store.isLoading) {
//       return (
//         <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
//           <ActivityIndicator size='large' />
//         </View>
//       );
//     }
//     if (store.elements.length == 0) {
//       return (
//         <View style={{flex: 1}}>
//           <Text
//             style= {{
//               paddingTop: h(38),
//               fontSize: h(34),
//               textAlign: 'center',
//               fontFamily: FONTS.BOOK_OBLIQUE
//             }}
//           >
//             No Activity to show
//           </Text>
//         </View>
//       );
//     }

//     return (
//       <InfiniteScroll
//         horizontal={false}  //true - if you want in horizontal
//         >
//           <ListView
//           style={{height:windowHeight/2}}
//           onEndReached={store.loadNextPage}
//           onEndReachedThreshold={5}
//           enableEmptySections={true}
//           dataSource={store.dataSource}
//           renderRow={(p) => 
//             { return (p.user.name) ?
//                <ActivityItem isMe={false} key={p.key} store={p} navigator={this.props.navigator} from={'from_star'} />
//               :
//               <View/>
//             }
//           }
//           // renderRow={(p) => <ActivityItem isMe={true} key={p.key} store={p} navigator={this.props.navigator} from={'from_star'} />}
//           renderFooter={
//             () => {
//               if (store.nextPage != null && !store.isLoadingNextPage) {
//                 return (
//                   <View style={{flex: 1, paddingVertical: 20, alignItems: 'center', justifyContent: 'center'}}>
//                     <ActivityIndicator size='large' />
//                   </View>
//                 )
//               } else {
//                 return <View />;
//               }
//             }
//           }
//         />
//       </InfiniteScroll>
//     );
//   }
// };

// export class ActivityYou extends Component {  
//   render(){
//     let store = ActivityYouStore;

//     if (store.isLoading) {
//       return (
//         <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
//           <ActivityIndicator size='large' />
//         </View>
//       );
//     }
//     if (store.elements.length == 0) {
//       return (
//         <View style={{flex: 1}}>
//           <Text
//             style= {{
//               paddingTop: h(38),
//               fontSize: h(34),
//               textAlign: 'center',
//               fontFamily: FONTS.BOOK_OBLIQUE
//             }}
//           >
//             No Activity to show
//           </Text>
//         </View>
//       );
//     }

//     return (
//       <InfiniteScroll
//         horizontal={false}  //true - if you want in horizontal
//         >
//           <ListView
//           style={{height:windowHeight/2}}
//           onEndReached={store.loadNextPage}
//           onEndReachedThreshold={5}
//           enableEmptySections={true}
//           dataSource={store.dataSource}
//           renderRow={(p) => 
//             { return (p.user.name) ?
//                <ActivityItem isMe={true} key={p.key} store={p} navigator={this.props.navigator} from={'from_star'} />
//               :
//               <View/>
//             }
//           }
//           // renderRow={(p) => <ActivityItem isMe={true} key={p.key} store={p} navigator={this.props.navigator} from={'from_star'} />}
//           renderFooter={
//             () => {
//               if (store.nextPage != null && !store.isLoadingNextPage) {
//                 return (
//                   <View style={{flex: 1, paddingVertical: 20, alignItems: 'center', justifyContent: 'center'}}>
//                     <ActivityIndicator size='large' />
//                   </View>
//                 )
//               } else {
//                 return <View />;
//               }
//             }
//           }
//         />
//       </InfiniteScroll>
//     );
//   }
// };