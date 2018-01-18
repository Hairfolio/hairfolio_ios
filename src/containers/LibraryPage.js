import React, { Component } from 'react'
import { ScrollView, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from 'react-native'

import {observer} from 'mobx-react'
import autobind from 'autobind-decorator'
import SlimHeader from '../components/SlimHeader';

export default class LibraryPage extends Component {
  render() {
    return (
      <View style={{marginTop: 20}}>
        <SlimHeader
          title='Library'
        />
        <View style={{backgroundColor: 'yellow', height: 90}} />
        <Text> Hello world </Text>
      </View>
    );
  }
}
