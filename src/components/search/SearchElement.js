import { StatusBar, TouchableOpacity } from "react-native";
import NavigatorStyles from "../../common/NavigatorStyles";
import { ActivityIndicator, COLORS, FONTS, h, Image, ListView, React, ScrollView, showLog, Text, TextInput, View, windowHeight, windowWidth, FlatList } from "../../helpers";
import StylistGridPost from "../favourites/StylistGridPost";
import TrendingGridPost from "../favourites/TrendingGridPost";
import Picker from "../Picker";
import SearchStore from "../../mobx/stores/SearchStore";
import { observer } from "mobx-react/native";
import { KeyboardAwareScrollView, KeyboardAwareMixin } from "react-native-keyboard-aware-scroll-view";
import { PER_PAGE_FOR_SEARCH } from "../../constants";

// const CHOICES = [
//   { label: "Hair Stylist" },
//   { label: "Salon" },
//   { label: "Brand" },
//   { label: "All Tags" }
// ];
const CHOICES = [
  { label: "All Tags" },
  { label: "Hair Stylist" },
  { label: "Salon" },
  { label: "Brand" }
  
];

const TagFooter = observer(({ store }) => {
  StatusBar.setBarStyle("dark-content", true);
  if (store.nextPage != null) {
    return (
      <View
        style={{
          flex: 1,
          width: h(220),
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: COLORS.WHITE
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return <View />;
  }
});

const SearchBar = observer(({ store, navigator }) => {
  let text = "I'm looking for...";
  StatusBar.setBarStyle("dark-content", true);
  return (
    <View
      style={{
        width: windowWidth,
        marginTop: h(40),
        paddingHorizontal: h(25),
        flexDirection: "row",
        marginVertical: 3
      }}
    >
      <View
        style={{
          backgroundColor: COLORS.WHITE1,
          flex: 1,
          height: h(58),
          borderRadius: h(7),
          alignItems: "center",
          marginRight: 10,
          flexDirection: "row"
        }}
      >
        <TextInput
          autoCorrect={false}
          returnKeyType="search"
          value={store.searchString}
          onSubmitEditing={() => {
            // this.refs.scrollView.scrollTo({x: 0, y: 0, animated: true})
            // this.scrollView.scrollTo({x: 0, y: 0, animated: true})
            store.search();
          }}
          onChangeText={text => {
            store.searchString = text;
            store.updateValues();
          }}
          ref={el => {
            store.input = el;
            window.myInput = el;
          }}
          placeholder={text}
          style={{
            flex: 1,
            marginLeft: h(14),
            fontSize: h(30),
            color: COLORS.BLACK,
            backgroundColor: COLORS.TRANSPARENT
          }}
        />

        {store.isIconVisible ? (
          <TouchableOpacity
            onPress={() => {
              store.searchString = "";
              store.updateValues();
            }}
          >
            <View
              style={{
                paddingRight: h(23),
                justifyContent: "center",
                height: h(58)
              }}
            >
              <Image
                style={{ height: h(30), width: h(30) }}
                source={require("img/search_clear.png")}
              />
            </View>
          </TouchableOpacity>
        ) : null}
      </View>

      <Picker
        choices={CHOICES}
        disabled={false}
        isSearch={true}
        onDone={(item = {}) => {
          switch(item.label) {
            case 'Hair Stylist':
              SearchStore.accountType = 'stylist';
              SearchStore.accountDisplayText = 'Hair Stylist';
              break;
            case 'Salon':
              SearchStore.accountType = 'owner';
              SearchStore.accountDisplayText = 'Salon';
              break;
            case 'Brand':
              SearchStore.accountType = 'ambassador';
              SearchStore.accountDisplayText = 'Brand';
              break;
            case 'All Tags':
              SearchStore.accountType = 'all_tags';
              SearchStore.accountDisplayText = 'All Tags';
              break;
          }
          showLog('SearchStore.accountType ==> ' + SearchStore.accountType)
          if(SearchStore.searchString.length > 0) {
            SearchStore.updateValues();
            SearchStore.search();
          }
        }}
      />
    </View>
  );
});

const TagItem = observer(({ store, navigator, searchStore }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        store.isSelected = !store.isSelected;
        searchStore.hashtagPosts.onTagClick(store.id);
        // this.scroll.props.resetScrollToCoords(0, 0)
        // this.scroll.props.scrollToPosition(0, 0)
        // this.refs.scrollView.scrollTo({x: 0, y: 0, animated: true})
        // this.scrollView.scrollTo({x: 0, y: 0, animated: true})
      }}
      style={
        store.isSelected
          ? {
              borderColor: COLORS.GRAY_BORDER,
              borderRadius: 4,
              borderWidth: 1,
              height: 40,
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              marginHorizontal: h(5),
              backgroundColor: COLORS.DARK
            }
          : {
              borderColor: COLORS.GRAY_BORDER,
              borderRadius: 4,
              borderWidth: 1,
              height: 40,
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              marginHorizontal: h(5)
            }
      }
    >
      <Text
        style={
          store.isSelected
            ? { margin: 10, alignSelf: "center", color: COLORS.WHITE }
            : { margin: 10, alignSelf: "center" }
        }
      >
        {store.name}
      </Text>
    </TouchableOpacity>
  );
});

const TopTags = observer(({ store, navigator, searchStore }) => {
  StatusBar.setBarStyle("dark-content", true);
  if (store.isLoading) {
    return (
      <View style={{ justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{paddingTop: h(40)}}>     
      { 
        (searchStore.hashtagPosts.selectedTags.length > 0 
        ? 
          <TouchableOpacity
            style={{alignSelf:'flex-end', paddingHorizontal: h(25)}}
            onPress={() => {
              store.resetTags();
              searchStore.hashtagPosts.hashtagPostsList = [];
              searchStore.hashtagPosts.selectedTags = [];
              searchStore.hashtagPostDataSource;
            }}>
            <Text
              style={{
                color: COLORS.DARK,
                fontSize: h(28),
                fontFamily: FONTS.ROMAN
              }}
            >
              Clear
            </Text>
          </TouchableOpacity>
        : 
          null
      )}
      <ListView
        style={{
          marginLeft: h(20),
          marginVertical: 3
        }}
        showsHorizontalScrollIndicator={false}
        horizontal
        enableEmptySections
        dataSource={store.dataSource}
        renderRow={(el, i) => {
          return <TagItem key={el.key} store={el} navigator={navigator} searchStore={searchStore}/>;
        }}
        renderFooter={() => <TagFooter store={store} navigator={navigator} />}
        onEndReached={() => {
          store.loadNextPage();
        }}
      />
    </View>
  );
});

const Header = observer(({ title, onPress, length, isTitleBold = true }) => {
  StatusBar.setBarStyle("dark-content", true);
  return (
    <View>
      <View
        style={{
          backgroundColor: "white",
          flexDirection: "row",
          paddingHorizontal: h(25),
          paddingVertical: h(25),
          justifyContent: "space-between"
        }}
      >
          <Text
            style={{
              color: COLORS.BLACK,
              fontSize: h(30),
              // fontFamily: FONTS.ROMAN
              fontFamily: (isTitleBold) ? FONTS.BLACK : FONTS.ROMAN
            }}
          >
            {title ? title.title_heading : ""}
          </Text>
        
        { 
          (length && length > PER_PAGE_FOR_SEARCH ? (
            <TouchableOpacity onPress={onPress}>
              <Text
                style={{
                  color: COLORS.BLACK,
                  fontSize: h(30),
                  fontFamily: FONTS.ROMAN
                }}
              >
                See All
              </Text>
            </TouchableOpacity>
          ) : (
            <View />
          )
        )}
      </View>
    </View>
  );
});

const NoRecordsPlaceholder = observer(({placeholderText}) => {
  return(
    <View style={{justifyContent:'center', alignItems:'center'}}>
      <Text style={{
              color: COLORS.DARK,
              fontSize: h(24),
              fontFamily: FONTS.ROMAN
            }}>{placeholderText}</Text>
    </View>
  )
})

const SearchElement = observer(({ navigator, store }) => {
  // showLog("trending data source ==> " + JSON.stringify(store.trendingDataSource))
  StatusBar.setBarStyle("dark-content", true);
  if (store.trendingPosts.isLoading || store.editorsPosts.isLoading) {
    return (<View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          width: windowWidth
        }}
      >
        <ActivityIndicator size="large" />
      </View>);
  }

  function resetToTop() {
    // this.scroll.props.scrollToPosition(0, 0)
    // this.scrollView.scrollTo({y:0})
    // this.scroll.props.resetScrollToCoords(0, 0)
  }

  function renderStylistView(el) {
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          // paddingVertical: h(15)
        }}
      >
        <StylistGridPost post={el[0]} navigator={navigator}/>
        {
          el[1] != null ?  <StylistGridPost key={el[1].key} post={el[1]} navigator={navigator}/> :
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

  function renderPostListView(el) {
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          // paddingVertical: h(15)
        }}
      >
        <TrendingGridPost post={el[0]} navigator={navigator}/>
        {
          el[1] != null ?  <TrendingGridPost key={el[1].key} post={el[1]} navigator={navigator}/> :
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

  return (
    <View style={{ flex:1, paddingTop: 25 }}>
      {(store.trendingPosts.isLoading || store.editorsPosts.isLoading) ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            width: windowWidth
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View style={{ flex:1 }}>
          <SearchBar store={store} navigator={navigator} />

          {(SearchStore.searchString.length == 0)
            ?
              <TopTags store={store.topTags} searchStore={store} navigator={navigator} />            
            :
              null
          }             

          <KeyboardAwareScrollView
          //  ref="abc"
            // ref={e => this.scrollView = e}
            enableResetScrollToCoords={false}
            innerRef={ref => {this.scroll = ref}}
            extraScrollHeight={0}
            // onContentSizeChange={(width,height) => this.refs.scrollView.scrollTo({y:0})}
            showsVerticalScrollIndicator={false}
            // onKeyboardWillHide={() => {
            //   KeyboardAwareMixin.resetKeyboardSpace();
            // }}
            style={{ marginBottom: 0, paddingBottom: 0}}
            bounces={false}
            alwaysBounceVertical={false}>
            <View>
              {(SearchStore.hashtagPostDataSource.getRowCount() > 0 && SearchStore.searchString.length == 0) 
              ?
              <View>
                <Header
                  // isTitleBold = {false}
                  title={{ title_heading: "Tags" }}
                  length={store.hashtagPosts.totalCount}
                  store={store.hashtagPosts}
                  onPress={() => {
                    navigator.push({
                      screen: "hairfolio.SearchSeeAll",
                      navigatorStyle: NavigatorStyles.tab,
                      passProps: {
                        category: 'tags',
                        categoryTitle: "Tags"
                      }
                    });
                  }}
                />   
                {
                  (store.hashtagPosts.isLoading) ?
                    <View style={{ justifyContent: "center" }}>
                      <ActivityIndicator size="small" />
                    </View>
                  :
                    <ListView
                      style={{
                      flex: 1,
                      width: windowWidth
                    }}
                      ref={ref => this.hashtagListView = ref}
                      contentContainerStyle={{ alignSelf: "center" }}
                      bounces={false}
                      initialListSize={10}
                      enableEmptySections
                      // dataSource={store.hashtagPostDataSource}
                      dataSource={store.hashtagPostFewDataSource}
                      onContentSizeChange={() => {
                        this.hashtagListView.scrollTo({y: 0})
                        // this.refs.abc.resetScrollToCoords(0,0)
                        // this.scroll.props.scrollToPosition(0, 0)
                        // this.scrollView.scrollTo({y:0})
                        // resetToTop();
                      }}
                      renderRow={(el, i) => {
                        return (
                          <View
                            style={{
                              flexDirection: "row",
                              flexWrap: "wrap"
                            }}
                          >
                            <TrendingGridPost post={el[0]} navigator={navigator} />
                            {el[1] != null ? (
                              <TrendingGridPost
                                key={el[1].key}
                                post={el[1]}
                                navigator={navigator}
                              />
                            ) : (
                              <View
                                style={{
                                  width: windowWidth / 2,
                                  height: windowWidth / 2,
                                  backgroundColor: COLORS.WHITE
                                }}
                              />
                            )}
                          </View>
                        );
                      }}
                    />
                }
              </View>
              :
                null
              }

              {(SearchStore.searchString.length > 0)
              ?
              <View>
              <Header
                // isTitleBold = {false}
                title={{ title_heading: SearchStore.accountDisplayText }}
                flag={true}
                store={SearchStore}
                length={SearchStore.totalCount}
                onPress={() => {
                  navigator.push({
                    screen: "hairfolio.SearchSeeAll",
                    navigatorStyle: NavigatorStyles.tab,
                    passProps: {
                      category: SearchStore.accountType,
                      categoryTitle: SearchStore.accountDisplayText
                    }
                  });
                }}
              />

              {(store.isLoading) ?
                <View style={{ justifyContent: "center" }}>
                  <ActivityIndicator size="small" />
                </View>
              :
                (SearchStore.searchDataSource.getRowCount() > 0)
                ?
                  <ListView
                    style={{
                      flex: 1,
                      width: windowWidth
                    }}
                    ref={ref => this.searchListView = ref}
                    onContentSizeChange={() => {
                      this.searchListView.scrollTo({y: 0})
                    }}
                    contentContainerStyle={{ alignSelf: "center" }}
                    bounces={false}
                    initialListSize={10}
                    enableEmptySections
                    dataSource={store.searchFewDataSource}
                    renderRow={(el, i) => {
                      return (store.accountType == 'all_tags') 
                      ?
                        renderPostListView(el)
                      :
                        renderStylistView(el)
                    }}
                  />
                :
                  <NoRecordsPlaceholder placeholderText={'No records found!'}/>
              }
              </View>
              :
              null
              }
             
              <Header
                title={store.trendingPosts.trendingMainRes}
                store={store.trendingPosts.trendingRes}
                length={store.trendingPosts.trendingTotalCount}
                onPress={() => {
                  navigator.push({
                    screen: "hairfolio.SearchSeeAll",
                    navigatorStyle: NavigatorStyles.tab,
                    passProps: {
                      id: store.trendingPosts.trendingMainRes.id,
                      category: 'trending',
                      categoryTitle: store.trendingPosts.trendingMainRes.title_heading
                    }
                  });
                }}
              />

              {(store.trendingDataSource.getRowCount() > 0)
              ?
                <ListView
                  style={{
                    flex: 1,
                    width: windowWidth
                  }}
                  contentContainerStyle={{ alignSelf: "center" }}
                  bounces={false}
                  initialListSize={10}
                  enableEmptySections
                  dataSource={store.trendingFewDataSource}
                  renderRow={(el, i) => {
                    return (
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap"
                        }}
                      >
                        <TrendingGridPost post={el[0]} navigator={navigator} />
                        {el[1] != null ? (
                          <TrendingGridPost
                            key={el[1].key}
                            post={el[1]}
                            navigator={navigator}
                          />
                        ) : (
                          <View
                            style={{
                              width: windowWidth / 2,
                              height: windowWidth / 2,
                              backgroundColor: COLORS.WHITE
                            }}
                          />
                        )}
                      </View>
                    );
                  }}
                />
                :
                <NoRecordsPlaceholder placeholderText={'No records found!'}/>
              }

              <Header
                
                title={store.editorsPosts.editorMainRes}
                store={store.editorsPosts.editorsRes}
                length={store.editorsPosts.editorsTotalCount}
                onPress={() => {
                  navigator.push({
                    screen: "hairfolio.SearchSeeAll",
                    navigatorStyle: NavigatorStyles.tab,
                    passProps: {
                      id: store.editorsPosts.editorMainRes.id,
                      category: 'editor',
                      categoryTitle: store.editorsPosts.editorMainRes.title_heading
                    }
                  });
                }}
              />

              {(store.editorsDataSource.getRowCount() > 0)
              ?
                <ListView
                  style={{
                    // marginTop: 20,
                    flex: 1,
                    width: windowWidth
                  }}
                  contentContainerStyle={{ alignSelf: "center" }}
                  bounces={false}
                  initialListSize={10}
                  enableEmptySections
                  dataSource={store.editorsFewDataSource}
                  renderRow={(el, i) => {
                    return (
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap"
                        }}
                      >
                        <TrendingGridPost post={el[0]} navigator={navigator} />
                        {el[1] != null ? (
                          <TrendingGridPost
                            key={el[1].key}
                            post={el[1]}
                            navigator={navigator}
                          />
                        ) : (
                          <View
                            style={{
                              width: windowWidth / 2,
                              height: windowWidth / 2,
                              backgroundColor: COLORS.WHITE
                            }}
                          />
                        )}
                      </View>
                    );
                  }}
                />
               :
                <NoRecordsPlaceholder placeholderText={'No records found!'}/>
              }

              <Header
                title={{ title_heading: "Stylist Near Me" }}
                flag={true}
                store={store.stylistsList}
                length={store.stylistsList.totalCount}
                onPress={() => {
                  navigator.push({
                    screen: "hairfolio.SearchSeeAll",
                    navigatorStyle: NavigatorStyles.tab,
                    passProps: {
                      category: 'stylist_near_me',
                      categoryTitle: "Stylist Near Me"
                    }
                  });
                }}
              />

              {(SearchStore.stylistsListDataSource.getRowCount() > 0)
              ?
                <ListView
                  style={{
                    flex: 1,
                    width: windowWidth
                  }}
                  contentContainerStyle={{ alignSelf: "center" }}
                  bounces={false}
                  initialListSize={10}
                  enableEmptySections
                  // dataSource={store.stylistsListDataSource}
                  dataSource={store.stylistsListFewDataSource}
                  renderRow={(el, i) => {
                    return (
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap"
                        }}
                      >
                        <StylistGridPost post={el[0]} navigator={navigator} />
                        {el[1] != null ? (
                          <StylistGridPost
                            key={el[1].key}
                            post={el[1]}
                            navigator={navigator}
                          />
                        ) : (
                          <View
                            style={{
                              width: windowWidth / 2,
                              height: windowWidth / 2,
                              backgroundColor: COLORS.WHITE
                            }}
                          />
                        )}
                      </View>
                    );
                  }}
                />
              :
                <NoRecordsPlaceholder placeholderText={'No records found!'}/>
              }
            </View>
          </KeyboardAwareScrollView>
        </View>
      )}
    </View>
  );
});

export default SearchElement;
