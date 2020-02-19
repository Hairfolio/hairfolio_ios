import { action, computed, observable } from "mobx";
import { persist } from "mobx-persist";
import ServiceBackend from "../../backend/ServiceBackend";
import { EMPTY, LOADING, LOADING_ERROR, READY, ENDPOINT } from "../../constants";
import { showLog, _, AlertIOS, showAlert, Alert } from "../../helpers";
import hydrate from "./hydrate";
import firebase from "react-native-firebase";
import Backend from "../../backend/Backend";
import UsersStore from "./UsersStore";

let called =false;

class UserStore {
  @persist("object") @observable user;
  @persist @observable userState;
  @persist("map") @observable followingStates;
  @persist @observable changePasswordState;
  @persist @observable forgotPasswordState;
  @persist @observable registrationMethod;
  @observable needsMoreInfo = false;
  @observable sessionHasExpired;
  @observable fcmToken;
  @observable refferlCode = "";
  @observable opponentUser;
  @observable facebookToken=""

  constructor() {
    this.user = {
      educations: [],
      offerings: []
    };
    this.userState = EMPTY;
    this.followingStates = observable.map();
    this.changePasswordState = EMPTY;
    this.forgotPasswordState = EMPTY;
    this.registrationMethod = null;
    this.getFcmToken();
  }

  @computed get token() {
    return this.user.auth_token;
  }

  @action setNeedsMoreInfo(value) {
    this.needsMoreInfo = value;
  }

  @action setHasSessionExpired(value) {
    this.sessionHasExpired = value;
    this.user.auth_token = value ? null : this.user.auth_token;
    UserStore;
  }

  @action setHasSessionExpiredWithInsta(value) {
    this.sessionHasExpired = value;
    this.user.auth_token = value ? null : this.user.auth_token;
    UserStore;
  }

  @action setHasSessionExpiredRegister(value) {
    this.sessionHasExpired = value;
    this.user.auth_token = value ? null : this.user.auth_token;
    UserStore;
    
    setTimeout(()=>{
      Alert.alert(
        'Hairfolio',
        "Please register first.",
        [
          { text: "OK", onPress: () =>{}},         
        ],
        { cancelable: false }
      );
    },300);
    
  }

  @action loadUser(user) {
    this.user = null;
    this.user = user;
  }

  @action setMethod(method) {
    this.registrationMethod = method;
  }

  @action editUser(values = {}, type) {
    if (type == "brand") {
      this.user.account_type = "ambassador";
    } else if (type == "salon") {
      this.user.account_type = "owner";
    } else {
      this.user.account_type = type;
    }

    showLog("editUser ==>" + JSON.stringify(values));
    showLog("UserType ==>" + JSON.stringify(this.user.account_type));

    this.userState = LOADING;

    if (values.business) {
      if (type == "ambassador") {
        let brand = {};
        _.each(values.business, (v, key) => (brand[`${key}`] = v));
        delete values.business;
        values.brand_attributes = brand;

        // delete brand  attributes if they don't have a value
        if (values.brand_attributes) {
          if (!values.brand_attributes.name) {
            delete values.brand_attributes;
          }
        }
        // if (values.brand_attributes && (!values.brand_attributes.name || values.brand_attributes.name == '')) {
        //   delete values.brand_attributes;
        // }
      } else {
        let salon = {};
        _.each(values.business, (v, key) => (salon[`${key}`] = v));
        delete values.business;
        values.salon_attributes = salon;

        // delete salon attributes if they don't have a value
        if (values.salon_attributes) {
          if (!values.salon_attributes.name) {
            delete values.salon_attributes;
          }
        }
        // if (values.salon_attributes && (!values.salon_attributes.name || values.salon_attributes.name == '')) {
        //   delete values.salon_attributes;
        // }
      }
    }

    // if (values.experience_ids) {
    //   values.experience_ids = values.experience_ids;
    // } else {
    //   values.experience_ids = [];
    // }
    // if (values.certificate_ids) {
    //   values.certificate_ids = values.certificate_ids;
    // } else {
    //   values.certificate_ids = [];
    // }
    // if (values.business) {
    //   if (type == 'ambassador') {
    //     let brand = {};
    //     _.each(values.business, (v, key) => brand[`${key}`] = v);
    //     delete values.business;
    //     values.brand_attributes = brand;

    //     // delete brand  attributes if they don't have a value
    //     if (values.brand_attributes && (!values.brand_attributes.name || values.brand_attributes.name == '')) {
    //       delete values.brand_attributes;
    //     }
    //   } else {
    //     let salon = {};
    //     _.each(values.business, (v, key) => salon[`${key}`] = v);
    //     delete values.business;
    //     values.salon_attributes = salon;

    //     // delete salon attributes if they don't have a value
    //     if (values.salon_attributes && (!values.salon_attributes.name || values.salon_attributes.name == '')) {
    //       delete values.salon_attributes;
    //     }
    //   }
    // }
    // values['salon_attributes'] = values['business_salon_user_id'];
    // delete values['business_salon_user_id'];
    // if (values['salon_user_id'] === -1) {
    //   values['salon_user_id'] = null;
    // }
    if (_.isEmpty(values)) {
      this.userState = READY;
    } else {
      try {
        // alert(JSON.stringify(values));
        // var user = values;
        // showLog("USER121212=>"+JSON.stringify(values));
        // var body = _.pick(values, ['experience_ids', 'certificate_ids']);
        var body = { user: values };
        showLog("Userstore body ==>" + JSON.stringify(body));
        // if(!_.isEmpty(user)) {
        //   body.user = user;
        // }
        //ADD CODE FOR SALON ATTRIBUTE
        return ServiceBackend.put(`users/${this.user.id}`, body).then(res => {
          this.user = {
            ...this.user,
            ...res.user
          };
          this.userState = READY;
        });
      } catch (error) {
        this.userState = LOADING_ERROR;
        throw error;
      }
    }
  }

  @action editUserOLD(values = {}, type) {
    this.userState = LOADING;
    if (values.experience_ids) {
      values.experience_ids = values.experience_ids;
    } else {
      values.experience_ids = [];
    }
    if (values.certificate_ids) {
      values.certificate_ids = values.certificate_ids;
    } else {
      values.certificate_ids = [];
    }
    if (values.business) {
      if (type == "ambassador") {
        let brand = {};
        _.each(values.business, (v, key) => (brand[`${key}`] = v));
        delete values.business;
        values.brand_attributes = brand;

        // delete brand  attributes if they don't have a value
        if (values.brand_attributes) {
          if (!values.brand_attributes.name) {
            delete values.brand_attributes;
          }
        }
        // if (values.brand_attributes && (!values.brand_attributes.name || values.brand_attributes.name == '')) {
        //   delete values.brand_attributes;
        // }
      } else {
        let salon = {};
        _.each(values.business, (v, key) => (salon[`${key}`] = v));
        delete values.business;
        values.salon_attributes = salon;

        // delete salon attributes if they don't have a value
        if (values.salon_attributes) {
          if (!values.salon_attributes.name) {
            delete values.salon_attributes;
          }
        }
        // if (values.salon_attributes && (!values.salon_attributes.name || values.salon_attributes.name == '')) {
        //   delete values.salon_attributes;
        // }
      }
    }
    values["salon_user_id"] = values["business_salon_user_id"];
    delete values["business_salon_user_id"];
    if (values["salon_user_id"] === -1) {
      values["salon_user_id"] = null;
    }
    if (_.isEmpty(values)) {
      this.userState = READY;
    } else {
      try {
        var user = values;
        var body = _.pick(values, ["experience_ids", "certificate_ids"]);
        if (!_.isEmpty(user)) {
          body.user = user;
        }
        return ServiceBackend.patch(`users/${this.user.id}`, body).then(
          res => {
            this.user = {
              ...this.user,
              ...res.user
            };
            this.userState = READY;
          }
        );
      } catch (error) {
        this.userState = LOADING_ERROR;
        throw error;
      }
    }
  }

  @action editUserNew(values = {}, type) {
    this.userState = LOADING;
    // if (values.experience_ids) {
    //   values.experience_ids = values.experience_ids;
    // } else {
    //   values.experience_ids = [];
    // }
    // if (values.certificate_ids) {
    //   values.certificate_ids = values.certificate_ids;
    // } else {
    //   values.certificate_ids = [];
    // }
    // if (values.business) {
    //   if (type == 'ambassador') {
    //     let brand = {};
    //     _.each(values.business, (v, key) => brand[`${key}`] = v);
    //     delete values.business;
    //     values.brand_attributes = brand;

    //     // delete brand  attributes if they don't have a value
    //     if (values.brand_attributes && (!values.brand_attributes.name || values.brand_attributes.name == '')) {
    //       delete values.brand_attributes;
    //     }
    //   } else {
    //     let salon = {};
    //     _.each(values.business, (v, key) => salon[`${key}`] = v);
    //     delete values.business;
    //     values.salon_attributes = salon;

    //     // delete salon attributes if they don't have a value
    //     if (values.salon_attributes && (!values.salon_attributes.name || values.salon_attributes.name == '')) {
    //       delete values.salon_attributes;
    //     }
    //   }
    // }
    // values['salon_attributes'] = values['business_salon_user_id'];
    // delete values['business_salon_user_id'];
    // if (values['salon_user_id'] === -1) {
    //   values['salon_user_id'] = null;
    // }
    if (_.isEmpty(values)) {
      this.userState = READY;
    } else {
      try {
        // alert(JSON.stringify(values));
        // var user = values;
        // showLog("USER121212=>"+JSON.stringify(values));
        // var body = _.pick(values, ['experience_ids', 'certificate_ids']);
        var body = { user: values };
        showLog("BODY 106" + JSON.stringify(body));
        // if(!_.isEmpty(user)) {
        //   body.user = user;
        // }
        return ServiceBackend.put(`users/${this.user.id}`, body).then(res => {
          this.user = {
            ...this.user,
            ...res.user
          };
          this.userState = READY;
        });
      } catch (error) {
        this.userState = LOADING_ERROR;
        throw error;
      }
    }
  }

  @action logout() {
    ServiceBackend.logMeOut(`sessions/${this.user.auth_token}`);

    this.user = {
      auth_token: null,
      educations: [],
      offerings: []
    };
    this.userState = EMPTY;
    this.followingStates = observable.map();
  }

  @action setToken(val) {
    this.user.auth_token = val;
  }

  @action addOffering(offering) {
    this.user.offerings.push(offering);
  }

  @action editOffering(id, offering) {
    const index = this.user.offerings.indexOf(offering);
    if (index < 0) {
      this.user.offerings[index] = offering;
    }
  }

  @action deleteOffering(id) {
    let index = -1;
    this.user.offerings.forEach((offering, i) => {
      if (offering.id === id) {
        index = i;
      }
    });
    this.user.offerings.splice(index, 1);
  }

  @action async addEducation(education) {
    ServiceBackend.post(`users/${this.user.id}/educations`, {
      education: education
    })
      .then(response => {
        const newEducations = this.user.educations;
        newEducations.push(education);
        this.user.educations = newEducations;
      })
      .catch(error => {
        showLog(error);
        throw error;
      });
  }

  @action editEducation(id, education) {
    ServiceBackend.put(`users/${this.user.id}/educations/${id}`, {
      education: education
    })
      .then(response => {
        const newEducations = this.user.educations;
        const index = newEducations.indexOf(education);
        if (index < 0) {
          newEducations[index] = education;
        }
        this.user.educations = newEducations;
      })
      .catch(error => {
        showLog(error);
        throw error;
      });
  }

  @action deleteEducation(id) {
    let index = -1;
    ServiceBackend.delete(`users/${this.user.id}/educations/${id}`)
      .then(response => {
        const newEducations = this.user.educations;
        newEducations.forEach((education, i) => {
          if (education.id === id) {
            index = i;
          }
        });
        newEducations.splice(index, 1);
        this.user.educations = newEducations;
      })
      .catch(error => {
        showLog(error);
        throw error;
      });
  }

  @action async followUser(id) {
    this.followingStates.set(id, LOADING);
    let result = await ServiceBackend.post(`users/${id}/follows`);
    if(result){
      if(this.user && this.user.following) {
        this.user.following.push({ id });
        this.user.follow_count = result.followers_count;
        this.followingStates.set(id, READY);
      }
      let result2 = await ServiceBackend.get(`users/${id}`);
      if(result2){
        this.opponentUser = (result2.user) && result2.user;
        let a = (result2.user) ? result2.user : {};
        return a;
      } else {
        return;
      }
    } else {
      return ;
    }
    // ServiceBackend.post(`users/${id}/follows`, {
    //   user: { id }
    // })
    //   .then(async ({ followers_count }) => {
        
    //     this.user.following.push({ id });
    //     this.user.follow_count = followers_count;
    //     this.followingStates.set(id, READY);
    //     const res = await ServiceBackend.get(`users/${id}`);
    //     this.opponentUser =  (res.user) && res.user;;
    //     return (res.user.is_followed_by_me) ? res.user.is_followed_by_me : {"test" : 'false'};
    //   })
    //   .catch(error => {
    //     this.followingStates.set(id, LOADING_ERROR);
    //   });
  }

  @action async unfollowUser(id) {
    this.followingStates.set(id, LOADING);

    let result = await ServiceBackend.delete(`users/${id}/follows`);
    if(result){
      if(this.user && this.user.following) {
        this.user.following = this.user.following.filter(
          user => user.id !== id
        );
        this.user.follow_count = this.user.follow_count - 1;

        this.followingStates.set(id, READY);
      }
      let result2 = await ServiceBackend.get(`users/${id}`);
      if(result2){
        this.opponentUser = (result2.user) && result2.user;
        let a = (result2.user) ? result2.user : {};
        return a;
      } else {
        return;
      }
    } else {
      return ;
    }

    //  ServiceBackend.delete(`users/${id}/follows`)
    //   .then(async (response) => {
    //     this.user.following = this.user.following.filter(
    //       user => user.id !== id
    //     );
    //     this.user.follow_count = this.user.follow_count - 1;
    //     this.followingStates.set(id, READY);
    //     const res = await ServiceBackend.get(`users/${id}`);
    //     this.opponentUser = (res.user) && res.user;
    //     return (res.user.is_followed_by_me) ? res.user.is_followed_by_me : {"test" : 'false'};
    //   })
    //   .catch(error => {
    //     this.followingStates.set(id, LOADING_ERROR);
    //   });
  }

  async getUserEducations() {
    const response = await ServiceBackend.get(
      `users/${this.user.id}/educations`
    );
    return response.educations;
  }

  async getUserOfferings() {
    const response = await ServiceBackend.get(
      `users/${this.user.id}/offerings`
    );
    return response.offerings;
  }

  async getUserFollowing() {
    const response = await ServiceBackend.get(`users/${this.user.id}/follows`);
    return response.users;
  }

  @action async forgotPasswordNew(email) {
    try {
      this.forgotPasswordState = LOADING;
      /* const response = await ServiceBackend.post(
        'sessions/recover',
        { email }
      );
      this.forgotPasswordState = READY; */

      ServiceBackend.post("sessions/recover", { email })
        .then(res => {
          alert(JSON.stringify(res));
        })
        .catch(err => {});
    } catch (error) {
      this.forgotPasswordState = LOADING_ERROR;
    }
  }

  @action async forgotPassword(email) {
    try {
      this.forgotPasswordState = LOADING;
      const response = await ServiceBackend.post("sessions/recover", { email });
      this.forgotPasswordState = READY;
      return response;
    } catch (error) {
      this.forgotPasswordState = LOADING_ERROR;
      return error;
    }
  }

  @action async changePassword(value) {

    showLog("CHANGE PASSWORD ==> "+JSON.stringify(value))
    
    let newValue = {
      "current_password":value.old_password,
      "password":value.new_password,
      "password_confirmation":value.new_password_confirmation
    }
    showLog("NEW CHANGE PASSWORD ==> "+JSON.stringify(newValue))
    
    try {
      this.changePasswordState = LOADING;
      const response = await ServiceBackend.post(`change_password`,
        {
          user: newValue
        }
      );
      this.changePasswordState = READY;
    } catch (error) {
      this.changePasswordState = LOADING_ERROR;
    }
  }

  @action async changePassword_old(value) {
    try {
      this.changePasswordState = LOADING;
      const response = await ServiceBackend.post(
        `users/${this.user.id}/change_password`,
        {
          user: value
        }
      );
      this.changePasswordState = READY;
    } catch (error) {
      this.changePasswordState = LOADING_ERROR;
    }
  }

  loadUserInformation = async () => {
    const educations = await this.getUserEducations();
    const offerings = await this.getUserOfferings();
    const following = await this.getUserFollowing();
    this.user.following = following;
    this.user.educations = educations;
    this.user.offerings = offerings;
  };

  loadUserEducations = async () => {
    this.user.educations = await this.getUserEducations();
  };

  @action async loginWithFacebook(token) {
    // alert("Login with faceboook token"+token)
    this.userState = LOADING;
    try {
      const res = await ServiceBackend.post("sessions/facebook", {
        facebook_token: token,
        device_id: this.fcmToken
      });

      showLog("loginWithFacebook res ==>" + JSON.stringify(res));

      this.user = res.user;
      await this.loadUserInformation();
      this.userState = READY;
      
    } catch (error) {
      this.userState = LOADING_ERROR;
      throw error;
    }
  }

  @action async signupWithFacebookOld(token, type) {
    var post_data = {
      facebook_token: token,
      device_id: this.fcmToken
    };

    showLog("signupWithFacebook post_data ==>" + JSON.stringify(post_data));

    return new Promise((resolve, reject) => {
      fetch("http://api.hairfolio.tech/sessions/facebook", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: JSON.stringify(post_data)
      })
        .then(response => response.json())
        .then(responseJson => {
          showLog("signupWithFacebook res ==>" + JSON.stringify(responseJson));
          resolve(responseJson);
          // return responseJson;
        });
    });
  }

  getFcmToken() {
    firebase
      .messaging()
      .getToken()
      .then(
        fcmToken => {
          if (fcmToken) {
            showLog("GOT FCM TOKEN ==> "+fcmToken)
            this.fcmToken = fcmToken;
          } else {
            this.getFcmToken();
          }
        },
        error => {
          this.getFcmToken();
        }
      ).catch((e) => {
        showLog('inside catch fcm token ==>')
      });
  }

  @action showReferralCodeDialog(){

    return new Promise((resolve,reject)=>{

      AlertIOS.prompt(
        'Hairfolio',
        'Enter referral code',
        [
          {
            text: 'Cancel',
            onPress: () => { 
                this.refferlCode = "";
                resolve("")
            },
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: (refCode) => { 
              this.refferlCode = refCode;
              resolve(refCode);
            } ,
          },
        ],
      );

    })
  }

  @action showRefConfirmation(){
    
    return new Promise((resolve,reject)=>{

      Alert.alert(
        "Hairfolio",
        "You entered invalid referral code. Do you want to enter another referral code?",
        [
          { text: "OK", onPress: () => 
              {
                resolve(true)
              }
          },
          {
            text: "Continue signup",
            onPress: () => {
              resolve(false)
            },
            style: "cancel"
          }
        ],
        { cancelable: false }
      );

    })

  }



  @action async checkReferralCodeExistence(refCode){

    this.userState = LOADING;
    try{
      const res = await ServiceBackend.get(ENDPOINT.check_referralCode_Existence+"referral_code="+refCode)
      this.userState = READY;
      if(res.referral_code_exist)
      {
        return true
      }
      else
      {
        return false
      }

    }catch(error)
    {
      showAlert(error)
    }

  }



  @action //
  async checkUserExistence(token,tokenKey)
  {
    this.userState = LOADING;
    try{
      showLog("USER EXISTENCE URL ==> "+ENDPOINT.check_User_Existence+`${tokenKey}=`+token)
      const res = await ServiceBackend.get(ENDPOINT.check_User_Existence+`${tokenKey}=`+token)
      // alert("RESPONSE EXIST ==> "+JSON.stringify(res))
      showLog("USER EXISTENCE RESPONSE ==> "+JSON.stringify(res))
     if(res.user_exist)
     {
       return true;
     }
     else
     {
       return false;
     }
        
      // return res
     }catch(error){
      return error
    }
  }


  @action //
  async checkUserExistence2(token,tokenKey)
  {
    this.userState = LOADING;
    if(called == false){
      called = true;
      try{
        showLog("USER EXISTENCE URL checkUserExistence2==> "+ENDPOINT.check_User_Existence+`${tokenKey}=`+token)
        const res = await ServiceBackend.get(ENDPOINT.check_User_Existence+`${tokenKey}=`+token)
        // alert("RESPONSE EXIST ==> "+JSON.stringify(res))
        showLog("USER EXISTENCE RESPONSE ==> "+JSON.stringify(res))
       if(res.user_exist)
       {
        called = false;
         return true;
       }
       else
       {
        called = false;
         return false;
       }
          
        // return res
       }catch(error){
        return error
      }
    }
   
  }


  @action async checkUserExistenceOld(token)
  {
    this.userState = LOADING;
    try{
      showLog("USER EXISTENCE URL ==> "+ENDPOINT.check_User_Existence+"facebook_token="+token)
      const res = await ServiceBackend.get(ENDPOINT.check_User_Existence+"facebook_token="+token)
      // alert("RESPONSE EXIST ==> "+JSON.stringify(res))

     if(res.user_exist)
     {
       return true;
     }
     else
     {
       return false;
     }
        
      // return res
     }catch(error){
      return error
    }
  }


  @action async signupWithFacebook(token, type,refCode) {

    this.userState = LOADING;
    // alert('hi')
    try {
      const res = await ServiceBackend.post("sessions/facebook", {
        facebook_token: token, 
        device_id: this.fcmToken,
        referral_code: refCode
      });

      showLog("signupWithFacebook res ==>" + JSON.stringify(res));

      this.user = res.user;
      this.userState = READY;
      return res;
    } catch (error) {
      showLog("signupWithFacebook error catch ==>" + JSON.stringify(error));
      this.userState = LOADING_ERROR;
      throw error;
    }
  }

  @action async loginWithInstagram(token) {
    this.userState = LOADING;
    try {
      const res = await ServiceBackend.post("sessions/instagram", {
        instagram_token: token,
        device_id: this.fcmToken
      });
      // alert(JSON.stringify(res.user))
      this.user = res.user;
      await this.loadUserInformation();
      this.userState = READY;
    } catch (error) {
      // alert(JSON.stringify(error));
      this.userState = LOADING_ERROR;
      throw error;
    }
  }

  @action async signupWithInstagram(token, type,refCode) {
    this.userState = LOADING;
    try {
      const res = await ServiceBackend.post("sessions/instagram", {
        instagram_token: token,
        device_id: this.fcmToken,
        referral_code: refCode
      });
      // if (res.user) {
      this.user = res.user;
      this.userState = READY;
      return res;
      // } else {
      //   // alert("1 ==>"+JSON.stringify(res.errors))
      //   this.userState = LOADING_ERROR;
      //   throw new Error(res.errors);
      // }
    } catch (error) {
      // alert(JSON.stringify(error))
      this.userState = LOADING_ERROR;
      throw error;
    }
  }

  @action async signUpWithEmail(value = {}, type) {
    showLog("signUpWithEmail ==>" + JSON.stringify(value));
    this.userState = LOADING;
    if (value.business) {
      _.each(value.business, (v, key) => (value[`business_${key}`] = v));
      delete value.business;
    }
    if (type == "brand") {
      let name = value["business_name"];
      delete value.business_name;
      value.brand_attributes = {
        name: name
      };
      type = "ambassador";
    } else if (type == "salon") {
      let name = value["business_name"];

      value.salon_attributes = {
        name: name
      };

      delete value.business_name;

      type = "owner";
    }
    try {
      const res = await ServiceBackend.post("users", {
        user: {
          ...value,
          device_id:this.fcmToken,
          account_type: type,
        },
        referral_code:this.refferlCode
      });
      showLog("with email ==>" + JSON.stringify(res));
      if (res.status != 201) {
        for (key in res.errors) {
          if (key == "email") {
            throw key + " " + res.errors[key][0]; //throw res.errors.first();
          }
        }
      }
      this.user = res.user;
      this.needsMoreInfo = type !== "consumer";
      this.userState = READY;
    } catch (error) {
      this.userState = LOADING_ERROR;
      throw error;
    }
  }

  @action async loginWithEmail(value, type) {
    this.userState = LOADING;
    try {
      const res = await ServiceBackend.post("sessions", {
        session: {
          ...value,
          device_id:this.fcmToken,
          account_type: type
        }
      });
      if (res.user) {
        this.user = res.user;
        await this.loadUserInformation();
        this.userState = READY;
        return this.user;
      } else {
        if (res.errors) {
          throw res.errors;
        } else {
          throw "unknown error";
        }
      }
    } catch (error) {
      this.userState = LOADING_ERROR;
      throw error;
    }
  }

  @action async destroy(id) {
    showLog("destroy user ==>"+ id);
    /* ServiceBackend.delete(`users/${id}`)
        .response(r => {          
          this.logout();  
          this.user = {
            auth_token:null,
            educations: [],
            offerings: [],
          };
        })
        .catch(e => showLog("error"+e));
        
    this.userState = EMPTY;
    this.followingStates = observable.map(); */

    
    return ServiceBackend.destroyUser("users/" + id)
      .then(response => {
        showLog("destroy user response ==>" + JSON.stringify(response));
        // ServiceBackend.delete(`sessions/${this.user.auth_token}`)
        //   .then(response => {

        //     showLog("destroy user response ==>" + JSON.stringify(response));
       
        if(response.error){
          return response;
        } else {
            this.user = {
              auth_token: null,
              educations: [],
              offerings: []
            };

            this.userState = EMPTY;
            this.followingStates = observable.map();
            // this.logout();
          // },(error) => { 
          //   showLog("sessions error ==>" + JSON.stringify(error));
          // })
          return response;
        }
      },(error) => { 
        showLog("destroy user error ==>" + JSON.stringify(error));
        return error;
      });
  }
}

const store = new UserStore();
hydrate("user", store);

window.userStore = store;

export default store;
