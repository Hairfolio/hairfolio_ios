import { TextInput, ActivityIndicator, autobind, Component, Dimensions, FONTS, h, Image, observer, React, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View, windowHeight, windowWidth } from 'Hairfolio/src/helpers';
import { Picker } from 'react-native';
import { COLORS, showLog, StyleSheet } from '../../helpers';
import AddLinkStore from '../../mobx/stores/AddLinkStore';
import CreatePostStore from '../../mobx/stores/CreatePostStore';
import ProductTagStore from '../../mobx/stores/ProductTagStore';
import { SCALE } from '../../style';
import SlimHeader from '../SlimHeader';
import CollapsableContainer from '../CollapsableContainer';
import LoadingScreen from '../../components/LoadingScreen';

var { height, width } = Dimensions.get('window');

const BoxSelector = observer(({ selector, type = false, navigator, isPositionCentered = false }) => {
  let picker;
  if (selector.isHidden) {
    return null;
  }
  if (selector.isOpen) {
    if (selector.isLoaded) {

      picker = (
        <Picker
          selectedValue={selector.value}
          style={
            (isPositionCentered) ?
              { marginTop: h(20), backgroundColor: COLORS.WHITE, width: windowWidth, position: "relative", marginLeft: -(windowWidth / 3), top: 15 }
              :
              { marginTop: h(20), backgroundColor: COLORS.WHITE, width: windowWidth, position: "relative", top: 15 }
          }
          itemStyle={{ fontSize: h(32) }}
          onValueChange={val => {
            selector.setValue(val);
            showLog('ProductTagModal BoxSelector Click ==> ' + 'selector value change called');
          }}>
          {selector.data.map(data =>
            <Picker.Item key={data.id} label={data.name} value={data.name} />
          )}
        </Picker>
      );
    } else {
      picker = (
        <View style={{
          marginTop: h(20),
          height: 200,
          backgroundColor: COLORS.WHITE,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
  }
  return (
    <View>
      <TouchableWithoutFeedback
        onPress={
          () => {
            if (type) {

            } else {
              if (selector.isEnabled) {
                if (!selector.isOpen) {
                  selector.open();

                } else {
                  selector.close()
                }
              }
            }
          }
        }
      >

        {type ?

          <View style={{ marginTop: 10, marginLeft: 10, marginRight: 10 }}>
            <CatalogResults selector={selector}
              catalog={AddLinkStore.catalog}
              navigator={navigator} />
          </View>
          :
          <View
            style={{
              height: h(88),
              backgroundColor: COLORS.WHITE,
              marginHorizontal: h(6),
              marginTop: h(20),
              flexDirection: 'row',
              width: windowWidth / 3
            }}>
            <View style={{ flex: 1, paddingLeft: h(10), justifyContent: 'center' }}>
              <Text
                numberOfLines={2}
                style={{
                  fontSize: h(28),
                  opacity: selector.opacity,
                }}
              >{selector.value}</Text>
            </View>
            <View style={{ width: h(81), flexDirection: 'row' }}>
              <View style={{ width: h(1), height: h(80), backgroundColor: COLORS.BOTTOMBAR_NOTSELECTED }} />
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Image
                  style={{ opacity: selector.opacity }}
                  source={selector.arrowImage}
                />
              </View>
            </View>
          </View>
        }

      </TouchableWithoutFeedback>
      {picker}
    </View>
  );
});

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
          CreatePostStore.gallery.addProductToPicture(
            CreatePostStore.gallery.position.x,
            CreatePostStore.gallery.position.y,
            item
          );
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
          textAlign: 'center',
          justifyContent: 'center',
          fontSize: SCALE.h(25)
        }} numberOfLines={2}>{item.name}</Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 3,
          width: (windowWidth / 2) - 25,
          position: 'absolute',
          bottom: 0
        }}>
        <Text
          style={{
            color: COLORS.BLACK,
            fontFamily: FONTS.ROMAN,
            fontSize: SCALE.h(27)
          }}>{(item.price) ? ("$" + item.price) : "$0.0"}</Text>
      </View>
    </TouchableOpacity>

  );

});

const CatalogResults = observer(({ selector, catalog, navigator }) => {

  if (selector.data == null) {
    showLog("CATALOG ITEM IS NULL")
    return <View />;
  } else if (selector.data.length == 0) {
    showLog("CATALOG ITEM IS NOT NULL"+catalog.items.length)
    return (
      <View>
        <Text style={{ flex: 1, textAlign: 'center', fontSize: h(40), marginTop: 25 }} > No results found </Text>
      </View>
    )
  }

  
  return (

    <ScrollView>
      <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', position:'absolute', zIndex:-999999, backgroundColor:'red'}}>
        {selector.data.map((item, index) => {
          return (<CatalogResultItem key={item.key}
            item={item}
            navigator={navigator} />)
        })}
      </View>
    </ScrollView>
  )
});


@observer
export default class ProductTagModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
      isCategoryOpen: false,
      isSubCategoryOpen: false,
      isBrandOpen: false,
      arr_hair_care_product_type: [
        { "name": "Shampoo", "checked": false },
        { "name": "Conditioner", "checked": false },
        { "name": "Hair Treatments", "checked": false },
        { "name": "Leave In Conditioner", "checked": false },
        { "name": "Detangler Spray", "checked": false },
        { "name": "Styling Products", "checked": false },
        { "name": "Dry Shampoo", "checked": false },
        { "name": "Styling Tools", "checked": false },
        { "name": "Hair Color", "checked": false },
        { "name": "Hair Care Kits and Value Sets", "checked": false },
        { "name": "Hair Accessories", "checked": false },
        { "name": "Hair Care Supplements", "checked": false },
        { "name": "Color Lock Spray", "checked": false },
        { "name": "U/V Protection", "checked": false },
      ],
      arr_hair_type: [
        { "name": "Coarse Hair", "checked": false },
        { "name": "Color-Treated Hair", "checked": false },
        { "name": "Curly Hair", "checked": false },
        { "name": "Damaged Hair", "checked": false },
        { "name": "Fine Hair", "checked": false },
        { "name": "Normal Hair", "checked": false },
        { "name": "Oily Hair", "checked": false },
        { "name": "Frizzy Hair", "checked": false },
        { "name": "Volumizing Hair", "checked": false },
        { "name": "Thinning Hair", "checked": false },
        { "name": "Dry Hair", "checked": false },
        { "name": "Dry Scalp", "checked": false },
        { "name": "Hair Loss", "checked": false },
        { "name": "Sensitive Scalp", "checked": false },
      ],
      arr_consistency_type: [
        { "name": "Spray", "checked": false },
        { "name": "Non Aerosol Spray", "checked": false },
        { "name": "Cream", "checked": false },
        { "name": "Gel", "checked": false },
        { "name": "Moose", "checked": false },
        { "name": "Pomade", "checked": false },
        { "name": "Wax", "checked": false },
        { "name": "Oil", "checked": false },
        { "name": "Primer", "checked": false },
        { "name": "Powder Spray", "checked": false }
      ],
      slider_min: 0,
      slider_max: 10000,
      values: [500, 5000],
    };
  }

  renderSearch(store){    
    if (store.mode == 'search') {
      return (
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
          {/* <TouchableOpacity
            onPress={
              () => {
                store.getProductsList(store.inputText)
                this.setState({isCategoryOpen: false, isSubCategoryOpen: false, isBrandOpen: false})
              }
            }
            style = {{
              backgroundColor: COLORS.DARK3,
              borderRadius: h(10),
              marginLeft: h(15),
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: h(10)
            }}
          >
            <Text
              style = {{
                color: COLORS.WHITE,
                fontSize: h(30),
                fontFamily: FONTS.ROMAN,
              }}
            >
              Search
            </Text>
          </TouchableOpacity> */}
        </View>
      );
    }
  
    return (
      <TouchableWithoutFeedback
        onPress={
          () => store.startSearchMode()
        }
      >
        <View
          style = {{
            height: h(86),
            backgroundColor: COLORS.LIGHT6,
            padding: h(15)
          }}
        >
          <View
            style = {{
              backgroundColor: COLORS.WHITE,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: h(14)
            }}
          >
            <View
              style = {{
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Image
                style={{height: h(26), width: h(26)}}
                source={require('img/search_icon.png')}
              />
              <Text
                style = {{
                  fontSize: h(30),
                  fontFamily: FONTS.BOOK,
                  color: COLORS.PLACEHOLDER_SEARCH_FIELD,
                  marginLeft: h(16)
                }}
              >
                Search
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

    returnBlank() {
     
     return 'There are no products yet.';
  }


  render() {
    let store = ProductTagStore;
    
    let content = <View />;
    if (!store.isLoading) {
      let canGo = ProductTagStore.canGoNext
      content = (
        <View style={{backgroundColor:COLORS.WHITE}}>
          {this.renderSearch(store)}
          <View style={{ flexDirection: "row", backgroundColor:COLORS.WHITE, width:windowWidth}}>
            
            <View style={styles.bgButtonStyle}>
              <CollapsableContainer 
                from_filter={true}
                index={0}
                status={this.state.isCategoryOpen}
                onPress={() => 
                  {
                    store.isLoading = true
                    this.setState({
                      isCategoryOpen: !this.state.isCategoryOpen, 
                      isSubCategoryOpen: false, 
                      isBrandOpen: false
                    })
                      
                    setTimeout(()=>{
                      store.isLoading = false
                    },500)

                    }
                  }

                   
                // collapseableBackgroundStyle={{
                //     width:(windowWidth), 
                //     backgroundColor:COLORS.WHITE,
                //     justifyContent:'flex-start'
                // }}
                // collapseableContainerStyle={{width:(windowWidth)}}
                // collapseableTextStyle={{
                //   color: COLORS.BLACK,
                //   fontSize: 16
                // }}
                // collapseableStyle={{
                //   flexDirection: "row",
                //   width:(windowWidth),
                //   flexWrap: "wrap",
                //   backgroundColor:COLORS.WHITE,
                //   zIndex:999999,
                //   position:'absolute'
                // }}

                collapseableBackgroundStyle={styles.bgBackgroundStyle}
                collapseableContainerStyle={styles.widthStyle}
                collapseableTextStyle={styles.bgTextStyle}
                collapseableStyle={styles.bgMainStyle}
                label="Category" noPadding>
                {
                  <View style={{ flexDirection: "row", width:(windowWidth), flexWrap: "wrap", backgroundColor:COLORS.WHITE}}>
                    {
                      (store.productCategories && store.productCategories.length > 0) ?
                      store.productCategories.map((item, index) => {
                        return <TouchableOpacity
                          style={(item.isSelected) ? styles.selectedButtonBackground :styles.unSelectedButtonBackground}
                          onPress={() => {
                            store.loadProductSubCategories(item.id)
                            var x = store.resetCategory;
                            store.productCategories = x;
                            
                            setTimeout(() => {
                              var temp = item.isSelected;
                              item.isSelected = !temp;
                              if(item.isSelected) 
                                store.selectedCategory = item;
                              else
                                store.selectedCategory = null;
                            },100)

                            for(var i=0;i<store.productCategories.length;i++) {
                              if(i != index) {
                                store.productCategories[i].isSelected = false
                              }
                            }
                          }}
                        >
                          <Text style={(item.isSelected) ? styles.selectedText :styles.unSelectedText}>{item.name}</Text>
                        </TouchableOpacity>
                      })
                      : null
                    }
                  </View>
                }
              </CollapsableContainer>
            </View>

            <View style={[styles.bgButtonStyle,{ width:windowWidth/ 2.7}]}>
              <CollapsableContainer 
                from_filter={true}
                index={1}
                status={this.state.isSubCategoryOpen}
                onPress={() => {
                  if(store.selectedCategory == null || Object.keys(store.selectedCategory).length == 0){
                    alert('Please select category first.')
                  } else {
                    this.setState({isCategoryOpen: false, isSubCategoryOpen: !this.state.isSubCategoryOpen, isBrandOpen: false})
                  }
                }}
                collapseableBackgroundStyle={[styles.bgBackgroundStyle,{ width:windowWidth/ 2.7}]}
                collapseableContainerStyle={styles.widthStyle}
                collapseableTextStyle={styles.bgTextStyle}
                collapseableStyle={styles.bgMainStyle}
                label="Sub Category" noPadding>
                {
                  <View style={[styles.bgInsideStyle,{padding:10}]}>
                    {(store.productSubCategories && store.productSubCategories.length > 0)?
                      store.productSubCategories.map((item, index) => {
                        return <TouchableOpacity
                          style={(item.isSelected) ? styles.selectedButtonBackground :styles.unSelectedButtonBackground}
                          onPress={() => {
                            // store.loadBrand(item.id)
                            var x = store.resetSubCategory;
                            store.productSubCategories = x;
                            
                            setTimeout(() => {
                              var temp = item.isSelected;
                              item.isSelected = !temp;
                              if(item.isSelected) 
                                store.selectedSubCategory = item;
                              else
                                store.selectedSubCategory = null;
                            },100)

                            for(var i=0;i<store.productSubCategories.length;i++) {
                              if(i != index) {
                                store.productSubCategories[i].isSelected = false
                              }
                            }
                          }}
                        >
                          <Text style={(item.isSelected) ? styles.selectedText :styles.unSelectedText}>{item.name}</Text>
                        </TouchableOpacity>
                      })
                      : 
                        <View style={styles.bgNoDataFound}>
                          <Text>No sub categories found.</Text>
                        </View>
                    }
                  </View>
                }
              </CollapsableContainer>
            </View>
            
            <View style={styles.bgButtonStyle}>
            <CollapsableContainer 
              from_filter={true} 
              collapseableBackgroundStyle={{
                  width:(windowWidth / 3.2), 
                  backgroundColor:COLORS.WHITE}}
              index={2}
              status={this.state.isBrandOpen}
              onPress={() => {this.setState({isCategoryOpen: false, isSubCategoryOpen: false, isBrandOpen: !this.state.isBrandOpen})}}
              collapseableContainerStyle={{width:(windowWidth / 3.2 )}}
              collapseableTextStyle={{
                color: COLORS.BLACK,
                fontSize: 16
              }}
              collapseableStyle={{
                flexDirection: "row",
                width:(windowWidth),
                flexWrap: "wrap",
                backgroundColor:COLORS.WHITE,
                zIndex:999999,
                position:'absolute'
              }}
              // collapseableBackgroundStyle={styles.bgBackgroundStyle}
              //   collapseableContainerStyle={styles.widthStyle}
              //   collapseableTextStyle={styles.bgTextStyle}
              //   collapseableStyle={styles.bgMainStyle}
              label="  Brand" noPadding>
              {
                <View style={{ flexDirection: "row", width:(windowWidth), flexWrap: "wrap", backgroundColor:COLORS.WHITE, marginLeft: (-(windowWidth)/3)*2}}>
                  {(store.brands && store.brands.length > 0) ?
                    store.brands.map((item, index) => {
                      
                      return <TouchableOpacity
                         style={(item.isSelected) ? styles.selectedButtonBackground :styles.unSelectedButtonBackground}
                          onPress={() => {
                            // alert("BRAND ==> "+JSON.stringify(store.brands))
                           
                            var x = store.resetBrand;
                            store.brands = x;
                            

                            setTimeout(() => {
                              // alert("SELECTED BRAND ==> "+JSON.stringify(item))
                              var temp = item.isSelected;
                              // alert("IS SELECTED ==> "+temp)
                              if(item.isSelected)
                              {
                                temp = false
                              }
                              else
                              {
                                temp = true
                              }
                              item.isSelected = temp;

                              if(item.isSelected) 
                                store.selectedBrands = item;
                              else
                                store.selectedBrands = null;
                            },100)

                            

                            for(var i=0;i<store.brands.length;i++) {
                              if(i != index) {
                                store.brands[i].isSelected = false
                              }
                            }
                          }}
                      >
                        <Text style={(item.isSelected) ? styles.selectedText :styles.unSelectedText}>{item.title}</Text>
                      </TouchableOpacity>
                    })
                  : null
                  }
                </View>
              }
            </CollapsableContainer>
          </View>
          </View>

          
          <View style={{position:'absolute', zIndex:-999999, height:windowHeight - 150, width:windowWidth, marginTop:90}}>
            <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', alignItems:"center",justifyContent:"space-between" }}>
           
               {
                (store.productListSelector.data.length > 0) ?
                 
                  store.productListSelector.data.map((item, index) => {
                    showLog("PRODUCT LIST SELECTOR DATA =>"+JSON.stringify(item))
                    
                        return (<CatalogResultItem key={item.key}
                          item={item}
                          navigator={this.props.navigator} />)
                       
                  })
               
                 : 
                  // (store.isApplyClicked)?
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
                  
                  // :
                  //   null

                 
                   
                 
                 }
            
           
          </ScrollView>
          </View>

        </View>
      );
    }

    return (
      <View style={{ paddingTop: 20, flex: 1, backgroundColor: COLORS.WHITE }}>
        <SlimHeader
          titleWidth={140}
          leftText='Back'
          onLeft={() => {
            this.props.navigator.dismissModal({ animationType: 'slide-down' });
          }}
          title='Product Tag'
          titleStyle={{ fontFamily: FONTS.SF_MEDIUM }}
          rightText="Apply"
          onRight={ ()=>{
            store.productListSelector.data = []
            store.getProductsList(store.inputText)
            store.isApplyClicked = true;
                this.setState({isCategoryOpen: false, isSubCategoryOpen: false, isBrandOpen: false})
          }}
          
           />

        <View style={{ flex: 1, backgroundColor: COLORS.COLLAPSABLE_COLOR }}>
          {content}
        </View>

        <LoadingScreen store={store} />

      </View>
    );
  }

  componentDidMount() {
    let store = ProductTagStore;
    store.loadProductCategories();
    store.loadProductBrands();
  }
}  


const styles = StyleSheet.create({
  unSelectedText: {
    margin: 10,
    alignSelf: 'center',
  },
  unSelectedButtonBackground: {
    borderColor: COLORS.LIGHT_GRAY1,
    borderRadius: 2,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    alignContent: "center",
    alignItems: 'center',
    margin: 5,
  },
  selectedText: {
    margin: 10,
    alignSelf: 'center',
    color: COLORS.WHITE
  },
  selectedButtonBackground: {
    borderColor: COLORS.LIGHT_GRAY1,
    borderRadius: 2,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    alignContent: "center",
    alignItems: 'center',
    margin: 5,
    backgroundColor: COLORS.LIGHT_GRAY1
  },
  bgButtonStyle: {
    width: windowWidth / 3.2,
    // backgroundColor:"red"
  },
  bgBackgroundStyle: {
    width: windowWidth / 3.2,
    backgroundColor: COLORS.WHITE,
    // justifyContent: 'flex-start'
  },
  widthStyle: { width: windowWidth },
  bgTextStyle: {
    color: COLORS.BLACK,
    fontSize: 16
  },
  bgMainStyle: {
    flexDirection: "row",
    width: (windowWidth),
    flexWrap: "wrap",
    backgroundColor: COLORS.WHITE,
    zIndex: 999999,
    position: 'absolute'
  },
  bgInsideStyle: { flexDirection: "row", width: (windowWidth), flexWrap: "wrap", position: 'absolute', zIndex: 999999, backgroundColor: COLORS.WHITE, marginLeft: (-(windowWidth) / 3) },
  bgNoDataFound:{justifyContent:'center', flex:1, alignItems:'center', padding:15}
});