import {
  observable,
  computed
} from "mobx";
import {
  ListView
} from "react-native";
import ServiceBackend from "../../../backend/ServiceBackend";
import { showLog } from "../../../helpers";

class NotificationsStore {
  @observable notification = [];
  @observable isLoading = false;
  @observable nextPage;

  constructor() {
    this.notification = [];
    this.isLoadingNextPage = false;
  }

  @computed get dataSource() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    return ds.cloneWithRows(this.notification.slice());
  }

  async load(initData) {
    this.isLoading = true;
    this.initData = initData;

    this.notification = [];
    this.nextPage = 1;

    await this.loadNextPage();

    this.isLoading = false;
  }

  async loadNextPage() {
    if (!this.isLoadingNextPage && this.nextPage != null) {
      this.isLoadingNextPage = true;
      let res = await this.getNotification(this.nextPage);

      let {
        push_notifications,
        meta
      } = res;
      if (push_notifications) {
        this.nextPage = meta.next_page;
        this.isLoadingNextPage = false;
        for (let a = 0; a < push_notifications.length; a++) {
          this.notification.push(push_notifications[a]);
        }
       
      } else {
        this.isLoadingNextPage = false;
        throw res.errors;
      }
    }
  }

  async getNotification(pageNumber) {
    let res = await ServiceBackend.get(`push_notifications?page=${pageNumber}`);
    if (res) {
      showLog("getNotificationList ==>" + JSON.stringify(res));
      return res;
    } else {
      return null;
    }
  }

  async resetNotificationBadgeCount() {
    let res = await ServiceBackend.post('push_notifications/reset_badge_count',null);
    if(res) {
      return res;
    } else {
      return null;
    }
  }
}

const store = new NotificationsStore();

export default store;