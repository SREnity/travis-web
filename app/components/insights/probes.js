import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  store: service(),

  init() {
    this._super(...arguments);

    this.fetchProbes.perform();
  },

  showProbesModal: false,
  probeType: 'normal',

  lastScanEndedAt: 'e',

  probes: [],
  fetchProbes: task(function* () {
    this.set('probes', yield this.store.findAll('insights-test-template') || []);
  }),

  actions: {
    openNormalProbeModal(dropdown) {
      dropdown.actions.close();
      this.set('probeType', 'normal');
      this.set('showProbesModal', true);
    },

    openCustomProbeModal(dropdown) {
      dropdown.actions.close();
      this.set('probeType', 'custom');
      this.set('showProbesModal', true);
    },
  }
});
