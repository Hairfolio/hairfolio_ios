import { windowWidth } from 'Hairfolio/src/helpers';
import { h } from 'Hairfolio/src/style';
import { observer } from 'mobx-react';
import React from 'react';
import { Dimensions, FlatList, Image, Text, TouchableWithoutFeedback, View } from 'react-native';
import CreatePostStore from '../../mobx/stores/CreatePostStore';
import { COLORS, showLog, windowHeight } from '../../helpers';
import ImageResizer from "react-native-image-resizer";
import ImagePicker from 'react-native-image-crop-picker';

var isImageSelected  = false;

const EmptyPicture = observer(() => {
  return (
    <View
      style={{
        width: windowWidth / 4,
        height: windowWidth / 4
      }}
    />
  );
});

const SelectedBorder = observer(({width, picture}) => {
  if (picture.selectedNumber == null) {
    return <View />;
  }

  return (
    <View style={{
      position: 'absolute',
      width: width - 1,
      height: width - 1,
      top: 0,
      left: 0,
      borderColor: COLORS.DARK3,
      borderWidth: h(7)
    }}>
    <View
      style={{
        position: 'absolute',
        width: 25,
        height: 20,
        backgroundColor: COLORS.DARK3,
        top: 0,
        right: 0,
        borderBottomLeftRadius: h(8),
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: h(7),
        paddingTop: 3,
        paddingRight: 3
      }}
    >
    <Text
      style={{
        color: COLORS.WHITE4,
        fontSize: h(24)
      }}>
      {picture.selectedNumber}
    </Text>
  </View>
</View>

  );
});

const LibraryPicture = observer(({width, picture}) => {


  

  for(key in picture){

    if(key == "uri"){
      showLog("Asset ==>"+picture[key]);
    }

    

    // showLog("LibraryPicture ==>"+key+" val ==>"+picture[key]);

    // let temp = picture[key];
    // showLog("temp ==>"+typeof(temp));
    // if(typeof(temp) == "object"){
    //   for(key2 in temp){
    //     showLog("LibraryPicture key2==>"+key2+" val2 ==>"+temp[key2]);
    //   }
    // }    
  }

  
 
  return (
    <TouchableWithoutFeedback

      onPress={async () => 
      {
          // if(!CreatePostStore.isVideoSelected) {
      
            if(!isImageSelected)
            {
              isImageSelected = true;
              ImagePicker.openCropper({
                path: picture.uri,
                // width: windowWidth,
                // height: windowWidth + 100,
                // width: windowWidth*2,
                // height: (windowWidth + 100)*2,
                width: windowWidth + (windowWidth/2),
                height: windowHeight,
                compressImageQuality:1
                
                }).then((image) => {
                showLog("openCropper ==>"+JSON.stringify(image))
                picture.uri = image.path;
                picture.select()
                isImageSelected = false;
                },(error)=>{
                  isImageSelected = false;
                });
            }
         
          // }
        }}
    >
      <View
        style={{
          height: width,
          width: width
        }}
      >
        <Image
          style={{
            borderColor: COLORS.WHITE4,
            borderWidth: 1,
            backgroundColor: COLORS.WHITE4,
            height: width,
            width: width}}
            source={{uri: picture.uri}}
            onLoadEnd={() => CreatePostStore.imageLoaded()}
          />
          <SelectedBorder
            picture={picture}
            width={width}
          />
          <Text
            style={{
              position: 'absolute',
              bottom: 5,
              right: 5,
              color: 'white',
              backgroundColor: COLORS.TRANSPARENT
            }}
          >
            {picture.timeText}
          </Text>
        </View>
      </TouchableWithoutFeedback>
  );
    // }
});

const LibraryListView = observer(({store}) => {
  /*
  return (
    <ScrollView
      bounces={false}
      style={{height: Dimensions.get('window').height - 2 * (h(88) + Dimensions.get('window').width), width: Dimensions.get('window').width, backgroundColor: '#F0F0F0'}}>
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {store.libraryPictures.map((el) => <LibraryPicture picture={el} key={el.key} />)}
      </View>
    </ScrollView>
  );
  */
  let width = Dimensions.get('window').width / 4;
  return (
    <FlatList
      bounces={false}
      style={{
        height: Dimensions.get('window').height - 2 * (h(88) + Dimensions.get('window').width),
        width: Dimensions.get('window').width,
        backgroundColor: COLORS.WHITE4
      }}
      data={store.libraryDataSource}
      renderItem={({item}) =>
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <LibraryPicture key={item[0].key} picture={item[0]} width={width} />
          {item[1] == null ? <EmptyPicture  /> : <LibraryPicture key={item[1].key} picture={item[1]} width={width} /> }
          {item[2] == null ? <EmptyPicture  /> : <LibraryPicture key={item[2].key} picture={item[2]} width={width} /> }
          {item[3] == null ? <EmptyPicture  /> : <LibraryPicture key={item[3].key} picture={item[3]} width={width} /> }
        </View>
      }
    />
  );
});

export default LibraryListView;
