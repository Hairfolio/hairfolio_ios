import React, { Component } from 'react';
import { Text, View } from 'react-native';
import SlimHeader from '../components/SlimHeader';

export default class LibraryPage extends Component {
  render() {
    return (
      <View style={{ marginTop: 20 }}>
        <SlimHeader
          title='Library'
        />
        <View style={{ backgroundColor: 'yellow', height: 90 }} />
        <Text> Hello world </Text>
      </View>
    );
  }
}
