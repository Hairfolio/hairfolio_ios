import { _ } from 'Hairfolio/src/helpers';
import { action, computed, observable } from 'mobx';
import { NativeModules, Image } from 'react-native';
import { v4 } from 'uuid';
import ServiceBackend from '../../backend/ServiceBackend';
import { showLog, showAlert, windowWidth, h, COLORS } from '../../helpers';
import AlbumStore from './AlbumStore';
import FilterStore from './FilterStore';
import {ListView} from 'react-native';
import Picture from './Picture';



let PhotoAlbum = NativeModules.PhotoAlbum;

let count = 0;
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


class Gallery {

  @observable bind_products = [];
  @observable photos_attr = [];

  @observable pictures = [];
  @observable selectedPicture = null;
  @observable selectedPictureId = null;
  
  @observable filterStore;


  @observable selectedTag = null;
  @observable description = '';


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


  @action reset() {
    this.postId = null;
    this.selectedPicture = null;
    this.selectedTag = null;
    this.pictures = [];
    this.description = '';
    this.wasOpened = false;
    this.bind_products = [];
    this.arrSelectedImages = [];
    this.photos_attr = [];
  }

  constructor() {
    window.gallary = this;

    setTimeout(() => {
      this.filterStore = new FilterStore(this);
    });
  }

  @action deleteSelectedPicture() {
    if(this.selectedPicture && this.selectedPicture.isProduct && this.selectedPicture.product_id) {
      showLog("this.selectedPicture.isLocallyAdded ==> " + this.selectedPicture.isLocallyAdded )
      if(this.selectedPicture.isLocallyAdded == 'undefined' || !this.selectedPicture.isLocallyAdded) {
        showLog("Remote product")
        this.bind_products.map((el, pos) => {
          if(el.id = this.selectedPicture.product_id) {
            el._destroy = true;
            this.bind_products[pos] = el;
          }
        })
      } else {
        showLog("local product")
        this.bind_products = this.bind_products.filter(el => el.id != this.selectedPicture.product_id);
      }
    } else if(this.selectedPicture) {
      if(this.selectedPicture.isLocallyAdded == 'undefined' || !this.selectedPicture.isLocallyAdded) {
        let obj = {
          id: this.selectedPicture.id,
          _destroy: true
        }
        this.photos_attr.push(obj);
        showLog("Remote picture")
      } else {
        showLog("local picture")
      }
    }
    this.pictures = this.pictures.filter(el => el != this.selectedPicture);

    this.selectedPicture = _.first(this.pictures);
  }

  @action async addLibraryPictures(libraryPictures, isLocallyAdded = false) {
    // showLog("NOTE ID ==> " + noteId);
      for(var i=0;i<libraryPictures.length;i++)
      {
        this.arrSelectedImages.push(libraryPictures[i])
      }

      let pictures = libraryPictures.map((el) => {
        let pic = new Picture({ uri: el.uri }, { uri: el.uri }, this);

        if (el.isVideo) {
          pic.videoUrl = el.videoUrl;
          pic.identifier = el.id;
        }

        if(isLocallyAdded) {
          showLog("isLocallyAdded ==> " + isLocallyAdded);
          pic.isLocallyAdded = true;
        }

        return pic;
      });

      for (let el of this.pictures) {
        pictures.push(el);
      }

      this.displayPicData(pictures)
      this.pictures = pictures;
      this.selectedPicture = _.first(this.pictures);
  }

  @action async addLibraryPicturesFromEdit(libraryPictures) {
      for(var i=0;i<libraryPictures.length;i++)
      {
        this.arrSelectedImages.push(libraryPictures[i])
      }

      let pictures = libraryPictures.map((el) => {
        let pic = new Picture({ uri: el.asset_url }, { uri: el.asset_url }, this);
        pic.id = el.id;
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
  }

  @action async addCameraPicture(cameraPicture, isLocallyAdded = false) {
    this.arrSelectedImages.push(cameraPicture);

    let pictures = [];
    let pic = new Picture({ uri: cameraPicture.path }, { uri: cameraPicture.path }, this);
    if(isLocallyAdded) {
      showLog("isLocallyAdded ==> " + isLocallyAdded);
      pic.isLocallyAdded = true;
    }
    pictures.push(pic);

    for (let el of this.pictures) {
      pictures.push(el);
    }

    this.displayPicData(pictures)
    this.pictures = pictures;
    this.selectedPicture = _.first(this.pictures);    
  }

  @action async addLibraryProduct(libraryProduct, isLocallyAdded = false) {
    showLog("BEFORE MANIPULATING ==> " );
    this.displayPicData(libraryProduct)
    this.bind_products.push(libraryProduct);
    this.arrSelectedImages.push(libraryProduct);

    let pictures = [];
    let pic = new Picture({ uri: libraryProduct.product_image }, { uri: libraryProduct.product_image }, this);
    pic.product_id = libraryProduct.id;
    pic.isProduct = true;
    if(isLocallyAdded) {
      showLog("isLocallyAdded ==> " + isLocallyAdded);
      pic.isLocallyAdded = true;
    }
    pictures.push(pic);
     

    for (let el of this.pictures) {
      pictures.push(el);
    }

    this.displayPicData(pictures)
    this.pictures = pictures;
    this.selectedPicture = _.first(this.pictures);
}

   
  async displayPicData(response) {
    for (key in response) {
      showLog("store displayPicData ==>" + key + " value ==>" + JSON.stringify(response[key]));
    }
  }

  async toJSON() {

    let items = [];
    let product_ids = [];

    showLog("BEFORE UPLOADING PICTURES ==> ");
    console.log("THIS.PiCtures ==> " + JSON.stringify(this.pictures));
    // this.displayPicData(this.pictures[0])
    if (this.pictures.length > 0) {
      for (let pic of this.pictures) {
        if (await !pic.isProduct || pic.isProduct == false) {
          let uri = await pic.source.uri;
          if (await uri.includes("https")) {
            // How to get thumb_url in case of product,
            // DO i need to upload event if its a product and i have only url not local uri
            await items.push(pic);
          } else {
            let el = await pic.toJSON();
            await items.push(el);
          }
        }
      }
    }
    for (let product of this.bind_products) {
      await product_ids.push(product.id);
    }

    let obj = await {
      photos_attributes: items,
      product_ids: product_ids
    };
    return await obj;
  } 
  
  async toEditJSON() {

    let items = [];
    let product_ids = [];

    if(this.photos_attr.length > 0) {
      items = this.photos_attr;
    }

    showLog("BEFORE EDITING PICTURES ==> ");
    // this.pictures.map((el) => {
    //   this.displayPicData(el);
    // })

    showLog("BEFORE PICTURES.LENGHT ==> " + this.pictures.length)
    let myAddedPictures = [];
    myAddedPictures = this.pictures;
    myAddedPictures = await myAddedPictures.filter(el => el.isLocallyAdded && el.isLocallyAdded == true);
    setTimeout(() => {
      showLog("AFTER PICTURES.LENGHT ==> " + myAddedPictures.length)
    }, 3000)

    if (await myAddedPictures.length > 0) {
      for (let pic of await myAddedPictures) {
        if (await !pic.isProduct || pic.isProduct == false) {
          let uri = await pic.source.uri;
          showLog("URI ==> " + uri);
          if (await uri.includes("https")) {
            await items.push(pic);
          } else {
            let el = await pic.toJSON();
            await items.push(el);
          }
        }
      }
    }

    var products_attr = [];
    for (let product of this.bind_products) {
      showLog("PRODUCT 11 ==> " + JSON.stringify(product))
      if(product._destroy != 'undefined' && product._destroy) {
        let tempObj = {
          id: product.id,
          _destroy: true
        };
        products_attr.push(tempObj)
      } else {
        product_ids.push(product.id);
      }
    }

    let obj = await {
      photos_attributes: items,
      product_ids: product_ids,
      products_attributes: products_attr
    };
    showLog("EDIT JSON OBJ ==> " + JSON.stringify(obj));
    return await obj;
  } 
}

const imagesSelectedLimit = 10;

class CreateLogStore {
  @observable isInViewMode = false;
  @observable noteId = null;
  @observable loadGallery = false;
  @observable inputMethod = 'Photo';
  @observable isOpen = false;
  @observable lastTakenPicture = {};
  @observable groupName = 'Recently Added';
  @observable libraryPictures = [];
  @observable selectedPictures = [];
  @observable gallery = new Gallery();
  @observable isLoading = false;
  @observable isLoadingTimelineNextPage = false;
  @observable isCreatingNote = false;
  @observable loadingText;
  @observable isNoteCreated = false;

  // for notes
  @observable cardNotesArray = [];

  @observable productsArray = [];
  @observable nextPage;
  @observable timelineArray = [];
  @observable timelineNextPage;


  constructor() {
    this.isLoadingNextPage = false;
    this.isLoadingTimelineNextPage = false;
    this.productsArray = [];
    this.timelineArray = [];
  }

  @action addLibraryPicturesToGallary(isLocallyAdded = false) {
    this.gallery.addLibraryPictures(
      this.selectedPictures, isLocallyAdded
    );

    this.gallery.wasOpened = true;

    this.gallery.selectedPicture = _.first(this.gallery.pictures);
  }

  @action addLibraryProductsToGallary(product, isLocallyAdded = false) {
    this.gallery.addLibraryProduct(product, isLocallyAdded);

    this.gallery.wasOpened = true;

    this.gallery.selectedPicture = _.first(this.gallery.pictures);
  }
  

  @action reset() {
    this.noteId = null;
    this.isNoteCreated = false;
    this.selectedPicture = null;
    this.selectedTag = null;
    this.pictures = [];
    this.description = '';
    this.wasOpened = false;
    this.bind_products = [];
    this.arrSelectedImages = [];
    this.isInViewMode = true;
  }


  reset(resetGallary = true) {
    this.isInViewMode = false;
    this.inputMethod = 'Photo';
    this.lastTakenPicture = {};
    // this.groupName = 'Camera Roll';
    this.groupName = 'Recents'; //ly Added';
    this.libraryPictures = [];
    this.selectedPictures = [];
    this.isVideoSelected = false;
    if (resetGallary) {
      this.isNoteCreated = false;
      this.isOpen = false;
      this.gallery.reset();
      this.noteId = null;

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
    AlbumStore.loadWithoutVideo();
    PhotoAlbum.getPhotosFromAlbumsWithoutVideo(this.groupName, (data) => {
      this.imageData = data.reverse();
      // load first 50 images and then continue ones they are loaded
      this.libraryPictures = this.imageData.map((el) => new LibraryPicture(el, this));
    });

  }

  @computed get libraryTitle() {
    // return `Select Media`;
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
  // getImageTypeIOS(item) {
  //   //  alert(JSON.stringify(item))
  //   if (item) {
  //     var temp = item.split(".");
  //     let newChar = temp[temp.length - 1];
  //     return newChar;
  //   }
  // }

  async formatedNote(noteName) {
    let tempNote = [];
    this.cardNotesArray.map((value, index) => {
      if (value.name == noteName) {
        value.detailNotes.map((noteValue, noteIndex) => {
          if (noteValue.text.length > 0) {            
            tempNote.push(noteValue.text);
          }
        })
      }
    })
    return tempNote;
  } 

  async structureNotesObject(formulaNotesObj, NotesObj) {
    let tempNote = [];
    
    tempNote = [
      {
        name: "Formula Notes",
        color: COLORS.WHITE,
        expand: false,
        detailNotes: [
          {
            id: 1,
            text: ""
          },
          {
            id: 2,
            text: ""
          },
          {
            id: 3,
            text: ""
          }
        ]
      },
      {
        name: "Notes",
        color: 'rgb(223,224,225)',
        expand: false,
        detailNotes: [
          {
            id: 1,
            text: ""
          },
          {
            id: 2,
            text: ""
          },
          {
            id: 3,
            text: ""
          }
        ]
      }
    ];

    let obj = {};
    await formulaNotesObj.map(async(value, index) => {
      tempNote[0].detailNotes[index].text = await value;
    });

    await NotesObj.map(async(value, index) => {
      tempNote[1].detailNotes[index].text = await value;
    });

    showLog("TEMP NOTE ==> " + JSON.stringify(tempNote))
    return await tempNote;
  } 

  async createLogApi(contactId, noteWithImage = null) {
    this.isCreatingNote = true;

    let notes={
      "note": {
        "formula_note": await this.formatedNote('Formula Notes'),
        "simple_note": await this.formatedNote('Notes'),
        "contact_id":contactId
      }
    }

    if(noteWithImage != null) {
      let temp = notes.note;
      notes.note = await {...temp, ...noteWithImage}
    }

    console.log("Notes params Final =>" + JSON.stringify(notes));

    let res = await ServiceBackend.post(`notes`, notes);
    if (res) {
      this.isCreatingNote = false
      this.isNoteCreated = true;
      if (res.errors) {
        showAlert(res.errors);
      }
      return res;
    } else {
      this.isCreatingNote = false
      return null;
    }
  }

  async updateLogApi(contactId, noteWithImage = null) {
    this.isCreatingNote = true;

    let notes={
      "note": {
        "formula_note": await this.formatedNote('Formula Notes'),
        "simple_note": await this.formatedNote('Notes'),
        "contact_id":contactId
      }
    }

    if(noteWithImage != null) {
      let temp = notes.note;
      notes.note = await {...temp, ...noteWithImage}
    }

    console.log("Notes params Final =>" + + this.noteId + " ==> " + JSON.stringify(notes));

    let res = await ServiceBackend.put(`notes/${this.noteId}`, notes);
    if (res) {
      this.isCreatingNote = false
      if (res.errors) {
        showAlert(res.errors);
      } else {
        this.isNoteCreated = true;
        return res;
      }
    } else {
      this.isCreatingNote = false
      return null;
    }
  }

  @computed get dataSourceForFilter() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    // alert(this.products.length)
    return ds.cloneWithRows(this.productsArray.slice());
  }

  @computed get dataSourceForFilterTimeline() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    // alert(this.products.length)
    return ds.cloneWithRows(this.timelineArray.slice());
  }

  async loadNextPageNew(search) {
    console.log('Next page==>'+JSON.stringify(this.nextPage))
    if (!this.isLoadingNextPage && this.nextPage != null) {
      this.isLoadingNextPage = true;           
      let res = await this.getProductsApi(search);     
      if(res){
        this.isLoading = false;     
        let products = res.products;
        let meta = res.meta;
        this.nextPage = meta.next_page;
        if (products) {
          // res = products;        
          if (products.length > 0) {
            for (let a = 0; a < products.length; a++)  {
              this.productsArray.push(products[a]);
            }
            showLog("Product list=>"+JSON.stringify(products))
            // this.productListSelector.setData(products, true, true);
            // this.productListSelector.show();
          } else {
            // this.productListSelector.hide();
          }
          this.isLoadingNextPage = false;
          this.isLoading = false;
          return products;
        } else {
          this.isLoadingNextPage = false;
          this.isLoading = false;
          // this.productListSelector.closeAfterError();
          throw res.errors;
        }    
      }
    }
  }

  async getProductsApi(searchText) {
    showLog("products response==> method call")
    this.isLoading = true;

    let productParams={
      "search": searchText,
      "page": this.nextPage
    }
    console.log("product params==>"+JSON.stringify(productParams))
    let res = await ServiceBackend.post(`searches/filter_products`,productParams);
    if (res) {
      return res;
    } else {
      return null;
    }
  }

  async onProductsload(search) {
    this.isLoading = true;
    this.productsArray = [];
    this.nextPage = 1;

    showLog("LOADPRODUCT TAG STORE ==> " + this.isLoadingNextPage + " => " + this.nextPage )

    await this.loadNextPageNew(search);
    
    this.isLoading = false;
  }

  async onTimelineload(contactId) {
    this.isLoading = true;
    this.timelineArray = [];
    this.timelineNextPage = 1;

    showLog("LOADPRODUCT TAG STORE ==> " + this.isLoadingTimelineNextPage + " => " + this.timelineNextPage )

    await this.loadTimelineNextPage(contactId);
    this.isLoadingTimelineNextPage = false;
    this.isLoading = false;
    showLog("this.isLoadingTimelineNextPage=>"+this.isLoadingTimelineNextPage) 
  }

  async loadTimelineNextPage(contactId) {
    console.log('Next page==>'+JSON.stringify(this.timelineNextPage))
    if (!this.isLoadingTimelineNextPage && this.timelineNextPage != null) {
      this.isLoadingTimelineNextPage = true;           
      let res = await this.getNotesApi(contactId); 
      this.isLoading = false;  
      this.isLoadingTimelineNextPage = false;      
      showLog("this.isLoadingTimelineNextPage=>"+this.isLoadingTimelineNextPage) 
      if(res){
        this.isLoading = false;  
        this.isLoadingTimelineNextPage = false;   
        let notes = res.notes;
        let meta = res.meta;
        this.timelineNextPage = meta.next_page;
        if (notes) {      
          if (notes.length > 0) {
            for (let a = 0; a < notes.length; a++)  {
              this.timelineArray.push(notes[a]);
            }
            showLog("Notes list=>"+JSON.stringify(notes))
          } else {
            // 
          }
          this.isLoadingTimelineNextPage = false;
          this.isLoading = false;
          return notes;
        } else {
          this.isLoadingTimelineNextPage = false;
          this.isLoading = false;
          throw res.errors;
        }    
      }
    }
  }

  async getNotesApi(contactId) {
    showLog("notes response==> method call")
    this.isLoading = true;

    let noteParams = `notes?page=${this.timelineNextPage}&limit=10&contact_id=${contactId}`;
    console.log("notes params==>"+JSON.stringify(noteParams))
    let res = await ServiceBackend.get(`notes?page=${this.timelineNextPage}&limit=10&contact_id=${contactId}`);
    this.isLoading = false;
    if (res) {
      return res;
    } else {
      return null;
    }
  }

  async emailShareApi(title,description,noteId) {
    showLog("emailShareApi ==> method call")
    this.isLoading = true;

    let emailParams={
      "shared_log": {
        "title": title,
        "description": description,
        "note_id": noteId
        }
      }
    
    console.log("emailShareApi params==>"+JSON.stringify(emailParams))
    let res = await ServiceBackend.post(`email_share_log`,emailParams);
    if (res) {
      return res;
    } else {
      return null;
    }
  }

  async shareLogApi(title,description,noteId) {
    showLog("shareLogApi ==> method call")
    this.isLoading = true;

    let shareLogParams={
      "shared_log": {
        "title": title,
        "description": description,
        "note_id": noteId
        }
      }
    
    console.log("shareLogApi params==>"+JSON.stringify(shareLogParams))
    let res = await ServiceBackend.post(`shared_logs`,shareLogParams);
    if (res) {
      return res;
    } else {
      return null;
    }
  }

  async deleteNoteApi(noteId) {
    showLog("deleteNoteApi ==> method call"+noteId)
    this.isLoading = true;    
    
    let res = await ServiceBackend.delete(`notes/${noteId}`);
    if (res) {
      return res;
    } else {
      return null;
    }
  }
  
};

const store = new CreateLogStore();

export default store;
