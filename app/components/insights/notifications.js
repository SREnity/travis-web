import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';

const NOTIFICATIONS_FILTER_LABELS = {
  'active': 'Active Notifications',
  'all': 'All Notifications',
  'snooze': 'Snoozed Notifications'
};

export default Component.extend({
  store: service(),
  accounts: service(),

  owner: reads('accounts.user'),

  notificationFilterLabel: 'Active Notifications',
  notificationFilter: 'active',
  lastScanEndedAt: 'e',

  notifications: reads('owner.insightsNotifications'),

  actions: {
    reloadNotifications() {
      this.notifications.reload();
    },

    setFilter(filter, dropdown) {
      dropdown.actions.close();
      this.set('notificationFilter', filter);
      this.set('notificationFilterLabel', NOTIFICATIONS_FILTER_LABELS[filter]);
    }
  }
});
