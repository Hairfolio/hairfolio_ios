import { FONTS, h, observer, React, ScrollView, Text, View } from 'Hairfolio/src/helpers';
import { ActivityIndicator } from 'react-native';
import ActivityFollowingStore from '../../mobx/stores/ActivityFollowingStore';
import ActivityItem from '../favourites/ActivityItem';

const ActivityFollowing = observer(({navigator}) => {

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
    <ScrollView>
    {store.elements.map(p => <ActivityItem isMe={false} key={p.key} store={p} navigator={navigator} />)}
    </ScrollView>
  );
});

export default ActivityFollowing;
