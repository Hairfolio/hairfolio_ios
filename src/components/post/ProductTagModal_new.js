import { ActivityIndicator, autobind, Component, Dimensions, FONTS, h, Image, observer, React, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View, windowHeight, windowWidth } from 'Hairfolio/src/helpers';
import { Picker,ActionSheetIOS } from 'react-native';
import { COLORS, showLog } from '../../helpers';
import AddLinkStore from '../../mobx/stores/AddLinkStore';
import CreatePostStore from '../../mobx/stores/CreatePostStore';
import ProductTagStore from '../../mobx/stores/ProductTagStore';
import { SCALE } from '../../style';
import SlimHeader from '../SlimHeader';
import ServiceBackend from '../../backend/ServiceBackend';
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
                  opacity: selector.opacity
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
        width: (windowWidth / 2) - 20,
        height: (windowHeight / 2) - 90,
        backgroundColor:COLORS.WHITE,
        marginLeft:5,
        marginRight:5,
        marginTop:5,
      }}
      onPress={() => {
          CreatePostStore.gallery.addProductToPicture(
            CreatePostStore.gallery.position.x,
            CreatePostStore.gallery.position.y,
            item
          );
          ProductTagStore.isDone = true;
          // navigator.pop({ animated: true });
          navigator.dismissModal({ animationType: 'slide-down' });
          // ProductTagStore.isDone = true;

        }}
      >
      <View
        style={{
          borderRadius: 5,
          width: (windowWidth / 2) - 20,
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
          source={(item.cloudinary_url) ? { uri: item.cloudinary_url } : require('img/medium_placeholder_icon.png')}
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
      <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', width: windowWidth - 20 , alignItems:"center"}}>
        {selector.data.map((item, index) => {
          return (<CatalogResultItem key={item.key}
            item={item}
            navigator={navigator} />)
        })}
      </View>
    </ScrollView>
  )

  // return (
  //   <FlatList
  //     style={{height:windowHeight/1.32}}
  //     // data={catalog.items}
  //     data={selector.data}
  //     renderItem={({item}) => <CatalogResultItem key={item.key} 
  //                                                item={item} 
  //                                                navigator={navigator} /> }
  //     enableEmptySection={true}                                           
  //     onEndReached={() => {
  //       catalog.loadNextPage();
  //     }}

  //     ListFooterComponent={() => {
  //       if (catalog.nextPage != null) {
  //         return (
  //           <View
  //             style={{
  //               height: h(172),
  //               alignItems: 'center',
  //               justifyContent: 'center'
  //             }}>
  //             <ActivityIndicator size='large' />
  //           </View>
  //         );
  //       } else {
  //         return <View />;
  //       }
  //     }}
  //   />
  // );

});


@observer
@autobind
export default class ProductTagModal extends Component {

  constructor(props) {
    super(props);
    this.state ={
      categories:[],
      display_categories:[],
      sub_categories:[],
      display_subcategories:[],
      list_product:null,
      loading:false

    };

    setTimeout( ()=>{
      this.getProductCategories()
    },1000)
    
  }

  async getProductCategories() {
    this.setState({ loading: true});
    let res = await ServiceBackend.get(`categories`);
    let { categories } = res;
    if (categories) {
      res = categories;
      let temp = ['Cancel'];
      for(let i=0; i<res.length; i++){
        temp.push(res[i].name);
      }
      showLog("getProductCategories ==>"+JSON.stringify(categories));
      this.setState({ categories : res, display_categories: temp});
      this.setState({ loading: false});

    } else {
      throw res.errors;
    }
  }

  async getProductSubCategories(categoryId) {
      this.setState({ loading: true});
    let res = await ServiceBackend.get(`categories/${categoryId}`);
    let { category } = res;
    if (category) {
      res = category.sub_categories;

      let temp = ['Cancel'];
      for(let i=0; i<res.length; i++){
        temp.push(res[i].name);
      }
      showLog("getProductSubCategories ==>"+JSON.stringify(res));
      this.setState({ sub_categories : res, display_subcategories:temp})
      this.setState({ loading: false});
    } else {
      throw res.errors;
    }
  }

  async getProducts(subcategoryId) {

    this.setState({ loading: true});

    let res = await ServiceBackend.get(`categories/${subcategoryId}`);
    let { category } = res;
    if (category) {
      res = category;
      let { products } = res;
      res = products;

      showLog("getProducts ==>"+JSON.stringify(products));
      this.setState({ loading: false});
      this.setState({ list_product: products })
    } else {
      throw res.errors;
    }
  }

  openActionsheet(){
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: this.state.display_categories, //['Cancel', 'Remove'],
        // destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {

        var arr_cat = this.state.categories;
        showLog("openActionsheet ==>"+JSON.stringify(arr_cat[buttonIndex - 1]));
        
        var current_cat = arr_cat[buttonIndex - 1];
        this.getProductSubCategories(current_cat.id);
        
        if (buttonIndex === 1) {
          /* destructive action */
        }
      },
    );
  }

  openActionsheet2(){
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: this.state.display_subcategories, //['Cancel', 'Remove'],
        // destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {

        var arr_sub_cat = this.state.sub_categories;
        showLog("openActionsheet2 ==>"+JSON.stringify(arr_sub_cat[buttonIndex - 1]));
        
        var current_sub_cat = arr_sub_cat[buttonIndex - 1];
        this.getProducts(current_sub_cat.id);

        if (buttonIndex === 1) {
          /* destructive action */
        }
      },
    );
  }

  render(){
    let store = ProductTagStore;
    let content = <View />;

    if (!store.isLoading) {
      let canGo = ProductTagStore.canGoNext
      content = (
        <View style={{ flexDirection:"row", width:windowWidth, justifyContent:"space-around" }}>
            <TouchableOpacity onPress={()=>{ this.openActionsheet() }} style={{width:(windowWidth / 2) - 10, backgroundColor:"#FFF", padding: 10, alignItems:"center", flexDirection:"row", justifyContent:"space-around"}}>
              <Text style={{ fontFamily:FONTS.ROMAN, color:COLORS.DARK, fontSize:16}}>Category</Text>
              <Image
                    style={{ width: 15, height: 10, marginLeft:5}}
                    source={require('img/expand_button.png')}/>
            </TouchableOpacity>
            <TouchableOpacity 
            disabled={(this.state.display_subcategories.length > 0) ? false : true }
            onPress={()=>{ this.openActionsheet2() }} 
            style={{width:(windowWidth / 2) - 10, backgroundColor:"#FFF", padding: 10, alignItems:"center",  flexDirection:"row", justifyContent:"space-around"}}>
              <Text style={{ fontFamily:FONTS.ROMAN, color:COLORS.DARK, fontSize:16}}>Sub Category</Text>
              <Image
                    style={{ width: 15, height: 10, marginLeft:5}}
                    source={require('img/expand_button.png')}/>
            </TouchableOpacity>
          </View>
      );
    }

    return(
      <View style={{ paddingTop: 20, flex: 1, backgroundColor: COLORS.WHITE }}>

        <SlimHeader
          titleWidth={140}
          leftText='Back'
          onLeft={() => {
            this.props.navigator.dismissModal({ animationType: 'slide-down' });
          }}
          title='Product Tag'
          titleStyle={{ fontFamily: FONTS.SF_MEDIUM }} />


          {
            (this.state.loading) 
            ?
            <View style={{ flex: 1, justifyContent:"center" , alignItems:"center"}}>
            <ActivityIndicator size="large" />
          </View>
          :
          <View style={{ flex: 1, backgroundColor: COLORS.COLLAPSABLE_COLOR }}>
          {content}
          <View>          
          {
            (this.state.list_product)
              ?
              (this.state.list_product.length > 0)
                ?
                <View>
                  <ScrollView>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems:"center", justifyContent:"center",  alignSelf:"center" }}>
                      {this.state.list_product.map((item, index) => {
                        return (<CatalogResultItem key={item.key}
                          item={item}
                          navigator={this.props.navigator} />)
                      })}
                    </View>
                  </ScrollView>
                  </View>
                :
                <Text> No product found </Text>
              : null
          }
          </View>

        </View>
          }
          

          

      </View>
    )
  }

  
}  