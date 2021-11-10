import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { map, gt } from '@ember/object/computed';

export default Component.extend({
  store: service(),

  showNotificationModal: false,

  isAllSelected: false,
  allowToggle: gt('selectedNotificationIds.length', 0),
  selectedNotificationIds: [],
  selectableNotificationIds: map('notifications', (notification) => notification.id),

  actions: {
    openModal(notification) {
      this.set('selectedNotification', notification);
      this.set('showNotificationModal', true);
    },

    reloadNotifications() {
      this.notifications.reload();
    },

    toggleNotification(notificationId) {
      const { selectedNotificationIds } = this;
      const isSelected = selectedNotificationIds.includes(notificationId);

      if (isSelected) {
        selectedNotificationIds.removeObject(notificationId);
      } else {
        selectedNotificationIds.addObject(notificationId);
      }
    },

    toggleAll() {
      const { isAllSelected, selectableNotificationIds, selectedNotificationIds } = this;

      if (isAllSelected) {
        this.set('isAllSelected', false);
        selectedNotificationIds.removeObjects(selectableNotificationIds.toArray());
      } else {
        this.set('isAllSelected', true);
        selectedNotificationIds.addObjects(selectableNotificationIds.toArray());
      }
    }
  }
});
