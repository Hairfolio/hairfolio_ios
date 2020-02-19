import { h, Image, observer, React, Text, TouchableWithoutFeedback, View } from 'Hairfolio/src/helpers';
import { COLORS } from '../../helpers';

class HashTag extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      top: -100,
      left: -100,
      width: null,
    };
  }

  componentDidMount() {
    setTimeout(() =>  {
      this.refs.hashView.measure((a, b, width, height, px, py) => {
        this.setState({
          width: width + 10,
          left: this.props.pic.x - width / 2 - 5,
          top: this.props.pic.y - h(25)
        });
      });
    });
  }
  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.props.store.selectTag(this.props.pic);
        }}
      >
        <View
          ref='hashView'
          style={{
            top: this.state.top,
            left: this.state.left,
            width: this.state.width,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            borderRadius:5,
            backgroundColor:COLORS.WHITE
          }}
        >
      </View>
    </TouchableWithoutFeedback>
    );
  }
}

const PostTags  = observer(({store, navigator}) => {
  if (!store.showTags) {
    return null;
  }
  return (
    <View
      style = {{
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    >
      {store.selectedPicture.tags.map((pic) => {

        if (pic.x < 0) {
          return <View key={pic.key} />;
        }

        let style = {
          position: 'absolute',
          top: pic.y - 13,
          left: pic.x - 13,
          height: 26,
          width: 26,
          backgroundColor: COLORS.DARK3,
          borderRadius: 13,
          justifyContent: 'center',
          alignItems: 'center'
        };

        if (pic.imageSource) {
          return (
            <TouchableWithoutFeedback
              onPress={() => {
                store.navigator = navigator;
                store.selectTag(pic);
              }}
              key={pic.key}>
              <Image
                style={style}
                source={pic.imageSource}
              />
            </TouchableWithoutFeedback>
          );
        }
        if (pic.type == 'hashtag') {
          return (
            <HashTag store={store} key={pic.key} pic={pic} />
          );
        }

        return (
          <TouchableWithoutFeedback
            key={pic.key}
            onPress={() => {
              store.navigator = navigator;
              store.selectTag(pic);
            }}
          >
            <View
              key={pic.key}
              style={style}>
              <Text style={{fontSize: 15, backgroundColor: 'transparent', color: 'white'}}>{pic.abbrev}</Text>
            </View>
          </TouchableWithoutFeedback>
        );

      })}
    </View>
  );
});

export default PostTags;