global.fetch = require('jest-fetch-mock');
require('react-native-mock/mock');
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-15.4';
import NativeModules from 'react-native';

Enzyme.configure({ adapter: new Adapter() });
