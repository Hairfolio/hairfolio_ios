import { ActivityIndicator,Component, React, View, windowWidth, ListView, Text, windowHeight,h, ScrollView, showLog } from '../helpers';
import SearchStore from '../mobx/stores/SearchStore';
import BlackHeader from '../components/BlackHeader';
import StylistGridPost from '../components/favourites/StylistGridPost';
import { COLORS } from '../style';
import TrendingGridPost from '../components/favourites/TrendingGridPost';
import { observer } from "mobx-react";
const MyFooter = observer(({store}) => {
  showLog("store.nextPage ==> " + store.nextPage);
  showLog("store.isLoading ==> " + store.isLoading);
  if (store.nextPage != null || store.isLoading) {
    return (
      <View 
      	style={{flex: 1, width: windowWidth, paddingVertical: 20, alignItems: "center", justifyContent: "center",
									left: 0, right: 0, bottom: -10, position: 'absolute'}}>
        <ActivityIndicator size='large' />
      </View>
    )
  } else {
    return <View/>;
  }
});

@observer
export default class SearchSeeAll extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // SearchStore.nextPage = 1;
    // SearchStore.loadNextPage(this.props.id);
    showLog("this.props.category ==> " + this.props.category + " " + this.props.id);
    if(this.props.category == "trending" || this.props.category == "editor") {
      SearchStore.searchAllList.getPosts(this.props.id);      
    } else if(this.props.category == "stylist_near_me") {
      SearchStore.stylistsList.loadNextPage(this.props.id);
    } else if(this.props.category == "tags") {
      SearchStore.hashtagPosts.getPosts();
    } else if(this.props.category == "stylist" || this.props.category == "owner" || this.props.category == "ambassador" || this.props.category == "all_tags") {
      SearchStore.search();
    }
  }

  componentWillUnmount(){
    // alert(JSON.stringify(SearchStore.hashtagPostDataSource))
    

  }

  renderStylistView(el) {
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          // paddingVertical: h(15)
        }}
      >
        <StylistGridPost post={el[0]} navigator={this.props.navigator}/>
        {
          el[1] != null ?  <StylistGridPost key={el[1].key} post={el[1]} navigator={this.props.navigator}/> :
            <View
              style = {{
                width: windowWidth / 2,
                height: windowWidth / 2,
                backgroundColor: COLORS.WHITE
              }}
            />
        }        
      </View>
    )
  }

  renderPostListView(el) {
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          // paddingVertical: h(15)
        }}
      >
        <TrendingGridPost post={el[0]} navigator={this.props.navigator}/>
        {
          el[1] != null ?  <TrendingGridPost key={el[1].key} post={el[1]} navigator={this.props.navigator}/> :
            <View
              style = {{
                width: windowWidth / 2,
                height: windowWidth / 2,
                backgroundColor: COLORS.WHITE
              }}
            />
        }       
      </View>
    );
  
  }
  
  render() {
    let dataSource = [];
    if(this.props.category == "trending" || this.props.category == "editor"){
      dataSource = SearchStore.detailListDataSource;
    } else if(this.props.category == "stylist_near_me") {
      dataSource = SearchStore.stylistsListDataSource;
    } else if(this.props.category == "tags") {
      dataSource = SearchStore.hashtagPostDataSource;
    } else if(this.props.category == "stylist" || this.props.category == "owner" || this.props.category == "ambassador" || this.props.category == "all_tags") {
      dataSource = SearchStore.searchDataSource;
    }

    let store = SearchStore;
    if(store.searchAllList.isLoading || store.isLoading || store.hashtagPosts.isLoading){
      return( <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: windowWidth}}>
        <ActivityIndicator size='large' />
      </View>)
    }
    
    return(
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <BlackHeader
          onLeft={() => this.props.navigator.pop({ animated: true })}
          title={this.props.categoryTitle ? this.props.categoryTitle : ""}
        />    
          
        <View style={{marginVertical: h(15), flex:1}}>
          <ListView
            style={{
              flex: 1,
              width: windowWidth
            }}
            contentContainerStyle={{ alignSelf: "center" }}
            bounces={false}
            enableEmptySections
            dataSource={dataSource}
            renderRow={(el, i) => {
              return (this.props.category == "trending" || this.props.category == "editor" || this.props.category == "tags" || this.props.category == "all_tags" ) ?
                this.renderPostListView(el)
              : 
                this.renderStylistView(el)
            }}
            renderFooter={
              () => { 
                let store = SearchStore;
                if(this.props.category == "trending" || this.props.category == "editor") {
                  store = SearchStore.searchAllList;
                } else if(this.props.category == "tags") {
                  store = SearchStore.hashtagPosts;
                } else if(this.props.category == "stylist_near_me") {
                  store = SearchStore.stylistsList;
                } else if(this.props.category == "stylist" || this.props.category == "owner" || this.props.category == "ambassador" || this.props.category == "all_tags") {
                  store = SearchStore;  
                }
                return <MyFooter store={store} navigator={this.props.navigator} /> 
              }
            }
            onEndReached={() => {
              showLog("onEndReached ==>" + this.props.category + " ==> " + this.props.id )
              if(this.props.category == "trending" || this.props.category == "editor") {
                SearchStore.searchAllList.loadNextPageNew(this.props.id);
              } else if(this.props.category == "tags") {
                SearchStore.hashtagPosts.loadNextPage();
              } else if(this.props.category == "stylist_near_me") {
                SearchStore.stylistsList.loadNextPage();
              } else if(this.props.category == "stylist" || this.props.category == "owner" || this.props.category == "ambassador" || this.props.category == "all_tags") {
                SearchStore.loadNextSearch();  
              }
            }}
          />
        </View>
      </View>
    )
  }
}