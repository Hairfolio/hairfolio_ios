import {
  _, // lodash
  v4,
  observable,
  computed,
  moment,
  action,
  observer, // mobx
  h,
  FONTS,
  autobind,
  React, // react
  Component,
  windowWidth,
  windowHeight,
  // react-native components
  AlertIOS,
  Modal,
  ScrollView,
  PickerIOS, Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'hairfolio/src/helpers.js';

import PostDetailStore from 'stores/PostDetailStore'



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
        console.log('myWidth', width);
        console.log('myWidth', height);
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
          onLayout={(a, b, c, d) => console.log('hash', a, b, c, d)}
          style={{
            top: this.state.top,
            left: this.state.left,
            width: this.state.width,
            height: 25,
            backgroundColor: '#3E3E3E',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text style={{fontSize: 15, backgroundColor: 'transparent', color: 'white'}}>#{this.props.pic.hashtag}</Text>
      </View>
    </TouchableWithoutFeedback>
    );
  }
}

const PostTags  = observer(({store}) => {

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

        let style = {
          position: 'absolute',
          top: pic.y - 13,
          left: pic.x - 13,
          height: 26,
          width: 26,
          backgroundColor: '#3E3E3E',
          borderRadius: 13,
          justifyContent: 'center',
          alignItems: 'center'
        };

        if (pic.imageSource) {
          return (
            <TouchableWithoutFeedback
              onPress={() => {
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
