import { h, observer } from 'Hairfolio/src/helpers';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import NavigatorStyles from '../common/NavigatorStyles';
import ActivityFollowing from '../components/favourites/ActivityFollowing_default';
import ActivityYou from '../components/favourites/ActivityYou';
import FavouritesGrid from '../components/favourites/FavouritesGrid';
import LinkTabBar from '../components/favourites/FavouritesTabBar';
import WhiteHeader from '../components/WhiteHeader';
import { COLORS, FONTS } from '../style';
import UserHairfolio from './UserHairfolio';
import UserPosts from './UserPosts';
import { showAlert, showLog } from '../helpers';
import UserStore from '../mobx/stores/UserStore';
import UsersStore from '../mobx/stores/UsersStore';
@observer
export default class Starred extends React.Component {
  constructor(props) {
    super(props);
     this.state = {
      user : this.props.profile,
      from : this.props.from,
      followed: false,
      id: this.props.id
     }
  }


  gotoScreen(screenName,isFrom){
    
    this.props.navigator.push({
      screen: screenName,
      animationType: 'fade',
      navigatorStyle: NavigatorStyles.tab,
        passProps: {
          profile:this.state.user,
          from:isFrom
      }
    });   
  }

  render() {
    // const user =  UsersStore.getUser(this.userId);
    showLog("THIS.STATE ==> "+JSON.stringify(this.state.user.id));
    showLog("USER STORE ID ==> " + JSON.stringify(UserStore.user.id))
    showLog("GET USER FOLLOWING==> " + JSON.stringify(UserStore.opponentUser));
    return (
      <View style={{
        flex: 1
      }}>
        
        
          <View>
            <View>
            <View style={styles.sectionViewHeader}>
              <Text style={styles.sectionHeaderText}> Posts </Text>
              <Text style={styles.sectionHeaderRightText} 
                    onPress={()=>{
                      this.gotoScreen('hairfolio.PostsGridList','')   
                    }}> See All </Text>
            </View>
            <UserPosts
              tabLabel="Posts"
              navigator={this.props.navigator}
              profile={this.state.user}
              isFrom='' />

          </View>

            <View>

            <View style={styles.sectionViewHeader}>
              <Text style={styles.sectionHeaderText}> Favourite Posts </Text>
              <Text style={styles.sectionHeaderRightText} 
                    onPress={()=>{
                      this.gotoScreen('hairfolio.FavouritesGridList','activity')
                    }}> See All </Text>
            </View>

            <FavouritesGrid 
                tabLabel="Favorites" 
                navigator={this.props.navigator} 
                from={'activity'} />

          </View>
          </View>
        
        <View>

          <View style={styles.sectionViewHeader}>
            <Text style={styles.sectionHeaderText}> Inspo </Text>
          </View>

          <UserHairfolio
            tabLabel="Hairfolio"
            navigator={this.props.navigator}
            profile={this.state.user}
            from_star={this.state.from}
          />
        </View>
      </View>
    );
  }
  
  render2() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: COLORS.WHITE
      }}>
      <WhiteHeader title='Activity' />
      <ScrollableTabView
        renderTabBar={() => <LinkTabBar />}
        initialPage={0}
      >
        <FavouritesGrid tabLabel="Favorites" navigator={this.props.navigator} from={'from_star'}/>
        <ActivityYou tabLabel='You' navigator={this.props.navigator} from={'from_star'}/>
        <ActivityFollowing tabLabel='Following' navigator={this.props.navigator} from={'from_star'}/>
      </ScrollableTabView>
    </View>
    );
  }
}

const styles = StyleSheet.create({

  sectionViewHeader: {
    height: h(80),
    justifyContent: 'space-between',
    flexDirection:'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.FLOATBUTTON
  },
  sectionHeaderText: {
    marginLeft: 2,
    textAlignVertical: 'bottom',
    fontSize: h(30),
    fontFamily: FONTS.MEDIUM,
    color: COLORS.BLACK,
    alignSelf:'center'
  },
  sectionHeaderRightText:{
    alignSelf:'center',
    color:'black',
    marginRight:2,
    fontSize: h(30),
    fontFamily: FONTS.MEDIUM,
    color: COLORS.BLACK,
    textAlignVertical: 'bottom',
  },
  new:{
    color:COLORS.BLACK,
    fontFamily: FONTS.MEDIUM, 
    fontSize: h(30),
    paddingTop:5
  }

});
