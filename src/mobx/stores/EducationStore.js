import {observable, computed, action} from 'mobx';
import {_, v4, Text} from 'Hairfolio/src/helpers';

import {EMPTY, LOADING, LOADING_ERROR, READY} from '../../constants';
import ServiceBackend from 'backend/ServiceBackend.js'
import { environment } from '../../selectors/environment';

class EducationStore {

}

export default new EducationStore();
