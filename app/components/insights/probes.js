import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';

const PROBE_FILTER_LABELS = {
  'active': 'Active Probes',
  'all': 'All Probes',
  'inactive': 'Inactive Probes'
};

export default Component.extend({
  store: service(),
  accounts: service(),

  owner: reads('accounts.user'),

  probeFilterLabel: 'Active Probes',
  probeFilter: 'active',

  showProbesModal: false,
  probeType: 'normal',

  lastScanEndedAt: 'e',

  probes: reads('owner.insightsProbes'),

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

    reloadProbes() {
      this.probes.reload();
    },

    setFilter(filter, dropdown) {
      dropdown.actions.close();
      this.set('probeFilter', filter);
      this.set('probeFilterLabel', PROBE_FILTER_LABELS[filter]);
    }
  }
});
