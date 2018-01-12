import { AsyncStorage } from 'react-native';
import { create } from 'mobx-persist';

export default create({ storage: AsyncStorage });

