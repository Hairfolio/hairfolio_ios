'use strict';
import _ from 'lodash';
import React, { PropTypes, Component } from 'React';
import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  PickerIOS
} from 'react-native';
import {COLORS, FONTS, SCALE} from '../../style';
import Icon from '../Icon';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';

import {
  windowWidth,
} from 'Hairfolio/src/helpers';

export default class Picker extends React.Component {
  static propTypes = {
    blocked: PropTypes.bool,
    choices: PropTypes.array.isRequired,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    validation: React.PropTypes.func,
    valueProperty: React.PropTypes.string.isRequired,
  };

  static defaultProps = {
    valueProperty: 'label'
  };

  state = {
    active: false
  };

  setInError() {
    this.setState({error: true});
  }

  getValue() {
    return _.get(this.props.choices, [this.state.selected, this.props.valueProperty]);
  }

  setValue(v) {
    this.setState({
      selected: _.indexOf(this.props.choices, _.find(this.props.choices, _.set({}, this.props.valueProperty, v)))
    });
  }

  isValide() {
    return this.props.validation(this.getValue());
  }

  clear() {
    this.setState({selected: null});
  }

  render() {
    return (<View>
      <TouchableOpacity
        disabled={this.props.disabled || this.props.blocked}
        onPress={() => {
          dismissKeyboard();
          this.setState({
            active: true,
            selected: _.isFinite(this.state.selected) ? this.state.selected : 0
          }, () => {
            if (this.state.error)
              this.setState({
                error: !this.isValide()
              });
          });
        }}
      >
        <View style={{
          backgroundColor: this.props.blocked ? 'rgba(0, 0, 0, 0.1)' : 'white',
          height: SCALE.h(80),
          flexDirection: 'row',
          borderRadius: 1
        }}>
          <View style={{
            flex: 1,
            alignItems: 'center',
            paddingLeft: SCALE.w(26),
            flexDirection: 'row'
          }}>
            <Text style={{
              fontFamily: FONTS.ROMAN,
              fontSize: SCALE.h(30),
              color: this.state.error ? COLORS.RED : (_.isFinite(this.state.selected) ? COLORS.DARK : COLORS.TEXT)
            }}>{_.get(this.props.choices, [this.state.selected, 'label'], this.props.placeholder)}</Text>
          </View>
          <View style={{
            width: SCALE.w(83),
            justifyContent: 'center',
            alignItems: 'center',
            borderLeftWidth: 1,
            borderLeftColor: COLORS.LIGHT,
            backgroundColor: this.props.blocked ? 'rgba(0, 0, 0, 0)' : 'white'
          }}>
            <Icon
              color={this.state.error ? COLORS.RED : COLORS.DARK}
              name="down"
              size={SCALE.h(10)}
            />
          </View>
        </View>
      </TouchableOpacity>
      <Modal
        animationType={"slide"}
        transparent
        visible={this.state.active}
      >
        <View style={{flex: 1}}>
          <TouchableOpacity
            onPress={() => this.setState({active: false})}
            style={{flex: 1}}
          />
          <View style={{
            height: SCALE.h(86),
            backgroundColor: COLORS.WHITE,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.LIGHT2,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center'
          }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({active: false});
              }}
            >
              <Text style={{
                fontFamily: FONTS.ROMAN,
                fontSize: SCALE.h(34),
                color: COLORS.DARK,
                marginRight: SCALE.w(40)
              }}>
                Done
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{
            height: SCALE.h(353),
            backgroundColor: COLORS.WHITE,
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <PickerIOS
              itemStyle={{
                fontFamily: FONTS.MEDIUM,
                color: COLORS.DARK
              }}
              onValueChange={(selected) => {
                this.props.onValueChange(selected);
                this.setState({selected}, () => {
                  if (this.state.error)
                    this.setState({
                      error: !this.isValide()
                    });
                });
              }}
              selectedValue={this.state.selected}
              style={{
                width: windowWidth
              }}
            >
              {_.map(this.props.choices, ({label, value}, i) =>
                <PickerIOS.Item
                  key={i}
                  label={label}
                  value={i}
                />
              )}
            </PickerIOS>
          </View>
        </View>
      </Modal>
    </View>);
  }
}
