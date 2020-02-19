import { FONTS, h } from 'Hairfolio/src/style';
import { observer } from 'mobx-react';
import React from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import NavigatorStyles from '../common/NavigatorStyles';
import BlackHeader from '../components/BlackHeader';
import LoadingPage from '../components/LoadingPage';
import PureComponent from '../components/PureComponent';
import CommentsStore from '../mobx/stores/CommentsStore';
import { COLORS, showLog } from '../helpers';

const CommentRow = observer(({ store }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingTop: h(16)
      }}
    >
      <View
        style={{
          width: h(121),
          paddingLeft: h(16)
        }}
      >
        <Image
          style={{ height: h(80), width: h(80), borderRadius: h(40) }}
          defaultSource={require('img/stylist.png')}
          source={(store.user && store.user.profilePicture) ? store.user.profilePicture.getSource(80, 80) : require('img/stylist.png')}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          paddingBottom: h(23),
          borderBottomWidth: h(1),
          borderBottomColor: COLORS.LIGHT4
        }}
      >
        <View
          style={{
            flex: 1
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.MEDIUM,
              fontSize: h(26),
              color: COLORS.DARK
            }}>
            {store.user.name}
          </Text>
          <Text
            style={{
              fontSize: h(24),
              color: COLORS.GRAY2,
              fontFamily: FONTS.ROMAN
            }}
          >
            {store.text}
          </Text>
        </View>
        <View
          style={{
            width: h(108),
            paddingTop: h(37),
            paddingRight: h(15)
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.ROMAN,
              color: COLORS.LIGHT4,
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

const InputBar = observer(({ inputStore, onAction }) => {
  return (
    <View
      style={{
        height: h(90),
        backgroundColor: COLORS.BACKGROUND_SEARCH_FIELD,
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
            backgroundColor: COLORS.WHITE,
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
            backgroundColor: inputStore.isEmpty ? COLORS.DARK5 : COLORS.DARK3,
            borderRadius: h(9),
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text
            style={{
              color: inputStore.isEmpty ? COLORS.BACKGROUND_SEARCH_FIELD : COLORS.WHITE,
            }}
          >
            Send
          </Text>
        </TouchableOpacity>

      </View>

    </View>

  );
});

const CommentsContent = observer(({ store }) => {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        ref={el => { store.scrollView = el }}
        onContentSizeChange={(w, h) => store.contentHeight = h}
        onLayout={ev => store.scrollViewHeight = ev.nativeEvent.layout.height}
      >
        {store.comments.map(e => <CommentRow key={e.key} store={e} />)}
      </ScrollView>
    </View>
  );
});

const CommentInput = observer(({ store }) => {
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


@observer
export default class Comments extends PureComponent {
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent((e) => {
      this.onNavigatorEvent(e);
    });
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'bottomTabSelected':
        showLog("bottomTabSelected ==>");
        // if (this.props.from_feed) {
        //   this.props.navigator.resetTo({
        //     screen: 'hairfolio.Feed',
        //     animationType: 'fade',
        //     navigatorStyle: NavigatorStyles.tab
        //   });
        // } else if (this.props.from_search) {
        //   this.props.navigator.resetTo({
        //     screen: 'hairfolio.Search',
        //     animationType: 'fade',
        //     navigatorStyle: NavigatorStyles.tab
        //   });

        // } else if (this.props.from_profile) {
        //   this.props.navigator.resetTo({
        //     screen: 'hairfolio.Profile',
        //     animationType: 'fade',
        //     navigatorStyle: NavigatorStyles.tab
        //   });

        // } else if (this.props.from_star) {
        //   this.props.navigator.resetTo({
        //     screen: 'hairfolio.Favourites',
        //     animationType: 'fade',
        //     navigatorStyle: NavigatorStyles.tab
        //   });
        // }


        break;
      case 'bottomTabReselected':
        showLog("bottomTabReselected ==>");
        break;
      default:
        break;
    }
  }

  render() {
    if (CommentsStore.isEmpty) {
      return null;
    }

    let store = CommentsStore.currentStore;

    let Content = LoadingPage(
      CommentsContent,
      store,
      { navigator: this.props.navigator },
    );


    return (
      <View style={{ flex: 1 }}>
        <BlackHeader
          onLeft={() => {
            this.props.navigator.pop({ animated: true })
          }}
          title='Comments' />
        <Content />
        <CommentInput store={store} />
      </View>
    );
  }
};
