import Model, { attr } from '@ember-data/model';
import { reads } from '@ember/object/computed';

export default Model.extend({
  type: attr('string'),
  pluginTypeName: attr('string'),
  pluginCategoryName: attr('string'),
  labels: attr(),
  notification: attr('string'),
  status: attr('string'),
  sponsorName: reads('labels.sponsor_name'),
  sponsorUrl: reads('labels.sponsor_url'),
});
