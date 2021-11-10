import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';

const PLUGINS_FILTER_LABELS = {
  'active': 'Active Plugins',
  'all': 'All Plugins',
  'inactive': 'Inactive Plugins'
};

export default Component.extend({
  store: service(),
  accounts: service(),

  owner: reads('accounts.user'),

  showPluginsModal: false,
  pluginsFilterLabel: 'Active Plugins',
  pluginsFilter: 'active',
  lastScanEndedAt: 'e',

  plugins: reads('owner.insightsPlugins'),

  actions: {
    reloadPlugins() {
      this.plugins.reload();
    },

    setFilter(filter, dropdown) {
      dropdown.actions.close();
      this.set('pluginsFilter', filter);
      this.set('pluginsFilterLabel', PLUGINS_FILTER_LABELS[filter]);
    }
  }
});
