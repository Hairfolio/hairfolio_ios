import React, { Component } from 'react'
import {Picker, Dimensions, ScrollView, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from 'react-native'
import {observer} from 'mobx-react'


const MyPicker = observer(({onValueChange, title, value, data, isShown, onConfirm, onCancel}) => {

  if (!isShown) {
    return <View />;
  }

  return (
    <View>
      <View style={{backgroundColor: '#E8E8E8', flexDirection: 'row', height: 30, alignItems: 'center', width: Dimensions.get('window').width, flex: 1, paddingHorizontal: 10}}>
        <Text onPress={onCancel} style={{flex: 1, color: '#05A5D1'}} >Cancel </Text>
        <Text style={{flex: 1, textAlign: 'center'}}>{title}</Text>
        <Text onPress={onConfirm} style={{flex: 1, textAlign: 'right', color: '#05A5D1'}} >Confirm</Text>
      </View>
      <Picker
        selectedValue={value}
        style={{backgroundColor: 'white'}}
        onValueChange={onValueChange}>

        {data.map(data =>
            <Picker.Item key={data} label={data} value={data} />
        )}
      </Picker>
    </View>
  );
});

export default MyPicker;
