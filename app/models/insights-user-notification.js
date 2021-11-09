import Model, { attr } from '@ember-data/model';
import { computed } from '@ember/object';

export default Model.extend({
  type: attr('string'),
  pluginName: attr('string'),
  pluginType: attr('string'),
  pluginCategory: attr('string'),
  message: attr('string'),
  activeStatus: attr('string'),
  weight: attr('number'),

  weightClass: computed('weight', function () {
    if (this.weight < 1.75) {
      return 'ok';
    } else if (this.weight < 2.75) {
      return 'warning';
    } else {
      return 'critical';
    }
  })
});
