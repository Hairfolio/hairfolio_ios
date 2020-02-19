import { StatusBar, TouchableOpacity } from "react-native";
import NavigatorStyles from "../../common/NavigatorStyles";
import { ActivityIndicator, COLORS, FONTS, h, Image, ListView, React, ScrollView, showLog, Text, TextInput, View, windowHeight, windowWidth, FlatList } from "../../helpers";
import StylistGridPost from "../favourites/StylistGridPost";
import TrendingGridPost from "../favourites/TrendingGridPost";
import Picker from "../Picker";
import SearchStore from "../../mobx/stores/SearchStore";
import { observer } from "mobx-react/native";

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
        marginVertical: h(40),
        paddingHorizontal: h(25),
        flexDirection: "row"
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
            color: COLORS.DARK6,
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
          alert(JSON.stringify(item));
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
    <View>
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

const Header = observer(({ title, onPress, length }) => {
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
        {(title == 'Tags' && length > 0)
        ?
          <Text
            style={{
              color: COLORS.DARK,
              fontSize: h(28),
              fontFamily: FONTS.ROMAN
            }}
          >
            {title ? title.title_heading : ""}
          </Text>
        :
          (title!='Tags') 
          ?
            <Text
                style={{
                  color: COLORS.DARK,
                  fontSize: h(28),
                  fontFamily: FONTS.ROMAN
                }}
              >
                {title ? title.title_heading : ""}
            </Text>
          :
            null
        }
        

        { 
          (length && length >= 10 ? (
            <TouchableOpacity onPress={onPress}>
              <Text
                style={{
                  color: COLORS.DARK,
                  fontSize: h(28),
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

const SearchElement = observer(({ navigator, store }) => {
  showLog("store.hashtagPosts.totalCount  ==>" + SearchStore.hashtagPosts.totalCount)
  StatusBar.setBarStyle("dark-content", true);
  if (!store.loaded) {
    return <View />;
  }
  let content = (<View>
    <Header
      title={{ title_heading: "Tags" }}
      length={store.hashtagPosts.totalCount}
      store={store.hashtagPosts}
      onPress={() => {
        navigator.push({
          screen: "hairfolio.SearchSeeAll",
          navigatorStyle: NavigatorStyles.tab,
          passProps: {
            categoryTitle: "Tags"
          }
        });
      }}
    />  

    <ListView
      style={{
      flex: 1,
      width: windowWidth
    }}
      contentContainerStyle={{ alignSelf: "center" }}
      bounces={false}
      initialListSize={10}
      enableEmptySections
      dataSource={store.hashtagPostDataSource}
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
</View>);
  return (
    <View style={{ height: windowHeight, paddingTop: 25 }}>
      {store.trendingEditorPosts.isLoading ? (
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
        <View style={{ height: windowHeight - (h(105) + 30) }}>
          <SearchBar store={store} navigator={navigator} />

          <TopTags store={store.topTags} searchStore={store} navigator={navigator} />

          <ScrollView>
            <View style={{ paddingBottom: 20 }}>
              {(SearchStore.hashtagPosts.totalCount > 0) 
              ?
                {content}
              :
                null
              }
             
              <Header
                title={store.postDetailsByPosition(0)}
                store={store.trendingEditorPosts.trendingRes}
                length={store.trendingEditorPosts.trendingTotalCount}
                onPress={() => {
                  navigator.push({
                    screen: "hairfolio.SearchSeeAll",
                    navigatorStyle: NavigatorStyles.tab,
                    passProps: {
                      id: store.postDetailsByPosition(0).id,
                      categoryTitle: store.postDetailsByPosition(0)
                        .title_heading
                    }
                  });
                }}
              />

              <ListView
                style={{
                  flex: 1,
                  width: windowWidth
                }}
                contentContainerStyle={{ alignSelf: "center" }}
                bounces={false}
                initialListSize={10}
                enableEmptySections
                dataSource={store.trendingDataSource}
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

              <Header
                title={store.postDetailsByPosition(1)}
                store={store.trendingEditorPosts.editorsRes}
                length={store.trendingEditorPosts.editorsTotalCount}
                onPress={() => {
                  navigator.push({
                    screen: "hairfolio.SearchSeeAll",
                    navigatorStyle: NavigatorStyles.tab,
                    passProps: {
                      id: store.postDetailsByPosition(1).id,
                      categoryTitle: store.postDetailsByPosition(1).title_heading
                    }
                  });
                }}
              />

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
                dataSource={store.trendingDataSource}
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
                      categoryTitle: "Stylist Near Me"
                    }
                  });
                }}
              />

              <ListView
                style={{
                  flex: 1,
                  width: windowWidth
                }}
                contentContainerStyle={{ alignSelf: "center" }}
                bounces={false}
                initialListSize={10}
                enableEmptySections
                dataSource={store.stylistsListDataSource}
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
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
});

export default SearchElement;
