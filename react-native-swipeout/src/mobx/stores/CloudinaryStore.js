import { action, observable } from 'mobx';
import { ImageEditor } from 'react-native';
import { LOADING, LOADING_ERROR, READY, BASE_URL } from '../../constants';
import { showLog } from '../../helpers';
import utils from '../../utils';
import EnvironmentStore from './EnvironmentStore';
import { toJS } from 'mobx';
import UserStore from './UserStore';

class CloudinaryStore {
  @observable cloudinaryStates;

  constructor() {
    this.cloudinaryStates = observable.map();
  }

  @action uploadOriginalCloudinary = async (uri, { width, height }, opts = {}, handle) => {
    await EnvironmentStore.loadEnv();
    this.cloudinaryStates.set(handle, LOADING);
    return new Promise((resolve, reject) => {
      ImageEditor.cropImage(uri, {
        offset: {
          x: 0,
          y: 0
        },
        size: {
          width,
          height
        },
        displaySize: opts.maxHW ? {
          width: opts.maxHW,
          height: opts.maxHW
        } : null,
        resizeMode: 'cover'
      }, resolve, () => {
        this.cloudinaryStates.set(handle, LOADING_ERROR);
        reject('resize failed')
      });
    }).then((uri) => {
      var formdata = new FormData();
      formdata.append('file', {
        type: 'image/jpeg',
        uri,
        name: 'upload.jpg'
      });

      formdata.append('upload_preset', EnvironmentStore.environment.cloud_preset);
      return window.fetch(
        `https://api.cloudinary.com/v1_1/${EnvironmentStore.environment.cloud_name}/image/upload`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data; boundary=6ff46e0b6b5148d984f148b6542e5a5d'
          },
          body: formdata
        }
      )
        .then(utils.parseJSON)
        .then((response) => {
          showLog("CloudinaryStore uploadOriginalCloudinary ==>" + JSON.stringify(response));
          if (response.status >= 200 && response.status < 300)
            return response;
          else {
            var error = new Error('Cloudinary Error');
            error.data = response.jsonData;
            error.handle = handle;
            this.cloudinaryStates.set(handle, LOADING_ERROR);
            throw error;
          }
        })
        .then((response) => {
          var r = response.jsonData;
          this.cloudinaryStates.set(handle, READY);
          return {
            handle,
            'public_id': r.public_id
          };
        });
    })
  }

  @action upload = async (uri, { width, height }, opts = {}, handle, folderName) => {
    await EnvironmentStore.loadEnv();
    this.cloudinaryStates.set(handle, LOADING);
    return new Promise((resolve, reject) => {
      ImageEditor.cropImage(uri, {
        offset: {
          x: 0,
          y: 0
        },
        size: {
          width,
          height
        },
        displaySize: opts.maxHW ? {
          width: opts.maxHW,
          height: opts.maxHW
        } : null,
        resizeMode: 'cover'
      }, resolve, () => {
        this.cloudinaryStates.set(handle, LOADING_ERROR);
        reject('resize failed')
      });
    }).then((uri) => {
      var formdata = new FormData();
      
      var currentDate = (new Date).getTime()+'_';
      formdata.append('uploader[image_url]', {
        type: 'image/jpeg',
        uri,
        name: 'upload_'+currentDate+'.jpg'
      });

      formdata.append('uploader[folder_name]',folderName);

      let url = BASE_URL+"file_upload";
      // formdata.append('upload_preset', EnvironmentStore.environment.cloud_preset);
      return window.fetch(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data; boundary=6ff46e0b6b5148d984f148b6542e5a5d'
          },
          body: formdata
        }
      )
        .then(utils.parseJSON)
        .then((response) => {
          // alert(JSON.stringify(response));
          showLog("AWS upload ==>" + JSON.stringify(response));
          if (response.status >= 200 && response.status < 300)
            return response;
          else {
            var error = new Error('Cloudinary Error');
            error.data = response.jsonData;
            error.handle = handle;
            this.cloudinaryStates.set(handle, LOADING_ERROR);
            throw error;
          }
        })
        .then((response) => {
          var r = response.jsonData;
          showLog('handle upload ==>' + JSON.stringify(response));
          this.cloudinaryStates.set(handle, READY);
          showLog('AWS upload2 ==>' + JSON.stringify(r));
          UserStore.user.avatar_cloudinary_id = r.image_url.url;
          return {
            handle,
            'public_id': r.image_url.url//r.public_id
          };
        });
    })
  }
}

export default new CloudinaryStore();
