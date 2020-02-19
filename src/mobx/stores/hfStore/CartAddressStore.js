import { observable } from "mobx";
import ServiceBackend from "../../../backend/ServiceBackend";
import { ENDPOINT } from "../../../constants";
import { showAlert } from "../../../helpers";
import validator from 'validator';


class CartAddressStore {
  @observable isLoading = false;
  @observable addresses = [];
  @observable email = "";
  @observable first_name = "";
  @observable last_name = "";
  @observable phone = "";
  @observable city = "";
  @observable landmark = "";
  @observable zip_code = "";
  // @observable default_address = "true";
  @observable user_address = "";
  @observable default_address = null;
  @observable updateAddress = false;

 
  constructor() {
  }

  async getAddress(){
   

    this.isLoading = true;
    let res = await ServiceBackend.get(ENDPOINT.get_Address)
     this.isLoading = false;
    if(res){

      if(res.addresses.length > 0)
      {
      for(var i=0;i<res.addresses.length;i++)
      {
        if(res.addresses[i].default_address == true)
        {
          this.default_address = res.addresses[i];
          this.addresses.push(res.addresses[i])
        }
      }
     }
    }
  }

  async addAddress(post_data) {
    
    this.isLoading = true;

    let res = await ServiceBackend.post(ENDPOINT.add_Address,post_data)
    if(res)
    {
      this.isLoading = false
      if(res)
      {
        if(res.address)
        {
          this.addresses = res.address
          this.default_address = res.address
        }
      }
    }
  }

 checkValidation(post_data){

    return new Promise((resolve,reject)=>{

      if(post_data.first_name.trim() == "")
      {
        showAlert("Please enter first name")
        resolve(false);
      }
      else if(post_data.last_name.trim() == "")
      {
        showAlert("Please enter last name")
        resolve(false);
      }
      else if(!validator.isEmail(post_data.email))
      {
        showAlert("Please enter valid email")
        resolve(false);
      }
      else if(post_data.phone.trim() == ""||post_data.phone.length<8)
      {
        showAlert("Please enter valid phone")
        resolve(false);
      }
      else if(post_data.user_address.trim() == "")
      {
        showAlert("Please enter user address")
        resolve(false);
      }
      // else if(post_data.landmark.trim() == "")
      // {
      //   showAlert("Please enter landmark")
      //   resolve(false);
      // }
      else if(post_data.city.trim() == "")
      {
        showAlert("Please enter city")
        resolve(false);
      }
      else if(post_data.zip_code.trim() == "" || post_data.zip_code.length<5)
      {
        showAlert("Please enter valid zipcode")
        resolve(false);
      }
      else
      {
        resolve(true);
      }
    })
  
  }

  async editAddress(post_data,address_Id,navigator) {
    
    this.isLoading = true;

    let res = await ServiceBackend.put(ENDPOINT.add_Address+address_Id,post_data)
    this.isLoading = false

      if(res)
      {
        if(res.address)
        {
          this.updateAddress = false
          this.addresses = res.address
          this.default_address = res.address
          navigator.pop({animated:true})
        }
      }

  }

}

const store = new CartAddressStore();

export default store;