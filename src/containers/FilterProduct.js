import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { observer } from "mobx-react";
import React, { Component } from "react";
import CollapsableContainer from "../components/ProductCollapsableContainer";
import { TextInput, COLORS, h, Image, ScrollView, showLog, StatusBar, StyleSheet, Text, TouchableOpacity, View, windowHeight, windowWidth } from "../helpers";
import { FONTS, SCALE } from "../style";
import ProductTagStore from '../mobx/stores/ProductTagStore';
import AllProductStore from '../mobx/stores/hfStore/AllProductStore';

@observer
export default class FilterProduct extends Component {
  constructor(props) {
    super();
    this.state = {
      slider_min: 0,
      slider_max: 400,
      values: [0, 400],
      // slider_max: 5000,
      // values: [0, 5000],
    };
  }

  multiSliderValuesChange = (values) => {
    this.setState({
      values,
    });
    let store = ProductTagStore;
    store.minPrice = values[0];
    store.maxPrice = values[1];
  }

  componentDidMount() {
    StatusBar.setBarStyle('light-content');
    // let store = ProductTagStore;
    // store.loadMenu();
  }

  async handleChange() {
    AllProductStore.isFrom = "ProductAll";
    
    let store = ProductTagStore;
    store.lastSearchedText = store.inputText;
    this.props.onChange();
    await store.load(store.lastSearchedText, true, this.state.values[0], this.state.values[1], false, 1);
    store.inputText = "";
    store.isLoading = false;
  }

  async onClearFilter(){
    let store = ProductTagStore;
    store.lastSearchedText = "";
    let temp1 = await store.getHeaderResetMenu();
    let temp2 = await store.getSidebarResetMenu();
    store.headerProductMenu = temp1;
    store.sidebarProductMenu = temp2;
    await this.props.onClear();
  }

  render() {
    let store = ProductTagStore;
    return (
      <View style={{
        height: (windowHeight > 800) ? windowHeight - (h(88) + 100) : windowHeight - (h(88) + 80),
        backgroundColor: "white"
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
                    flex:1,
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

            <View
              style={{
                flexDirection: 'row', paddingTop: SCALE.h(35),
                paddingLeft: SCALE.w(25),
                paddingRight: SCALE.w(25),
                justifyContent: 'space-between'
              }}>
              <Text
                style={{
                  fontFamily: FONTS.LIGHT,
                  fontSize: SCALE.h(30),
                  color: COLORS.BLACK
                }}>Select Price Range</Text>
              <Text
                style={{
                  fontFamily: FONTS.LIGHT,
                  fontSize: SCALE.h(28),
                  color: COLORS.BLACK
                }}>
                ${store.minPrice} - ${store.maxPrice}
              </Text>
            </View>

            <View style={{ padding: 10, width:windowWidth - 500 }}>
              <MultiSlider
                selectedStyle={{ backgroundColor: "#e3372b" }}
                values={[store.minPrice, store.maxPrice]}
                sliderLength={windowWidth - 110}
                trackStyle={{ width: windowWidth }}
                onValuesChange={this.multiSliderValuesChange}
                min={this.state.slider_min}
                max={this.state.slider_max}
                step={100}
                markerStyle={{ width: 15, height: 15, backgroundColor: "#e3372b" }}
              />
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
            // width: windowWidth/2,
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
    );
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
    backgroundColor: COLORS.LIGHT_GRAY1
  }
});