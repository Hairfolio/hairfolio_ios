import { computed, observable } from 'mobx';
// import { windowHeight } from 'react';
import ReactNative, { NativeModules } from 'react-native';
import Communications from 'react-native-communications';
import ServiceBackend from '../../backend/ServiceBackend';
import { h, showLog, windowHeight, windowWidth } from '../../helpers';
import Picture from '../stores/Picture';
import Post from '../stores/Post';

const RCTUIManager = NativeModules.UIManager;

class ContactDetailsStore {
  @observable mode = 'view';

  @observable isUploadingPicture;
  @observable isLoading;

  @observable picture;
  @observable notes = [];

  // general
  @observable firstName = 'Alan';
  @observable lastName = 'Williams';
  @observable companyName = 'My Company';

  // phone
  @observable phoneMobile = '6156619954';
  @observable phoneHome = '1234567891';
  @observable phoneWork = '0123456789';

  // email
  @observable emailPrimary = 'test@gmail.com';
  @observable emailSecondary = 'test2@gmail.com';

  // address
  @observable addressStreet1 = '214 Overlook Circle';
  @observable addressState = 'California';
  @observable addressPostCode = '37027';
  @observable addressCity = 'Brentwood';
  @observable addressCountry = 'United States';

  @observable isScreenPop = true;

  @computed get hasPrimaryEmail() {
    return this.emailPrimary.length > 0;
  }

  @computed get hasNotes() {
    return this.notes.length > 0;
  }

  @computed get hasAddress() {
    return this.addressStreet1.length > 0;
  }

  @computed get hasSecondaryEmail() {
    return this.emailSecondary.length > 0;
  }


  @computed get hasMobilePhoneNumber() {
    return this.phoneMobile && this.phoneMobile.length > 0;
  }

  @computed get hasHomePhoneNumber() {
    return this.phoneHome && this.phoneHome.length > 0;
  }

  @computed get hasWorkPhoneNumber() {
    return this.phoneWork && this.phoneWork.length > 0;
  }


  constructor() {
    this.sample();
  }

  reset() {
    this.mode = 'new';
    this.picture = null;
    this.firstName = '';
    this.lastName = '';
    this.companyName = '';
    this.phoneMobile = '';
    this.phoneHome = '';
    this.phoneWork = '';
    this.emailPrimary = '';
    this.emailSecondary = '';
    this.addressStreet1 = '';
    this.addressState = '';
    this.addressPostCode = '';
    this.addressCity = '';
    this.addressCountry = '';
    this.notes = [];
    this.isLoading = false;
    this.contactID = '';
  }


  async init(contactId) {
    this.isLoading = true;
    let store = await ServiceBackend.get(`contacts/${contactId}`);
    showLog("ContactDetails=>"+JSON.stringify(store))
    let data = store.contact;
    this.id = store.contact.id;
    this.mode = 'view';

    let conv = (el) => {
      this.isLoading = false;
      return el ? el : '';
    }

    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.contactID = data.id;

    if (data.asset_url) {
      let pic = { uri: data.asset_url, isStatic: true };
      this.picture = new Picture(
        pic,
        pic,
        null
      );

    } else {
      this.picture = null;
    }

    this.companyName = conv(data.company);

    this.phoneMobile = '';
    this.phoneHome = '';
    this.phoneWork = '';

    for (let e of data.phones) {
      if (e.phone_type == 'mobile') {
        this.phoneMobile = e.number;
      } else if (e.phone_type == 'home') {
        this.phoneHome = e.number;
      } else if (e.phone_type == 'work') {
        this.phoneWork = e.number;
      }
    }

    this.emailPrimary = '';
    this.emailSecondary = '';

    for (let e of data.emails) {
      if (e.email_type == 'primary') {
        this.emailPrimary = e.email;
      } else if (e.email_type == 'secondary') {
        this.emailSecondary = e.email;
      }
    }

    this.addressStreet1 = conv(data.address);
    this.addressState = conv(data.state);
    this.addressPostCode = conv(data.zipcode);
    this.addressCity = conv(data.city);
    this.addressCountry = conv(data.country);

    this.notes = await Promise.all(data.posts.map(e => {
      let c = new Post();
      return c.init(e);
    }));
    this.isLoading;
  }

  sample() {
    this.mode = 'view';
    let picObj = require('img/feed_example_profile.png');
    this.picture = new Picture(
      picObj,
      picObj,
      null
    );
    this.firstName = 'Alice';
    this.lastName = 'Williams';
    this.companyName = 'My Company';
    this.phoneMobile = '6156619954';
    this.phoneHome = '1234567891';
    this.phoneWork = '0123456789';
    this.emailPrimary = 'test@gmail.com';
    this.emailSecondary = 'test2@gmail.com';
    this.addressStreet1 = '214 Overlook Circle';
    this.addressState = 'Suite 220';
    this.addressPostCode = '37027';
    this.addressCity = 'Brentwood';
    this.addressCountry = 'United States';
  }


  call(number) {
    Communications.phonecall(number, true);
  }

  message(number) {
    Communications.text(number);
    // alert('messsage:  ' + number);
  }

  sendEmail(email) {
    Communications.email([email], null, null, '', '')
  }

  formatNumber(str) {
    return '(' + str.substr(0, 3) + ') ' + str.substr(3, 3) + '-' + str.substr(6, 4);
  }

  createData() {
    let data = {};

    let add = (a, b) => {
      if (this[a] != null && this[a].length > 0) { data[b] = this[a] };
    }

    add('firstName', 'first_name');
    add('lastName', 'last_name');
    add('companyName', 'company');
    add('addressStreet1', 'address');
    add('addressCity', 'city');
    add('addressPostCode', 'zipcode');
    add('addressState', 'state');
    add('addressCountry', 'country');


    let emails_attributes = [];

    if (this.emailPrimary && this.emailPrimary.length > 0) {
      emails_attributes.push({
        email_type: 'primary',
        email: this.emailPrimary
      });
    }

    if (this.emailSecondary && this.emailSecondary.length > 0) {
      emails_attributes.push({
        email_type: 'secondary',
        email: this.emailSecondary
      });
    }

    data.emails_attributes = emails_attributes;

    data.phones_attributes = [];

    if (this.phoneHome && this.phoneHome.length > 0) {
      data.phones_attributes.push({
        phone_type: 'home',
        number: this.phoneHome
      });
    }

    if (this.phoneMobile && this.phoneMobile.length > 0) {
      data.phones_attributes.push({
        phone_type: 'mobile',
        number: this.phoneMobile
      });
    }

    if (this.phoneWork && this.phoneWork.length > 0) {
      data.phones_attributes.push({
        phone_type: 'work',
        number: this.phoneWork
      });
    }

    if (this.picture != null) {
      data.asset_url = this.picture.source.uri;
    }

    return data;
  }

  async rightHeaderClick(navigator) {
    this.isScreenPop = false;
    if (this.mode == 'view') {
      this.mode = 'edit';

      this.oldValues = {
        picture: this.picture,
        firstName: this.firstName,
        lastName: this.lastName,
        companyName: this.companyName,
        phoneMobile: this.phoneMobile,
        phoneHome: this.phoneHome,
        phoneWork: this.phoneWork,
        emailPrimary: this.emailPrimary,
        emailSecondary: this.emailSecondary,
        addressStreet1: this.addressStreet1,
        addressState: this.addressState,
        addressPostCode: this.addressPostCode,
        addressCity: this.addressCity,
        addressCountry: this.addressCountry
      };

    } else if (this.mode == 'edit') {      
      this.isLoading = true;
      if (this.firstName.length == 0) {
        alert('Please Fill in a firstName');
        this.isLoading = false;
        return;
      }
      if (this.lastName.length == 0) {
        alert('Please Fill in a lastName');
        this.isLoading = false;
        return;
      }
      let data = this.createData();
      let res = await ServiceBackend.put(`contacts/${this.id}`, { contact: data });
      if (res) {
        this.isLoading = false;
        navigator.pop({ animated: true })
        this.mode = 'view';
      }
      
    } else {
      this.isLoading = true;
      if (this.firstName.length == 0) {
        alert('Please Fill in a firstName');
        this.isLoading = false;
        return;
      }
      if (this.lastName.length == 0) {
        alert('Please Fill in a lastName');
        this.isLoading = false;
        return;
      }
      let data = this.createData();
      let res = await ServiceBackend.post('contacts', { contact: data });
      if (res) {
        this.isLoading = false;
        navigator.pop({ animated: true })
      }      
    }
  }

  leftHeaderClick() {
    if (this.mode == 'edit') {
      this.mode = 'view';
      this.picture = this.oldValues.picture;
      this.firstName = this.oldValues.firstName;
      this.lastName = this.oldValues.lastName;
      this.companyName = this.oldValues.companyName;
      this.phoneMobile = this.oldValues.phoneMobile;
      this.phoneHome = this.oldValues.phoneHome;
      this.phoneWork = this.oldValues.phoneWork;
      this.emailPrimary = this.oldValues.emailPrimary;
      this.emailSecondary = this.oldValues.emailSecondary;
      this.addressStreet1 = this.oldValues.addressStreet1;
      this.addressState = this.oldValues.addressState;
      this.addressPostCode = this.oldValues.addressPostCode;
      this.addressCity = this.oldValues.addressCity;
      this.addressCountry = this.oldValues.addressCountry;
    } else {
      this.myBack();
    }
  }

  @computed get rightHeaderText() {
    if (this.mode == 'view') {
      return 'Edit';
    } else {
      return 'Done';
    }
  }

  @computed get title() {
    if (this.mode == 'new') {
      return 'New Contact';
    } else {
      return this.firstName + ' ' + this.lastName;
    }
  }

  @computed get profileImage() {

    if (this.picture == null) {
      return require('img/contact_camera.png');
    } else {
      return this.picture.getSource(120, 120);
    }
  }

  @computed get clientProfileImage() {
    if (this.picture == null) {
      return require('img/profile_placeholder.png');
    } else {
      return this.picture.getSource(120, 120);
    }
  }

  async sendPicture(response) {
    
    showLog("sendPicture ==>"+JSON.stringify(response));

    this.isUploadingPicture = true;

    let pic = { uri: response.uri, isStatic: true };
    let picture = new Picture(
      pic,
      pic,
      null
    );

    picture.folderName = "blackbook";
    // send to cloudinary
    let res = await picture.toJSON();

    showLog("res sendPicture ==>"+JSON.stringify(res));

    pic = { uri: res.asset_url, isStatic: true };

    this.picture = new Picture(
      pic,
      pic,
      null
    );

    this.isUploadingPicture = false;
  }

  scrollToElement(reactNode) {
    RCTUIManager.measure(ReactNative.findNodeHandle(reactNode), (x, y, width, height, pageX, pageY) => {
      RCTUIManager.measure(this.scrollView.getInnerViewNode(), (x2, y2, width2, height2, pageX2, pageY2) => {
        // currentPos: 64
        var currentScroll = 64 - pageY2;
        var differenceY = -pageY - 240 + (windowHeight - 20 - h(88));

        if (currentScroll - differenceY > 0) {
          this.scrollView.scrollTo({ y: currentScroll - differenceY });
        }
      });
    });
  }

}

const store = new ContactDetailsStore();
export default store;

