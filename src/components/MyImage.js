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
  ActivityIndicator,
  PickerIOS, Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'hairfolio/src/helpers.js';

export default class MyImage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      width: null
    };
  }

  render() {
    let imageStyle = {
      width: this.props.width,
      height: this.props.width
    };

    if (this.state.heightRatio) {
      imageStyle = {
        width: this.props.width,
        height: this.props.width * this.state.heightRatio
      };
    }

    return (
      <Image
        style={imageStyle}
        onLayout={
          (event) => {
            let currentWidth  = event.nativeEvent.layout.width;
            let currentHeight = event.nativeEvent.layout.height;

            let heightRatio = event.nativeEvent.layout.height / event.nativeEvent.layout.width;
            if (!this.state.heightRatio) {
              this.setState({
                heightRatio: heightRatio
              });
            }

          }
        }
        resizeMode='contain'
        source={this.props.source}
      />
    );
  }
}
