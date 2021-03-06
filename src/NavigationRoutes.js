import React, { Component } from 'react';
import { View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Icon from './components/Icon';
import { COLORS } from './style';
import Login from './containers/Login';
import Register from './containers/Register';
import LoginEmail from './containers/LoginEmail';
import Register2 from './containers/Register2';
import BasicInfo from './containers/BasicInfo';
import LoginOAuth from './containers/LoginOAuth';
import StylistInfo from './containers/StylistInfo';
import StylistEducation from './containers/StylistEducation';
import StylistCertificates from './containers/StylistCertificates';
import StylistPlaceOfWork from './containers/StylistPlaceOfWork';
import StylistProductExperience from './containers/StylistProductExperience';
import SalonAddSP from './containers/SalonAddSP';
import SalonSP from './containers/SalonSP';
import StylistAddEducation from './containers/StylistAddEducation';
import SalonInfo from './containers/SalonInfo';
import BrandInfo from './containers/BrandInfo';
import Feed from './containers/Feed';
import Search from './containers/Search';
import Favourites from './containers/Favourites';
import Profile from './containers/Profile';
import Messages from './containers/Messages';
import WriteMessage from './containers/WriteMessage';
import MessageDetails from './containers/MessageDetails';
import PostDetails from './containers/PostDetails';
import SearchDetails from './containers/SearchDetails';
import TagPosts from './containers/TagPosts';
import HairfolioPosts from './containers/HairfolioPosts';
import Comments from './containers/Comments';
import StarGivers from './containers/StarGivers';
import BlackBook from './containers/BlackBook';
import ContactDetails from './containers/ContactDetails';
import CreatePost from './containers/CreatePost';
import Gallery from './containers/GalleryPage';
import Share from './containers/Share';
import AddBlackBook from './containers/AddBlackBook';
import AlbumPage from './containers/AlbumPage';
import PostFilter from './containers/PostFilter';
import FilterPage from './containers/FilterPage';
import AddServicePageOne from './containers/AddServicePageOne';
import AddServicePageTwo from './containers/AddServicePageTwo';
import AddServicePageThree from './containers/AddServicePageThree';
import AddLink from './containers/AddLink';
import ForgotPassword from './containers/ForgottenPassword';
import EditCustomer from './containers/EditCustomer';
import EditCustomerAddress from './containers/EditCustomerAddress';
import ChangePassword from './containers/ChangePassword';
import SalonStylists from './containers/SalonStylists';

export const registerScreens = ()  => {
  Navigation.registerComponent('hairfolio.Register', () => Register);
  Navigation.registerComponent('hairfolio.Login', () => Login);
  Navigation.registerComponent('hairfolio.LoginEmail', () => LoginEmail);
  Navigation.registerComponent('hairfolio.Register2', () => Register2);
  Navigation.registerComponent('hairfolio.BasicInfo', () => BasicInfo);
  Navigation.registerComponent('hairfolio.LoginOAuth', () => LoginOAuth);
  Navigation.registerComponent('hairfolio.StylistInfo', () => StylistInfo);
  Navigation.registerComponent('hairfolio.StylistEducation', () => StylistEducation);
  Navigation.registerComponent('hairfolio.StylistCertificates', () => StylistCertificates);
  Navigation.registerComponent('hairfolio.StylistPlaceOfWork', () => StylistPlaceOfWork);
  Navigation.registerComponent('hairfolio.StylistProductExperience', () => StylistProductExperience);
  Navigation.registerComponent('hairfolio.SalonAddSP', () => SalonAddSP);
  Navigation.registerComponent('hairfolio.SalonSP', () => SalonSP);
  Navigation.registerComponent('hairfolio.StylistAddEducation', () => StylistAddEducation);
  Navigation.registerComponent('hairfolio.SalonInfo', () => SalonInfo);
  Navigation.registerComponent('hairfolio.BrandInfo', () => BrandInfo);
  Navigation.registerComponent('hairfolio.Feed', () => Feed);
  Navigation.registerComponent('hairfolio.Search', () => Search);
  Navigation.registerComponent('hairfolio.Favourites', () => Favourites);
  Navigation.registerComponent('hairfolio.Profile', () => Profile);
  Navigation.registerComponent('hairfolio.Messages', () => Messages);
  Navigation.registerComponent('hairfolio.WriteMessage', () => WriteMessage);
  Navigation.registerComponent('hairfolio.MessageDetails', () => MessageDetails);
  Navigation.registerComponent('hairfolio.PostDetails', () => PostDetails);
  Navigation.registerComponent('hairfolio.SearchDetails', () => SearchDetails);
  Navigation.registerComponent('hairfolio.TagPosts', () => TagPosts);
  Navigation.registerComponent('hairfolio.Comments', () => Comments);
  Navigation.registerComponent('hairfolio.StarGivers', () => StarGivers);
  Navigation.registerComponent('hairfolio.HairfolioPosts', () => HairfolioPosts);
  Navigation.registerComponent('hairfolio.BlackBook', () => BlackBook);
  Navigation.registerComponent('hairfolio.ContactDetails', () => ContactDetails);
  Navigation.registerComponent('hairfolio.CreatePost', () => CreatePost);
  Navigation.registerComponent('hairfolio.Gallery', () => Gallery);
  Navigation.registerComponent('hairfolio.Share', () => Share);
  Navigation.registerComponent('hairfolio.AlbumPage', () => AlbumPage);
  Navigation.registerComponent('hairfolio.PostFilter', () => PostFilter);
  Navigation.registerComponent('hairfolio.FilterPage', () => FilterPage);
  Navigation.registerComponent('hairfolio.AddServicePageOne', () => AddServicePageOne);
  Navigation.registerComponent('hairfolio.AddServicePageTwo', () => AddServicePageTwo);
  Navigation.registerComponent('hairfolio.AddServicePageThree', () => AddServicePageThree);
  Navigation.registerComponent('hairfolio.AddLink', () => AddLink);
  Navigation.registerComponent('hairfolio.ForgotPassword', () => ForgotPassword);
  Navigation.registerComponent('hairfolio.EditCustomer', () => EditCustomer);
  Navigation.registerComponent('hairfolio.EditCustomerAddress', () => EditCustomerAddress);
  Navigation.registerComponent('hairfolio.ChangePassword', () => ChangePassword);
  Navigation.registerComponent('hairfolio.SalonStylists', () => SalonStylists);
  Navigation.registerComponent('hairfolio.AddBlackBook', () => AddBlackBook);
};

