import { ActivityIndicator, FONTS, h, Image, observer, React, Text, TouchableOpacity, View } from 'Hairfolio/src/helpers';
import { COLORS } from '../helpers';

const followingImage = () => {
  return(
    <Image
      style={{
        marginRight: 8,
        height: 12,
        width: 12,
      }}
      source={require('img/feed_follow.png')}
    />
  );
}

const FollowButton = observer(({store, style = {}}) => {

  const followAction = () => (store.isFollowing) ? store.unfollow() : store.follow();

  if (store.followLoading) {
    return (
      <ActivityIndicator />
    );
  }

  return (
    <TouchableOpacity
      onPress={followAction}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: (store.isFollowing) ? COLORS.DARK : COLORS.GRAY2,
        height: h(53),
        padding: h(21),
        margin: 1,
        ...style
      }}
    >
      <View
        style = {{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {store.isFollowing && followingImage()}
        <Text
          style = {{
            textAlignVertical: 'center',
            textAlign: 'center',
            color: (store.isFollowing) ? COLORS.DARK : COLORS.GRAY2,
            fontFamily: FONTS.HEAVY_OBLIQUE
          }}
        >
          { (store.isFollowing) ? 'FOLLOWING' : 'FOLLOW' }
        </Text>
      </View>
    </TouchableOpacity>
  );
});

export default FollowButton;
