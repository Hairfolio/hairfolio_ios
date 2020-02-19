
import { convertFraction, ozConv, _ } from 'Hairfolio/src/helpers';
import { action, computed, observable } from 'mobx';
import {ListView} from 'react-native';
import { v4 } from 'uuid';
import ServiceBackend from '../../backend/ServiceBackend';
import AllProductsStore from '../stores/hfStore/AllProductStore';
import { showAlert, showLog } from '../../helpers';
import { PER_PAGE } from '../../constants';

class SimpleSelector {
  @observable data = [];
  @observable selectedValue;

  constructor(data, selectedValue) {
    this.data = data;
    this.selectedValue = selectedValue;
  }
}

class SelectorData {
  constructor({ name, id, unit, brand_count }) {
    this.name = name;
    this.id = id;
    this.unit = unit;
    this.brandCount = brand_count;
  }
}

class ProductSelectorData {
  constructor({ name, id, unit, product_image ,cloudinary_url, price,final_price,discount_percentage,  }) {
    this.name = name;
    this.id = id;
    this.unit = unit;
    this.cloudinary_url = cloudinary_url;
    this.product_image = product_image;
    this.price = price;
    this.final_price = final_price;
    this.discount_percentage = discount_percentage;
  }
}

class Selector {

  @observable isEnabled;
  @observable isOpen;
  @observable data;
  @observable title;
  @observable value;
  @observable isLoaded;
  @observable isHidden;


  constructor(parent, data, value, isEnabled, title) {
    this.parent = parent;
    this.title = title ? title : value;
    this.oldValue = value;
    this.value = value;
    this.isOpen = false;
    this.data = data;
    this.isEnabled = isEnabled;
    this.isLoaded = false;
    this.isHidden = !isEnabled;
    this.isLoading = false;
  }

  reset() {
    this.value = this.title;
    this.isLoaded = false;
  }

  shouldLoad() {
    return !this.isLoading && !this.isLoaded;
  }

  @action closeAfterError() {
    this.isOpen = false;
    this.isLoading = false;
    this.isLoaded = false;
    // Alert.alert('Error', 'The data could not be loaded. Please check your internet connection');
  }

  @action hide() {
    this.isHidden = true;
  }

  @action show() {
    this.isHidden = false;
  }

  @action setData(data, isProductData = false) {
    if (isProductData) {
      // this.data = data.map(el => new ProductSelectorData(el));
      data.map(el => {
        this.data.push(new ProductSelectorData(el))
      })
    } else {
      this.data = data.map(el => new SelectorData(el));
    }
    this.isLoaded = true;
    if (this.isOpen && this.value == this.title && data.length > 0) {
      this.setValue(this.data[~~(this.data.length / 2)].name);
    }
  }

  @computed get selectedData() {
    if (this.data) {
      let res = this.data.filter(({ name }) => name == this.value);
      if (res.length == 0) {
        return null;
      } else {
        return res[0];
      }

    }
    return null;
  }

  @action setValue(val) {
    this.value = val;
    this.parent.selectorValueChanged(this);
  }


  @computed get arrowImage() {
    if (this.isOpen) {
      return require('img/post_arrow_up.png');
    } else {
      return require('img/post_arrow_down.png');
    }
  }

  @computed get opacity() {
    if (this.isEnabled) {
      return 1;
    } else {
      return 0.5;
    }
  }

  @computed get hasValue() {
    return this.title != this.value;
  }

  @action open() {
    this.parent.openSelector(this);
  }

  @action close() {
    this.parent.confirmSelector(this);
  }

  @action openPageThree() {
    this.parent.openSelectorPageThree(this);
  }

}



let getPossibleValues = (unit, space = true) => {

  let ozValue;

  if (space) {
    if (unit == 'g') {
      return _.times(500, (n) => `${n + 1} ${unit}`);
    } else {
      return _.times(8 * 8, (n) => `${ozConv(n + 1)} ${unit}`);
    }
  } else if (unit == 'g') {
    return _.times(500, (n) => `${n + 1}${unit}`);
  } else {
    return _.times(8 * 8, (n) => `${ozConv(n + 1)}/8${unit}`);
  }
}

class ColorField {
  @observable name;
  @observable color;
  @observable isSelected;
  @observable amount;

  @observable amountSelector;
  @observable isBlank;

  constructor({ id, code, hex, amount, start_hex, end_hex, blank }, unit, mainStore, isSelected = false) {

    this.isBlank = blank;


    this.name = code;

    if (this.name && this.name.startsWith('0')) {
      this.name = this.name.substr(1);
    }

    this.color = `#${hex}`;
    this.id = id;

    this.startColor = start_hex ? `#${start_hex}` : null;
    this.endColor = end_hex ? `#${end_hex}` : null;

    this.key = v4();
    this.isSelected = false;
    this.mainStore = mainStore;
    this.isSelected = isSelected;
    this.amount = amount ? amount : 1;

    let data = [];

    this.amountSelector2 = new SimpleSelector(
      getPossibleValues(unit, true),
      getPossibleValues(unit, true)[((amount - 1) ? (amount - 1) : 0)]
    );

    this.amountSelector = new Selector(
      mainStore,
      getPossibleValues(unit, false)[((amount - 1) ? (amount - 1) : 0)],
      getPossibleValues(unit, false),
      true,
      'Amount'
    );

    this.unit = unit;
  }

  @computed get borderStyle() {
    if (this.color == 'white') {
      return {
        borderWidth: 1 / 2,
        borderColor: 'black'
      };
    }
    return {};
  }

  @computed get textColor() {
    if (this.color == 'white') {
      return 'black';
    }
    return 'white';
  }

  @computed get borderColor() {
    if (this.isSelected) {
      return '#3E3E3E';
    } else {
      return 'white';
    }
  }

  @computed get gradientColors() {
    if (this.startColor && this.endColor) {
      return [this.startColor, this.endColor];
    }

    return [this.color, this.color];
  }

  @computed get borderWidth() {
    if (this.isSelected) {
      return 3;
    } else {
      return 1;
    }
  }

  @computed get canSelect() {
    return !this.isBlank && this.mainStore.selectedColors.length < 4;
  }

  @action select() {
    this.isSelected = true;
  }

  toJSON() {

    let amount = convertFraction(this.unit, this.amountSelector2.selectedValue);

    return {
      amount: amount,
      weight: amount,
      color: {
        code: this.name,
        end_hex: this.endColor.substr(1),
        id: this.id,
        start_hex: this.startColor.substr(1),
      }
    };
  }

}

class ColorGrid {
  @observable colors;

  constructor(parent) {
    this.parent = parent;
    this.colors = [];
  }

  @action setColors(data, unit) {
    // data[0].colors[1].start_hex = 'ff0000';
    // data[0].colors[1].end_hex = '0000ff';
    this.colors = data.map(({ colors }) => colors.map(d => new ColorField(d, unit, this.parent, d.isSelected == true)));
  }
}


class ProductTagStore {

  @observable productCategoriesSelector = new Selector(
    this,
    'Category',
    [],
    false
  );

  @observable productSubCategoriesSelector = new Selector(
    this,
    'Sub Category',
    _.times(5, (num) => 'Brand ' + num),
    false
  );


  @observable productListSelector = new Selector(
    this,
    'Products',
    _.times(5, (num) => 'Color name ' + num),
    false
  );

  @observable colorGrid;
  @observable isLoading;
  @observable isDone;
  @observable productCategories = null;
  @observable headerProductMenu = null;
  @observable sidebarProductMenu = null;
  @observable selectedCategory = {};
  @observable productSubCategories = null;
  @observable selectedSubCategory = {};
  @observable brands = null;
  @observable selectedBrands = {};
  @observable productsList = null;
  @observable mode = 'normal';
  @observable inputText = '';
  @observable lastSearchedText = '';
  @observable resetSubCategory = null;
  @observable resetBrand = null;
  @observable minPrice = 0;
  @observable maxPrice = 400;
  @observable isApplyClicked = false;
  @observable isNewArrival = null;
  @observable isTrending = null;
  @observable sale_id = null;

  @observable specialColor = new ColorField('white', 'VL', this)
  @observable selectedMinutes = '30 min';
  @observable nextPage;
  @observable products;
  @observable isChanged = "n";

  minData = _.times(100, (n) => `${n + 1} min`);

  @observable vlSelector = new SimpleSelector(
    _.times(12, (n) => `${5 * (n + 1)} VL`),
    '20 VL'
  );

  @observable vlWeightSelector = new SimpleSelector(
    _.times(501, (n) => `${n} g`),
    '0 g'
  );


  constructor() {
    this.colorGrid = new ColorGrid(this);
    this.mode = 'normal';
    this.productCategories = [];
    this.headerProductMenu = [];
    this.sidebarProductMenu = [];
    this.headerResetMenu = [];
    this.sidebarResetMenu = [];
    this.productSubCategories = [];
    this.brands = [];
    this.resetCategory = [];
    this.resetSubCategory = [];
    this.resetBrand = [];
    this.productsList = [];
    this.isLoadingNextPage = false;
    this.products = [];
  }

  async loadLines() {
    let brandID = this.productSubCategoriesSelector.selectedData.id;
    this.productListSelector.isLoading = true;

  }

  async getProductCategories() {
    this.productCategories=[];
  
    let res = await ServiceBackend.get(`categories`);
    let { categories } = res;
    if (categories) {
      res = categories;
    } else {
      throw res.errors;
    }
    return res;
  }

  async getProductMenu() {
    this.headerProductMenu=[];
    this.sidebarProductMenu=[];
    this.headerResetMenu = [];
    this.sidebarResetMenu = [];
    let res = await ServiceBackend.get(`menu`);
    return res;
  }

  async load(search, isFromFilter=false, minValue='', maxValue='', isFromClear=false) {
    this.isLoading = true;
    this.productListSelector.setData([]);
    this.products = [];
    this.nextPage = 1;

    showLog("LOADPRODUCT TAG STORE ==> " + this.isLoadingNextPage + " => " + this.nextPage )

    await this.loadNextPageNew(search, isFromFilter, minValue, maxValue, isFromClear);
    
    this.isLoading = false;
  }

  @computed get dataSourceForFilter() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    // alert(this.products.length)
    return ds.cloneWithRows(this.products.slice());
  }

  @computed get dataSourceProductSelector() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return ds.cloneWithRows(this.productListSelector.data.slice());
    
    // const ds = new ListView.DataSource({
    //   rowHasChanged: (r1, r2) => r1 !== r2
    // });
    // return ds.cloneWithRows(this.productListSelector.data.slice())
  }

  async loadNextPageNew(search, isFromFilter=false, minValue='', maxValue='', isFromClear=false) {
    if (!this.isLoadingNextPage && this.nextPage != null) {
      this.isLoadingNextPage = true;           
      let res = await this.getProductsList(search, isFromFilter, minValue, maxValue, isFromClear, this.nextPage);     
      if(res){
        this.isLoading = false;     
        let products = res.products;
        let meta = res.meta;
        this.nextPage = meta.next_page;
        if (products) {
          // res = products;        
          if (products.length > 0) {
            for (let a = 0; a < products.length; a++)  {
              this.products.push(products[a]);
            }
            this.productListSelector.setData(products, true, true);
            this.productListSelector.show();
          } else {
            this.productListSelector.hide();
          }
          this.isLoadingNextPage = false;
          this.isLoading = false;
          return products;
        } else {
          this.isLoadingNextPage = false;
          this.isLoading = false;
          this.productListSelector.closeAfterError();
          throw res.errors;
        }    
      }
    }
  }

  async getProductsList(search="", isFromFilter=false, minValue='', maxValue='', isFromClear=false, pageNumber=1) {
    let arrSelectedIds = [];
    // this.isLoading = true
    
    let postData = {
      search:search,
      price_start: (isFromFilter) ? this.minPrice : "", 
      price_end: (isFromFilter) ? this.maxPrice : "",
      new_arrival: this.isNewArrival,
      is_trending: this.isTrending,
      sale: this.sale_id,
      limit: PER_PAGE,
      page: pageNumber
    };

    var x=[];
    for(var i=0 ; i<this.headerProductMenu.length; i++) {
      x=[];
      for(var j=0;j<this.headerProductMenu[i].data.length; j++) {
        if(this.headerProductMenu[i].data[j].isSelected && !isFromClear) {
          x.push(this.headerProductMenu[i].data[j].id)
        }
      }
      postData[this.headerProductMenu[i].type] = x;
    }

    for(var i=0 ; i<this.sidebarProductMenu.length; i++) {
      x=[];
      if(this.sidebarProductMenu[i].type == "more_filter") {
        let y = '';
        for(var j=0;j<this.sidebarProductMenu[i].data.length; j++) {
          if(!isFromClear && this.sidebarProductMenu[i].data[j].isSelected) {
            y = (this.sidebarProductMenu[i].data[j].isSelected)
            postData[this.sidebarProductMenu[i].data[j].type] = y;
          }
        }
      } else {
        for(var j=0;j<this.sidebarProductMenu[i].data.length; j++) {
          if(this.sidebarProductMenu[i].data[j].isSelected && !isFromClear) {
            x.push(this.sidebarProductMenu[i].data[j].id)
          }
        }
        postData[this.sidebarProductMenu[i].type] = x;
      }
    }

    showLog("postData PRODUCT VIEW ALL ==> " + JSON.stringify(postData))

    showLog("PRODUCT VIEW ALL BEFORE GET PROD LIST")

    let res = await ServiceBackend.post(`searches/filter_products`,postData);
    if (res) {
      return res;
    } else {
      return null;
    }
  }

  async loadProducts(search) {
    this.isLoading = true;
    let res = await this.getProductsList(search);
    
    this.productsList=[];
    if(res){
      try {
        for(var i=0;i<res.length;i++){
          this.productsList.push(res[i]);
        }
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        alert(JSON.stringify(err))
      }
    }
  }

  async getProductBrands() {
    this.brands=[];
    this.isLoading = true;
    let res = await ServiceBackend.get(`searches/product_brands`);
    this.isLoading = false;
    let { product_brands } = res;
    if (product_brands) {
      res = product_brands;
    } else {
      throw res.errors;
    }
    return res;
  }

  async getProductSubCategories(categoryId) {

    this.isLoading = true;

    let res = await ServiceBackend.get(`categories/${categoryId}`);
    this.isLoading = false;
    let { category } = res;
    if (category) {
      res = category.sub_categories;
    } else {
      throw res.errors;
    }
    return res;
  }


  async loadProductSubCategories(id) {
    this.isLoading = true;
    let res = await this.getProductSubCategories(id);
    this.productSubCategories = [];
    if(res){
      try {
        for(var i=0;i<res.length;i++){
          res[i].isSelected = false;
          this.productSubCategories.push(res[i]);
        }
        this.resetSubCategory = this.productSubCategories;
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        alert(JSON.stringify(err))
      }
    }
  }

  async loadProductCategories() {
    this.isLoading = true;
    let res = await this.getProductCategories();
    this.productCategories=[];
    if(res){
      try {
        for(var i=0;i<res.length;i++){
          res[i].isSelected = false;
          this.productCategories.push(res[i]);
        }
        this.resetCategory = this.productCategories;
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        alert(JSON.stringify(err))
      }
    }
  }

  async loadMenu() {
    this.isLoading = true;
    let res = await this.getProductMenu();
    this.headerProductMenu = [];
    this.sidebarProductMenu = [];
    this.headerResetMenu = [];
    this.sidebarResetMenu = [];
    if(res){
      try {
        for(key in res) {
          for(var i=0; i<res[key].length; i++) {
            for(var j=0; j<res[key][i].data.length; j++) {
              res[key][i].data[j].isSelected = false;
            }
          }
        } 
        res.header = res.header.filter((value, pos) => value.type !== 'new_arrivals');
        res.header = res.header.filter((value, pos) => value.type !== 'top_sellers');

        res.side_bar = res.side_bar.filter((value, pos) => value.type !== 'styling_tools');

        res.side_bar.push({
          "type": "more_filter",
          "multiselect": true,
          "data": [
            {
              "type": "new_arrival",
              "multiselect": true,
              "name": "New Arrivals",
              "isSelected":false
            },
            {
              "type": "is_trending",
              "multiselect": true,
              "name": "Top Sellers",
              "isSelected":false
            },
          ],
          "name": "More Filter"
        });

        this.headerProductMenu = res.header;
        this.sidebarProductMenu = res.side_bar;

        this.headerResetMenu = res.header;
        this.sidebarResetMenu = res.side_bar;

        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        alert(JSON.stringify(err))
      }
    }
  }

  async loadProductBrands() {
    this.isLoading = true;
    let res = await this.getProductBrands();
    this.brands=[];
    if(res){
      try {
        for(var i=0;i<res.length;i++){
          res[i].isSelected = false;
          this.brands.push(res[i]);
        }
        this.resetBrand = this.brands;
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        alert(JSON.stringify(err))
      }
    }
  }

  async _init(productCategoriesStore) {
    this.isLoading = true;

    this.productCategoriesSelector = new Selector(
      this,
      [],
      // 'Service',
      'Category',
      true
    );

    this.productSubCategoriesSelector = new Selector(
      this,
      [],
      // 'Brand',
      'Sub Category',
      productCategoriesStore.brandName != null
    );


    this.productListSelector = new Selector(
      this,
      [],
      // 'Color name',
      'Sub Category',
      productCategoriesStore.lineName != null
    );


    let promises = await this.loadProductCategories();

    this.isLoading = false;

    this.initStore = productCategoriesStore;
  }

  init(productCategoriesStore) {
    this._init(productCategoriesStore);
  }

  reset() {
    this.isLoading = false;

    this.productCategoriesSelector = new Selector(
      this,
      [],
      // 'Service',
      'Category',
      true
    );

    this.loadProductCategories();

    this.productSubCategoriesSelector = new Selector(
      this,
      [],
      // 'Brand',
      'Sub Category',
      false
    );


    this.productListSelector = new Selector(
      this,
      [],
      // 'Color name',
      'Products',
      false
    );

    this.initStore = null;
  }

  @observable selector = this.productCategoriesSelector;


  @action openSelector(sel) {
    this.selector = sel;

    for (let s of [this.productCategoriesSelector, this.productSubCategoriesSelector, this.productListSelector]) {
      if (s != sel) {
        s.isOpen = false;
      } else {
        s.isOpen = true;

        if (s.isLoaded && s.value == s.title) {
          s.setValue(s.data[~~(s.data.length / 2)].name);
        }
      }
    }

    this.selector.isOpen = true;


    if (sel == this.productCategoriesSelector && this.productCategoriesSelector.shouldLoad) {
      this.loadProductCategories();
    }

    if (sel == this.productSubCategoriesSelector && this.productSubCategoriesSelector.shouldLoad) {
      this.loadProductSubCategories();
    }

    // if (sel == this.productListSelector && this.productListSelector.shouldLoad) {
    //   // this.loadLines();
    // }

    if (sel == this.productCategoriesSelector) {
      this.productSubCategoriesSelector.isEnabled = true;
    }

    if (sel == this.productSubCategoriesSelector) {
      this.productListSelector.isEnabled = true;
    }
  }


  getHeaderResetMenu() {
    return this.headerResetMenu;    
  }

  getSidebarResetMenu() {
    return this.sidebarResetMenu;
  }

  @action openSelectorPageThree(sel) {
    this.pageThreeSelector = sel;
    this.pageThreeSelector.isOpen = true;
  }

  @action cancelSelector() {
    this.selector.isOpen = false;
    this.selector.value = this.selector.oldValue;
  }

  @action async selectorValueChanged(selector) {

    if (selector == this.productCategoriesSelector) {
      let data = this.productCategoriesSelector.selectedData;

      this.productSubCategoriesSelector.reset();
      this.productListSelector.reset();

      let categoryId = this.productCategoriesSelector.selectedData.id;
      let res = await ServiceBackend.get(`categories/${categoryId}`);
      let { category } = res;
      if (category) {
        res = category;
        let { sub_categories } = res;
        res = sub_categories;
        if (res.length > 0) {
          this.productSubCategoriesSelector.setData(res);
          this.productSubCategoriesSelector.show();
          this.productListSelector.hide();
        } else {
          this.productSubCategoriesSelector.hide();
          this.productListSelector.hide();
        }
      } else {
        this.productSubCategoriesSelector.closeAfterError();
      }
    } else if (selector == this.productSubCategoriesSelector) {
      this.productListSelector.reset();
      this.productListSelector.isLoading = true;

      let subCategoryId = this.productSubCategoriesSelector.selectedData.id;
      let res = await ServiceBackend.get(`categories/${subCategoryId}`);
      let { category } = res;
      if (category) {
        res = category;
        let { products } = res;
        res = products;
        if (res.length > 0) {
          this.productListSelector.setData(res, true);
          this.productListSelector.show();
        } else {
          this.productListSelector.hide();
        }
      } else {
        this.productListSelector.closeAfterError();
      }
    }
  }

  @action confirmSelector() {
    this.selector.isOpen = false;
    this.selector.oldValue = this.selector.value;

    this.productSubCategoriesSelector.isEnabled = this.productCategoriesSelector.title != this.productCategoriesSelector.value;

    this.productListSelector.isEnabled = this.productSubCategoriesSelector.isEnabled && this.productSubCategoriesSelector.title != this.productSubCategoriesSelector.value;

  }

  @computed get pageThreePickerHeight() {
    if (this.pageThreeSelector && this.pageThreeSelector.isOpen) {
      return 200;
    } else {
      return 0;
    }
  }

  @action startSearchMode() {
    this.mode = 'search';
    this.inputText = '';
    setTimeout(() => store.input.focus(), 100);
  }

  @action cancelSearchMode() {
    this.mode = 'normal';
  }
}

const store = new ProductTagStore();

export default store;
