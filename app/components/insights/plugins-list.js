import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  flashes: service(),
  accounts: service(),

  account: null,
  subscription: null,

  plugins: [
    { name: 'crap', scanStatus: 'Success' },
    { name: 'crap' },
    { name: 'crap' },
    { name: 'crap' },
  ]
});
