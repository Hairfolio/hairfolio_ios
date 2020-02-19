import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { COLORS, h, windowWidth } from '../helpers';
import BlackHeader from '../components/BlackHeader';
import { FONTS } from '../style';

import * as Animatable from 'react-native-animatable';
const { height } = Dimensions.get("window");

const expandedCard = 500;
const collapsedCard = 300;

export default class ClientDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [
        {
          id: 0,
          name: "Formula Notes",
          color: COLORS.WHITE,
          // color: 'red',
          expand: false,
          detailNotes: [
            {
              id: 1,
              text: 'testing 121`212'
            },
            {
              id: 2,
              text: ''
            },
            {
              id: 3,
              text: ''
            }
          ]
        },
        {
          id: 1,
          name: "Notes",
          color: 'rgb(223,224,225)',
          // color:'green',
          expand: false,
          detailNotes: [
            {
              id: 1,
              text: 'Testing Notes'
            },
            {
              id: 2,
              text: ''
            }
          ]
        },
      ]
    };
  }

  // componentWillMount() {
  //   this.expand_collapse_Function(this.state.cards[1], 1)
  // }

  expand_collapse_Function = (card, i) => {
    console.log("CARD ==>" + JSON.stringify(card))
    console.log("POSITION ==>" + i)
    let temp = this.state.cards
    if (i == 1) {
      if (card.expand == true) {
        temp[0].expand = false
        temp[1].expand = false
        this.setState({ cards: temp })
      }
      else {
        temp[0].expand = true
        temp[1].expand = true
        this.setState({ cards: temp })
      }
    }
    else if (i == 0) {
      if (card.expand == true) {
        if (temp[1].expand == true) {
          temp[1].expand = false
        }
        else {
          temp[0].expand = false
          temp[1].expand = false
        }
        this.setState({ cards: temp })
      }
      else {
        temp[0].expand = true
        temp[1].expand = false
        this.setState({ cards: temp })
      }
    }
  }

  renderRows(card, i) {
    return (
      <View style={{}}>
        {/* <ScrollView> */}
        {card.detailNotes.map((item, index) => {
          return (
            <View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ width: '10%', alignSelf: 'center', textAlign: 'center' }}>{item.id + '.'}</Text>
                <TextInput
                  style={{
                    width: '90%', paddingHorizontal: 10, paddingVertical: 10, justifyContent: 'center',
                    textAlignVertical: 'center',
                    fontSize: 14, fontFamily: FONTS.SF_REGULAR, color: COLORS.GRAY5
                  }}
                  multiline={true}
                  onChangeText={text => {
                    item.text = text;
                    let temp = this.state.cards[i].detailNotes;
                    temp[index] = item;
                    this.state.cards[i].detailNotes = temp;
                    this.setState({
                      cards: this.state.cards
                    })
                    this.expand_collapse_Function(card, i)
                  }}
                  value={item.text}
                />
                {/* <TextInput
                   style={{backgroundColor:'blue'}} value={item.text}></TextInput> */}
              </View>
              <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: COLORS.BORDER_BOTTOM }}></View>
            </View>
          )
        })}
        {/* </ScrollView> */}
      </View>
    )
  }

  renderBottomOptions(imageUrl, title, isShowingRightBorder) {
    return (
      <View style={{width:windowWidth, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.DARK, padding: 10, borderRightWidth: (isShowingRightBorder) ? 1 : 0, borderRightColor: COLORS.WHITE, paddingBottom: 40, paddingTop: 10 }}>
        <Image source={imageUrl} style={{ height: 15, width: 15, resizeMode: 'contain' }} />
        <Text style={{ color: COLORS.WHITE, fontFamily: FONTS.HEAVY, fontSize: 13, marginTop: 4 }}>{title}</Text>
      </View>
    )
  }

  renderClientDetails(imageUrl, title) {
    return (
      <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10 }}>
        <Image source={imageUrl} style={{ marginTop: 4 }} />
        <Text style={{ color: COLORS.GRAY5, paddingLeft: 10, fontFamily: FONTS.MEDIUM, fontSize: 14 }}>{title}</Text>
      </View>
    )
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor:'blue' }}>
        <BlackHeader
          onLeft={() => this.props.navigator.pop({ animated: true })}
          title='Sarah Smith'
        />

        <View style={{ flex:1}}>
          <View style={{backgroundColor:'green'}}>
          <View style={{backgroundColor:'yellow', flex:1/3}}>
            <View style={{ flexDirection: 'row', padding: 20, marginTop: 5 }}>
              <Image
                style={{ height: h(120), width: h(120), borderRadius: h(60), resizeMode: "contain" }}
                source={require('img/profile_placeholder.png')}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONTS.BLACK, color: COLORS.DARK, fontSize: 18, paddingLeft: 20 }}>Sarah Smith</Text>
                {
                  this.renderClientDetails(require('img/mail.png'), 'sarahsmith@gmail.com')
                }
                {
                  this.renderClientDetails(require('img/location.png'), '2612 Levy Court, Webster FL, Florida 33597')
                }
                {
                  this.renderClientDetails(require('img/phone.png'), '978-723-5104')
                }
              </View>
            </View>

            <View style={{ flexDirection: 'row', backgroundColor: 'pink', position:'absolute', bottom:0 }}>
              {
                this.renderBottomOptions(require('img/photo.png'), 'Take Photo', true)
              }
              {
                this.renderBottomOptions(require('img/cameraroll.png'), 'Camera Roll', true)
              }
              {
                this.renderBottomOptions(require('img/addproduct.png'), 'Add Product', false)
              }
            </View>
            </View>

            <View style={{ position: 'absolute', backgroundColor:'transparent', flex:1}}>
              {this.state.cards.map((card, i) => {
                return (
                  <View>
                    <Animatable.View duration={500}
                      style={[styles.card,
                      {
                        borderTopLeftRadius:15, borderTopRightRadius:15,
                        backgroundColor: card.color,
                        marginTop: (card.expand == false) ?
                          (i == 0) ? height / 2.65 : -(height / 3)
                          :
                          (i == 0) ? height / 150 : -400,
                          
                        // marginTop: (card.expand == false) ?
                        // (i == 0) ? height / 3.25 : -150
                        //   :
                        //   (i == 0) ? height / 150 : -250,
                        height: (card.expand == false) ? collapsedCard : expandedCard
                      }]}
                    >
                      <View>
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} onPress={() => {
                          this.expand_collapse_Function(card, i)
                        }}>
                          <Text style={[styles.textView, { textAlign: 'center' }]}>{card.name}</Text>
                          <Image style={{ width: 10, height: 10, position: 'absolute', right: 10, margin: 10 }} source={require('img/edit.png')}></Image>
                        </TouchableOpacity>
                        {this.renderRows(card, i)}
                      </View>
                    </Animatable.View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
        <View style={
          {
            backgroundColor: COLORS.TIMELINE_COLOR,
            alignItems: 'center',
            width: '100%',
            position: 'absolute',
            bottom: 0,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            paddingTop: 10,
            // paddingBottom: 15,
          }}
        >
          <TouchableOpacity style={{ width: '100%' }}
            onPress={() => { alert('TimeLine Clicked') }}>

            <Text style={[styles.textView, { color: COLORS.WHITE }]}>Timeline</Text>

          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    margin: 20,
  },
  contain: {
    height: height,
    width: '100%',
    backgroundColor: 'white'
  },
  heading: {
    alignSelf: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    paddingTop: 40,
    // backgroundColor:'red'
  },
  textView: {
    // marginVertical: 15,
    paddingVertical: 15,
    fontSize: 14,
    fontFamily: FONTS.MEDIUM,
    alignSelf: 'center'
  },
  card: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: 'center',
    height: collapsedCard
  },
  titleStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 300,
  }
});