import React from 'react';
import PureComponent from '../components/PureComponent';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {
  CameraRoll,
  ScrollView,
  StatusBar,
  TextInput,
  View, Text, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Image} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {COLORS, FONTS, h, SCALE} from 'Hairfolio/src/style';
import NavigationSetting from '../navigation/NavigationSetting';
import {observer} from 'mobx-react/native';
import autobind from 'autobind-decorator'
import _ from 'lodash';

import FollowButton from 'components/FollowButton.js'

import StarGiversStore from 'stores/StarGiversStore.js'

import {appStack, gallery, postFilter, albumPage} from '../routes';

import * as routes from 'Hairfolio/src/routes.js'

import {STATUSBAR_HEIGHT, POST_INPUT_MODE} from '../constants';

import LoadingScreen from 'components/LoadingScreen.js'
import BlackHeader from 'components/BlackHeader.js'

import CommentsStore from 'stores/CommentsStore.js'

const CommentRow = observer(({store}) => {
  return (
    <View
      style = {{
        flexDirection: 'row',
        paddingTop: h(16)
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
          source={store.user.profilePicture.getSource(80)}
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
              fontFamily: FONTS.MEDIUM,
              fontSize: h(26),
              color: '#393939'
            }}>
            {store.user.name}
          </Text>
          <Text
            style = {{
              fontSize: h(24),
              color: '#868686',
              fontFamily: FONTS.ROMAN
            }}
          >
            {store.text}
          </Text>
        </View>

        <View
          style = {{
            width: h(108),
            paddingTop: h(37),
            paddingRight: h(15)
          }}
        >
          <Text
            style = {{
              fontFamily: FONTS.ROMAN,
              color: '#D8D8D8',
              fontSize: h(24),
              flex: 1,
              textAlign: 'right'
            }}

          >
            {store.timeDifference}
          </Text>
        </View>

      </View>


    </View>

  );
});


const InputBar = observer(({inputStore, onAction}) => {
  return (
    <View
      style = {{
        height: h(90),
        backgroundColor: '#E6E6E6',
        flexDirection: 'row'
      }}>
      <View
        style={{
          flex: 1,
          padding: h(15)
        }}
      >
        <TextInput
          style={{
            flex: 1,
            backgroundColor: 'white',
            paddingLeft: h(20),
            fontSize: h(28),
            borderRadius: h(9)
          }}
          value={inputStore.value}
          onChangeText={v => inputStore.value = v}
          placeholder='Add comment...'
        />
      </View>
      <View
        style={{
          width: h(160),
          padding: h(16),
          paddingLeft: 0,
        }}
      >
        <TouchableOpacity
          onPress={() => inputStore.isEmpty ? null : onAction()}
          style={{
            flex: 1,
            backgroundColor: inputStore.isEmpty ? '#8D8D8D' : '#3E3E3E',
            borderRadius: h(9),
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text
            style={{
              color: inputStore.isEmpty ? '#E6E6E6' : 'white',
            }}
          >
           Send
          </Text>
        </TouchableOpacity>

      </View>

    </View>

  );
});

const CommentsContent = observer(({store}) => {
  return (
    <View style={{flex: 1}}>
      <ScrollView
        ref={el => {store.scrollView = el}}
        onContentSizeChange={(w, h) => store.contentHeight = h}
        onLayout={ev => store.scrollViewHeight = ev.nativeEvent.layout.height}
      >
        {store.comments.map(e => <CommentRow key={e.key} store={e} />)}
      </ScrollView>
    </View>
  );
});

const CommentInput = observer(({store}) => {
  return (
    <View>
      <InputBar
        inputStore={store.inputStore}
        onAction={() => store.send()}
      />
      <KeyboardSpacer />
    </View>
  );
});

import LoadingPage from 'components/LoadingPage'


@connect(app)
@observer
export default class Comments extends PureComponent {

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };


  render() {

    window.nav2 = this.context.navigators;

    if (CommentsStore.isEmpty) {
      return null;
    }

    let store = CommentsStore.currentStore;

    let Content = LoadingPage(
      CommentsContent,
      store
    );


    return (<NavigationSetting
      style={{
        flex: 1,
      }}
      onWillFocus={() => {
        StatusBar.setBarStyle('light-content');
      }}
    >
       <View style={{flex: 1}}>
        <BlackHeader
          onLeft={() => CommentsStore.currentStore.myBack()}
          title='Comments'/>
        <Content />
        <CommentInput store={store}/>
      </View>
    </NavigationSetting>);
  }
};
