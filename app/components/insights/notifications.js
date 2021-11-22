import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import { computed } from '@ember/object';

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
    setFilter(filter, dropdown) {
      dropdown.actions.close();
      this.set('notificationFilter', filter);
      this.set('notificationFilterLabel', NOTIFICATIONS_FILTER_LABELS[filter]);
      if (filter === 'active') {
        this.notifications.applyCustomOptions({ active: false });
      } else if (filter === 'snooze') {
        this.notifications.applyCustomOptions({ active: true });
      } else {
        this.notifications.applyCustomOptions({ active: undefined });
      }
    }
  },

  notificationCount: computed('notifications', function () {
    let count = {
      'info': 0,
      'low': 0,
      'med': 0,
      'high': 0,
      'total': 0
    };

    this.notifications.forEach(notification => {
      if (notification.weight === 0) {
        count.info++;
      } else if (notification.weight < 1.75) {
        count.low++;
      } else if (notification.weight < 2.75) {
        count.med++;
      } else {
        count.high++;
      }
      count.total++;
    });

    return count;
  }),
});
