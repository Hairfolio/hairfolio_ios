import React from 'react';
import PureComponent from '../components/PureComponent';
import {View, ListView, Text} from 'react-native';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import UserPostStore from '../mobx/stores/UserPostStore';

import GridPost from '../components/favourites/GridPost';

import {
  _, // lodash
  v4,
  observable,
  computed,
  moment,
  action,
  observer, // mobx
  h,
  autobind,
  Component,
  windowWidth,
  windowHeight,
  // react-native components
  AlertIOS,
  Modal,
  ActivityIndicator,
  ScrollView,
  PickerIOS, Picker, StatusBar, Platform, TextInput,  Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'Hairfolio/src/helpers';

import ScrollViewProxy from '../components/ScrollViewProxy';




const MyFooter = observer(({store}) => {

  if (store.nextPage != null) {
    return (
      <View style={{flex: 1, paddingVertical: 20, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size='large' />
      </View>
    )
  } else {
    return <View />;
  }
});


@autobind
@observer
export default class UserPosts extends PureComponent {
  static propTypes = {
    onLayout: React.PropTypes.func.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };



  componentDidMount() {
    this.layout(this.nb);
  }


  layout(nb) {
    this.props.onLayout(
      {
        nativeEvent: {
          layout: {
            height: (nb + 1) * (windowWidth / 2)
          },
        },
      },
      true,
    );
  }

  render() {
    let store = UserPostStore;

    let content;

    if (store.isLoading) {
      content = (
        <View style={{marginTop: 20}}>
          <ActivityIndicator size='large' />
        </View>
      );
    }

    if (store.elements.length == 0) {
      content = (
        <View style={{flex: 1}}>
          <Text
            style= {{
              paddingTop: h(38),
              fontSize: h(34),
              textAlign: 'center',
              fontFamily: FONTS.BOOK_OBLIQUE
            }}
          >
            The user has no posts yet
          </Text>
        </View>
      );
    }

    content = (
      <ListView
        enableEmptySections
        dataSource={store.dataSource}
        renderRow={(el, i) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}
            >
              <GridPost key={el[0].key} post={el[0]} />
              {
                el[1] != null ?  <GridPost key={el[1].key} post={el[1]} /> :
                  <View
                    style = {{
                      width: windowWidth / 2,
                      height: windowWidth / 2,
                      backgroundColor: 'white'
                    }}
                  />
              }
            </View>
          )
        }}
        renderScrollComponent={(props) => <ScrollViewProxy
          {...props}
          onChildrenLength={(nb) => {
            this.nb = nb;
            this.layout(nb);
          }}
        />}
        renderFooter={
          () => <MyFooter store={store} />
        }
        onEndReached={() => {
          store.loadNextPage();
        }} />
    );

    return (<NavigationSetting
      style={{
        flex: 1,
        backgroundColor: COLORS.WHITE,
      }}
      onWillFocus={() => {
        let userId = this.props.profile.id;
        if (window.lastUserId != userId) {
          window.lastUserId = userId;
          UserPostStore.load(userId);
        }
      }}
    >
      <View
        onLayout={
          () => {

          }
        }
      >
        {content}
      </View>
    </NavigationSetting>);
  }
};
