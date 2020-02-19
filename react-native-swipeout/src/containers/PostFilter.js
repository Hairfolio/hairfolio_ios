import autobind from 'autobind-decorator';
import { observer } from 'mobx-react';
import React from 'react';
import { Dimensions, Image, StatusBar, View } from 'react-native';
import PureComponent from '../components/PureComponent';
import SlimHeader from '../components/SlimHeader';
import CreatePostStore from '../mobx/stores/CreatePostStore';
import { COLORS } from '../style';

@observer
@autobind
export default class PostFilter extends PureComponent {

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.WHITE,
        }}
      >
        <SlimHeader
          onLeft={() =>{
            this.navigator.pop({ animated: true });
          }}
          leftText='Retake'
          rightText='Use Photo'
          onRight={() => {
            CreatePostStore.addTakenPictureToGallery()
            this.navigator.pop({ animated: true });
            StatusBar.setHidden(false);
          }}
        />
      <Image
        style={{width:  Dimensions.get('window').width, height: Dimensions.get('window').width
        }}
        source={{uri: CreatePostStore.lastTakenPicture.path}}/>
      </View>
    );
  }
};
