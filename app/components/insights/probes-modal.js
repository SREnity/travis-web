import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  flashes: service(),
  accounts: service(),

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
  furtherReadingLink: ''
});
