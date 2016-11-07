import {observable, computed, action} from 'mobx';
import {_, v4, Text} from 'hairfolio/src/helpers';

export default class ServiceTag {
  constructor(x, y, {service_id, service_name, brand_name, line_name,  line_id, post_item_tag_colors, developer_volume, developer_amount, developer_time, unit}) {
    this.x = x;
    this.y = y;
    this.key = v4();
    this.abbrev = 'S';
    this.imageSource = require('img/post_service_tag.png');
    this.service_id = service_id;
    this.serviceName = service_name;
    this.brandName = brand_name;
    this.lineName = line_name;
    this.developerTime = developer_time;
    this.developerAmount = developer_amount;
    this.developerVolume = developer_volume;
    this.unit = unit;

    this.line_id = line_id;
    this.colors = post_item_tag_colors ? post_item_tag_colors : [];
    this.type = 'service';
  }

  toJSON() {

    let colorData = [];

    for (let el of this.colors) {
      colorData.push({
        id: el.id,
        amount: el.amount
      });
    }

    let developerData = null;

    return _.pickBy({
      type: this.type,
      top: this.y,
      left: this.x,
      service_id: this.service_id,
      line_id: this.line_id,
      post_item_tag_colors: colorData,
      developer: {
        time: this.developerTime,
        volume: this.developerVolume,
        amount: this.developerAmount
      }
    });
  }

}

