import React, { Component } from 'react';
import { LayoutAnimation, ActivityIndicator, Modal, View, TouchableWithoutFeedback, ListView, Text, Image, Dimensions, TouchableOpacity, StyleSheet, ScrollView, TextInput, Keyboard, SafeAreaView, Animated, Easing, PanResponder, StatusBar } from 'react-native';
import { COLORS, h, windowWidth, windowHeight, showLog, showAlert, showCustomAlertWithCallback } from '../helpers';
import BlackHeader from '../components/BlackHeader';
import { FONTS, SCALE } from '../style';
import ContactDetailsStore from '../mobx/stores/ContactDetailsStore';
import CreateLogStore from '../mobx/stores/CreateLogStore';
import { observer } from 'mobx-react';
import ImagePicker from 'react-native-image-crop-picker';
// import ImagePicker from 'react-native-image-picker';

import NavigatorStyles from '../common/NavigatorStyles';



import * as Animatable from 'react-native-animatable';
import { STATUSBAR_HEIGHT, BOTTOMBAR_HEIGHT } from '../constants';

let flag_call_once = false;

const expandedCard = 500;
const collapsedCard = 300;

const ContactsDetailsHeader = observer(({ store, cardsArray, navigator }) => {

  let renderLeft = null;

  if (store.mode != 'view') {
    renderLeft = () =>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        <Text
          style={{
            flex: 1,
            fontFamily: FONTS.Regular,
            fontSize: h(34),
            color: 'white',
            alignSelf: 'center'
          }}
        >
          Cancel
        </Text>
      </View>;
  }


  return (
    <BlackHeader

      onLeft={() => {
        ContactDetailsStore.isScreenPop = false;
        let isApiCall = false;
        console.log('cardsArray==>' + cardsArray)
        cardsArray && cardsArray.map((value, index) => {
          value.detailNotes.map((noteValue, noteIndex) => {
            if (noteValue.text.length > 0) {
              isApiCall = true;
            }
          })
        })

        if (isApiCall) {
          // showCustomAlertWithCallback(`Are you sure you want exit without saving?`, 'Yes', 'Save',
          // onPressOk => {
          //   navigator.pop({ animated: true })
          //   ContactDetailsStore.reset();
          // },
          // onPressCancel => {
          navigator.pop({ animated: true })
          CreateLogStore.cardNotesArray = cardsArray;
          CreateLogStore.createLogApi(ContactDetailsStore.contactID);
          ContactDetailsStore.reset();
          // })
        }
        else {
          navigator.pop({ animated: true })
          ContactDetailsStore.reset();
        }

      }}
      title={<View style={{ width: 150, height: 25, marginTop: 5 }}><Text numberOfLines={1} style={{
        flex: 1,
        fontFamily: FONTS.Regular,
        fontSize: h(38),
        color: COLORS.WHITE,
        alignSelf: 'center'
      }}>{store.title}</Text></View>}
      onRenderLeft={renderLeft}
    />
  );
});

const ProductRow = observer(({ item, index, onPress, store }) => {
  let placeholder_icon = require('img/medium_placeholder_icon.png');
  return (
    <View
      style={styles.listRowContainer}>
      <TouchableOpacity
        style={styles.btnClickView}
        onPress={onPress}>
        <View style={{ paddingHorizontal: 5, paddingTop: 5, alignSelf: 'flex-end' }}>
          {(item.discount_percentage) ?
            <View>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={styles.priceLabel}>{(item.price) ? ("$" + item.price) : "$0.0"}</Text>

                <Text
                  style={styles.finalPriceLabel}>{(item.final_price) ? ("$" + item.final_price) : "$0.0"}</Text>
              </View>
              <Text
                style={styles.finalPriceLabel}>{item.discount_percentage}% off</Text>
            </View>
            :
            <Text
              style={[styles.finalPriceLabel, { color: COLORS.BLACK }]}>{(item.final_price) ? ("$" + item.final_price) : "$0.0"}</Text>
          }
        </View>
        <Image
          defaultSource={placeholder_icon}
          source={(item.product_image) ? { uri: item.product_image } : placeholder_icon}
          style={styles.imageView} />
      </TouchableOpacity>

      <Text
        style={styles.itemNameView}
        numberOfLines={2}>{item.name}</Text>

    </View>
  );
});


@observer
export default class ClientDetails extends Component {
  constructor(props) {
    super(props);
    this.inputs = {};
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      positionStyle: null,
      noteCardHeight: 0,
      requireHeight: 0,
      cards: [
        {
          name: "Formula Notes",
          color: COLORS.TRANSPARENT,
          // color: COLORS.WHITE,
          expand: false,
          detailNotes: [
            {
              id: 1,
              text: ''
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
          name: "Notes",
          color: COLORS.TRANSPARENT,
          // color: COLORS.NOTES_CARD_COLOR,
          expand: false,
          detailNotes: [
            {
              id: 1,
              text: ''
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

      ],
      modalVisible: false,
      searchText: "",
      isSearch: false,
      // productArr: ds.cloneWithRows(products.slice())
      pan: new Animated.ValueXY({ x: 0, y: expandedCard })
    };
    this.yTranslate = new Animated.Value(0);
    this.mainPosition = new Animated.ValueXY();
    this.pan = new Animated.ValueXY({ x: 0, y: expandedCard });
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        this.state.pan.setOffset({
          x: 0,
          y: this.animatedValueY
        });
        this.state.pan.setValue({ x: 0, y: 0 });

       
      },
      onPanResponderMove: (evt, gestureState) => {
        this.state.pan.setValue({
          x: 0,
          y: gestureState.dy
        });

       
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { onlyLarge } = this.props;
        this.state.pan.flattenOffset();
        this.yTranslate.flattenOffset();
        

        Animated.spring(this.state.pan, {
          toValue: { x: 0, y: 0 },
          duration: 300,
          tension: 80,
          friction: 25
        }).start();
      }
    });
    this.mainPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove:
       
        Animated.event([
          null, { dy: this.mainPosition.y }
        ]),
      onPanResponderGrant: (event, gesture) => {
        // this.expand_collapse_Function(this.state.cards[this.state.currentCardIndex],this.state.currentCardIndex)
        console.log('onPanResponderGrant===>' + event + "  " + JSON.stringify(gesture));
       
      },
     
      onPanResponderRelease: (e, gesture) => {        
        console.log('onPanResponderRelease===>' + e + "  " + gesture);
        this.mainPosition.setValue({ x: 0, y: 0 });
      }
    });
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

  }


  async onNavigatorEvent(event) {
    flag_call_once = false;
    console.log('EVENTs IDS=>' + JSON.stringify(event))
    StatusBar.setBarStyle('light-content');
    switch (event.id) {

      case 'willAppear':
        ContactDetailsStore.isScreenPop = true;
        showLog("CreateLogStore.isNoteCreated ==> " + CreateLogStore.isNoteCreated);
        // CreateLogStore.onProductsload("");       
        break;
      case 'didAppear':
        showLog("CreateLogStore.isNoteCreated ==> " + CreateLogStore.isNoteCreated);
        if (CreateLogStore.isNoteCreated) {
          // this.props.navigator.pop({ animated: false })

          let temp = this.state.cards;
          temp.map((value, index) => {
            temp[index].detailNotes.map((i, j) => {
              temp[index].detailNotes[j].text = '';
            })
          })
          showLog("BEFORE RESETING CARDS ==> " + JSON.stringify(temp));
          this.setState({ cards: temp }, () => {
            showLog("RESETING CARDS ==> " + JSON.stringify(this.state.cards));
          })
          CreateLogStore.reset();
        }
        break;
      case 'willDisappear':
        if (ContactDetailsStore.isScreenPop && CreateLogStore.isNoteCreated) {
          this.props.navigator.popToRoot({ animated: true });
        }
        break;
      default:
        break;
    }
  }

  expand_collapse_Function = (card, i) => {
    showLog("CARD ==>" + JSON.stringify(card))
    showLog("POSITION ==>" + i)
    showLog("TEMP ==>" + JSON.stringify(this.state.cards));
    let temp = this.state.cards;
    

    if (i == 1) {
      if (card.expand == true) {
        temp[0].expand = false
        temp[1].expand = false
        Animated.timing(this.yTranslate, {
          toValue: 0,
          duration: 500,
          easing: Easing.linear
        }).start();
        this.setState({ cards: temp, positionStyle: 'relative' })
        showLog("AFTER UPDATE ==>" + JSON.stringify(this.state.cards));
      }
      else {
        temp[0].expand = true
        temp[1].expand = true
        Animated.spring(this.yTranslate, {
          toValue: 1,
          // friction: 7,
          speed: 2
        }).start();
        this.setState({ cards: temp, positionStyle: 'absolute' })
        showLog("AFTER UPDATE ==>" + JSON.stringify(this.state.cards));
      }
    }
    else if (i == 0) {
      if (card.expand == true) {
        if (temp[1].expand == true) {
          temp[1].expand = false
          Animated.spring(this.yTranslate, {
            toValue: 1,
            // friction: 7,
            speed: 2
          }).start();
          this.setState({ positionStyle: 'absolute' });
        }
        else {
          temp[0].expand = false
          temp[1].expand = false
          Animated.timing(this.yTranslate, {
            toValue: 0,
            duration: 500,
            easing: Easing.linear
          }).start();
          this.setState({ positionStyle: 'relative' });
        }
        this.setState({ cards: temp })
        showLog("AFTER UPDATE ==>" + JSON.stringify(this.state.cards));
      }
      else {
        temp[0].expand = true
        temp[1].expand = false
        Animated.spring(this.yTranslate, {
          toValue: 1,
          // friction: 7,
          speed: 2
        }).start();

        this.setState({ cards: temp, positionStyle: 'absolute' })
        showLog("AFTER UPDATE ==>" + JSON.stringify(this.state.cards));
      }
    }
    if (temp[0].expand == false && temp[1].expand == false) {
      Animated.timing(this.yTranslate, {
        toValue: 0,
        duration: 500,
        easing: Easing.linear
      }).start();
      this.setState({ positionStyle: 'relative' })
      Keyboard.dismiss()
    }
  }

  returnSubmit(card, i, selectedIndex) {
    showLog("RETURN SUBMIT CARDS ==> " + JSON.stringify(card) + " == " + i + " == " + selectedIndex)
    
    if (selectedIndex == card.detailNotes.length - 1) {
      let obj = {};
      obj.id = card.detailNotes.length + 1;
      obj.text = '';
      card.detailNotes.push(obj)
      let arrCards = this.state.cards;
      arrCards[i] = card
      this.setState({
        cards: arrCards
      })
      // showLog("RETURN SUBMIT CARDS ==>1 " + JSON.stringify(card) + " == " + i + " == " + selectedIndex)
      let nextRefName = card.name + (selectedIndex + 1);
      // showLog("NEXT REF NAME ==> " + nextRefName)
      try {
        this.inputs[nextRefName].focus();
      } catch (e) {
        showLog("FOCUS ERROR ==> " + JSON.stringify(e))
        setTimeout(() => {
          this.inputs[nextRefName].focus();
        }, 10)
      }
    }

    else {
      let nextRefName = card.name + (selectedIndex + 1);
      // showLog("NEXT REF NAME ==> " + nextRefName)
      try {
        this.inputs[nextRefName].focus();
      } catch (e) {
        showLog("FOCUS ERROR ==> " + JSON.stringify(e))
      }
    }
  }

  renderRows(card, i) {
    return (
      <View style={{}}>
        {card.detailNotes.map((item, index) => {
          return (
            <View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ width: '10%', alignSelf: 'center', textAlign: 'center', fontSize: 20, fontFamily: FONTS.SF_REGULAR, color: COLORS.GRAY5 }}>{item.id + '.'}</Text>
                <TextInput
                  style={{
                    width: '90%',
                    justifyContent: 'center',
                    textAlignVertical: 'center',
                    fontSize: 20, fontFamily: FONTS.SF_REGULAR, color: COLORS.GRAY5,
                  }}
                  autoCorrect={false}
                  minHeight={30}
                  returnKeyType='next'
                  multiline={false}
                  onFocus={() => {
                    showLog("ON FOCUS TEXT ==> " + JSON.stringify(card))
                    if (!card.expand) {
                      this.expand_collapse_Function(card, i)
                    }
                  }}
                  ref={input => {
                    let refName = card.name + index;
                    // showLog("REF NAME ==> " + refName)
                    this.inputs[refName] = input;
                  }}
                  onChangeText={text => {
                    
                    item.text = text;
                    let temp = this.state.cards[i].detailNotes;
                    temp[index] = item;
                    this.state.cards[i].detailNotes = temp;
                    this.setState({
                      cards: this.state.cards
                    })
                  }}
                  value={item.text}
                  onSubmitEditing={() => { (index < 4) && this.returnSubmit(card, i, index) }}
                />
                
              </View>
              <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: COLORS.BORDER_BOTTOM }}></View>
            </View>
          )
        })}
      </View>
    )
  }

  renderBottomOptions(imageUrl, title, isShowingRightBorder) {
    return (
      <TouchableOpacity
        ref={(ref) => {
          this.userCard = ref;
        }}
        onLayout={({ nativeEvent }) => {
          if (this.userCard) {
            this.userCard.measure((x, y, width, height, pageX, pageY) => {
              this.setState({ buttonHeight: height });
              // console.log("userCard==>" + x, y, width, height, pageX, pageY);
            });
          }
        }}
        style={{
          width: windowWidth / 3,
          justifyContent: 'center',
          alignItems: 'center',
          borderRightWidth: (isShowingRightBorder) ? 1 : 0,
          borderRightColor: COLORS.WHITE,
        }} onPress={() => {
          if (title == 'Take Photo') {
            ContactDetailsStore.isScreenPop = false;
            CreateLogStore.cardNotesArray = this.state.cards;
            this.captureImage();
          }
          else if (title == 'Camera Roll') {
            CreateLogStore.cardNotesArray = this.state.cards;
            CreateLogStore.gallery.wasOpened = false;
            ContactDetailsStore.isScreenPop = false;
            this.props.navigator.push({
              screen: 'hairfolio.CreateLogLibrary',
              navigatorStyle: NavigatorStyles.tab,
            });
          }
          else if (title == 'Add Product') {
            CreateLogStore.cardNotesArray = this.state.cards;
            this.setState({ isSearch: false, searchText: "" })
            CreateLogStore.onProductsload("");
            this.setModalVisible(true);
          }

        }}>
        <View style={{ marginVertical: 10 }}>
          <Image source={imageUrl} style={{ height: 15, width: 15, resizeMode: 'contain', alignSelf: "center" }} />
          <Text style={{ color: COLORS.WHITE, fontFamily: FONTS.HEAVY, fontSize: 15, marginTop: 4 }}>{title}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  formatPhone(phone) {
    let value = phone;
    try {
      var cleaned = ('' + phone).replace(/\D/g, '')
      var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
      if (match) {
        value = match[1] + '-' + match[2] + '-' + match[3]
      }
      return value;
    } catch (e) {
      return value;
    }
  }

  renderClientDetails(imageUrl, title, isExtraTopPadding = false, onPress, numberOfLines, isPhone = false) {
    return (
      <TouchableOpacity
        onPress={(onPress) && onPress}
        disabled={(onPress) ? false : true}>
        <View
          style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: (windowHeight < 570) ? 5 : 10 }}>
          <Image source={imageUrl} style={{ marginTop: (isExtraTopPadding == true) ? 9 : 7 }} />
          <Text
            style={{ color: COLORS.GRAY5, paddingLeft: 10, fontFamily: FONTS.MEDIUM, fontSize: 20, flex: 1 }}
            numberOfLines={numberOfLines}
          >{(isPhone) ? this.formatPhone(title.toString()) : title.toString()}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  renderModal() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => { this.setModalVisible(false) }}>
        <TouchableOpacity
          style={{
            flex: 1, justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.7)',
          }}
          activeOpacity={1}
        >
          <View style={{ alignSelf: 'flex-end', borderTopLeftRadius: 10, borderTopRightRadius: 10, height: windowHeight / 1.25, width: windowWidth, backgroundColor: COLORS.WHITE }}>
            <Image source={require('img/product.png')} style={{ alignSelf: 'center', width: 40, height: 40, resizeMode: 'contain', position: 'absolute', top: -20 }} />
            <TouchableOpacity
              style={{ padding: 15, alignSelf: 'flex-end' }}
              onPress={() => { this.setModalVisible(false) }}
            >
              <Image source={require('img/close.png')} style={{}} />
            </TouchableOpacity>

            {/* SearchView */}
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: COLORS.WHITE,
                height: 30,
                marginHorizontal: 15,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.3,
                shadowRadius: 2,
                elevation: 1,
                marginBottom: 5
              }}>
              <TextInput
                autoCorrect={false}
                returnKeyType='search'
                onSubmitEditing={
                  () => {
                    this.setState({ isSearch: true })
                    CreateLogStore.onProductsload(this.state.searchText)
                  }
                }
                onChangeText={text => {
                  this.setState({ searchText: text })
                }}                
                placeholder='Search Product'
                placeholderTextColor={COLORS.DARK}
                style={{
                  flex: 1,
                  paddingHorizontal: 15,
                  fontSize: h(37),
                  fontFamily: FONTS.MEDIUM,
                  color: COLORS.DARK,
                }}
              />
            </View>

            {(CreateLogStore.isLoading) ?
              <View>
                <ActivityIndicator size='small' />
              </View>
              :
              null
            }

            {
              this.renderProductsListView()
            }
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }

  async onClickObject(item, index) {
    showLog('selected product==>' + index + "  " + JSON.stringify(item));
    this.setModalVisible(false);
    CreateLogStore.gallery.addLibraryProduct(item);
    ContactDetailsStore.isScreenPop = false;
    this.props.navigator.push({
      screen: 'hairfolio.CreateLogScreen',
      navigatorStyle: NavigatorStyles.tab,
    });
  }

  renderProductsListView = () => {
    return (
      <ListView
        style={{ flex: 1 }}
        contentContainerStyle={styles.listContainer}
        bounces={false}
        enableEmptySections={true}
        dataSource={(CreateLogStore.dataSourceForFilter)}
        renderRow={(item, index) => {
          return (
            <ProductRow
              onPress={() => {
                this.onClickObject(item, index)
              }}
              item={item}
              indx={index}

            />
          );
        }}
        onEndReached={() => {
          if (this.state.isSearch) {
            CreateLogStore.loadNextPageNew(this.state.searchText, true);
          }
          else {
            CreateLogStore.loadNextPageNew("", true);
          }

        }}
        renderFooter={() => {}
        } />
    )
  }


  render() {
    // console.log("N WINDOW HEIGHT==>"+windowHeight)
    if (windowHeight > 800) {
      return (this.renderBig())
    } else {
      return (this.renderSmall())
    }
  }

  async captureImage() {
    ImagePicker.openCamera({
      width: (300 * 2),
      height: (400 * 2),
      // width: 300,
      // height: 400,
      cropping: true
    }).then(async (image) => {
      console.log("Images ==>Camera " + JSON.stringify(image));
      ContactDetailsStore.isScreenPop = false;
      await CreateLogStore.gallery.addCameraPicture(image);
      this.props.navigator.push({
        screen: 'hairfolio.CreateLogScreen',
        navigatorStyle: NavigatorStyles.tab,
      });
    });


  }

  renderBig() {
    showLog("RENDER BIG ==> " + windowHeight)
    let negativeHeight = -windowHeight / 2.15;
    let modalMoveY = this.yTranslate.interpolate({
      inputRange: [0, 1],
      outputRange: [0, negativeHeight]
    });
    let translateStyle = { transform: [{ translateY: modalMoveY }] };

    let store = ContactDetailsStore;
    if (store.isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size='large' />
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          {this.renderModal()}
          <ContactsDetailsHeader store={store} cardsArray={this.state.cards} navigator={this.props.navigator} />
          <View style={{ flex: 1 }}>

            {/*  CLIENT DETAIL VIEW */}
            <View style={{ flex: 1 / 1.5, backgroundColor: "blue" }}>

              <View style={{ width: windowWidth, flexDirection: 'row', padding: 20,}}
                ref={(ref) => {
                  this.bottomCard = ref;
                }}
                onLayout={({ nativeEvent }) => {
                  if (!flag_call_once) {
                    if (this.bottomCard) {
                      this.bottomCard.measure((x, y, width, height, pageX, pageY) => {
                        let arr_cards = this.state.cards;
                        arr_cards[0].color = COLORS.FORMULA_CARD_COLOR;
                        arr_cards[1].color = COLORS.NOTES_CARD_COLOR;

                        this.setState({ noteCardHeight: (height + 57 + 88 + 60), cards: arr_cards }, () => {
                          setTimeout(() => {
                            flag_call_once = true;
                            this.setState({ cards: arr_cards });
                          }, 1500);
                        });

                        // console.log("main card==> " + x, y, width, height, pageX, pageY,windowHeight,this.state.noteCardHeight);
                      });
                    }
                  }
                }}
              >

                <Image
                  style={{ height: h(120), width: h(120), borderRadius: h(60), resizeMode: (store.clientProfileImage.uri) ? '' : 'contain' }}
                  source={(store.clientProfileImage.uri) ? store.clientProfileImage : require('img/stylist.png')}
                />

                <View style={{ width: windowWidth / 1.35 }}>
                  <TouchableOpacity style={{ height: 25, width: 25, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end' }} onPress={() => {
                    ContactDetailsStore.isScreenPop = false;
                    this.props.navigator.push({
                      screen: 'hairfolio.ContactDetails',
                      navigatorStyle: NavigatorStyles.tab,
                      passProps: {
                        fromScreen: 'ClientDetails',
                      }
                    });
                  }}>
                    <Image style={{ height: 15, width: 15 }} source={require('img/edit.png')} />
                  </TouchableOpacity>
                  <Text
                    style={{ fontFamily: FONTS.BLACK, color: COLORS.DARK, fontSize: 24, paddingLeft: 20 }}
                    numberOfLines={1}>{store.firstName.toString() + ' ' + store.lastName.toString()}</Text>
                  {
                    (store.hasPrimaryEmail || store.hasSecondaryEmail) ?
                      this.renderClientDetails(
                        require('img/mail.png'),
                        (store.hasPrimaryEmail) ? store.emailPrimary.toString() : store.emailSecondary.toString(),
                        true,
                        () => {
                          (store.hasPrimaryEmail) ? store.sendEmail(store.emailPrimary) : store.sendEmail(store.emailSecondary)
                        },
                        1,
                        false
                      )
                      :
                      null
                  }
                  {
                    (store.hasAddress) ?
                      this.renderClientDetails(
                        require('img/location.png'),
                        store.addressStreet1.toString() + ' ' + store.addressCity.toString() + ' ' + store.addressState.toString() + ' ' + store.addressPostCode.toString(),
                        false,
                        null,
                        2,
                        false
                      )
                      :
                      null
                  }

                  {(store.hasMobilePhoneNumber || store.hasHomePhoneNumber || store.hasWorkPhoneNumber) ?
                    this.renderClientDetails(
                      require('img/phone.png'),
                      (store.hasMobilePhoneNumber) ? store.phoneMobile.toString() : ((store.hasHomePhoneNumber) ? store.phoneHome.toString() : store.phoneWork.toString()),
                      false,
                      () => {
                        (store.hasMobilePhoneNumber) ? store.call(store.phoneMobile) : (store.hasHomePhoneNumber) ? store.call(store.phoneHome) : store.call(store.phoneWork)
                      },
                      1,
                      true
                    )
                    :
                    null
                  }

                </View>

              </View>

              {/* BLACK BAR OPTIONS */}
              <View style={{ width: windowWidth, flexDirection: 'row', backgroundColor: COLORS.DARK }} >
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


            <View style={{
              height: (windowHeight - this.state.noteCardHeight),
              width: windowWidth
            }} >

              {this.state.cards.map((card, i) => {
                return (
                  <Animated.View
                    {...this._panResponder.panHandlers}
                    style={[styles.card, translateStyle, {
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.3,
                      shadowRadius: 2,
                      elevation: 1,
                      borderTopLeftRadius: 15, borderTopRightRadius: 15,
                      backgroundColor: card.color,
                      marginTop: (card.expand == false) ?
                        (i == 0) ? 10 : -(windowHeight / 5.5)
                        :
                        (i == 0) ? ((store.addressStreet1 + store.addressCity + store.addressState + store.addressPostCode).length > 20) ? (windowHeight / 8) : ((store.phoneMobile + store.phoneWork + store.phoneHome).length > 5) ? (windowHeight / 3.70) : (windowHeight / 3.35) : -(windowHeight / 2),
                      height: (card.expand == false) ? collapsedCard : expandedCard,
                      ...this.mainPosition.getLayout()
                    }]}>
                    <View>
                      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                        onTouchStart={(e) => {
                          console.log("current card index===>" + i)
                          if (this.state.cards[0].expand == true) {
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
                          }
                          this.expand_collapse_Function(card, i)
                        }}
                      >
                        <Text style={[styles.textView, { textAlign: 'center' }]}>{card.name}</Text>
                        <Image style={{ width: 13, height: 13, position: 'absolute', right: 25, margin: 10 }} source={require('img/edit.png')}></Image>
                      </View>
                      {this.renderRows(card, i)}
                    </View>
                  </Animated.View>
                );
              })}
            </View>
            {/* </View> */}


            {/*  FOOTER TIMELINE  */}
            <View style={styles.footerTimeline}
            >
              <TouchableOpacity style={{ width: '100%' }}
                onPress={() => {
                  CreateLogStore.onTimelineload(ContactDetailsStore.contactID);
                  ContactDetailsStore.isScreenPop = false;
                  this.props.navigator.push({
                    screen: 'hairfolio.Timeline',
                    navigatorStyle: NavigatorStyles.tab,
                    passProps: {
                      fromScreen: 'clientDetails',
                      phoneNumber: (store.hasMobilePhoneNumber) ? store.phoneMobile.toString() : ((store.hasHomePhoneNumber) ? store.phoneHome.toString() : store.phoneWork.toString()),
                    }
                  });
                }}>

                <Text style={[styles.textView, { color: COLORS.WHITE }]}>Timeline</Text>

              </TouchableOpacity>
            </View>
            {/*  FOOTER TIMELINE  */}

          </View>
        </View>

      );
    }
  }

  renderSmall() {
    showLog("RENDER SMALL ==> " + windowHeight)
    let negativeHeight = -windowHeight / 2;
    if (windowHeight > 735) {
      negativeHeight = -windowHeight / 2.5;
    } else if (windowHeight > 665) {
      negativeHeight = -windowHeight / 2;
    } else {
      negativeHeight = -windowHeight / 1.60;
    }
    let modalMoveY = this.yTranslate.interpolate({
      inputRange: [0, 1],
      outputRange: [0, negativeHeight]
    });
    let translateStyle = { transform: [{ translateY: modalMoveY }] };

    let store = ContactDetailsStore;
    if (store.isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size='large' />
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          {this.renderModal()}
          <ContactsDetailsHeader store={store} cardsArray={this.state.cards} navigator={this.props.navigator} />

          <View style={{ flex: 1 }}>

            {/*  CLIENT DETAIL VIEW */}
            {/* <View style={{ flex: 1, alignSelf: 'center' }}> */}
            <View style={{ flex: 1 / 1.5 }}>

              {/* <View style={{ flex: 1, width: windowWidth, flexDirection: 'row', padding: (windowHeight < 570) ? 5 : 20 }}> */}
              {/* <View style={{ width: windowWidth, flexDirection: 'row', padding: (windowHeight < 570) ? 5 : 20 }} */}
              <View style={{ width: windowWidth, flexDirection: 'row', padding: 20 }}
                ref={(ref) => {
                  this.bottomCard = ref;
                }}
                onLayout={({ nativeEvent }) => {
                  if (this.bottomCard) {
                    this.bottomCard.measure((x, y, width, height, pageX, pageY) => {
                      // this.setState({ noteCardHeight: (height + 57) });
                      // this.setState({ noteCardHeight: (height + 57+ h(88) + 20),requireHeight:height });
                      this.setState({ noteCardHeight: (height + 57 + 60 + ((windowHeight > 735) ? h(88) + 5 : (windowHeight > 665) ? h(88) + 5 : h(88) + 5)) });
                      console.log("main card==> " + x, y, width, height, pageX, pageY, windowHeight, this.state.noteCardHeight);
                    });
                  }
                }}>

                <Image
                  style={{ height: h(120), width: h(120), borderRadius: h(60), resizeMode: (store.clientProfileImage.uri) ? '' : 'contain' }}
                  source={(store.clientProfileImage.uri) ? store.clientProfileImage : require('img/stylist.png')}
                />

                {/* <View style={{ flex: 1 }}> */}
                <View style={{ width: windowWidth / 1.35 }}>
                  <TouchableOpacity style={{ height: 25, width: 25, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end' }} onPress={() => {
                    // store.rightHeaderClick(this.props.navigator)
                    ContactDetailsStore.isScreenPop = false;
                    this.props.navigator.push({
                      screen: 'hairfolio.ContactDetails',
                      navigatorStyle: NavigatorStyles.tab,
                      passProps: {
                        fromScreen: 'ClientDetails',
                      }
                    });
                  }}>
                    <Image style={{ height: 15, width: 15 }} source={require('img/edit.png')} />
                  </TouchableOpacity>
                  <Text style={{ fontFamily: FONTS.BLACK, color: COLORS.DARK, fontSize: 24, paddingLeft: 20 }}
                    numberOfLines={1}>{store.firstName + ' ' + store.lastName}</Text>
                  {
                    (store.hasPrimaryEmail || store.hasSecondaryEmail) ?
                      this.renderClientDetails(
                        require('img/mail.png'),
                        (store.hasPrimaryEmail) ? store.emailPrimary.toString() : store.emailSecondary.toString(),
                        true,
                        () => {
                          (store.hasPrimaryEmail) ? store.sendEmail(store.emailPrimary) : store.sendEmail(store.emailSecondary)
                        },
                        1,
                        false
                      )
                      :
                      null
                  }
                  {
                    (store.hasAddress) ?
                      this.renderClientDetails(
                        require('img/location.png'),
                        store.addressStreet1.toString() + ' ' + store.addressCity.toString() + ' ' + store.addressState.toString() + ' ' + store.addressPostCode.toString(),
                        false,
                        null,
                        2,
                        false
                      )
                      :
                      null
                  }

                  {(store.hasMobilePhoneNumber || store.hasHomePhoneNumber || store.hasWorkPhoneNumber) ?
                    this.renderClientDetails(
                      require('img/phone.png'),
                      (store.hasMobilePhoneNumber) ? store.phoneMobile.toString() : ((store.hasHomePhoneNumber) ? store.phoneHome.toString() : store.phoneWork.toString()),
                      false,
                      () => {
                        (store.hasMobilePhoneNumber) ? store.call(store.phoneMobile) : (store.hasHomePhoneNumber) ? store.call(store.phoneHome) : store.call(store.phoneWork)
                      },
                      1,
                      true
                    )
                    :
                    null
                  }
                </View>
              </View>

              {/* BLACK BAR OPTIONS */}
              <View style={{ width: windowWidth, flexDirection: 'row', backgroundColor: COLORS.DARK, }}>
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

            {/* <View style={{ backgroundColor: COLORS.DARK, flex: (windowHeight < 570) ? 1 / 0.9 : 1 / 0.75 }}></View> */}

            {/*  BOTTOM CARDS VIEW */}
            {/* <View style={{ flex: 1, width: windowWidth, position: 'absolute' }}> */}
            {/* <View style={{ position: 'absolute', flex: 1 }}> */}
            {/* <View style={{ height: (windowHeight / 2), position: this.state.positionStyle }} > */}
            <View style={{
              height: (windowHeight - this.state.noteCardHeight),
              // height: windowHeight - BOTTOMBAR_HEIGHT - STATUSBAR_HEIGHT - (h(88) + 20),
              // position: this.state.positionStyle,
              width: windowWidth,
              backgroundColor: (this.state.cards[0].expand == false && this.state.cards[1].expand == false) ? COLORS.DARK : COLORS.WHITE //this.state.cards[1].color//COLORS.DARK
            }}>

              {this.state.cards.map((card, i) => {
                return (
                  <View>
                    {/* <Animatable.View duration={500} */}
                    <Animated.View
                      {...this._panResponder.panHandlers}
                      style={[styles.card, translateStyle,
                      {
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.3,
                        shadowRadius: 2,
                        elevation: 1,
                        borderTopLeftRadius: 15, borderTopRightRadius: 15,
                        backgroundColor: card.color,
                        marginTop:
                          (windowHeight < 570)
                            ?
                            (card.expand == false)
                              ?
                              (i == 0) ? 0 : -(windowHeight / 2.90)
                              :
                              (i == 0) ? ((store.addressStreet1 + store.addressCity + store.addressState + store.addressPostCode).length > 20) ? (windowHeight / 5) : (windowHeight / 2.6) : -(windowHeight / 1.7)
                            :
                            (windowHeight < 668)
                              ?
                              (card.expand == false)
                                ?
                                (i == 0) ? 0 : -(windowHeight / 4)
                                :
                                (i == 0) ? ((store.addressStreet1 + store.addressCity + store.addressState + store.addressPostCode).length > 20) ? (windowHeight / 8.5) : (windowHeight / 3.65) : -(windowHeight / 1.7)
                              :
                              (windowHeight < 737)
                                ?
                                (card.expand == false)
                                  ?
                                  (i == 0) ? 0 : -(windowHeight / 5)
                                  :
                                  (i == 0) ? ((store.addressStreet1 + store.addressCity + store.addressState + store.addressPostCode).length > 20) ? (windowHeight / 12) : (windowHeight / 5) : -(windowHeight / 1.7) // windowHeight / 250 : -(windowHeight / 1.5)
                                :
                                (card.expand == false)
                                  ?
                                  (i == 0) ? -5 : -(windowHeight / 5)
                                  :
                                  (i == 0) ? h(88) + 80 : -(windowHeight / 1.7),
                        // marginTop:(windowHeight < 570) ? 
                        //   // only for iPhone 5s
                        //   (card.expand == false) ?
                        //     (i == 0) ? 0 // windowHeight / 2.75
                        //       : -(windowHeight / 2.65)
                        //     :
                        //     (i == 0) ? h(88)  : -(windowHeight / 1.5)
                        //   :
                        //     (windowHeight < 668) ?
                        //     (card.expand == false) ?
                        //     (i == 0) ?0 : -(windowHeight / 4)
                        //     :
                        //     (i == 0) ? h(88) + 30 : -(windowHeight / 1.7)
                        //   :
                        //     (windowHeight < 737) ?
                        //     (card.expand == false) ?
                        //     (i == 0) ?0 : -(windowHeight / 7)
                        //     :
                        //     (i == 0) ? h(88) + 50 : -(windowHeight / 2)
                        //   :
                        //   (card.expand == false) ?
                        //     (i == 0) ?-5
                        //       // windowHeight / 2.85
                        //       : -(windowHeight / 5)
                        //     :
                        //     (i == 0) ? h(88) + 80 : -(windowHeight / 1.7),
                        // marginTop: (windowHeight < 570) ? 
                        // (card.expand == false) ?
                        //   // only for iPhone 5s
                        //     (i == 0) ? ((store.addressStreet1+store.addressCity+store.addressState+store.addressPostCode).length>20)?19:0: -(windowHeight / 3)
                        //     :
                        //     (i == 0) ? windowHeight / 150 : -(windowHeight / 1.5)
                        //   :                          
                        //   ((windowHeight < 737) ?
                        //   (card.expand == false) ?
                        //       (i == 0) ? (((store.addressStreet1+store.addressCity+store.addressState+store.addressPostCode).length>30)?-5:-8): -(windowHeight / 5)
                        //       :
                        //       (i == 0) ? windowHeight / 150 : -(windowHeight / 1.7)
                        //     :
                        //     (card.expand == false) ?
                        //       (i == 0) ? ((store.addressStreet1+store.addressCity+store.addressState+store.addressPostCode).length>30)?30:10: -(windowHeight / 5)
                        //       :
                        //       (i == 0) ? windowHeight / 150 : -(windowHeight / 1.7)),
                        //   // (card.expand == false) ?
                        //   //   (i == 0) ? windowHeight / 2.85: -(windowHeight / 5)
                        //   //   :
                        //   //   (i == 0) ? windowHeight / 150 : -(windowHeight / 1.7),
                        height: (card.expand == false) ? collapsedCard : expandedCard,
                        ...this.mainPosition.getLayout()

                      }]}
                    >
                      <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                          onTouchStart={(e) => {
                            console.log("current card index===>" + i)
                            if (this.state.cards[0].expand == true) {
                              LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
                            }
                            this.expand_collapse_Function(card, i)
                          }}
                        >
                          <Text style={[styles.textView, { textAlign: 'center' }]}>{card.name}</Text>
                          <Image style={{ width: 13, height: 13, position: 'absolute', right: 25, margin: 10 }} source={require('img/edit.png')}></Image>
                        </View>
                        {this.renderRows(card, i)}
                      </View>
                    </Animated.View>
                    {/* </Animatable.View> */}
                  </View>
                );
              })}
              {/* </View>  */}

            </View>
            {/*  FOOTER TIMELINE  */}
            <View style={
              {
                backgroundColor: COLORS.TIMELINE_COLOR,
                alignItems: 'center',
                width: windowWidth,
                position: 'absolute',
                bottom: 0,
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                paddingTop: 10,
                zIndex: 1
                // paddingBottom: 15,
              }}
            >
              <TouchableOpacity style={{ width: '100%' }}
                onPress={() => {
                  CreateLogStore.onTimelineload(ContactDetailsStore.contactID);
                  ContactDetailsStore.isScreenPop = false;
                  this.props.navigator.push({
                    screen: 'hairfolio.Timeline',
                    navigatorStyle: NavigatorStyles.tab,
                    passProps: {
                      phoneNumber: (store.hasMobilePhoneNumber) ? store.phoneMobile.toString() : ((store.hasHomePhoneNumber) ? store.phoneHome.toString() : store.phoneWork.toString()),
                    }
                  });
                }}>

                <Text style={[styles.textView, { color: COLORS.WHITE }]}>Timeline</Text>

              </TouchableOpacity>
            </View>
            {/*  FOOTER TIMELINE  */}

          </View>
        </View>
      );
    }
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
    height: windowHeight,
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'flex-end'
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
    fontSize: 20,
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
  },


  // modalStyle
  mainContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.WHITE,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  productImageView: {
    flex: 1,
    width: (windowWidth / 2) - 30,
    height: (windowHeight / 2) - 150,
    resizeMode: 'contain',
  },
  imageClickView: {
    position: 'absolute',
    top: 7,
    right: 7,
  },
  priceLabel: {
    color: COLORS.GRAY2,
    fontFamily: FONTS.ROMAN,
    fontSize: SCALE.h(28),
    textDecorationLine: 'line-through'
  },
  finalPriceLabel: {
    color: COLORS.BLACK,
    fontFamily: FONTS.ROMAN,
    fontSize: SCALE.h(28),
    marginLeft: 10
  },
  listContainer: {
    padding: 10,
    // backgroundColor: COLORS.PINK,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  listRowContainer: {
    margin: 5,
    marginTop: 10,
    // width: (windowWidth / 2) - 20,
    // height: (windowHeight / 2) - 150,
    width: (windowWidth / 2) - 20,
    height: (windowHeight / 2) - 100,
  },
  btnClickView: {
    borderRadius: 5,
    // width: (windowWidth / 2) - 20,
    // height: (windowHeight / 2) - 200,
    width: (windowWidth / 2) - 20,
    height: (windowHeight / 2) - 150,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1
    // elevation: 1,
    // shadowOpacity: 0.10,
    // shadowOffset: {
    //   height: 1.2,
    //   width: 1.2
    // }
  },
  imageView: {
    flex: 1,
    // width: (windowWidth / 2) - 30,
    // height: (windowHeight / 2) - 300,
    width: (windowWidth / 2) - 30,
    height: (windowHeight / 2) - 150,
    resizeMode: 'contain',
  },
  itemNameView: {
    marginTop: 7,
    color: COLORS.BLACK,
    fontFamily: FONTS.LIGHT,
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: SCALE.h(34),
  },
  footerTimeline: {
    backgroundColor: COLORS.TIMELINE_COLOR,
    alignItems: 'center',
    width: windowWidth,
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingTop: 10,
    zIndex: 1
  }
});