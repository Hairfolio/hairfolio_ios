import React from 'react';
import _ from 'lodash';
import Spinner from 'react-native-spinkit';
import ImagePicker from 'react-native-image-picker';
import {View, Image} from 'react-native';
import PureComponent from '../PureComponent';

import {COLORS, SCALE} from '../../style';

import CustomTouchableOpacity from '../CustomTouchableOpacity';
import Icon from '../Icon';

// no animation here !

export default class FormPicture extends PureComponent {

  static propTypes = {
    disabled: React.PropTypes.bool,
    emptyStatePictureURI: React.PropTypes.string,
    getPictureURIFromValue: React.PropTypes.func.isRequired,
    onError: React.PropTypes.func.isRequired,
    transform: React.PropTypes.func.isRequired,
    validation: React.PropTypes.func
  };

  static defaultProps = {
    transform: (uri) => new Promise((resolve, reject) =>
      setTimeout(() => reject('No transform specified'), 2000)
    )
  }

  state = {};

  setInError() {
    this.setState({error: true});
  }

  getValue() {
    return this.state.value;
  }
  setValue(value) {
    this.setState({
      value,
      pictureURI: value ? this.props.getPictureURIFromValue(value) : null
    });
  }

  isValide() {
    return this.props.validation(this.getValue());
  }

  clear() {
    this.setState({
      value: null,
      pictureURI: null
    });
  }

  render() {
    var pictureURI = this.state.pictureURI || this.props.emptyStatePictureURI;

    return (<View>
      <CustomTouchableOpacity
        disabled={this.props.disabled}
        onPress={() => {
          ImagePicker.showImagePicker({
            noData: true,
            allowsEditing: true
          }, response => {
            if (response.error)
              this.props.onError(response.error);
            if (response.uri) {
              this.setState({
                transforming: true,
                pictureURI: response.uri
              });
              this.props.transform(response.uri, _.pick(response, ['height', 'width']))
                .then(
                  (value) =>
                    this.setState({
                      value
                    }, () => {
                      this.setState({
                        error: !this.isValide(),
                        transforming: false
                      });
                    }),
                  (e) => {
                    this.setState({
                      transforming: false,
                      pictureURI: null
                    });
                    this.props.onError(e);
                  }
                );
            }
          });
        }}
        style={{
          height: SCALE.h(150),
          width: SCALE.h(150),
          borderRadius: SCALE.h(150) / 2,
          backgroundColor: COLORS.WHITE,

          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',

          borderWidth: this.state.error ? 1 : 0,
          borderColor: COLORS.RED,
          position: 'relative'
        }}
      >
        {!pictureURI ?
          <Icon
            color={COLORS.DARK}
            name="camera"
            size={SCALE.h(65)}
          />
        :
          <Image
            source={{uri: pictureURI}}
            style={{
              height: SCALE.h(150),
              width: SCALE.h(150)
            }}
          />
        }
        {this.state.transforming && <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: COLORS.WHITE,
            opacity: 0.5,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Spinner
            color={COLORS.DARK}
            size={SCALE.h(40)}
            type="FadingCircleAlt"
          />
        </View>}
      </CustomTouchableOpacity>
    </View>);
  }
};
