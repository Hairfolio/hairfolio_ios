import React from 'react';
import _ from 'lodash';
import { observer } from 'mobx-react';
import PureComponent from '../components/PureComponent';
import Communications from 'react-native-communications';
import {View, Text} from 'react-native';
import {autobind} from 'core-decorators';
import {Map, OrderedMap} from 'immutable';
import {COLORS, FONTS, SCALE} from '../style';
import SearchList from '../components/SearchList';
import LoadingContainer from '../components/LoadingContainer';
import Contacts from 'react-native-contacts';
import utils from '../utils';
import {READY, LOADING, LOADING_ERROR} from '../constants';
import whiteBack from '../../resources/img/nav_white_back.png';

@observer
export default class SalonStylist extends PureComponent {
  state = {};
  constructor(props) {
    super(props);
    this.onWillFocus();
    if (this.props.navigator) {
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }
  }

  static navigatorButtons = {
    leftButtons: [
      {
        id: 'back',
        icon: whiteBack,
      }
    ],
    rightButtons: [
      {
        id: 'invite',
        title: 'Invite',
        buttonFontSize: SCALE.h(30),
        buttonColor: COLORS.WHITE,
      }
    ]
  };

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'back') {
        this.props.navigator.pop({
          animated: true,
        });
      } else if (event.id == 'Invite') {
        this._invite();
      }
    }
  }

  loadContacts() {
    Contacts.getAll((err, contacts) => {
      if (err)
        return this.loadContactsError();
      this.setState({
        contactsStates: READY,
        contacts: new OrderedMap(
          _.filter(contacts, contact => contact.emailAddresses.length)
            .map(contact =>
              [contact.recordID, new Map({
                id: contact.recordID,
                name: contact.givenName,
                email: _.first(contact.emailAddresses).email
              })])
        )
      });
    });
  }

  loadContactsError() {
    this.setState({contactsStates: LOADING_ERROR});
  }

  _invite = () => {
    var contacts = this._searchList.getValue();
    if (!contacts.length)
      return;
    Communications.email(
      null,
      [],
      _.map(
        this.state.contacts.filter(contact => contacts.indexOf(contact.get('id')) !== -1).toJS(),
        'email'
      ),
      'I\’d like to add you on Hairfolio',
      `
I’d like to add you as a stylist
https://hairfolio.com/diverseawarenes

-----
Don’t have Hairfolio?
Get it from the App Store:
https://itunes.apple.com/us/app/hairfolio/id672…
      `
    );
  }

  @autobind
  onWillFocus() {
    if (utils.isReady(this.state.contactsStates) || utils.isLoading(this.state.contactsStates))
      return;

    this.setState({
      contactsStates: LOADING
    });

    Contacts.checkPermission((err, permission) => {
      if (err)
        return this.loadContactsError();

      if (permission === Contacts.PERMISSION_UNDEFINED)
        Contacts.requestPermission((err, permission) => {
          if (err)
            return this.loadContactsError();
          this.loadContacts();
        });

      if (permission === Contacts.PERMISSION_AUTHORIZED)
        this.loadContacts();

      if (permission === Contacts.PERMISSION_DENIED)
        this.loadContactsError();
    });
  }

  render() {
    return (
      <LoadingContainer state={[this.state.contactsStates]}>
        {() => this.state.contacts.count() ?
          <SearchList
            items={this.state.contacts}
            placeholder="Search for Stylists"
            ref={sL => this._searchList = sL}
            style={{
              flex: 1,
              backgroundColor: COLORS.LIGHT,
            }}
          />
        :
          <Text>No email contact on this phone</Text>
        }
      </LoadingContainer>
    );
  }
};
