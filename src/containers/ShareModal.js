import React, { Component } from 'react';
import { Modal, Text, TouchableOpacity, View, Image, TouchableWithoutFeedback, TextInput, ListView, StyleSheet, ScrollView, Keyboard } from 'react-native';
import { windowHeight, windowWidth, h, COLORS, FONTS } from '../helpers';
import { SCALE } from '../style';
import { observer } from 'mobx-react/native';
import { KeyboardAwareScrollView } from '../../node_modules/react-native-keyboard-aware-scroll-view';

export default class ShareModal extends Component {
  constructor(props) {
    super(props);
    this.inputs = {};
    this.state = {
      isShareModalVisible: true,
      isTitleModalVisible: false
    };
  }

  setModalVisible(stateName, visible) {
    if (stateName == "isShareModalVisible") {
      this.setState({ isShareModalVisible: visible });
    }
    if (stateName == "isTitleModalVisible") {
      this.setState({ isTitleModalVisible: visible });
    }
  }

  renderShareModal() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        style={{ flexDirection: "column", height: windowHeight, position:'absolute', backgroundColor: COLORS.DROPSHADOW, zIndex:999999 }}
        visible={this.state.isShareModalVisible}
        onRequestClose={() => { this.setModalVisible('isShareModalVisible', false) }}>

        {this.renderTextModal()}

        <TouchableOpacity
          style={{ zIndex:999999, flex: 1,height: windowHeight, justifyContent: 'flex-end', backgroundColor: COLORS.DROPSHADOW, position:'absolute' }}
          activeOpacity={1}
        // onPressOut={() => { }}
        >
          <View style={{ alignSelf: 'flex-end', borderTopLeftRadius: 10, borderTopRightRadius: 10, height: (windowHeight > 800) ? (windowHeight / 2) : (windowHeight / 1.75), width: windowWidth, backgroundColor: COLORS.WHITE }}>
            <Image source={require('img/share_client.png')} style={{ alignSelf: 'center', width: 40, height: 40, resizeMode: 'contain', position: 'absolute', top: -20 }} />
            <TouchableOpacity
              style={{ padding: 15, alignSelf: 'flex-end' }}
              onPress={() => { this.setModalVisible('isShareModalVisible', false) }}
            >
              <Image source={require('img/close.png')} style={{}} />
            </TouchableOpacity>

            {this.ShareRow(
              require('img/emailclient.png'),
              'Email Client',
              () => {
                this.setModalVisible('isTitleModalVisible', true)
              }
            )}

            {this.ShareRow(
              require('img/textclient.png'),
              'Text Client',
              () => {
                this.setModalVisible('isTitleModalVisible', true)
              }
            )}

            {this.ShareRow(
              require('img/hyperlink.png'),
              'Hyperlink',
              () => {
                alert('Hyperlink')
              })}
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }

  renderTextModal() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        style={{ flexDirection: "column", height: windowHeight, position:'absolute', zIndex:999999999 }}
        visible={this.state.isTitleModalVisible}
        onRequestClose={() => { this.setModalVisible('isTitleModalVisible', false) }}>

        <View style={{  zIndex:999999999, flexDirection: "column", height: windowHeight, width: windowWidth, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.DROPSHADOW, position:'absolute' }}>

          <KeyboardAwareScrollView
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={"always"}
            keyboardDismissMode={'none'}
            overScrollMode={"never"}
            >

            <View style={{ flexDirection: "column", height: windowHeight, width: windowWidth, backgroundColor: COLORS.DROPSHADOW, alignItems: "center", justifyContent: "center" }}>

              <View style={{ paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, width: windowWidth - 60, backgroundColor: COLORS.WHITE }}>
                <TouchableOpacity
                  style={{ paddingVertical: 5, paddingHorizontal: 5, alignSelf: 'flex-end' }}
                  onPress={() => { 
                    Keyboard.dismiss();
                    this.setModalVisible('isTitleModalVisible', false) 
                  }}
                >
                  <Image source={require('img/close.png')} style={{}} />
                </TouchableOpacity>
                <Text style={{ marginTop: -15, marginRight: 70, fontFamily: FONTS.HEAVY, color: COLORS.GREEN, fontSize: 14 }}>Add Title</Text>

                {/* </View> */}
                <TextInput
                  placeholder='Title Name'
                  multiline={false}
                  placeholderTextColor={COLORS.PLACEHOLDER_SEARCH_FIELD}
                  returnKeyType={"next"}
                  ref={input => {
                      this.inputs["title"] = input;
                  }}
                  maxLength={100}
                  onSubmitEditing={() => {
                    this.inputs["description"].focus();
                  }}             
                  style={{
                    height: 30,
                    color: COLORS.DARK,
                    fontSize: h(30),
                    borderBottomColor: COLORS.BORDER_BOTTOM,
                    borderBottomWidth: 1
                  }}
                />

                <View style={{ height: 1, backgroundColor: COLORS.BORDER_BOTTOM }}></View>

                <Text style={{ marginTop: 18, fontFamily: FONTS.HEAVY, color: COLORS.GREEN, fontSize: 14 }}>Add Description</Text>

                <TextInput
                  multiline={true}
                  placeholder='Description'
                  autoCorrect={false}
                  maxLength={500}
                  placeholderTextColor={COLORS.PLACEHOLDER_SEARCH_FIELD}
                  numberOfLines={7}
                  ref={input => {
                    this.inputs["description"] = input;
                  }}
                  style={{
                    minHeight: windowHeight / 10,
                    maxHeight: windowHeight / 13,
                    color: COLORS.DARK,
                    // maxHeight: windowHeight/3,
                    // padding:h(30),
                    // minHeight: 80,
                    // flex: 1,
                    // paddingHorizontal: 15,
                    fontSize: h(30),
                    // borderBottomColor: COLORS.BORDER_BOTTOM,
                    // borderBottomWidth: 1
                  }}
                />

                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss();
                    this.setModalVisible('isTitleModalVisible', false)
                  }}
                  style={{
                    backgroundColor: COLORS.DARK,
                    width: windowWidth - 220,
                    alignSelf: 'center',
                    paddingVertical: 10,
                    marginTop: 30,
                    marginBottom: 15,
                    borderRadius: 3,
                    alignItems: 'center'
                  }}>
                  <Text
                    style={{
                      color: COLORS.WHITE,
                      fontFamily: FONTS.MEDIUM,
                      fontSize: 14
                    }}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>


      </Modal>
    )
  }

  ShareRow = (path, text, onPress) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          width: windowWidth,
          backgroundColor: COLORS.WHITE,
          alignItems: 'center',
          padding: 15,
          marginVertical: 10,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.3,
          shadowRadius: 2,
          elevation: 1
        }}
        onPress={onPress}>
        <Image source={path} />
        <Text style={{ paddingLeft: 10, color: COLORS.MODAL_TITLE, fontFamily: FONTS.MEDIUM }}> {text} </Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={{ marginTop: 22, flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
        {this.renderShareModal()}
        <TouchableOpacity
          style={{ alignSelf: 'center', }}
          onPress={() => {
            this.setModalVisible('isShareModalVisible', true);
          }}>
          <Text>Show Modal</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
});