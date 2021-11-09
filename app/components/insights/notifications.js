import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  store: service(),

  init() {
    this._super(...arguments);

    this.fetchNotifications.perform();
  },

  notifications: [],
  lastScanEndedAt: 'e',

  fetchNotifications: task(function* () {
    this.set('notifications', yield this.store.findAll('insights-notification') || []);
  })
});
