import {observable, computed, action} from 'mobx';
import {_, v4, Text} from 'hairfolio/src/helpers';

export default class ServiceTag {
  constructor(x, y, {service_id, line_id, colors, developer}) {
    this.x = x;
    this.y = y;
    this.key = v4();
    this.abbrev = 'S';
    this.imageSource = require('img/post_service_tag.png');
    this.service_id = service_id;
    this.line_id = line_id;
    this.colors = colors ? colors : [];
    this.developer = developer;
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

    if (this.developer) {
      developerData = {
        volume: parseInt(this.developer.volume.split(' ')[0], 10),
        amount: parseInt(this.developer.amount.split(' ')[0], 10),
        time: parseInt(this.developer.time.split(' ')[0], 10)
      };
    }

    return _.pickBy({
      type: 'service',
      service_id: this.service_id,
      line_id: this.line_id,
      colors: colorData,
      developer: developerData
    });
  }

}

