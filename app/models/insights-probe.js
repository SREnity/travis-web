import Model, { attr } from '@ember-data/model';
import { reads } from '@ember/object/computed';

export default Model.extend({
  type: attr('string'),
  pluginType: attr('string'),
  pluginTypeName: attr('string'),
  pluginCategory: attr('string'),
  labels: attr(),
  notification: attr('string'),
  status: attr('string'),
  sponsorName: reads('labels.sponsor_name'),
  sponsorUrl: reads('labels.sponsor_url'),

  testTemplateId: attr(),
  description: attr(),
  test: attr(),
  descriptionLink: attr(),
  tagList: attr(),
  securityArchitectureWeight: attr(),
  costArchitecture_weight: attr(),
  deliveryArchitectureWeight: attr(),
  securityMaintenanceWeight: attr(),
  costMaintenanceWeight: attr(),
  deliveryMaintenanceWeight: attr(),
  securitySupportWeight: attr(),
  costSupportWeight: attr(),
  deliverySupportWeight: attr(),
});
