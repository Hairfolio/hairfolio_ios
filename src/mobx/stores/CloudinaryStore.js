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
  @observable states;

  constructor() {
    this.states = {};
  }

  @action upload = async (uri, {width, height}, opts = {}, handle) => {
    let environment = await EnvironmentStore.get();
    this.states[handle] = LOADING;
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
        this.states[handle] = LOADING_ERROR;
        reject('resize failed')
      });
    }).then((uri) => {
      var formdata = new FormData();
      formdata.append('file', {
        type: 'image/jpeg',
        uri,
        name: 'upload.jpg'
      });

      formdata.append('upload_preset', environment.get('cloud_preset'));
      return window.fetch(
        `https://api.cloudinary.com/v1_1/${environment.get('cloud_name')}/image/upload`,
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
          this.states[handle] = LOADING_ERROR;
          throw error;
        }
      })
      .then((response) => {
        var r = response.jsonData;
        this.states[handle] = READY;
        return {
          handle,
          'public_id': r.public_id
        };
      });
    })
  }
}

export default new CloudinaryStore();
