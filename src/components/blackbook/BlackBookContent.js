import {
  _, // lodash
  v4,
  observable,
  computed,
  moment,
  action,
  observer, // mobx
  h,
  FONTS,
  autobind,
  React, // react
  Component,
  windowWidth,
  windowHeight,
  // react-native components
  AlertIOS,
  Modal,
  ScrollView,
  ActivityIndicator,
  PickerIOS, Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'hairfolio/src/helpers.js';

import BlackBookStore from 'stores/BlackBookStore.js'

import ContactDetailsStore from 'stores/ContactDetailsStore.js'

import * as routes from 'hairfolio/src/routes.js'

import AlphabetListView from 'react-native-alphabetlistview'

const Header = observer(({title}) => {
  let textStyle = {
    color: '#404040',
    fontFamily: FONTS.HEAVY,
    fontSize: h(34),
  };

  let viewStyle = {
    backgroundColor: '#F2F2F2',
    paddingLeft: h(32),
    alignItems: 'center',
    flexDirection: 'row',
    height: h(56)
  };

  return (
    <View style={viewStyle}>
      <Text style={textStyle}>{title}</Text>
    </View>
  );
});

const AlphabetItem = observer(({title}) => {
  return (

    <Text
      style={{
        color: '#3695FA',
        fontFamily: FONTS.MEDIUM,
        fontSize: h(24)
      }}
    >
      {title}
    </Text>
  );
});

const Cell = observer(({item, showBorder}) => {

  let borderStyle = {};

  if (!item.isLast || showBorder) {
    borderStyle = {
      borderBottomWidth: h(1),
      borderBottomColor: '#AAAAAA',
      borderStyle: 'solid'
    };
  }

  return (
    <TouchableHighlight
      underlayColor='#ccc'
      onPress={
        () => {
          ContactDetailsStore.sample();
          ContactDetailsStore.myBack = () => {
            window.navigators[0].jumpTo(routes.blackBook);
          }
          window.navigators[0].jumpTo(routes.contactDetails);
        }
      }
      style={{
        paddingLeft: h(31),
      }}
    >
      <View
        style = {{
          flexDirection: 'row',
          alignItems: 'center',
          height: h(132),
          ...borderStyle
        }}
      >
        <Image
          style={{height: h(84), width: h(84), borderRadius: h(42)}}
          source={item.picture ? item.picture.getSource(84) : null}
        />
        <Text
          style = {{
            marginLeft: h(25),
            fontSize: h(34),
            fontFamily: FONTS.BOOK,
            color: '#404040',
          }}
          numberOfLines={1}
        >
          {item.name}
        </Text>
      </View>
    </TouchableHighlight>
  );
});

const ContactList = observer(({store}) => {

  if (store.mode == 'search') {

    if (store.filteredContacts.length == 0) {
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
            No Results
          </Text>
        </View>
      );
    }
    return (
      <View style={{flex: 1}}>
        <ScrollView>
          {
            store.filteredContacts.map(e=>
              <Cell showBorder={true} key={e.key} item={e} />
            )
          }
        </ScrollView>
      </View>
    );

  }

  if (!store.hasData) {
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
          No Contacts
        </Text>
      </View>
    )
  }

  let data = store.data;

  console.log('alpha data', data);

  let children = [];

  for (let key in data) {
    let child  = <Header key={'header-' + key} title={key} />;
    children.push(child);

    for (let item of data[key]) {
      children.push(
        <Cell
          item={item}
          key={item.key}
        />
      );
    }
  }

  /*
    <AlphabetListView
      ref={e => store.alphabetView = e}
      useDynamicHeights={true}
      data={data}
      cell={Cell}
      cellHeight={h(132)}
      sectionListItem={AlphabetItem}
      sectionHeader={Header}
      sectionHeaderHeight={h(56)}
      sectionListStyle={{
        backgroundColor: 'white'
      }}
    />
    */


  return (
    <ScrollView>
      {children}
    </ScrollView>
  );

});

const SearchRow = observer(({store}) => {

  if (store.mode == 'search') {
    return (
      <View
        style = {{
          height: h(86),
          backgroundColor: '#C9C9CE',
          padding: h(15),
          flexDirection: 'row',
        }}
      >
        <View
          style = {{
            backgroundColor: 'white',
            flex: 1,
            justifyContent: 'center',
            borderRadius: h(14),
          }}
        >
          <View
            style = {{
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: h(15)
            }}
          >
            <Image
              style={{height: h(26), width: h(26)}}
              source={require('img/search_icon.png')}
            />
            <TextInput
              ref={input => store.input = input}
              value={store.inputText}
              onChangeText={t => store.inputText = t}
              style = {{
                fontSize: h(30),
                fontFamily: FONTS.BOOK,
                marginLeft: h(16),
                flex: 1,
                paddingRight: h(15),
                color: '#040404'
              }}
              placeholder='Search'
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={
            () => store.cancelSearchMode()
          }
          style = {{
            backgroundColor: '#3E3E3E',
            borderRadius: h(10),
            marginLeft: h(15),
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: h(10)
          }}
        >
          <Text
            style = {{
              color: 'white',
              fontSize: h(30),
              fontFamily: FONTS.ROMAN,
            }}
          >
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback
      onPress={
        () => store.startSearchMode()
      }
    >
      <View
        style = {{
          height: h(86),
          backgroundColor: '#C9C9CE',
          padding: h(15)
        }}
      >
        <View
          style = {{
            backgroundColor: 'white',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: h(14)
          }}
        >
          <View
            style = {{
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Image
              style={{height: h(26), width: h(26)}}
              source={require('img/search_icon.png')}
            />
            <Text
              style = {{
                fontSize: h(30),
                fontFamily: FONTS.BOOK,
                color: '#8E8E93',
                marginLeft: h(16)
              }}
            >
              Search
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
});

const BlackBookContent = observer(({store}) => {
  return (
    <View style={{flex: 1}}>
      <SearchRow store={store} />
      <ContactList store={store} />
    </View>
  );
});

export default BlackBookContent;
