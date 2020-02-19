import { FONTS, getUserId, h, Image, observer, React, Text, TouchableWithoutFeedback, View } from '../../helpers';
import NavigatorStyles from '../../common/NavigatorStyles';
import CommentsStore from '../../mobx/stores/CommentsStore';
import PostDetailStore from '../../mobx/stores/PostDetailStore';
import TagPostStore from '../../mobx/stores/TagPostStore';
import { COLORS } from '../../style';
import { showLog } from '../../helpers';

const ActivityItem = observer(({store, isMe, navigator, from}) => {

  let postContent;

  if (store.post) {
    postContent = (
      <Image
        defaultSource={require('img/medium_placeholder_icon.png')}
        style={{marginLeft: h(120), marginBottom: h(20), height: h(100), width: h(100), flex:1}}
        source={(store.post.picture.source) ? store.post.picture.source : require('img/medium_placeholder_icon.png')}
      />
    )
  }

  let infoContent;
  if (store.type == 'follow') {
    if (isMe) {
      infoContent = <Text>started following you</Text>
    } else {
      infoContent = (
        <Text>started following
          <TouchableWithoutFeedback
            onPress={
              () =>{
                if(store.user2.id !== getUserId()){
                  navigator.push({
                    screen: 'hairfolio.Profile',
                    navigatorStyle: NavigatorStyles.tab,
                    passProps: {
                      userId: store.user2.id,
                      [from]:true
                    }
                  });
                }
                
                PostDetailStore.clear();
                TagPostStore.clear();
                CommentsStore.clear();
              }}
            >
              <Text style={{fontFamily: FONTS.MEDIUM, color: COLORS.DARK3}}>
                {' ' + store.user2.name}
              </Text>
            </TouchableWithoutFeedback>
        </Text>
      );
    }
  } else if (store.type == 'star') {
    if (isMe) {
      infoContent = <Text>starred your post</Text>
    } else {
      infoContent = (
        <Text>starred a post of
          <TouchableWithoutFeedback
            onPress={
              () =>{      
                if(store.user2.id !== getUserId()){
                  navigator.push({
                    screen: 'hairfolio.Profile',
                    navigatorStyle: NavigatorStyles.tab,
                    passProps: {
                      userId: store.user2.id,
                      [from]:true
                    }
                  });
                }

                PostDetailStore.clear();
                TagPostStore.clear();
                CommentsStore.clear();
              }}
            >
              <Text style={{fontFamily: FONTS.MEDIUM, color: COLORS.DARK3}}>
                {' ' + store.user2.name}
              </Text>
            </TouchableWithoutFeedback>
        </Text>
      );
    }
  }

  return (
    <View
    >
      <View
        style = {{
          flexDirection: 'row',
          height: h(120),
          alignItems: 'center',
          paddingLeft: h(20)
        }}
      >

      {
        store.user.profilePicture
        ?
        <Image
          style={{height: h(80), width:h(80), borderRadius:h(40)}}
          source={(store.user.profilePicture.source) ? (store.user.profilePicture.source) : require('img/stylist.png')}
          defaultSource={require('img/stylist.png')}
        />
        :
        <View
          style={{height: h(80), width:h(80), borderRadius:h(40)}}
        />

      }

      <Text
        style = {{
          fontSize: h(28),
          paddingLeft: h(20),
          flex: 1,
          color: COLORS.DARK3,
          fontFamily:FONTS.ROMAN
        }}
      >
        <TouchableWithoutFeedback
          onPress={
            () =>{
              if(store.user.id !== getUserId()){
                navigator.push({
                  screen: 'hairfolio.Profile',
                  navigatorStyle: NavigatorStyles.tab,
                  passProps: {
                    userId: store.user.id,
                    [from]:true
                  }
                });
              }
              PostDetailStore.clear();
              TagPostStore.clear();
              CommentsStore.clear();
            }}
          >
            <Text
              style={{fontFamily: FONTS.MEDIUM, color: COLORS.DARK3}}
            >
              {store.user.id == getUserId() ? 'You ' : store.user.name +' '+store.user.id+' '}
            </Text>
          </TouchableWithoutFeedback>
          {infoContent}
      </Text>

      <View
        style = {{
          width: h(108),
          paddingTop: h(37),
          paddingRight: h(15)
        }}
      >
        <Text
          style = {{
            fontFamily: FONTS.ROMAN,
            color: COLORS.LIGHT4,
            fontSize: h(24),
            flex: 1,
            textAlign: 'right'
          }}

        >
          {store.timeDifference()}
        </Text>
      </View>
    </View>
    {postContent}
    <View
      style = {{
        height: h(1),
        marginLeft: h(120),
        flex: 1,
        backgroundColor: COLORS.LIGHT4
      }}
    />
  </View>
  );
});

export default ActivityItem;
