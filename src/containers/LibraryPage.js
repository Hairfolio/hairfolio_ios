import React, { Component } from 'react'
import { ScrollView, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from 'react-native'

import {observer} from 'mobx-react/native'
import autobind from 'autobind-decorator'
import SlimHeader from '../components/SlimHeader.js'

const LibraryPage = observer(() => {
  return (
    <View style={{marginTop: 20}}>
      <View style={{backgroundColor: 'yellow', height: 90}} />
      <Text> Hello world </Text>
    </View>

  );
});

export default LibraryPage;
