import { FONTS, h, observer, React, Text, View } from '../../helpers';
import TagPostStore from '../../mobx/stores/TagPostStore';
import { COLORS } from '../../style';

const PostDescription = observer(({post, navigator, limitLinesNumbers, style = {}}) => {
  return (
    <View
      style={{
        paddingHorizontal: h(22),
        paddingTop: h(14),
        paddingBottom: h(28),
        ...style
      }}
    >
      <Text
        style = {{
          flexWrap: 'wrap',
          flexDirection: 'row',
        }}
        numberOfLines={limitLinesNumbers ? 2 : null}
      >
        <Text
          style = {{
            fontSize: h(28),
            color: COLORS.GRAY2,
            fontFamily: FONTS.ROMAN,
          }}
        >
          {post.description + ' '}
        </Text>
        {
          post.hashTags.map(e =>
              <Text
                key={e.key}
                onPress={() => {
                  TagPostStore.jump(
                    e.hashtag,
                    `#${e.hashtag}`,
                    navigator,
                    'from_feed'
                  );
                }}
                style = {{
                  fontSize: h(28),
                  color: COLORS.DARK3,
                  fontFamily: FONTS.MEDIUM,
                  textAlign: 'left'
                }}
              >
                {`#${e.hashtag} `}
              </Text>
          )
        }
      </Text>
    </View>
  );
});


export default PostDescription;
