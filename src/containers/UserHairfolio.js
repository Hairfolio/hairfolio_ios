import React from 'react';
import PureComponent from '../components/PureComponent';
import {View, Text} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import {
  observer, // mobx
  ActivityIndicator,
  Image,
  TextInput,
  h,
  v4
} from 'hairfolio/src/helpers.js';

import HairfolioStore from 'stores/HairfolioStore.js'
import Swipeout from 'hairfolio/react-native-swipeout/index.js';
h

const HairfolioItem = observer(({store}) => {

  var swipeoutBtns = [
    {
      height: h(140),
      width: h(140),
      onPress: () => HairfolioStore.delete(store),
      component:
      <View style={{
        backgroundColor: '#E62727',
        alignItems: 'center',
        justifyContent: 'center',
        width: h(140),
        height: h(140),
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
  if (store.name == 'Inspiration') {
    swipeoutBtns = [];
  }

  let previewPicture = <View
    style = {{
      height: h(110),
      width: h(110),
      marginLeft: h(18),
      backgroundColor: '#D8D8D8'
    }} />;

  if (store.picture) {
    previewPicture = (
      <Image
        style = {{
          height: h(110),
          width: h(110),
          marginLeft: h(18),
        }}
        source={store.picture.getSource(110)}
      />
    );
  }

  return (
    <Swipeout
      right={swipeoutBtns}>
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
          {store.name}
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
    </Swipeout>
  );
});

const HairfolioEdit = observer(({store}) => {
  console.log('render item');

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
          onEndEditing={() => HairfolioStore.addHairfolio()}
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
});


const HairfolioList = observer(() => {
  let store = HairfolioStore;

  if (store.isLoading) {
    return (
      <View style={{flex: 1}}>
        <ActivityIndicator style={{marginTop: 20}} size='large' />
      </View>
    );
  } else {
    return (
      <View style={{flex: 1}}>
        {store.hairfolios.map(e => <HairfolioItem key={e.id} store={e} />)}
        <HairfolioEdit />
      </View>
    );
  }
});

@connect(app)
export default class UserHairfolio extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired,
    onLayout: React.PropTypes.func.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  render() {
    return (<NavigationSetting
      style={{
        flex: 1,
        backgroundColor: COLORS.WHITE,
      }}
      onWillFocus={() => HairfolioStore.load()}
    >
      <View
        onLayout={this.props.onLayout}
      >
        <HairfolioList />
      </View>

    </NavigationSetting>);
  }
};
