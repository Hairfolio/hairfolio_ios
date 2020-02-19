import React, { Component } from 'react';
import {ScrollView, View, Text, TouchableHighlight, FlatList} from 'react-native';
import {COLORS, FONTS, SCALE} from '../style';
import {
  observer, // mobx
  ActivityIndicator,
  Image,
  TextInput,
  h,
  getUserId,
  v4,
  windowWidth
} from 'Hairfolio/src/helpers';
import NavigatorStyles from '../common/NavigatorStyles';
import HairfolioStore from '../mobx/stores/HairfolioStore';
import Swipeout from 'Hairfolio/react-native-swipeout/index';
import HairfolioPostStore from '../mobx/stores/HairfolioPostStore';
import { showLog } from '../helpers';

const HairfolioItem2 = observer(({store, isEditable, navigator}) => {
  var swipeoutBtns = [
    {
      height: h(220),
      width: h(220),
      onPress: () => HairfolioStore.delete(store),
      component:
      <View style={{
        backgroundColor: '#E62727',
        alignItems: 'center',
        justifyContent: 'center',
        width: h(220),
        height: h(220),
      }}
    >
      <Image
        style={{height: h(48), width: h(46)}}
        source={require('img/profile_trash.png')}
      />
      </View>
    }
  ];

  // you cannot delete Inspiration
  if (store.name == 'Inspiration' || !isEditable) {
    swipeoutBtns = [];
  }

  let previewPicture = (
    <View
    style = {{
      height: h(195),
      width: h(195),
      marginLeft: h(18),
      backgroundColor: '#D8D8D8'
    }} />
  );

  if (store.picture) {
    previewPicture = (
      <Image
        style = {{
          height: h(195),
          width: h(195),
          marginLeft: h(18),
        }}
        defaultSource={require('img/medium_placeholder_icon.png')}
        source={store.picture.getSource(195, 195)}
      />
    );
  }

  return (
    <Swipeout
      btnWidth={220 / 2}

      right={swipeoutBtns}>

      <TouchableHighlight
        underlayColor='#ccc'
        onPress= {
          () => {
            if (store.name != 'Inspiration') {
              HairfolioPostStore.title = `${store.name}`;
            } else {
              HairfolioPostStore.title = 'Inspo';
            }
            HairfolioPostStore.load(store);
            navigator.push({
              screen: 'hairfolio.HairfolioPosts',
              navigatorStyle: NavigatorStyles.tab,
            });
          }
        }
      >

      <View
        style={{
          height: h(220),
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderBottomColor: '#DDDDDD'
        }}
      >
        {previewPicture}
        <Text
          style = {{
            marginLeft: h(26),
            flex: 1,
            fontSize: h(30),
            fontFamily: FONTS.MEDIUM,
            color: '#404040'
          }}
        >
          {store.name == 'Inspiration' ? 'Inspo' : store.name}
        </Text>
        <Text
          style = {{
            marginHorizontal: h(23),
            color: '#C5C5C5',
            fontSize: h(30),
            fontFamily: FONTS.ROMAN
          }}
        >
          {store.numberOfPosts}
        </Text>
      </View>
    </TouchableHighlight>
  </Swipeout>
  );
});

class HairfolioEdit extends React.Component {
  state = {
    text: '',
  }

  render() {
    const {text} = this.state;
    return (
        <View
          style={{
            height: h(140),
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            borderBottomWidth: 1,
            borderBottomColor: '#DDDDDD'
          }}
        >
          <View
            style = {{
              height: h(110),
              width: h(110),
              marginLeft: h(18),
              backgroundColor: '#D8D8D8'
            }}
          >
          </View>
          <TextInput
            ref={el => {HairfolioStore.textInput = el}}
            defaultValue=''
            value={text}
            onChangeText={(text) => this.setState({text})}
            onEndEditing={() => HairfolioStore.addHairfolio(text)}
            placeholder='Add New Item'
            style = {{
              marginLeft: h(26),
              flex: 1,
              fontSize: h(30),
              fontFamily: FONTS.MEDIUM,
              color: '#404040'
            }}
          />
        </View>
    );
  }
}


const HairfolioItem = observer(({ store, isEditable, navigator, from, objStore }) => {
  // var swipeoutBtns = [
  //   {
  //     height: h(220),
  //     width: h(220),
  //     onPress: () => HairfolioStore.delete(store),
  //     component: (
  //       <View
  //         style={{
  //           backgroundColor: "#E62727",
  //           alignItems: "center",
  //           justifyContent: "center",
  //           width: h(220),
  //           height: h(220)
  //         }}
  //       >
  //         <Image
  //           style={{ height: h(48), width: h(46) }}
  //           source={require("img/profile_trash.png")}
  //         />
  //       </View>
  //     )
  //   }
  // ];

  // you cannot delete Inspiration
  // if (store.name == "Inspiration" || !isEditable) {
  //   swipeoutBtns = [];
  // }

  let previewPicture = (
    <View
      style={{
        width: windowWidth / 2,
        height: windowWidth/1.3,
        // marginLeft: h(18),
        backgroundColor: "#D8D8D8"
      }}
    />
  );
  const windowEdge = Math.round(windowWidth / 2);
  if (objStore.photos) {
    previewPicture = (
      <Image
        style={{
          width: windowWidth / 2,
          height: windowWidth/1.3,
          flex:1
          // marginLeft: h(18)
        }}
        defaultSource={require('img/medium_placeholder_icon.png')}
        source={(objStore.photos[0].asset_url) ? {uri: objStore.photos[0].asset_url} : require('img/medium_placeholder_icon.png')}
        // source={(store.photos && store.photos[0]) ? {uri: store.photos[0].asset_url}
        //   :
        //   require('img/medium_placeholder_icon.png') }
      />
    );
  }

  return (
    // <Swipeout btnWidth={220 / 2} right={swipeoutBtns}>
      <TouchableHighlight
        underlayColor="#ccc"
        onPress={() => {
          if (store.name != "Inspiration") {
            HairfolioPostStore.title = `${store.name}`;
          } else {
            HairfolioPostStore.title = "Saved Inspo";
          }
          HairfolioPostStore.load(store);
          if (from) {
            navigator.push({
              screen: "hairfolio.HairfolioPosts",
              navigatorStyle: NavigatorStyles.tab,
              passProps: {
                from_star: true
              }
            });
          } else {
            navigator.push({
              screen: "hairfolio.HairfolioPosts",
              navigatorStyle: NavigatorStyles.tab
            });
          }
        }}
      >
        <View
          style={{
            width: windowWidth / 2,
            height: windowWidth/1.3,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
            borderBottomWidth: 1,
            borderBottomColor: "#DDDDDD"
          }}
        >
          {previewPicture}
        </View>
      </TouchableHighlight>
    // </Swipeout>
  );
});


const HairfolioList = observer(({navigator, from}) => {
  let store = HairfolioStore;
  let lastx = 0, scrollingRight ;
  if (store.isLoading) {
    return (
      <View style={{flex: 1}}>
        <ActivityIndicator size='large' />
      </View>
    );
  } 
  if (store.hairfolios.length == 0) {
    return (
      <View style={{flex: 1}}>
        <Text
          style= {{
            paddingVertical: h(38),
            fontSize: h(34),
            textAlign: 'center',
            fontFamily: FONTS.BOOK_OBLIQUE
          }}
        >
          No inspo tag available.
        </Text>
      </View>
    );
  } else {
    return (
      <View style={{flex: 1}}>
      {store.hairfolios.map((item, index) => (
        <View key={index}>
          <View style={{  height: h(80),
            justifyContent: 'space-between',
            flexDirection:'row',
            alignItems: 'flex-start',
            backgroundColor: COLORS.FLOATBUTTON
          }}>
            <Text style={{ marginLeft: 2,
              textAlignVertical: 'bottom',
              fontSize: h(30),
              fontFamily: FONTS.MEDIUM,
              color: COLORS.BLACK,
              alignSelf:'center'
              }}> {item.name} </Text>

            <Text style={{ alignSelf:'center',
              color:'black',
              marginRight:2,
              fontSize: h(30),
              fontFamily: FONTS.MEDIUM,
              color: COLORS.BLACK,
              textAlignVertical: 'bottom'}} 
              onPress={()=>{
                if (item.name != "Inspiration") {
                  HairfolioPostStore.title = `${item.name}`;
                } else {
                  HairfolioPostStore.title = "Saved Inspo";
                }
                HairfolioPostStore.load(item);
                if (from) {
                  navigator.push({
                    screen: "hairfolio.HairfolioPosts",
                    navigatorStyle: NavigatorStyles.tab,
                    passProps: {
                      from_star: true
                    }
                  });
                } else {
                  navigator.push({
                    screen: "hairfolio.HairfolioPosts",
                    navigatorStyle: NavigatorStyles.tab
                  });
                }
            }}> See All </Text>
          </View>
          {
            (item.allImages.length == 0) ?
              <View style={{flex: 1}}>
                <Text
                  style= {{
                    paddingVertical: h(38),
                    fontSize: h(34),
                    textAlign: 'center',
                    fontFamily: FONTS.BOOK_OBLIQUE
                  }}
                >
                  No posts available for {item.name} 
                </Text>
              </View>
            :
            <FlatList
              data={item.allImages}
              horizontal={true}
              extraData={item.allImages}
              onEndReached={() => {
                store.hairfolios[index].loadNextForFolioPost(item.id);
              }}
              renderItem={(e) => (
                <HairfolioItem
                isEditable={store.isEditable}
                key={e.id}
                objStore={e.item}
                store={item}
                navigator={navigator}
                from={from}
              />)}
            />
          }
        </View>
      ))}
      </View>
    );
  }
});

// return (
//   <View style={{flex: 1}}>
//     {store.hairfolios.map(e => <HairfolioItem isEditable={store.isEditable} key={e.id} store={e} navigator={navigator} />)}
//     {store.isEditable ? <HairfolioEdit /> : <View />}
//   </View>
// );

export default class UserHairfolio extends React.Component {
  constructor(props) {
    super(props);
    HairfolioStore.load(this.props.profile.id);
  }

  state = {
    addNewItemValue: '',
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.WHITE,
        }}
      >
        <HairfolioList  navigator={this.props.navigator} from={this.props.from_star}/>
      </View>
    );
  }
};
