import { observable } from "Hairfolio/src/helpers";
import utils from "../../utils";
import EnvironmentStore from "./EnvironmentStore";
import Picture from "./Picture";
import { showLog } from "../../helpers";

class GetObj {
  constructor(obj) {
    this.data = obj;
  }

  get(index) {
    return this.data[index];
  }
}

export default class User {
  @observable profilePicture;
  @observable name;

  async init(data) {
    if (!data) {
      return;
    }

    this.id = data.id;

    if (data.account_type == "owner" || data.salon) {
      if(data.first_name) {
        this.name = data.first_name;
        if(data.last_name) {
          this.name = this.name + " " + data.last_name;
        }
      }
      else {
        if (data.salon_name) {
          this.name = data.salon_name;
        } else if (data.salon) {
          this.name = data.salon.name;
        } else {
          this.name = "????";
        }
      }
    } else if (data.account_type == "ambassador") {
      if (data.brand_name) {
        this.name = data.brand_name;
      } else if (data.brand) {
        this.name = data.brand.name;
      } else {
        this.name = "????";
      }
    } else {
      this.name = `${data.first_name} ${data.last_name}`;
    }

    let environment = await EnvironmentStore.loadEnv();
    let picObj = { uri: utils.getUserProfilePicURI(data, environment) };
    this.profilePicture = new Picture(picObj, picObj, null);
    this.pictureUrl = picObj;

  }

  sample(name = "First Last Name") {
    let picObj = require("img/feed_example_profile.png");
    this.profilePicture = new Picture(picObj, picObj, null);
    this.name = name;
  }
}
