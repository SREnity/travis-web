import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  store: service(),

  init() {
    this._super(...arguments);

    this.fetchPlugins.perform();
  },

  showPluginsModal: false,

  lastScanEndedAt: 'e',

  plugins: [],
  fetchPlugins: task(function* () {
    this.set('plugins', yield this.store.findAll('insights-plugin') || []);
  })
});
