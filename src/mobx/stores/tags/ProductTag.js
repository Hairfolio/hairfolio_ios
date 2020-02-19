import { v4, _, showLog, observable } from "../../../helpers";

export default class ProductTag {
  @observable x;
  @observable y;
  @observable key;
  @observable abbrev;
  @observable imageSource;
  @observable type;
  @observable id;
  @observable new_prod_id; 
  @observable name;
  @observable price;
  @observable cloudinary_url;
  @observable product_image;
  @observable product_thumb;
  @observable uniqueCode;
  @observable final_price;
  @observable discount_percentage;
  @observable _destroy;
  @observable isLocallyAdded = undefined;

  constructor(x, y, obj) {
    showLog("ProductTag file==>" + JSON.stringify(obj));


    let { id, name, price, cloudinary_url, product_thumb, product_image, uniqueCode,final_price,discount_percentage, isLocallyAdded } = obj;

    this.x = x;
    this.y = y;
    this.key = v4();
    this.abbrev = "P";
    this.imageSource = require("img/post_service_tag.png");
    this.type = "producttag";
    this.id = id;
    this.new_prod_id = id; 
    this.name = name;
    this.price = price;
    this.cloudinary_url = cloudinary_url;
    this.product_image = product_image;
    this.product_thumb = product_thumb;
    this.uniqueCode = uniqueCode;
    this.final_price = final_price;
    this.discount_percentage = discount_percentage;
    this._destroy = false;
    this.isLocallyAdded = isLocallyAdded;
  }

  async toJSON(upload) {
    let productTagData = [];

    let data = {
      position_top: Math.floor(this.y),
      position_left: Math.floor(this.x),
      product_id: this.id
    };

    if(this._destroy) {
      data.id = this.id,
      data._destroy = this._destroy
    }
    return _.pickBy(data);
  }
}
