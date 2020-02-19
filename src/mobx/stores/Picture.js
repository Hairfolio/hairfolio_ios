import { jpg, v4 } from 'Hairfolio/src/helpers';
import { action, computed, observable } from 'mobx';
import { ImageEditor, NativeModules } from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import ImageResizer from 'react-native-image-resizer';
import { showLog, _ } from '../../helpers';
import EnvironmentStore from './EnvironmentStore';
import HashTag from './tags/HashTag';
import LinkTag from './tags/LinkTag';
import ProductTag from './tags/ProductTag';
import ServiceTag from './tags/ServiceTag';
import { BASE_URL } from '../../constants';
import UserStore from './UserStore';
import CreatePostStore from './CreatePostStore';

let PhotoAlbum = NativeModules.PhotoAlbum;

class Picture {
  @observable videoFolderName='post';
  @observable parent;
  @observable tags = [];
  @observable source;
  @observable videoUrl;
  @observable id = null;
  @observable _destroy = false;
  // for video
  @observable isPlaying = false;
  @observable isPaused = false;
  @observable folderName = "post";

  constructor(orignalSource, source, parent) {
    // showLog("Picture constructor ==>"+JSON.stringify(parent))

    // alert("Picture js ==>"+ JSON.stringify(source) )
    this.source = source;
    this.originalSource = source;
    this.key = v4();
    this.parent = parent;
    this._destroy = false;
  }

  assignValue(source, id,tags) {
    showLog("New Picture assignValue ==>")

    // alert("Picture js ==>"+ JSON.stringify(source) )
    this.source = source;
    this.originalSource = source;
    this.id = id;
    this.tags = tags;
    this.key = v4();
  }

  async resizeImage(uri) {
    return ImageResizer.createResizedImage(uri, 2 * 250, 2 * 250, 'JPEG', 90, 0);
  }

  async cropImage(uri) {
    return new Promise((resolve, reject) => {
      ImageEditor.cropImage(uri, {
        offset: {
          x: 0,
          y: 0
        },
        size: {
          width: 500,
          height: 500
        }
      }, resolve, () => reject('resize failed'));
    });
  }

  getImageUrl() {
    let uri = this.source.uri;
    // if (uri && uri.indexOf('cloudinary') > -1) {
    //   let splitUrl = uri.split('upload');
    //   let newUrl = `${splitUrl[0]}upload/c_mfit${splitUrl[1]}`;
    //   return { uri: newUrl };
    // }

    // showLog("getImageUrl ==>"+JSON.stringify(this.source));
    return this.source;
  }

  getSource(width, height) {
    // showLog("getSource ==>"+JSON.stringify(this.source))
    let uri = this.source.uri;
    // if (uri && uri.indexOf('cloudinary') > -1) {
    //   let splitUrl = uri.split('upload');
    //   let newUrl = `${splitUrl[0]}upload/w_${width},h_${height},c_mfit${splitUrl[1]}`;
    //   return { uri: newUrl };
    // }

    return this.source;
  }

  async getVideoPath(identifier) {

    return new Promise((resolve, rej) => {
      PhotoAlbum.getVideoPath2(identifier, (data) => {
        resolve(data);
      });
    });

  }

  async uploadVideoOriginalCloudinary() {
    let uri = this.videoUrl;

    if (this.videoUrl.startsWith('file')) {
      uri = uri.substr(7);
    }


    let formdata = new FormData();
    formdata.append('file', {
      type: 'video/mp4',
      uri,
      name: 'upload.mp4'
    });

    let preset = EnvironmentStore.environment.cloud_preset;
    let cloudName = EnvironmentStore.environment.cloud_name;

    // load pictures from library
    if (this.identifier) {
      let path = await this.getVideoPath(this.identifier);
      uri = path[0].uri;
    }


    let res = await RNFetchBlob.fetch('POST', `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
      'Content-Type': 'multipart/form-data',
    }, [
        //
        { name: 'file', filename: 'upload.mp4', type: 'video/mp4', data: RNFetchBlob.wrap(uri) },
        // elements without property `filename` will be sent as plain text
        { name: 'upload_preset', data: preset },
      ]);

    return res.json();
  }

  async uploadVideoWorking() {
    let uri = this.videoUrl;
    // showLog("upload uri ==>"+uri);
    if (this.videoUrl.startsWith('file')) {
      uri = uri.substr(7);
    }
    // showLog("upload after uri ==>"+uri);
    let formdata = new FormData();
    var currentDate = (new Date).getTime()+'_';
    let url = BASE_URL+"video_upload";
    if (this.identifier) {
      let path = await this.getVideoPath(this.identifier);
      uri = path[0].uri;
    }
    formdata.append('uploader[video_url]', {
      type: 'video/mov',
      data: RNFetchBlob.wrap(uri),
      name: 'upload.mov'
    });
    formdata.append('uploader[folder_name]','post');
    showLog("Formdata url ==> "+url);
    showLog("Formdata video ==> "+JSON.stringify(formdata));
    let res = await fetch(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data; boundary=6ff46e0b6b5148d984f148b6542e5a5d'
        },
        body: formdata
      }
    );
    // showLog("Formdata res ==> "+JSON.stringify(res));
    return res.json();
  }

  async uploadVideoXHR(folderName) {
    let uri = this.videoUrl;
    if (this.videoUrl.startsWith('file')) {
      uri = uri.substr(7);
    }
    let formdata = new FormData();
    var currentDate = (new Date).getTime()+'_';
    let url = BASE_URL+"video_upload";
    if (this.identifier) {
      let path = await this.getVideoPath(this.identifier);
      uri = path[0].uri;
    }
    formdata.append('uploader[video_url]', {
      type: 'video/mov',
      data: RNFetchBlob.wrap(uri),
      name: 'upload.mov' //'upload_'+currentDate+'.mp4'
    });
    formdata.append('uploader[folder_name]','post');

    showLog("Formdata video ==> "+JSON.stringify(formdata));
    showLog("Url ==> "+url);
    // let res = await fetch(
    //   url,
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'multipart/form-data; boundary=6ff46e0b6b5148d984f148b6542e5a5d'
    //     },
    //     body: formdata
    //   }
    // );

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
   
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Authorization", UserStore.user.auth_token);
    let res; 
    xhr.onload = () => {
      res = JSON.parse(xhr._response);      
      showLog("XHR response ==> " + JSON.stringify(res));
      if(res){
        showLog("res video ==> "+JSON.stringify(res));
        return res;
      }
      return {"video_url":{"url":""}};
    };

    xhr.send(formdata);   
  }

  async uploadVideo() {
    let uri = this.videoUrl;
    // showLog("upload uri ==>"+uri);
    // if (this.videoUrl.startsWith('file')) {
    //   uri = uri.substr(7);
    // }
    // showLog("upload after uri ==>"+uri);

    // showLog("VIDEO UPLOAD URI LOCAL -==> "+JSON.stringify(uri))

    let formdata = new FormData();
    var currentDate = (new Date).getTime()+'_';
     let url = BASE_URL+"video_upload";
    // if (this.identifier) {
    //   let path = await this.getVideoPath(this.identifier);
    //   uri = path[0].uri;
    // }
    formdata.append('uploader[video_url]', {
      type: 'video/mov',
      uri,
      name: 'upload_'+currentDate+'.mov'
    });
    formdata.append('uploader[folder_name]',this.videoFolderName);
    showLog("Formdata url ==> "+url);
    showLog("Formdata video ==> "+JSON.stringify(formdata));
    let res = await fetch(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data; boundary=6ff46e0b6b5148d984f148b6542e5a5d'
        },
        body: formdata
      }
    );
    // showLog("Formdata res ==> "+JSON.stringify(res));
    return res.json();
  }

  async uploadPictureOriginalCloudinary() {
    const uri = this.source.uri
    // await ImageResizer.createResizedImage(this.source.uri, 1024, 1024 * (4 / 3), 'JPEG', 100, 0);

    let formdata = new FormData();
    formdata.append('file', {
      type: 'image/jpeg',
      uri,
      name: 'upload.jpg'
    });

    let preset = EnvironmentStore.environment.cloud_preset;
    let cloudName = EnvironmentStore.environment.cloud_name;

    formdata.append('upload_preset', preset);
    let res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data; boundary=6ff46e0b6b5148d984f148b6542e5a5d'
        },
        body: formdata
      }
    );

    if (res) {
      // showLog("Picture cloudinary ==>" + JSON.stringify(res));
    }

    return res.json();
  }

  async uploadPicture() {
    const uri = this.source.uri
    // await ImageResizer.createResizedImage(this.source.uri, 1024, 1024 * (4 / 3), 'JPEG', 100, 0);
    // showLog("PHOTO UPLOAD URI LOCAL -==> "+JSON.stringify(uri))

    let formdata = new FormData();

    var currentDate = (new Date).getTime()+'_';
    formdata.append('uploader[image_url]', {
      type: 'image/jpeg',
      uri,
      name: 'upload_'+currentDate+'.jpg'
    });
    formdata.append('uploader[folder_name]',this.folderName);

    let preset = EnvironmentStore.environment.cloud_preset;
    let cloudName = EnvironmentStore.environment.cloud_name;
    let url = BASE_URL+"file_upload";
    // formdata.append('upload_preset', preset);
    let res = await fetch(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data; boundary=6ff46e0b6b5148d984f148b6542e5a5d'
        },
        body: formdata
      }
    );

    if (res) {
      showLog("Picture cloudinary 123 ==>" + JSON.stringify(res));
    }

    return res.json();
  }


  async toJSON(upload = true, obj = {}) {
    // console.log('Picture JSON called ==>')
    let ret = {};

    let json, formdata;



    if (this.isVideo) {

      if (upload) {
        let videoJSON = await this.uploadVideo();
        // showLog("videoJSON ==> " + JSON.stringify(videoJSON))
        ret.video_url = videoJSON.video_url.url;
      } else {
        ret.video_url = this.videoUrl;
      }
    }

    if (upload) {
      let pictureJSON = await this.uploadPicture();
      if(pictureJSON){
        // showLog("pictureJSON ==>"+JSON.stringify(pictureJSON));
        if(pictureJSON.url){
          ret.asset_url = pictureJSON.url;
        }else{
          // ret.asset_url = pictureJSON.image_url.asset_url;
          ret.asset_url = pictureJSON.image_url.thumb_url;
          ret.thumb_url = pictureJSON.image_url.thumb_url;
        }        
      }      
    } else {
      ret.asset_url = this.source.uri;
    }

    window.tag = this.tags;

    // if editing remove invalid tags first and generate again
    // if (!upload) {
    //   // remove negative tags for now
    //   this.tags = this.tags.filter(t => t.x >= 0);
    //   alert("NOT UPLOAD")

    //   let oldIndex = 0;

    //   let index = 0;

    //   for (let t of this.tags) {
    //     if (t.id == obj.id) {
    //       oldIndex = index;
    //     }
    //     index++;
    //   }

    //   let oldService = this.tags[oldIndex];

    //   window.lastData2 = obj;

    //   this.tags[oldIndex] = new ServiceTag(oldService.x, oldService.x, obj);
    // }

    for (let tag of this.tags) {

      // showLog("Picture Tagsss ==>" + JSON.stringify(tag.type));
      // showLog("ALL TAGS Tagsss ==>" + JSON.stringify(this.tags));

      if (tag.type == 'service') {

        for (let color of tag.colors) {

          let tagName;
          
          if (!upload) {
            tagName = color.color.code;
          } else {
            if(color.name){
              tagName = color.name.toLowerCase();
            }            
          }

          // showLog("DATA TYPE OF TAG NAME ==> "+JSON.stringify(tagName))

          if(tagName){
            tagName = tagName.replace(/\W/g, '_').toLowerCase();

            let numberIndex = 0;

            while (numberIndex < tagName.length && /^\d$/.test(tagName[numberIndex])) {
              numberIndex++;
            }

            tagName = tagName.slice(0, numberIndex) + '_' + tagName.slice(numberIndex);
          // this.tags.push(new HashTag(-100, -100, '#' + tagName));
          }
        }


        if (tag.lineName) {
          let tagName = tag.lineName.replace(/\W/g, '_').toLowerCase();
          // this.tags.push(new HashTag(-100, -100, '#' + tagName));
        }

        if (tag.brandName) {
          let tagName = tag.brandName.replace(/\W/g, '_').toLowerCase();
          // this.tags.push(new HashTag(-100, -100, '#' + tagName));
        }

        if (tag.serviceName) {
          let tagName = tag.serviceName.replace(/\W/g, '_').toLowerCase();
          // this.tags.push(new HashTag(-100, -100, '#' + tagName));
        }

      } else if (tag.type == "producttag") {
        // this.tags.push(new ProductTag(-100, -100,tag));
      }

    }

    let labels_attributes = await Promise.all(
      this.tags.map(tag => {
        return tag.toJSON();
      })
    );
    window.tags = labels_attributes;

    ret.labels_attributes = labels_attributes;

    return ret;
  }

  async toEditPostJSON(upload = false, obj = {}) {
    console.log('Picture JSON called ==>')
    let ret = {};

    let json, formdata;   

      window.lastData2 = obj;
    

    let labels_attributes = await Promise.all(
      this.tags.map(tag => {
        return tag.toJSON();
      })
    );
    window.tags = labels_attributes;

    ret.labels_attributes = labels_attributes;

    return ret;
  }

  @computed get isVideo() {
    return this.videoUrl != null;
  }

  @computed get videoThumbnail() {
    if (this.videoUrl == null) {
      return '';
    }
    return jpg(this.videoUrl);
  }

  @computed get selected() {
    // console.log('Picture selected ==> '+JSON.stringify(this));
    // console.log('Picture selected ==> '+JSON.stringify(this.parent.selectedPicture));
    return this.parent.selectedPicture == this;
  }

  @action select() {
    // console.log('Picture select==>'+JSON.stringify(this))
    this.parent.selectedPicture = this;
  }
  
  @action addServiceTag(x, y, data) {

    window.lastData = data;

    this.tags.push(new ServiceTag(x, y, data));
  }

  @action removeServiceTag(x, y, data) {
    let tempArr = [];
    tempArr = this.tags;
    this.tags.map((item, index) => {
      if(data.type == item.type) {
        if(item.id == data.id) {
          tempArr[index]._destroy = true;
        }
      }
    })
    this.tags = tempArr;
  }

  @action addLinkTag(x, y, data) {
    this.tags.push(new LinkTag(x, y, data));
  }

  @action removeLinkTag(x, y, data) {
    let tempArr = [];
    tempArr = this.tags;
    this.tags.map((item, index) => {
      if(data.type == item.type) {
        if(item.id == data.id) {
          tempArr[index]._destroy = true;
        }
      }
    })
    this.tags = tempArr;
  }

  @action addHashTag(x, y, hashtag) {
    
    this.tags.push(new HashTag(x, y, hashtag));
  }

  @action async removeHashTag(x, y, hashtag) {
    let tempArr = [];
    tempArr = this.tags;
    this.tags.map((item, index) => {
      if(hashtag.type == item.type) {
        if(item.id == hashtag.id) {
          tempArr[index]._destroy = true;
        }
      }
    })
    this.tags = tempArr;
  }

  @action addProductTag(x, y, productTag) {
    this.tags.push(new ProductTag(x, y, productTag));
  } 

  @action removeProductTag(x, y, productTag) {
    let tempArr = [];
    tempArr = this.tags;
    this.tags.map((item, index) => {
      if(productTag.type == item.type) {
        if(item.id == productTag.id) {
          tempArr[index]._destroy = true;
        }
      }
    })
    this.tags = tempArr;
  }
}

export default Picture;
