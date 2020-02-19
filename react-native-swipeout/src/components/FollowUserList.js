import { ActivityIndicator } from 'Hairfolio/src/helpers';
import { FONTS, h } from 'Hairfolio/src/style';
import { observer } from 'mobx-react';
import React from 'react';
import { Image, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import NavigatorStyles from '../common/NavigatorStyles';
import CommentsStore from '../mobx/stores/CommentsStore';
import PostDetailStore from '../mobx/stores/PostDetailStore';
import TagPostStore from '../mobx/stores/TagPostStore';
import FollowButton from './FollowButton';
import { COLORS } from '../helpers';

const FollowUserRow = observer(({ store, navigator,store_name }) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigator.push({
          screen: 'hairfolio.Profile',
          navigatorStyle: NavigatorStyles.tab,
          passProps: {
            userId: store.user.id,
            store_name:store_name,
          }
        });
        PostDetailStore.clear();
        TagPostStore.clear();
        CommentsStore.clear();
      }}
    >
      <View
        style={{
          paddingLeft: h(20),
          alignItems: 'center',
          flexDirection: 'row',
        }}
      >
        <Image
          style={{height: h(80), width: h(80), borderRadius: h(40)}}
          defaultSource={require('img/medium_placeholder_icon.png')}
          source={(store.profilePicture) ? store.profilePicture.getSource(80, 80) : require('img/medium_placeholder_icon.png')}
        />
        <View
          style={{
            marginLeft: 20,
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: h(1),
            borderBottomColor: COLORS.LIGHT4,
            height: h(122),
            flex: 1,
            paddingRight: h(20),
          }}
        >
          <Text
            style={{
              color: COLORS.DARK3,
              fontFamily: FONTS.MEDIUM,
              fontSize: h(28),
              flex: 1
            }}
          >{store.name}
          </Text>

          {store.showFollowButton ? <FollowButton store={store} /> : null}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
});

const FollowUserList = observer(({store, style = {}, noResultText = 'There have been no starrers yet.', navigator, store_name}) => {
  
  if (store.isLoading) {
    return (
      <View style = {{ marginTop: 20 }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  if (store.isEmpty) {
    return (
      <View>
        <Text
          style= {{
            paddingTop: h(38),
            fontSize: h(34),
            textAlign: 'center',
            fontFamily: FONTS.BOOK_OBLIQUE
          }}
        >
          {noResultText}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[{
        ...style,
        marginBottom:50
      }]}
    >
      {(store.users) ?
        store.users.map(e => (
        <FollowUserRow
          store_name={store_name}
          store={e}
          key={e.key}
          navigator={navigator}
        />
      ))
      :
        store.map(e => (
          <FollowUserRow
            store_name={store_name}
            store={e}
            key={e.key}
            navigator={navigator}
          />
        ))
      }
    </ScrollView>

  );
});

export default FollowUserList;
