import React from 'react';
import PureComponent from '../components/PureComponent';
import CreateLogStore from '../mobx/stores/CreateLogStore';
import ContactDetailsStore from '../mobx/stores/ContactDetailsStore';
import autobind from 'autobind-decorator';
import { FONTS, h, SCALE } from 'Hairfolio/src/style';
import { observer } from 'mobx-react';
var { height, width } = Dimensions.get('window');

//new

import { Dimensions, FlatList, Image, Text, TouchableWithoutFeedback,TouchableOpacity, View,StatusBar } from 'react-native';
import { COLORS, showLog, windowHeight,windowWidth,showAlert } from 'Hairfolio/src/helpers';
import ImagePicker from 'react-native-image-crop-picker';
import NavigatorStyles from '../common/NavigatorStyles';

var mLastClickTime = null;



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
    }
 
  return (
    <TouchableWithoutFeedback

      onPress={async () => 
      {
        if(mLastClickTime != null) {
          if (((new Date()).getTime() - mLastClickTime) < 1500){
            showLog("INSIDE IF CALCULATION")
            return;
          }
          showLog("mLastClickTime is not null")
        }
        showLog("WORKING ON CLICK")
        mLastClickTime = (new Date()).getTime();
        ImagePicker.openCropper({
        path: picture.uri,
        width: windowWidth + (windowWidth/2),
        height: windowHeight,
        compressImageQuality:1
        
        }).then((image) => {
        showLog("openCropper ==>"+JSON.stringify(image))
          picture.uri = image.path;
          picture.select()
        }).catch((error) => {
          showLog("openCropper catch==> " + JSON.stringify(error))
        });
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
            onLoadEnd={() => CreateLogStore.imageLoaded()}
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

const LibraryListView = observer(({ store }) => {
 
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

const LibraryHeader = observer(({ onLeft, onRight, onTitle, store }) => {
  return (
    <View
      style={{
        height: (height > 800) ? h(88) + 20 : h(88),
        flexDirection: 'row',
        alignItems: 'flex-end',
        borderBottomWidth: h(1),
        borderColor: COLORS.LIGHT_GRAY1,
        // backgroundColor:'green'
      }}
    >
      <View style={{
        height: 50, width: width - 20,
        flexDirection: 'row',
        marginLeft: 10,
        alignItems: 'center'
      }}>
        <TouchableOpacity
          onPress={onLeft}
          style={{ flex: 1 }}>
          <Text style={{
            fontSize: SCALE.h(34),
            fontFamily: FONTS.SF_REGULAR
          }} >
            Cancel
        </Text>
        </TouchableOpacity>
        <View style={{ flex: 2, }}>
          <TouchableWithoutFeedback onPress={onTitle}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: h(34) }}> {store.libraryTitle} </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: h(26), color: COLORS.GRAY5 }}>{store.groupName}</Text>
                <Image
                  style={{ marginLeft: h(6), marginTop: 2 }}
                  source={require('../../resources/img/post_down_arrow.png')}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <TouchableOpacity
          onPress={onRight}
          style={{ flex: 1 }}>
          <Text style={{
            fontSize: SCALE.h(34),
            textAlign: 'right',
            fontFamily: FONTS.SF_REGULAR
          }} >
            Next
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
});

@observer
@autobind
export default class CreateLogLibrary extends PureComponent{
  
  constructor(props) {
    super(props);

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    StatusBar.setBarStyle("dark-content", true);
    showLog("EVENT ID Log library ==> " + event.id )
    if (event.id == 'willAppear') {
      if(CreateLogStore.isNoteCreated) {
        this.props.navigator.pop({ animated: false })
      } else {
        CreateLogStore.updateLibraryPictures()
      }
    }
  }
  

  render() {

    let cancel = () => {
      if(CreateLogStore.noteId != null) {
        this.props.navigator.pop({ animated: true });
        return;
      } else {
        if (!CreateLogStore.gallery.wasOpened) {
          CreateLogStore.reset();
          CreateLogStore.reset(true);
          ContactDetailsStore.isScreenPop = false;
          this.props.navigator.pop({ animated: true });     
          // this.props.navigator.popToRoot({ animated: true });     
          // this.props.navigator.switchToTab({
          //   tabIndex: 0,
          // });
        } else {
          this.props.navigator.push({
            screen: 'hairfolio.CreateLogScreen',
            navigatorStyle: NavigatorStyles.tab,
            passProps: {
              isFromLibrary: true
            }
          });
          // StatusBar.setHidden(false);
        }
      } 
      // StatusBar.setHidden(false);
    };
    let placeholder_icon = require('img/medium_placeholder_icon.png');
    return (
      <View style={{
        flex: 1,
        backgroundColor: COLORS.WHITE,
        paddingTop: 20,
      }}>
        <LibraryHeader
          onTitle={() => {
            this.props.navigator.push({
              screen: 'hairfolio.AlbumPage',
              navigatorStyle: NavigatorStyles.tab,
              passProps: {
                fromScreen: 'CreateLogScreen',
              }
            })
          }}
          
          onLeft={cancel}
          onRight={() => { 
            if (CreateLogStore.selectedLibraryPicture == null) {
              showAlert('Select at least one picture');
            } else {
              this.setState({ isLoader: true });
              CreateLogStore.addLibraryPicturesToGallary(true);
              // setTimeout(() => {
                this.setState({ isLoader: false });
                if (!this.props.isFromLogScreen) {
                  this.props.navigator.push({
                    screen: 'hairfolio.CreateLogScreen',
                    navigatorStyle: NavigatorStyles.tab,
                    passProps: {
                      isFromLibrary: true
                    }
                  });
                } else {
                  this.props.navigator.pop({animated: true});
                }                
                // StatusBar.setHidden(false);
              // }, 5000)
            }
           }}
          store={CreateLogStore}
        />
        {(CreateLogStore.selectedLibraryPicture != null) ?
          <View
            style={{ height: windowWidth, width: windowWidth, justifyContent: 'center', alignItems: 'center' }}
          >
            <Image
              style={{width: windowWidth, height: windowWidth,flex: 1 }}
              defaultSource={placeholder_icon}
              source={{ uri: CreateLogStore.selectedLibraryPicture.uri }}
            />
          </View>
          :
          <View
            style={{
              height: Dimensions.get('window').width,
              width: Dimensions.get('window').width,
              justifyContent: 'center',
              alignItems: 'center',
            }}
           >
            <Text style={{ fontSize: 30, textAlign: 'center' }}>Select a picture</Text>
          
          </View>
        }
        
        <LibraryListView store={CreateLogStore} />
      </View>
    )
  }
 
}