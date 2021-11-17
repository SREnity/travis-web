import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { reads } from '@ember/object/computed';

import config from 'travis/config/environment';

const { newInsights } = config;

export default Component.extend({
  api: service(),
  accounts: service(),
  store: service(),
  flashes: service(),

  owner: reads('accounts.user'),

  init() {
    this._super(...arguments);

    this.set('plugins', this.owner.insightsPlugins);
  },

  probeQueryEditorModal: false,
  showHelpLinkInput: false,
  plugins: null,
  selectedPlugin: null,
  pluginCategory: null,

  notification: '',
  description: '',
  query: '',
  overlayType: '',
  overlayLabelsName: '',
  overlaysLabelsUrl: '',
  tags: '',
  furtherReadingLink: '',
  sponsorName: '',
  sponsorUrl: '',

  pluginOptions: computed('plugins.@each', function () {
    const options = this.plugins.map((plugin) => (
      { id: newInsights.pluginTypes.find(type => (type.name === plugin.pluginType)).id, name: plugin.pluginType }
    ));
    return [...new Map(options.map(item => [item.name, item])).values()];
  }),
  probeOptions: null,
  selectedProbe: null,

  save: task(function* () {
    try {
      yield this.store.createRecord('insights-probe', {
        testTemplateId: this.selectedProbe ? this.selectedProbe.id : null,
        type: this.probeType,
        notification: this.notification,
        description: this.description,
        test: this.query,
        pluginType: this.selectedPlugin.id,
        labels: {
          sponsor_name: this.sponsorName,
          sponsor_url: this.sponsorUrl
        },
        descriptionLink: this.furtherReadingLink,
        tagList: this.tags,
        securityArchitecture_weight: 0,
        costArchitecture_weight: 0,
        deliveryArchitectureWeight: 0,
        securityMaintenanceWeight: 0,
        costMaintenanceWeight: 0,
        deliveryMaintenanceWeight: 0,
        securitySupportWeight: 0,
        costSupportWeight: 0,
        deliverySupportWeight: 0,
      }).save();
      this.reloadProbes();
      this.onClose();
      this.flashes.success('Probe Template saved successfully.');
    } catch (error) {
      this.onClose();
      this.flashes.error('Probe Template save failed.');
    }
  }).drop(),

  actions: {
    async getProbeOptions(option) {
      this.set('selectedPlugin', option);
      const response = await this.api.get('/insights_plugins/template_plugin_tests',
        {
          data: {
            plugin_type: this.selectedPlugin.id
          }
        }
      );
      this.set('pluginCategory', response['plugin_category']);
      this.set('probeOptions', response['test_templates']);
    }
  }
});
