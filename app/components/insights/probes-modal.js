import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  api: service(),

  account: null,
  subscription: null,

  probeQueryEditorModal: false,

  notification: '',
  description: '',
  query: '',
  overlayType: '',
  overlayLabelsName: '',
  overlaysLabelsUrl: '',
  tags: '',
  furtherReadingLink: '',

  save: task(function* () {
    try {
      yield this.store.createRecord('insights-test-template', {
        notification: this.notification,
        description: this.description,
        query: this.query,
        pluginType: this.selectedPlugin.id
      }).save();
    } catch (error) {
      this.onClose();
      this.flashes.error('Probe Template save failed.');
    }
  }).drop(),
});
