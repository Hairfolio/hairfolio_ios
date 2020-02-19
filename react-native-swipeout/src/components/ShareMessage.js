import { observer, React, View } from 'Hairfolio/src/helpers';
import ShareStore from '../mobx/stores/ShareStore';
import LoadingPage from './LoadingPage';
import { SelectPeople } from './SelectPeople';
import { COLORS } from '../style';

const ShareMessage = observer(() => {

  let store = ShareStore.sendStore;

  let Content = LoadingPage(
    SelectPeople,
    store
  );

  return (
    <View style={{flex: 1, backgroundColor: COLORS.WHITE5}}>
      {/* <ToInput store={store} /> */}
      <Content />
    </View>
  );
});

export default ShareMessage;
