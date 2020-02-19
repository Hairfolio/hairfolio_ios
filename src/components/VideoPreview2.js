import { Image, observer, React, TouchableWithoutFeedback, View, windowHeight, windowWidth } from 'Hairfolio/src/helpers';
import { NativeModules } from 'react-native';
import Video from 'react-native-video';
import { COLORS } from '../helpers';

const RCTUIManager = NativeModules.UIManager;
const ImageFilter = NativeModules.ImageFilter;

const PlayButton = observer(({myWidth, playPauseAction}) => {
  return (
    <TouchableWithoutFeedback onPress={ playPauseAction } >
      <Image source={require('img/play_button.png')} />
    </TouchableWithoutFeedback>
  );
});

let count = 0;

@observer
class VideoPreview extends React.Component{

  constructor(props) {
    super(props)
    this.myWidth = props.width ? props.width : windowWidth;
    this.pic = props.picture;
    // this.post = props.post;
    this.state = {
      isPaused: true,
      clearId:null
    };
  }

  playPauseAction = () => {
    this.setState({
      isPaused: !this.state.isPaused,
    })
  }

  oneClickFun = () =>{

  }

  doubleClickFun = () =>{
    
  }  

  render = () => {
    if (this.pic == null) {
      return <View />;
    }
    return (
      <TouchableWithoutFeedback 
        onPress={
        (e) => {
          post = this.post;
          let data = e.touchHistory.touchBank[1];
          let timeDiff = data.currentTimeStamp - data.previousTimeStamp;
          
          let currentClickTime = (new Date()).getTime();

          if (post.lastClickTime) {
            let diff = currentClickTime - post.lastClickTime;


            if(this.state.clearId){
              clearTimeout(this.state.clearId)  
            }
            var clearId = setTimeout(() => {
               if (diff < 200) {
              post.doubleClick = true;
              post.starPost();
            } else {
              post.doubleClick = false;
              this.playPauseAction();
            }
              }, 350);
            this.setState({ clearId: clearId});
          }
          this.post.lastClickTime = currentClickTime;          
        }}     
      onLongPress={(e) => {
        this.post.savePost();
      }}>
        <View
          style={{
            width: this.myWidth,
            height: this.myWidth * (4/3),
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor:COLORS.RED2
          }}
        >
        {this.state.isPaused &&          
        <Image source={require('img/play_button.png')} />
        }
            <Video
              paused={this.state.isPaused}
              repeat={true}
              resizeMode="contain"
              onEnd={this.playPauseAction}
              style={{
                width: this.myWidth,
                height: windowHeight * (4/3),
                backgroundColor: COLORS.BLACK,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                zIndex: -1,
              }}
              key={
                (this.pic.key) ? this.pic.key : count++
                }
              source={{uri: this.pic.videoUrl}}
            />
        </View>
      </TouchableWithoutFeedback>
    );
  }
  
}

export default VideoPreview;
