import {observable, computed, action} from 'mobx';
import {_, v4, Text} from 'hairfolio/src/helpers';

export default class ServiceTag {
  constructor(x, y, obj) {

    let {service_id, service_name, brand_name, line_name,  line_id, post_item_tag_colors, developer_volume, developer_amount, developer_time, unit} = obj;

    if (obj.treatments) {
      // backend creation

      this.x = x;
      this.y = y;
      this.key = v4();
      this.abbrev = 'S';
      this.imageSource = require('img/post_service_tag.png');


      this.service_id = obj.service.id;
      this.serviceName = obj.service.name;
      this.brandName = obj.line.brand.name;
      this.lineName = obj.line.name;
      this.developerTime = obj.time;
      this.developerAmount = obj.weight;
      this.developerVolume = obj.volume;
      this.unit = obj.line.unit;

      this.line_id = obj.line.id;
      this.colors = obj.treatments;
      this.type = 'service';

    } else {
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


  }

  async toJSON(upload) {

    let colorData = [];

    for (let el of this.colors) {

      let amount = el.amount;


      if (el.amountSelector2) {
        amount = parseInt(el.amountSelector2.selectedValue.split(' ')[0], 10);
      }

      let colorId = el.id ? el.id : el.color.id;

      colorData.push({
        color_id: colorId,
        weight: amount
      });
    }

    let data = {
      // type: this.type,
      position_top: Math.floor(this.y),
      position_left: Math.floor(this.x),
      formulas_attributes: [
        {
          service_id: this.service_id,
          line_id: this.line_id,
          time: this.developerTime,
          volume: this.developerVolume,
          weight: this.developerAmount,
          treatments_attributes: colorData
        },
      ]
    }

    return _.pickBy(data);
  }

}

