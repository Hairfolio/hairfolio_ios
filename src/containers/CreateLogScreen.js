import React, { Component } from "react";
import autobind from "autobind-decorator";
import { observer } from "mobx-react";
import {
  AlertIOS,
  Modal,
  ListView,
  ScrollView,
  Image,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  StatusBar,
  Animated,
  Easing,
  PanResponder,
  LayoutAnimation
} from "react-native";
import CreateLogStore from "../mobx/stores/CreateLogStore";
import ContactDetailsStore from '../mobx/stores/ContactDetailsStore';
import WhiteHeader from "../components/WhiteHeader";
import { COLORS, FONTS, SCALE } from "../style";
import { h, moment, windowWidth, windowHeight, showLog, showCustomAlertWithCallback } from "../helpers";
import Swiper from "react-native-swiper";
import * as Animatable from "react-native-animatable";
import NavigatorStyles from "../common/NavigatorStyles";
import { BOTTOMBAR_HEIGHT, STATUSBAR_HEIGHT } from "../constants";
import ImagePicker from 'react-native-image-crop-picker';

const expandedCard = (windowHeight < 570) ? 400 : (windowHeight < 730) ? 500 : (windowHeight < 800) ? 560 : 560;
const collapsedCard = 70;
const placeholder_icon = require("img/medium_placeholder_icon.png");

const Picture = observer(({ picture, swiper, index }) => {
  let selectedBox;
  if (picture.selected) {
    selectedBox = (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: h(134),
          height: h(134),
          borderWidth: h(7),
          borderColor: COLORS.DARK
        }}
      />
    );
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        picture.select();
        if(swiper) {
          const currentIndex = swiper.state.index;
          const offset = index - currentIndex;
          swiper.scrollBy(offset);
        }        
      }}
    >
      <View
        style={{
          height: h(134),
          width: h(134),
          marginLeft: h(30)
        }}
      >
        <Image
          style={{ height: h(134), width: h(134), flex: 1 }}
          defaultSource={placeholder_icon}
          // source={{
          //   uri: picture.product_thumb
          //     ? picture.product_thumb
          //     : picture.path
          //     ? picture.path
          //     : picture.uri
          //     ? picture.uri
          //     : placeholder_icon
          // }}

          source={picture.source}
        />
        {selectedBox}
      </View>
    </TouchableWithoutFeedback>
  );
});

const PictureView = observer(({ gallery, swiper }) => {
  return (
    <ScrollView
      horizontal
      style={{
        height: h(170)
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginRight: h(30)
        }}
      >
        {gallery.map((el, index) => (
          <Picture picture={el} key={el.key} swiper={swiper} index={index}/>
        ))}
      </View>
    </ScrollView>
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
        <View style={{paddingHorizontal:5, paddingTop:5, alignSelf:'flex-end'}}>
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
          // source={(item.product_image) ? { uri: (BASE_URL + item.product_image)} : require('img/medium_placeholder_icon.png')}
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
@autobind
export default class CreateLogScreen extends Component {
  constructor(props) {
    super(props);
    this.inputs = {};
    this.state = {
      currentIndex: 0,
      positionStyle: null,
      noteCardHeight: 0,
      requireHeight: 0,
      bottomOptionsHeight: 0,
      cards: [
        {
          name: "Formula Notes",
          color: COLORS.WHITE,
          expand: false,
          detailNotes: [
            {
              id: 1,
              text: ""
            },
            {
              id: 2,
              text: ""
            },
            {
              id: 3,
              text: ""
            }
          ]
        },
        {
          name: "Notes",
          color: 'rgb(223,224,225)',
          expand: false,
          detailNotes: [
            {
              id: 1,
              text: ""
            },
            {
              id: 2,
              text: ""
            },
            {
              id: 3,
              text: ""
            }
          ]
        }
      ],
      modalVisible: false,
      searchText: "",
      isSearch:false,
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

        // this.yTranslate.setOffset({
        //   x:0,
        //   y: this.animatedValueY
        // });
        // this.yTranslate.setValue({ x: 0, y: 0});
      },
      onPanResponderMove: (evt, gestureState) => {
        this.state.pan.setValue({
          x: 0,
          y: gestureState.dy
        });

        // this.yTranslate.setValue({
        //   x: 0,
        //   y: gestureState.dy
        // });
      //   Animated.event([
      //     // null, { dx: this.mainPosition.x, dy: this.mainPosition.y }
      //     null, { dy: this.mainPosition.y }
      // ]),
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { onlyLarge } = this.props;
        this.state.pan.flattenOffset();
        this.yTranslate.flattenOffset();
        // if (gestureState.dy == 0) {
        //   this._animateTo(this.state.status);
        // } else if (gestureState.dy < -100 || gestureState.vy < -1) {
        //   if (this.state.status == STATUS.SMALL) this._animateTo(STATUS.LARGE);
        //   else {
        //     this._animateTo(STATUS.LARGE);
        //   }
        // } else if (gestureState.dy > 100 || gestureState.vy > 1) {
        //   if (this.state.status == STATUS.LARGE)
        //     // this._animateTo(onlyLarge ? STATUS.CLOSED : STATUS.SMALL);
        //     this._animateTo(STATUS.SMALL);
        //   else this._animateTo(0);
        // } else {
          // this._animateTo(this.state.status);
          // this.mainPosition.setValue({ x: 0, y: 0 });
        // }

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
      //   Animated.spring(this.mainPosition, {
      //   toValue: { x: 0, y: 0 },
      //   friction: 5
      // }).start(),
        Animated.event([
          // null, { dx: this.mainPosition.x, dy: this.mainPosition.y }
          null, { dy: this.mainPosition.y }
      ]),
      onPanResponderGrant: (event, gesture) => {
        // this.expand_collapse_Function(this.state.cards[this.state.currentCardIndex],this.state.currentCardIndex)
        console.log('onPanResponderGrant===>' + event + "  " + JSON.stringify(gesture));
          // this.mainPosition.setOffset({
          //     x: this.mainPosition.x._value,
          //     y: this.mainPosition.y._value
          // });
          // this.mainPosition.setValue({ x: 0, y: 0 });
      },
      // onPanResponderRelease: Animated.event([
      //   // null, { dx: this.mainPosition.x, dy: this.mainPosition.y }
      //   null, { vy: this.mainPosition.y }
      // ]),
      onPanResponderRelease: (e, gesture) => {
        // Animated.event([
        //     // null, { dx: this.mainPosition.x, dy: this.mainPosition.y }
        //     null, { vy: this.mainPosition.y }
        //   ])
        // Animated.spring(this.state.pan, {
        //   toValue: { x: 0, y: 0 },
        //   friction: 5
        // }).start();
        // this.expand_collapse_Function(this.state.cards[this.state.currentCardIndex],this.state.currentCardIndex)

        console.log('onPanResponderRelease===>' + e + "  " + gesture);

          // this.mainPosition.flattenOffset();
          // if (gesture.dy < -150) {
          //     const y = gesture.dy + this.panelY + this.scrollY;
          //     // this.addCard(y)
          // }
          this.mainPosition.setValue({ x: 0, y: 0 });
      }
  });
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    StatusBar.setBarStyle("dark-content", true);
  }

  componentDidMount = () => {
    if(CreateLogStore.cardNotesArray) {
      this.setState({
        cards: CreateLogStore.cardNotesArray
      })
    }
  };

  expand_collapse_Function = (card, i) => {
    showLog("CARD ==>" + JSON.stringify(card));
    showLog("POSITION ==>" + i);
    let temp = this.state.cards;
    if (i == 1) {
      if (card.expand == true) {
        temp[0].expand = false;
        temp[1].expand = false;
        Animated.timing(this.yTranslate, {
          toValue: 0,
          duration: 500,
          easing: Easing.linear
        }).start();
        this.setState({ cards: temp, positionStyle: "relative" });
      } else {
        temp[0].expand = true;
        temp[1].expand = true;
        Animated.spring(this.yTranslate, {
          toValue: 1,
          // friction: 7,
          speed:2
        }).start();
        this.setState({ cards: temp, positionStyle: "absolute" });
      }
    } else if (i == 0) {
      if (card.expand == true) {
        if (temp[1].expand == true) {
          temp[1].expand = false;
          Animated.spring(this.yTranslate, {
            toValue: 1,
              // friction: 7,
              speed:2
          }).start();
          this.setState({ positionStyle: "absolute" });
        } else {
          temp[0].expand = false;
          temp[1].expand = false;
          Animated.timing(this.yTranslate, {
            toValue: 0,
            duration: 500,
            easing: Easing.linear
          }).start();
          this.setState({ positionStyle: "relative" });
        }
        this.setState({ cards: temp });
      } else {
        temp[0].expand = true;
        temp[1].expand = false;
        Animated.spring(this.yTranslate, {
          toValue: 1,
          // friction: 7,
          speed:2
        }).start();
        this.setState({ cards: temp, positionStyle: "absolute" });
      }
    }
    if (temp[0].expand == false && temp[1].expand == false) {
      Animated.timing(this.yTranslate, {
        toValue: 0,
        duration: 500,
        easing: Easing.linear
      }).start();
      this.setState({ positionStyle: "relative" });
      Keyboard.dismiss();
    }
  };

  returnSubmit(card, i, selectedIndex) {
    showLog("RETURN SUBMIT CARDS ==> " + JSON.stringify(card) + " == " + i + " == " + selectedIndex)
    // Keyboard.dismiss();
    // this.inputs[].focus();
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
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    width: "10%",
                    alignSelf: "center",
                    textAlign: "center",
                    fontSize: 20, 
                    fontFamily: FONTS.SF_REGULAR, 
                    color: COLORS.GRAY5
                  }}
                >
                  {item.id + "."}
                </Text>
                <TextInput
                  style={{
                    width: "90%",
                    justifyContent: "center",
                    textAlignVertical: "center",
                    fontSize: 20,
                    fontFamily: FONTS.SF_REGULAR,
                    color: COLORS.GRAY5
                  }}
                  autoCorrect={false}
                  minHeight={30}
                  returnKeyType="next"
                  multiline={false}
                  onFocus={() => {
                    showLog("ON FOCUS TEXT ==> " + JSON.stringify(card));
                    if (!card.expand) {
                      this.expand_collapse_Function(card, i);
                    }
                  }}
                  editable={!CreateLogStore.isInViewMode}
                  ref={input => {
                    let refName = card.name + index;
                    // showLog("REF NAME ==> " + refName);
                    this.inputs[refName] = input;
                  }}
                  onChangeText={text => {
                    item.text = text;
                    let temp = this.state.cards[i].detailNotes;
                    temp[index] = item;
                    this.state.cards[i].detailNotes = temp;
                    this.setState({
                      cards: this.state.cards
                    });
                  }}
                  value={item.text}
                  onSubmitEditing={() => {
                    index < 4 && this.returnSubmit(card, i, index);
                  }}
                />
              </View>
              <View
                style={{
                  height: StyleSheet.hairlineWidth,
                  backgroundColor: COLORS.BORDER_BOTTOM
                }}
              ></View>
            </View>
          );
        })}
      </View>
    );
  }

  getDate = date => {
    if (date) {
      return moment(date).format("MMMM DD, YYYY");
    } else {
      let d = new Date();
      return moment(d).format("MMMM DD, YYYY");
    }
  };

  bottomClicks(title = '') {
    if (title == "Take Photo") {
      this.captureImage();
    } else if (title == "Camera Roll") {
      if(CreateLogStore.noteId != null) {
        CreateLogStore.gallery.wasOpened = false;
      }
      CreateLogStore.reset(false);
      if(this.props.isFromLibrary) {
        this.props.navigator.pop({ animated: true });
      } else {
        this.props.navigator.push({
          screen: "hairfolio.CreateLogLibrary",
          navigatorStyle: NavigatorStyles.tab,
          passProps: {
            isFromLogScreen: true
          }
        });
      }
    } else if (title == "Add Product") {
      // alert('Add Product')
      this.setState({ isSearch: false, searchText: "" });
      CreateLogStore.onProductsload("");
      this.setModalVisible(true);
    }
  }

  renderBottomOptions(imageUrl, title, isShowingRightBorder) {
    return (
      <TouchableOpacity
        ref={ref => {
          this.userCard = ref;
        }}
        onLayout={({ nativeEvent }) => {
          if (this.userCard) {
            this.userCard.measure((x, y, width, height, pageX, pageY) => {
              this.setState({ buttonHeight: height });
            });
          }
        }}
        style={{
          width: windowWidth / 3,
          justifyContent: "center",
          alignItems: "center",
          borderRightWidth: isShowingRightBorder ? 1 : 0,
          borderRightColor: COLORS.WHITE,
          borderBottomWidth: 0,
          // paddingBottom: 5
          backgroundColor: COLORS.DARK
        }}
        onPress={() => {
          if(this.props.isFromEdit && CreateLogStore.isInViewMode) {
            showCustomAlertWithCallback('Are you sure want to edit this log?', 'Yes', 'No',
            () => {
              showLog('Edit Pressed')
              CreateLogStore.isInViewMode = false;
              this.bottomClicks(title);
            },
            () => {
              showLog('No Pressed')
            })
          } else {
            this.bottomClicks(title);
          }
        }}
      >
        <View style={{ marginVertical: 10 }}>
          <Image
            source={imageUrl}
            style={{
              height: 15,
              width: 15,
              resizeMode: "contain",
              alignSelf: "center"
            }}
          />
          <Text
            style={{
              color: COLORS.WHITE,
              fontFamily: FONTS.HEAVY,
              fontSize: 15,
              marginTop: 4
            }}
          >
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    );
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
            backgroundColor:'rgba(0,0,0,0.7)',
            // backgroundColor: 'rgb(0,0,0,0.1)',
          }}
          activeOpacity={1}
        // onPressOut={() => { this.setModalVisible(false) }}
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
                // width: windowWidth, 
                height: 30,
                marginHorizontal: 15,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.3,
                shadowRadius: 2,
                elevation: 1,
                marginBottom:5
              }}>
              <TextInput
                autoCorrect={false}
                returnKeyType='search'
                onSubmitEditing={
                  () => {
                    // SearchDetailsStore.search();
                    // alert(this.state.searchText)
                    this.setState({isSearch:true})
                    CreateLogStore.onProductsload(this.state.searchText)
                  }
                }
                onChangeText={text => {
                  this.setState({searchText:text})
                  // SearchDetailsStore.searchString = text;
                }}
                // ref={el => {
                //   SearchDetailsStore.input = el;
                //   window.myInput = el;
                // } }
                placeholder='Search Product'
                placeholderTextColor={COLORS.DARK}
                style={{
                  flex: 1,
                  paddingHorizontal: 15,
                  fontSize: h(37),
                  fontFamily:FONTS.MEDIUM,
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
    // CreateLogStore.gallery.pictures.push(item);
    CreateLogStore.gallery.addLibraryProduct(item, true);
    // this.props.navigator.push({
    //   screen: 'hairfolio.CreateLogScreen',
    //   navigatorStyle: NavigatorStyles.tab,
    // });
  }

  renderProductsListView = () => {
    return (
      <ListView
        style={{ flex: 1 }}
        contentContainerStyle={styles.listContainer}
        bounces={false}
        enableEmptySections={true}
        dataSource={(CreateLogStore.dataSourceForFilter)}
        // dataSource={(this.state.productArr)}
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
          // if (SearchProductStore.isFrom) {
          // 	//  pStore.loadNextPage();
          // 	ProductTagStore.loadNextPageNew(SearchProductStore.searchString, true);
          // }
          // else {
          // 	ProductTagStore.loadNextPageNew(ProductTagStore.lastSearchedText, true);
          // }

        }}
        renderFooter={() => {

          // if (ProductTagStore.nextPage != null) {

          // 	return (
          // 		<View
          // 			style={{
          // 				flex: 1,
          // 				width: windowWidth,
          // 				paddingVertical: 20,
          // 				alignItems: "center",
          // 				justifyContent: "center",
          // 				left: 0,
          // 				right: 0,
          // 				bottom: -10,
          // 				position: 'absolute'
          // 			}}
          // 		>
          // 			<ActivityIndicator size="large" />
          // 		</View>
          // 	);
          // } else {
          // 	return <View />;
          // }
        }
        } />
    )
  }

  async captureImage() {
    ImagePicker.openCamera({
      width: (300 * 2),
      height: (400 * 2),
      cropping: true
    }).then(async(image) => {
      console.log("Images ==>Camera " + JSON.stringify(image));
      await CreateLogStore.gallery.addCameraPicture(image, true);
      // this.props.navigator.push({
      //   screen: 'hairfolio.CreateLogScreen',
      //   navigatorStyle: NavigatorStyles.tab,
      // });
    });

    
  }

  onSwiperIndexChanges = (index) => {
    try{
      CreateLogStore.gallery.pictures[index].select()
      this.setState({
        currentIndex: index
      });
    } catch(e) {
      showLog("Error in onSwiperIndexChanges ==> " + JSON.stringify(e))
    }
  }

  saveClick = async() => {
    Keyboard.dismiss();
    if(this.props.isFromEdit && CreateLogStore.isInViewMode) {
      CreateLogStore.isInViewMode = false;
      return;
    }
    if(this.props.isFromEdit && !CreateLogStore.isInViewMode) {
      // Edit Selected Note
      CreateLogStore.cardNotesArray = this.state.cards;
      CreateLogStore.isCreatingNote = true;
      let data = await CreateLogStore.gallery.toEditJSON();
      showLog("FINAL DATA ==> " + JSON.stringify(data))
      await CreateLogStore.updateLogApi(ContactDetailsStore.contactID, data);
      if(!CreateLogStore.isNoteCreated) {
        ContactDetailsStore.reset();
      }
      this.props.navigator.pop({ animated: true });
    } else {
      CreateLogStore.cardNotesArray = this.state.cards;
      CreateLogStore.isCreatingNote = true;
      let data = await CreateLogStore.gallery.toJSON();
      await CreateLogStore.createLogApi(ContactDetailsStore.contactID, data);
      if(!CreateLogStore.isNoteCreated) {
        ContactDetailsStore.reset();
      }
      this.props.navigator.pop({ animated: true });
    }
  }

  // render_original() {
  //   showLog("WINDOW HEIGHT ==> " + windowHeight)
  //   let negativeHeight = -windowHeight/25 ;
  //   let modalMoveY = this.yTranslate.interpolate({
  //     inputRange: [0, 1],
  //     outputRange: [0, negativeHeight]
  //   });
  //   let translateStyle = { transform: [{ translateY: modalMoveY }] };

  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         backgroundColor: COLORS.WHITE
  //       }}
  //     >
  //       {this.renderModal()}
  //       <WhiteHeader
  //         onLeft={() => {
  //           CreateLogStore.gallery.wasOpened = false;
  //           this.props.navigator.pop({animated: true});
  //         }}
  //         title={this.getDate()}
  //         onRenderRight={() => (
  //           <TouchableOpacity
  //             style={{
  //               flexDirection: "row",
  //               alignItems: "center"
  //             }}
  //             onPress={() => {
  //               this.saveClick();
  //             }}
  //           >
  //             <Text
  //               style={{
  //                 flex: 1,
  //                 fontFamily: FONTS.Regular,
  //                 fontSize: h(34),
  //                 color: COLORS.DARK,
  //                 textAlign: "right"
  //               }}
  //             >
  //               {this.props.isFromEdit && CreateLogStore.isInViewMode ? 'Edit' : 'Save' }
  //             </Text>
  //           </TouchableOpacity>
  //         )}
  //       />
  //       <View style={{ flex: 1, flexDirection: "column" }}>
  //         <View style={{ flex: 1 / 1.5 }}>
  //           <View
  //             style={{ width: windowWidth }}
  //             ref={ref => {
  //               this.upperCard = ref;
  //             }}
  //             onLayout={({ nativeEvent }) => {
  //               if (this.upperCard) {
  //                 this.upperCard.measure(
  //                   (x, y, width, height, pageX, pageY) => {
  //                     this.setState({
  //                       noteCardHeight:
  //                         height +
  //                         // this.state.bottomOptionsHeight +
  //                         BOTTOMBAR_HEIGHT +
  //                         // STATUSBAR_HEIGHT +
  //                         (windowHeight > 800 ? h(88) + 40 : h(88) + 20)
  //                     });                      
  //                   }
  //                 );
  //               }
  //             }}>
  //           <View
  //             style={{ width: windowWidth}}
  //           >
  //             <Swiper
  //               ref={(ref) => {
  //                 this._swiper = ref;
  //               }}
  //               // ref={(el) => {
  //               // window.formula = el;
  //               // store.swiper = el
  //               // }}
  //               height={
  //                 windowHeight -
  //                 ((windowHeight > 800) ? 160 : 120) -
  //                 ((windowHeight > 800) ? h(88) + 40 : h(88) + 20) -
  //                 this.state.bottomOptionsHeight -
  //                 BOTTOMBAR_HEIGHT 
  //                 // + 20
  //                 //- STATUSBAR_HEIGHT
  //               }
  //               showsButtons={((CreateLogStore && CreateLogStore.gallery && CreateLogStore.gallery.selectedPicture != null) && (CreateLogStore.gallery.pictures.length > 1)) ? true : false}
  //               showsPagination={false}
  //               onIndexChanged={(index) => {this.onSwiperIndexChanges(index)}}
  //               prevButton={
  //                 <TouchableOpacity hitSlop={{top: 20, bottom: 20, left: 20, right: 20}} onPress={() => {this._swiper.scrollBy(-1)}}> 
  //                   <Image source={require("img/previous.png")} />
  //                 </TouchableOpacity>                 
  //               }
  //               nextButton={
  //                 <TouchableOpacity hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}  onPress={() => {this._swiper.scrollBy(1)}}> 
  //                   <Image source={require("img/next.png")} />
  //                 </TouchableOpacity>
  //               }
  //             >
  //               {/* <Image
  //                         style={{
  //                           width: windowWidth,
  //                           height:
  //                             windowHeight -
  //                             ((windowHeight > 800) ? 160 : 120) -
  //                             (windowHeight > 800 ? h(88) + 40 : h(88) + 20) -
  //                             this.state.bottomOptionsHeight -
  //                             BOTTOMBAR_HEIGHT
  //                             // + 20
  //                           //- STATUSBAR_HEIGHT
  //                         }}
  //                         source={(CreateLogStore.gallery.selectedPicture) ? CreateLogStore.gallery.selectedPicture.source : placeholder_icon}
  //                       /> */}
  //               {CreateLogStore.gallery.pictures.length > 0 ? (
  //                 CreateLogStore.gallery.pictures.map((value, index) => {
  //                   return (
  //                     <View style={{}}>
  //                       <Image
  //                         style={{
  //                           width: windowWidth,
  //                           height:
  //                             windowHeight -
  //                             ((windowHeight > 800) ? 160 : 120) -
  //                             (windowHeight > 800 ? h(88) + 40 : h(88) + 20) -
  //                             this.state.bottomOptionsHeight -
  //                             BOTTOMBAR_HEIGHT
  //                             // + 20
  //                           //- STATUSBAR_HEIGHT
  //                         }}
  //                         // source={{
  //                         //   uri: value.product_thumb
  //                         //     ? value.product_thumb
  //                         //     : value.path
  //                         //     ? value.path
  //                         //     : value.uri
  //                         //     ? value.uri
  //                         //     : placeholder_icon
  //                         // }}
  //                         source={value.source}
  //                       />
  //                     </View>
  //                   );
  //                 })
  //               ) : (
  //                 (CreateLogStore.gallery.selectedPicture == null) && 
  //                   <View
  //                     style={{
  //                       width: windowWidth,
  //                       height: windowHeight - ((windowHeight > 800) ? 160 : 120) - (windowHeight > 800 ? h(88) + 40 : h(88) + 20) - this.state.bottomOptionsHeight - BOTTOMBAR_HEIGHT,
  //                       backgroundColor: COLORS.WHITE,
  //                       alignItems: 'center',
  //                       justifyContent: 'center',
  //                     }}
  //                   >
  //                     <Text
  //                       style={{
  //                         fontSize: 30,
  //                         textAlign: 'center'
  //                       }}
  //                     >
  //                       No picture
  //                     </Text>
  //                   </View>
  //               )
  //             }
  //             </Swiper>
  //           </View>
  //           {(!CreateLogStore.isInViewMode) 
  //           ? 
  //             <TouchableOpacity
  //               style={{ position: "absolute", right: 0, top: 0, padding: 15 }}
  //               onPress={() => {
  //                 AlertIOS.alert(
  //                   'Delete Picture',
  //                   'Are you sure you want to delete this item?',
  //                   [
  //                     { text: 'Yes', onPress: async() => {
  //                       await CreateLogStore.gallery.deleteSelectedPicture();
  //                       if(this._swiper) {
  //                         const currentIndex = this._swiper.state.index;
  //                         const offset = 0 - currentIndex;
  //                         this._swiper.scrollBy(offset);
  //                       }  
  //                     }},
  //                     { text: 'No', onPress: () => showLog('Cancel Pressed') },
  //                   ],
  //                 );
  //               }}
  //             >
  //               <Image source={require("img/closepic.png")} />
  //             </TouchableOpacity>
  //           :
  //             null
  //           }      

  //           <View
  //             style={{ position: "absolute", bottom: this.state.bottomOptionsHeight, flexDirection: "row" }}
  //           >
  //             <PictureView
  //               gallery={CreateLogStore.gallery.pictures}
  //               swiper={this._swiper}
  //             />
  //           </View>
  //         </View>
  //           <View
  //             style={{
  //               width: windowWidth,
  //               flexDirection: "row",
  //               backgroundColor: COLORS.RED
  //             }}
  //             ref={ref => {
  //               this.bottomOptions = ref;
  //             }}
  //             onLayout={({ nativeEvent }) => {
  //               if (this.bottomOptions) {
  //                 this.bottomOptions.measure(
  //                   (x, y, width, height, pageX, pageY) => {
  //                     this.setState({ bottomOptionsHeight: height });
  //                   }
  //                 );
  //               }
  //             }}
  //           >
  //             {this.renderBottomOptions(
  //               require("img/photo.png"),
  //               "Take Photo",
  //               true
  //             )}
  //             {this.renderBottomOptions(
  //               require("img/cameraroll.png"),
  //               "Camera Roll",
  //               true
  //             )}
  //             {this.renderBottomOptions(
  //               require("img/addproduct.png"),
  //               "Add Product",
  //               false
  //             )}
  //           </View>
          
  //         </View>
  //         <View
  //         style={{
  //           height: (windowHeight - this.state.noteCardHeight),
  //           // height: (this.state.cards[0].expand == true ||
  //           //   this.state.cards[1].expand == true) ? (windowHeight - this.state.noteCardHeight) : 140,
  //           width: windowWidth,
  //           backgroundColor:
  //             this.state.cards[0].expand == false &&
  //             this.state.cards[1].expand == false
  //               ? COLORS.DARK
  //               : COLORS.WHITE,
  //           // marginTop:
  //           //   this.state.cards[0].expand == true ||
  //           //   this.state.cards[1].expand == true
  //           //     ? windowHeight > 800
  //           //       ? h(88) + 40
  //           //       : h(88) + 20
  //           // 
  //               // : 0
  //         }}
  //       >
  //         {this.state.cards.map((card, i) => {
  //           return (
  //             <Animated.View
  //               {...this._panResponder.panHandlers}
  //                 style={[
  //                   styles.card, translateStyle,
  //                   {
  //                     shadowOffset: { width: 0, height: 1 },
  //                     shadowOpacity: 0.3,
  //                     shadowRadius: 2,
  //                     elevation: 1,
  //                     borderTopLeftRadius: 15,
  //                     borderTopRightRadius: 15,
  //                     backgroundColor: card.color,
  //                     marginTop:
  //                       (windowHeight > 800)
  //                       ?
  //                         (card.expand == false) 
  //                         ?
  //                           // (i == 0) ? 10 : -(windowHeight / 5.5)
  //                           (i == 0) ? 0 : -(windowHeight / 5.5)
  //                         :
  //                           (i == 0) ? h(88) + 100 : -(windowHeight / 2)
  //                       :
  //                       (windowHeight < 570) 
  //                       ?
  //                         (card.expand == false)
  //                         ?
  //                           (i == 0) ? 0 : -(windowHeight / 2.65)
  //                         :
  //                           (i == 0) ? h(88)  : -(windowHeight / 1.5)
  //                       :
  //                       (windowHeight < 668) 
  //                       ?
  //                         (card.expand == false)
  //                         ?
  //                           (i == 0) ? 0 : -(windowHeight / 4)
  //                         :
  //                           (i == 0) ? h(88) + 30 : -(windowHeight / 1.7)
  //                       :
  //                       (windowHeight < 737) 
  //                       ?
  //                         (card.expand == false)
  //                         ?
  //                           (i == 0) ? 0 : -(windowHeight / 7)
  //                         :
  //                           (i == 0) ? h(88) + 50 : -(windowHeight / 2)
  //                       :
  //                         (card.expand == false) 
  //                         ?
  //                           (i == 0) ? -5 : -(windowHeight / 5)
  //                           :
  //                           (i == 0) ? h(88) + 80 : -(windowHeight / 1.7)
  //                       ,
  //                     // marginTop:
  //                     //   (card.expand == false)
  //                     //     ? (i == 0)
  //                     //       ? 0
  //                     //       : -10
  //                     //     : (windowHeight > 800)
  //                     //     ? (i == 0)
  //                     //       ? windowHeight / 150
  //                     //       : -(windowHeight / 1.7)                          
  //                     //     : (windowHeight < 570)
  //                     //     ? (i == 0)
  //                     //       ? windowHeight / 150
  //                     //       : -(windowHeight / 1.7)
  //                     //     :    (i == 0) ? windowHeight / 150 : -(windowHeight / 1.7),
  //                     height: (card.expand == false) ? collapsedCard : expandedCard,
  //                     ...this.mainPosition.getLayout()
  //                   }
  //                 ]}
  //               >
  //                 <View>
  //                   <View
  //                     style={{
  //                       flexDirection: "row",
  //                       justifyContent: "center",
  //                       alignItems: "center",
  //                       width: windowWidth
  //                     }}
  //                     onTouchStart={(e) => {
  //                       LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
  //                       this.expand_collapse_Function(card,i)
  //                     }}
  //                   >
  //                     <Text
  //                       style={[
  //                         styles.textView,
  //                         {
  //                           textAlign: "center",
  //                           marginTop:
  //                             card.expand == false ? (i == 0 ? 5 : 7) : 0
  //                         }
  //                       ]}
  //                     >
  //                       {card.name}
  //                     </Text>
  //                   </View>
  //                   {card.expand == true && this.renderRows(card, i)}
  //                   {/* {this.renderRows(card, i)} */}
  //                 </View>
  //               </Animated.View>
  //           );
  //         })}
  //       </View>
  //         {(CreateLogStore.isCreatingNote) 
  //         ? 
  //           <View style={{ width: windowWidth, height: windowHeight, position:'absolute', justifyContent: 'center', backgroundColor:COLORS.DROPSHADOW }}>
  //             <ActivityIndicator size='large' />
  //           </View>
  //         :
  //           null
  //         } 
  //       </View>
  //     </View>
  //   );
  // }

  render() {
    showLog("RENDER ==> " + windowHeight)
    let negativeHeight = -windowHeight / 2;
    if(windowHeight > 800) {
      negativeHeight = -windowHeight / 1.65;
    } else if(windowHeight > 735) {
      negativeHeight = -windowHeight / 1.50;
    } else if(windowHeight > 665) {
      negativeHeight = -windowHeight / 1.35;
    } else {
      negativeHeight = -windowHeight / 1.60;
    }
    let modalMoveY = this.yTranslate.interpolate({
      inputRange: [0, 1],
      outputRange: [0, negativeHeight]
    });
    let translateStyle = { transform: [{ translateY: modalMoveY }] };

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.WHITE
        }}
      >
        {this.renderModal()}
        <WhiteHeader
          onLeft={() => {
            CreateLogStore.gallery.wasOpened = false;
            this.props.navigator.pop({animated: true});
          }}
          title={this.getDate()}
          onRenderRight={() => (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center"
              }}
              onPress={() => {
                this.saveClick();
              }}
            >
              <Text
                style={{
                  flex: 1,
                  fontFamily: FONTS.Regular,
                  fontSize: h(34),
                  color: COLORS.DARK,
                  textAlign: "right"
                }}
              >
                {this.props.isFromEdit && CreateLogStore.isInViewMode ? 'Edit' : 'Save' }
              </Text>
            </TouchableOpacity>
          )}
          titleStyle={{ fontSize: h(38) }}
        />
          <View style={{ flex: 1, flexDirection: "column" }}>
            <View style={{ flex: 1 / 1.5 }}>

              <View style={{ width: windowWidth }}
                ref={(ref) => {
                  this.bottomCard = ref;
                }}
                onLayout={({ nativeEvent }) => {
                  if (this.bottomCard) {
                    this.bottomCard.measure((x, y, width, height, pageX, pageY) => {
                      this.setState({ noteCardHeight: (height + 57 + 60 + (windowHeight > 800 ? h(88) + 60 : (windowHeight > 735) ? h(88) + 5 : (windowHeight > 665) ? h(88) + 5 : h(88) + 5)) });
                      // this.setState({ noteCardHeight: height +
                      //     BOTTOMBAR_HEIGHT +
                      //     (windowHeight > 800 ? h(88) + 40 : h(88) + 20)
                      // });  
                    });
                  }
                }}
              >
                <Swiper
                  ref={(ref) => {
                    this._swiper = ref;
                  }}
                  // ref={(el) => {
                  // window.formula = el;
                  // store.swiper = el
                  // }}
                  height={
                    windowHeight -
                    ((windowHeight > 800) ? 160 : 120) -
                    ((windowHeight > 800) ? h(88) + 40 : h(88) + 20) -
                    this.state.bottomOptionsHeight -
                    BOTTOMBAR_HEIGHT 
                    // + 20
                    //- STATUSBAR_HEIGHT
                  }
                  showsButtons={((CreateLogStore && CreateLogStore.gallery && CreateLogStore.gallery.selectedPicture != null) && (CreateLogStore.gallery.pictures.length > 1)) ? true : false}
                  showsPagination={false}
                  onIndexChanged={(index) => {this.onSwiperIndexChanges(index)}}
                  prevButton={
                    <TouchableOpacity hitSlop={{top: 20, bottom: 20, left: 20, right: 20}} onPress={() => {this._swiper.scrollBy(-1)}}> 
                      <Image source={require("img/previous.png")} />
                    </TouchableOpacity>                 
                  }
                  nextButton={
                    <TouchableOpacity hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}  onPress={() => {this._swiper.scrollBy(1)}}> 
                      <Image source={require("img/next.png")} />
                    </TouchableOpacity>
                  }
                >
                  {/* <Image
                          style={{
                            width: windowWidth,
                            height:
                              windowHeight -
                              ((windowHeight > 800) ? 160 : 120) -
                              (windowHeight > 800 ? h(88) + 40 : h(88) + 20) -
                              this.state.bottomOptionsHeight -
                              BOTTOMBAR_HEIGHT
                              // + 20
                            //- STATUSBAR_HEIGHT
                          }}
                          source={(CreateLogStore.gallery.selectedPicture) ? CreateLogStore.gallery.selectedPicture.source : placeholder_icon}
                        /> */}
                  {CreateLogStore.gallery.pictures.length > 0 ? (
                    CreateLogStore.gallery.pictures.map((value, index) => {
                      return (
                        <View>
                          <Image
                            resizeMode={"contain"}
                            style={{
                              width: windowWidth,
                              height:
                                windowHeight -
                                ((windowHeight > 800) ? 160 : 120) -
                                (windowHeight > 800 ? h(88) + 40 : h(88) + 20) -
                                this.state.bottomOptionsHeight -
                                BOTTOMBAR_HEIGHT
                                // + 20
                              //- STATUSBAR_HEIGHT
                            }}
                            // source={{
                            //   uri: value.product_thumb
                            //     ? value.product_thumb
                            //     : value.path
                            //     ? value.path
                            //     : value.uri
                            //     ? value.uri
                            //     : placeholder_icon
                            // }}
                            source={value.source}
                          />
                        </View>
                      );
                    })
                  ) : (
                    (CreateLogStore.gallery.selectedPicture == null) && 
                      <View
                        style={{
                          width: windowWidth,
                          height: windowHeight - ((windowHeight > 800) ? 160 : 120) - (windowHeight > 800 ? h(88) + 40 : h(88) + 20) - this.state.bottomOptionsHeight - BOTTOMBAR_HEIGHT,
                          backgroundColor: COLORS.WHITE,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 30,
                            textAlign: 'center'
                          }}
                        >
                          No picture
                        </Text>
                      </View>
                  )
                  }
              </Swiper>

              {(!CreateLogStore.isInViewMode) 
              ? 
                <TouchableOpacity
                  style={{ position: "absolute", right: 0, top: 0, padding: 15 }}
                  onPress={() => {
                    AlertIOS.alert(
                      'Delete Picture',
                      'Are you sure you want to delete this item?',
                      [
                        { text: 'Yes', onPress: async() => {
                          await CreateLogStore.gallery.deleteSelectedPicture();
                          if(this._swiper) {
                            const currentIndex = this._swiper.state.index;
                            const offset = 0 - currentIndex;
                            this._swiper.scrollBy(offset);
                          }  
                        }},
                        { text: 'No', onPress: () => showLog('Cancel Pressed') },
                      ],
                    );
                  }}
                >
                  <Image source={require("img/closepic.png")} />
                </TouchableOpacity>
              :
                null
              }  

              <View
                style={{ position: "absolute", bottom: this.state.bottomOptionsHeight - 50, flexDirection: "row" }}
              >
                <PictureView
                  gallery={CreateLogStore.gallery.pictures}
                  swiper={this._swiper}
                />
              </View>
               
              </View>

              {/* BLACK BAR OPTIONS */}
              <View 
                style={{  width: windowWidth, flexDirection: 'row', backgroundColor: COLORS.DARK  }} //COLORS.DARK
                ref={ref => {
                  this.bottomOptions = ref;
                }}
                onLayout={({ nativeEvent }) => {
                  if (this.bottomOptions) {
                    this.bottomOptions.measure(
                      (x, y, width, height, pageX, pageY) => {
                        this.setState({ bottomOptionsHeight: height });
                      }
                    );
                  }
                }}
              >
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

            <View
              style={{
                height: (windowHeight - this.state.noteCardHeight),
                width: windowWidth,
                // marginTop: -5,
                backgroundColor: (this.state.cards[0].expand == false && this.state.cards[1].expand == false) ? COLORS.DARK : COLORS.WHITE
              }}
            >
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
                      marginTop:
                        (windowHeight > 800)
                        ?
                          (card.expand == false) 
                          ?
                            (i == 0) ? 0 : -7
                            // (i == 0) ? 0 : -(windowHeight / 5.5)
                          :
                            (i == 0) ? windowHeight / 600 : -(windowHeight / 1.75)   
                            // (i == 0) ? h(88) + 100 : -(windowHeight / 5) 
                        :
                        (windowHeight < 570) 
                        ?
                          (card.expand == false)
                          ?
                            (i == 0) ? 0 : -10
                          :
                            (i == 0) ? h(88) : -(windowHeight / 1.7)
                        :
                        (windowHeight < 668) 
                        ?
                          (card.expand == false)
                          ?
                            (i == 0) ? 0 : -10
                          :
                            (i == 0) ? h(88) + 30 : -(windowHeight / 1.7)
                        :
                        (windowHeight < 737) 
                        ?
                          (card.expand == false)
                          ?
                            (i == 0) ? 0 : -10
                          :
                            (i == 0) ? windowHeight / 250 : -(windowHeight / 1.5)
                        :
                          (card.expand == false) 
                          ?
                            (i == 0) ? -5 : -(windowHeight / 5)
                            :
                            (i == 0) ? h(88) + 80 : -(windowHeight / 1.7),
                      // marginTop: (card.expand == false) ?
                      //     (i == 0) ? 10 : -(windowHeight / 5.5)
                      //     :
                      //     (i == 0) ? h(88) + 100 : -(windowHeight / 2),
                  // marginTop:
                  //     (card.expand == false)
                  //       ? (i == 0)
                  //         ? 0
                  //         : -10
                  //       : (windowHeight > 800)
                  //       ? (i == 0)
                  //         ? windowHeight / 150
                  //         : -(windowHeight / 1.7)                          
                  //       : (windowHeight < 570)
                  //       ? (i == 0)
                  //         ? windowHeight / 150
                  //         : -(windowHeight / 1.7)
                  //       :    (i == 0) ? windowHeight / 150 : -(windowHeight / 1.7),
                      height: (card.expand == false) ? collapsedCard : expandedCard,
                      ...this.mainPosition.getLayout()
                    }]}>
                      <View>
                        <View style={{ width: windowWidth ,flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                          onTouchStart={(e) => {
                            console.log("current card index===>"+i)
                            if(this.state.cards[0].expand == true) {
                              LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
                            }
                            this.expand_collapse_Function(card,i)
                          }}
                        >
                          <Text
                            style={[
                              styles.textView,
                              {
                                textAlign: 'center',
                                marginTop:
                                  card.expand == false ? (i == 0 ? 5 : 7) : 0
                              }
                            ]}
                          >
                            {card.name}
                          </Text>
                        </View>
                      {card.expand == true && this.renderRows(card, i)}
                      </View>
                    </Animated.View>
                );
              })}
            </View>
            {(CreateLogStore.isCreatingNote)
            ?
              <View style={{ width: windowWidth, height: windowHeight, position:'absolute', justifyContent: 'center', alignItems: 'center', alignSelf:'center',  backgroundColor:COLORS.DROPSHADOW }}>
                <ActivityIndicator size='large' />
              </View>
            :
              null
            }
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  container: {
    flex: 1,
    margin: 20
  },
  contain: {
    height: windowHeight,
    width: "100%",
    backgroundColor: "white"
  },
  heading: {
    alignSelf: "center",
    fontSize: 30,
    fontWeight: "bold",
    paddingTop: 40
  },
  textView: {
    paddingVertical: 15,
    fontSize: 20,
    fontFamily: FONTS.MEDIUM,
    alignSelf: "center"
  },
  card: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: "center",
    height: collapsedCard
  },
  titleStyle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 300
  },

  mainContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.WHITE,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },
  productImageView: {
    flex: 1,
    width: windowWidth / 2 - 30,
    height: windowHeight / 2 - 150,
    resizeMode: "contain"
  },
  imageClickView: {
    position: "absolute",
    top: 7,
    right: 7
  },
  priceLabel: {
    color: COLORS.GRAY2,
    fontFamily: FONTS.ROMAN,
    fontSize: SCALE.h(28),
    textDecorationLine: "line-through"
  },
  finalPriceLabel: {
    color: COLORS.BLACK,
    fontFamily: FONTS.ROMAN,
    fontSize: SCALE.h(28),
    marginLeft: 10
  },
  listContainer: {
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },
  listRowContainer: {
    margin: 5,
    marginTop: 10,
    width: windowWidth / 2 - 20,
    height: windowHeight / 2 - 100
  },
  btnClickView: {
    borderRadius: 5,
    width: windowWidth / 2 - 20,
    height: windowHeight / 2 - 150,
    alignItems: "center",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1
  },
  imageView: {
    flex: 1,
    width: windowWidth / 2 - 30,
    height: windowHeight / 2 - 150,
    resizeMode: "contain"
  },
  itemNameView: {
    marginTop: 7,
    color: COLORS.BLACK,
    fontFamily: FONTS.LIGHT,
    textAlign: "center",
    justifyContent: "center",
    fontSize: SCALE.h(34)
  }
});