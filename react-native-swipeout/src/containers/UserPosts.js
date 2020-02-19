import { ActivityIndicator, autobind, h, observer, windowWidth } from 'Hairfolio/src/helpers';
import React from 'react';
import { ListView, Text, View } from 'react-native';
import GridPost from '../components/favourites/GridPost';
import { StoreFactory } from '../mobx/stores/UserPostStoreFactory';
import { COLORS, FONTS } from '../style';
import { showLog } from '../helpers';

const MyFooter = observer(({ store }) => {
  if (store.nextPage != null) {
    return (
      <View style={{ flex: 1, paddingVertical: 20, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    )
  } else {
    return <View />;
  }
});

@autobind
@observer
export default class UserPosts extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let store = StoreFactory.getUserStore(this.props.profile.id);
    showLog("NEW MY POSTS STORE ==> " + JSON.stringify(store))
    if (!store) {
      return null;
    }

    let content;
    let newContent;

    if (store.isLoading) {
      content = (
        <View style={{ marginTop: 20 }}>
          <ActivityIndicator size='large' />
        </View>
      );
    }

    else if (store.elements.length == 0) {
      content = (
        <View style={{ flex: 1 }}>
          <Text
            style={{
              paddingTop: h(38),
              paddingBottom: h(38),
              fontSize: h(34),
              textAlign: 'center',
              fontFamily: FONTS.BOOK_OBLIQUE
            }}
          >
            The user has no posts yet.
          </Text>
        </View>
      );
    }


    else {content = (
      <ListView
        enableEmptySections
        dataSource={store.dataSource}
        scrollEnabled={true}
        // showsHorizontalScrollIndicator = {true}
        horizontal={true}
        renderRow={(el, i) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                // flexWrap: 'wrap'
              }}
            >
              <GridPost key={el[0].key} post={el[0]} navigator={this.props.navigator} />
              {
                el[1] != null ? <GridPost key={el[1].key} post={el[1]} navigator={this.props.navigator} /> :
                  <View
                    style={{
                      // width: windowWidth / 2,
                      height: windowWidth / 2,
                      backgroundColor: COLORS.WHITE
                    }}
                  />
              }
            </View>
          )
        }}
        // renderFooter={
        //   () => <MyFooter store={store} />
        // }
        // onEndReached={() => {
        //   store.loadNextPage();
        // }} 

        />
    );
    }

    if (store.isLoading) {
      newContent = (
        <View style={{ marginTop: 20 }}>
          <ActivityIndicator size='large' />
        </View>
      );
    }

    else if (store.elements.length == 0) {
      newContent = (
        <View style={{ flex: 1}}>
          <Text
            style={{
              paddingTop: h(38),
              fontSize: h(34),
              textAlign: 'center',
              fontFamily: FONTS.BOOK_OBLIQUE
            }}
          >
            The user has no posts yet.
          </Text>
        </View>
      );
    }


    else{ newContent = (
      <ListView
        enableEmptySections
        dataSource={store.dataSource}
        scrollEnabled={true}
        showsHorizontalScrollIndicator={true}
        renderRow={(el, i) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                // flexWrap: 'wrap'
              }}
            >
              <GridPost key={el[0].key} post={el[0]} navigator={this.props.navigator} />
              {
                el[1] != null ? <GridPost key={el[1].key} post={el[1]} navigator={this.props.navigator} /> :
                  <View
                    style={{
                      width: windowWidth / 2,
                      height: windowWidth / 2,
                      backgroundColor: COLORS.WHITE
                    }}
                  />
              }
            </View>
          )
        }}
        renderFooter={
          () => <MyFooter store={store} />
        }
        onEndReached={() => {
          store.loadNextPage();
        }} />
    );
    }

    return (
      <View
        style={{
          flex: 1,
          // paddingBottom: h(38)
        }}
      >
        {(this.props.isFrom == 'PostGridList') ? newContent : content}
      </View>
    );
  }

  
};
