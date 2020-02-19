import { CLOUD_NAME, CLOUD_PRESET, BASE_URL } from '../constants';
import UserStore from '../mobx/stores/UserStore';
import { showAlert } from '../helpers';

let myfetch = function (input, opts) {
  return new Promise((resolve, reject) => {
    setTimeout(reject, opts.timeout);
    fetch(input, opts).then(resolve, reject);
  });
}

export default class Backend {

  getHeaders() {
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    let token = UserStore.user.auth_token;
    if (token) {
      headers.Authorization = token;
    }
    return headers;
  }


  getHeaders2() {
    let headers = {
      'Accept': 'application/json',
      // 'Content-Type': 'application/json'
    };

    let token = UserStore.user.auth_token;
    if (token) {
      headers.Authorization = token;
    }
    return headers;
  }

  showLog(msg) {
    // console.log(msg);
  }

  showLog2(msg) {
    console.log(msg);
  }

  async put(url, data) {
    const prevToken = UserStore.token;
    window.head = this.getHeaders();
    window.data = data;

    this.showLog("Backend.js == put == usertoken ==>" + prevToken);
    this.showLog("Backend.js == put == url ==>" + BASE_URL + url);
    this.showLog("Backend.js == put == data ==>" + JSON.stringify(data));
    this.showLog("Backend.js == put == headers ==>" + JSON.stringify(this.getHeaders()));

    let response = await myfetch(BASE_URL + url, {
      method: 'PUT',
      headers: this.getHeaders(),
      timeout: 20000, // req/res timeout in ms, 0 to disable, timeout reset on redirect
      body: JSON.stringify(data)
    });
    // this.showLog("Backend.js == put == response ==>" + JSON.stringify(response));

    let json = await response.json();
    // let json = response
    if (response.status) {
      json.status = response.status
    }

    if (json.status === 401 && UserStore.token && prevToken === UserStore.token) {
      UserStore.setHasSessionExpired(true)
    }

    this.showLog("Backend.js == put == json ==>" + JSON.stringify(json));
    return json;
  }

  async post(url, data) {
    const prevToken = UserStore.token;
    window.head = this.getHeaders();
    window.data = data;

    this.showLog2("Backend.js == post == usertoken ==>" + prevToken);
    this.showLog2("Backend.js == post == url ==>" + BASE_URL + url);
    this.showLog2("Backend.js == post == data ==>" + JSON.stringify(data));
    this.showLog2("Backend.js == post == headers ==>" + JSON.stringify(this.getHeaders()));

    let response = await myfetch(BASE_URL + url, {
      method: 'POST',
      headers: this.getHeaders(),
      timeout: 60000, // req/res timeout in ms, 0 to disable, timeout reset on redirect
      body: JSON.stringify(data)
    });
    // this.showLog2("Backend.js == post == response ==>" + JSON.stringify(response)); 
  
    let json = await response.json();
    this.showLog2("post api response ==>" + JSON.stringify(json)); 
    if (response.status) {
      json.status = response.status
    }

    if (json.status === 401 && UserStore.token && prevToken === UserStore.token) {
      UserStore.setHasSessionExpired(true)
    }


    if(json.status === 404 || json.status === "404")
    {
        json.error = "Something went wrong!";
    }

    this.showLog("Backend.js == post == json ==>" + JSON.stringify(json));

    return json;
  }

  async putEditPost(url, data) {
    const prevToken = UserStore.token;
    window.head = this.getHeaders();
    window.data = data;

    this.showLog("Backend.js == put == usertoken ==>" + prevToken);
    this.showLog("Backend.js == put == url ==>" + BASE_URL + url);
    this.showLog("Backend.js == put == data ==>" + JSON.stringify(data));
    this.showLog("Backend.js == put == headers ==>" + JSON.stringify(this.getHeaders()));

    let response = await myfetch(BASE_URL + url, {
      method: 'PUT',
      headers: this.getHeaders(),
      timeout: 20000, // req/res timeout in ms, 0 to disable, timeout reset on redirect
      body: JSON.stringify(data)
    });
    // this.showLog("Backend.js == put == response ==>" + JSON.stringify(response));

    let json = await response.json();
    // let json = response
    if (response.status) {
      json.status = response.status
    }

    if (json.status === 401 && UserStore.token && prevToken === UserStore.token) {
      UserStore.setHasSessionExpired(true)
    }

    this.showLog("Edit post Backend.js == put == json ==>" + JSON.stringify(json));
    return json;
  }

  async editPost(url, data) {
    const prevToken = UserStore.token;
    window.head = this.getHeaders();
    window.data = data;

    this.showLog("Backend.js == post == usertoken ==>" + prevToken);
    this.showLog("Backend.js == post == url ==>" + BASE_URL + url);
    this.showLog("Backend.js == post == data ==>" + JSON.stringify(data));
    this.showLog("Backend.js == post == headers ==>" + JSON.stringify(this.getHeaders()));

    let response = await myfetch(BASE_URL + url, {
      method: 'POST',
      headers: this.getHeaders(),
      timeout: 60000, // req/res timeout in ms, 0 to disable, timeout reset on redirect
      body: JSON.stringify(data)
    });
    this.showLog("Backend.js == post == response ==>" + JSON.stringify(response)); 
  
    let json = await response.json();
  
    if (response.status) {
      json.status = response.status
    }

    if (json.status === 401 && UserStore.token && prevToken === UserStore.token) {
      UserStore.setHasSessionExpired(true)
    }


    if(json.status === 404 || json.status === "404")
    {
        json.error = "Something went wrong!";
    }

    this.showLog("Backend.js == post == json ==>" + JSON.stringify(json));

    return json;
  }

  async postOrder(url, data) {
    const prevToken = UserStore.token;
    window.head = this.getHeaders();
    window.data = data;

    this.showLog("Backend.js == post == usertoken ==>" + prevToken);
    this.showLog("Backend.js == post == url ==>" + BASE_URL + url);
    this.showLog("Backend.js == post == data ==>" + JSON.stringify(data));
    this.showLog("Backend.js == post == headers ==>" + JSON.stringify(this.getHeaders()));

    let response = await myfetch(BASE_URL + url, {
      method: 'POST',
      headers: this.getHeaders(),
      timeout: 60000, // req/res timeout in ms, 0 to disable, timeout reset on redirect
      body: JSON.stringify(data)
    });
    this.showLog("Backend.js == post == response ==>" + JSON.stringify(response)); 
   
    // let json = await response.json();
    let json = response;
  
    if (response.status) {
      json.status = response.status
    }

    if (json.status === 401 && UserStore.token && prevToken === UserStore.token) {
      UserStore.setHasSessionExpired(true)
    }


    if(json.status === 404 || json.status === "404")
    {
        json.error = "Something went wrong!";
    }

    if(json.status === 500 || json.status === "500")
    {
        json.error = "Something went wrong!";
    }
   
    this.showLog("Backend.js == post == json ==>" + JSON.stringify(json));

    return json;
  }


  async postFb(url, data) {

    this.showLog("postFb ==> url ==>" + BASE_URL + url);
    sh("postFb ==> data ==>" + JSON.stringify(data));
    let link = BASE_URL + url;

    fetch(link, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((result) => {
      this.showLog("postFb ==> success ==>" + JSON.stringify(result));
    }, (error) => {
      this.showLog("postFb ==> error ==>" + JSON.stringify(error));
    });

  }

  async postFb2(url, data) {
    const prevToken = UserStore.token;
    window.head = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    window.data = data;

    this.showLog("Backend.js == postFb == usertoken ==>" + prevToken);
    this.showLog("Backend.js == postFb == url ==>" + BASE_URL + url);
    this.showLog("Backend.js == postFb == data ==>" + JSON.stringify(data));

    let response = await myfetch(BASE_URL + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 60000, // req/res timeout in ms, 0 to disable, timeout reset on redirect
      body: data
    });
    // this.showLog("Backend.js == postFb == response ==>" + JSON.stringify(response));

    let json = await response.json();

    if (response.status) {
      json.status = response.status
    }

    if (json.status === 401 && UserStore.token && prevToken === UserStore.token) {
      UserStore.setHasSessionExpired(true)
    }

    this.showLog("Backend.js == postFb == json ==>" + JSON.stringify(json));
    return json;
  }

  async patch(url, data) {
    const prevToken = UserStore.token;
    window.head = this.getHeaders();
    window.data = data;

    this.showLog("Backend.js == patch == usertoken ==>" + prevToken);
    this.showLog("Backend.js == patch == url ==>" + BASE_URL + url);
    this.showLog("Backend.js == patch == data ==>" + JSON.stringify(data));
    this.showLog("Backend.js == patch == headers ==>" + JSON.stringify(this.getHeaders()));

    let response = await myfetch(BASE_URL + url, {
      method: 'PATCH',
      headers: this.getHeaders(),
      timeout: 20000, // req/res timeout in ms, 0 to disable, timeout reset on redirect
      body: JSON.stringify(data)
    });
    // this.showLog("Backend.js == patch == response ==>" + JSON.stringify(response));      
    

    let json = await response.json();

    if (response.status) {
      json.status = response.status
    }

    if (json.status === 401 && UserStore.token && prevToken === UserStore.token) {
      UserStore.setHasSessionExpired(true)
    }

    this.showLog("Backend.js == patch == json ==>" + JSON.stringify(json));
    return json;
  }

  async delete(url) {
    const prevToken = UserStore.token;

    this.showLog("Backend.js == delete == usertoken ==>" + prevToken);
    this.showLog("Backend.js == delete == url ==>" + BASE_URL + url);
    this.showLog("Backend.js == delete == headers ==>" + JSON.stringify(this.getHeaders()));

    let response = await myfetch(BASE_URL + url, {
      method: 'DELETE',
      headers: this.getHeaders(),
      timeout: 20000, // req/res timeout in ms, 0 to disable, timeout reset on redirect
    });

    if(response){   
        this.showLog("Backend.js == delete == response ==>" + JSON.stringify(response));      
    }

    if (response.status === 204) {
      return {};
    }
    if (response.status === 401 && UserStore.token && prevToken === UserStore.token) {
      UserStore.setHasSessionExpired(true)
    }

    // if (response.status === 404 ) {
    //   showAlert("Something went wrong!");
    //   return null;
    // }

    // if (response.status == 422) {
    //   showAlert("Something went wrong!");
    //   return null;
    // }

    let json = await response.json();
    if (response.status) {
      json.status = response.status;
    }
    this.showLog("Backend.js == delete == json ==>" + JSON.stringify(json));
    return json;
  }

  async get(url) {

    const prevToken = UserStore.token;
    let queryUrl = BASE_URL + url;

    this.showLog("Backend.js == get == usertoken ==>" + prevToken);
    this.showLog("Backend.js == get == url ==>" + BASE_URL + url);
    this.showLog("Backend.js == get == headers ==>" + JSON.stringify(this.getHeaders()));

    let response = await myfetch(queryUrl, {
      method: 'GET',
      timeout: 20000, // req/res timeout in ms, 0 to disable, timeout reset on redirect
      headers: this.getHeaders()
    });
    
    this.showLog("Backend.js == get == response ==>" + JSON.stringify(response));
    
    let json = await response.json();
    if (response.status) {
      json.status = response.status
    }

    if (json.status === 401 && UserStore.token && prevToken === UserStore.token) {
      UserStore.setHasSessionExpired(true)
    }

    if (json.status === 404 || json.status === "404") {
      json.error = "Something went wrong!";
    }
    
    this.showLog("Backend.js == get == json ==>" + JSON.stringify(json));    
    return json;
  }

  async getPostDetail(url) {

    const prevToken = UserStore.token;
    let queryUrl = BASE_URL + url;

    // this.showLog2("Backend.js == get == usertoken ==>" + prevToken);
    // this.showLog2("Backend.js == get == url ==>" + BASE_URL + url);
    // this.showLog2("Backend.js == get == headers ==>" + JSON.stringify(this.getHeaders()));

    let response = await myfetch(queryUrl, {
      method: 'GET',
      timeout: 30000, // req/res timeout in ms, 0 to disable, timeout reset on redirect
      headers: this.getHeaders()
    });
    let json;

    if (response) {
      // this.showLog2("Backend.js == getPostDetail == response ==>" + JSON.stringify(response));

      json = await response.json();
      if(json){

        if (response.status) {
          json.status = response.status
        }
  
        if (json.status === 401 && UserStore.token && prevToken === UserStore.token) {
          UserStore.setHasSessionExpired(true)
        }
  
        if (json.status === 404 || json.status === "404") {
          json.error = "Something went wrong!";
        }
  
        this.showLog2("Backend.js == getPostDetail == json ==>" + JSON.stringify(json));
        return json;

      }else{
        this.showLog2("Backend.js == getPostDetail == else ==>" + JSON.stringify(json));
      }      
    }    
  }

  async fetchEnvironment(url) {

    const prevToken = UserStore.token;
    let queryUrl = BASE_URL + url;

    this.showLog("Backend.js == get == usertoken ==>" + prevToken);
    this.showLog("Backend.js == get == url ==>" + BASE_URL + url);
    this.showLog("Backend.js == get == headers ==>" + JSON.stringify(this.getHeaders()));

    let response = await myfetch(queryUrl, {
      method: 'GET',
      timeout: 20000, // req/res timeout in ms, 0 to disable, timeout reset on redirect
      headers: this.getHeaders()
    });
    // this.showLog("Backend.js == fetchEnvironment == json ==>" + JSON.stringify(response));

    let json = await response.json();
    if (response.status) {
      json.status = response.status
    }

    if (json.status === 401 && UserStore.token && prevToken === UserStore.token) {
      UserStore.setHasSessionExpired(true)
    }

    this.showLog("Backend.js == fetchEnvironment == json ==>" + JSON.stringify(json));
    if (json.status == 200 || json.status == "200") {
      json.cloud_name = CLOUD_NAME;
      json.cloud_preset = CLOUD_PRESET;
    }
    return json;
  }



  async unfollowUser(url) {
    const prevToken = UserStore.token;

    this.showLog("Backend.js == unfollowUser == usertoken ==>" + prevToken);
    this.showLog("Backend.js == unfollowUser == url ==>" + BASE_URL + url);
    this.showLog("Backend.js == unfollowUser == headers ==>" + JSON.stringify(this.getHeaders()));

    let response = await myfetch(BASE_URL + url, {
      method: 'DELETE',
      headers: this.getHeaders2(),
      timeout: 20000, // req/res timeout in ms, 0 to disable, timeout reset on redirect
    });
    // this.showLog("Backend.js == unfollowUser == response ==>" + JSON.stringify(response));

    if (response.status === 401 && UserStore.token && prevToken === UserStore.token) {
      UserStore.setHasSessionExpired(true)
    }

    if (response.status == 204 || response.status == "204") {
      return true;
    }

  }


  async logMeOut(url) {
    const prevToken = UserStore.token;

    this.showLog("Backend.js == logMeOut == usertoken ==>" + prevToken);
    this.showLog("Backend.js == logMeOut == url ==>" + BASE_URL + url);
    this.showLog("Backend.js == logMeOut == headers ==>" + JSON.stringify(this.getHeaders2()));

    let response = await myfetch(BASE_URL + url, {
      method: 'DELETE',
      headers: this.getHeaders2(),
      timeout: 20000, // req/res timeout in ms, 0 to disable, timeout reset on redirect
    });

    // this.showLog("Backend.js == logMeOut == response ==>" + JSON.stringify(response));

    if (response.status === 401 && UserStore.token && prevToken === UserStore.token) {
      UserStore.setHasSessionExpired(true)
    }

    if (response.status == 204 || response.status == "204") {
      return true;
    }

  }

  async destroyUser(url) {
    const prevToken = UserStore.token;
    let json = {}; 

    this.showLog("Backend.js == delete == usertoken ==>" + prevToken);
    this.showLog("Backend.js == delete == url ==>" + BASE_URL + url);
    this.showLog("Backend.js == delete == headers ==>" + JSON.stringify(this.getHeaders()));

    let response = await myfetch(BASE_URL + url, {
      method: 'DELETE',
      headers: this.getHeaders(),
      timeout: 20000, // req/res timeout in ms, 0 to disable, timeout reset on redirect
    });

    if(response){ 
       
        this.showLog("Backend.js == delete == response ==>" + JSON.stringify(response));
        
        
        if(response.status == 500)
        {
          json = {"status":response.status, "error":"You are not allowed to perform this action."}     
          return json;
        }
        else if (response.status === 401 && UserStore.token && prevToken === UserStore.token) {
            UserStore.setHasSessionExpired(true)
        }
        else if (response.status === 204) {
            return {};
        }
            
    }
    

    this.showLog("Backend.js == destroy == json ==>" + JSON.stringify(json));
    return json;
  }

}
