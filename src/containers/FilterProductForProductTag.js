import { observer } from "mobx-react";
import React, { Component } from "react";
import { ListView } from "react-native";
import { Modal } from "react-native";
import CollapsableContainer from "../components/ProductCollapsableContainer";
import SlimHeader from '../components/SlimHeader';
import { COLORS, h, Image, ScrollView, showLog, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, windowHeight, windowWidth, ActivityIndicator } from "../helpers";
import CreatePostStore from '../mobx/stores/CreatePostStore';
import EditPostStore from '../mobx/stores/EditPostStore';
import ProductTagStore from '../mobx/stores/ProductTagStore';
import { FONTS, SCALE } from "../style";

const CatalogResultItem = observer(({ item, navigator }) => {
  return (
    <TouchableOpacity
      style={{
        margin: 5,
        marginTop: 10,
        width: (windowWidth / 2) - 10,
        height: (windowHeight / 2) - 80,
        backgroundColor:COLORS.WHITE,
        alignItems:"center"
      }}
      onPress={() => {

        item.isLocallyAdded = true;
          CreatePostStore.gallery.addProductToPicture(
            CreatePostStore.gallery.position.x,
            CreatePostStore.gallery.position.y,
            item
          );
          if (CreatePostStore.postId) { // post id exist which means we are editing
            console.log("Does post id exist?")

            let currentPicId = CreatePostStore.gallery.selectedPicture.id;
            let currentPic = CreatePostStore.gallery.selectedPicture.source.uri;

            if (EditPostStore.photos_attributes.length > 0) {
              console.log("Does photos_attributes length >0?")

              EditPostStore.photos_attributes.map((value, index) => {
                if (value.id == currentPicId) {
                  console.log("Does value.id == currentPicId?")

                  let tempAttributes = [];
                  tempAttributes = EditPostStore.photos_attributes[index].labels_attributes;
                  // now adding new tag of the product locally , (which is not at server yet!)
                  tempAttributes.push({ "position_top": CreatePostStore.gallery.position.x, 
                  "position_left": CreatePostStore.gallery.position.y, "product_id": item.id })
                  console.log("ITEM_WHILE_ADD::" + item.id)
                  
                  EditPostStore.photos_attributes[index].labels_attributes = tempAttributes;
                }
                else {
                  if ((index + 1) == EditPostStore.photos_attributes.length) {
                    let tempAttributes = [];
                    tempAttributes.push({ "position_top": CreatePostStore.gallery.position.x, "position_left": CreatePostStore.gallery.position.y, "product_id": item.id })
        
                    EditPostStore.photos_attributes.push({
                      'id': currentPicId,
                      'asset_url':currentPic,
                      'labels_attributes':tempAttributes
                    })                  
                  }
                }                      
              })
              
            } else {
              let tempAttributes = [];
              tempAttributes.push({ "position_top": CreatePostStore.gallery.position.x, "position_left": CreatePostStore.gallery.position.y, "product_id": item.id })
  
              EditPostStore.photos_attributes.push({
                'id': currentPicId,
                'asset_url':currentPic,
                'labels_attributes':tempAttributes
              })
            }                 
          }
          console.log('EDITED TAGS=>'+JSON.stringify(EditPostStore.photos_attributes))
          ProductTagStore.isDone = true;
          CreatePostStore.productCounter = CreatePostStore.productCounter+1
          // navigator.pop({ animated: true });
          navigator.dismissModal({ animationType: 'slide-down' });
                      // ProductTagStore.isDone = true;

        }}
      >
      <View
        style={{
          borderRadius: 5,
          width: (windowWidth / 2) - 25,
          height: (windowHeight / 2) - 150,
          alignItems: 'center',
          elevation: 1,
          shadowOpacity: 0.10,
          // shadowRadius: 0.8,
          shadowOffset: {
            height: 1.2,
            width: 1.2
          },
          backgroundColor:COLORS.WHITE
        }} >
        <Image
          defaultSource={require('img/medium_placeholder_icon.png')}
          source={(item.product_image) ? { uri: item.product_image } : require('img/medium_placeholder_icon.png')}
          style={{
            flex: 1,
            width: (windowWidth / 2) - 30,
            height: (windowHeight / 2) - 150,
            resizeMode: 'contain',

          }} />
      </View>
      <Text
        style={{
          marginTop: 7,
          color: COLORS.BLACK,
          fontFamily: FONTS.LIGHT,
          textAlign: 'left',
          justifyContent: 'center',
          width: (windowWidth / 2) - 25,
          fontSize: SCALE.h(25),
        }} numberOfLines={2}>{item.name}</Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 3,
          width: (windowWidth / 2) - 25,
          // position: 'absolute',
          bottom: 0,
        }}>


       {(item.discount_percentage != null) ? 
       
       <View>
       <View style={{flexDirection:'row'}}>  
        <Text
          style={{
            color: COLORS.GRAY2,
            fontFamily: FONTS.ROMAN,
            fontSize: SCALE.h(27),
            textDecorationLine:'line-through'
          }}>{(item.price) ? ("$" + item.price) : "$0.0"}</Text>
       
       <Text
          style={{
            color: COLORS.DISCOUNT_RED,
            fontFamily: FONTS.ROMAN,
            fontSize: SCALE.h(27),
            marginLeft:10,
          }}>{(item.final_price) ? ("$" + item.final_price) : "$0.0"}</Text> 
      </View> 
      <Text
          style={{
            color: COLORS.DISCOUNT_RED,
            fontFamily: FONTS.ROMAN,
            fontSize: SCALE.h(27),
          }}>{item.discount_percentage}% off</Text>
       </View>
        :
         
        <Text
          style={{
            color: COLORS.BLACK,
            fontFamily: FONTS.ROMAN,
            fontSize: SCALE.h(27)
          }}>{(item.final_price) ? ("$" + item.final_price) : "$0.0"}</Text>
      }    
    </View>
    </TouchableOpacity>

  );

});

@observer
export default class FilterProductForProductTag extends Component {
  constructor(props) {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      showFilterModal: false,  
     
        dataSource: ds.cloneWithRows(['row 1', 'row 2']),
     
    };
  }

  componentDidMount() {
    StatusBar.setBarStyle('light-content');
    // this.setState({ showFilterModal: true })
   
    let store = ProductTagStore;
    store.load("", true,"","");
  }

  async handleChange() {
    let store = ProductTagStore;
    store.lastSearchedText = store.inputText;
    await store.load(store.lastSearchedText, true, "", "", false, 1);
    store.isLoading = false;
    store.inputText = "";
    this.setState({ showFilterModal: false })
  }

  async onClearFilter(){
    let store = ProductTagStore;
    store.lastSearchedText = "";
    let temp1 = await store.getHeaderResetMenu();
    let temp2 = await store.getSidebarResetMenu();
    store.headerProductMenu = temp1;
    store.sidebarProductMenu = temp2;
    store.minPrice = 0;
    // store.maxPrice = 5000;
    store.maxPrice = 400;
    store.inputText = "";
    store.load("", true,"","");
    this.setState({ showFilterModal: !this.state.showFilterModal });
  }

  render () {
    let store = ProductTagStore;
    return(
      <View style={{ paddingTop: 20, flex: 1, backgroundColor: COLORS.WHITE }}>
        {(store.isLoading) ? 
        (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size='large' />
          </View>
        )
        :
        (
          <View style={{flex:1, height:windowHeight}}>
            <SlimHeader
              titleWidth={140}
              leftText='Back'
              onLeft={() => {
                this.props.navigator.dismissModal({ animationType: 'slide-down' });
              }}
              title='Product Tag'
              titleStyle={{ fontFamily: FONTS.SF_MEDIUM }}
              rightText="Filter"
              onRight={ ()=>{
                this.setState({ showFilterModal: !this.state.showFilterModal })
              }}          
            />
            
            {
            (store.productListSelector.data.length > 0) ?
              <ListView
                style={{flex:1}}
                contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', alignItems:"center",justifyContent:"space-between" }}
                // contentContainerStyle={{padding:10,backgroundColor:COLORS.RED,flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'}}
                bounces={false}
                enableEmptySections={true}
                dataSource={store.dataSourceProductSelector}
                renderRow={(item,index) => {
                  return (<CatalogResultItem key={item.key}
                              item={item}
                              navigator={this.props.navigator} />)
                }}
                onEndReached={() => {
                  store.loadNextPageNew(store.lastSearchedText);
                }}
                renderFooter={() => {
                  if (store.nextPage != null && !store.isLoadingNextPage) {
                    return (
                      <View
                      style={{
                      flex: 1,
                      width:windowWidth,
                      left:0,right:0,bottom:-10,
                      position:'absolute',
                      paddingVertical: 20,
                      alignItems: "center",
                      justifyContent: "center"
                      }}
                      >
                        <ActivityIndicator size="large" />
                      </View>
                    );
                  } else {
                  return <View />;
                  }
                }}
              />

            : 
              <View style={{ flex: 1, backgroundColor:'transparent' }}>
                <Text
                  style={{
                    paddingTop: h(38),
                    fontSize: h(34),
                    textAlign: 'center',
                    fontFamily: FONTS.BOOK_OBLIQUE
                  }}
                >
                  {this.returnBlank()}
                </Text>
              </View>
            }

            <Modal
              style={{ width: windowWidth/2,height:windowHeight, backgroundColor: 'blue', justifyContent:'flex-end', alignItems:'flex-end'}}
              animationType={"none"}
              visible={this.state.showFilterModal}
              transparent={true}
              // swipeDirection={"left"}
              >

              <TouchableOpacity style={styles.modalClickView}
              activeOpacity={1}
              onPress={() => {
                this.setState({ showFilterModal: !this.state.showFilterModal })
            }}>

            </TouchableOpacity>
              <View style={{
                padding: 5,
                position: 'absolute',
                right: 5,
                marginTop: (windowHeight > 800) ? h(88) + 40 : h(88) + 20,
                width: windowWidth - 80,
                height: (windowHeight > 800) ?
                  windowHeight - (h(88) + 100) :
                  windowHeight - (h(88) + 80),
                elevation: 1,
                shadowOpacity: 0.40,
                backgroundColor: COLORS.WHITE,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                marginLeft: 40
              }}>
                <ScrollView>
                  <View>
              
                    <View
                      style = {{
                        height: h(86),
                        backgroundColor: COLORS.LIGHT6,
                        padding: h(15),
                        flexDirection: 'row',
                      }}
                    >
                      <View
                        style = {{
                          backgroundColor: COLORS.WHITE,
                          flex: 1,
                          justifyContent: 'center',
                          borderRadius: h(14),
                        }}
                      >
                        <View
                          style = {{
                            flex: 1,
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
                            onChangeText={
                              (t) => {
                                store.inputText = t;     
                                }
                              }
                            style = {{
                              fontSize: h(30),
                              fontFamily: FONTS.BOOK,
                              marginLeft: h(16),
                              flex: 1,
                              paddingRight: h(15),
                              color: COLORS.BLACK1
                            }}
                            placeholder='Search'
                          />
                        </View>
                      </View>
                    </View>
                  
                    <View style={{ padding: 10 }}> 
                      {store.headerProductMenu.map((item, pos) => {
                        return <CollapsableContainer collapseableBackgroundStyle={{
                        backgroundColor: COLORS.WHITE
                      }}
                        collapseableTextStyle={{
                          color: COLORS.BLACK,
                          fontSize: 16
                        }}
                        collapseableStyle={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          margin: 20,
                          marginLeft: 10,
                          marginTop: 5,
                        }}
                        index={0}
                        key={pos}
                        label={item.name} noPadding>
                        {(item.data && item.data.length > 0)?
                            item.data.map((obj, index) => {

                            return <TouchableOpacity
                              key={index}
                              style={(obj.isSelected) ? styles.selectedButtonBackground :styles.unSelectedButtonBackground}
                              onPress={() => {
                                if(!item.multiselect) {
                                  setTimeout(() => {
                                    var temp = obj.isSelected;
                                    obj.isSelected = !temp;
                                    store.headerProductMenu[pos].data[index] = obj;
                                  },100)
                                  for(var j=0; j<store.headerProductMenu[pos].data.length; j++) {
                                    if(j != index) {
                                      store.headerProductMenu[pos].data[j].isSelected = false;
                                    }
                                  }
                                } else {
                                  var temp = obj.isSelected;
                                  obj.isSelected = !temp;
                                  store.headerProductMenu[pos].data[index] = obj;
                                }
                              }}
                            >
                              <Text style={(obj.isSelected) ? styles.selectedText :styles.unSelectedText}>{obj.name}</Text>
                            </TouchableOpacity>

                          })
                          : null
                        }
                      </CollapsableContainer>

                      })}
                    </View>

                    {
                      (store.sidebarProductMenu && store.sidebarProductMenu.length > 0)
                      ?
                        <View style= {{height:0.5, backgroundColor:COLORS.GRAY}}/>
                      :
                        null  
                    }

                    <View style={{ padding: 10 }}> 
                      {store.sidebarProductMenu.map((item, pos) => {
                        return <CollapsableContainer collapseableBackgroundStyle={{
                        backgroundColor: COLORS.WHITE
                      }}
                        collapseableTextStyle={{
                          color: COLORS.BLACK,
                          fontSize: 16
                        }}
                        collapseableStyle={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          margin: 20,
                          marginLeft: 10,
                          marginTop: 5,
                        }}
                        index={0}
                        label={item.name} noPadding>
                        {(item.data && item.data.length > 0)?
                            item.data.map((obj, index) => {

                            return <TouchableOpacity
                              style={(obj.isSelected) ? styles.selectedButtonBackground :styles.unSelectedButtonBackground}
                              onPress={() => {
                                if(!item.multiselect) {
                                  setTimeout(() => {
                                    var temp = obj.isSelected;
                                    obj.isSelected = !temp;
                                    store.sidebarProductMenu[pos].data[index] = obj;
                                  },100)
                                  for(var j=0; j<store.sidebarProductMenu[pos].data.length; j++) {
                                    if(j != index) {
                                      store.sidebarProductMenu[pos].data[j].isSelected = false;
                                    }
                                  }
                                } else {
                                  var temp = obj.isSelected;
                                  obj.isSelected = !temp;
                                  store.sidebarProductMenu[pos].data[index] = obj;
                                }
                              }}
                            >
                              <Text style={(obj.isSelected) ? styles.selectedText :styles.unSelectedText}>{obj.name}</Text>
                            </TouchableOpacity>
                          })
                          : null
                        }
                      </CollapsableContainer>
                      })}
                    </View>
                  </View>
                </ScrollView>

                <View style={{flexDirection:"row"}}> 
                  <TouchableOpacity style={{
                      backgroundColor: COLORS.DARK2,
                      // width: windowWidth/2,
                      flex:1,
                      height: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignContent:'center',
                      alignSelf:'center',
                      marginTop: 10
                    }} 
                    onPress={() => {
                      this.handleChange()
                    }}>
                      <Text style={{
                        color: COLORS.WHITE,
                        fontSize: h(30),
                        fontFamily: FONTS.ROMAN,
                        textAlign: 'center',
                        alignSelf:'center',
                      }}>Apply</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf:'flex-end',
                      marginTop: 10,
                      height: 30,
                      flex:1,
                      // width: windowWidth/4,
                    }} 
                    onPress={() => {
                      this.onClearFilter()
                    }}>
                      <Text style={{
                        color: COLORS.DARK,
                        fontSize: h(30),
                        fontFamily: FONTS.HEAVY,
                        textAlign: 'center',
                        alignSelf:'center',
                      }}>Clear</Text>
                  </TouchableOpacity>
                </View>
      
              </View>
            </Modal>
        </View>
      )
      }
    </View>
    )
  }

  returnBlank() {   
    return 'There are no products yet.';
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  sortbyTextStyle: {
    fontFamily: FONTS.MEDIUM,
    fontSize: SCALE.h(30),
    color: COLORS.DARK,
    paddingTop: 2.5,
    paddingBottom: 2.5
  },
  checkboxTextStyle: {
    borderWidth: 0,
    textAlignVertical: 'center',
    fontFamily: FONTS.ROMAN,
    fontSize: SCALE.h(30),
    color: COLORS.DARK
  },
  checkBoxStyle: {
    padding: 5
  },
  cardStyleTextInput: {
    width: windowWidth - 30,
    backgroundColor: COLORS.WHITE,
    padding: 5,
    elevation: 1,
    shadowOpacity: 0.10,
    shadowOffset: {
      height: 1.2,
      width: 1.2,
    },
    marginTop: 16,
    alignSelf: 'center'
  },
  textInputStyle: {
    width: windowWidth - 40,
    height: SCALE.h(80),
    fontSize: SCALE.h(30),
    fontFamily: FONTS.LIGHT,
    color: COLORS.BLACK,
    paddingLeft: 5,
  },
  unSelectedText: {
    margin: 10,
    alignSelf: 'center',
  },
  unSelectedButtonBackground: {
    borderColor: COLORS.LIGHT_GRAY1,
    borderRadius: 2,
    borderWidth: 1,
    // height: 40,
    justifyContent: "center",
    alignContent: "center",
    alignItems: 'center',
    margin: 5,
  },
  selectedText: {
    margin: 10,
    alignSelf: 'center',
    color:COLORS.WHITE
  },
  selectedButtonBackground: {
    borderColor: COLORS.LIGHT_GRAY1,
    borderRadius: 2,
    borderWidth: 1,
    // height: 40,
    justifyContent: "center",
    alignContent: "center",
    alignItems: 'center',
    margin: 5,
    backgroundColor: COLORS.LIGHT_GRAY1,
    // backgroundColor: 'red'
  },
  modalClickView: {
    height: windowHeight,
    width: windowWidth,
    backgroundColor: COLORS.TRANSPARENT,
  }
});