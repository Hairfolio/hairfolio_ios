import { Image, React } from '../../src/helpers';

export default class MyImage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      width: props.width,
      heightRatio:null
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
