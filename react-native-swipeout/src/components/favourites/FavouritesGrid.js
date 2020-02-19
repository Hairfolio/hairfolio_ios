import { ActivityIndicator, FONTS, h, ListView, observer, React, Text, View, windowHeight, windowWidth } from 'Hairfolio/src/helpers';
import FavoriteStore from '../../mobx/stores/FavoriteStore';
import GridPost from './GridPost';
import { COLORS, showLog } from '../../helpers';

const MyFooter = observer(({store}) => {

  if (store.nextPage != null) {
    return (
      <View style={{flex: 1, paddingVertical: 20, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size='large' />
      </View>
    )
  } else {
    return <View />;
  }
});

const FavouritesGrid = observer(({navigator,from}) => {

  let store = FavoriteStore;
  showLog("FAV STORE ==> " + JSON.stringify(store.elements.length))

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
            paddingVertical: h(38),
            fontSize: h(34),
            textAlign: 'center',
            fontFamily: FONTS.BOOK_OBLIQUE
          }}
        >
          No posts have been starred yet.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1
      }}
    >
      <ListView

        style = {{
          height : (from == 'activity') ? "100%" : windowHeight - 83 - 50 - 53
        }}
        dataSource={store.dataSource}
        horizontal={(from == 'activity') ? true : false}
        renderRow={(el, i) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}
            >
              <GridPost key={el[0].key} post={el[0]} navigator={navigator} from={from}/>
              {
                el[1] != null ?  <GridPost key={el[1].key} post={el[1]} navigator={navigator} from={from}/> :
                <View
                  style = {{
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
    </View>
  );
});

export default FavouritesGrid;
