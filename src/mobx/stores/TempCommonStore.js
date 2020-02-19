import { observable } from "../../helpers";

class TempCommonStore {
  @observable actualServerProducts = [];
}
const store = new TempCommonStore();
export default store;