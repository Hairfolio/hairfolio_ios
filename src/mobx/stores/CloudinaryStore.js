import {ImageEditor} from 'react-native';
import {
  action,
  observable,
  computed
} from 'mobx';

import { LOADING, LOADING_ERROR, READY } from '../../constants';
import utils from '../../utils';
import EnvironmentStore from './EnvironmentStore';

class CloudinaryStore {
  @observable cloudinaryStates;

  constructor() {
    this.cloudinaryStates = observable.map();
  }

  @action upload = async (uri, {width, height}, opts = {}, handle) => {
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
}

export default new CloudinaryStore();
