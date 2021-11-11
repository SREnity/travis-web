import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { map, gt } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  store: service(),
  flashes: service(),
  api: service(),

  showNotificationModal: false,

  isAllSelected: false,
  allowToggle: gt('selectedNotificationIds.length', 0),
  selectedNotificationIds: [],
  selectableNotificationIds: map('notifications', (notification) => notification.id),

  toggleNoifications: task(function* () {
    const self = this;

    try {
      yield this.api.patch('/insights_notifications/toggle_snooze',  {
        data: {
          notification_ids: this.selectedNotificationIds
        }
      }).then(() => {
        self.notifications.reload();
        self.set('selectedNotificationIds', []);
        self.set('isAllSelected', false);
      });
    } catch (e) {
      this.flashes.error('There was an error toggling notifications. Please try again.');
    }
  }),

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
