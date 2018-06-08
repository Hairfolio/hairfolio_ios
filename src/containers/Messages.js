import React from 'react';
import PureComponent from '../components/PureComponent';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {
  CameraRoll,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableHighlight,
  View, Text, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Image} from 'react-native';
import {COLORS, FONTS, h, SCALE} from 'Hairfolio/src/style';
import {observer} from 'mobx-react';
import autobind from 'autobind-decorator';
import _ from 'lodash';
import FollowButton from '../components/FollowButton';
import MessageDetailsStore from '../mobx/stores/MessageDetailsStore';
import WriteMessageStore from '../mobx/stores/WriteMessageStore';
import StarGiversStore from '../mobx/stores/StarGiversStore';
import {STATUSBAR_HEIGHT, POST_INPUT_MODE} from '../constants';
import LoadingScreen from '../components/LoadingScreen';
import BlackHeader from '../components/BlackHeader';
import CommentsStore from '../mobx/stores/CommentsStore';
import MessagesStore from '../mobx/stores/MessagesStore';
import Swipeout from 'Hairfolio/react-native-swipeout/index';
import LoadingPage from '../components/LoadingPage';
import whiteBack from '../../resources/img/nav_white_back.png';
import plusIcon from 'img/message_plus.png';
import NavigatorStyles from '../common/NavigatorStyles';

const MessageRow = observer(({store, navigator}) => {
  let pictureElement;
  if (store.picture) {
    pictureElement = (
      <Image
        style={{height: 40, width:40, marginRight: h(15)}}
        source={store.picture.getSource(40, 40)}
      />
    );
  }

  var swipeoutBtns = [
    {
      height: h(120),
      width: h(120),
      onPress: () => MessagesStore.delete(store),
      component:
      <View style={{
        backgroundColor: '#E62727',
        alignItems: 'center',
        justifyContent: 'center',
        width: h(120),
        height: h(120),
      }}
    >
      <Image
        style={{height: h(48), width: h(46)}}
        source={require('img/profile_trash.png')}
      />
    </View>
    }
  ]


  return (
    <Swipeout
      btnWidth={h(120)}
      right={swipeoutBtns}>
      <TouchableHighlight
        underlayColor='#ccc'
        onPress={
          () => {
            MessageDetailsStore.loadMessages(store.id);
            MessageDetailsStore.title = store.user.name;
            navigator.push({
              screen: 'hairfolio.MessageDetails',
              navigatorStyle: NavigatorStyles.basicInfo,
              title: 'Message Details',
            });
          }
        }
      >
        <View
          style = {{
            flexDirection: 'row',
            paddingTop: h(16),
            backgroundColor: 'white'
          }}
        >
          <View
            style = {{
              width: h(121),
              paddingLeft: h(16)
            }}
          >
            <Image
              style={{height: h(80), width: h(80), borderRadius: h(40)}}
              source={ (store.user.profilePicture) ? store.user.profilePicture.getSource(80, 80) : null}
            /> 
          </View>
          <View
            style = {{
              flexDirection: 'row',
              flex: 1,
              paddingBottom: h(23),
              borderBottomWidth: h(1),
              borderBottomColor: '#D8D8D8'
            }}
          >
            <View
              style = {{
                flex: 1
              }}
            >
              <Text
                style = {{
                  fontFamily: store.isNew ? FONTS.HEAVY : FONTS.MEDIUM,
                  fontSize: h(26),
                  color: '#393939'
                }}>
                {store.user.name}
              </Text>
              <Text
                numberOfLines={1}
                style = {{
                  fontSize: h(24),
                  color:  store.isNew ? '#393939' : '#868686',
                  fontFamily:  store.isNew ? FONTS.HEAVY : FONTS.ROMAN
                }}
              >
                {store.text}
              </Text>
            </View>

            <View
              style = {{
                paddingLeft: h(15),
                paddingTop: h(37),
                paddingRight: h(15)
              }}
            >
              <Text
                style = {{
                  fontFamily: store.isNew ? FONTS.HEAVY : FONTS.ROMAN,
                  color: store.isNew ? '#393939' : '#D8D8D8',
                  fontSize: h(24),
                  flex: 1,
                  textAlign: 'right'
                }}
              >
                {store.timeDifference}
              </Text>
            </View>
            {pictureElement}
          </View>
        </View>
      </TouchableHighlight>
    </Swipeout>
  );
});

const MessagesContent = observer(({store, navigator}) => {
  return (
    <View style={{flex: 1}}>
      <ScrollView
        ref={el => {store.scrollView = el}}
        onContentSizeChange={(w, h) => store.contentHeight = h}
        onLayout={ev => store.scrollViewHeight = ev.nativeEvent.layout.height}
      >
      {
        store.messages.map(e => <MessageRow key={e.key} store={e} navigator={navigator}/>)}
      </ScrollView>
    </View>
  );
});

@observer
export default class Messages extends PureComponent {
  constructor(props) {
    super(props);
    StatusBar.setBarStyle('light-content');
    MessagesStore.load();
    if (this.props.navigator) {
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }
  }

  static navigatorButtons = {
    leftButtons: [
      {
        id: 'back',
        icon: whiteBack,
      }
    ],
    rightButtons: [
      {
        id: 'add',
        title: '+',
        buttonFontSize: SCALE.h(48),
        buttonColor: COLORS.WHITE,
      }
    ]
  };

  onNavigatorEvent(event) {
    if(event.id == 'willAppear'){
      StatusBar.setBarStyle('light-content');
      MessagesStore.load();
    }


    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'back') {
        this.props.navigator.pop({
          animated: true,
          animationStyle: 'fade',
        });
      } else if (event.id == 'add') {
        WriteMessageStore.mode = 'MESSAGE';
        WriteMessageStore.navigator = this.props.navigator;
        this.props.navigator.push({
          screen: 'hairfolio.WriteMessage',
          navigatorStyle: NavigatorStyles.basicInfo,
          title: WriteMessageStore.title,
        });
      }
    }
  }

  render() {
    let store = MessagesStore;

    let Content = LoadingPage(
      MessagesContent,
      store,
      {navigator: this.props.navigator},
    );

    return (
       <View style={{flex: 1}}>
        <Content />
      </View>
    );
  }
};
