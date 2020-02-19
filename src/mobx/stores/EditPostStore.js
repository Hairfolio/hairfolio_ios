import { _ } from 'Hairfolio/src/helpers';
import { action, computed, observable } from 'mobx';
import { NativeModules, Image } from 'react-native';
import Camera from 'react-native-camera';
import fecthBlob from "react-native-fetch-blob";
import Marker from 'react-native-image-marker';
import ImageResizer from 'react-native-image-resizer';
import { v4 } from 'uuid';
import ServiceBackend from '../../backend/ServiceBackend';
import { showLog, showAlert, windowWidth, h } from '../../helpers';
import AddBlackBookStore from './AddBlackBookStore';
import AlbumStore from './AlbumStore';
import EnvironmentStore from './EnvironmentStore';
import FeedStore from './FeedStore';
import FilterStore from './FilterStore';
import Picture from './Picture';
import ShareStore from './ShareStore';
import UserStore from './UserStore';
import ImagePicker from 'react-native-image-crop-picker';
import { BASE_URL } from '../../constants';
import ImageCropPicker from 'react-native-image-crop-picker';

let PhotoAlbum = NativeModules.PhotoAlbum;

let count = 0;
var counter = 0;
const COLORS = ['blue', 'orange', 'red'];
class LibraryPicture {

  @observable selectedNumber;
  @observable parent;


  @observable serviceTags = [];
  constructor(data, parent) {
    this.key = v4();
    this.parent = parent;
    this.isVideo = data.isVideo == 'true';
   
    this.id = data.id;

    this.uri = `assets-library://asset/asset.JPG?id=${data.id.substring(0, 36)}&ext=JPG`;

    // this.videoUrl = `assets-library://asset/asset.mov?id=${data.id}&ext=mov`;

    if (this.isVideo) {
      PhotoAlbum.getVidePath(data.id, (data) => {
        this.videoUrl = data[0].uri;
        
      });
    }


    this.duration = data.duration;
    this.imageID = data.uri;
  }

  @computed get timeText() {
    if (this.isVideo) {
      return this.duration;
    }

    return '';
  }

  @action select() {
    this.parent.selectPicture(this);
  }
};

class TagMenu {


  @observable selected = false;

  constructor(title, sourceOn, sourceOff, parent) {
    this.title = title;
    this.sourceOn = sourceOn;
    this.sourceOff = sourceOff;
    this.parent = parent;
  }

  @computed get source() {
    if (this.selected) {
      return this.sourceOn;
    } else {
      return this.sourceOff;
    }
  }

  @action select() {
    this.parent.selectTag(this);
  }

  @computed get opacity() {
    if (this.selected) {
      return 1;
    } else {
      return 0.5;
    }
  }
}

class ServiceBox {
  @observable show = false;
  @observable locY = 0;
  @observable locX = 0;
};

class Picker {

  constructor(title, data, value, onCancel, onConfirm) {
    this.title = title;
    this.data = data;
    this.value = value;
    this.onCancel = onCancel;
    this.onConfirm = onConfirm;
  }
};

class Position {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Gallery {

  @observable bind_products = [];

  @observable pictures = [];
  @observable selectedPicture = null;
  
  @observable filterStore;


  @observable selectedTag = null;
  @observable description = '';

  position = new Position(50, 50);


  @observable openedPicker = null;

  @observable showPicker = true;
  @observable pickerData = [
    'Single Process Color',
    'Dual Process Color',
    'Highlights',
    'Lowlights',
    'Straightening'
  ];
  @observable pickerValue = 'Highlights';
  @observable pickerTitle = 'Service';


  @observable lastClick;
  @observable arrSelectedImages = [];
  @observable arrTakenPictures = [];

  wasOpened = false;

  @observable hashTagMenu = new TagMenu(
    'ADD TAG',
    require('img/post_hashtag_on.png'),
    require('img/post_hashtag_off.png'),
    this
  );

  @observable productTagMenu = new TagMenu(
    'TAG PRODUCT',
    // require('img/post_hashtag_on.png'),
    // require('img/post_hashtag_off.png'),
    require('img/shampoo-bottle-white.png'),
    require('img/shampoo-bottle.png'),
    this
  );

  @observable serviceTagMenu = new TagMenu(
    'ADD SERVICE',
    require('img/post_service_on.png'),
    require('img/post_service_off.png'),
    this
  );

  @observable linkTagMenu = new TagMenu(
    'ADD LINK',
    require('img/post_link_on.png'),
    require('img/post_link_off.png'),
    this
  );



  @action applyFilter() {
    this.selectedPicture.source = this.filterStore.mainPicture.source;
  }

  @computed get serviceTagSelected() {
    return this.selectedTag == this.serviceTagMenu;
  }

  @computed get linkTagSelected() {
    return this.selectedTag == this.linkTagMenu;
  }

  @computed get hashTagSelected() {
    return this.selectedTag == this.hashTagMenu;
  }

  @computed get productTagSelected() {
   
   return this.selectedTag == this.productTagMenu;
  
  }



  @action selectTag(tag) {

    for (let el of [this.hashTagMenu, this.serviceTagMenu, this.linkTagMenu, this.productTagMenu]) {
      if (el != tag) {
        el.selected = false;
      } else {
        el.selected = !el.selected;
        if (!el.selected) {

          this.selectedTag = null;
        } else {

          this.selectedTag = tag;
        }
      }
    }
  }

  unselectTag() {

    this.selectedTag = null;

    for (let el of [this.hashTagMenu, this.serviceTagMenu, this.linkTagMenu, this.productTagMenu]) {
      el.selected = false;
    }
  }

  @action reset() {
    this.selectedPicture = null;
    this.selectedTag = null;
    this.pictures = [];
    this.description = '';
    this.wasOpened = false;
    this.bind_products = [];
    this.arrSelectedImages = [];
    this.unselectTag();
  }

  constructor() {
    window.gallary = this;

    setTimeout(() => {
      this.filterStore = new FilterStore(this);
    });
  }

  @action deleteSelectedPicture() {
    this.pictures = this.pictures.filter(el => el != this.selectedPicture);

    this.selectedPicture = _.first(this.pictures);
  }

  @action addSamplePicture() {

    this.addPicture(
      new Picture(
        { uri: 'assets-library://asset/asset.JPG?id=106E99A1-4F6A-45A2-B320-B0AD4A8E8473/L0/001&ext=JPG' },
        { uri: 'assets-library://asset/asset.JPG?id=106E99A1-4F6A-45A2-B320-B0AD4A8E8473/L0/001&ext=JPG' },
        this
      )
    );
    this.selectedPicture = this.pictures[0];
    this.description = 'This is a sample post.';

    this.filterStore.setMainImage(this.selectedPicture);
    // this.selectedTag = this.linkTagMenu;
    // this.linkTagMenu.selected = true;

    // add hashtag
    this.addHashToPicture(20, 100, 'test');
    // this.addProductToPicture(20, 100, 'test');
  }

  @action updateFilterStore() {
    this.filterStore = new FilterStore(this);
    this.filterStore.setMainImage(this.selectedPicture);
  }

  @action addServicePicture(x, y, data) {
    this.selectedTag = null;
    this.serviceTagMenu.selected = false;
    this.hashTagMenu.selected = false;
    this.linkTagMenu.selected = false;
    this.productTagMenu.selected = false;
    this.selectedPicture.addServiceTag(x, y, data);
  }

  @action addLinkToPicture(x, y, data) {
    this.selectedTag = null;
    this.serviceTagMenu.selected = false;
    this.hashTagMenu.selected = false;
    this.linkTagMenu.selected = false;
    this.productTagMenu.selected = false;
    this.selectedPicture.addLinkTag(x, y, data);
  }

  @action addHashToPicture(x, y, hashtag) {

    this.selectedTag = null;
    this.serviceTagMenu.selected = false;
    this.hashTagMenu.selected = false;
    this.linkTagMenu.selected = false;
    this.productTagMenu.selected = false;
    console.log('addHashToPicture==>'+JSON.stringify(this.selectedPicture.source))
    this.selectedPicture.addHashTag(x, y, hashtag);
  }

  @action addProductToPicture(x, y, productTag) {

    this.bind_products.push(productTag);
    showLog("addProductToPicture ==>" + this.bind_products.length);
    this.selectedTag = null;
    this.serviceTagMenu.selected = false;
    this.hashTagMenu.selected = false;
    this.linkTagMenu.selected = false;
    this.productTagMenu.selected = false;
    this.selectedPicture.addProductTag(x, y, productTag);
  }

  @action addPicture(pic) {

    // original
    this.pictures.unshift(pic);
    this.selectedPicture = _.first(this.pictures);
  }


  @action async addLibraryPictures(libraryPictures) {

    // let creatPic = new EditPostStore()
    // let userId = UserStore.user.id;

    // alert("LIBRARY IMAGES ==>"+libraryPictures[0].uri)
    

      for(var i=0;i<libraryPictures.length;i++)
      {
        this.arrSelectedImages.push(libraryPictures[i])
      }
      


    // if(this.arrSelectedImages.length == libraryPictures.length)
    // {
         // setTimeout(() => {
      let pictures = libraryPictures.map((el) => {
        let pic = new Picture({ uri: el.uri }, { uri: el.uri }, this);

        if (el.isVideo) {
          pic.videoUrl = el.videoUrl;
          pic.identifier = el.id;
        }

        return pic;
      });

      for (let el of this.pictures) {
        pictures.push(el);
      }

    this.displayPicData(pictures)
      this.pictures = pictures;
      this.selectedPicture = _.first(this.pictures);
    // showLog("this.selectedPictures addLibraryPictures==> " + EditPostStore.selectedPictures)
    // }, 3000)
    // }
   


  }  
  
  async displayPicData(response) {
    for (key in response) {
      showLog("store displayPicData ==>" + key + " value ==>" + response[key]);      
    }
  }

  async toJSON() {

    let items = [];
    let product_ids = [];
   


    showLog("Test Picture ==> " + JSON.stringify(this.pictures))
    
    if (this.pictures.length > 0) {
      for (let pic of this.pictures) {
        showLog("SELECTED ALL PICTURES ==> "+JSON.stringify(pic))
        pic.videoFolderName = 'post';
        let el = await pic.toJSON();
        showLog("store displayPicData ==>" + JSON.stringify(el));
        items.push(el);

      }
    }
    
    for (let product of this.bind_products) {
      product_ids.push(product.id);
    }


    return {
      post: {
        description: this.description,
        photos_attributes: items,
        product_ids: product_ids
      }
    };
  }

  async toEditJSON() {

    let items = [];
    let product_ids = [];
   


    showLog("Test Picture ==> " + JSON.stringify(this.pictures))
    
    if (this.pictures.length > 0) {
      for (let pic of this.pictures) {
        showLog("SELECTED ALL PICTURES ==> "+JSON.stringify(pic))
        pic.videoFolderName = 'post';
        // let el = await pic.toJSON();
        // showLog("store displayPicData ==>" + JSON.stringify(el));
        items.push(pic);

      }
    }
    
    for (let product of this.bind_products) {
      product_ids.push(product.id);
    }


    return {
      post: {
        description: this.description,
        photos_attributes: items,
        product_ids: product_ids
      }
    };
  }
}

const imagesSelectedLimit = 10;

class EditPostStore {
  @observable isRecording = false;
  @observable loadGallery = false;
  @observable inputMethod = 'Photo';
  @observable isOpen = false;
  @observable lastTakenPicture = {};
  @observable groupName = 'Camera Roll';
  @observable libraryPictures = [];
  @observable selectedPictures = [];
  @observable cameraType = Camera.constants.Type.back;
  @observable cameraFlashMode = Camera.constants.FlashMode.off;
  @observable gallery = new Gallery();
  @observable isVideoSelected = false;
  @observable isLoading = false;
  @observable loadingText;
  @observable recordedTime;

  @observable arrMarkerText = [];
  @observable arrCloudUrl = []
  @observable newCloudUrl;

  @observable isCountMatched = false;
  @observable productCounter = 0; 
  @observable isallProductTagSelected = false;

  @observable arrWaterMarkedImages = [];
  @observable arrDownloadedImages = [];
  @observable arrReqParam = [];
  @observable isUploadFinished = false;
  @observable isCalled = false;

  /////////New/////////////
  @observable post = {};
  @observable photos_attributes = [];
  @observable labels_attributes = [];

  // @observable editPostParams = {'post':};



  // tempPath;
  @observable newPath = null;
  constructor() {
    // this.updateLibraryPictures();

    this.newPath = "";
  }

  startRecording() {
    if(window && window.recorder) {
      window.recorder.record();
      this.isRecording = true;
      this.recordedTime = 0;

      this.recordFun = setInterval(
        () => {
          this.recordedTime += 1;
        },
        1000
      );
    }
  }

  stopRecording() {
    if(window && window.recorder){
      window.recorder.pause();
      EditPostStore.isRecording = false;
      clearInterval(this.recordFun);
      this.isVideoSelected = true;
    }
  }

  @computed get flashIconSource() {
    if (this.cameraFlashMode == Camera.constants.FlashMode.off) {
      return require('img/post_flash_no.png');
    } else if (this.cameraFlashMode == Camera.constants.FlashMode.auto) {
      return require('img/post_flash_auto.png');
    } else {
      return require('img/post_flash.png');
    }
  }

  @action switchCameraType() {
    if(window && window.camera) {
      if (this.cameraType == Camera.constants.Type.front) {
        this.cameraType = Camera.constants.Type.back;
      } else {
        this.cameraType = Camera.constants.Type.front;
      }

      window.camera.changeCamera();
    }
  }

  @action switchCameraFlashMode() {
    if(window && window.camera) {
      if (this.cameraFlashMode == Camera.constants.FlashMode.off) {
        this.cameraFlashMode = Camera.constants.FlashMode.auto;
        window.camera.setFlashMode('auto');
      } else if (this.cameraFlashMode == Camera.constants.FlashMode.auto) {
        this.cameraFlashMode = Camera.constants.FlashMode.on;
        window.camera.setFlashMode('on');
      } else {
        this.cameraFlashMode = Camera.constants.FlashMode.off;
        window.camera.setFlashMode('off');
      }
    }
  }

  reset(resetGallary = true) {
    this.inputMethod = 'Photo';
    this.lastTakenPicture = {};
    this.groupName = 'Camera Roll';
    this.libraryPictures = [];
    this.selectedPictures = [];
    this.photos_attributes = [];
    this.isVideoSelected = false;
    if (resetGallary) {
      this.isOpen = false;
      this.gallery.reset();
    }
    window.recorder && window.recorder.removeAllSegments();
  }

  @computed get selectedLibraryPicture() {
    if (this.selectedPictures.length == 0) {
      return null;
    } else {
      return this.selectedPictures[this.selectedPictures.length - 1];
    }
  }

  @action addLibraryPicturesToGallary() {

    
    // alert(JSON.stringify(this.selectedPictures))
    this.gallery.addLibraryPictures(
      this.selectedPictures
    );

    this.gallery.wasOpened = true;

    this.gallery.selectedPicture = _.first(this.gallery.pictures);
  }

  @action addTakenVideoToGallery() {

    showLog("FETCH VIDEO PATH 0 ==> "+JSON.stringify(this.lastTakenPicture))
    

    ImageCropPicker.openCropper({
      path: this.lastTakenPicture.path,
      // width: windowWidth,
      // height: windowWidth + 100,
      // width: windowWidth*2,
      // height: (windowWidth + 100)*2,
      width: windowWidth + (windowWidth/2),
      height: windowHeight,
      compressImageQuality:1
      }).then((image) => {
      // this.setState({ isLoader: false })
      
      showLog("openCropper ==>"+JSON.stringify(image));
      showLog("data openCropper ==>"+JSON.stringify(data));

      this.lastTakenPicture.path = image.path

      let video = new Picture(
        { uri: this.lastTakenPicture.path },
        { uri: this.lastTakenPicture.path },
        this.gallery
      );
      video.videoUrl = this.lastTakenPicture.videoUrl;
      showLog("FETCH VIDEO PATH 1 ==> "+JSON.stringify(this.lastTakenPicture))
      let uri = {"uri":this.lastTakenPicture.path}
      this.gallery.arrTakenPictures.push(uri)
      this.gallery.addPicture(video);
      this.gallery.wasOpened = true;

    })
    .catch(err => { 
      // this.setState({ isLoader: false })
      alert(err); 
      console.error(err); 
      // EditPostStore.loadGallery = false; 
    });

  
  }

  @action addTakenVideoToGallery_Old() {

    showLog("FETCH VIDEO PATH 0 ==> "+JSON.stringify(this.lastTakenPicture))

    let video = new Picture(
      { uri: this.lastTakenPicture.path },
      { uri: this.lastTakenPicture.path },
      this.gallery
    );

    video.videoUrl = this.lastTakenPicture.videoUrl;

    showLog("FETCH VIDEO PATH 1 ==> "+JSON.stringify(this.lastTakenPicture))
    let uri = {"uri":this.lastTakenPicture.path}

    this.gallery.arrTakenPictures.push(uri)

    this.gallery.addPicture(video);

    this.gallery.wasOpened = true;
  }

  @action async addTakenPictureToGallery() {

    let creatPic = new EditPostStore()
    let userId = UserStore.user.id;

    // this.gallery.arrSelectedImages.push(this.lastTakenPicture)
    // await creatPic.setTextToImage(this.lastTakenPicture.uri, "Hairfolio_" + userId, 54)
    // this.lastTakenPicture.uri = creatPic.newPath

    // setTimeout(() => {

      let picture = new Picture(
        { uri: this.lastTakenPicture.uri },
        { uri: this.lastTakenPicture.uri },
        this.gallery
      );

      if (this.lastTakenPicture.id) {
        picture.localId = this.lastTakenPicture.id;
      }

      this.gallery.addPicture(picture);

      this.gallery.wasOpened = true;

    // }, 5000)


  }

  @action selectPicture(picture) {
    this.gallery.pictures.map((item, i) => {
      if(item.isVideo) {
        this.isVideoSelected = true;
      }
    })

    this.gallery.arrSelectedImages.map((item, i) => {
      if(item.isVideo) {
        this.isVideoSelected = true;
      }
    });

    if (picture.selectedNumber == null && this.selectedPictures.length < imagesSelectedLimit) {
      showLog("Inside if ==> ");
      if(!this.isVideoSelected) {
        this.selectedPictures.push(picture);
        picture.selectedNumber = this.selectedPictures.length;
      } else {
        if(picture.isVideo) {
          showAlert('You can\'t post more than one video.')
        } else {
          this.selectedPictures.push(picture);
          picture.selectedNumber = this.selectedPictures.length;
        }
      }
    } else {
      // if (!pic.key) {
      //   pic.key = count++;
      // }
      if (!picture.key) {
        picture.key = count++;
      }
      const pictureIndex = this.selectedPictures.findIndex(pic => pic.key === picture.key);
      if (pictureIndex !== -1) {
        this.selectedPictures.splice(pictureIndex, 1);
        this.selectedPictures.forEach((pic, i) => pic.selectedNumber = (i >= pictureIndex) ? pic.selectedNumber - 1 : pic.selectedNumber);
        picture.selectedNumber = null;
        this.isVideoSelected = false;
      }
    }
    for (var i=0;i<this.selectedPictures.length;i++) {
      if(this.selectedPictures[i].isVideo) {
        this.isVideoSelected = true;
      }
    }
  }

  imageLoaded() {
    /*
    this.loadedImages++;

    if (this.loadedImages % 50 == 0 && this.imageData.length > 0 && this.loadedImages < 1200) {

      // don't load next images so we have time to render
      setTimeout(() => {
        let newImages = this.imageData.splice(0, 50).map((el) => new LibraryPicture(el, this));
        this.libraryPictures = this.libraryPictures.concat(newImages);
      }, 100);
    }
    */
  }

  updateLibraryPictures() {

    this.libraryPictures = [];
    PhotoAlbum.getPhotosFromAlbums(this.groupName, (data) => {
      this.imageData = data.reverse();
      // load first 50 images and then continue ones they are loaded
      this.libraryPictures = this.imageData.map((el) => new LibraryPicture(el, this));
    });

    AlbumStore.load();
  }

  @computed get libraryTitle() {
    return `Select Media (${this.selectedPictures.length})`;
  }

  @computed get libraryDataSource() {
    let arr = this.libraryPictures.slice();
    let newArr = [];
    let counter = 0;

    while (counter < arr.length) {
      let content = [];
      for (let a = 0; a < 4; a++) {
        if (counter + a < arr.length) {
          content.push(arr[counter + a]);
        } else {
          content.push(null);
        }
      }

      newArr.push(content);
      counter += 4;
    }

    return newArr;
  }

  @action changeGroupName(newName) {
    if (this.groupName != newName) {
      this.groupName = newName;
      this.libraryPictures = [];
      this.selectedPictures = [];
      this.updateLibraryPictures();
    }
  }

  @action changeInputMethod(name) {
    this.gallery.arrSelectedImages.map((item, i) => {
      if(item.isVideo) {
        this.isVideoSelected = true;
      }
    });

    this.gallery.pictures.map((item, i) => {
      if(item.isVideo) {
        this.isVideoSelected = true;
      }
    })

    if(name == 'Video')
    {
      if(!this.isVideoSelected) {
        this.inputMethod = name;
      } else {
        showAlert('You can\'t post more than one video.')
      }
    } else {
      this.inputMethod = name;
    }

    if (this.inputMethod == 'Library') {
      if(this.isVideoSelected && this.gallery.pictures.length == 0) {
        showLog('Not reloading because video is selected')
      } else {
        this.updateLibraryPictures();
      }
    }

    if (this.inputMethod == 'Photo') {
      this.updateLibraryPictures();
    }
  }

  @computed get recordedTimeDisplay() {
    let time = this.recordedTime;
    const minutes = Math.floor(time / 60);
    const seconds = time - 60 * minutes;
    let secondsDisplay = seconds < 10 ? '0' + seconds : seconds;
    let minutesDisplay = minutes < 10 ? '0' + minutes : minutes;

    return `${minutesDisplay}:${secondsDisplay}`;
  }

  @computed get title() {
    if (this.inputMethod == 'Library') {
      return this.groupName;
    } else if (this.inputMethod == 'Video') {
      if (this.isRecording) {
        return this.recordedTimeDisplay;
      } else {
        return this.inputMethod;
      }
    } else {
      return this.inputMethod;
    }
  }


  @computed get hashTagsText() {
    let text = '';
    // console.log('NEW Gallery==>'+JSON.stringify(this.gallery.pictures))

    for (let picture of this.gallery.pictures) {

      for (let tag of picture.tags) {
        if (tag.type == 'hashtag' && tag.x >= 0) {
          text += ' #' + tag.hashtag;
        }
      }
    }
    return text;
  }

  async uploadPicOriginalCloudinary(path,i) {


    // showLog("Before crop ==> "+JSON.stringify(path))
    // const uri = await ImageResizer.createResizedImage(path, 500, 500 * (4 / 3), 'JPEG', 100, 0);
    const uri = path
    // showLog("After crop ==> "+JSON.stringify(uri))

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
    showLog("Picture cloudinary before if ==>" + JSON.stringify(res));

    if (res) {

      let newObj = JSON.stringify(res)
      newObj = JSON.parse(newObj)
      let newObj1 = JSON.parse(newObj._bodyInit)

        this.newCloudUrl = newObj1.url
        showLog("CLOUD BEFORE STORING")

        if(this.arrReqParam.photos_attributes[i])
        {
           return this.arrReqParam.photos_attributes[i].asset_url = newObj1.url
        }
        else
        {
          return  this.newCloudUrl = newObj1.url
        }        
      }
    else {
      alert("Failed text mark Image to upload")
    }
  }

  async uploadPic(path,i) {
    const uri = path
    let formdata = new FormData();

    var currentDate = (new Date).getTime()+'_';
    formdata.append('uploader[image_url]', {
      type: 'image/jpeg',
      uri,
      name: 'upload_'+currentDate+'.jpg',

    });
    
    formdata.append('uploader[folder_name]','post');

    formdata.append('uploader[folder_name]','post');


    showLog("CREATE POST STORE FORM DATA ==> "+JSON.stringify(formdata))

    let preset = EnvironmentStore.environment.cloud_preset;
    let cloudName = EnvironmentStore.environment.cloud_name;
    let url = BASE_URL+"file_upload";

    showLog("URL PIC==>" + JSON.stringify(url));
    showLog("FORMDATA PIC==>" + JSON.stringify(formdata));
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
    showLog("Picture cloudinary before if ==>" + JSON.stringify(res));

    if (res) {

      let newObj = JSON.stringify(res)
      newObj = JSON.parse(newObj)
      let newObj1 = JSON.parse(newObj._bodyInit)

        this.newCloudUrl = newObj1.image_url.url
        showLog("CLOUD BEFORE STORING" + JSON.stringify(newObj1))

        if(this.arrReqParam.photos_attributes[i])
        {
           return this.arrReqParam.photos_attributes[i].asset_url = newObj1.image_url.url
        }
        else
        {
          return  this.newCloudUrl = newObj1.image_url.url
        }        
      }
    else {
      alert("Failed text mark Image to upload")
    }
  }

  async uploadWaterMarkedImages(data,navigator){

          this.isUploadFinished = true;
          data.post.photos_attributes = this.arrReqParam.photos_attributes
          this.finishUploadingPost(data,navigator)
  }
  
  async uploadEditWaterMarkedImages(data,navigator){

          this.isUploadFinished = true;
          data.post.photos_attributes = this.arrReqParam.photos_attributes
          this.finishEditUploadingPost(data,navigator)
    }

  //UPLOADS WATER MARKED IMAGES
  async uploadWaterMarkedImages_old(data,navigator){

    
   this.arrWaterMarkedImages.map(async (obj2,i) => {

    showLog("BEFORE LOOP ==> "+JSON.stringify(obj2) + "LOOP ==> "+i)
    await this.uploadPic(obj2,i)
    this.arrCloudUrl.push(this.newCloudUrl)
    showLog("ARRAY CLOUD URL COUNT ==> "+this.arrWaterMarkedImages.length)
    if(this.arrWaterMarkedImages.length == this.arrCloudUrl.length)
    {
      this.isUploadFinished = true;
      if(this.isUploadFinished)
      {
        data.post.photos_attributes = this.arrReqParam.photos_attributes
        this.finishUploadingPost(data,navigator)
      }
    }
   })
  }

  async setTextToImage(url, textToSet, i) {

    showLog("NUMBER OF TIMES IN WATERMARK LOOP ==> " + i + url)
    // let uri = url 
    return await Marker.markText({
      src: url,
      text: textToSet,
      position: 'bottomCenter', //'topCenter',
      color: '#B2BABB',
      fontName: 'Arial-BoldItalicMT',
      fontSize: 30, //textSize,
      scale: 1,
      quality: 100,
    })
      .then((path) => {
        showLog("PATH TO EDITED IMAGE ==>" + JSON.stringify(path))
        // let create_pic = await new EditPostStore()
        return this.newPath = path;
        //  alert("PUSH OP ==> "+path)
        // return this.arrWaterMarkedImages.push(path)

      })
      .catch((err) => {
        alert("Failed to edit image" + url + err)
      })

  }


  async download(url1) {
    // alert("url Cloud ==>"+JSON.stringify(url1.asset_url))

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
      .then(async res => {
        // alert("DOWNLOADED IMAGES ==>" + res.data);
        // await this.setTextToImage("file://" + res.data, "Hairfolio");

        this.arrDownloadedImages.push(res.data)
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

  async finishEditUploadingPost(data, navigator) {
    
    window.postData = data;

    this.loadingText = 'Publishing the post';
    ShareStore.share(data.post.photos_attributes[0].asset_url);


    // let objPost = data.post;
    // objPost['id'] = this.postId;
    // data = objPost;
    
    showLog("Edit post ==>" + JSON.stringify(data))
    // showLog("Edit post editPostData==>" + JSON.stringify(EditPostStore.editPostData))
    // let tempData = {
    //   'description': data.post.description
    // }

    // let finalData={'post':tempData}
    // showLog("Edit post ==> temp==> " + JSON.stringify(tempData))
    return;
    let res = await ServiceBackend.putEditPost('posts/'+this.postId, data);

    const contactsDetails = (AddBlackBookStore.selectedItems) ?
      await Promise.all(AddBlackBookStore.selectedItems
        .map(contact => ServiceBackend.get(`contacts/${contact.user.id}`))) :
      [];
    window.postRes = res;

    if (res.status != 201) {
      alert('A backend error occured: ' + JSON.stringify(res));
    } else {
      for (let hairfolio of ShareStore.selectedHairfolios) {
        ServiceBackend.pinHairfolio(hairfolio, res.post);
      }

      for (let user of ShareStore.selectedUsers) {
        ServiceBackend.sendPostMessage(UserStore.user.id, user.user, res.post);
      }

      for (let contact of contactsDetails) {
        ServiceBackend.addPostToBlackBook(contact, res.post);
      }
      
     

      this.arrCloudUrl = []
      this.arrWaterMarkedImages = []
      this.arrReqParam = []
      this.gallery.arrSelectedImages = [];
      this.gallery.arrTakenPictures = []
      this.isVideoSelected = false;
      // creatPostStr.gallery.arrTakenPictures = [];
      FeedStore.reset();
      FeedStore.load();
      navigator.popToRoot({ animated: true });
      navigator.switchToTab({
        tabIndex: 0,
      });
      setTimeout(() => this.reset(), 1000);
    }
    this.isLoading = false
}

  async finishUploadingPost(data,navigator){

      window.postData = data;

      this.loadingText = 'Publishing the post';
      ShareStore.share(data.post.photos_attributes[0].asset_url);
      showLog("Create post ==>" + JSON.stringify(data))
      let res = await ServiceBackend.post('posts', data);

      const contactsDetails = (AddBlackBookStore.selectedItems) ?
        await Promise.all(AddBlackBookStore.selectedItems
          .map(contact => ServiceBackend.get(`contacts/${contact.user.id}`))) :
        [];
      window.postRes = res;

      if (res.status != 201) {
        alert('A backend error occured: ' + JSON.stringify(res));
      } else {
        for (let hairfolio of ShareStore.selectedHairfolios) {
          ServiceBackend.pinHairfolio(hairfolio, res.post);
        }

        for (let user of ShareStore.selectedUsers) {
          ServiceBackend.sendPostMessage(UserStore.user.id, user.user, res.post);
        }

        for (let contact of contactsDetails) {
          ServiceBackend.addPostToBlackBook(contact, res.post);
        }
        
       

        this.arrCloudUrl = []
        this.arrWaterMarkedImages = []
        this.arrReqParam = []
        this.gallery.arrSelectedImages = [];
        this.gallery.arrTakenPictures = []
        this.isVideoSelected = false;
        // creatPostStr.gallery.arrTakenPictures = [];
        FeedStore.reset();
        FeedStore.load();
        navigator.popToRoot({ animated: true });
        navigator.switchToTab({
          tabIndex: 0,
        });
        setTimeout(() => this.reset(), 1000);
      }
      this.isLoading = false
  }

  

  @action async postPost(navigator) {
    
    try {
      
      this.isLoading = true;
      this.loadingText = 'Uploading..';
      

      let data = await this.gallery.toJSON();
      showLog("Create post asset_url ==>" + JSON.stringify(data))

      this.arrReqParam = data.post;
      let userId = UserStore.user.id;

      showLog("TAKEN PICTURE COUNT ==> "+this.gallery.arrTakenPictures.length)
      showLog("SELECTED PICTURE COUNT ==> "+this.gallery.arrSelectedImages.length)
      showLog("ALL PICTURE COUNT ==> "+data.post.photos_attributes.length)
 
      let old_SelectedArrayCount = this.gallery.arrSelectedImages.length;

      if(this.gallery.arrTakenPictures.length > 0)
      {
        for(var i=0;i<this.gallery.arrTakenPictures.length;i++)
        {
          this.gallery.arrSelectedImages.push(this.gallery.arrTakenPictures[i])
        }
      }

      showLog("SELECTED PICTURE COUNT AFTER LOOP ==> "+this.gallery.arrSelectedImages.length)

      let total = this.gallery.arrTakenPictures.length + old_SelectedArrayCount

      if(this.gallery.arrSelectedImages.length == total)
      {
        this.gallery.arrSelectedImages.map(async (obj, i) => {

          showLog("IN SELECTD ARRAY MAPPING ==> "+JSON.stringify(obj.uri))
        //BELOW COMMENTED CODE IS FOR WATERMARKING THE POST IMAGE

          // await this.setTextToImage(obj.uri, "Hairfolio_"+userId,i);
          // this.arrWaterMarkedImages.push(this.newPath)
  
          // if (this.gallery.arrSelectedImages.length == this.arrWaterMarkedImages.length) {
           
            await this.uploadWaterMarkedImages(data,navigator)
           
          // }
        })
      }
    } catch (err) {
      this.isLoading = false;
      alert('An error occured ' + err.toString());
    }
  }

  @action async editPost(navigator) {
    
    try {
      
      this.isLoading = true;
      this.loadingText = 'Uploading..';
      

      let data = await this.gallery.toEditJSON();
      showLog("edit post asset_url ==>" + JSON.stringify(data))

      this.arrReqParam = data.post;
      let userId = UserStore.user.id;

      showLog("TAKEN PICTURE COUNT ==> "+this.gallery.arrTakenPictures.length)
      showLog("SELECTED PICTURE COUNT ==> "+this.gallery.arrSelectedImages.length)
      showLog("ALL PICTURE COUNT ==> "+data.post.photos_attributes.length)
 
      let old_SelectedArrayCount = this.gallery.arrSelectedImages.length;

      if(this.gallery.arrTakenPictures.length > 0)
      {
        for(var i=0;i<this.gallery.arrTakenPictures.length;i++)
        {
          this.gallery.arrSelectedImages.push(this.gallery.arrTakenPictures[i])
        }
      }

      showLog("SELECTED PICTURE COUNT AFTER LOOP ==> "+this.gallery.arrSelectedImages.length)

      let total = this.gallery.arrTakenPictures.length + old_SelectedArrayCount

      if(this.gallery.arrSelectedImages.length == total)
      {
        this.gallery.arrSelectedImages.map(async (obj, i) => {

          showLog("IN SELECTD ARRAY MAPPING ==> "+JSON.stringify(obj.uri))
        //BELOW COMMENTED CODE IS FOR WATERMARKING THE POST IMAGE

          // await this.setTextToImage(obj.uri, "Hairfolio_"+userId,i);
          // this.arrWaterMarkedImages.push(this.newPath)
  
          // if (this.gallery.arrSelectedImages.length == this.arrWaterMarkedImages.length) {
           
            await this.uploadEditWaterMarkedImages(data,navigator)
           
          // }
        })
      }
    } catch (err) {
      this.isLoading = false;
      alert('An error occured ' + err.toString());
    }
  }
};

const store = new EditPostStore();

window.postStore = store;

export default store;
