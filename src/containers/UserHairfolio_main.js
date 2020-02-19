import Swipeout from "Hairfolio/react-native-swipeout/index";
import { ActivityIndicator, h, Image, observer, TextInput } from "Hairfolio/src/helpers";
import React from "react";
import { ScrollView, Text, TouchableHighlight, View } from "react-native";
import NavigatorStyles from "../common/NavigatorStyles";
import HairfolioPostStore from "../mobx/stores/HairfolioPostStore";
import HairfolioStore from "../mobx/stores/HairfolioStore";
import { COLORS, FONTS } from "../style";
import { windowWidth, showLog } from "../helpers";

const HairfolioItem = observer(({ store, isEditable, navigator, from }) => {
  var swipeoutBtns = [
    {
      height: h(220),
      width: h(220),
      onPress: () => HairfolioStore.delete(store),
      component: (
        <View
          style={{
            backgroundColor: "#E62727",
            alignItems: "center",
            justifyContent: "center",
            width: h(220),
            height: h(220)
          }}
        >
          <Image
            style={{ height: h(48), width: h(46) }}
            source={require("img/profile_trash.png")}
          />
        </View>
      )
    }
  ];

  // you cannot delete Inspiration
  if (store.name == "Inspiration" || !isEditable) {
    swipeoutBtns = [];
  }

  let previewPicture = (
    <View
      style={{
        width: windowWidth / 2,
        height: windowWidth/1.3,
        // marginLeft: h(18),
        backgroundColor: "#FFF"
      }}
    >
      <Image
        style={{
          width: windowWidth / 2,
          height: windowWidth/1.3,
          // marginLeft: h(18)
        }}
        resizeMode={'contain'}
        source={require('img/medium_placeholder_icon.png')}
      />
    </View>
  );
  const windowEdge = Math.round(windowWidth / 2);
  if (store.picture) {
    previewPicture = (
      <Image
        style={{
          width: windowWidth / 2,
          height: windowWidth/1.3,
          // marginLeft: h(18)
        }}
        source={store.picture.getSource(windowEdge, windowEdge)}
      />
    );
  }

  return (
    // <Swipeout btnWidth={220 / 2} right={swipeoutBtns}>
      <TouchableHighlight
        underlayColor="#DDDDDD"
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

class HairfolioEdit extends React.Component {
  state = {
    text: ""
  };

  render() {
    const { text } = this.state;
    return (
      <View
        style={{
          height: h(140),
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
          borderBottomWidth: 1,
          borderBottomColor: COLORS.COLLAPSABLE_COLOR
        }}
      >
        <View
          style={{
            height: h(110),
            width: h(110),
            marginLeft: h(18),
            backgroundColor: COLORS.LIGHT4
          }}
        />
        <TextInput
          ref={el => {
            HairfolioStore.textInput = el;
          }}
          defaultValue=""
          value={text}
          onChangeText={text => this.setState({ text })}
          onEndEditing={() => HairfolioStore.addHairfolio(text)}
          placeholder="Add New Item"
          style={{
            marginLeft: h(26),
            flex: 1,
            fontSize: h(30),
            fontFamily: FONTS.MEDIUM,
            color: COLORS.SEARCH_LIST_ITEM_COLOR
          }}
        />
      </View>
    );
  }
}

const HairfolioList = observer(({ navigator, from }) => {
  let store = HairfolioStore;
  if (store.isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }  
  if (store.hairfolios.length == 0) {
    return (
      <View style={{flex: 1}}>
        <Text
          style= {{
            paddingTop: h(38),
            fontSize: h(34),
            textAlign: 'center',
            fontFamily: FONTS.BOOK_OBLIQUE
          }}
        >
          No inspo tag available.
        </Text>
      </View>
    );
  }
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          scrollEnabled={true}
          showsVerticalScrollIndicator={true}
          horizontal={true}
        >
          {store.hairfolios.map(e => (
            <HairfolioItem
              isEditable={store.isEditable}
              key={e.id}
              store={e}
              navigator={navigator}
              from={from}
            />
          ))}
          {/* <GridList
        navigator={navigator}
        noElementsText='There are no posts with this tag'
        store={store}
        from={'from_star'}/> */}
          {/* {store.isEditable ? <HairfolioEdit /> : <View />} */}
        </ScrollView>
      </View>
    );
  });

export default class UserHairfolio extends React.Component {
  constructor(props) {
    super(props);
    HairfolioStore.load(this.props.profile.id);
    // alert(this.props.from_star)
  }

  state = {
    addNewItemValue: ""
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.WHITE
        }}
      >
        <HairfolioList
          navigator={this.props.navigator}
          from={this.props.from_star}
        />
      </View>
    );
  }
}
