/**
 * Actions
 */

import {ImageEditor} from 'react-native';

import utils from '../utils';
import Enum from '../lib/enum';

export const cloudinaryTypes = new Enum(
  'UPLOAD_PICTURE',
  'UPLOAD_PICTURE_PENDING',
  'UPLOAD_PICTURE_SUCCESS',
  'UPLOAD_PICTURE_ERROR',
);

/**
 * Action creators
 */

export const cloudinaryActions = {
  upload(uri, {width, height}, opts = {}, handle) {
    return ({getState}) => ({
      type: cloudinaryTypes.UPLOAD_PICTURE,
      meta: {
        immediate: true
      },
      payload: {
        promise: new Promise((resolve, reject) => {
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
          }, resolve, () => reject('resize failed'));
        }).then((uri) => {
          var formdata = new FormData();
          formdata.append('file', {
            type: 'image/jpeg',
            uri,
            name: 'upload.jpg'
          });
          formdata.append('upload_preset', getState().environment.environment.get('cloud_preset'));
          return window.fetch(
            `https://api.cloudinary.com/v1_1/${getState().environment.environment.get('cloud_name')}/image/upload`,
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
              console.log(response.jsonData);
              error.data = response.jsonData;
              throw error;
            }
          })
          .then((response) => {
            var r = response.jsonData;
            console.log(r);
            return r.public_id;
          });
        })
      }
    });
  }
};
