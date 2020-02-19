import { Image, v4 } from "Hairfolio/src/helpers";
import { computed, observable } from "mobx";
import { Share } from "react-native";
import fecthBlob from "react-native-fetch-blob";
import ServiceBackend from "../../backend/ServiceBackend";
import NavigatorStyles from "../../common/NavigatorStyles";
import MessageDetailsStore from "./MessageDetailsStore";
import User from "./User";
import UserStore from "./UserStore";
import { showLog } from "../../helpers";
import { BASE_URL } from "../../constants";
// import Picture from '../stores/Picture';

export class SelectableUser {
  @observable user;
  @observable isSelected;

  constructor(obj) {
    this.key = v4();
  }

  async init(obj) {
    let user = new User();
    await user.init(obj);
    this.user = user;
    return this;
  }

  background() {
    return "white";
  }

  flip() {
    this.isSelected = !this.isSelected;
  }

  sample(name) {
    let user = new User();
    user.sample(name);
    this.user = user;
    this.isSelected = false;
  }
}

class WriteMessageStore {
  @observable users = [];
  @observable inputText = "";
  @observable isLoading = false;
  @observable mode = "POST";
  @observable post;
  @observable picture;
  @observable newPath = "";
  // @observable post;

  async download(url1) {
    // showLog("url Cloud ==>"+url1)

    // "http://www.clker.com/cliparts/B/B/1/E/y/r/marker-pin-google-md.png";
    var date = new Date();
    var url = url1; //url1.uri

    var ext = this.getImageTypeIOS(url);
    ext = "." + ext;

    const { config, fs } = fecthBlob;

    let PictureDir = fs.dirs.CacheDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          "/image_" +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: "Image"
      },
      path:
        PictureDir +
        "/image_" +
        Math.floor(date.getTime() + date.getSeconds() / 2) +
        ext,
      description: "Image"
    };
    await config(options)
      .fetch("GET", url)
      .then(res => {
        showLog("DOWNLOADED IMAGES ==>" + res.data);
        this.setTextToImage("file://" + res.data, "Hairfolio");
      })
      .catch(err => {
        alert("Error downloding image" + err);
      });
  }

  getImageTypeIOS(item) {
    //  alert(JSON.stringify(item))
    if (item) {
      var temp = item.split(".");
      let newChar = temp[temp.length - 1];
      return newChar;
    }
  }

  writeNewMessage() {
    MessageDetailsStore.createConversation(this.selectedItems);
    MessageDetailsStore.title = this.titleNames;
    this.goToMessageDetails();
  }

  async sharePost(myId, userId, post) {
    // create Conversation
    let postData = {
      sender: UserStore.user.id,
      conversation: {
        sender_id: myId,
        recipient_ids: [userId]
      }
    };

    // 1. get conversation
    let res = (await ServiceBackend.post("conversations", postData))
      .conversation;

    // share the post
  }

  actionBtnAction() {
    if (this.mode == "MESSAGE") {
      this.writeNewMessage();
    } else {
      let users = this.selectedItems.map(e => e.user);
      // alert("WRITE MESSAGE STORE"+JSON.stringify(this.post.pictures.length))

      // alert("ACTION BUTTON"+this.post.pictures[0].source.uri)
      for (let user of users) {
        ServiceBackend.sendPostMessage(UserStore.user.id, user, this.post);
      }
      this.goBack();
    }
  }

  goToMessageDetails() {
    if (this.navigator) {
      this.navigator.push({
        screen: "hairfolio.MessageDetails",
        navigatorStyle: NavigatorStyles.basicInfo,
        title: this.title || ""
      });
    }
  }

  goBack() {
    if (this.navigator) {
      this.navigator.pop({
        animated: true
      });
    }
  }

  @computed get actionBtnText() {
    if (this.mode == "MESSAGE") {
      return "Start";
    } else {
      return "Share";
    }
  }

  @computed get title() {
    if (this.mode == "MESSAGE") {
      return "New Message";
    } else {
      return "Share Post";
    }
  }

  @computed get titleNames() {
    let title = "";

    let num = 0;

    for (let u of this.users) {
      if (u.isSelected) {
        num++;
        if (num == 1) {
          title = u.user.name;
        } else if (num == 2) {
          title += " , " + u.user.name;
        } else {
          title += ", ...";
          return title;
        }
      }
    }

    return title;
  }

  @computed get selectedItems() {
    let users = [];
    for (let u of this.users) {
      if (u.isSelected) {
        users.push(u);
      }
    }

    return users;
  }

  @computed get items() {
    if (this.inputText.length == 0) {
      return this.users;
    }

    let users = [];
    for (let u of this.users) {
      if (u.isSelected) {
        users.push(u);
      }
    }

    for (let u of this.users) {
      if (!u.isSelected && u.user.name.indexOf(this.inputText) > -1) {
        users.push(u);
      }
    }

    // showLog("get items ==>"+JSON.stringify(users))

    return users;
  }

  @computed get isEmpty() {
    return this.users.length == 0;
  }

  @computed get selectedNumber() {
    return this.users.filter(e => e.isSelected).length;
  }

  get noElementsText() {
    return "There have been no people yet.";
  }

  constructor() {
    // this.load();
  }

  shareLink(){
    const shareOptions = {
      title: "Hairfolio",
      // message: "Download App from below link https://www.google.com/", // Note that according to the documentation at least one of "message" or "url" fields is required
      message:BASE_URL+"view_post_meta/600",
      subject: "Subject",
      // uri: "http://res.cloudinary.com/drdal2urr/image/upload/v1548764759/q5bzjrtpyvvwwlzlc2fl.jpg"
      // url: img.src
    };
    Share.share(shareOptions);
  }

  toDataURL(src, callback, outputFormat) {
    //  alert("TO DATA URL"+src)
    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function() {
      var canvas = document.createElement("CANVAS");
      var ctx = canvas.getContext("2d");
      var dataURL;
      canvas.height = this.naturalHeight;
      canvas.width = this.naturalWidth;
      ctx.drawImage(this, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);
      callback(dataURL);
    };
    img.src = src;

    // alert("IMAGE ==>"+img.complete)

    if (img.complete || img.complete == undefined) {
      img.src =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
      img.src = src;
      // alert("WRITE MESSAGE STORE :- "+JSON.stringify(img.src))

      const shareOptions = {
        title: "Hairfolio",
        // message: "Download App from below link https://www.google.com/", // Note that according to the documentation at least one of "message" or "url" fields is required
        message:"http://hairfolio-prod.herokuapp.com/view_post_meta/600",
        subject: "Subject",
        // uri: "http://res.cloudinary.com/drdal2urr/image/upload/v1548764759/q5bzjrtpyvvwwlzlc2fl.jpg"
        // url: img.src
      };
      Share.share(shareOptions);
    }
  }

  async load() {
    this.isLoading = true;
    this.inputText = "";
    this.users = [];

    let userId = UserStore.user.id;

    // let res = (await ServiceBackend.get(`users/${userId}/follows?friends=true`)).users;
    let res = (await ServiceBackend.get(`users?limit=100`)).users;
    // let res = (await ServiceBackend.get(`users`)).users;
    // showLog('res ==>'+JSON.stringify(res))
    let myUsers = await Promise.all(
      res.map(e => {
        let u = new SelectableUser();
        return u.init(e);
      })
    );
    
    // showLog('myUsers ==>'+JSON.stringify(myUsers))

    this.users = myUsers;

    this.isLoading = false;
  }
}

const store = new WriteMessageStore();

export default store;
