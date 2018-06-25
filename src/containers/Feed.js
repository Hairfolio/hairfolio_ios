import PureComponent from '../components/PureComponent';
import {STATUSBAR_HEIGHT} from '../constants';
import SimpleButton from '../components/Buttons/Simple';
import FeedStore from '../mobx/stores/FeedStore';
import MessagesStore from '../mobx/stores/MessagesStore';
import Post from '../components/feed/Post';
import WhiteHeader from '../components/WhiteHeader';
import CreatePostStore from '../mobx/stores/CreatePostStore';
import { toJS } from 'mobx';
import { StatusBar } from 'react-native';

import {
  _, // lodash
  v4,
  observer, // mobx
  h,
  FONTS,
  COLORS,
  autobind,
  ListView,
  React, // react
  Component,
  windowWidth,
  windowHeight,
  // react-native components
  AlertIOS,
  Modal,
  ScrollView,
  ActivityIndicator,
  PickerIOS, Picker, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'Hairfolio/src/helpers';
import NewMessageStore from '../mobx/stores/NewMessageStore';
import NavigatorStyles from '../common/NavigatorStyles';

const NewMessageNumber = observer(() => {

  const store = NewMessageStore;

  if (store.newMessageNumber == 0) return null;

  return (
    <View
      style = {{
        backgroundColor: '#E62727',
        width: h(26),
        height: h(26),
        borderRadius: h(13),
        position: 'absolute',
        top: 0,
        left: -h(7),
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Text
        style = {{
          fontSize: h(16),
          fontFamily: FONTS.HEAVY,
          color: 'white',
          backgroundColor: 'transparent'
        }}

      >{store.newMessageNumber}</Text>
    </View>
  );
});

const FeedHeader = observer((props) => {
  return (
    <View
      style = {{
        height: h(92),
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
      <View style={{
        width: h(150),
        flex: 1,
      }} />
      <Image
        style = {{
          height: h(25),
          width: h(241)
        }}
        source={require('img/feed_header.png')}
      />
      <TouchableOpacity
        onPress={
          () => {
            props.navigator.push({
              screen: 'hairfolio.Messages',
              title: 'Messages',
              navigatorStyle: NavigatorStyles.basicInfo,
            });
          }
        }
        style={{width: h(150), flex: 1}} >
        <View
          style={{alignSelf: 'flex-end', marginRight: h(28), height: h(32), width: h(44)}}
        >
          <Image
            style={{height: h(32), width: h(44)}}
            source={require('img/feed_mail.png')}
          />
          <NewMessageNumber />

        </View>
      </TouchableOpacity>

    </View>
  );
});




@observer
export default class Feed extends PureComponent {
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentDidMount() {
    StatusBar.setBarStyle('dark-content', true);   
    NewMessageStore.load();
    FeedStore.load();
    FeedStore.hasLoaded = true;
  }

  returnBlank(){
    StatusBar.setBarStyle('dark-content', true);   
    return 'There are no posts in the feed yet.';
  }

  onNavigatorEvent(event) {
    
    switch(event.id) {
      case 'willAppear':
      // StatusBar.setBarStyle('dark-content');
      StatusBar.setBarStyle('dark-content', true);
        this.props.navigator.toggleTabs({
          to: 'shown',
        });
        break;
        case 'didAppear':
        StatusBar.setBarStyle('dark-content', true);        
        break;
      case 'bottomTabSelected':
      console.log("bottomTabSelected ==>");
      StatusBar.setBarStyle('dark-content', true);
        NewMessageStore.load();
        FeedStore.load();
        FeedStore.hasLoaded = true;
        break;
        case 'bottomTabReselected':
          console.log("bottomTabReselected ==>");
          break;
      default:
        break;
    }
  }

  render() {
    let store = FeedStore;
    let content = (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size='large' />
      </View>
    );

    if (store.isLoading) {
      content = (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size='large' />
        </View>
      );
    } else  if (store.elements.length == 0) {
      content =  (
        <View style={{flex: 1}}>
          <Text
            style= {{
              paddingTop: h(38),
              fontSize: h(34),
              textAlign: 'center',
              fontFamily: FONTS.BOOK_OBLIQUE
            }}
          >
            { this.returnBlank() }
          </Text>
        </View>
      );
    } else {
      StatusBar.setBarStyle('dark-content', true);   
      content = (
        <ListView
          dataSource={store.dataSource}
          renderRow={(p, i) => <Post key={p.key} post={p} navigator={this.props.navigator}/>}
          renderFooter={
            () => {
              if (store.nextPage != null) {
                return (
                  <View style={{flex: 1, paddingVertical: 20, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator size='large' />
                  </View>
                )
              } else {
                return <View />;
              }
            }
          }
          onEndReached={() => {
            store.loadNextPage();
          }}
        />
      );
    }

    return (
      <View style={{
        flex: 1,
        backgroundColor: COLORS.WHITE,
        paddingTop: STATUSBAR_HEIGHT,
      }}>
        <FeedHeader navigator={this.props.navigator}/>
        {content}
      </View>
    );
  }
};
